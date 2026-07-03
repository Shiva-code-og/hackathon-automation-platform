import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface EnvConfig {
  PORT: number;
  STAGE_1_WEBHOOK: string;
  STAGE_3_WEBHOOK: string;
  STAGE_4_WEBHOOK: string;
  DATABASE_URL: string;
  ENCRYPTION_SECRET: string;
  GEMINI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

const getEnv = (): EnvConfig => {
  const PORT = parseInt(process.env.PORT || '5000', 10);
  
  const STAGE_1_WEBHOOK = process.env.STAGE_1_WEBHOOK;
  if (!STAGE_1_WEBHOOK) throw new Error('Missing environment variable: STAGE_1_WEBHOOK');

  const STAGE_3_WEBHOOK = process.env.STAGE_3_WEBHOOK;
  if (!STAGE_3_WEBHOOK) throw new Error('Missing environment variable: STAGE_3_WEBHOOK');

  const STAGE_4_WEBHOOK = process.env.STAGE_4_WEBHOOK;
  if (!STAGE_4_WEBHOOK) throw new Error('Missing environment variable: STAGE_4_WEBHOOK');

  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('Missing environment variable: DATABASE_URL');
  }

  const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
  if (!ENCRYPTION_SECRET) {
    throw new Error('Missing environment variable: ENCRYPTION_SECRET');
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('Missing environment variable: GEMINI_API_KEY');
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  if (!SUPABASE_URL) {
    throw new Error('Missing environment variable: SUPABASE_URL');
  }

  const SUPABASE_KEY = process.env.SUPABASE_KEY;
  if (!SUPABASE_KEY) {
    throw new Error('Missing environment variable: SUPABASE_KEY');
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
    ENCRYPTION_SECRET,
    GEMINI_API_KEY,
    SUPABASE_URL,
    SUPABASE_KEY
  };
};

export const env = getEnv();
