import { z } from 'zod';
import { CandidaturaStatus } from '../entities/Candidatura';

export const createCandidaturaSchema = z.object({
  alunoId: z.number().int().positive('ID do aluno inválido'),
  vagaId: z.number().int().positive('ID da vaga inválido'),
  observacao: z.string().optional(),
});

export const updateCandidaturaSchema = z.object({
  status: z
    .nativeEnum(CandidaturaStatus, {
      errorMap: () => ({
        message: 'Status inválido. Use: PENDENTE, EM_ANALISE, APROVADA ou REPROVADA',
      }),
    })
    .optional(),
  observacao: z.string().optional(),
});

export type CreateCandidaturaInput = z.infer<typeof createCandidaturaSchema>;
export type UpdateCandidaturaInput = z.infer<typeof updateCandidaturaSchema>;
