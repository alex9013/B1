// src/app.js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { connectToDB } from "./db/connect.js";

const app = express();

connectToDB().catch(err => console.error("Error Mongo:", err));

const allowedOrigins = [
  "http://localhost:5173",
  "https://f1-indol-theta.vercel.app"
];

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman o apps móviles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-Request-Id"]
}));

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => res.json({ ok: true, name: "todo-pwa-api" }));
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

export default app;