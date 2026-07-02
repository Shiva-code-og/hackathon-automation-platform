import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

// POST /api/auth/collect-credentials
router.post('/collect-credentials', authController.collectCredentials);

export { router as authRoutes };
