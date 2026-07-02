"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const store_1 = require("../services/store");
const crypto_1 = require("../services/crypto");
const crypto_2 = __importDefault(require("crypto"));
exports.authController = {
    collectCredentials: (req, res) => {
        try {
            const credentials = req.body;
            if (!credentials || Object.keys(credentials).length === 0) {
                res.status(400).json({ error: 'Missing credentials payload' });
                return;
            }
            // We can generate a generic sessionId to use as an identifier if one isn't provided
            const id = req.query.sessionId || req.query.proposalId || crypto_2.default.randomUUID();
            const encryptedCredentials = crypto_1.cryptoService.encrypt(JSON.stringify(credentials));
            store_1.store.saveCredentials(id, encryptedCredentials);
            res.json({
                status: 'OK',
                message: 'Credentials securely stored temporarily',
                id
            });
        }
        catch (error) {
            console.error('Error collecting credentials:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
