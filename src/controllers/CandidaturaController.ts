import { Request, Response, NextFunction } from 'express';
import { CandidaturaService } from '../services/CandidaturaService';

const service = new CandidaturaService();

export class CandidaturaController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidatura = await service.create(req.body);
      res.status(201).json({ success: true, data: candidatura });
    } catch (err) {
      next(err);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidaturas = await service.findAll();
      res.json({ success: true, data: candidaturas });
    } catch (err) {
      next(err);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidatura = await service.findById(Number(req.params.id));
      res.json({ success: true, data: candidatura });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidatura = await service.update(Number(req.params.id), req.body);
      res.json({ success: true, data: candidatura });
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
