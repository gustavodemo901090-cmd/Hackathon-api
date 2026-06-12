import { z } from 'zod';

export const createAlunoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  curso: z.string().min(3, 'Curso deve ter pelo menos 3 caracteres'),
  periodo: z.number().int().min(1, 'Período mínimo é 1').max(10, 'Período máximo é 10'),
  aptoEstagio: z.boolean().default(false),
});

export const updateAlunoSchema = z.object({
  nome: z.string().min(3).optional(),
  email: z.string().email().optional(),
  curso: z.string().min(3).optional(),
  periodo: z.number().int().min(1).max(10).optional(),
  aptoEstagio: z.boolean().optional(),
});

export type CreateAlunoInput = z.infer<typeof createAlunoSchema>;
export type UpdateAlunoInput = z.infer<typeof updateAlunoSchema>;
