import { Router, Request, Response } from "express";
import { pool } from "../db";
import { hashPassword, verifyPassword } from "../auth/hash";
import { createSession } from "../auth/session";
import { requireAuth } from "../auth/middleware";

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
    secure: process.env.NODE_ENV === "production",
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Signed in successfully" });
});

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT id, email, first_name, last_name, is_premium FROM users WHERE id = $1",
    [req.userId],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = result.rows[0];
  res.json({
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    isPremium: user.is_premium,
  });
});

router.post("/signout", async (req: Request, res: Response) => {
  const sessionId = req.cookies?.session_id;

  if (sessionId) {
    await pool.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
  }

  res.clearCookie("session_id");
  res.status(200).json({ message: "Signed out successfully" });
});

router.delete("/me", requireAuth, async (req: Request, res: Response) => {
  
  // everytime u do pool.query it runs kind of like a new connection/pool but we want an "all or nothing" approach
  // so we un all pool queries in this same client to keep everything in 1 page
  const client = await pool.connect();
  
  try {
    //this "BEGIN" starts the "all or nothing" move
    await client.query("BEGIN");
    
    // then don't just remove the user from the users tables, remove all of his belongings first just like a BST
    // so we remove all of their meetings first
    await client.query("DELETE FROM meetings WHERE user_id = $1", [req.userId]);
   
    // then remove their employees
    await client.query("DELETE FROM employees WHERE user_id = $1", [
      req.userId,
    ]);
    
    // then their session cookies (including the current one that called this route)
    await client.query("DELETE FROM sessions WHERE user_id = $1", [req.userId]);
    
    // then remove the user themsevles. all of the child tables had the user's id inherited so we did users_id = ... but
    // the users table is the "parent" so we just do id = ...
    await client.query("DELETE FROM users WHERE id = $1", [req.userId]);
   
    //commit all of these changes at once
    await client.query("COMMIT");

    //clear the cookies
    res.clearCookie("session_id");

    // if we reached this line, everything was deleted so return with OK status code and message
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    
    // incase of any errors, we aboard mission and just revert all changes doing "ROLLBACK" so none of the 4 deletes go through because
    // it could be that 2 went through but the 3 one had an error so we don't want a partially deleted user
    await client.query("ROLLBACK");
    
    // show this error on the console. Do console.error instead of console.log for errors specifically
    console.error(err);
    
    //return the error code and message
    res
      .status(500)
      .json({ error: "Could not delete account, please try again" });

  } finally {
    
    // ok now release the pool no matter what to prevent pool from drying for future pool.query requests
    client.release();

  }
});

export default router;
