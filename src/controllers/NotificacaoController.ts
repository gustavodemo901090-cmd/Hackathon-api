import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { NotificacaoService } from '../services/NotificacaoService';
import { AppError } from '../errors/AppError';

const service = new NotificacaoService();

function getAuth(req: Request): { perfil?: string; entityId?: number; entityType?: string } | undefined {
  return (req.res?.locals as any)?.authUser as { perfil?: string; entityId?: number; entityType?: string } | undefined;
}

export class NotificacaoController {
  static async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = getAuth(req);
      if (!auth || auth.entityType !== 'aluno' || !auth.entityId) {
        throw new AppError('Acesso negado', 403);
      }

      const alunoId = z.coerce.number().int().positive().optional().parse(req.query.alunoId);
      if (alunoId && alunoId !== auth.entityId) {
        throw new AppError('Acesso negado', 403);
      }

      const notificacoes = await service.findByAluno(auth.entityId);
      res.json({ success: true, data: notificacoes });
    } catch (err) {
      next(err);
    }
  }

  static async marcarComoLida(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = getAuth(req);
      if (!auth || auth.entityType !== 'aluno' || !auth.entityId) {
        throw new AppError('Acesso negado', 403);
      }
      const notificacao = await service.marcarComoLida(Number(req.params.id), auth.entityId);
      res.json({ success: true, data: notificacao });
    } catch (err) {
      next(err);
    }
  }
}
