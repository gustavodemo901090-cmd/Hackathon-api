import express, { Express } from 'express';
import healthRoutes from './routes/health.routes';

const app: Express = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', healthRoutes);

export default app;
