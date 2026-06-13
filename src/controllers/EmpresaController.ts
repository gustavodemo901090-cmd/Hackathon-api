import { Request, Response, NextFunction } from 'express';
import { EmpresaService } from '../services/EmpresaService';
import { AppError } from '../errors/AppError';

const service = new EmpresaService();

function getAuth(req: Request): { perfil?: string; entityId?: number; entityType?: string } | undefined {
  return (req.res?.locals as any)?.authUser as { perfil?: string; entityId?: number; entityType?: string } | undefined;
}

function denyIfNotOwnEmpresa(req: Request, empresaId: number): void {
  const auth = getAuth(req);
  if (!auth) return;
  if (['ADMIN', 'COORDENADOR', 'OPERADOR'].includes(auth.perfil ?? '')) return;
  if ((auth.entityType ?? '') !== 'empresa' || (auth.entityId ?? 0) !== empresaId) {
    throw new AppError('Acesso negado', 403);
  }
}

export class EmpresaController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const empresa = await service.create(req.body);
      res.status(201).json({ success: true, data: empresa });
    } catch (err) {
      next(err);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const empresas = await service.findAll();
      res.json({ success: true, data: empresas });
    } catch (err) {
      next(err);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      denyIfNotOwnEmpresa(req, id);
      const empresa = await service.findById(id);
      res.json({ success: true, data: empresa });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      denyIfNotOwnEmpresa(req, id);
      const empresa = await service.update(id, req.body);
      res.json({ success: true, data: empresa });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      denyIfNotOwnEmpresa(req, id);
      await service.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  static async aprovar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      denyIfNotOwnEmpresa(req, Number(req.params.id));
      const empresa = await service.aprovar(Number(req.params.id));
      res.json({ success: true, data: empresa });
    } catch (err) {
      next(err);
    }
  }

  static async bloquear(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      denyIfNotOwnEmpresa(req, Number(req.params.id));
      const empresa = await service.bloquear(Number(req.params.id));
      res.json({ success: true, data: empresa });
    } catch (err) {
      next(err);
    }
  }
}
