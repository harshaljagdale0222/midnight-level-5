"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, Button, Badge, StatusIcon } from '@/components/ui';
import { Shield, Lock, FileText, Plus } from 'lucide-react';

export default function ClaimantDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'CLAIMANT') {
      router.push('/login');
      return;
    }
    
    setUser(parsedUser);
    
    // Fetch claims
    api.getClaims('CLAIMANT', parsedUser.id)
      .then(data => {
        setClaims(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  if (loading || !user) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Claimant Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user.name}</p>
        </div>
        <Link href="/claimant/submit">
          <Button><Plus size={18} className="mr-2"/> Submit New Claim</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Claims */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText size={20} className="text-brand-600"/>
            My Claims
          </h2>
          
          {claims.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-500">No claims submitted yet.</p>
              <Link href="/claimant/submit">
                <Button variant="outline" className="mt-4">Start your first claim</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {claims.map((claim) => (
                <Card key={claim.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-gray-500">{claim.id}</span>
                      <Badge variant="default">{claim.category}</Badge>
                    </div>
                    <h3 className="font-bold text-lg">{claim.policy?.name || 'Unknown Policy'}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted on {new Date(claim.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <div className="flex items-center text-sm font-medium">
                      <StatusIcon status="VALID" />
                      ZK Proof Valid
                    </div>
                    <div className="flex items-center text-sm font-medium">
                      <StatusIcon status={claim.status} />
                      {claim.status === 'PENDING' ? 'Pending Review' : claim.status === 'VERIFIED' ? 'Verified by Insurer' : 'Rejected'}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Privacy Center */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield size={20} className="text-green-600"/>
            Privacy Center
          </h2>
          <Card className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 pb-2 border-b border-gray-200 dark:border-gray-700">
                Data exposure settings for your claims:
              </p>
              
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium flex items-center gap-2"><Lock size={14} className="text-gray-500"/> Raw Medical Data</span>
                <Badge variant="danger">PRIVATE</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium flex items-center gap-2"><Lock size={14} className="text-gray-500"/> Financial Information</span>
                <Badge variant="danger">PRIVATE</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Raw Data Shared</span>
                <Badge variant="danger">NO</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Verification Proof</span>
                <Badge variant="success">YES</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
