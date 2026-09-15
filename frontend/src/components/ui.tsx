import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-panel rounded-2xl p-8 ${className}`}>
      {children}
    </div>
  );
}

export function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '', 
  disabled = false 
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'; 
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  const base = "inline-flex items-center justify-center font-medium rounded-full px-6 py-2.5 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] border border-amber-300/50",
    secondary: "bg-slate-800/80 hover:bg-slate-700/80 text-amber-50 border border-amber-500/20 backdrop-blur-md shadow-inner",
    outline: "border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Badge({ children, variant = 'default', className = '' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'; className?: string }) {
  const variants = {
    default: "bg-slate-800/60 text-slate-300 border border-slate-700 backdrop-blur-sm shadow-inner",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    info: "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function StatusIcon({ status }: { status: string }) {
  if (status === 'VERIFIED' || status === 'VALID') {
    return <span className="text-emerald-400 mr-1.5 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] font-bold">✓</span>;
  }
  if (status === 'REJECTED' || status === 'INVALID') {
    return <span className="text-red-400 mr-1.5 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)] font-bold">✗</span>;
  }
  return <span className="text-amber-400 mr-1.5 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)] font-bold">⏱</span>;
}
