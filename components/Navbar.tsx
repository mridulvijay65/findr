'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Radio, 
  ShieldCheck, 
  ChevronDown, 
  MapPin, 
  PlusCircle, 
  CheckCircle, 
  Bell, 
  Menu, 
  X, 
  Sparkles,
  Lock,
  Award,
  Clock,
  Layers,
  Search,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { useAuth } from '@/context/auth-context';
import { AuthModal } from '@/components/AuthModal';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
  onOpenLockerModal: () => void;
  onOpenRadarModal: () => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
}

export function Navbar({
  currentTab,
  setCurrentTab,
  onOpenReportModal,
  onOpenLockerModal,
  onOpenRadarModal,
  selectedSector,
  setSelectedSector,
}: NavbarProps) {
  const [sectorMenuOpen, setSectorMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { user, logout } = useAuth();
  const { notifications: liveNotifications } = useNotifications();

  const campusSectors = [
    'Main Campus (North Wing)',
    'Engineering & Tech Quad',
    'Sports & Recreation Arena',
    'Central Library & Cafes',
    'Hostel Village South'
  ];

  const defaultNotifications = [
    {
      id: 1,
      title: 'Match Alert: Sony Headphones',
      time: '12m ago',
      desc: 'An item matching your search was tagged near 3rd Floor Silent Wing.',
      badge: 'High Match'
    },
    {
      id: 2,
      title: 'Locker OTP Generated',
      time: '45m ago',
      desc: 'Safe Locker #02 is holding verified Campus ID. Code expires in 6 hours.',
      badge: 'Vault'
    },
    {
      id: 3,
      title: '+50 Good Karma Awarded',
      time: '2h ago',
      desc: 'Your report helped reunite Priya with her lost graphing calculator!',
      badge: 'Karma'
    }
  ];

  const notifications = liveNotifications.length > 0 ? liveNotifications : defaultNotifications;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      {/* Top Banner Ribbon */}
      <div className="bg-surface-container-high px-4 lg:px-8 py-1.5 flex items-center justify-between text-on-surface-variant text-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-container"></span>
          </span>
          <span className="font-semibold text-on-surface whitespace-nowrap">Campus Live Radar</span>
          <span className="text-outline">|</span>
          <span className="whitespace-nowrap font-medium text-on-surface">⚡ 4 items matched in the last 2 hours near Central Library</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-on-surface-variant flex-shrink-0">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            Official Student Verification Active
          </span>
          <span className="text-outline">·</span>
          <span>Emergency Desk: Ext. 4099</span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="h-20 w-full px-4 lg:px-8 flex items-center justify-between gap-4 max-w-[1536px] mx-auto">
        {/* Logo & Sector Dropdown */}
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => setCurrentTab('campus-hotspots-map')} 
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-primary">
              <Radio className="w-5 h-5 text-secondary-container animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-lg tracking-tight text-on-surface font-extrabold flex items-center">
                findr<span className="text-secondary font-black">.campus</span>
              </span>
              <span className="text-[10px] text-outline font-medium tracking-wider uppercase -mt-1 hidden sm:inline">
                Recovery Grid
              </span>
            </div>
          </button>

          {/* Sector Selector */}
          <div className="relative">
            <button
              onClick={() => setSectorMenuOpen(!sectorMenuOpen)}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface text-xs font-semibold shadow-[0_1px_3px_rgba(15,23,42,0.04)] border border-surface-container-highest"
              type="button"
            >
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span>{selectedSector}</span>
              <ChevronDown className="w-3 h-3 text-outline" />
            </button>

            {sectorMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-highest py-2 z-50">
                <div className="px-3 py-1 text-[11px] font-bold text-outline uppercase tracking-wider">
                  Select Campus Sector
                </div>
                {campusSectors.map((sector) => (
                  <button
                    key={sector}
                    onClick={() => {
                      setSelectedSector(sector);
                      setSectorMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-surface-container transition-colors ${
                      selectedSector === sector ? 'font-bold text-primary bg-surface-container-low' : 'text-on-surface-variant'
                    }`}
                  >
                    <span>{sector}</span>
                    {selectedSector === sector && <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low p-1 rounded-full border border-surface-container">
          <button
            onClick={() => setCurrentTab('live-feed')}
            className={`font-semibold text-xs px-3.5 py-2 rounded-full transition-all ${
              currentTab === 'live-feed'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Live Feed
          </button>

          <button
            onClick={() => setCurrentTab('report-item')}
            className={`font-semibold text-xs px-3.5 py-2 rounded-full transition-all ${
              currentTab === 'report-item'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Report Item
          </button>

          <button
            onClick={() => setCurrentTab('my-claims')}
            className={`font-semibold text-xs px-3.5 py-2 rounded-full transition-all ${
              currentTab === 'my-claims'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            My Claims & Posts
          </button>

          <button
            onClick={() => setCurrentTab('campus-hotspots-map')}
            className={`font-semibold text-xs px-4 py-2 rounded-full transition-all ${
              currentTab === 'campus-hotspots-map'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Campus Hotspots Map
          </button>

          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`font-semibold text-xs px-3.5 py-2 rounded-full transition-all ${
              currentTab === 'leaderboard'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Leaderboard / Good Karma
          </button>
        </nav>

        {/* Right Action Tools & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Report Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => onOpenReportModal('lost')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold transition-all shadow-[0_1px_2px_rgba(15,23,42,0.03)] border border-surface-container-highest cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-secondary" />
              <span>+ Report Lost</span>
            </button>
            <button
              onClick={() => onOpenReportModal('found')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold transition-all shadow-[0_1px_3px_rgba(15,23,42,0.06)] cursor-pointer active:scale-95"
            >
              <CheckCircle className="w-4 h-4 text-white" />
              <span>+ Found Something</span>
            </button>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
              className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors relative flex items-center justify-center border border-surface-container-highest"
              type="button"
            >
              <Bell className="w-4 h-4 text-on-surface" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-container text-on-secondary-fixed text-[10px] font-bold ring-2 ring-white">
                3
              </span>
            </button>

            {/* Notifications Dropdown Drawer */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-2xl border border-surface-container-highest p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-on-surface">Live Campus Notifications</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                      3 new
                    </span>
                  </div>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-outline hover:text-on-surface p-1 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-surface-container mt-2 max-h-72 overflow-y-auto no-scrollbar">
                  {notifications.map((item) => (
                    <div key={item.id} className="py-2.5 px-1 hover:bg-surface-container-low rounded-lg transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-on-surface">{item.title}</span>
                        <span className="text-[10px] text-outline">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{item.desc}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container font-semibold text-secondary">
                          {item.badge}
                        </span>
                        <button
                          onClick={() => {
                            setNotificationsOpen(false);
                            if (item.id === 2) onOpenLockerModal();
                            else setCurrentTab('campus-hotspots-map');
                          }}
                          className="text-[11px] font-semibold text-primary underline"
                        >
                          View Detail →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 pl-1 py-1 hover:bg-surface-container-low rounded-full transition-colors text-left"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-secondary-container">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden md:flex flex-col text-left pr-1">
                <span className="text-xs font-bold text-on-surface leading-tight">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] text-on-surface-variant flex items-center">
                  {user.role === 'security' ? 'Security' : user.department.split('·')[0]} <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                </span>
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-2xl border border-surface-container-highest p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-2.5 pb-3 border-b border-surface-container">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative ring-2 ring-secondary-container flex-shrink-0">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-xs text-on-surface truncate">{user.name}</div>
                    <div className="text-[11px] text-outline truncate">{user.email}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-secondary-fixed text-on-secondary-fixed text-[9px] font-bold">
                        <Sparkles className="w-2.5 h-2.5" /> {user.karmaPoints} Karma
                      </span>
                      <span className="text-[9px] text-secondary font-bold uppercase tracking-wider">{user.role}</span>
                    </div>
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-primary font-bold hover:bg-primary/10 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-primary" />
                    <span>⚡ Switch Role / Sign In</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTab('my-claims');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-on-surface hover:bg-surface-container rounded-md flex items-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-outline" />
                    <span>My Claims & Reports</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenLockerModal();
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-on-surface hover:bg-surface-container rounded-md flex items-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-outline" />
                    <span>Open Safe Locker with OTP</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('leaderboard');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-on-surface hover:bg-surface-container rounded-md flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-outline" />
                    <span>Karma Perks & Rewards</span>
                  </button>

                  <div className="pt-1 border-t border-surface-container">
                    <button
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-t border-surface-container px-4 py-3 space-y-2 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-surface-container">
            <button
              onClick={() => {
                onOpenReportModal('lost');
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 rounded-lg bg-surface-container text-on-surface text-xs font-bold text-center flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-secondary" />
              <span>Report Lost</span>
            </button>
            <button
              onClick={() => {
                onOpenReportModal('found');
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 rounded-lg bg-primary text-on-primary text-xs font-bold text-center flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5 text-white" />
              <span>Found Item</span>
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setCurrentTab('campus-hotspots-map');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
                currentTab === 'campus-hotspots-map' ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Campus Hotspots Map
            </button>
            <button
              onClick={() => {
                setCurrentTab('live-feed');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
                currentTab === 'live-feed' ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Live Feed
            </button>
            <button
              onClick={() => {
                setCurrentTab('report-item');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
                currentTab === 'report-item' ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Report Item
            </button>
            <button
              onClick={() => {
                setCurrentTab('my-claims');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
                currentTab === 'my-claims' ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              My Claims & Posts
            </button>
            <button
              onClick={() => {
                setCurrentTab('leaderboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
                currentTab === 'leaderboard' ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Leaderboard / Good Karma
            </button>
          </div>
        </div>
      )}

      {/* Campus Auth & Role Switcher Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
}
