import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import meetingsRoutes from "./routes/meetings";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // the Vite dev server's URL
    credentials: true, // allows cookies to be sent cross-origin
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
