import { Router } from 'express';
import { AlunoController } from '../controllers/AlunoController';
import { validateSchema } from '../middlewares/validateSchema';
import { requireAuth } from '../middlewares/auth';
import { createAlunoSchema, updateAlunoSchema } from '../schemas/alunoSchema';

const router = Router();

router.post('/', validateSchema(createAlunoSchema), AlunoController.create);

router.use(requireAuth);

router.get('/', AlunoController.findAll);
router.get('/:id', AlunoController.findById);
router.put('/:id', validateSchema(updateAlunoSchema), AlunoController.update);
router.delete('/:id', AlunoController.delete);

export default router;
