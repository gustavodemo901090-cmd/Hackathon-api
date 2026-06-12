import { Router } from 'express';
import alunoRoutes from './alunoRoutes';

const router = Router();

router.use('/alunos', alunoRoutes);

export default router;
