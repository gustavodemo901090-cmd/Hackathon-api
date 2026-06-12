import { Request, Response, NextFunction } from 'express';
import { AlunoService } from '../services/AlunoService';

const service = new AlunoService();

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
      const aluno = await service.findById(Number(req.params.id));
      res.json({ success: true, data: aluno });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const aluno = await service.update(Number(req.params.id), req.body);
      res.json({ success: true, data: aluno });
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
