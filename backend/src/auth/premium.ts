import { Request, Response, NextFunction } from "express";
import { pool } from "../db";

export async function requirePremium(
    req: Request,
    res: Response,
    next: NextFunction,
){
    const userId = req.userId;

    if(!userId){
        return res.status(401).json({ error: "Not Logged In" })
    }

    const result = await pool.query("SELECT is_premium FROM users WHERE id = $1", [userId],);

    const user = result.rows[0];

    if(!user || !user.is_premium){
        return res.status(403).json({ error: "Premium Subscription Required!" });
    }
    next();
}