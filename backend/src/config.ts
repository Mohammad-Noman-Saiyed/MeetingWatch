import dotenv from "dotenv";

dotenv.config();

export const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://meetingwatch.company"
    : "http://localhost:5173";
