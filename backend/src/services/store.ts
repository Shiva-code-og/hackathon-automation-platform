import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';

export interface CredentialEntry {
  id: string; // Could be sessionId or proposalId
  credentials: any;
  createdAt: number;
}

class Store {
  private credentialsMap: Map<string, CredentialEntry>;
  private supabase: SupabaseClient;

  constructor() {
    this.credentialsMap = new Map();
    this.supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
  }

  async saveWebhookToken(token: string, webhookUrl: string): Promise<void> {
    const { error } = await this.supabase
      .from('webhooks')
      .insert([{ token, url: webhookUrl }]);
    
    if (error) {
      console.error('[Store] Error saving webhook to Supabase:', error);
    } else {
      console.log(`[Store] Saved webhook token to Supabase: ${token}`);
    }
  }

  async getWebhookUrl(token: string): Promise<string | undefined> {
    const { data, error } = await this.supabase
      .from('webhooks')
      .select('url')
      .eq('token', token)
      .single();

    if (error || !data) {
      console.error('[Store] Error fetching webhook from Supabase:', error?.message);
      return undefined;
    }
    return data.url;
  }

  saveCredentials(id: string, credentials: any): void {
    this.credentialsMap.set(id, {
      id,
      credentials,
      createdAt: Date.now()
    });
    console.log(`[Store] Saved credentials for ID: ${id}`);
  }

  getCredentials(id: string): CredentialEntry | undefined {
    return this.credentialsMap.get(id);
  }

  getAllCredentials(): CredentialEntry[] {
    return Array.from(this.credentialsMap.values());
  }
}

export const store = new Store();
