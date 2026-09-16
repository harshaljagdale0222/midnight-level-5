"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function WalletButton() {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [showMockPopup, setShowMockPopup] = useState(false);
  const [pendingApi, setPendingApi] = useState<any>(null);
  const [pendingAddress, setPendingAddress] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem('midnightWallet');
    if (saved) setAddress(saved);
  }, []);

  const triggerRealConnection = async () => {
    setConnecting(true);
    setError('');
    
    try {
      // @ts-ignore
      const midnightObj = window.midnight;
      if (!midnightObj) throw new Error("1AM Wallet extension not found!");

      const providerKey = Object.keys(midnightObj).find(key => key.toLowerCase().includes('lace')) 
                          || Object.keys(midnightObj).find(key => key.toLowerCase().includes('1am'))
                          || Object.keys(midnightObj)[0];

      if (!providerKey) throw new Error("No Midnight wallet provider found");
                          
      const walletProvider = midnightObj[providerKey];
      let api: any = null;
      let walletAddress = "";

      // Try connection
      if (typeof walletProvider.enable === 'function') api = await walletProvider.enable();
      else if (typeof walletProvider.request === 'function') api = await walletProvider.request({ method: 'midnight_requestAccounts' });
      else if (typeof walletProvider.connect === 'function') api = await walletProvider.connect();
      else throw new Error("Could not connect");

      // Get address
      if (api && typeof api.state === 'function') {
        const state = await api.state();
        walletAddress = state?.address || "Connected";
      } else if (api && typeof api.getAddress === 'function') {
        walletAddress = await api.getAddress();
      } else if (api && api.address) {
        walletAddress = api.address;
      } else {
        walletAddress = `${providerKey} Connected`;
      }

      // Instead of connecting instantly, SHOW the Hackathon Mock Popup!
      setPendingApi(api);
      setPendingAddress(walletAddress);
      setShowMockPopup(true);
      setConnecting(false);

    } catch (err: any) {
      console.error("Wallet connection failed:", err);
      setError('Wallet locked or request rejected. Please unlock it.');
      setConnecting(false);
    }
  };

  const handleApprove = () => {
    setShowMockPopup(false);
    setAddress(pendingAddress);
    localStorage.setItem('midnightWallet', pendingAddress);
    router.push('/login');
  };

  const handleReject = () => {
    setShowMockPopup(false);
    setError('Connection rejected by user.');
  };

  const disconnect = () => {
    setAddress(null);
    localStorage.removeItem('midnightWallet');
  };

  return (
    <>
      {showMockPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-[350px] rounded-2xl shadow-2xl p-6 flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Midnight Wallet</h3>
            <p className="text-sm text-slate-400 text-center mb-6">
              <span className="text-emerald-400 font-semibold">PrivacyGuard</span> is requesting permission to connect to your wallet.
            </p>
            <div className="w-full flex gap-3">
              <button 
                onClick={handleReject}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-semibold"
              >
                Reject
              </button>
              <button 
                onClick={handleApprove}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {address ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            {address.length > 16 ? `${address.slice(0, 8)}...${address.slice(-4)}` : address}
          </div>
          <button onClick={disconnect} className="text-xs text-slate-500 hover:text-red-400 transition-colors">
            Disconnect
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-400 mr-2 max-w-[200px] truncate" title={error}>{error}</span>}
          <button 
            onClick={triggerRealConnection}
            disabled={connecting}
            className="text-sm font-bold bg-amber-500 text-slate-950 px-5 py-2 rounded-full hover:bg-amber-400 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.2)] disabled:opacity-50"
          >
            {connecting ? 'Waiting...' : 'Connect Midnight Wallet'}
          </button>
        </div>
      )}
    </>
  );
}
