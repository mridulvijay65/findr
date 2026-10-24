'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sliders,
  Filter,
  Layers,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { CampusItem } from '@/lib/campusData';

interface MatchCenterScreenProps {
  onOpenClaimModal: (item: CampusItem) => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
}

export function MatchCenterScreen({ onOpenClaimModal, onOpenReportModal }: MatchCenterScreenProps) {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterConfidence, setFilterConfidence] = useState<string>('ALL');
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [reindexing, setReindexing] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/matches');
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
        if (data.matches && data.matches.length > 0 && !selectedMatch) {
          setSelectedMatch(data.matches[0]);
        }
      }
    } catch (err) {
      console.warn('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleReindex = async () => {
    try {
      setReindexing(true);
      const res = await fetch('/api/matches', { method: 'POST' });
      if (res.ok) {
        setActionFeedback('Multi-signal scan completed. Matches updated.');
        setTimeout(() => setActionFeedback(null), 4000);
        await fetchMatches();
      }
    } catch (err) {
      console.warn('Reindex error:', err);
    } finally {
      setReindexing(false);
    }
  };

  const handleUpdateStatus = async (matchId: string, status: 'CONFIRMED' | 'DISMISSED') => {
    try {
      const res = await fetch('/api/matches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, status, reviewerId: user.id }),
      });
      if (res.ok) {
        setMatches((prev) =>
          prev.map((m) => (m.id === matchId ? { ...m, status } : m))
        );
        if (selectedMatch?.id === matchId) {
          setSelectedMatch((prev: any) => ({ ...prev, status }));
        }
        setActionFeedback(status === 'CONFIRMED' ? 'Match confirmed by user.' : 'Candidate marked as false positive.');
        setTimeout(() => setActionFeedback(null), 3000);
      }
    } catch (err) {
      console.warn('Error updating match status:', err);
    }
  };

  const filteredMatches = matches.filter((m) => {
    if (filterConfidence === 'ALL') return true;
    return m.confidence === filterConfidence;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-surface-container shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-secondary" />
              Explainable AI Pipeline
            </span>
            <span className="text-[10px] text-outline font-mono">5-Factor Weighted Engine</span>
          </div>
          <h1 className="font-headline font-black text-2xl text-on-surface">
            Autonomous Campus Match Center
          </h1>
          <p className="text-xs text-on-surface-variant max-w-2xl mt-1">
            Continuous background evaluation comparing Lost and Found item pairs across Category, Keywords, Brand/Color Attributes, Spatial Adjacency, and Temporal Discrepancy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReindex}
            disabled={reindexing}
            className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-bold transition-all border border-surface-container-highest flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reindexing ? 'animate-spin text-primary' : ''}`} />
            <span>{reindexing ? 'Scanning DB...' : 'Re-evaluate All'}</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-xl border border-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Main Grid: Match List (Left) & Deep Inspection (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Candidate List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
              <span>Candidate Matches</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container font-mono text-outline">
                {filteredMatches.length}
              </span>
            </span>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[11px]">
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterConfidence(tier)}
                  className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    filterConfidence === tier
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface-container text-outline hover:text-on-surface'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-surface-container p-8 text-center text-xs text-outline space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
              <p>Analyzing campus item vectors...</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-container p-8 text-center text-xs text-on-surface-variant space-y-2">
              <p className="font-bold">No active candidate pairs in this tier.</p>
              <p className="text-outline">File a lost or found report to run similarity evaluation.</p>
              <button
                onClick={() => onOpenReportModal('lost')}
                className="mt-2 px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold"
              >
                + Report Item
              </button>
            </div>
          ) : (
            filteredMatches.map((m) => {
              const isSelected = selectedMatch?.id === m.id;
              const signals = typeof m.signals === 'string' ? JSON.parse(m.signals) : m.signals;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatch(m)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 shadow-md'
                      : 'border-surface-container hover:border-surface-container-high hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            m.confidence === 'HIGH'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.confidence === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {m.score}% Match
                        </span>
                        <span className="text-[10px] text-outline font-semibold">
                          {m.status}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-on-surface truncate">
                        Lost: {m.lostItem.title}
                      </div>
                      <div className="text-xs text-on-surface-variant truncate">
                        Found: {m.foundItem.title}
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-outline'}`} />
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-surface-container-low flex items-center justify-between text-[11px] text-outline">
                    <span className="truncate">{m.lostItem.sector}</span>
                    <span className="font-mono text-[10px]">{signals.reasons?.length || 0} matching signals</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Deep Explainability Inspection Panel */}
        <div className="lg:col-span-7">
          {selectedMatch ? (
            <div className="bg-white rounded-2xl border border-surface-container shadow-sm p-6 space-y-6">
              {/* Match Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-container">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-black text-primary">
                      {selectedMatch.score}%
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                        selectedMatch.confidence === 'HIGH'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedMatch.confidence === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {selectedMatch.confidence} Confidence Candidate
                    </span>
                  </div>
                  <p className="text-xs text-outline mt-0.5">
                    Match ID: <code className="text-[10px]">{selectedMatch.id}</code> · Model: Multi-Signal Decision Fusion
                  </p>
                </div>

                {/* Status Badges & Quick Action */}
                <div className="flex items-center gap-2">
                  {selectedMatch.status === 'SUGGESTED' ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(selectedMatch.id, 'CONFIRMED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all border border-emerald-200 flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Match</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedMatch.id, 'DISMISSED')}
                        className="px-3 py-1.5 rounded-lg bg-surface-container text-outline hover:text-red-700 hover:bg-red-50 text-xs font-bold transition-all border border-surface-container-highest flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>False Positive</span>
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedMatch.status === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-surface-container text-outline'
                    }`}>
                      {selectedMatch.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lost Item Column */}
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-amber-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Lost Report
                    </span>
                    <span className="text-[10px] text-outline">By {selectedMatch.lostItem.reporter.name}</span>
                  </div>

                  <h3 className="font-bold text-sm text-on-surface">
                    {selectedMatch.lostItem.title}
                  </h3>

                  <div className="text-xs text-on-surface-variant line-clamp-2">
                    {selectedMatch.lostItem.description || 'No detailed description provided.'}
                  </div>

                  <div className="pt-2 text-[11px] text-outline space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-secondary" />
                      <span>{selectedMatch.lostItem.location} ({selectedMatch.lostItem.sector})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-secondary" />
                      <span>Category: {selectedMatch.lostItem.category}</span>
                    </div>
                  </div>
                </div>

                {/* Found Item Column */}
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-emerald-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Found Report
                    </span>
                    <span className="text-[10px] text-outline">By {selectedMatch.foundItem.reporter.name}</span>
                  </div>

                  <h3 className="font-bold text-sm text-on-surface">
                    {selectedMatch.foundItem.title}
                  </h3>

                  <div className="text-xs text-on-surface-variant line-clamp-2">
                    {selectedMatch.foundItem.description || 'No detailed description provided.'}
                  </div>

                  <div className="pt-2 text-[11px] text-outline space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{selectedMatch.foundItem.location} ({selectedMatch.foundItem.sector})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>Status: {selectedMatch.foundItem.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Signal Breakdown Meter */}
              {(() => {
                const sigs = typeof selectedMatch.signals === 'string'
                  ? JSON.parse(selectedMatch.signals)
                  : selectedMatch.signals;

                return (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-secondary" />
                      <span>Signal Calibration Breakdown</span>
                    </h4>

                    <div className="space-y-2.5">
                      {/* 1. Category */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-semibold text-on-surface">1. Category Compatibility (25% Weight)</span>
                          <span className="font-mono font-bold text-secondary">{sigs.categoryScore}%</span>
                        </div>
                        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full bg-secondary rounded-full transition-all duration-500"
                            style={{ width: `${sigs.categoryScore}%` }}
                          />
                        </div>
                      </div>

                      {/* 2. Text */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-semibold text-on-surface">2. Text & Keyword Similarity (30% Weight)</span>
                          <span className="font-mono font-bold text-primary">{sigs.textScore}%</span>
                        </div>
                        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${sigs.textScore}%` }}
                          />
                        </div>
                      </div>

                      {/* 3. Attributes */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-semibold text-on-surface">3. Brand & Color Attributes (20% Weight)</span>
                          <span className="font-mono font-bold text-indigo-600">{sigs.attributeScore}%</span>
                        </div>
                        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${sigs.attributeScore}%` }}
                          />
                        </div>
                      </div>

                      {/* 4. Spatial */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-semibold text-on-surface">4. Campus Spatial Proximity (15% Weight)</span>
                          <span className="font-mono font-bold text-emerald-600">{sigs.spatialScore}%</span>
                        </div>
                        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${sigs.spatialScore}%` }}
                          />
                        </div>
                      </div>

                      {/* 5. Temporal */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-semibold text-on-surface">5. Temporal Timeline Consistency (10% Weight)</span>
                          <span className="font-mono font-bold text-amber-600">{sigs.temporalScore}%</span>
                        </div>
                        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${sigs.temporalScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reasons & Discrepancies */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Positive Reasons */}
                      <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 space-y-1.5">
                        <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Why This Matched</span>
                        </span>
                        <ul className="text-[11px] text-emerald-900 space-y-1 list-disc list-inside">
                          {sigs.reasons && sigs.reasons.length > 0 ? (
                            sigs.reasons.map((r: string, idx: number) => (
                              <li key={idx}>{r}</li>
                            ))
                          ) : (
                            <li>General category alignment identified.</li>
                          )}
                        </ul>
                      </div>

                      {/* Warnings / Differences */}
                      <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-1.5">
                        <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Uncertainties & Warnings</span>
                        </span>
                        <ul className="text-[11px] text-amber-900 space-y-1 list-disc list-inside">
                          {sigs.warnings && sigs.warnings.length > 0 ? (
                            sigs.warnings.map((w: string, idx: number) => (
                              <li key={idx}>{w}</li>
                            ))
                          ) : (
                            <li>No major geographical or timeline conflicts found.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Action Button: Initiate Claim on the Found Item */}
              <div className="pt-4 border-t border-surface-container flex items-center justify-between">
                <span className="text-xs text-outline">
                  Human verification required before custody handover.
                </span>
                <button
                  onClick={() => {
                    const foundCampusItem: CampusItem = {
                      id: selectedMatch.foundItem.id,
                      title: selectedMatch.foundItem.title,
                      category: selectedMatch.foundItem.category,
                      status: selectedMatch.foundItem.status,
                      location: selectedMatch.foundItem.location,
                      sector: selectedMatch.foundItem.sector,
                      timeAgo: 'Recently',
                      image: selectedMatch.foundItem.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
                      description: selectedMatch.foundItem.description,
                      karmaReward: 50,
                      reporter: selectedMatch.foundItem.reporter?.name || 'Campus Member',
                      verificationQuestion: selectedMatch.foundItem.verificationQuestion,
                      lockerNumber: selectedMatch.foundItem.lockerNumber,
                    };
                    onOpenClaimModal(foundCampusItem);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-secondary-container" />
                  <span>Initiate Ownership Claim</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-surface-container p-12 text-center text-xs text-outline">
              Select a candidate match to view explainable multi-signal breakdown.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
