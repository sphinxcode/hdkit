const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    service: 'SAGE Human Design API',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
    }
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = 'ERROR';
    healthcheck.error = error.message;
    res.status(503).json(healthcheck);
  }
});

module.exports = router;