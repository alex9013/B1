// api/index.js
import "dotenv/config";
import app from "../src/app.js";

// Vercel serverless function handler
export default async (req, res) => {
  // Configurar headers CORS manualmente antes de que Express los maneje
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:5173",
    "https://f1-indol-theta.vercel.app"
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }
  
  // Si es una petición OPTIONS, responder inmediatamente
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Dejar que Express maneje el resto
  return app(req, res);
};