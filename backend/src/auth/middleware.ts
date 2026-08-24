import { Request, Response, NextFunction } from "express";
import { getUserIdFromSession } from "./session";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sessionId = req.cookies?.session_id;

  if (!sessionId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const userId = await getUserIdFromSession(sessionId);

  if (!userId) {
    return res.status(401).json({ error: "Session expired or invalid" });
  }

  req.userId = userId;
  next();
}
