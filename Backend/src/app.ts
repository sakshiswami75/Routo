import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import parcelRoutes from './routes/parcel.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parcels', parcelRoutes);

// Global Error Handler
app.use(errorMiddleware);

export default app;
