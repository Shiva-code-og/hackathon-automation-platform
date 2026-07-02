"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const workflowRoutes_1 = require("./routes/workflowRoutes");
const automationRoutes_1 = require("./routes/automationRoutes");
const authRoutes_1 = require("./routes/authRoutes");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/workflow', workflowRoutes_1.workflowRoutes);
app.use('/api/automations', automationRoutes_1.automationRoutes);
app.use('/api/auth', authRoutes_1.authRoutes);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});
// Start Server
app.listen(env_1.env.PORT, () => {
    console.log(`Server is running on port ${env_1.env.PORT}`);
});
