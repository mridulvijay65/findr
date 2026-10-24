'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, 
  ShieldCheck, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Mail, 
  User, 
  ShieldAlert,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useAuth, PRESET_USERS, AuthUser } from '@/context/auth-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user: currentUser, switchUser, loginWithEmail } = useAuth();
  const [activeTab, setActiveTab] = useState<'switch' | 'register'>('switch');

  // Register Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [role, setRole] = useState<'student' | 'security'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: AuthUser) => {
    switchUser(preset);
    setSuccessNotice(`Switched active profile to ${preset.name}!`);
    setTimeout(() => {
      setSuccessNotice(null);
      onClose();
    }, 900);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    try {
      setIsSubmitting(true);
      await loginWithEmail(name, email, `${department} · Class of 2027`, role);
      setSuccessNotice(`Welcome aboard, ${name}! Logged in successfully.`);
      setTimeout(() => {
        setSuccessNotice(null);
        setName('');
        setEmail('');
        onClose();
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-surface-container overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-on-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-secondary-container">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-white">Campus ID & Account Access</h3>
              <p className="text-xs text-outline-variant">Verified Student & Faculty Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-surface-container-low border-b border-surface-container">
          <button
            type="button"
            onClick={() => setActiveTab('switch')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'switch'
                ? 'bg-white text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            ⚡ 1-Click Role Switcher
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            🎓 Login / Sign Up with Email
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {successNotice && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {activeTab === 'switch' ? (
            <div className="space-y-4">
              <div className="text-xs text-on-surface-variant">
                Select a campus role below to experience the application as a student or campus security officer:
              </div>

              <div className="space-y-2.5">
                {PRESET_USERS.map((preset) => {
                  const isCurrent = currentUser.id === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                        isCurrent
                          ? 'border-secondary bg-secondary-fixed/20 ring-2 ring-secondary/30'
                          : 'border-surface-container hover:border-primary/40 hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden relative ring-2 ring-surface-container-highest flex-shrink-0">
                          <Image
                            src={preset.avatar}
                            alt={preset.name}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-headline font-bold text-xs text-on-surface">
                              {preset.name}
                            </span>
                            <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase ${
                              preset.role === 'security'
                                ? 'bg-primary text-on-primary'
                                : 'bg-secondary-fixed text-on-secondary-fixed'
                            }`}>
                              {preset.role === 'security' ? 'Security Staff' : 'Student'}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                                • Active
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-on-surface-variant">{preset.department}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-outline font-medium">
                            <span className="text-secondary font-bold flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" /> {preset.karmaPoints} Karma
                            </span>
                            <span>·</span>
                            <span>Badge: {preset.badge}</span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                        isCurrent ? 'text-secondary' : 'text-outline'
                      }`} />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  University Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex.m@campus.edu"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                  />
                </div>
                <span className="text-[10px] text-outline mt-1 block">
                  Institutional domains like @campus.edu or @*.edu are automatically verified.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Department / Major
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical & Tech">Electrical & Tech</option>
                    <option value="Design & Media">Design & Media</option>
                    <option value="Applied Physics">Applied Physics</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Campus Security Alpha">Campus Security Alpha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Account Type
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-surface-container-highest bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                  >
                    <option value="student">Student Account</option>
                    <option value="security">Campus Security Staff</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>Sign In / Create Account</span>
                  <ArrowRight className="w-4 h-4 text-secondary-container" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
