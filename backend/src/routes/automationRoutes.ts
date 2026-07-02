import { Router } from 'express';
import { automationController } from '../controllers/automationController';

const router = Router();

// POST /api/automations/generate-prompt
router.post('/generate-prompt', automationController.generatePrompt);

export { router as automationRoutes };
