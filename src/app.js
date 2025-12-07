// src/app.js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { connectToDB } from "./db/connect.js";

const app = express();

connectToDB().catch(err => console.error("Error Mongo:", err));

// CORS simple y directo
app.use(cors({
  origin: ["http://localhost:5173", "https://f1-indol-theta.vercel.app"],
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => res.json({ ok: true, name: "todo-pwa-api" }));
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

export default app;