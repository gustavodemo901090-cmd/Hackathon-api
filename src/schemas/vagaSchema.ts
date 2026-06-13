import { z } from 'zod';
import { VagaModalidade, VagaStatus } from '../entities/Vaga';

export const createVagaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  requisitos: z.string().min(10, 'Requisitos devem ter pelo menos 10 caracteres'),
  bolsa: z.number().positive('Bolsa deve ser um valor positivo'),
  modalidade: z.nativeEnum(VagaModalidade, {
    errorMap: () => ({ message: 'Modalidade inválida. Use: PRESENCIAL, REMOTO ou HIBRIDO' }),
  }),
  empresaId: z.number().int().positive('ID da empresa inválido'),
});

export const updateVagaSchema = z.object({
  titulo: z.string().min(3).optional(),
  descricao: z.string().min(10).optional(),
  requisitos: z.string().min(10).optional(),
  bolsa: z.number().positive().optional(),
  modalidade: z.nativeEnum(VagaModalidade).optional(),
  status: z.nativeEnum(VagaStatus).optional(),
});

export type CreateVagaInput = z.infer<typeof createVagaSchema>;
export type UpdateVagaInput = z.infer<typeof updateVagaSchema>;
