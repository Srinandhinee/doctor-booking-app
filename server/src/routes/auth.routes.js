import { Router } from 'express';
import { registerUser, loginUser, me } from '../services/auth.service.js';
import { requireAuth } from '../utils/auth.middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', requireAuth(), me);

export default router;


