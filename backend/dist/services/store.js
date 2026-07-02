"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
class Store {
    credentialsMap;
    constructor() {
        this.credentialsMap = new Map();
    }
    saveCredentials(id, credentials) {
        this.credentialsMap.set(id, {
            id,
            credentials,
            createdAt: Date.now()
        });
        console.log(`[Store] Saved credentials for ID: ${id}`);
    }
    getCredentials(id) {
        return this.credentialsMap.get(id);
    }
    getAllCredentials() {
        return Array.from(this.credentialsMap.values());
    }
}
exports.store = new Store();
