import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Aluno } from '../entities/Aluno';
import { Empresa } from '../entities/Empresa';
import { Vaga } from '../entities/Vaga';
import { Candidatura } from '../entities/Candidatura';
import { Notificacao } from '../entities/Notificacao';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'portal_estagios',
  entities: [Aluno, Empresa, Vaga, Candidatura, Notificacao],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
