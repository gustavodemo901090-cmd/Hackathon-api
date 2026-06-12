import { Router } from 'express';
import { AlunoController } from '../controllers/AlunoController';
import { validateSchema } from '../middlewares/validateSchema';
import { createAlunoSchema, updateAlunoSchema } from '../schemas/alunoSchema';

const router = Router();

router.post('/', validateSchema(createAlunoSchema), AlunoController.create);
router.get('/', AlunoController.findAll);
router.get('/:id(\\d+)', AlunoController.findById);
router.put('/:id(\\d+)', validateSchema(updateAlunoSchema), AlunoController.update);
router.delete('/:id(\\d+)', AlunoController.delete);

export default router;
