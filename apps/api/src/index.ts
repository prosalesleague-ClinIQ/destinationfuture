import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { reportRouter } from "./routes/report";
import { questRouter } from "./routes/quest";
import { gamificationRouter } from "./routes/gamification";
import { exportRouter } from "./routes/export";
import { errorHandler } from "./middleware/error-handler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/report", reportRouter);
app.use("/api/quest", questRouter);
app.use("/api/gamification", gamificationRouter);
app.use("/api/export", exportRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", version: "0.1.0" });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Destination Future API running on port ${PORT}`);
});

export default app;
