import Link from 'next/link';
import { Button } from '@/components/ui';
import { Shield, CheckCircle, Database } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 max-w-7xl mx-auto space-y-32">
      
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-5xl mt-12 relative">
        {/* Subtle Gold Glow behind the hero text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[150px] rounded-full -z-10 animate-pulse-glow"></div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-slate-100 drop-shadow-md leading-tight">
          Verify Insurance Claims.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
            Reveal Less.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
          Prove that an insurance claim satisfies policy requirements without exposing unnecessary medical or financial information. Powered by <span className="text-amber-400 font-semibold">Midnight</span> zero-knowledge technology.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center font-bold rounded-full px-12 h-14 text-lg transition-all bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] border border-amber-300/50"
          >
            Try Demo
          </Link>
          <Link 
            href="/login?role=insurer" 
            className="inline-flex items-center justify-center font-bold rounded-full px-12 h-14 text-lg transition-all border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50"
          >
            Verify a Claim
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 w-full">
        {[
          { icon: Shield, title: "Absolute Privacy", desc: "Sensitive medical and financial data stays securely on your device. Never share raw information unnecessarily.", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          { icon: CheckCircle, title: "Cryptographic Trust", desc: "Insurers can mathematically verify that policy conditions are met with 100% certainty via zero-knowledge proofs.", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { icon: Database, title: "Immutable Auditability", desc: "Immutable audit trails ensure transparency without compromising claimant privacy. Perfect for strict regulatory compliance.", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" }
        ].map((feature, i) => (
          <div key={i} className={`glass-panel p-8 rounded-3xl space-y-5 transition-transform hover:-translate-y-2 duration-300 border-t ${feature.border} shadow-2xl`}>
            <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center border ${feature.border}`}>
              <feature.icon size={28} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-100">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Architecture */}
      <section id="architecture" className="w-full space-y-12 pb-20">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100">Architecture</h2>
          <p className="text-amber-400/80 text-xl font-light tracking-wide uppercase">Privacy-first claim verification</p>
        </div>

        <div className="max-w-5xl mx-auto glass-panel rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl border-t border-amber-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 text-center relative z-10">
            
            {/* Claimant Side */}
            <div className="flex-1 space-y-6 bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-inner">
              <h4 className="font-bold text-xl text-amber-400 tracking-wide uppercase">Claimant Environment</h4>
              <div className="text-sm bg-slate-950/80 text-slate-300 py-3 px-4 rounded-xl border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <span className="text-red-400 font-bold mr-2">🔒</span> PRIVATE DATA
              </div>
              <div className="text-slate-500">↓</div>
              <div className="text-sm bg-slate-800/80 py-3 px-4 rounded-xl border border-slate-600 font-medium text-slate-200">
                AI Claim Analysis
              </div>
              <div className="text-slate-500">↓</div>
              <div className="text-sm bg-slate-800/80 py-3 px-4 rounded-xl border border-slate-600 font-medium text-slate-200">
                Policy Rule Engine &<br/>ZK Proof Generator
              </div>
            </div>

            {/* Network Layer */}
            <div className="flex flex-col items-center justify-center px-2 py-8 md:py-0 relative">
               <div className="hidden md:block h-px w-24 bg-gradient-to-r from-slate-700 via-amber-500 to-slate-700 absolute top-1/2 left-1/4 -z-10"></div>
               <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 px-6 py-3 rounded-full font-bold text-sm z-10 shadow-[0_0_30px_rgba(245,158,11,0.3)] whitespace-nowrap animate-float border border-amber-300/50">
                  MIDNIGHT ZK PROOF
               </div>
               <div className="hidden md:block h-px w-24 bg-gradient-to-r from-slate-700 via-emerald-500 to-slate-700 absolute top-1/2 right-1/4 -z-10"></div>
               
               <div className="text-xs mt-4 text-amber-200 font-semibold bg-amber-900/30 px-3 py-1.5 rounded-lg border border-amber-500/20 backdrop-blur-sm">
                  CRYPTOGRAPHIC TRUTH ONLY
               </div>
            </div>

            {/* Insurer Side */}
            <div className="flex-1 space-y-6 bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-inner">
               <div className="flex justify-between items-center w-full">
                 <h4 className="font-bold text-xl text-blue-400 tracking-wide uppercase">Insurer</h4>
                 <h4 className="font-bold text-xl text-emerald-400 tracking-wide uppercase">Auditor</h4>
               </div>
               
               <div className="text-slate-500 text-center">↓</div>
               <div className="flex gap-4">
                  <div className="flex-1 text-sm bg-slate-800/80 py-3 px-4 rounded-xl border border-slate-600 font-medium text-slate-200">
                    Proof Verification
                  </div>
                  <div className="flex-1 text-sm bg-slate-800/80 py-3 px-4 rounded-xl border border-slate-600 font-medium text-slate-200">
                    Audit Record
                  </div>
               </div>
               <div className="text-sm bg-emerald-500/10 text-emerald-400 py-3 px-4 rounded-xl font-bold border border-emerald-500/20 mt-6 text-center shadow-[0_0_15px_rgba(16,185,129,0.15)] tracking-wide">
                 ✓ ELIGIBILITY CONFIRMED
               </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
