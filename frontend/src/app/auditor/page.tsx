"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, Badge } from '@/components/ui';
import { FileSearch, ShieldCheck, XCircle } from 'lucide-react';

export default function AuditorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'AUDITOR') {
      router.push('/login');
      return;
    }
    
    setUser(parsedUser);
    
    api.getAuditLogs()
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [router]);

  if (loading || !user) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileSearch className="text-purple-600" /> Auditor Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Review immutable verification logs. No sensitive personal data is accessible here.</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-border bg-gray-50 dark:bg-gray-800/30">
          <h2 className="text-xl font-bold">Verification Event Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Event ID</th>
                <th className="p-4 font-semibold">Timestamp</th>
                <th className="p-4 font-semibold">Claim ID</th>
                <th className="p-4 font-semibold">Policy (Version)</th>
                <th className="p-4 font-semibold">ZK Proof Status</th>
                <th className="p-4 font-semibold">Verifier (Node)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-sm">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center font-sans text-gray-500">No audit logs found.</td>
                </tr>
              ) : logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                  <td className="p-4 font-medium text-gray-700 dark:text-gray-300">{log.verificationId}</td>
                  <td className="p-4 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4">{log.claimId}</td>
                  <td className="p-4">{log.policyId} <span className="text-xs text-gray-400">v{log.policyVersion}</span></td>
                  <td className="p-4">
                    {log.proofStatus === 'VALID' ? (
                      <span className="flex items-center text-green-600 font-semibold font-sans">
                        <ShieldCheck size={16} className="mr-1" /> VALID
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 font-semibold font-sans">
                        <XCircle size={16} className="mr-1" /> INVALID
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500 truncate max-w-[150px]" title={log.verifier}>
                    {log.verifier}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-300">
        <strong>Security Notice:</strong> As per PrivacyGuard architecture, auditors only have access to cryptographically verified policy compliance events. Raw medical or financial data is never exposed to the auditor node.
      </div>
    </div>
  );
}
