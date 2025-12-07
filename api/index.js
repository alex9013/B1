// api/index.js
import app from "../src/app.js";

// Wrapper para forzar headers CORS en Vercel
export default (req, res) => {
  // Forzar headers CORS ANTES de cualquier cosa
  res.setHeader('Access-Control-Allow-Origin', 'https://f1-indol-theta.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Responder inmediatamente a OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Pasar al handler de Express
  return app(req, res);
};