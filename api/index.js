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
  try {
    const origin = req.headers.origin || "*";

    // Small request log to help debug CORS failures in Vercel logs
    console.log(`[api] ${req.method} ${req.url} origin=${req.headers.origin}`);

    // Always add CORS headers as early as possible
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

    // Preflight short-circuit
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      return res.end();
    }

    // Delegate to Express app.
    if (typeof app === "function" && app.handle) {
      return app.handle(req, res);
    }
    return app(req, res);
  } catch (err) {
    console.error("Handler error:", err);
    // Ensure client still receives CORS headers on error
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
