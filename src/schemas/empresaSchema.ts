import { z } from 'zod';

// Telefone é persistido somente com dígitos (mesmo padrão do aluno).
const telefoneSomenteDigitos = z
  .string()
  .transform((valor) => valor.replace(/\D/g, ''))
  .refine((valor) => /^\d{10,11}$/.test(valor), 'Telefone inválido. Informe DDD + número (10 ou 11 dígitos)');

export const createEmpresaSchema = z.object({
  razaoSocial: z.string().min(3, 'Razão social deve ter pelo menos 3 caracteres'),
  nomeFantasia: z.string().min(3, 'Nome fantasia deve ter pelo menos 3 caracteres'),
  cnpj: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido. Use o formato 00.000.000/0000-00'),
  email: z.string().email('Email inválido'),
  telefone: telefoneSomenteDigitos,
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const updateEmpresaSchema = z.object({
  razaoSocial: z.string().min(3).optional(),
  nomeFantasia: z.string().min(3).optional(),
  email: z.string().email().optional(),
  telefone: telefoneSomenteDigitos.optional(),
  senha: z.string().min(6).optional(),
});

export type CreateEmpresaInput = z.infer<typeof createEmpresaSchema>;
export type UpdateEmpresaInput = z.infer<typeof updateEmpresaSchema>;
