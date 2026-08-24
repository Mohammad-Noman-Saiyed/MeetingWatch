import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in .env");
}

export const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
