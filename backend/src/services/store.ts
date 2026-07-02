export interface CredentialEntry {
  id: string; // Could be sessionId or proposalId
  credentials: any;
  createdAt: number;
}

class Store {
  private credentialsMap: Map<string, CredentialEntry>;

  constructor() {
    this.credentialsMap = new Map();
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
