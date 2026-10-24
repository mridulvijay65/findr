'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  PlusCircle, 
  CheckCircle,
  ChevronRight,
  Radio,
  SlidersHorizontal,
  QrCode
} from 'lucide-react';
import { CampusItem } from '@/lib/campusData';

interface LiveFeedScreenProps {
  items: CampusItem[];
  onOpenClaimModal: (item: CampusItem) => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
  onOpenLockerModal: () => void;
  onOpenPosterModal?: (item: CampusItem) => void;
}

export function LiveFeedScreen({
  items,
  onOpenClaimModal,
  onOpenReportModal,
  onOpenLockerModal,
  onOpenPosterModal,
}: LiveFeedScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('All');

  const categories = [
    'All',
    'Electronics',
    'IDs & Cards',
    'Keys & Tags',
    'Bottles & Tumblers',
    'Stationery & Books',
    'Wearables & Apparel'
  ];

  const statuses = ['All', 'Lost', 'In Locker', 'Awaiting Owner', 'Claimed'];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesSector = selectedSectorFilter === 'All' || item.sector === selectedSectorFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesSector;
  });

  return (
    <div className="w-full max-w-[1536px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-container pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Campus Realtime Item Feed</span>
          </div>
          <h1 className="font-headline font-black text-2xl md:text-3xl text-on-surface">
            Misplaced & Recovered Essentials
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Showing all university items verified across North Academic Quad, Engineering, Library, and Athletics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenReportModal('lost')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-bold transition-all border border-surface-container-highest shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-secondary" />
            <span>I Lost Something</span>
          </button>
          <button
            onClick={() => onOpenReportModal('found')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-md"
          >
            <CheckCircle className="w-4 h-4 text-white" />
            <span>I Found Something</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-surface-container space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, building, brand, room number (e.g., Sony, Lab 204, Nalgene)..."
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-outline hover:text-on-surface absolute right-3 top-1/2 -translate-y-1/2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-surface-container-low p-1 rounded-xl border border-surface-container">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedStatus === status
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/60'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-secondary-fixed text-on-secondary-fixed ring-1 ring-secondary/40 font-bold'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Item Results Count */}
      <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
        <span>
          Showing <strong>{filteredItems.length}</strong> items across campus
        </span>
        <button
          onClick={onOpenLockerModal}
          className="text-secondary font-bold hover:underline flex items-center gap-1"
        >
          <Lock className="w-3.5 h-3.5" /> Have an OTP? Open Smart Locker
        </button>
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isLost = item.status === 'Lost';
          const isLocker = item.status === 'In Locker';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-surface-container shadow-sm hover:shadow-xl transition-all hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-[16/10] w-full bg-surface-dim overflow-hidden group">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
                        isLost
                          ? 'bg-error text-white'
                          : isLocker
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.status}
                    </span>
                    {item.lockerNumber && (
                      <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-on-surface shadow-sm">
                        {item.lockerNumber}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.timeAgo}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-bold text-outline">
                      +{item.karmaReward} Karma
                    </span>
                  </div>

                  <h3 className="font-headline font-bold text-base text-on-surface">
                    {item.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-outline pt-1">
                    <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-4 pt-0 border-t border-surface-container mt-2">
                <div className="pt-3 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-outline truncate">
                    By {item.reporter}
                  </div>
                  <div className="flex items-center gap-2">
                    {onOpenPosterModal && (
                      <button
                        onClick={() => onOpenPosterModal(item)}
                        className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all border border-surface-container-highest cursor-pointer"
                        title="Generate Printable / Social Flyer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onOpenClaimModal(item)}
                      className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span>Claim Item</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-container p-6">
          <p className="text-sm font-bold text-on-surface">No misplaced items match your search.</p>
          <p className="text-xs text-outline mt-1">Try relaxing filters or broadcast a live radar alert.</p>
        </div>
      )}
    </div>
  );
}
