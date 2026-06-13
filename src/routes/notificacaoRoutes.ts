import { Router } from 'express';
import { NotificacaoController } from '../controllers/NotificacaoController';

const router = Router();

router.get('/', NotificacaoController.findAll);
router.patch('/:id(\\d+)/lida', NotificacaoController.marcarComoLida);

export default router;
