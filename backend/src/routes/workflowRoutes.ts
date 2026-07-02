import { Router } from 'express';
import { workflowController } from '../controllers/workflowController';

const router = Router();

// POST /api/workflow/intake
router.post('/intake', workflowController.intakeInquiry);

// GET /api/workflow/approve/:proposalId
router.get('/approve/:proposalId', workflowController.approveProposal);

// GET /api/workflow/accept/:proposalId
router.get('/accept/:proposalId', workflowController.acceptProposal);

export { router as workflowRoutes };
