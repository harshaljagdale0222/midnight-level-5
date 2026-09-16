import Link from 'next/link';
import { Shield, CheckCircle, Database, ArrowRight, Activity, FileCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 max-w-7xl mx-auto space-y-32">
      
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-5xl mt-8 relative">
        {/* Subtle Gold Glow behind the hero text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full -z-10 animate-pulse-glow"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-amber-500/20 text-amber-400 text-sm font-semibold tracking-wide backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <Activity size={16} /> Privacy-First Web3 Insurance
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-slate-100 drop-shadow-lg leading-[1.1]">
          Verify Claims.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
            Reveal Nothing.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
          Prove that an insurance claim satisfies policy requirements without exposing your underlying medical or financial data. Powered by <span className="text-amber-400 font-semibold border-b border-amber-400/30">Midnight</span> zero-knowledge technology.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <Link 
            href="/login" 
            className="group inline-flex items-center justify-center font-bold rounded-full px-10 h-14 text-lg transition-all bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:-translate-y-1"
          >
            Enter App <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
          <Link 
            href="#architecture" 
            className="inline-flex items-center justify-center font-semibold rounded-full px-10 h-14 text-lg transition-all bg-slate-900/50 backdrop-blur-md border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-500 hover:-translate-y-1 shadow-lg"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 w-full relative z-10">
        {[
          { icon: Shield, title: "Absolute Privacy", desc: "Sensitive medical and financial data stays securely on your device. Never share raw information unnecessarily.", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]" },
          { icon: CheckCircle, title: "Cryptographic Trust", desc: "Insurers can mathematically verify that policy conditions are met with 100% certainty via zero-knowledge proofs.", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", glow: "group-hover:shadow-[0_0_30px_rgba(45,212,191,0.2)]" },
          { icon: Database, title: "Immutable Auditability", desc: "Immutable audit trails ensure transparency without compromising claimant privacy. Perfect for strict regulatory compliance.", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "group-hover:shadow-[0_0_30px_rgba(96,165,250,0.2)]" }
        ].map((feature, i) => (
          <div key={i} className={`group glass-panel p-8 rounded-3xl space-y-5 transition-all duration-300 hover:-translate-y-2 border border-slate-800 hover:border-slate-600 ${feature.glow}`}>
            <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center border ${feature.border} transition-transform group-hover:scale-110`}>
              <feature.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-100 group-hover:text-white transition-colors">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Architecture */}
      <section id="architecture" className="w-full space-y-16 pb-24 pt-10">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100">How PrivacyGuard Works</h2>
          <p className="text-amber-400 text-lg font-medium tracking-widest uppercase">Zero-Knowledge Architecture</p>
        </div>

        <div className="max-w-5xl mx-auto glass-panel rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl border border-slate-800/80">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-8 md:gap-4 text-center relative z-10">
            
            {/* Claimant Side */}
            <div className="flex-1 flex flex-col space-y-6 bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/60 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
              <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-lg tracking-wide uppercase mb-2">
                <Shield size={20} /> Claimant App
              </div>
              
              <div className="text-sm bg-slate-950 text-slate-300 py-4 px-4 rounded-xl border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)] flex items-center justify-center gap-3">
                <span className="text-red-400 font-bold text-lg">🔒</span> 
                <span className="font-medium">Private Health Data</span>
              </div>
              
              <div className="text-slate-500 animate-bounce">↓</div>
              
              <div className="text-sm bg-slate-800 py-4 px-4 rounded-xl border border-slate-600 font-medium text-slate-200">
                AI Classification Model
              </div>
              
              <div className="text-slate-500 animate-bounce">↓</div>
              
              <div className="text-sm bg-gradient-to-b from-slate-800 to-slate-900 py-4 px-4 rounded-xl border border-amber-500/30 font-medium text-slate-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                Midnight ZK Circuit<br/><span className="text-xs text-amber-400/80 font-normal">(Generates Proof)</span>
              </div>
            </div>

            {/* Network Layer */}
            <div className="flex flex-col items-center justify-center px-2 py-8 md:py-0 relative min-w-[200px]">
               <div className="hidden md:block h-px w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent absolute top-1/2 left-0 -z-10 opacity-50"></div>
               
               <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 px-6 py-4 rounded-2xl font-bold text-sm z-10 shadow-[0_0_30px_rgba(245,158,11,0.3)] whitespace-nowrap animate-float border border-amber-300/50 flex flex-col items-center gap-1">
                  <FileCheck size={24} className="mb-1 opacity-80" />
                  ZK PROOF
               </div>
               
               <div className="text-xs mt-6 text-amber-200 font-semibold bg-amber-900/40 px-4 py-2 rounded-lg border border-amber-500/30 backdrop-blur-md">
                  100% PRIVATE & VERIFIABLE
               </div>
            </div>

            {/* Insurer Side */}
            <div className="flex-1 flex flex-col space-y-6 bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/60 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
               <div className="flex items-center justify-center gap-2 text-teal-400 font-bold text-lg tracking-wide uppercase mb-2">
                 <Database size={20} /> Verification Network
               </div>
               
               <div className="flex gap-4 mt-auto pt-4">
                  <div className="flex-1 text-sm bg-slate-800 py-4 px-2 rounded-xl border border-slate-600 font-medium text-slate-200">
                    Insurer Node
                  </div>
                  <div className="flex-1 text-sm bg-slate-800 py-4 px-2 rounded-xl border border-slate-600 font-medium text-slate-200">
                    Auditor Node
                  </div>
               </div>
               
               <div className="text-slate-500 animate-bounce text-center">↓</div>
               
               <div className="text-sm bg-teal-500/10 text-teal-400 py-4 px-4 rounded-xl font-bold border border-teal-500/30 mt-6 text-center shadow-[0_0_20px_rgba(20,184,166,0.15)] tracking-wide flex items-center justify-center gap-2">
                 <CheckCircle size={18} /> ELIGIBILITY CONFIRMED
               </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
