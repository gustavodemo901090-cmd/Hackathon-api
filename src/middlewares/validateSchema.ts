import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateSchema(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
