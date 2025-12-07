// api/index.js
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import app from "../src/app.js";

// Ensure we're in the correct directory for serverless
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Export a handler function for Vercel that ensures CORS headers and handles preflight
export default function handler(req, res) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  return app(req, res);
}
