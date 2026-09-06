const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = {
  async login(role: 'CLAIMANT' | 'INSURER' | 'AUDITOR') {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return res.json();
  },

  async getPolicies() {
    const res = await fetch(`${API_BASE}/policies`);
    return res.json();
  },

  async getClaims(role: string, userId?: string) {
    const url = new URL(`${API_BASE}/claims`);
    url.searchParams.append('role', role);
    if (userId) url.searchParams.append('userId', userId);
    
    const res = await fetch(url.toString());
    return res.json();
  },

  async analyzeClaim(claimData: any) {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimData })
    });
    return res.json();
  },

  async generateZKProof(privateData: any, policyRules: any, policyVersion: string) {
    const res = await fetch(`${API_BASE}/zk/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ privateData, policyRules, policyVersion })
    });
    return res.json();
  },

  async submitClaim(claimData: any) {
    const res = await fetch(`${API_BASE}/claims`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claimData)
    });
    return res.json();
  },

  async verifyClaim(claimId: string, proof: any, verifierId: string) {
    const res = await fetch(`${API_BASE}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimId, proof, verifierId })
    });
    return res.json();
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/audit`);
    return res.json();
  },
  
  async seedDb() {
    const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
    return res.json();
  }
};
