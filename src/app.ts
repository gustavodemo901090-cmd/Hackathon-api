import express, { Express } from 'express';
import healthRoutes from './routes/health.routes';

const app: Express = express();

app.use(express.json());
app.use('/api', healthRoutes);

export default app;
