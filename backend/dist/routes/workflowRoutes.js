"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowRoutes = void 0;
const express_1 = require("express");
const workflowController_1 = require("../controllers/workflowController");
const router = (0, express_1.Router)();
exports.workflowRoutes = router;
// POST /api/workflow/intake
router.post('/intake', workflowController_1.workflowController.intakeInquiry);
// GET /api/workflow/approve/:proposalId
router.get('/approve/:proposalId', workflowController_1.workflowController.approveProposal);
// GET /api/workflow/accept/:proposalId
router.get('/accept/:proposalId', workflowController_1.workflowController.acceptProposal);
