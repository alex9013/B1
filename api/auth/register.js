// api/auth/register.js
import app from "../../src/app.js";

export default async (req, res) => {
  console.log('🔥 Register handler ejecutado');
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://f1-indol-theta.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS respondido');
    return res.status(200).end();
  }
  
  console.log('📡 Redirigiendo a Express');
  // Manually set the path for Express
  req.url = '/api/auth/register';
  return app(req, res);
};