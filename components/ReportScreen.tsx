'use client';

import React, { useState } from 'react';
import { 
  PlusCircle, 
  CheckCircle, 
  ShieldCheck, 
  Lock, 
  MapPin, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { CampusItem } from '@/lib/campusData';

interface ReportScreenProps {
  initialType?: 'lost' | 'found';
  onItemCreated: (newItem: CampusItem) => void;
  onNavigateToMap: () => void;
}

export function ReportScreen({
  initialType = 'lost',
  onItemCreated,
  onNavigateToMap,
}: ReportScreenProps) {
  const [reportType, setReportType] = useState<'lost' | 'found'>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CampusItem['category']>('Electronics');
  const [sector, setSector] = useState<CampusItem['sector']>('Central Library & Cafes');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [handoverOption, setHandoverOption] = useState<'locker' | 'security' | 'direct'>('locker');
  const [submitted, setSubmitted] = useState<CampusItem | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    const mockItem: CampusItem = {
      id: `item-${Date.now()}`,
      title,
      category,
      status: reportType === 'lost' ? 'Lost' : handoverOption === 'locker' ? 'In Locker' : 'Awaiting Owner',
      location,
      sector,
      timeAgo: 'Just now',
      image: 'https://picsum.photos/seed/' + Math.random().toString(36).substring(7) + '/400/300',
      description,
      lockerNumber: handoverOption === 'locker' ? 'Safe Locker #05' : undefined,
      lockerOtp: handoverOption === 'locker' ? Math.floor(100000 + Math.random() * 900000).toString() : undefined,
      karmaReward: reportType === 'found' ? 50 : 25,
      reporter: 'Aarav (You)',
      verificationQuestion: securityQuestion || 'Describe unique identifying features'
    };

    onItemCreated(mockItem);
    setSubmitted(mockItem);
  };

  const handleReset = () => {
    setSubmitted(null);
    setTitle('');
    setLocation('');
    setDescription('');
    setSecurityQuestion('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {submitted ? (
        <div className="bg-white rounded-2xl border border-surface-container shadow-xl p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8 animate-bounce" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              Broadcasted into Live Radar Mesh
            </span>
            <h2 className="font-headline font-black text-2xl text-on-surface">
              {reportType === 'found' ? 'Found Item Registered & Deposited!' : 'Lost Report Broadcasted!'}
            </h2>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              Your report for <strong>{submitted.title}</strong> has been pinned to the campus radar at <strong>{submitted.sector}</strong>.
            </p>
          </div>

          {submitted.lockerOtp && (
            <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container max-w-sm mx-auto text-center space-y-1">
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                Assigned Locker Deposit Bay
              </span>
              <div className="font-mono text-2xl font-black text-secondary tracking-widest">
                OTP: {submitted.lockerOtp}
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Deposit at {submitted.lockerNumber} (Library Quad Vault). Bay will lock automatically when shut.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-secondary">
            <Sparkles className="w-4 h-4" />
            <span>+50 Good Karma points credited to your campus account!</span>
          </div>

          <div className="flex gap-3 justify-center pt-3">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg bg-surface-container text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors"
            >
              Report Another Item
            </button>
            <button
              onClick={onNavigateToMap}
              className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>View On Live Campus Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-container shadow-sm p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-headline font-black text-2xl text-on-surface">
              File a Campus Report
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Connect directly with student ambassadors and automated security vault lockers.
            </p>
          </div>

          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-surface-container-low rounded-xl border border-surface-container">
            <button
              type="button"
              onClick={() => setReportType('lost')}
              className={`py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                reportType === 'lost'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-secondary" />
              <span>I Lost Something</span>
            </button>
            <button
              type="button"
              onClick={() => setReportType('found')}
              className={`py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                reportType === 'found'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <CheckCircle className="w-4 h-4 text-white" />
              <span>I Found Something (Earn Karma)</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Space Grey AirPods Pro 2 in green silicone case"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>

            {/* Category & Sector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="IDs & Cards">IDs & Cards</option>
                  <option value="Keys & Tags">Keys & Tags</option>
                  <option value="Bottles & Tumblers">Bottles & Tumblers</option>
                  <option value="Stationery & Books">Stationery & Books</option>
                  <option value="Wearables & Apparel">Wearables & Apparel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Campus Sector *
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as any)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                >
                  <option value="Central Library & Cafes">Central Library & Cafes</option>
                  <option value="Engineering Cluster">Engineering Cluster</option>
                  <option value="North Academic Quad">North Academic Quad</option>
                  <option value="Sports Complex">Sports Complex</option>
                  <option value="Hostel Village">Hostel Village</option>
                </select>
              </div>
            </div>

            {/* Exact Location */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Specific Location / Desk / Room *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., 2nd Floor Quiet Study Area, Desk 18 by window"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                General Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details visible to everyone on campus to help identify the item..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>

            {/* Verification Question */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Ownership Verification Question (Security Safeguard)
              </label>
              <input
                type="text"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                placeholder="e.g., What sticker is on the back? What is the phone lockscreen wallpaper?"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
              <span className="text-[10px] text-outline mt-1 block">
                This question must be answered correctly before anyone can claim the item.
              </span>
            </div>

            {/* Handover Preference (if Found) */}
            {reportType === 'found' && (
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5">
                  How will you hand over this item?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setHandoverOption('locker')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      handoverOption === 'locker'
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-surface-container hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-on-surface">
                      <Lock className="w-3.5 h-3.5 text-secondary" />
                      <span>Safe Locker</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant">
                      Drop into 24/7 smart vault bay with instant OTP.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHandoverOption('security')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      handoverOption === 'security'
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-surface-container hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-on-surface">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      <span>Security Desk</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant">
                      Hand over to Campus Police Alpha Post.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHandoverOption('direct')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      handoverOption === 'direct'
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-surface-container hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-on-surface">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>In-Person Handover</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant">
                      Keep until verified student contacts you.
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Publish Report to Campus Radar</span>
                <ArrowRight className="w-4 h-4 text-secondary-container" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
