'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
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
  Info,
  Loader2,
  UploadCloud,
  X,
  AlertTriangle
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
  
  // Real Image Upload State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Analysis & Matching State
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [aiAnalysisSuccess, setAiAnalysisSuccess] = useState(false);
  const [aiMatches, setAiMatches] = useState<Array<{ id: string; title: string; confidence: string; location: string }>>([]);
  const [checkingMatches, setCheckingMatches] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<CampusItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compress and handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setImagePreview(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Call Gemini Vision AI to auto-analyze photo
  const handleAiAutoFill = async () => {
    if (!imagePreview) return;

    try {
      setIsAnalyzingImage(true);
      const res = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imagePreview }),
      });

      if (!res.ok) throw new Error('AI analysis failed');
      const data = await res.json();

      if (data.title) setTitle(data.title);
      if (data.category) setCategory(data.category);
      if (data.description) setDescription(data.description);
      if (data.suggestedQuestion) setSecurityQuestion(data.suggestedQuestion);

      setAiAnalysisSuccess(true);
      setTimeout(() => setAiAnalysisSuccess(false), 4000);

      // Check for immediate similarity matches
      if (data.title) {
        checkSimilarityMatches(data.title, data.category || category);
      }
    } catch (err) {
      console.warn('AI analysis error:', err);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Check potential matches across campus
  const checkSimilarityMatches = async (queryTitle: string, queryCategory: string) => {
    if (!queryTitle || queryTitle.length < 3) return;
    try {
      setCheckingMatches(true);
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: queryTitle,
          category: queryCategory,
          sector,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiMatches(data.matches || []);
      }
    } catch (err) {
      console.warn('Error checking matches:', err);
    } finally {
      setCheckingMatches(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      // Submit to real PostgreSQL database API
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          sector,
          location,
          description,
          verificationQuestion: securityQuestion || 'Describe unique identifying features',
          reportType,
          handoverOption,
          image: imagePreview || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to publish report to the database.');
      }

      const createdItem: CampusItem = await res.json();
      onItemCreated(createdItem);
      setSubmitted(createdItem);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(null);
    setTitle('');
    setLocation('');
    setDescription('');
    setSecurityQuestion('');
    setImagePreview(null);
    setAiMatches([]);
    setErrorMessage(null);
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
              Broadcasted into Live Radar Mesh & Saved to Database
            </span>
            <h2 className="font-headline font-black text-2xl text-on-surface">
              {reportType === 'found' ? 'Found Item Registered & Deposited!' : 'Lost Report Broadcasted!'}
            </h2>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              Your report for <strong>{submitted.title}</strong> has been saved with ID <code className="bg-surface-container px-1 py-0.5 rounded text-[10px]">{submitted.id}</code> and pinned to the campus radar at <strong>{submitted.sector}</strong>.
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
                Deposit at {submitted.lockerNumber || 'Safe Locker #05'} (Library Quad Vault). Bay will lock automatically when shut.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-secondary">
            <Sparkles className="w-4 h-4" />
            <span>+{reportType === 'found' ? '50' : '25'} Good Karma points credited to your campus account!</span>
          </div>

          <div className="flex gap-3 justify-center pt-3">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg bg-surface-container text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Report Another Item
            </button>
            <button
              onClick={onNavigateToMap}
              className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>View On Live Campus Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-container shadow-sm p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-headline font-black text-2xl text-on-surface">
                File a Campus Report
              </h1>
              <p className="text-xs text-on-surface-variant mt-1">
                Persisted directly to the cloud database with smart locker integration and AI matching.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live DB Synced
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

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
            {/* Real Image Upload Area */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Item Photograph (Upload or Camera Capture)
              </label>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                capture="environment"
                onChange={handleImageChange}
                className="hidden" 
              />

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-surface-container group max-h-56 bg-surface-container-low flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    className="max-h-56 w-auto object-contain mx-auto"
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl">
                    <span className="text-[11px] text-white/90 font-medium">Real Photo Attached</span>
                    <button
                      type="button"
                      onClick={handleAiAutoFill}
                      disabled={isAnalyzingImage}
                      className="px-2.5 py-1 bg-secondary text-on-secondary rounded-lg text-xs font-bold flex items-center gap-1 hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isAnalyzingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Gemini Thinking...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>✨ Auto-Fill with Gemini AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-surface-container hover:border-primary/50 bg-surface-container-low hover:bg-surface-container p-6 rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="p-3 rounded-full bg-white text-secondary shadow-sm group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface">Click to upload photo or take picture</span>
                    <p className="text-[11px] text-on-surface-variant">Supports camera snapshots, JPEG, PNG, or WebP</p>
                  </div>
                </div>
              )}

              {aiAnalysisSuccess && (
                <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in">
                  <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Gemini Vision AI successfully identified the item details & suggested security question!</span>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.length > 3) {
                    checkSimilarityMatches(e.target.value, category);
                  }
                }}
                placeholder="e.g., Space Grey AirPods Pro 2 in green silicone case"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>

            {/* AI Potential Matches Alert Banner */}
            {aiMatches.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>AI Smart Match: We found {aiMatches.length} matching item(s) already on campus!</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {aiMatches.map((match) => (
                    <div key={match.id} className="bg-white p-2.5 rounded-lg border border-amber-200/60 shadow-xs flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-on-surface">{match.title}</div>
                        <div className="text-[10px] text-on-surface-variant">{match.location}</div>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {match.confidence} match
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  <option value="North Academic Quad">North Academic Quad</option>
                  <option value="Engineering Cluster">Engineering Cluster</option>
                  <option value="Sports Complex">Sports Complex</option>
                  <option value="Hostel Village">Hostel Village</option>
                </select>
              </div>
            </div>

            {/* Specific Location */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Specific Location Detail *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., 3rd Floor Silent Wing, Desk 44B near corner window"
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Public Description
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
                Ownership Verification Question (Anti-Theft Shield)
              </label>
              <input
                type="text"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                placeholder="e.g., What sticker is on the back? What is the phone lockscreen wallpaper?"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
              <span className="text-[10px] text-outline mt-1 block">
                Claimants must answer this question to verify genuine ownership before receiving locker access.
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
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
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
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
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
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
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
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-secondary-container" />
                    <span>Saving to Cloud Database...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Report to Campus Radar</span>
                    <ArrowRight className="w-4 h-4 text-secondary-container" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
