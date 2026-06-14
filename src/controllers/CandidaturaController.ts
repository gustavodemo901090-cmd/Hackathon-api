import { Request, Response, NextFunction } from 'express';
import { CandidaturaService } from '../services/CandidaturaService';
import { AppError } from '../errors/AppError';
import { CandidaturaStatus } from '../entities/Candidatura';

const service = new CandidaturaService();

function getAuth(req: Request): { perfil?: string; entityId?: number; entityType?: string } | undefined {
  return (req.res?.locals as any)?.authUser as { perfil?: string; entityId?: number; entityType?: string } | undefined;
}

function isAdmin(perfil?: string): boolean {
  return ['ADMIN', 'COORDENADOR', 'OPERADOR'].includes(perfil ?? '');
}

export class CandidaturaController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = getAuth(req);
      const payload = { ...req.body };
      if (auth?.entityType === 'aluno' && auth.entityId) {
        payload.alunoId = auth.entityId;
      } else if (auth && !isAdmin(auth.perfil)) {
        throw new AppError('Acesso negado', 403);
      }
      const candidatura = await service.create(payload);
      res.status(201).json({ success: true, data: candidatura });
    } catch (err) {
      next(err);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = getAuth(req);
      let candidaturas;
      if (auth?.entityType === 'aluno' && auth.entityId && !isAdmin(auth.perfil)) {
        candidaturas = await service.findByAluno(auth.entityId);
      } else if (auth?.entityType === 'empresa' && auth.entityId && !isAdmin(auth.perfil)) {
        candidaturas = await service.findByEmpresa(auth.entityId);
      } else {
        candidaturas = await service.findAll();
      }
      res.json({ success: true, data: candidaturas });
    } catch (err) {
      next(err);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidatura = await service.findById(Number(req.params.id));
      const auth = getAuth(req);
      if (auth?.entityType === 'aluno' && auth.entityId && candidatura.alunoId !== auth.entityId && !isAdmin(auth.perfil)) {
        throw new AppError('Acesso negado', 403);
      }
      if (auth?.entityType === 'empresa' && auth.entityId && candidatura.vaga?.empresaId !== auth.entityId && !isAdmin(auth.perfil)) {
        throw new AppError('Acesso negado', 403);
      }
      res.json({ success: true, data: candidatura });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidaturaAtual = await service.findById(Number(req.params.id));
      const auth = getAuth(req);
      if (auth?.entityType === 'empresa' && auth.entityId && candidaturaAtual.vaga?.empresaId !== auth.entityId && !isAdmin(auth.perfil)) {
        throw new AppError('Acesso negado', 403);
      }
      if (auth?.entityType === 'aluno' && auth.entityId && candidaturaAtual.alunoId !== auth.entityId && !isAdmin(auth.perfil)) {
        throw new AppError('Acesso negado', 403);
      }
      if (auth?.entityType === 'empresa' && req.body.status === CandidaturaStatus.PENDENTE) {
        throw new AppError('A empresa não pode retornar a candidatura para o status pendente', 400);
      }
      const candidatura = await service.update(Number(req.params.id), req.body);
      res.json({ success: true, data: candidatura });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidaturaAtual = await service.findById(Number(req.params.id));
      const auth = getAuth(req);
      if (auth?.entityType === 'empresa' && auth.entityId && candidaturaAtual.vaga?.empresaId !== auth.entityId && !isAdmin(auth.perfil)) {
        throw new AppError('Acesso negado', 403);
      }
      if (auth?.entityType === 'aluno' && auth.entityId && candidaturaAtual.alunoId !== auth.entityId && !isAdmin(auth.perfil)) {
        throw new AppError('Acesso negado', 403);
      }
      await service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
