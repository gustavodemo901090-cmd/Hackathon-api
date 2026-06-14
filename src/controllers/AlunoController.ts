import { Request, Response, NextFunction } from 'express';
import { AlunoService } from '../services/AlunoService';
import { AppError } from '../errors/AppError';

const service = new AlunoService();

function getAuth(req: Request): { perfil?: string; entityId?: number; entityType?: string } | undefined {
  return (req.res?.locals as any)?.authUser as { perfil?: string; entityId?: number; entityType?: string } | undefined;
}

function denyIfNotOwner(req: Request, alunoId: number): void {
  const auth = getAuth(req);
  if (!auth) return;
  if (['ADMIN', 'COORDENADOR', 'OPERADOR'].includes(auth.perfil ?? '')) return;
  if ((auth.entityType ?? '') !== 'aluno' || (auth.entityId ?? 0) !== alunoId) {
    throw new AppError('Acesso negado', 403);
  }
}

export class AlunoController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const aluno = await service.create(req.body);
      res.status(201).json({ success: true, data: aluno });
    } catch (err) {
      next(err);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const alunos = await service.findAll();
      res.json({ success: true, data: alunos });
    } catch (err) {
      next(err);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      denyIfNotOwner(req, id);
      const aluno = await service.findById(id);
      res.json({ success: true, data: aluno });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      denyIfNotOwner(req, id);
      const auth = getAuth(req);
      const isAdminUser = ['ADMIN', 'COORDENADOR', 'OPERADOR'].includes(auth?.perfil ?? '');
      // aptoEstagio é controlado exclusivamente pelo backoffice Java — alunos não podem auto-marcar.
      const { aptoEstagio: _ignored, ...bodyWithoutApto } = req.body;
      const body = isAdminUser ? req.body : bodyWithoutApto;
      const aluno = await service.update(id, body);
      res.json({ success: true, data: aluno });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      denyIfNotOwner(req, id);
      await service.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
