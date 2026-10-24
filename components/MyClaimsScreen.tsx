'use client';

import React, { useState } from 'react';
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
  PlusCircle
} from 'lucide-react';
import { CampusItem } from '@/lib/campusData';

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
  const [activeTab, setActiveTab] = useState<'claims' | 'posts'>('claims');
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedOtp(code);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  const myClaimedItems = items.filter(
    (i) => i.id === 'item-1' || i.id === 'item-2' || i.lockerOtp
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-surface-container shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
            Student Account Dashboard
          </span>
          <h1 className="font-headline font-black text-2xl text-on-surface">
            My Claims & Active Reports
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage your verified item handovers, pending custody checks, and dynamic Smart Locker OTPs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenReportModal('lost')}
            className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-bold transition-all border border-surface-container-highest"
          >
            + New Report
          </button>
          <button
            onClick={onOpenLockerModal}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-secondary-container" />
            <span>Open Safe Locker</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-container">
        <button
          onClick={() => setActiveTab('claims')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'claims'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Active Custody Claims & Locker Passes ({myClaimedItems.length})
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'posts'
              ? 'border-primary text-primary'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Items Reported by Me (2)
        </button>
      </div>

      {activeTab === 'claims' ? (
        <div className="space-y-4">
          {myClaimedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-surface-container shadow-sm p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden relative flex-shrink-0 bg-surface-dim">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-bold text-sm text-on-surface">
                      {item.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">{item.location}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-outline">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ownership Match Confirmed by Campus Security</span>
                  </div>
                </div>
              </div>

              {/* Locker Pass Snippet */}
              <div className="w-full md:w-auto bg-surface-container-low p-3.5 rounded-xl border border-surface-container flex items-center justify-between md:justify-end gap-4">
                <div>
                  <span className="text-[10px] text-outline uppercase font-bold tracking-wider block">
                    {item.lockerNumber || 'Safe Handover Hub #01'}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-base font-extrabold text-on-surface">
                      OTP: {item.lockerOtp || '492810'}
                    </span>
                    <button
                      onClick={() => handleCopy(item.lockerOtp || '492810')}
                      className="p-1 rounded hover:bg-surface-container text-outline hover:text-on-surface"
                      title="Copy OTP"
                    >
                      {copiedOtp === (item.lockerOtp || '492810') ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={onOpenLockerModal}
                  className="px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-sm"
                >
                  Unlock Bay
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-surface-container shadow-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center font-bold text-secondary">
                #01
              </div>
              <div>
                <h4 className="font-bold text-xs text-on-surface">Sony WH-1000XM4 (Black)</h4>
                <p className="text-[11px] text-on-surface-variant">Reported Lost at Central Library 3rd Floor</p>
                <span className="text-[10px] text-outline">Reported 24m ago · Active in Live Mesh</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">
              Searching (38 nodes)
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-surface-container shadow-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center font-bold text-emerald-600">
                #02
              </div>
              <div>
                <h4 className="font-bold text-xs text-on-surface">Casio Calculator FX-991EX</h4>
                <p className="text-[11px] text-on-surface-variant">Found in Hall 3B · Deposited at Locker #04</p>
                <span className="text-[10px] text-outline">Handed Over · Claimed by Rahul S.</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Reunited (+50 Karma)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
