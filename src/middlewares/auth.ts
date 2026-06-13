import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Empresa, EmpresaStatus } from '../entities/Empresa';
import { AppError } from '../errors/AppError';
import { verifyToken } from '../utils/auth';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.header('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

  if (!token) {
    next(new AppError('Token não informado', 401));
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    next(new AppError('Token inválido ou expirado', 401));
    return;
  }

  res.locals.authUser = payload;
  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.authUser as { perfil?: string } | undefined;
    if (!user || !user.perfil || !allowedRoles.includes(user.perfil)) {
      next(new AppError('Acesso negado', 403));
      return;
    }
    next();
  };
}

export async function requireApprovedEmpresa(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = res.locals.authUser as { entityType?: string; entityId?: number } | undefined;
    if (user?.entityType !== 'empresa') {
      next();
      return;
    }

    const empresa = await AppDataSource.getRepository(Empresa).findOneBy({ id: user.entityId });
    if (!empresa) {
      next(new AppError('Empresa não encontrada', 404));
      return;
    }
    if (empresa.status === EmpresaStatus.PENDENTE) {
      next(new AppError('Empresa aguardando aprovação da UniALFA', 403));
      return;
    }
    if (empresa.status === EmpresaStatus.BLOQUEADA) {
      next(new AppError('Empresa bloqueada pela UniALFA', 403));
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}
