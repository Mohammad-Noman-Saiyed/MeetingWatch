import { Router, Request, Response } from "express";
import { pool } from "../db";
import { hashPassword, verifyPassword } from "../auth/hash";
import { createSession } from "../auth/session";


const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  if (!email || !password || password.length < 8) {
    return res
      .status(400)
      .json({ error: "Invalid email or password (min 8 chars)" });
  }

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const passwordHash = await hashPassword(password);
  const result = await pool.query(
    "INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id",
    [email, passwordHash, firstName, lastName],
  );
  const userId = result.rows[0].id;

  const sessionId = await createSession(userId);
  res.cookie("session_id", sessionId, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ message: "Signed up successfully" });
});

router.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT id, password_hash FROM users WHERE email = $1",
    [email],
  );
  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const user = result.rows[0];
  const isValid = await verifyPassword(user.password_hash, password);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const sessionId = await createSession(user.id);
  res.cookie("session_id", sessionId, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Signed in successfully" });
});

router.post("/signout", async (req: Request, res: Response) => {
  const sessionId = req.cookies?.session_id;

  if (sessionId) {
    await pool.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
  }

  res.clearCookie("session_id");
  res.status(200).json({ message: "Signed out successfully" });
});

export default router;
