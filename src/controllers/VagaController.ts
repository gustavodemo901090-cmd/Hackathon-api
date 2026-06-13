import { Request, Response, NextFunction } from 'express';
import { VagaService } from '../services/VagaService';

const service = new VagaService();

export class VagaController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vaga = await service.create(req.body);
      res.status(201).json({ success: true, data: vaga });
    } catch (err) {
      next(err);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vagas = await service.findAll();
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
      const vagas = await service.findByEmpresa(Number(req.params.empresaId));
      res.json({ success: true, data: vagas });
    } catch (err) {
      next(err);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vaga = await service.findById(Number(req.params.id));
      res.json({ success: true, data: vaga });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vaga = await service.update(Number(req.params.id), req.body);
      res.json({ success: true, data: vaga });
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
