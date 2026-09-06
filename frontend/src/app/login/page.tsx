"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, Button } from '@/components/ui';
import { Shield, Briefcase, FileSearch } from 'lucide-react';

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
        // Mock session storage
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        
        // Route to respective dashboard
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
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground">Select Demo Role</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            For this hackathon prototype, authentication is mocked. Select a role below to enter the application.
          </p>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4 text-left">
          <Card className="hover:border-brand-500 cursor-pointer transition-colors p-0 overflow-hidden">
            <button 
              className="w-full h-full text-left p-6 flex items-start gap-4"
              onClick={() => handleLogin('CLAIMANT')}
              disabled={loading}
            >
              <div className="bg-brand-100 text-brand-600 p-3 rounded-lg flex-shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Claimant</h3>
                <p className="text-sm text-gray-500 mt-1">Submit claims, manage privacy, and generate zero-knowledge proofs locally.</p>
              </div>
            </button>
          </Card>

          <Card className="hover:border-brand-500 cursor-pointer transition-colors p-0 overflow-hidden">
            <button 
              className="w-full h-full text-left p-6 flex items-start gap-4"
              onClick={() => handleLogin('INSURER')}
              disabled={loading}
            >
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg flex-shrink-0">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Insurer</h3>
                <p className="text-sm text-gray-500 mt-1">Verify zero-knowledge proofs without seeing underlying sensitive data.</p>
              </div>
            </button>
          </Card>
          
          <Card className="hover:border-brand-500 cursor-pointer transition-colors p-0 overflow-hidden">
            <button 
              className="w-full h-full text-left p-6 flex items-start gap-4"
              onClick={() => handleLogin('AUDITOR')}
              disabled={loading}
            >
              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg flex-shrink-0">
                <FileSearch size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Auditor</h3>
                <p className="text-sm text-gray-500 mt-1">Review immutable verification logs to ensure compliance and transparency.</p>
              </div>
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
