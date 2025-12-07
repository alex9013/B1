// api/index.js
import app from "../src/app.js";

// Vercel serverless function
export default async (req, res) => {
  console.log('🔥 Handler ejecutado:', req.method, req.url);
  
  // Set CORS headers SIEMPRE
  const origin = req.headers.origin || 'https://f1-indol-theta.vercel.app';
  
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  console.log('✅ Headers CORS establecidos para origin:', origin);
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('🚦 Respondiendo a OPTIONS');
    res.status(200).end();
    return;
  }
  
  console.log('📡 Pasando a Express...');
  // Let Express handle the request
  return app(req, res);
};