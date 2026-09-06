"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, Button, Badge } from '@/components/ui';
import { Shield, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

export default function SubmitClaim() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  
  const [step, setStep] = useState(1);
  const [privateData, setPrivateData] = useState({
    policyId: '', // User will select this
    claimDescription: 'Emergency admission at Apollo Hospital (Patient ID: AP-8492) due to Acute Myocardial Infarction. Patient underwent emergency Angioplasty. Total ICU stay: 72 hours. All discharge summaries and billing attached via encrypted IPFS hash.',
    age: 52,
    hospitalization_hours: 72,
    claim_amount: 345000,
    policy_active: true
  });
  
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [zkProof, setZkProof] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    api.getPolicies().then(setPolicies).catch(console.error);
  }, []);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const handleAiAnalysis = async () => {
    if (!privateData.policyId) return alert('Select a policy');
    setLoading(true);
    setStep(2);
    addLog("Analyzing claim data with AI...");
    
    try {
      const result = await api.analyzeClaim({ claimDescription: privateData.claimDescription });
      setAiAnalysis(result);
      addLog(`AI Classification: ${result.category} (${(result.confidence * 100).toFixed(0)}% confidence)`);
      addLog("Identified relevant policy conditions to verify.");
    } catch (err) {
      console.error(err);
      addLog("Error during AI analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProof = async () => {
    setLoading(true);
    setStep(3);
    addLog("Preparing private inputs...");
    
    try {
      const selectedPolicy = policies.find(p => p.policyId === privateData.policyId);
      
      // Add artificial delay to simulate heavy ZK computation
      addLog("Checking policy rules locally on device...");
      addLog("Generating Zero-Knowledge Proof (this may take a moment)...");
      
      const result = await api.generateZKProof(
        privateData, 
        selectedPolicy.rules,
        selectedPolicy.version
      );
      
      if (result.valid) {
        setZkProof(result.proof);
        addLog("Proof generated successfully.");
      } else {
        addLog("Failed to generate proof. Data does not satisfy policy conditions: " + result.failedConditions.join(', '));
      }
    } catch (err) {
      console.error(err);
      addLog("Error generating proof.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    addLog("Submitting public proof to insurer network...");
    
    try {
      await api.submitClaim({
        userId: user.id,
        policyId: privateData.policyId,
        category: aiAnalysis.category,
        aiConfidence: aiAnalysis.confidence,
        proof: zkProof
      });
      
      addLog("Claim submitted successfully!");
      setTimeout(() => {
        router.push('/claimant');
      }, 1500);
      
    } catch (err) {
      console.error(err);
      addLog("Failed to submit claim.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Submit Claim Privately</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left: Action Area */}
        <div className="space-y-6">
          
          {/* STEP 1: Input */}
          <Card className={step > 1 ? 'opacity-50 pointer-events-none' : ''}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-500 rounded-full w-6 h-6 flex items-center justify-center text-sm border border-amber-500/30">1</span>
              Private Claim Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Select Policy</label>
                <select 
                  className="w-full p-2.5 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 focus:border-amber-500/50 outline-none"
                  value={privateData.policyId}
                  onChange={e => setPrivateData({...privateData, policyId: e.target.value})}
                >
                  <option value="" className="bg-slate-900 text-slate-100">-- Select --</option>
                  {policies.map(p => (
                    <option key={p.policyId} value={p.policyId} className="bg-slate-900 text-slate-100">{p.name} ({p.policyId})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Claim Description</label>
                <textarea 
                  className="w-full p-2.5 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 focus:border-amber-500/50 outline-none" 
                  rows={2}
                  value={privateData.claimDescription}
                  onChange={e => setPrivateData({...privateData, claimDescription: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 mt-2">
                <div className="col-span-2"><Badge variant="danger">Private Data - Never Sent to Server</Badge></div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-300">Bill Amount (₹)</label>
                  <input type="number" className="w-full p-2.5 text-sm border border-slate-700 rounded-lg bg-slate-900 text-slate-100 focus:border-amber-500/50 outline-none" value={privateData.claim_amount} onChange={e => setPrivateData({...privateData, claim_amount: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-300">Hospitalization (Hours)</label>
                  <input type="number" className="w-full p-2.5 text-sm border border-slate-700 rounded-lg bg-slate-900 text-slate-100 focus:border-amber-500/50 outline-none" value={privateData.hospitalization_hours} onChange={e => setPrivateData({...privateData, hospitalization_hours: Number(e.target.value)})} />
                </div>
              </div>
              {step === 1 && (
                <Button className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold" onClick={handleAiAnalysis} disabled={!privateData.policyId || loading}>
                  Analyze with AI <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </div>
          </Card>

          {/* STEP 2: AI */}
          {step >= 2 && (
            <Card className={step > 2 ? 'opacity-50 pointer-events-none' : ''}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="bg-brand-100 text-brand-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                AI Classification
              </h2>
              {aiAnalysis ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="font-medium text-sm">Category Detected</span>
                    <Badge variant="default">{aiAnalysis.category}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="font-medium text-sm">AI Confidence</span>
                    <Badge variant="success">{(aiAnalysis.confidence * 100).toFixed(0)}%</Badge>
                  </div>
                  {step === 2 && (
                    <Button className="w-full mt-4" onClick={handleGenerateProof} disabled={loading}>
                      Generate ZK Proof <Shield size={16} className="ml-2" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-brand-600" /></div>
              )}
            </Card>
          )}

          {/* STEP 3: Submit */}
          {step >= 3 && (
            <Card>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="bg-brand-100 text-brand-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                Submit Proof
              </h2>
              {zkProof ? (
                <div className="space-y-4 text-center py-4">
                  <CheckCircle size={48} className="text-green-500 mx-auto" />
                  <p className="font-bold text-green-600 dark:text-green-400">Valid ZK Proof Generated</p>
                  <p className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded truncate break-all">
                    {zkProof.verifierString}
                  </p>
                  <Button className="w-full mt-4" onClick={handleSubmit} disabled={loading}>
                    Submit to Insurer <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              ) : loading ? (
                 <div className="flex justify-center p-4"><Loader2 className="animate-spin text-brand-600" /></div>
              ) : (
                <div className="text-red-500 font-bold p-4 text-center">Proof Generation Failed</div>
              )}
            </Card>
          )}

        </div>

        {/* Right: Terminal Log */}
        <div>
          <Card className="bg-[#0f172a] border-gray-800 h-full text-green-400 font-mono text-sm shadow-xl p-0 overflow-hidden flex flex-col">
            <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center gap-2 text-gray-400">
              <Shield size={14} />
              <span>Midnight ZK Simulator</span>
            </div>
            <div className="p-4 space-y-2 flex-1 overflow-y-auto">
              {log.length === 0 ? (
                <p className="text-gray-600">Waiting for operations...</p>
              ) : (
                log.map((msg, i) => (
                  <div key={i} className="animate-in fade-in slide-in-from-bottom-2">
                    <span className="text-gray-500 mr-2">{'>'}</span>{msg}
                  </div>
                ))
              )}
              {loading && <div className="animate-pulse">_</div>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
