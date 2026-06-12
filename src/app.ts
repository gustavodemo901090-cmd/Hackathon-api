import 'reflect-metadata';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ZodError } from 'zod';
import routes from './routes';
import { AppError } from './errors/AppError';
import healthRoutes from './routes/health.routes';

const app: Express = express();

// Middleware de segurança
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.use('/api/health', healthRoutes);

// Rotas da API
app.use('/api', routes);

// 404 - Rota não encontrada
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada' });
});

// Middleware de tratamento de erros
app.use(
  (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: error.errors[0]?.message ?? 'Dados inválidos',
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  },
);

export default app;
