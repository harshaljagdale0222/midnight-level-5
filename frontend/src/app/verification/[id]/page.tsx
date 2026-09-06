"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, Button, Badge } from '@/components/ui';
import { ShieldCheck, ArrowLeft, Lock, CheckCircle, XCircle } from 'lucide-react';

export default function VerificationDetails() {
  const params = useParams();
  const router = useRouter();
  const [claim, setClaim] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: In a real app we'd fetch a single claim by ID.
    // For this demo, we'll fetch all and find it.
    api.getClaims('INSURER')
      .then(claims => {
        const found = claims.find((c: any) => c.id === params.id);
        if (found) setClaim(found);
        setLoading(false);
      })
      .catch(console.error);
  }, [params.id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading verification details...</div>;
  if (!claim) return <div className="p-8 text-center text-red-500">Claim not found.</div>;

  const isVerified = claim.status === 'VERIFIED';
  const isRejected = claim.status === 'REJECTED';
  const failedConditionText = claim.failedCondition ? claim.failedCondition : 'None';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft size={16} className="mr-2" /> Back
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Claim Verification</h1>
          <p className="text-gray-500 font-mono mt-2">Claim ID: {claim.id}</p>
        </div>
        <Badge variant={isVerified ? 'success' : isRejected ? 'danger' : 'warning'}>
          {claim.status}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Policy Conditions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Policy Evaluation</h2>
          
          <Card className="space-y-4">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 border-b border-border pb-2">
              Policy: {claim.policy?.name || claim.policyId}
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Policy Active</span>
                {isRejected && failedConditionText.includes('policy_active') ? <XCircle className="text-red-500" size={18}/> : <CheckCircle className="text-green-500" size={18}/>}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Coverage Condition</span>
                {isRejected && failedConditionText.includes('claim_category') ? <XCircle className="text-red-500" size={18}/> : <CheckCircle className="text-green-500" size={18}/>}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Claim Limit</span>
                {isRejected && failedConditionText.includes('claim_amount') ? <XCircle className="text-red-500" size={18}/> : <CheckCircle className="text-green-500" size={18}/>}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Eligibility (Time/Rules)</span>
                {isRejected && failedConditionText.includes('hospitalization') ? <XCircle className="text-red-500" size={18}/> : <CheckCircle className="text-green-500" size={18}/>}
              </div>
            </div>
            
            {isRejected && (
               <div className="mt-4 p-3 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-sm rounded border border-red-200 dark:border-red-800">
                 <strong>Failed Condition:</strong> {failedConditionText}
               </div>
            )}
          </Card>
        </div>

        {/* ZK Proof Details */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Zero-Knowledge Proof</h2>
          
          <Card className="bg-gray-50 dark:bg-[#0f172a] border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border mb-6">
              {isVerified ? (
                <div className="text-center">
                  <ShieldCheck size={48} className="text-green-500 mx-auto mb-2" />
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">PROOF VALID</span>
                </div>
              ) : isRejected ? (
                <div className="text-center">
                  <XCircle size={48} className="text-red-500 mx-auto mb-2" />
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">PROOF INVALID</span>
                </div>
              ) : (
                <span className="text-gray-500">Proof pending verification</span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-sm text-gray-500">Status</span>
                <span className="font-mono text-sm font-medium">{claim.status}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-sm text-gray-500">Sensitive Data</span>
                <Badge variant="success" className="flex items-center gap-1"><Lock size={12}/> NOT REVEALED</Badge>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-sm text-gray-500">Verification Time</span>
                <span className="text-sm font-medium">{new Date(claim.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm text-gray-500">Policy Rule Version</span>
                <span className="text-sm font-medium">v{claim.policy?.version || '1.0'}</span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
