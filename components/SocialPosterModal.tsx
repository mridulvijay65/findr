'use client';

import React, { useRef } from 'react';
import { X, Download, Share2, Sparkles, MapPin, QrCode, AlertCircle, ShieldCheck } from 'lucide-react';
import { CampusItem } from '@/lib/campusData';

interface SocialPosterModalProps {
  item: CampusItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SocialPosterModal({ item, isOpen, onClose }: SocialPosterModalProps) {
  const posterRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-surface-container overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="bg-primary text-on-primary px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary-container" />
            <h3 className="font-headline font-bold text-sm text-white">Campus Lost Notice Flyer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Printable Poster Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div
            ref={posterRef}
            className="w-full bg-gradient-to-b from-surface to-white rounded-2xl border-4 border-primary p-5 text-center space-y-4 shadow-sm"
          >
            {/* Header Badge */}
            <div className="inline-block bg-primary text-on-primary font-headline font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xs">
              🚨 CAMPUS LOST ALERT 🚨
            </div>

            {/* Item Title */}
            <div>
              <h2 className="font-headline font-black text-2xl text-on-surface leading-tight">
                {item.title}
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Last Seen: {item.location}</span>
              </div>
            </div>

            {/* Photograph */}
            <div className="w-full h-48 rounded-xl overflow-hidden relative bg-surface-container-high border-2 border-surface-container flex items-center justify-center shadow-inner">
              <img
                src={item.image || 'https://picsum.photos/seed/default/400/300'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Reward & Details */}
            <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container text-left space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-outline">Category:</span>
                <span className="font-bold text-on-surface">{item.category}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-outline">Campus Sector:</span>
                <span className="font-bold text-on-surface">{item.sector}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-secondary">Finder Reward:</span>
                <span className="font-bold text-secondary font-headline">+{item.karmaReward} Good Karma</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-on-surface-variant italic px-2">
              &quot;{item.description || 'Please help return this item to its student owner.'}&quot;
            </p>

            {/* Scannable QR & Anti-Theft Verification Box */}
            <div className="border-t-2 border-dashed border-surface-container pt-3 flex items-center justify-between px-2 text-left">
              <div className="space-y-0.5 max-w-[200px]">
                <div className="flex items-center gap-1 text-[11px] font-bold text-primary">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Safe Handover</span>
                </div>
                <p className="text-[10px] text-outline leading-tight">
                  Scan QR with your phone camera to report finding this item or drop into a 24/7 smart safe locker.
                </p>
              </div>

              <div className="w-16 h-16 bg-white p-1 rounded-xl border-2 border-primary flex items-center justify-center shadow-xs">
                <QrCode className="w-full h-full text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-surface-container-low border-t border-surface-container flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-secondary-container" />
            <span>Print / Save PDF Flyer</span>
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Lost on Campus: ${item.title}`,
                  text: `Have you seen ${item.title}? Last seen at ${item.location}. Report on findr!`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Flyer link copied to clipboard for Instagram Story / WhatsApp sharing!');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-white border border-surface-container hover:bg-surface-container text-on-surface font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-secondary" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
