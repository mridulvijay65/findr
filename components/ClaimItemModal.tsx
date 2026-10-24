'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  MapPin, 
  CheckCircle2, 
  KeyRound, 
  Building2, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { CampusItem } from '@/lib/campusData';

interface ClaimItemModalProps {
  item: CampusItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessClaim: (itemId: string) => void;
}

export function ClaimItemModal({ item, isOpen, onClose, onSuccessClaim }: ClaimItemModalProps) {
  const [proofAnswer, setProofAnswer] = useState('');
  const [handoverMethod, setHandoverMethod] = useState<'locker' | 'security'>('locker');
  const [submitting, setSubmitting] = useState(false);
  const [claimedReceipt, setClaimedReceipt] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofAnswer.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const generatedCode = item.lockerOtp || '749102';
      setClaimedReceipt(generatedCode);
      onSuccessClaim(item.id);
    }, 1000);
  };

  const handleFinish = () => {
    setClaimedReceipt(null);
    setProofAnswer('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-highest overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-on-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/10 text-secondary-container">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-white">Item Ownership Verification</h3>
              <p className="text-xs text-outline-variant">Verified ID Matching Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {claimedReceipt ? (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                  Claim Verified & Approved
                </span>
                <h4 className="font-headline font-extrabold text-xl text-on-surface">Ownership Confirmed!</h4>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto mt-1">
                  Your identity details matched the recorded item custody log for <strong>{item.title}</strong>.
                </p>
              </div>

              {/* Handover Voucher Box */}
              <div className="bg-surface-container-low p-4 rounded-xl text-left border border-surface-container max-w-sm mx-auto space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-surface-container">
                  <span className="text-outline">Collection Method:</span>
                  <span className="font-bold text-on-surface">
                    {handoverMethod === 'locker' ? 'Safe Handover Locker Vault' : 'North Security Alpha Post'}
                  </span>
                </div>

                {handoverMethod === 'locker' ? (
                  <div className="text-center py-2 bg-white rounded-lg border border-secondary-container/40 p-3">
                    <span className="text-[11px] font-semibold text-outline uppercase tracking-wider block">
                      Your 6-Digit Locker OTP
                    </span>
                    <span className="font-mono text-2xl font-extrabold text-secondary tracking-widest block my-1">
                      {claimedReceipt}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Valid at: {item.lockerNumber || 'Safe Locker #02'} (Central Library Quad)
                    </span>
                  </div>
                ) : (
                  <div className="text-left text-xs space-y-1 bg-white p-3 rounded-lg border border-surface-container">
                    <div className="font-bold text-on-surface">Present at Desk: Ref #{item.id.toUpperCase()}</div>
                    <div className="text-on-surface-variant text-[11px]">Officer Martinez on duty · Central Gate Alpha</div>
                    <div className="text-outline text-[10px]">Hours: 24/7 with valid Student ID card</div>
                  </div>
                )}

                <div className="flex justify-between text-xs pt-1">
                  <span className="text-outline">Security Status:</span>
                  <span className="font-bold text-emerald-600">Dispense Authorized</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={handleFinish}
                  className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-md"
                >
                  Save Pass & View My Claims
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Item Card Overview */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden relative flex-shrink-0 bg-surface-dim">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-on-surface truncate">{item.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-error-container text-on-error-container">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant truncate">{item.location}</p>
                  <span className="text-[10px] text-outline">Reported {item.timeAgo} · {item.sector}</span>
                </div>
              </div>

              {/* Security Verification Question */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Custody Question: {item.verificationQuestion || 'Describe unique marks, stickers, or identifying features:'} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={proofAnswer}
                  onChange={(e) => setProofAnswer(e.target.value)}
                  placeholder="Provide precise details only the rightful owner would know..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-container-lowest text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Handover Choice */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5">
                  Select Handover Preference:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHandoverMethod('locker')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      handoverMethod === 'locker'
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-surface-container hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-on-surface">
                      <Lock className="w-3.5 h-3.5 text-secondary" />
                      <span>Safe Locker OTP</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant">
                      Instant 24/7 contactless pick up with one-time passcode.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHandoverMethod('security')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      handoverMethod === 'security'
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-surface-container hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-on-surface">
                      <Building2 className="w-3.5 h-3.5 text-secondary" />
                      <span>Security Post Desk</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant">
                      Pick up in-person from Campus Officer Martinez.
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg bg-surface-container text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !proofAnswer.trim()}
                  className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Verifying Answers...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-secondary" />
                      <span>Confirm & Issue Retrieval OTP</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
