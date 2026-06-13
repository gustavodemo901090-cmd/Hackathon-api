import { Router } from 'express';
import alunoRoutes from './alunoRoutes';
import empresaRoutes from './empresaRoutes';
import vagaRoutes from './vagaRoutes';
import candidaturaRoutes from './candidaturaRoutes';
import notificacaoRoutes from './notificacaoRoutes';

const router = Router();

router.use('/alunos', alunoRoutes);
router.use('/empresas', empresaRoutes);
router.use('/vagas', vagaRoutes);
router.use('/candidaturas', candidaturaRoutes);
router.use('/notificacoes', notificacaoRoutes);

export default router;
