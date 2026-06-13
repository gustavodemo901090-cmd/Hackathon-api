import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { NotificacaoService } from '../services/NotificacaoService';

const service = new NotificacaoService();

export class NotificacaoController {
  static async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const alunoId = z.coerce.number().int().positive().optional().parse(req.query.alunoId);
      const notificacoes = await service.findAll(alunoId);
      res.json({ success: true, data: notificacoes });
    } catch (err) {
      next(err);
    }
  }

  static async marcarComoLida(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notificacao = await service.marcarComoLida(Number(req.params.id));
      res.json({ success: true, data: notificacao });
    } catch (err) {
      next(err);
    }
  }
}
