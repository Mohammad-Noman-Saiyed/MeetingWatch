import { Router, Request, Response } from "express";
import { pool } from "../db";
import { requireAuth } from "../auth/middleware";
import { genAI } from "../ai/gemini";

const router = Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT id, title, meeting_date, duration_minutes, status FROM meetings WHERE user_id = $1 ORDER BY meeting_date DESC",
    [req.userId],
  );

  res.json(result.rows);
});

router.post("/", requireAuth, async (req: Request, res: Response) => {
  const {
    title,
    meetingDate,
    durationMinutes,
    notes,
    overallRating,
    engagementScore,
    couldBeEmail,
  } = req.body;

  if (!title || !meetingDate) {
    return res
      .status(400)
      .json({ error: "Title and meeting date are required" });
  }

  const result = await pool.query(
    `INSERT INTO meetings (user_id, title, meeting_date, duration_minutes, notes, overall_rating, engagement_score, could_be_email)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, title, meeting_date, duration_minutes, status, overall_rating, engagement_score, could_be_email`,
    [
      req.userId,
      title,
      meetingDate,
      durationMinutes || null,
      notes || null,
      overallRating || null,
      engagementScore || null,
      couldBeEmail || false,
    ],
  );

  res.status(201).json(result.rows[0]);
});

router.get("/trends", requireAuth, async (req: Request, res: Response) => {
  const { period, metric } = req.query;

  const validPeriods: Record<string, string> = {
    weekly: "week",
    monthly: "month",
    annually: "year",
  };
  const validMetrics: Record<string, string> = {
    count: "COUNT(*)",
    rating: "AVG(overall_rating)",
    engagement: "AVG(engagement_score)",
    length: "AVG(duration_minutes)",
  };

  const periodKey = validPeriods[period as string];
  const metricExpr = validMetrics[metric as string];

  if (!periodKey || !metricExpr) {
    return res.status(400).json({ error: "Invalid period or metric" });
  }

  const result = await pool.query(
    `SELECT DATE_TRUNC('${periodKey}', meeting_date) AS period, ${metricExpr} AS value
     FROM meetings
     WHERE user_id = $1
     GROUP BY period
     ORDER BY period ASC`,
    [req.userId],
  );

  res.json(result.rows);
});

router.post("/:id/advice", requireAuth, async (req: Request, res: Response) => {
  const meetingId = req.params.id;

  const meetingResult = await pool.query(
    `SELECT title, meeting_date, duration_minutes, overall_rating, engagement_score, could_be_email, notes
     FROM meetings WHERE id = $1 AND user_id = $2`,
    [meetingId, req.userId],
  );

  if (meetingResult.rows.length === 0) {
    return res.status(404).json({ error: "Meeting not found" });
  }

  const meeting = meetingResult.rows[0];

  const prompt = `You are a meeting-productivity advisor. Give brief, actionable advice (3-4 sentences) for this meeting:
Title: ${meeting.title}
Duration: ${meeting.duration_minutes ?? "unknown"} minutes
Overall rating (1-5): ${meeting.overall_rating ?? "not rated"}
Engagement score (1-10): ${meeting.engagement_score ?? "not rated"}
Could this have been an email instead: ${meeting.could_be_email ? "yes" : "no"}
Notes: ${meeting.notes ?? "none"}`;

  const aiResponse = await genAI.models.generateContent({
    model: "gemini-3.7-flash",
    contents: prompt,
  });

  const adviceText = aiResponse.text;

  await pool.query(
    `UPDATE meetings SET ai_advice = $1 WHERE id = $2 AND user_id = $3`,
    [adviceText, meetingId, req.userId],
  );

  res.status(200).json({ advice: adviceText });
});

router.get(
  "/advice-summary",
  requireAuth,
  async (req: Request, res: Response) => {
    const { period } = req.query;

    const validPeriods: Record<string, string> = {
      weekly: "week",
      monthly: "month",
      annually: "year",
    };
    const periodKey = validPeriods[period as string];

    if (!periodKey) {
      return res.status(400).json({ error: "Invalid period" });
    }

    const result = await pool.query(
      `SELECT
       COUNT(*) AS meeting_count,
       AVG(overall_rating) AS avg_rating,
       AVG(engagement_score) AS avg_engagement,
       AVG(duration_minutes) AS avg_length,
       COUNT(*) FILTER (WHERE could_be_email = true) AS email_count
     FROM meetings
     WHERE user_id = $1 AND meeting_date >= DATE_TRUNC('${periodKey}', NOW())`,
      [req.userId],
    );

    const stats = result.rows[0];

    if (Number(stats.meeting_count) === 0) {
      return res.json({ advice: `No meetings logged this ${period} yet.` });
    }

    const prompt = `You are a meeting-productivity advisor. Based on this ${period} summary, give actionable advice. You MUST format your response EXACTLY with these four headings, providing 3-5 sentences for each category (THIS IS STRICT!). Do not add any introduction or conclusion paragraphs. No extra fluff apart from what you're told.

    Productivity/engagement:
    Meeting length:
    Meeting cost:
    Overall rating:

    Data:
    Number of meetings: ${stats.meeting_count}
    Average rating (1-5): ${stats.avg_rating ?? "not rated"}
    Average engagement (1-10): ${stats.avg_engagement ?? "not rated"}
    Average length (minutes): ${stats.avg_length ?? "unknown"}
    Meetings that could have been an email: ${stats.email_count}`;

    const aiResponse = await genAI.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    res.json({ advice: aiResponse.text });
  },
);

router.post("/start", requireAuth, async (req: Request, res: Response) => {
  const { title, attendeeIds } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const meetingResult = await pool.query(
    `INSERT INTO meetings (user_id, title, meeting_date, status, started_at)
     VALUES ($1, $2, NOW(), 'in_progress', NOW())
     RETURNING id, title, started_at, status`,
    [req.userId, title],
  );

  const meeting = meetingResult.rows[0];

  if (attendeeIds && attendeeIds.length > 0) {
    const employeesResult = await pool.query(
      `SELECT id, name, wage_amount, wage_type FROM employees WHERE user_id = $1 AND id = ANY($2::int[])`,
      [req.userId, attendeeIds],
    );

    for (const employee of employeesResult.rows) {
      await pool.query(
        `INSERT INTO meeting_attendees (meeting_id, employee_id, name, wage_amount, wage_type)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          meeting.id,
          employee.id,
          employee.name,
          employee.wage_amount,
          employee.wage_type,
        ],
      );
    }
  }

  res.status(201).json(meeting);
});

router.post("/:id/end", requireAuth, async (req: Request, res: Response) => {
  const meetingId = req.params.id;
  const { notes, overallRating, engagementScore, couldBeEmail } = req.body;

  const meetingCheck = await pool.query(
    `SELECT started_at FROM meetings WHERE id = $1 AND user_id = $2 AND status = 'in_progress'`,
    [meetingId, req.userId],
  );

  if (meetingCheck.rows.length === 0) {
    return res.status(404).json({ error: "In-progress meeting not found" });
  }

  const startedAt = meetingCheck.rows[0].started_at;

  const attendeesResult = await pool.query(
    `SELECT wage_amount, wage_type FROM meeting_attendees WHERE meeting_id = $1`,
    [meetingId],
  );

  const durationSeconds = (Date.now() - new Date(startedAt).getTime()) / 1000;
  const durationMinutes = Math.round(durationSeconds / 60);

  let costPerSecond = 0;
  for (const attendee of attendeesResult.rows) {
    const amount = Number(attendee.wage_amount);
    costPerSecond +=
      attendee.wage_type === "hourly" ? amount / 3600 : amount / (2080 * 3600);
  }
  const finalCost = costPerSecond * durationSeconds;

  const updateResult = await pool.query(
    `UPDATE meetings
     SET status = 'completed', ended_at = NOW(), duration_minutes = $1,
         notes = $2, overall_rating = $3, engagement_score = $4, could_be_email = $5
     WHERE id = $6 AND user_id = $7
     RETURNING title, meeting_date, duration_minutes, overall_rating, engagement_score, could_be_email, notes`,
    [
      durationMinutes,
      notes || null,
      overallRating || null,
      engagementScore || null,
      couldBeEmail || false,
      meetingId,
      req.userId,
    ],
  );

  const meeting = updateResult.rows[0];

  const prompt = `You are a meeting-productivity advisor. Give brief, actionable advice (3-4 sentences) for this meeting:
Title: ${meeting.title}
Duration: ${meeting.duration_minutes} minutes
Final cost: $${finalCost.toFixed(2)}
Overall rating (1-5): ${meeting.overall_rating ?? "not rated"}
Engagement score (1-10): ${meeting.engagement_score ?? "not rated"}
Could this have been an email instead: ${meeting.could_be_email ? "yes" : "no"}
Notes: ${meeting.notes ?? "none"}`;

  const aiResponse = await genAI.models.generateContent({
    model: "gemini-3.7-flash",
    contents: prompt,
  });

  const adviceText = aiResponse.text;

  await pool.query(`UPDATE meetings SET ai_advice = $1 WHERE id = $2`, [
    adviceText,
    meetingId,
  ]);

  res.status(200).json({
    ...meeting,
    finalCost: finalCost.toFixed(2),
    advice: adviceText,
  });
});

export default router;
