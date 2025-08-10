const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');

// Import route modules
const locationsRouter = require('./routes/locations');
const chartRouter = require('./routes/chart');
const healthRouter = require('./routes/health');

console.log('Initializing astronomical calculations...');

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://sage.humandesign.ai', 'https://app.humandesign.ai']
    : true,
  credentials: true
}));

// Request compression
app.use(compression());

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api', healthRouter);
app.use('/api', locationsRouter);
app.use('/api', chartRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'SAGE Human Design API',
    version: '1.0.0',
    description: 'Self-learning Agent for Guidance and Execution',
    endpoints: {
      locations: '/api/locations?query={city}',
      singleChart: '/api/hd-data?date={iso_date}&timezone={timezone}',
      relationshipChart: '/api/hd-data-composite?date={iso_date}&timezone={timezone}&date1={iso_date}&timezone1={timezone}',
      health: '/api/health'
    },
    documentation: 'https://github.com/sphinxcode/hdkit#api-documentation'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `${req.method} ${req.originalUrl} is not a valid endpoint`,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/locations?query={city}',
      'GET /api/hd-data?date={iso_date}&timezone={timezone}',
      'GET /api/hd-data-composite?date={iso_date}&timezone={timezone}&date1={iso_date}&timezone1={timezone}'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong on our end'
      : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SAGE Human Design API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
});

module.exports = app;