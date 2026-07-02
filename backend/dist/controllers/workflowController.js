"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowController = void 0;
const workflowService_1 = require("../services/workflowService");
const store_1 = require("../services/store");
const crypto_1 = require("../services/crypto");
exports.workflowController = {
    intakeInquiry: async (req, res) => {
        try {
            const { name, email, message } = req.body;
            if (!name || !email || !message) {
                res.status(400).json({ error: 'Missing required fields: name, email, and message are required.' });
                return;
            }
            const payload = {
                name: String(name).trim(),
                email: String(email).trim(),
                message: String(message).trim()
            };
            // Fire and forget to N8N to return an immediate JSON status "OK" to the client
            workflowService_1.workflowService.forwardToIntakeWebhook(payload);
            res.json({ status: 'OK' });
        }
        catch (error) {
            console.error('Error in intakeInquiry:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    approveProposal: async (req, res) => {
        try {
            const { proposalId } = req.params;
            if (!proposalId) {
                res.status(400).json({ error: 'Missing proposalId parameter' });
                return;
            }
            await workflowService_1.workflowService.updateProposalStatus(String(proposalId), 'Approved');
            let customHeaders = {};
            const credentialEntry = store_1.store.getCredentials(String(proposalId));
            if (credentialEntry && credentialEntry.credentials) {
                try {
                    const decryptedJsonString = crypto_1.cryptoService.decrypt(credentialEntry.credentials);
                    const decryptedCredentials = JSON.parse(decryptedJsonString);
                    if (decryptedCredentials.n8nApiKey) {
                        customHeaders['Authorization'] = `Bearer ${decryptedCredentials.n8nApiKey}`;
                    }
                    else {
                        customHeaders['Authorization'] = `Bearer ${decryptedJsonString}`;
                    }
                }
                catch (err) {
                    console.error(`Failed to decrypt credentials for proposal ${proposalId}`, err);
                }
            }
            // Securely fire a request to the Stage 3 N8N webhook
            workflowService_1.workflowService.triggerProposalBuild(String(proposalId), customHeaders);
            res.json({ status: 'OK', message: `Proposal ${proposalId} approved successfully` });
        }
        catch (error) {
            console.error('Error in approveProposal:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    acceptProposal: async (req, res) => {
        try {
            const { proposalId } = req.params;
            if (!proposalId) {
                res.status(400).json({ error: 'Missing proposalId parameter' });
                return;
            }
            await workflowService_1.workflowService.updateProposalStatus(String(proposalId), 'Accepted');
            let customHeaders = {};
            const credentialEntry = store_1.store.getCredentials(String(proposalId));
            if (credentialEntry && credentialEntry.credentials) {
                try {
                    const decryptedJsonString = crypto_1.cryptoService.decrypt(credentialEntry.credentials);
                    const decryptedCredentials = JSON.parse(decryptedJsonString);
                    if (decryptedCredentials.n8nApiKey) {
                        customHeaders['Authorization'] = `Bearer ${decryptedCredentials.n8nApiKey}`;
                    }
                    else {
                        customHeaders['Authorization'] = `Bearer ${decryptedJsonString}`;
                    }
                }
                catch (err) {
                    console.error(`Failed to decrypt credentials for proposal ${proposalId}`, err);
                }
            }
            // Hit the Stage 4 N8N webhook
            workflowService_1.workflowService.triggerInvoiceDelivery(String(proposalId), customHeaders);
            res.json({ status: 'OK', message: `Proposal ${proposalId} accepted successfully` });
        }
        catch (error) {
            console.error('Error in acceptProposal:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
