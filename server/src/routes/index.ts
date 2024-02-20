import { Router } from 'express';
import chat from './chat';

const router = Router();

router.get('/api/v1/', (req, res) => {
  res.json({ message: 'oll korrect' });
});

router.use('/', chat);

export default router;
