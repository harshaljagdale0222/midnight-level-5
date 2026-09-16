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
      
      if (!midnightObj) {
        throw new Error("1AM Wallet extension not found! Please install it from the Chrome Web Store.");
      }

      // Log the full wallet structure so we can debug
      console.log("=== MIDNIGHT WALLET STRUCTURE ===");
      console.log("window.midnight:", midnightObj);
      console.log("Keys:", Object.keys(midnightObj));
      Object.keys(midnightObj).forEach(key => {
        console.log(`window.midnight.${key}:`, midnightObj[key]);
        console.log(`  typeof:`, typeof midnightObj[key]);
        if (typeof midnightObj[key] === 'object' && midnightObj[key]) {
          console.log(`  methods:`, Object.keys(midnightObj[key]));
        }
      });

      let providerKey = 'mnLace';
      let walletProvider = window.midnight?.mnLace;
      
      // Fallback to 1AM if Lace is not found
      if (!walletProvider && window.midnight) {
        providerKey = Object.keys(window.midnight).find(key => key.toLowerCase().includes('1am')) 
                            || Object.keys(window.midnight)[0];
        walletProvider = (window.midnight as any)[providerKey];
      }

      if (!walletProvider) {
        throw new Error("Midnight Wallet not found! Please install Lace or 1AM extension.");
      }

      let api: any = null;
      let walletAddress = "";

      // Trigger the ACTUAL wallet popup
      if (typeof walletProvider.enable === 'function') {
        console.log("Calling enable()...");
        api = await walletProvider.enable();
      } else if (typeof walletProvider.request === 'function') {
        console.log("Calling request()...");
        api = await walletProvider.request({ method: 'midnight_requestAccounts' });
      } else if (typeof walletProvider.connect === 'function') {
        console.log("Calling connect()...");
        api = await walletProvider.connect();
      } else {
        throw new Error("Could not find a valid connect method on the wallet.");
      }

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

      setAddress(walletAddress);
      localStorage.setItem('midnightWallet', walletAddress);
      setConnecting(false);
      router.push('/login');

    } catch (err: any) {
      console.error("Wallet connection failed:", err);
      // Give a user-friendly message when wallet is locked or request is rejected
      if (err.message && err.message.includes('Request failed')) {
        setError('Wallet locked or request rejected. Please unlock it.');
      } else {
        setError(err.message || 'Connection rejected or failed');
      }
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    localStorage.removeItem('midnightWallet');
  };

  if (address) {
    // Shorten long addresses like: mnXyz...abcd
    const displayAddr = address.length > 16 
      ? `${address.slice(0, 8)}...${address.slice(-4)}`
      : address;

    return (
      <div className="flex items-center gap-3">
        <div 
          className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 cursor-default"
          title={address}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
          {displayAddr}
        </div>
        <button 
          onClick={disconnect}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors"
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

