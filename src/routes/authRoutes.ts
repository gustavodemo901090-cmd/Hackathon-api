import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { validateSchema } from '../middlewares/validateSchema';
import { loginSchema } from '../schemas/usuarioSchema';

const router = Router();

router.post('/login', validateSchema(loginSchema), UsuarioController.login);

export default router;
