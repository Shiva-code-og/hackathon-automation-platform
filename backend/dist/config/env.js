"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const getEnv = () => {
    const PORT = parseInt(process.env.PORT || '5000', 10);
    const STAGE_1_WEBHOOK = process.env.STAGE_1_WEBHOOK;
    if (!STAGE_1_WEBHOOK)
        throw new Error('Missing environment variable: STAGE_1_WEBHOOK');
    const STAGE_3_WEBHOOK = process.env.STAGE_3_WEBHOOK;
    if (!STAGE_3_WEBHOOK)
        throw new Error('Missing environment variable: STAGE_3_WEBHOOK');
    const STAGE_4_WEBHOOK = process.env.STAGE_4_WEBHOOK;
    if (!STAGE_4_WEBHOOK)
        throw new Error('Missing environment variable: STAGE_4_WEBHOOK');
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
        throw new Error('Missing environment variable: DATABASE_URL');
    }
    const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
    if (!ENCRYPTION_SECRET) {
        throw new Error('Missing environment variable: ENCRYPTION_SECRET');
    }
    if (ENCRYPTION_SECRET.length < 32) {
        throw new Error('ENCRYPTION_SECRET must be at least 32 characters long for AES-256');
    }
    return {
        PORT,
        STAGE_1_WEBHOOK,
        STAGE_3_WEBHOOK,
        STAGE_4_WEBHOOK,
        DATABASE_URL,
        ENCRYPTION_SECRET
    };
};
exports.env = getEnv();
