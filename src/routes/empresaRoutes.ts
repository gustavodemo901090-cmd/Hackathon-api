import { Router } from 'express';
import { EmpresaController } from '../controllers/EmpresaController';
import { validateSchema } from '../middlewares/validateSchema';
import { requireAuth, requireRole } from '../middlewares/auth';
import { createEmpresaSchema, updateEmpresaSchema } from '../schemas/empresaSchema';

const router = Router();

router.post('/', validateSchema(createEmpresaSchema), EmpresaController.create);

router.use(requireAuth);

router.get('/', requireRole(['ADMIN', 'COORDENADOR', 'OPERADOR']), EmpresaController.findAll);
router.get('/:id', EmpresaController.findById);
router.put('/:id', validateSchema(updateEmpresaSchema), EmpresaController.update);
router.delete('/:id', EmpresaController.delete);
router.patch('/:id/aprovar', requireRole(['ADMIN', 'COORDENADOR', 'OPERADOR']), EmpresaController.aprovar);
router.patch('/:id/bloquear', requireRole(['ADMIN', 'COORDENADOR', 'OPERADOR']), EmpresaController.bloquear);

export default router;
