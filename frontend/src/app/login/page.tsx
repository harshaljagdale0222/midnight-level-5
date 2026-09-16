"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Shield, Briefcase, FileSearch, ArrowLeft, ChevronRight } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (role: 'CLAIMANT' | 'INSURER' | 'AUDITOR') => {
    setLoading(true);
    setError('');
    
    try {
      const res = await api.login(role);
      
      if (res.token && res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        
        if (role === 'CLAIMANT') router.push('/claimant');
        if (role === 'INSURER') router.push('/insurer');
        if (role === 'AUDITOR') router.push('/auditor');
      } else {
        setError('Login failed. Check backend connection.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection refused. Is the backend running on port 3001?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full -z-10 pointer-events-none"></div>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-12 items-center lg:items-stretch">
        
        {/* Left Side: Context */}
        <div className="flex-1 flex flex-col justify-center space-y-6 text-center lg:text-left">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-amber-400 transition-colors w-fit mx-auto lg:mx-0 font-medium group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">Workspace</span>
          </h2>
          <p className="text-lg text-slate-400 font-light leading-relaxed max-w-md mx-auto lg:mx-0">
            Choose a role below to explore the PrivacyGuard ecosystem. Authentication is mocked for this hackathon prototype.
          </p>
          
          {error && (
            <div className="p-4 bg-red-950/50 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium flex items-center justify-center lg:justify-start gap-2 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              {error}
            </div>
          )}
        </div>

        {/* Right Side: Role Selection Cards */}
        <div className="flex-1 w-full max-w-md space-y-4">
          <button 
            className="w-full text-left group relative p-[1px] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100"
            onClick={() => handleLogin('CLAIMANT')}
            disabled={loading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/50 to-amber-600/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative h-full bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl flex items-center gap-5 border border-slate-700/50 group-hover:border-transparent transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform">
                <Shield size={26} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-slate-100 mb-1 group-hover:text-amber-400 transition-colors">Claimant</h3>
                <p className="text-sm text-slate-400 leading-snug group-hover:text-slate-300">Submit claims & generate ZK proofs locally.</p>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-amber-400 transition-colors" />
            </div>
          </button>

          <button 
            className="w-full text-left group relative p-[1px] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100"
            onClick={() => handleLogin('INSURER')}
            disabled={loading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/50 to-teal-600/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative h-full bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl flex items-center gap-5 border border-slate-700/50 group-hover:border-transparent transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 text-slate-950 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)] group-hover:scale-110 transition-transform">
                <Briefcase size={26} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-slate-100 mb-1 group-hover:text-teal-400 transition-colors">Insurer</h3>
                <p className="text-sm text-slate-400 leading-snug group-hover:text-slate-300">Verify proofs without seeing sensitive data.</p>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-teal-400 transition-colors" />
            </div>
          </button>
          
          <button 
            className="w-full text-left group relative p-[1px] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100"
            onClick={() => handleLogin('AUDITOR')}
            disabled={loading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-blue-600/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative h-full bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl flex items-center gap-5 border border-slate-700/50 group-hover:border-transparent transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 text-slate-950 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(96,165,250,0.3)] group-hover:scale-110 transition-transform">
                <FileSearch size={26} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-slate-100 mb-1 group-hover:text-blue-400 transition-colors">Auditor</h3>
                <p className="text-sm text-slate-400 leading-snug group-hover:text-slate-300">Review immutable verification logs.</p>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-blue-400 transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
