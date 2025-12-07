// api/index.js
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import app from "../src/app.js";

// Ensure we're in the correct directory for serverless
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default app; // Express como handler para Vercel
