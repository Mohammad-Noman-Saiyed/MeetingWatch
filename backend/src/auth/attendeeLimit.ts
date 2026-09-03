import { Request, Response, NextFunction } from "express";
import { pool } from "../db";

const FREE_ATTENDEE_LIMIT = 3;

export async function checkAttendeeLimit(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Not Logged In" });
  }

  const { attendeeIds } = req.body;

  if (!attendeeIds || attendeeIds.length <= FREE_ATTENDEE_LIMIT) {
    return next();
  }

  const userResult = await pool.query(
    "SELECT is_premium FROM users WHERE id = $1",
    [userId],
  );

  const user = userResult.rows[0];

  if (user && user.is_premium) {
    return next();
  }

  return res.status(403).json({
    error:
      "Free plan allows up to 3 attendees per meeting. Upgrade to Premium for unlimited attendees.",
  });
}
