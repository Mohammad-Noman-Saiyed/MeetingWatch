import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import meetingsRoutes from "./routes/meetings";
import employeesRoutes from "./routes/employees";
import billingRoutes from "./routes/billing";
import { FRONTEND_URL } from "./config";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // allows cookies to be sent cross-origin
  }),
);

// Must come BEFORE express.json(). Stripe verifies its signature against the
// raw request bytes, so this one path has to stay unparsed.
app.use("/api/billing/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/billing", billingRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
