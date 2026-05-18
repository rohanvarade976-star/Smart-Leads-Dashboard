import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database';
import config from './config';
import authRoutes from './routes/auth';
import leadsRoutes from './routes/leads';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (config.NODE_ENV === 'development') app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: config.NODE_ENV, timestamp: new Date().toISOString() });
});

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 auth requests per hour
  message: 'Too many authentication attempts, please try again after an hour',
});

app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/leads', leadsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
});

export default app;
