"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.automationRoutes = void 0;
const express_1 = require("express");
const automationController_1 = require("../controllers/automationController");
const router = (0, express_1.Router)();
exports.automationRoutes = router;
// POST /api/automations/generate-prompt
router.post('/generate-prompt', automationController_1.automationController.generatePrompt);
