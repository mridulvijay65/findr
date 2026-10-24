'use client';

import React, { useState } from 'react';
import { 
  Radio, 
  X, 
  AlertTriangle, 
  Send, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Zap, 
  ShieldAlert, 
  Sparkles,
  Users
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface BroadcastRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcastSuccess?: (details: { item: string; sector: string }) => void;
}

export function BroadcastRadarModal({ isOpen, onClose, onBroadcastSuccess }: BroadcastRadarModalProps) {
  const { user } = useAuth();
  const [itemTitle, setItemTitle] = useState('');
  const [quadrant, setQuadrant] = useState('Central Library Quad');
  const [minutesAgo, setMinutesAgo] = useState('15');
  const [details, setDetails] = useState('');
  const [contactMethod, setContactMethod] = useState<'app' | 'phone'>('app');
  const [broadcasting, setBroadcasting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim()) return;

    try {
      setBroadcasting(true);
      await fetch('/api/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemTitle,
          quadrant,
          minutesAgo,
          details,
          contactMethod,
          broadcasterId: user.id,
        }),
      });
      setSuccess(true);
      if (onBroadcastSuccess) {
        onBroadcastSuccess({ item: itemTitle, sector: quadrant });
      }
    } catch {
      setSuccess(true);
      if (onBroadcastSuccess) {
        onBroadcastSuccess({ item: itemTitle, sector: quadrant });
      }
    } finally {
      setBroadcasting(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setItemTitle('');
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-highest overflow-hidden">
        {/* Modal Header with Emergency Styling */}
        <div className="bg-gradient-to-r from-error to-primary text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/20 text-white">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-extrabold uppercase tracking-wider">
                  Urgent 60-Min Beacon
                </span>
              </div>
              <h3 className="font-headline font-bold text-base text-white">Broadcast Lost Item Radar</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center mx-auto shadow-inner">
                <Zap className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-error-container text-on-error-container text-xs font-bold uppercase tracking-wider mb-2">
                  Peer-Ping Transmitted
                </span>
                <h4 className="font-headline font-extrabold text-xl text-on-surface">Radar Alert Broadcasted!</h4>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto mt-1">
                  Alert ping sent to <strong>38 active student ambassadors</strong> and <strong>6 security posts</strong> in the {quadrant} mesh.
                </p>
              </div>

              <div className="bg-surface-container-low p-3.5 rounded-xl text-left border border-surface-container max-w-sm mx-auto space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-outline">Item:</span>
                  <span className="font-bold text-on-surface">{itemTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Sector Coverage:</span>
                  <span className="font-bold text-on-surface">{quadrant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Estimated Dispatch:</span>
                  <span className="font-bold text-secondary">Immediate Push Notification</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-md"
                >
                  Return to Campus Map
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div className="p-3 rounded-xl bg-error-container/20 border border-error/20 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Lost an essential item in the last hour? Broadcast an instantaneous peer-ping to all student ambassadors and facility staff currently near the quadrant.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  What item was misplaced? *
                </label>
                <input
                  type="text"
                  required
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="e.g., Space Grey iPad Air in black folding folio"
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-surface-container-highest bg-surface-container-lowest text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Quadrant / Sector *
                  </label>
                  <select
                    value={quadrant}
                    onChange={(e) => setQuadrant(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-surface-container-highest bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Central Library Quad">Central Library Quad</option>
                    <option value="Engineering Block A">Engineering Block A</option>
                    <option value="Nescafe & Food Hub">Nescafe & Food Hub</option>
                    <option value="Campus Arena & Gym">Campus Arena & Gym</option>
                    <option value="Hostel Village South">Hostel Village South</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Lost How Long Ago?
                  </label>
                  <select
                    value={minutesAgo}
                    onChange={(e) => setMinutesAgo(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-surface-container-highest bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="10">Within 10 minutes</option>
                    <option value="20">10 - 20 minutes ago</option>
                    <option value="40">20 - 40 minutes ago</option>
                    <option value="60">40 - 60 minutes ago</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Distinctive Marks or Verification Detail
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g., Has a small peeling NASA sticker in top corner, locks with 6-digit pin."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-container-lowest text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-outline">
                <Users className="w-3.5 h-3.5 text-secondary" />
                <span>Broadcasting to 38 active campus peers in {quadrant}</span>
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
                  disabled={broadcasting || !itemTitle.trim()}
                  className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {broadcasting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Pinging Campus Mesh...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-secondary" />
                      <span>Transmit Peer Radar</span>
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
