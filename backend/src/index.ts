import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { DEMO_POLICIES, PolicyEngine } from '../../policies/index';
import { AIClaimAnalyzer } from '../../ai/index';
import { MidnightSimulator } from '../../midnight/index';
import { AuditLogger } from '../../audit/index';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Auth Mock - For hackathon demo, we just return a user object
app.post('/api/auth/login', async (req, res) => {
  const { role } = req.body;
  let user = await prisma.user.findFirst({ where: { role } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        role,
        name: `${role} User`,
        email: `${role.toLowerCase()}@example.com`
      }
    });
  }
  
  res.json({ token: `mock-token-${user.id}`, user });
});

// Policies
app.get('/api/policies', async (req, res) => {
  // Return demo policies for the hackathon
  res.json(DEMO_POLICIES);
});

// Seed Demo Database (Used for hackathon reset)
app.post('/api/seed', async (req, res) => {
  await prisma.claim.deleteMany();
  await prisma.auditRecord.deleteMany();
  await prisma.policy.deleteMany();
  
  const policy = await prisma.policy.create({
    data: {
      id: DEMO_POLICIES[0].policyId,
      name: DEMO_POLICIES[0].name,
      version: DEMO_POLICIES[0].version,
      rulesJson: JSON.stringify(DEMO_POLICIES[0].rules)
    }
  });
  
  res.json({ message: "Database seeded successfully", policy });
});

// Claims Submission (From Claimant)
// Note: This endpoint ONLY accepts the public ZK proof and public data.
// It DOES NOT accept raw private data (Age, Medical condition, Income, etc.)
app.post('/api/claims', async (req, res) => {
  try {
    const { userId, policyId, proof, category, aiConfidence } = req.body;
    
    if (!proof || !proof.verifierString) {
      return res.status(400).json({ error: "Zero Knowledge Proof is required" });
    }

    // Save claim as PENDING. Insurer will verify later.
    const claim = await prisma.claim.create({
      data: {
        id: `CLM-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        userId,
        policyId,
        category,
        aiConfidence,
        status: "PENDING",
        zkProofId: proof.proofId
      }
    });

    res.json(claim);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit claim" });
  }
});

// Get Claims
app.get('/api/claims', async (req, res) => {
  const { userId, role } = req.query;
  
  let claims;
  if (role === 'CLAIMANT' && userId) {
    claims = await prisma.claim.findMany({ where: { userId: String(userId) }, include: { policy: true } });
  } else if (role === 'INSURER') {
    claims = await prisma.claim.findMany({ include: { policy: true, user: true } });
  } else {
    claims = await prisma.claim.findMany();
  }
  
  res.json(claims);
});

// Verify ZK Proof (Insurer)
app.post('/api/verify', async (req, res) => {
  try {
    const { claimId, proof, verifierId } = req.body;
    
    const claim = await prisma.claim.findUnique({ where: { id: claimId }, include: { policy: true } });
    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }
    
    const rules = JSON.parse(claim.policy.rulesJson);
    
    // VERIFY PROOF using ZK logic. Notice how we only pass the proof and the public rules, NO private data.
    const verificationResult = await MidnightSimulator.verifyProof(proof, rules);
    
    // Update Claim Status
    const updatedClaim = await prisma.claim.update({
      where: { id: claimId },
      data: {
        status: verificationResult.valid ? "VERIFIED" : "REJECTED",
        failedCondition: verificationResult.failedConditions ? verificationResult.failedConditions.join(', ') : null
      }
    });
    
    // Create Audit Log
    const auditEvent = await AuditLogger.logEvent({
      verificationId: `VRF-${Date.now()}`,
      claimId: claim.id,
      policyId: claim.policyId,
      policyVersion: claim.policy.version,
      proofStatus: verificationResult.valid ? "VALID" : "INVALID",
      verifier: verifierId
    });
    
    await prisma.auditRecord.create({ 
      data: {
        id: auditEvent.eventId,
        verificationId: auditEvent.verificationId,
        claimId: auditEvent.claimId,
        policyId: auditEvent.policyId,
        policyVersion: auditEvent.policyVersion,
        proofStatus: auditEvent.proofStatus,
        verifier: auditEvent.verifier,
        // Prisma will handle timestamp with @default(now())
      }
    });
    res.json({
      claim: updatedClaim,
      verification: verificationResult
    });
    
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
});

// Get Audit Logs (Auditor)
app.get('/api/audit', async (req, res) => {
  const logs = await prisma.auditRecord.findMany({ orderBy: { timestamp: 'desc' } });
  res.json(logs);
});

// AI Mock Endpoint (Used by claimant's local agent before submitting claim)
app.post('/api/ai/analyze', async (req, res) => {
  const { claimData } = req.body;
  const analysis = await AIClaimAnalyzer.analyze(claimData);
  res.json(analysis);
});

// ZK Proof Generation Mock (Used locally by claimant)
// In a real dApp, this runs client-side (e.g., WASM on browser) so private data never hits the network.
// For the hackathon, we expose an endpoint but document that it represents local execution.
app.post('/api/zk/generate', async (req, res) => {
  const { privateData, policyRules, policyVersion } = req.body;
  const result = await MidnightSimulator.generateProof(privateData, policyRules, policyVersion);
  res.json(result);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
