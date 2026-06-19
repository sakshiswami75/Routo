import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import parcelRoutes from './routes/parcel.routes';
import deliveryRoutes from './routes/delivery.routes';
import routeRoutes from './routes/route.routes';
import matchRoutes from './routes/match.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api', matchRoutes);

// Global Error Handler
app.use(errorMiddleware);

export default app;
