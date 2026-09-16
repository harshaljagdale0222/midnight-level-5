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
        { ...privateData, claim_category: aiAnalysis.category }, 
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
    <div className="max-w-5xl mx-auto px-4 py-12 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold mb-2 text-slate-100 tracking-tight">Submit Claim <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Privately</span></h1>
        <p className="text-slate-400 text-lg">Generate a zero-knowledge proof locally on your device.</p>
      </div>
      
      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* Left: Action Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* STEP 1: Input */}
          <div className={`glass-panel p-6 rounded-3xl transition-opacity duration-300 ${step > 1 ? 'opacity-60 pointer-events-none' : ''}`}>
            <h2 className="text-xl font-bold mb-5 flex items-center gap-3 text-slate-200">
              <span className="bg-amber-500 text-slate-950 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)]">1</span>
              Private Claim Details
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Select Policy</label>
                <select 
                  className="w-full p-3 border border-slate-700/50 rounded-xl bg-slate-900/80 text-slate-100 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all shadow-inner"
                  value={privateData.policyId}
                  onChange={e => setPrivateData({...privateData, policyId: e.target.value})}
                >
                  <option value="" className="bg-slate-900 text-slate-400">-- Choose a Policy --</option>
                  {policies.map(p => (
                    <option key={p.policyId} value={p.policyId} className="bg-slate-900 text-slate-100">{p.name} ({p.policyId})</option>
                  ))}
                </select>
                <div className="bg-amber-950/30 border border-amber-500/20 p-3 rounded-lg mt-3 flex gap-3 items-start">
                  <span className="text-amber-400 text-lg leading-none mt-0.5">💡</span>
                  <p className="text-xs text-amber-300/80 leading-relaxed">
                    <b>Hackathon Note:</b> 
                    {privateData.policyId ? (() => {
                      const sel = policies.find(p => p.policyId === privateData.policyId);
                      if (!sel) return " Select a policy to see its criteria.";
                      const amtRule = sel.rules.find((r: any) => r.condition === 'claim_amount');
                      const hrsRule = sel.rules.find((r: any) => r.condition === 'hospitalization_hours');
                      const ageRule = sel.rules.find((r: any) => r.condition === 'age');
                      
                      let text = " For a successful proof,";
                      if (hrsRule) text += ` Hospitalization must be ${hrsRule.operator} ${hrsRule.value} hours`;
                      if (amtRule) text += ` and Bill Amount ${amtRule.operator} ₹${amtRule.value}`;
                      if (ageRule) text += ` and Age ${ageRule.operator} ${ageRule.value}`;
                      return text + ". Try breaking these rules to see a rejected proof!";
                    })() : " Select a policy above to see its rules."}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Claim Description</label>
                <textarea 
                  className="w-full p-3 border border-slate-700/50 rounded-xl bg-slate-900/80 text-slate-100 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all shadow-inner resize-none" 
                  rows={3}
                  value={privateData.claimDescription}
                  onChange={e => setPrivateData({...privateData, claimDescription: e.target.value})}
                />
              </div>
              
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mt-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-300">Confidential Inputs</span>
                  <Badge variant="danger" className="bg-red-500/10 text-red-400 border-red-500/20">Never leaves device</Badge>
                </div>
                {privateData.policyId ? (() => {
                  const sel = policies.find(p => p.policyId === privateData.policyId);
                  if (!sel) return null;
                  
                  const hasAge = sel.rules.some((r: any) => r.condition === 'age');
                  const hasAmount = sel.rules.some((r: any) => r.condition === 'claim_amount');
                  const hasHours = sel.rules.some((r: any) => r.condition === 'hospitalization_hours');
                  
                  return (
                    <div className={`grid gap-4 ${[hasAge, hasAmount, hasHours].filter(Boolean).length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      {hasAge && (
                        <div>
                          <label className="block text-xs font-medium mb-1.5 text-slate-400">Patient Age</label>
                          <input type="number" className="w-full p-2.5 text-sm border border-slate-700/50 rounded-lg bg-slate-950/80 text-slate-100 focus:border-amber-500/50 outline-none transition-colors" value={privateData.age} onChange={e => setPrivateData({...privateData, age: Number(e.target.value)})} />
                        </div>
                      )}
                      {hasAmount && (
                        <div>
                          <label className="block text-xs font-medium mb-1.5 text-slate-400">Bill Amount (₹)</label>
                          <input type="number" className="w-full p-2.5 text-sm border border-slate-700/50 rounded-lg bg-slate-950/80 text-slate-100 focus:border-amber-500/50 outline-none transition-colors" value={privateData.claim_amount} onChange={e => setPrivateData({...privateData, claim_amount: Number(e.target.value)})} />
                        </div>
                      )}
                      {hasHours && (
                        <div>
                          <label className="block text-xs font-medium mb-1.5 text-slate-400">Hospitalization (Hrs)</label>
                          <input type="number" className="w-full p-2.5 text-sm border border-slate-700/50 rounded-lg bg-slate-950/80 text-slate-100 focus:border-amber-500/50 outline-none transition-colors" value={privateData.hospitalization_hours} onChange={e => setPrivateData({...privateData, hospitalization_hours: Number(e.target.value)})} />
                        </div>
                      )}
                    </div>
                  );
                })() : (
                  <p className="text-sm text-slate-500 italic">Select a policy to view required inputs.</p>
                )}
              </div>

              {step === 1 && (
                <button 
                  className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl py-3.5 px-4 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none" 
                  onClick={handleAiAnalysis} 
                  disabled={!privateData.policyId || loading}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  Analyze with AI Model <ArrowRight size={18} className="ml-2" />
                </button>
              )}
            </div>
          </div>

          {/* STEP 2: AI */}
          {step >= 2 && (
            <div className={`glass-panel p-6 rounded-3xl transition-opacity duration-300 animate-in fade-in slide-in-from-bottom-4 ${step > 2 ? 'opacity-60 pointer-events-none' : ''}`}>
              <h2 className="text-xl font-bold mb-5 flex items-center gap-3 text-slate-200">
                <span className="bg-amber-500 text-slate-950 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)]">2</span>
                AI Classification
              </h2>
              {aiAnalysis ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/80 border border-slate-700/50 rounded-xl flex flex-col justify-center">
                      <span className="font-medium text-xs text-slate-400 uppercase tracking-wider mb-1">Detected Category</span>
                      <span className="text-lg font-bold text-amber-400">{aiAnalysis.category}</span>
                    </div>
                    <div className="p-4 bg-slate-900/80 border border-slate-700/50 rounded-xl flex flex-col justify-center">
                      <span className="font-medium text-xs text-slate-400 uppercase tracking-wider mb-1">Confidence Score</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-emerald-400">{(aiAnalysis.confidence * 100).toFixed(0)}%</span>
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${aiAnalysis.confidence * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {step === 2 && (
                    <button 
                      className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl py-3.5 px-4 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none" 
                      onClick={handleGenerateProof} 
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                      Generate ZK Proof <Shield size={18} className="ml-2" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                  <Loader2 className="animate-spin text-amber-500" size={32} />
                  <span className="text-sm text-slate-400">Analyzing context securely...</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Submit */}
          {step >= 3 && (
            <div className="glass-panel p-6 rounded-3xl animate-in fade-in slide-in-from-bottom-4 border-amber-500/30">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-3 text-slate-200">
                <span className="bg-amber-500 text-slate-950 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)]">3</span>
                Submit Proof
              </h2>
              {zkProof ? (
                <div className="space-y-5 text-center py-2">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-emerald-400">Valid ZK Proof Generated</p>
                    <p className="text-sm text-slate-400">Your privacy is mathematically guaranteed.</p>
                  </div>
                  
                  <div className="bg-slate-950/80 border border-slate-700/50 p-4 rounded-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <p className="text-xs font-mono text-slate-400 break-all text-left">
                      <span className="text-amber-500/80">Proof ID:</span> {zkProof.proofId}<br/>
                      <span className="text-amber-500/80">Verifier:</span> {zkProof.verifierString}
                    </p>
                  </div>

                  <button 
                    className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl py-3.5 px-4 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none" 
                    onClick={handleSubmit} 
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                    Submit to Insurer Network <ArrowRight size={18} className="ml-2" />
                  </button>
                </div>
              ) : loading ? (
                 <div className="flex flex-col items-center justify-center py-8 gap-4">
                   <div className="relative w-12 h-12">
                     <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                   </div>
                   <span className="text-sm font-medium text-amber-400/80 animate-pulse">Running Midnight Compact Circuit...</span>
                 </div>
              ) : (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-xl">!</span>
                  </div>
                  <div className="text-red-400 font-bold text-lg mb-1">Proof Generation Failed</div>
                  <div className="text-red-400/70 text-sm">Policy conditions were not met.</div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right: Terminal Log */}
        <div className="lg:col-span-2 h-[400px] lg:h-[calc(100vh-120px)] lg:sticky lg:top-24">
          <div className="bg-[#020617] border border-slate-800 rounded-2xl h-full flex flex-col overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
            
            <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 font-mono text-xs">
                <Shield size={14} className="text-amber-500" />
                <span>Midnight_ZK_Simulator</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
              </div>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto font-mono text-sm space-y-3">
              {log.length === 0 ? (
                <p className="text-slate-600 italic">Waiting for operations...</p>
              ) : (
                log.map((msg, i) => (
                  <div key={i} className="animate-in fade-in slide-in-from-bottom-1 text-slate-300">
                    <span className="text-emerald-500 mr-2 font-bold">❯</span>
                    <span className={msg.includes('Error') || msg.includes('Failed') ? 'text-red-400' : msg.includes('success') || msg.includes('Valid') ? 'text-emerald-400' : ''}>
                      {msg}
                    </span>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex items-center gap-2 text-amber-500 mt-2">
                  <span className="text-emerald-500 font-bold">❯</span>
                  <span className="animate-pulse">_</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
