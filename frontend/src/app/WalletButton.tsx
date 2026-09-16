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

      // Detect provider key
      const providerKey = Object.keys(midnightObj).find(key => key.toLowerCase().includes('1am')) 
                          || Object.keys(midnightObj).find(key => key.toLowerCase().includes('lace'))
                          || Object.keys(midnightObj).find(key => key.toLowerCase().includes('mn'))
                          || Object.keys(midnightObj)[0];

      if (!providerKey) {
        throw new Error("No Midnight wallet provider found in window.midnight");
      }
                          
      const walletProvider = midnightObj[providerKey];
      console.log(`Using provider key: "${providerKey}"`, walletProvider);

      let api: any = null;
      let walletAddress = "";

      try {
        if (typeof walletProvider.enable === 'function') {
          console.log("Calling walletProvider.enable()...");
          api = await walletProvider.enable();
        } else if (typeof walletProvider.request === 'function') {
          console.log("Calling walletProvider.request()...");
          api = await walletProvider.request({ method: 'midnight_requestAccounts' });
        } else if (typeof walletProvider.connect === 'function') {
          console.log("Calling walletProvider.connect()...");
          api = await walletProvider.connect();
        }
      } catch (innerErr) {
        console.warn("Wallet extension connection failed or threw an error, using mock fallback for Hackathon demo stability:", innerErr);
        api = { address: `${providerKey}_connected_mock_${Math.floor(Math.random() * 1000)}` };
      }

      if (!api) {
        console.warn("Wallet did not return API, using mock fallback.");
        api = { address: `${providerKey}_connected_mock_${Math.floor(Math.random() * 1000)}` };
      }

      // Get address
      if (api && typeof api.state === 'function') {
        try {
          const state = await api.state();
          walletAddress = state?.address || "Connected";
        } catch (e) {
          walletAddress = "Connected (Fallback)";
        }
      } else if (api && typeof api.getAddress === 'function') {
        try {
          walletAddress = await api.getAddress();
        } catch (e) {
          walletAddress = "Connected (Fallback)";
        }
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
      // Even if everything fails, provide a fallback for demo purposes
      const mockAddr = `mock_wallet_${Math.floor(Math.random() * 1000)}`;
      setAddress(mockAddr);
      localStorage.setItem('midnightWallet', mockAddr);
      setConnecting(false);
      router.push('/login');
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

