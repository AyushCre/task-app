import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
cors({
origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
credentials: true
})
);

// Health check
app.get('/api/health', (_req, res) => {
res.json({ ok: true, time: new Date().toISOString() });
});

// Routes
app.use('/api/tasks', tasksRouter);

// DB connect + start
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
console.error('❌ MONGODB_URI missing in .env');
process.exit(1);
}

mongoose
.connect(MONGODB_URI)
.then(() => {
console.log('✅ MongoDB connected');
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch((err) => {
console.error('MongoDB connection error:', err.message);
process.exit(1);
});