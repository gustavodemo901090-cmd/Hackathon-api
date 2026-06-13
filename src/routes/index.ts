import { Router } from 'express';
import alunoRoutes from './alunoRoutes';
import empresaRoutes from './empresaRoutes';
import candidaturaRoutes from './candidaturaRoutes';

const router = Router();

router.use('/alunos', alunoRoutes);
router.use('/empresas', empresaRoutes);
router.use('/candidaturas', candidaturaRoutes);

export default router;
