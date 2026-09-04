import { Request, Response, NextFunction } from "express";
import { pool } from "../db";

export async function checkMeetingLimit(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Not Logged In" });
  }

  const userResult = await pool.query(
    "SELECT is_premium FROM users WHERE id = $1",
    [userId],
  );

  const user = userResult.rows[0];

  if (user && user.is_premium) {
    return next();
  }

  const limitResult = await pool.query(
    `SELECT COUNT(*) FROM meetings WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '24 hours'`,
    [userId],
  );

  if (Number(limitResult.rows[0].count) >= 1) {
    return res.status(403).json({
      error:
        "Free plan allows 1 meeting per 24 hours. Upgrade to Premium for unlimited meetings.",
    });
  }
  next();
}
