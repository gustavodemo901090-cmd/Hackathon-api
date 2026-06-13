import { Router } from 'express';
import alunoRoutes from './alunoRoutes';
import candidaturaRoutes from './candidaturaRoutes';

const router = Router();

router.use('/alunos', alunoRoutes);
router.use('/candidaturas', candidaturaRoutes);

export default router;
