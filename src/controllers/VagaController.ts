import { Request, Response, NextFunction } from 'express';
import { VagaService } from '../services/VagaService';
import { AppError } from '../errors/AppError';

const service = new VagaService();

function getAuth(req: Request): { perfil?: string; entityId?: number; entityType?: string } | undefined {
  return (req.res?.locals as any)?.authUser as { perfil?: string; entityId?: number; entityType?: string } | undefined;
}

function isAdmin(perfil?: string): boolean {
  return ['ADMIN', 'COORDENADOR', 'OPERADOR'].includes(perfil ?? '');
}

export class VagaController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = getAuth(req);
      const payload = { ...req.body };
      if (auth?.entityType === 'empresa' && auth.entityId) {
        payload.empresaId = auth.entityId;
      }
      const vaga = await service.create(payload);
      res.status(201).json({ success: true, data: vaga });
    } catch (err) {
      next(err);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = getAuth(req);
      const vagas = auth?.entityType === 'empresa' && auth.entityId && !isAdmin(auth.perfil)
        ? await service.findAllByEmpresa(auth.entityId)
        : await service.findAll();
      res.json({ success: true, data: vagas });
    } catch (err) {
      next(err);
    }
  }

  static async findAtivas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vagas = await service.findAtivas();
      res.json({ success: true, data: vagas });
    } catch (err) {
      next(err);
    }
  }

  static async findByEmpresa(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const empresaId = Number(req.params.empresaId);
      const auth = getAuth(req);
      if (auth?.entityType === 'empresa' && auth.entityId && auth.entityId !== empresaId && !isAdmin(auth.perfil)) {
        throw new AppError('Acesso negado', 403);
      }
      const vagas = auth?.entityType === 'empresa' && auth.entityId && !isAdmin(auth.perfil)
        ? await service.findByEmpresa(auth.entityId)
        : await service.findByEmpresa(empresaId);
      res.json({ success: true, data: vagas });
    } catch (err) {
      next(err);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vaga = await service.findById(Number(req.params.id));
      const auth = getAuth(req);
      if (auth?.entityType === 'empresa' && auth.entityId && vaga.empresaId !== auth.entityId && !isAdmin(auth.perfil)) {
        throw new AppError('Acesso negado', 403);
      }
      res.json({ success: true, data: vaga });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vagaAtual = await service.findById(Number(req.params.id));
      const auth = getAuth(req);
      if (auth?.entityType === 'empresa' && auth.entityId && vagaAtual.empresaId !== auth.entityId && !isAdmin(auth.perfil)) {
        throw new AppError('Acesso negado', 403);
      }
      const vaga = await service.update(Number(req.params.id), req.body);
      res.json({ success: true, data: vaga });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vagaAtual = await service.findById(Number(req.params.id));
      const auth = getAuth(req);
      if (auth?.entityType === 'empresa' && auth.entityId && vagaAtual.empresaId !== auth.entityId && !isAdmin(auth.perfil)) {
        throw new AppError('Acesso negado', 403);
      }
      await service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
