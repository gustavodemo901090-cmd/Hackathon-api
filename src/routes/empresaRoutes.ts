import { Router } from 'express';
import { EmpresaController } from '../controllers/EmpresaController';
import { validateSchema } from '../middlewares/validateSchema';
import { createEmpresaSchema, updateEmpresaSchema } from '../schemas/empresaSchema';

const router = Router();

router.post('/', validateSchema(createEmpresaSchema), EmpresaController.create);
router.get('/', EmpresaController.findAll);
router.get('/:id(\\d+)', EmpresaController.findById);
router.put('/:id(\\d+)', validateSchema(updateEmpresaSchema), EmpresaController.update);
router.delete('/:id(\\d+)', EmpresaController.delete);
router.patch('/:id(\\d+)/aprovar', EmpresaController.aprovar);
router.patch('/:id(\\d+)/bloquear', EmpresaController.bloquear);

export default router;
