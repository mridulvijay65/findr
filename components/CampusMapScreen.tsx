'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  RefreshCw, 
  Flame, 
  Package, 
  Shield, 
  MapPin, 
  Clock, 
  Route, 
  Compass, 
  PartyPopper, 
  CheckCircle, 
  Award, 
  ZoomIn, 
  ZoomOut, 
  Navigation, 
  Box, 
  Radio, 
  Lock, 
  Unlock, 
  Sparkles, 
  Coffee, 
  Dumbbell, 
  Building, 
  AlertTriangle,
  X,
  ChevronRight,
  Edit2
} from 'lucide-react';
import { CampusItem, LOCKER_STATIONS } from '@/lib/campusData';

interface CampusMapScreenProps {
  items: CampusItem[];
  onOpenClaimModal: (item: CampusItem) => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
  onOpenLockerModal: () => void;
  onOpenRadarModal: () => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
}

export function CampusMapScreen({
  items,
  onOpenClaimModal,
  onOpenReportModal,
  onOpenLockerModal,
  onOpenRadarModal,
  selectedSector,
  setSelectedSector,
}: CampusMapScreenProps) {
  // Layer Toggles
  const [showLostZones, setShowLostZones] = useState(true);
  const [showLockers, setShowLockers] = useState(true);
  const [showBooths, setShowBooths] = useState(true);

  // Timeframe Filter
  const [timeframe, setTimeframe] = useState<'today' | '7days' | 'semester'>('today');
  const [refreshing, setRefreshing] = useState(false);

  // Active Popover: 'lib', 'eng', 'cafe', 'gym', 'locker', 'booth' or null
  // Default is 'lib' matching the screenshot!
  const [activePopover, setActivePopover] = useState<string | null>('lib');

  // Map Controls State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [is3DMode, setIs3DMode] = useState(true);

  // Routine Smart Search Form
  const [startTime, setStartTime] = useState('12:00 PM');
  const [endTime, setEndTime] = useState('02:30 PM');
  const [routineRoute, setRoutineRoute] = useState('Library Quad → Nescafe Bar');
  const [isEditingRoute, setIsEditingRoute] = useState(false);
  const [matchedRouteNotice, setMatchedRouteNotice] = useState<string | null>(null);

  // Handle Sector Switch
  const campusSectors = [
    'North Academic Quad',
    'Engineering Cluster',
    'Sports Complex',
    'Hostel Village',
    'Central Library & Cafes'
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleMatchRoute = () => {
    setActivePopover('lib');
    setMatchedRouteNotice('Filtered 4 items cataloged along Library Quad to Nescafe Bar!');
    setTimeout(() => {
      setMatchedRouteNotice(null);
    }, 5000);
  };

  // Find items for each popover
  const libItems = items.filter(i => i.sector === 'Central Library & Cafes').slice(0, 3);
  const engItems = items.filter(i => i.sector === 'Engineering Cluster');
  const sportsItems = items.filter(i => i.sector === 'Sports Complex');

  return (
    <div className="flex flex-col w-full">
      {/* Top Control Ribbon & Hotspot Metrics */}
      <section className="w-full bg-white shadow-sm z-30 border-b border-surface-container">
        <div className="max-w-[1536px] mx-auto px-4 lg:px-8 py-2.5 flex flex-col gap-3">
          {/* Upper Strip: Zone Quick-Switchers & Timeframe */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-on-surface">
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline px-1">
                Campus Sector:
              </span>
              {campusSectors.map((sector) => {
                const isActive = selectedSector === sector || (sector === 'North Academic Quad' && selectedSector === 'Main Campus (North Wing)');
                return (
                  <button
                    key={sector}
                    onClick={() => {
                      setSelectedSector(sector);
                      if (sector.includes('Library')) setActivePopover('lib');
                      else if (sector.includes('Engineering')) setActivePopover('eng');
                      else if (sector.includes('Sports')) setActivePopover('gym');
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-sm scale-100'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {sector}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-surface-container p-1 rounded-lg flex items-center gap-1 text-on-surface">
                <button
                  onClick={() => setTimeframe('today')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    timeframe === 'today'
                      ? 'bg-white text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:bg-white/50'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTimeframe('7days')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    timeframe === '7days'
                      ? 'bg-white text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:bg-white/50'
                  }`}
                >
                  Past 7 Days
                </button>
                <button
                  onClick={() => setTimeframe('semester')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    timeframe === 'semester'
                      ? 'bg-white text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:bg-white/50'
                  }`}
                >
                  Semester Total
                </button>
              </div>

              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high flex items-center justify-center transition-colors cursor-pointer"
                title="Refresh Live Radar"
                type="button"
              >
                <RefreshCw className={`w-4 h-4 text-on-surface ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Lower Strip: Layer Toggles & Realtime Pulse */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-surface-container">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                Spatial Overlays:
              </span>

              {/* Hotspot Toggle */}
              <button
                onClick={() => setShowLostZones(!showLostZones)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  showLostZones
                    ? 'bg-error-container text-on-error-container shadow-sm ring-1 ring-error/30'
                    : 'bg-surface-container text-outline opacity-60'
                }`}
                type="button"
              >
                <span className={`h-2 w-2 rounded-full bg-error ${showLostZones ? 'animate-pulse' : ''}`}></span>
                <span>🔥 High-Frequency Lost Zones</span>
              </button>

              {/* Lockers Toggle */}
              <button
                onClick={() => setShowLockers(!showLockers)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  showLockers
                    ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm ring-1 ring-secondary/30'
                    : 'bg-surface-container text-outline opacity-60'
                }`}
                type="button"
              >
                <Package className="w-3.5 h-3.5 text-secondary" />
                <span>Safe Handover Lockers (12 available)</span>
              </button>

              {/* Security Booths Toggle */}
              <button
                onClick={() => setShowBooths(!showBooths)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  showBooths
                    ? 'bg-surface-container-high text-on-surface shadow-sm ring-1 ring-primary/20'
                    : 'bg-surface-container text-outline opacity-60'
                }`}
                type="button"
              >
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>Security Booths (6 Active)</span>
              </button>
            </div>

            {/* Counts */}
            <div className="flex items-center gap-4 text-on-surface-variant text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-error"></span>
                <span>Unclaimed Lost (42)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-secondary-container"></span>
                <span>In Locker Vault (12)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-on-tertiary-container"></span>
                <span>Awaiting Owner (19)</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Viewport: Canvas & Floating Docks */}
      <div className="relative w-full h-[calc(100vh-14rem)] min-h-[720px] overflow-hidden flex bg-surface-container-low">
        {/* Left Floating Filter & Routine Search Dock */}
        <aside className="absolute left-4 top-4 bottom-4 w-92 md:w-96 z-20 flex flex-col gap-3 pointer-events-none">
          {/* Routine Finder Card */}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-primary" />
                <h2 className="font-headline font-bold text-sm text-on-surface">Search by Routine</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] text-on-surface-variant font-bold">
                Smart Route
              </span>
            </div>

            <p className="text-xs text-on-surface-variant">
              Trace your steps across campus today to isolate reports filed along your daily schedule.
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-outline">
                Where were you during this window?
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-surface-container-low rounded-lg p-2 flex items-center gap-1.5 border border-surface-container">
                  <Clock className="w-3.5 h-3.5 text-outline" />
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-on-surface focus:outline-none"
                  />
                </div>
                <div className="bg-surface-container-low rounded-lg p-2 flex items-center gap-1.5 border border-surface-container">
                  <Clock className="w-3.5 h-3.5 text-outline" />
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              {/* Route Input */}
              <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-2.5 py-1.5 border border-surface-container">
                <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                {isEditingRoute ? (
                  <input
                    type="text"
                    autoFocus
                    value={routineRoute}
                    onBlur={() => setIsEditingRoute(false)}
                    onChange={(e) => setRoutineRoute(e.target.value)}
                    className="bg-transparent text-on-surface text-xs font-semibold focus:outline-none w-full"
                  />
                ) : (
                  <span className="text-on-surface text-xs font-semibold truncate flex-1">
                    {routineRoute}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditingRoute(!isEditingRoute)}
                  className="text-outline hover:text-on-surface p-0.5"
                  title="Edit route"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button
              onClick={handleMatchRoute}
              className="w-full py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              type="button"
            >
              <Compass className="w-4 h-4 text-secondary-container" />
              <span>Match 4 Items Found Near Route</span>
            </button>

            {matchedRouteNotice && (
              <div className="p-2 rounded-lg bg-secondary-fixed/50 text-[11px] text-on-secondary-fixed font-medium animate-in fade-in">
                {matchedRouteNotice}
              </div>
            )}
          </div>

          {/* Quick Drawer: Community Recoveries & Good Karma Feed */}
          <div className="pointer-events-auto flex-1 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-surface-container flex flex-col gap-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <PartyPopper className="w-4 h-4 text-secondary" />
                <h3 className="font-headline font-bold text-sm text-on-surface">Live Campus Recoveries</h3>
              </div>
              <span className="animate-ping h-2 w-2 rounded-full bg-secondary"></span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 no-scrollbar">
              {/* Recovery Item 1 */}
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1.5 border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">Dorm Keys (3 Blue Tags)</span>
                  <span className="text-[10px] text-outline">18m ago</span>
                </div>
                <p className="text-[11px] text-on-surface italic">
                  “Got my dorm keys back in 15 mins! Rahul dropped them at Locker #04. Huge lifesaver before finals!”
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-secondary" /> Handover by Rahul S.
                  </span>
                  <span className="text-secondary font-bold">+50 Karma</span>
                </div>
              </div>

              {/* Recovery Item 2 */}
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1.5 border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">Hydro Flask 32oz Mustard</span>
                  <span className="text-[10px] text-outline">1h ago</span>
                </div>
                <p className="text-[11px] text-on-surface italic">
                  “Left it at Nescafe outdoor table. Security desk verified my stickers in under 3 minutes.”
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-secondary" /> Handover by Maya K.
                  </span>
                  <span className="text-secondary font-bold">+35 Karma</span>
                </div>
              </div>

              {/* Recovery Item 3 */}
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1.5 border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">Casio Graphing Calculator</span>
                  <span className="text-[10px] text-outline">3h ago</span>
                </div>
                <p className="text-[11px] text-on-surface italic">
                  “Found inside Lecture Hall 3B. Returned right into my hands before the 2 PM exam!”
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-secondary" /> Handover by Prof. Rao
                  </span>
                  <span className="text-secondary font-bold">+100 Karma</span>
                </div>
              </div>
            </div>

            {/* Campus Return Rate Banner */}
            <div className="pt-2 flex items-center justify-between bg-surface-container-high px-3 py-2.5 rounded-xl border border-surface-container-highest">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-on-surface">Campus Return Rate</span>
              </div>
              <span className="font-headline text-lg font-black text-primary">89.4%</span>
            </div>
          </div>
        </aside>

        {/* Topographic / Isometric Canvas Map Representation */}
        <div 
          className="relative flex-1 w-full h-full overflow-hidden select-none bg-surface-container-low transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Vector Styled Campus Topography Map Art */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1600 1000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern height="60" id="grid-pattern" patternUnits="userSpaceOnUse" width="60">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#d8dadc" strokeDasharray="2,4" strokeWidth="0.8" />
              </pattern>
              <radialGradient cx="50%" cy="50%" id="library-hotspot-glow" r="50%">
                <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.38" />
                <stop offset="50%" stopColor="#ba1a1a" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="50%" cy="50%" id="nescafe-hotspot-glow" r="50%">
                <stop offset="0%" stopColor="#fea619" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#fea619" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#fea619" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Base Campus Ground Texture */}
            <rect fill="#eceef0" height="100%" width="100%" />
            <rect fill="url(#grid-pattern)" height="100%" width="100%" />

            {/* Green Quadrangles & Lawns */}
            <path d="M 320 220 L 580 180 L 640 400 L 380 440 Z" fill="#e0e8e3" />
            <path d="M 720 280 L 1020 220 L 1080 420 L 780 480 Z" fill="#e0e8e3" />
            <path d="M 880 580 L 1240 520 L 1310 780 L 950 840 Z" fill="#e0e8e3" />
            <path d="M 280 620 L 520 590 L 560 840 L 320 870 Z" fill="#e0e8e3" />

            {/* Pedestrian Walkways & Concrete Plazas */}
            <path d="M 120 490 Q 500 520 850 490 T 1550 480" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="28" />
            <path d="M 520 80 Q 560 480 580 920" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="22" />
            <path d="M 980 90 Q 990 490 1020 940" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="22" />
            <path d="M 320 220 L 1240 520" fill="none" stroke="#f7f9fb" strokeDasharray="6,6" strokeWidth="12" />

            {/* Hotspot Heat Blobs (Toggleable) */}
            {showLostZones && (
              <>
                {/* Central Library Zone (High alert red pulse) */}
                <circle cx="880" cy="380" fill="url(#library-hotspot-glow)" r="160" />
                <circle cx="880" cy="380" fill="none" opacity="0.4" r="220" stroke="#ba1a1a" strokeDasharray="4,6" strokeWidth="1" />
                {/* Nescafe & Food Court Alert (Amber pulse) */}
                <circle cx="680" cy="620" fill="url(#nescafe-hotspot-glow)" r="130" />
              </>
            )}

            {/* Stylized Isometric Building Footprints with Shadows */}
            {/* Engineering Block A */}
            <g transform="translate(380, 260)">
              <polygon fill="#d8dadc" opacity="0.7" points="10,80 180,50 240,110 70,140" />
              <polygon fill="#bec6e0" points="0,60 160,30 160,50 0,80" />
              <polygon fill="#7c839b" points="160,30 220,90 220,110 160,50" />
              <polygon fill="#ffffff" points="0,60 160,30 220,90 60,120" />
              <polygon fill="#f2f4f6" points="20,68 140,44 190,94 70,118" />
            </g>

            {/* Central Library (Grand Campus Hub) */}
            <g transform="translate(800, 310)">
              <polygon fill="#d8dadc" opacity="0.8" points="15,110 260,60 340,140 95,190" />
              <polygon fill="#3f465c" points="0,90 240,40 240,65 0,115" />
              <polygon fill="#131b2e" points="240,40 320,120 320,145 240,65" />
              <polygon fill="#ffffff" points="0,90 240,40 320,120 80,170" />
              <polygon fill="#eceef0" points="30,100 210,60 270,120 90,160" />
              <polygon fill="#c0c1ff" opacity="0.6" points="90,95 170,80 200,110 120,125" />
            </g>

            {/* Food Court & Nescafe Corner */}
            <g transform="translate(600, 560)">
              <polygon fill="#d8dadc" opacity="0.6" points="10,60 140,30 190,80 60,110" />
              <polygon fill="#bec6e0" points="0,50 130,20 130,35 0,65" />
              <polygon fill="#7c839b" points="130,20 180,70 180,85 130,35" />
              <polygon fill="#ffffff" points="0,50 130,20 180,70 50,100" />
              <circle cx="105" cy="55" fill="#ffddb8" r="16" />
            </g>

            {/* Gym & Indoor Arena */}
            <g transform="translate(1080, 570)">
              <polygon fill="#d8dadc" opacity="0.7" points="15,90 220,50 280,120 75,160" />
              <polygon fill="#3f465c" points="0,75 200,35 200,55 0,95" />
              <polygon fill="#131b2e" points="200,35 260,105 260,125 200,55" />
              <polygon fill="#ffffff" points="0,75 200,35 260,105 60,145" />
              <path d="M 30 75 Q 130 50 230 65" fill="none" stroke="#76777d" strokeWidth="2" />
              <path d="M 45 90 Q 145 65 245 80" fill="none" stroke="#76777d" strokeWidth="2" />
            </g>

            {/* Hostels Cluster South-West */}
            <g transform="translate(260, 680)">
              <polygon fill="#ffffff" points="0,50 110,25 150,65 40,90" />
              <polygon fill="#ffffff" points="160,70 270,45 310,85 200,110" />
            </g>

            {/* Routine Path Overlay (Smart Route Visualizer) */}
            <path
              className="animate-pulse"
              d="M 520 330 L 700 630 L 890 420"
              fill="none"
              stroke="#fea619"
              strokeDasharray="8,8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
          </svg>

          {/* Interactive Map Marker 1: Engineering Block A */}
          <div
            className="absolute left-[36%] top-[34%] -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
            onClick={() => setActivePopover(activePopover === 'eng' ? null : 'eng')}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute h-10 w-10 rounded-full bg-secondary-container/20 animate-ping"></span>
              <div className="relative px-3 py-1.5 rounded-full bg-white text-on-surface shadow-lg hover:shadow-xl transition-transform hover:scale-105 flex items-center gap-2 border border-surface-container">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary-container"></span>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-bold text-on-surface leading-none">Eng Block A</span>
                  <span className="text-[9px] text-on-surface-variant leading-tight">3 Found Items</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Marker 2: Central Library (Hotspot Alert) */}
          <div
            className="absolute left-[62%] top-[40%] -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
            onClick={() => setActivePopover(activePopover === 'lib' ? null : 'lib')}
          >
            <div className="relative flex flex-col items-center">
              <div className="px-2 py-0.5 rounded-full bg-error text-white text-[10px] font-bold tracking-wide shadow-md uppercase mb-1 animate-bounce">
                Hotspot Alert
              </div>
              <div className="relative flex items-center justify-center">
                <span className="absolute h-14 w-14 rounded-full bg-error/25 animate-ping"></span>
                <div className="relative px-3.5 py-2 rounded-full bg-primary text-white shadow-2xl flex items-center gap-2.5 hover:scale-105 transition-transform border border-black/20">
                  <Building className="w-4 h-4 text-error" />
                  <div className="flex flex-col text-left">
                    <span className="font-headline text-xs font-bold leading-tight">Central Library</span>
                    <span className="text-[9px] text-outline-variant">9 lost / 4 found this week</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-error text-white text-[10px] font-bold">
                    9 items
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Marker 3: Food Court & Nescafe Corner */}
          <div
            className="absolute left-[48%] top-[65%] -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
            onClick={() => setActivePopover(activePopover === 'cafe' ? null : 'cafe')}
          >
            <div className="relative px-3 py-1.5 rounded-full bg-white text-on-surface shadow-lg hover:shadow-xl transition-transform hover:scale-105 flex items-center gap-2 border border-surface-container">
              <Coffee className="w-4 h-4 text-secondary" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold leading-tight">Nescafe & Food Hub</span>
                <span className="text-[9px] text-on-surface-variant">5 active items reported</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-secondary"></span>
            </div>
          </div>

          {/* Interactive Map Marker 4: Gym & Indoor Sports Arena */}
          <div
            className="absolute left-[78%] top-[66%] -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
            onClick={() => setActivePopover(activePopover === 'gym' ? null : 'gym')}
          >
            <div className="relative px-3 py-1.5 rounded-full bg-white text-on-surface shadow-lg hover:shadow-xl transition-transform hover:scale-105 flex items-center gap-2 border border-surface-container">
              <Dumbbell className="w-4 h-4 text-primary" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold leading-tight">Campus Arena & Gym</span>
                <span className="text-[9px] text-on-surface-variant">2 recovered items</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-[9px] font-bold">
                Locker #08
              </span>
            </div>
          </div>

          {/* Interactive Handover Locker Station Pin: Central Quad (Toggleable) */}
          {showLockers && (
            <div
              className="absolute left-[54%] top-[49%] -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
              onClick={() => onOpenLockerModal()}
              title="Safe Handover Hub #01 (Central Quad Vault)"
            >
              <div className="p-2 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-md hover:scale-110 transition-transform flex items-center justify-center ring-2 ring-white">
                <Unlock className="w-3.5 h-3.5 font-bold text-secondary" />
              </div>
            </div>
          )}

          {/* Interactive Security Booth Pin: North Gate Alpha (Toggleable) */}
          {showBooths && (
            <div
              className="absolute left-[33%] top-[19%] -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
              onClick={() => setActivePopover('booth')}
              title="North Security Alpha Station: Officer Martinez on duty"
            >
              <div className="p-2 rounded-full bg-primary text-white shadow-md hover:scale-110 transition-transform flex items-center justify-center ring-2 ring-white">
                <Shield className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* POPOVER 1: Central Library (Active Default State) */}
          {activePopover === 'lib' && (
            <div className="absolute left-[62%] top-[42%] translate-x-4 -translate-y-1/2 z-30 w-80 sm:w-84 bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-3 border border-surface-container animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">
                      Hotspot Alert
                    </span>
                    <span className="text-[10px] text-outline">Level 2 & 3</span>
                  </div>
                  <h4 className="font-headline font-bold text-sm text-on-surface pt-1">Central Library Quad</h4>
                </div>
                <button
                  className="p-1 rounded-full hover:bg-surface-container text-outline hover:text-on-surface transition-colors"
                  onClick={() => setActivePopover(null)}
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-on-surface-variant">
                High turnover study desks. Belongings reported here are automatically tagged for security collection every 90 minutes.
              </p>

              {/* Item Stack in Library */}
              <div className="space-y-2 pt-1">
                {/* Item Card A: Sony Headphones */}
                <div 
                  onClick={() => onOpenClaimModal(items[0])}
                  className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-2.5 cursor-pointer border border-surface-container"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0 bg-surface-dim">
                    <Image
                      src={items[0].image}
                      alt={items[0].title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-on-surface truncate">{items[0].title}</span>
                      <span className="text-[10px] font-bold text-error">Lost</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant truncate">{items[0].location}</p>
                    <span className="text-[10px] text-outline">Reported {items[0].timeAgo}</span>
                  </div>
                </div>

                {/* Item Card B: Campus ID */}
                <div 
                  onClick={() => onOpenClaimModal(items[1])}
                  className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-2.5 cursor-pointer border border-surface-container"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0 bg-surface-dim">
                    <Image
                      src={items[1].image}
                      alt={items[1].title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-on-surface truncate">{items[1].title}</span>
                      <span className="text-[10px] font-bold text-secondary">In Locker</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant truncate">{items[1].location}</p>
                    <span className="text-[10px] text-outline">Reported {items[1].timeAgo} · Safe Locker #02</span>
                  </div>
                </div>

                {/* Item Card C: Nalgene Bottle */}
                <div 
                  onClick={() => onOpenClaimModal(items[2])}
                  className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-2.5 cursor-pointer border border-surface-container"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0 bg-surface-dim">
                    <Image
                      src={items[2].image}
                      alt={items[2].title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-on-surface truncate">{items[2].title}</span>
                      <span className="text-[10px] font-bold text-error">Lost</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant truncate">{items[2].location}</p>
                    <span className="text-[10px] text-outline">Reported {items[2].timeAgo}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => onOpenClaimModal(items[0])}
                  className="flex-1 py-2 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-center font-bold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Claim / Report Here
                </button>
                <button
                  onClick={() => {
                    alert('Showing indoor pedestrian navigation path from North Gate to Library 3rd Floor.');
                  }}
                  className="p-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                  title="Navigate to Library Desk"
                  type="button"
                >
                  <Navigation className="w-4 h-4 text-secondary" />
                </button>
              </div>
            </div>
          )}

          {/* POPOVER 2: Engineering Block A */}
          {activePopover === 'eng' && (
            <div className="absolute left-[36%] top-[34%] translate-x-4 -translate-y-1/2 z-30 w-80 bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-3 border border-surface-container animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                    3 Items Found
                  </span>
                  <h4 className="font-headline font-bold text-sm text-on-surface pt-1">Engineering Block A</h4>
                </div>
                <button
                  className="p-1 rounded-full hover:bg-surface-container text-outline hover:text-on-surface transition-colors"
                  onClick={() => setActivePopover(null)}
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div 
                  onClick={() => onOpenClaimModal(items[3])}
                  className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors flex items-center gap-2.5 border border-surface-container"
                >
                  <Package className="w-4 h-4 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-on-surface block truncate">65W Type-C Laptop Charger</span>
                    <span className="text-[11px] text-on-surface-variant block">Lab 204 (Bench 12) · 45m ago</span>
                  </div>
                </div>

                <div 
                  onClick={() => onOpenClaimModal(items[4])}
                  className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors flex items-center gap-2.5 border border-surface-container"
                >
                  <Package className="w-4 h-4 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-on-surface block truncate">Casio FX-991EX Classwiz</span>
                    <span className="text-[11px] text-on-surface-variant block">Hall 3B · Handed to TA Maya</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenReportModal('found')}
                className="w-full py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs transition-colors shadow-sm"
                type="button"
              >
                View All Block A Items & Report
              </button>
            </div>
          )}

          {/* POPOVER 3: Nescafe Food Court */}
          {activePopover === 'cafe' && (
            <div className="absolute left-[48%] top-[65%] translate-x-4 -translate-y-1/2 z-30 w-80 bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-3 border border-surface-container animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[10px] font-bold">
                    High Density Zone
                  </span>
                  <h4 className="font-headline font-bold text-sm text-on-surface pt-1">Food Court & Nescafe Bar</h4>
                </div>
                <button
                  className="p-1 rounded-full hover:bg-surface-container text-outline hover:text-on-surface transition-colors"
                  onClick={() => setActivePopover(null)}
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div 
                  onClick={() => onOpenClaimModal(items[5])}
                  className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors flex items-center gap-2.5 border border-surface-container"
                >
                  <Coffee className="w-4 h-4 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-on-surface block truncate">Bike Lock Keys on Red Cord</span>
                    <span className="text-[11px] text-on-surface-variant block">Corner High Table #4 · 30m ago</span>
                  </div>
                </div>

                <div 
                  onClick={() => onOpenClaimModal(items[6])}
                  className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors flex items-center gap-2.5 border border-surface-container"
                >
                  <Coffee className="w-4 h-4 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-on-surface block truncate">Hydro Flask 24oz Sage Green</span>
                    <span className="text-[11px] text-on-surface-variant block">Under booth couch · Handed to Barista</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenClaimModal(items[5])}
                className="w-full py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs transition-colors shadow-sm"
                type="button"
              >
                Check Nescafe Lost Box
              </button>
            </div>
          )}

          {/* POPOVER 4: Gym & Arena */}
          {activePopover === 'gym' && (
            <div className="absolute left-[78%] top-[66%] -translate-x-[105%] -translate-y-1/2 z-30 w-80 bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-3 border border-surface-container animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface text-[10px] font-bold">
                    Secured Handover
                  </span>
                  <h4 className="font-headline font-bold text-sm text-on-surface pt-1">Gym & Indoor Arena</h4>
                </div>
                <button
                  className="p-1 rounded-full hover:bg-surface-container text-outline hover:text-on-surface transition-colors"
                  onClick={() => setActivePopover(null)}
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div 
                  onClick={() => onOpenClaimModal(items[7])}
                  className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors flex items-center gap-2.5 border border-surface-container"
                >
                  <Dumbbell className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-on-surface block truncate">Fitbit Charge 5 (Black band)</span>
                    <span className="text-[11px] text-on-surface-variant block">Locker Room Bench · Safe Locker #08</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenLockerModal}
                className="w-full py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                type="button"
              >
                <Lock className="w-3.5 h-3.5 text-secondary-container" />
                <span>Request Locker OTP</span>
              </button>
            </div>
          )}

          {/* POPOVER 5: Security Booth */}
          {activePopover === 'booth' && (
            <div className="absolute left-[33%] top-[20%] translate-x-4 -translate-y-1/2 z-30 w-76 bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-2.5 border border-surface-container animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">
                    Active Security Post
                  </span>
                  <h4 className="font-headline font-bold text-sm text-on-surface pt-1">North Gate Alpha Post</h4>
                </div>
                <button
                  className="p-1 rounded-full hover:bg-surface-container text-outline hover:text-on-surface"
                  onClick={() => setActivePopover(null)}
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-on-surface-variant">
                Officer Martinez on duty. 24/7 drop-box depository and high-value vault custody.
              </p>
              <div className="text-[11px] text-outline">
                Contact: Ext. 4011 · Direct Red Phone: 080-2899-1001
              </div>
            </div>
          )}

          {/* Bottom Right Map Control HUD */}
          <div className="absolute right-6 bottom-6 z-20 flex flex-col gap-2">
            <div className="bg-white rounded-xl shadow-lg p-1 flex flex-col border border-surface-container">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
                className="p-2.5 hover:bg-surface-container text-on-surface rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom In"
                type="button"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="h-[1px] bg-surface-container"></div>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.75))}
                className="p-2.5 hover:bg-surface-container text-on-surface rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom Out"
                type="button"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                setZoomLevel(1);
                setActivePopover('lib');
              }}
              className="p-3 bg-white text-on-surface hover:bg-surface-container rounded-xl shadow-lg flex items-center justify-center border border-surface-container transition-colors cursor-pointer"
              title="Recenter to My GPS Location"
              type="button"
            >
              <Navigation className="w-4 h-4 text-secondary" />
            </button>

            <button
              onClick={() => setIs3DMode(!is3DMode)}
              className="p-3 bg-primary text-on-primary hover:bg-primary-container rounded-xl shadow-xl flex items-center justify-center transition-colors cursor-pointer"
              title="Switch 2D/Isometric 3D"
              type="button"
            >
              <Box className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Campus Live Radar Compass & Status Stamp */}
          <div className="absolute right-6 top-6 z-20 bg-white/90 backdrop-blur-md rounded-xl px-3.5 py-2 shadow-lg border border-surface-container flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              <span className="text-[11px] text-on-surface font-bold uppercase tracking-wider">
                Live Mesh: 38 Nodes
              </span>
            </div>
            <span className="text-outline">|</span>
            <span className="text-[11px] text-on-surface-variant">Update 12s ago</span>
          </div>
        </div>
      </div>

      {/* Bottom Action & Quick Dispatch Banner */}
      <section className="w-full bg-white py-4 px-4 lg:px-8 shadow-[0_-1px_4px_rgba(0,0,0,0.03)] border-t border-surface-container z-20">
        <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center flex-shrink-0 shadow-inner">
              <Radio className="w-5 h-5 text-secondary animate-pulse" />
            </div>
            <div>
              <h5 className="font-headline font-bold text-sm text-on-surface">
                Lost an essential in the last 60 minutes?
              </h5>
              <p className="text-xs text-on-surface-variant">
                Broadcast an instantaneous peer-ping to all student ambassadors and facility staff currently near the quadrant.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenLockerModal}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-bold transition-all border border-surface-container-highest cursor-pointer active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-secondary" />
              <span>Access Locker via OTP</span>
            </button>
            <button
              onClick={onOpenRadarModal}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
            >
              <Radio className="w-3.5 h-3.5 text-secondary-container" />
              <span>Broadcast Lost Item Radar</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
