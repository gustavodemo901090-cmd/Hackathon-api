import { Router } from 'express';
import { VagaController } from '../controllers/VagaController';
import { validateSchema } from '../middlewares/validateSchema';
import { createVagaSchema, updateVagaSchema } from '../schemas/vagaSchema';

const router = Router();

// Rotas específicas antes de /:id para evitar conflito de parâmetros
router.get('/ativas', VagaController.findAtivas);
router.get('/empresa/:empresaId(\\d+)', VagaController.findByEmpresa);

router.post('/', validateSchema(createVagaSchema), VagaController.create);
router.get('/', VagaController.findAll);
router.get('/:id(\\d+)', VagaController.findById);
router.put('/:id(\\d+)', validateSchema(updateVagaSchema), VagaController.update);
router.delete('/:id(\\d+)', VagaController.delete);

export default router;
