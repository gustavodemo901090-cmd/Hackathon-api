import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { ZodError } from 'zod';
import { AppDataSource } from './config/data-source';
import { AppError } from './errors/AppError';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;
// Middleware de segurança para definir headers HTTP
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost,http://127.0.0.1')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API Portal de Estágios UniALFA - Online' });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada' });
});

app.use((
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
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
});

AppDataSource.initialize()
  .then(() => {
    console.log('Banco de dados conectado');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  });
