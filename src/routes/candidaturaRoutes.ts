import { Router } from 'express';
import { CandidaturaController } from '../controllers/CandidaturaController';
import { validateSchema } from '../middlewares/validateSchema';
import { createCandidaturaSchema, updateCandidaturaSchema } from '../schemas/candidaturaSchema';

const router = Router();

router.post('/', validateSchema(createCandidaturaSchema), CandidaturaController.create);
router.get('/', CandidaturaController.findAll);
router.get('/:id(\\d+)', CandidaturaController.findById);
router.put('/:id(\\d+)', validateSchema(updateCandidaturaSchema), CandidaturaController.update);
router.delete('/:id(\\d+)', CandidaturaController.delete);

export default router;
