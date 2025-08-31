import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import tasksRouter from './routes/tasks.js';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Create logs directory if it doesn't exist
import fs from 'fs';
import path from 'path';
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
  })
);

// HTTP request logging
app.use(morgan('combined', { stream: logger.stream }));

// Health check with detailed status
app.get('/api/health', (_req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  };
  logger.info('Health check performed', { healthCheck });
  res.json(healthCheck);
});

// Routes
app.use('/api/tasks', tasksRouter);

// 404 handler
app.use('*', (req, res) => {
  logger.warn('Route not found', { path: req.originalUrl, method: req.method });
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use(errorHandler);

// DB connect + start
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  logger.error('MONGODB_URI missing in environment variables');
  process.exit(1);
}

// MongoDB connection with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info('✅ MongoDB connected successfully');
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    logger.error('MongoDB connection failed:', err.message);
    logger.error('Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT. Shutting down gracefully...');
  await mongoose.connection.close();
  logger.info('MongoDB connection closed.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM. Shutting down gracefully...');
  await mongoose.connection.close();
  logger.info('MongoDB connection closed.');
  process.exit(0);
});

// Start the application
connectWithRetry();
