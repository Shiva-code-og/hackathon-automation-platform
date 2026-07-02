import express from 'express';
import cors from 'cors';
import { env } from './config/env';

import { workflowRoutes } from './routes/workflowRoutes';
import { automationRoutes } from './routes/automationRoutes';
import { authRoutes } from './routes/authRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workflow', workflowRoutes);
app.use('/api/automations', automationRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

// Start Server
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
