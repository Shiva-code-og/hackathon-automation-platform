import crypto from 'crypto';
import { env } from '../config/env';

const ALGORITHM = 'aes-256-gcm';
// ENCRYPTION_SECRET is verified to be at least 32 characters in env.ts
const SECRET_KEY = Buffer.from(env.ENCRYPTION_SECRET.substring(0, 32), 'utf8');

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  authTag: string;
}

export const cryptoService = {
  encrypt: (text: string): EncryptedData => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return {
      ciphertext: encrypted,
      iv: iv.toString('hex'),
      authTag
    };
  },

  decrypt: (encryptedData: EncryptedData): string => {
    const decipher = crypto.createDecipheriv(
      ALGORITHM, 
      SECRET_KEY, 
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
};
