import { pool } from "./db";
import dotenv from "dotenv";
dotenv.config();

const USER_ID = 5; // change this to your actual test user's id if different
const TITLES = [
  "Weekly Sync",
  "Client Review",
  "Sprint Planning",
  "Retro",
  "Standup",
  "Budget Check-in",
];

async function seed() {
  console.log("Seeding 500 meetings...");
  const t0 = Date.now();

  for (let i = 0; i < 500; i++) {
    const daysAgo = Math.floor(Math.random() * 365); // spread across the last year
    const meetingDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const title = TITLES[Math.floor(Math.random() * TITLES.length)];
    const rating = Math.floor(Math.random() * 5) + 1;
    const engagement = Math.floor(Math.random() * 10) + 1;
    const duration = Math.floor(Math.random() * 90) + 10;

    await pool.query(
      `INSERT INTO meetings (user_id, title, meeting_date, duration_minutes, overall_rating, engagement_score)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [USER_ID, title, meetingDate, duration, rating, engagement],
    );
  }

  const t1 = Date.now();
  console.log(`Done. Inserted 500 meetings in ${t1 - t0}ms`);
  await pool.end();
}

seed();
