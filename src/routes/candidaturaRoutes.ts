import { Router } from 'express';
import { CandidaturaController } from '../controllers/CandidaturaController';
import { validateSchema } from '../middlewares/validateSchema';
import { requireApprovedEmpresa, requireAuth } from '../middlewares/auth';
import { createCandidaturaSchema, updateCandidaturaSchema } from '../schemas/candidaturaSchema';

const router = Router();

router.use(requireAuth, requireApprovedEmpresa);

router.post('/', validateSchema(createCandidaturaSchema), CandidaturaController.create);
router.get('/', CandidaturaController.findAll);
router.get('/:id', CandidaturaController.findById);
router.put('/:id', validateSchema(updateCandidaturaSchema), CandidaturaController.update);
router.delete('/:id', CandidaturaController.delete);

export default router;
