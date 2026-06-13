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
  area: z.string().trim().max(120).optional(),
  local: z.string().trim().max(160).optional(),
  cargaHoraria: z.string().trim().max(60).optional(),
  atividades: z.string().trim().optional(),
  empresaId: z.number().int().positive('ID da empresa inválido'),
});

export const updateVagaSchema = z.object({
  titulo: z.string().trim().min(3, 'Título deve ter pelo menos 3 caracteres').optional(),
  descricao: z.string().trim().min(10, 'Descrição deve ter pelo menos 10 caracteres').optional(),
  requisitos: z.string().trim().min(10, 'Requisitos devem ter pelo menos 10 caracteres').optional(),
  bolsa: z.number().positive('Bolsa deve ser um valor positivo').optional(),
  modalidade: z.nativeEnum(VagaModalidade).optional(),
  area: z.string().trim().max(120).optional(),
  local: z.string().trim().max(160).optional(),
  cargaHoraria: z.string().trim().max(60).optional(),
  atividades: z.string().trim().optional(),
  status: z.nativeEnum(VagaStatus).optional(),
});

export type CreateVagaInput = z.infer<typeof createVagaSchema>;
export type UpdateVagaInput = z.infer<typeof updateVagaSchema>;
