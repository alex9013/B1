// api/index.js
import app from "../src/app.js";

// Vercel serverless function
export default (req, res) => {
  // Set CORS headers
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'https://f1-indol-theta.vercel.app'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Let Express handle the request
  return app(req, res);
};