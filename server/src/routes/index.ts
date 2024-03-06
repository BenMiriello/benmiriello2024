import { Router } from 'express';
import threadRoutes from './threadRoutes';
import messageRoutes from './messageRoutes';
import runRoutes from './runRoutes';

const router = Router();

router.use('/', threadRoutes);
router.use('/', messageRoutes);
router.use('/', runRoutes);

export default router;
