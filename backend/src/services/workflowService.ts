import { env } from '../config/env';

export interface IntakePayload {
  name: string;
  email: string;
  message: string;
}

export const workflowService = {
  forwardToIntakeWebhook: async (payload: IntakePayload): Promise<void> => {
    try {
      const response = await fetch(env.STAGE_1_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        console.error('Stage 1 webhook failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error forwarding to Stage 1 webhook:', error);
      // We do not throw here to ensure the client gets an immediate OK as requested
    }
  },

  updateProposalStatus: async (proposalId: string, status: string): Promise<void> => {
    // TODO: Connect to actual database using env.DATABASE_URL
    console.log(`[DB Mock] Proposal ${proposalId} status updated to: ${status}`);
  },

  triggerProposalBuild: async (proposalId: string, customHeaders?: Record<string, string>): Promise<void> => {
    try {
      const response = await fetch(env.STAGE_3_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...customHeaders },
        body: JSON.stringify({ proposalId })
      });
      if (!response.ok) {
        console.error('Stage 3 webhook failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error triggering Stage 3 webhook:', error);
    }
  },

  triggerInvoiceDelivery: async (proposalId: string, customHeaders?: Record<string, string>): Promise<void> => {
    try {
      const response = await fetch(env.STAGE_4_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...customHeaders },
        body: JSON.stringify({ proposalId })
      });
      if (!response.ok) {
        console.error('Stage 4 webhook failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error triggering Stage 4 webhook:', error);
    }
  }
};
