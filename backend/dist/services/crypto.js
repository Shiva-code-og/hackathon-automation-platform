"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cryptoService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
const ALGORITHM = 'aes-256-gcm';
// ENCRYPTION_SECRET is verified to be at least 32 characters in env.ts
const SECRET_KEY = Buffer.from(env_1.env.ENCRYPTION_SECRET.substring(0, 32), 'utf8');
exports.cryptoService = {
    encrypt: (text) => {
        const iv = crypto_1.default.randomBytes(16);
        const cipher = crypto_1.default.createCipheriv(ALGORITHM, SECRET_KEY, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag().toString('hex');
        return {
            ciphertext: encrypted,
            iv: iv.toString('hex'),
            authTag
        };
    },
    decrypt: (encryptedData) => {
        const decipher = crypto_1.default.createDecipheriv(ALGORITHM, SECRET_KEY, Buffer.from(encryptedData.iv, 'hex'));
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
        let decrypted = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
};
