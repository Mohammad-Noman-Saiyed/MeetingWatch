import crypto from "crypto";
import { pool } from "../db";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function createSession(userId: number): Promise<string> {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await pool.query(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)",
    [sessionId, userId, expiresAt],
  );

  return sessionId;
}

export async function getUserIdFromSession(
  sessionId: string,
): Promise<number | null> {
  const result = await pool.query(
    "SELECT user_id, expires_at FROM sessions WHERE id = $1",
    [sessionId],
  );

  if (result.rows.length === 0) return null;

  const session = result.rows[0];
  if (new Date(session.expires_at) < new Date()) {
    await pool.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
    return null;
  }

  return session.user_id;
}
