
// api/auth/register.js
import app from "../../src/app.js";

export default async (req, res) => {
  console.log('🔥 Register handler ejecutado:', req.method);
  
  // Set CORS headers
  const origin = req.headers.origin || 'https://f1-indol-theta.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS respondido con CORS');
    return res.status(200).end();
  }
  
  console.log('📡 POST - Ejecutando register con Express');
  // Set the correct path for Express routing
  req.url = '/api/auth/register';
  req.path = '/api/auth/register';
  return app(req, res);
};