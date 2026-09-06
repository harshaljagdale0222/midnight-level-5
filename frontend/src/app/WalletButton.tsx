"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function WalletButton() {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('midnightWallet');
    if (saved) setAddress(saved);
  }, []);

  const connectWallet = async () => {
    setConnecting(true);
    setError('');
    
    try {
      // @ts-ignore
      const midnightObj = window.midnight;
      
      if (!midnightObj || Object.keys(midnightObj).length === 0) {
        throw new Error("Midnight Wallet (1AM / Lace) not found. Please install the browser extension.");
      }

      // Detect 1AM wallet key, or fallback to first available
      const providerKey = Object.keys(midnightObj).find(key => key.toLowerCase().includes('1am')) 
                          || Object.keys(midnightObj).find(key => key.toLowerCase().includes('lace'))
                          || Object.keys(midnightObj)[0];
                          
      const walletProvider = midnightObj[providerKey];
      console.log(`Found Midnight wallet provider: "${providerKey}"`, walletProvider);

      let api: any = walletProvider;
      let walletAddress = "Connected Wallet";

      // Pattern 1: Standard EIP-1193 style - has enable() method
      if (typeof walletProvider.enable === 'function') {
        api = await walletProvider.enable();
      }
      // Pattern 2: Has request() method (like MetaMask style)
      else if (typeof walletProvider.request === 'function') {
        await walletProvider.request({ method: 'midnight_enable' });
        api = walletProvider;
      }
      // Pattern 3: Has serviceWorker or isEnabled - already active
      else if (walletProvider.isEnabled || walletProvider.serviceWorker) {
        api = walletProvider;
      }
      // Pattern 4: Direct provider object with state()
      else {
        api = walletProvider;
      }

      // Try to get address from state
      if (api && typeof api.state === 'function') {
        const state = await api.state();
        if (state?.address) walletAddress = state.address;
      } else if (api && typeof api.getAddress === 'function') {
        walletAddress = await api.getAddress();
      } else if (api && api.address) {
        walletAddress = api.address;
      } else {
        // Wallet connected but address not exposed - still mark as connected
        walletAddress = `${providerKey.toUpperCase()} Connected`;
      }

      setAddress(walletAddress);
      localStorage.setItem('midnightWallet', walletAddress);
      setConnecting(false);
      
      // Redirect to login/dashboard
      router.push('/login');

    } catch (err: any) {
      console.error("Wallet connection failed:", err);
      setError(err.message || 'Connection rejected or failed');
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    localStorage.removeItem('midnightWallet');
  };

  if (address) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 truncate max-w-[150px]">
          {address}
        </span>
        <button 
          onClick={disconnect}
          className="text-xs text-slate-400 hover:text-red-400 font-bold"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-400 mr-2 max-w-[200px] truncate" title={error}>{error}</span>}
      <button 
        onClick={connectWallet}
        disabled={connecting}
        className="text-sm font-bold bg-amber-500 text-slate-950 px-5 py-2 rounded-full hover:bg-amber-400 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.2)] disabled:opacity-50"
      >
        {connecting ? 'Waiting...' : 'Connect Midnight Wallet'}
      </button>
    </div>
  );
}

