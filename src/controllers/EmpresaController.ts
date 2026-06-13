import { Request, Response, NextFunction } from 'express';
import { EmpresaService } from '../services/EmpresaService';

const service = new EmpresaService();

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
      const empresa = await service.findById(Number(req.params.id));
      res.json({ success: true, data: empresa });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const empresa = await service.update(Number(req.params.id), req.body);
      res.json({ success: true, data: empresa });
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

  static async aprovar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const empresa = await service.aprovar(Number(req.params.id));
      res.json({ success: true, data: empresa });
    } catch (err) {
      next(err);
    }
  }

  static async bloquear(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const empresa = await service.bloquear(Number(req.params.id));
      res.json({ success: true, data: empresa });
    } catch (err) {
      next(err);
    }
  }
}
