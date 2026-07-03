import { Router } from 'express';
import { automationController } from '../controllers/automationController';

const router = Router();

// POST /api/automations/generate-prompt
router.post('/generate-prompt', automationController.generatePrompt);

// POST /api/automations/trigger (Secure Webhook Proxy)
router.post('/trigger', automationController.triggerWebhook);

export { router as automationRoutes };
