import { NextFunction, Request, Response } from 'express';
import { UsuarioService } from '../services/UsuarioService';

const service = new UsuarioService();

export class UsuarioController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { login, senha } = req.body as { login: string; senha: string };
      const result = await service.login(login, senha);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarios = await service.findAll();
      res.json({ success: true, data: usuarios.map((u) => {
        const { senha, ...rest } = u as typeof u & { senha?: string };
        return rest;
      }) });
    } catch (err) {
      next(err);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuario = await service.findById(Number(req.params.id));
      const { senha, ...rest } = usuario as typeof usuario & { senha?: string };
      res.json({ success: true, data: rest });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuario = await service.create(req.body);
      const { senha, ...rest } = usuario as typeof usuario & { senha?: string };
      res.status(201).json({ success: true, data: rest });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuario = await service.update(Number(req.params.id), req.body);
      const { senha, ...rest } = usuario as typeof usuario & { senha?: string };
      res.json({ success: true, data: rest });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
