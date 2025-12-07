// api/index.js
import "dotenv/config";
import app from "../src/app.js";

// Vercel necesita que exportes el handler así
export default async (req, res) => {
  // Deja que Express maneje la request
  return app(req, res);
};