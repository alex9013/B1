// src/app.js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { connectToDB } from "./db/connect.js";

const app = express();

// ✅ CORS configuration - Lista blanca de dominios permitidos
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://todo-pwa-front-ftp.vercel.app",
  "https://todo-eddy-front-xb89.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    // Si no hay origin (requests de herramientas, server-to-server) permitir
    if (!origin) return callback(null, true);
    // Si está en whitelist, permitir
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    // Permitir cualquier dominio .vercel.app (para previews)
    if (origin && origin.includes(".vercel.app")) return callback(null, true);
    // Denegar otros
    callback(new Error("CORS not allowed"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan("dev"));

// Conexión a Mongo cacheada por request (seguro en serverless)
app.use(async (_req, _res, next) => {
  try { await connectToDB(); next(); } catch (e) { next(e); }
});

app.get("/", (_req, res) => res.json({ ok: true, name: "todo-pwa-api" }));
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

export default app;