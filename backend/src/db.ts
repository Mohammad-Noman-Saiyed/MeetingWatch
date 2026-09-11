import { Pool } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const useSSL = process.env.DB_SSL === "true";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL
    ? {
        rejectUnauthorized: true,
        ca: fs
          .readFileSync(path.join(__dirname, "../certs/global-bundle.pem"))
          .toString(),
      }
    : undefined,
});
