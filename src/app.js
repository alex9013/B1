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
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    if (origin && origin.includes(".vercel.app")) return callback(null, true);
    callback(new Error("CORS not allowed"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

// >>> Colocar CORS lo más arriba posible
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // responder preflight para todas las rutas

// Fallback para asegurarnos siempre de enviar headers CORS (útil en serverless)
app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

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