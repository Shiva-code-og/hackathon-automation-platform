import { Request, Response } from 'express';
import { store } from '../services/store';
import { cryptoService } from '../services/crypto';
import crypto from 'crypto';

export const authController = {
  collectCredentials: (req: Request, res: Response): void => {
    try {
      const credentials = req.body;

      if (!credentials || Object.keys(credentials).length === 0) {
        res.status(400).json({ error: 'Missing credentials payload' });
        return;
      }

      // We can generate a generic sessionId to use as an identifier if one isn't provided
      const id = req.query.sessionId as string || req.query.proposalId as string || crypto.randomUUID();

      const encryptedCredentials = cryptoService.encrypt(JSON.stringify(credentials));
      store.saveCredentials(id, encryptedCredentials);

      res.json({ 
        status: 'OK', 
        message: 'Credentials securely stored temporarily', 
        id 
      });
    } catch (error) {
      console.error('Error collecting credentials:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
