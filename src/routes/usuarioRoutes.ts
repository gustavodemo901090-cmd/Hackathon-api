import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { validateSchema } from '../middlewares/validateSchema';
import { createUsuarioSchema, updateUsuarioSchema } from '../schemas/usuarioSchema';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.use(requireAuth, requireRole(['ADMIN', 'COORDENADOR', 'OPERADOR']));

router.post('/', validateSchema(createUsuarioSchema), UsuarioController.create);
router.get('/', UsuarioController.findAll);
router.get('/:id(\\d+)', UsuarioController.findById);
router.put('/:id(\\d+)', validateSchema(updateUsuarioSchema), UsuarioController.update);
router.delete('/:id(\\d+)', UsuarioController.delete);

export default router;
