const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const config = require('./config/config');
const errorHandler = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');

// Route files
const memberRoutes = require('./routes/memberRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');

// Connect to database
connectDB().then(() => {
  console.log('Database initialization complete');
}).catch(err => {
  console.error('Database initialization error:', err.message);
});

const app = express();

// Body parser
app.use(express.json());

// CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
  : ['*'];

app.use(
  cors({
    origin: config.nodeEnv === 'production'
      ? allowedOrigins
      : '*',
    credentials: true,
  })
);

// Dev logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api/', apiLimiter);

// Mount routes
app.use('/api/members', memberRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);

// Health check
const mongoose = require('mongoose');
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  // Show env var names that contain MONGO or DB (redacted values for security)
  const envKeys = Object.keys(process.env).filter(k => /mongo|db|uri|database/i.test(k));
  res.status(200).json({
    success: true,
    message: 'API is running',
    database: dbStatus[dbState] || 'unknown',
    mongoURI_set: !!process.env.MONGODB_URI,
    mongoURI_length: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
    mongoURL_set: !!process.env.MONGODB_URL,
    mongoURL_length: process.env.MONGODB_URL ? process.env.MONGODB_URL.length : 0,
    mongoURL_starts: process.env.MONGODB_URL ? process.env.MONGODB_URL.substring(0, 20) : 'n/a',
    configMongoURI_length: require('./config/config').mongoURI ? require('./config/config').mongoURI.length : 0,
    configMongoURI_starts: require('./config/config').mongoURI ? require('./config/config').mongoURI.substring(0, 25) : 'n/a',
    relevantEnvKeys: envKeys,
    allEnvKeyCount: Object.keys(process.env).length,
    env: process.env.NODE_ENV || 'not set',
  });
});

// Error handler
app.use(errorHandler);

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
