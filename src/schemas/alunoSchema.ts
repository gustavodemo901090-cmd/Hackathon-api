import { z } from 'zod';

// Telefone é persistido somente com dígitos (ex.: 44999990000).
// Aceita entrada com ou sem máscara e normaliza para apenas números.
const telefoneSomenteDigitos = z
  .string()
  .transform((valor) => valor.replace(/\D/g, ''))
  .refine((valor) => /^\d{10,11}$/.test(valor), 'Telefone inválido. Informe DDD + número (10 ou 11 dígitos)');

export const createAlunoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: telefoneSomenteDigitos,
  curso: z.string().min(3, 'Curso deve ter pelo menos 3 caracteres'),
  periodo: z.number().int().min(1, 'Período mínimo é 1').max(10, 'Período máximo é 10'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  aptoEstagio: z.boolean().default(false),
});

export const updateAlunoSchema = z.object({
  nome: z.string().min(3).optional(),
  email: z.string().email().optional(),
  telefone: telefoneSomenteDigitos.optional(),
  curso: z.string().min(3).optional(),
  periodo: z.number().int().min(1).max(10).optional(),
  senha: z.string().min(6).optional(),
  aptoEstagio: z.boolean().optional(),
});

export type CreateAlunoInput = z.infer<typeof createAlunoSchema>;
export type UpdateAlunoInput = z.infer<typeof updateAlunoSchema>;
