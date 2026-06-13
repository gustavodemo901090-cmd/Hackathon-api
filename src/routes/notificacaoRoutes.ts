import { Router } from 'express';
import { NotificacaoController } from '../controllers/NotificacaoController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/', NotificacaoController.findAll);
router.patch('/:id(\\d+)/lida', NotificacaoController.marcarComoLida);

export default router;
