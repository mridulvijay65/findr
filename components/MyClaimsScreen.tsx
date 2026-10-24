'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Lock, 
  Unlock, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  PlusCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { CampusItem } from '@/lib/campusData';
import { useAuth } from '@/context/auth-context';

interface MyClaimsScreenProps {
  items: CampusItem[];
  onOpenLockerModal: () => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
}

export function MyClaimsScreen({
  items,
  onOpenLockerModal,
  onOpenReportModal,
}: MyClaimsScreenProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'my_claims' | 'incoming_reviews' | 'my_reports'>('my_claims');
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);

  const [submittedClaims, setSubmittedClaims] = useState<any[]>([]);
  const [incomingReviews, setIncomingReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchClaimsData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/claims?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setSubmittedClaims(data.submittedClaims || []);
        setIncomingReviews(data.incomingReviews || []);
      }
    } catch (err) {
      console.warn('Error fetching claims data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaimsData();
  }, [user.id]);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedOtp(code);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  const handleReviewClaim = async (claimId: string, action: 'approve' | 'reject') => {
    try {
      setProcessingId(claimId);
      const res = await fetch(`/api/claims/${claimId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reviewerId: user.id,
          reviewNotes: action === 'approve' ? 'Proof verified by finder.' : 'Details did not match item features.',
        }),
      });

      if (res.ok) {
        setActionMessage(
          action === 'approve'
            ? '✅ Claim approved! Smart Locker retrieval OTP issued to claimant.'
            : '❌ Claim rejected.'
        );
        setTimeout(() => setActionMessage(null), 4000);
        await fetchClaimsData();
      } else {
        const err = await res.json();
        setActionMessage(`Error: ${err.error || 'Failed to review claim'}`);
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch (err) {
      console.warn('Review claim error:', err);
    } finally {
      setProcessingId(null);
    }
  };

  // Filter items reported by current user
  const myReportedItems = items.filter(
    (i) => i.reporterId === user.id || i.reporter?.toLowerCase().includes(user.name.toLowerCase().split(' ')[0])
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-surface-container shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Logged in as {user.name} ({user.role.toUpperCase()})</span>
          </span>
          <h1 className="font-headline font-black text-2xl text-on-surface mt-1">
            Custody Claims & Handover Center
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Review incoming ownership proofs, access your approved Smart Locker passcodes, and track your campus reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenReportModal('lost')}
            className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-bold transition-all border border-surface-container-highest cursor-pointer"
          >
            + New Report
          </button>
          <button
            onClick={onOpenLockerModal}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-secondary-container" />
            <span>Open Safe Locker</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-primary/10 text-primary text-xs font-bold rounded-xl border border-primary/20 flex items-center justify-between animate-in fade-in">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-outline hover:text-on-surface text-xs font-mono">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-surface-container overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('my_claims')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'my_claims'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          My Filed Claims ({submittedClaims.length})
        </button>

        <button
          onClick={() => setActiveTab('incoming_reviews')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'incoming_reviews'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          <span>Incoming Claims to Review ({incomingReviews.length})</span>
          {incomingReviews.filter(r => r.status === 'pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('my_reports')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'my_reports'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Reports Created by Me ({myReportedItems.length})
        </button>
      </div>

      {/* Tab 1: Claims Filed by Current User */}
      {activeTab === 'my_claims' && (
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl border border-surface-container p-8 text-center text-xs text-outline space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary" />
              <p>Loading your claim custody records...</p>
            </div>
          ) : submittedClaims.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-container p-8 text-center text-xs text-on-surface-variant space-y-2">
              <p className="font-bold">You haven&apos;t filed any item ownership claims yet.</p>
              <p className="text-outline">Browse the Live Feed or Map and click &quot;Claim Item&quot; when you spot your lost belonging.</p>
            </div>
          ) : (
            submittedClaims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white rounded-2xl border border-surface-container shadow-sm p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative flex-shrink-0 bg-surface-dim">
                    <Image
                      src={claim.item.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'}
                      alt={claim.item.title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-sm text-on-surface">
                        {claim.item.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          claim.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : claim.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {claim.item.location} · Reported by {claim.item.reporter?.name || 'Campus Student'}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-outline">
                      <span className="font-semibold text-on-surface">Your Proof:</span>
                      <span className="italic truncate max-w-xs">&quot;{claim.proofAnswer}&quot;</span>
                    </div>
                  </div>
                </div>

                {/* Locker Pass or Status Box */}
                {claim.status === 'approved' && claim.otpCode ? (
                  <div className="w-full md:w-auto bg-surface-container-low p-3.5 rounded-xl border border-surface-container flex items-center justify-between md:justify-end gap-4">
                    <div>
                      <span className="text-[10px] text-outline uppercase font-bold tracking-wider block">
                        {claim.item.lockerNumber || 'Safe Handover Hub #05'}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-base font-extrabold text-on-surface">
                          OTP: {claim.otpCode}
                        </span>
                        <button
                          onClick={() => handleCopy(claim.otpCode)}
                          className="p-1 rounded hover:bg-surface-container text-outline hover:text-on-surface cursor-pointer"
                          title="Copy OTP"
                        >
                          {copiedOtp === claim.otpCode ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={onOpenLockerModal}
                      className="px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Unlock Bay
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-surface-container-low rounded-xl text-xs text-outline border border-surface-container text-right">
                    {claim.status === 'pending' ? (
                      <span className="text-amber-700 font-medium">Awaiting finder verification</span>
                    ) : (
                      <span className="text-red-700 font-medium">Verification rejected</span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Incoming Claims to Review (Two-Way Handover Verification) */}
      {activeTab === 'incoming_reviews' && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 text-blue-900 text-xs rounded-xl border border-blue-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              <strong>Two-Way Custody Protocol:</strong> Only approve claims if the student&apos;s answer matches private features (color, engravings, stickers, screen lock).
            </span>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-surface-container p-8 text-center text-xs text-outline space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary" />
              <p>Loading incoming claims for your reports...</p>
            </div>
          ) : incomingReviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-container p-8 text-center text-xs text-on-surface-variant">
              No pending claims filed against your items yet.
            </div>
          ) : (
            incomingReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-surface-container shadow-sm p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {rev.claimant.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-on-surface">
                        Claimant: {rev.claimant.name} ({rev.claimant.department})
                      </h4>
                      <p className="text-[11px] text-on-surface-variant">
                        Filed claim for your report: <strong>{rev.item.title}</strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`self-start sm:self-auto px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      rev.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : rev.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Status: {rev.status}
                  </span>
                </div>

                {/* Submitted Proof Question & Answer Box */}
                <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container space-y-1.5">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                    Security Verification Question:
                  </span>
                  <p className="text-xs font-semibold text-on-surface">
                    {rev.item.verificationQuestion || 'Describe unique identifying features'}
                  </p>
                  <div className="mt-2 pt-2 border-t border-surface-container">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                      Claimant&apos;s Submitted Proof:
                    </span>
                    <p className="text-xs text-on-surface mt-0.5 bg-white p-2.5 rounded-lg border border-surface-container-highest font-mono">
                      &quot;{rev.proofAnswer}&quot;
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {rev.status === 'pending' && (
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleReviewClaim(rev.id, 'reject')}
                      disabled={processingId === rev.id}
                      className="px-4 py-2 rounded-lg bg-surface-container text-outline hover:text-red-700 hover:bg-red-50 text-xs font-bold transition-all border border-surface-container-highest flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Reject Proof</span>
                    </button>
                    <button
                      onClick={() => handleReviewClaim(rev.id, 'approve')}
                      disabled={processingId === rev.id}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Approve & Generate Locker Pass</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Reports Created by Me */}
      {activeTab === 'my_reports' && (
        <div className="space-y-4">
          {myReportedItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-container p-8 text-center text-xs text-on-surface-variant">
              You haven&apos;t filed any lost or found reports yet.
            </div>
          ) : (
            myReportedItems.map((item, idx) => (
              <div key={item.id} className="bg-white rounded-2xl border border-surface-container shadow-sm p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center font-bold text-secondary font-mono text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">{item.title}</h4>
                    <p className="text-[11px] text-on-surface-variant">{item.location} · {item.sector}</p>
                    <span className="text-[10px] text-outline">Reported {item.timeAgo} · Cloud DB Synced</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  item.status === 'Claimed' || item.status === 'Recovered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.status === 'Lost'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-secondary-fixed text-on-secondary-fixed'
                }`}>
                  {item.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
