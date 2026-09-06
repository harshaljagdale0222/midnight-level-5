"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, Button, Badge, StatusIcon } from '@/components/ui';
import { ShieldCheck, FileCheck, XCircle, Clock } from 'lucide-react';

export default function InsurerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = () => {
    api.getClaims('INSURER')
      .then(data => {
        setClaims(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'INSURER') {
      router.push('/login');
      return;
    }
    
    setUser(parsedUser);
    fetchClaims();
  }, [router]);

  const handleVerify = async (claimId: string, proof: any) => {
    try {
      await api.verifyClaim(claimId, { proofId: proof, verifierString: proof }, user.id);
      fetchClaims();
    } catch (err) {
      console.error(err);
      alert('Verification failed due to a network error.');
    }
  };

  if (loading || !user) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const totalClaims = claims.length;
  const verifiedClaims = claims.filter(c => c.status === 'VERIFIED').length;
  const pendingClaims = claims.filter(c => c.status === 'PENDING').length;
  const rejectedClaims = claims.filter(c => c.status === 'REJECTED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Insurer Dashboard</h1>
        <p className="text-gray-500 mt-1">Review and cryptographically verify claims without seeing private data.</p>
      </div>

      {/* Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 py-4">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"><FileCheck size={24} className="text-gray-600 dark:text-gray-400"/></div>
          <div><p className="text-sm font-medium text-gray-500">Total Claims</p><p className="text-2xl font-bold">{totalClaims}</p></div>
        </Card>
        <Card className="flex items-center gap-4 py-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg"><ShieldCheck size={24} className="text-green-600 dark:text-green-400"/></div>
          <div><p className="text-sm font-medium text-gray-500">ZK Verified</p><p className="text-2xl font-bold">{verifiedClaims}</p></div>
        </Card>
        <Card className="flex items-center gap-4 py-4">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg"><Clock size={24} className="text-yellow-600 dark:text-yellow-400"/></div>
          <div><p className="text-sm font-medium text-gray-500">Pending</p><p className="text-2xl font-bold">{pendingClaims}</p></div>
        </Card>
        <Card className="flex items-center gap-4 py-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg"><XCircle size={24} className="text-red-600 dark:text-red-400"/></div>
          <div><p className="text-sm font-medium text-gray-500">Rejected</p><p className="text-2xl font-bold">{rejectedClaims}</p></div>
        </Card>
      </div>

      {/* Claims Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-border bg-gray-50 dark:bg-gray-800/30">
          <h2 className="text-xl font-bold">Recent Claims</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Claim ID</th>
                <th className="p-4 font-semibold">Policy</th>
                <th className="p-4 font-semibold">AI Classification</th>
                <th className="p-4 font-semibold">Timestamp</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {claims.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No claims found.</td>
                </tr>
              ) : claims.map(claim => (
                <tr key={claim.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                  <td className="p-4 font-mono font-medium">{claim.id}</td>
                  <td className="p-4 font-medium">{claim.policy?.name || claim.policyId}</td>
                  <td className="p-4">
                    <Badge variant="default">{claim.category}</Badge>
                    {claim.aiConfidence && <span className="ml-2 text-xs text-gray-500">{(claim.aiConfidence * 100).toFixed(0)}% conf</span>}
                  </td>
                  <td className="p-4 text-gray-500">{new Date(claim.createdAt).toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex items-center font-medium">
                      <StatusIcon status={claim.status} />
                      {claim.status === 'PENDING' ? 'Pending' : claim.status === 'VERIFIED' ? 'Verified' : 'Rejected'}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {claim.status === 'PENDING' ? (
                      <Button variant="primary" onClick={() => handleVerify(claim.id, claim.zkProofId)}>
                        Verify Proof
                      </Button>
                    ) : (
                      <Link href={`/verification/${claim.id}`}>
                        <Button variant="outline">View Result</Button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
