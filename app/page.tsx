'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CampusMapScreen } from '@/components/CampusMapScreen';
import { LiveFeedScreen } from '@/components/LiveFeedScreen';
import { ReportScreen } from '@/components/ReportScreen';
import { MyClaimsScreen } from '@/components/MyClaimsScreen';
import { LeaderboardScreen } from '@/components/LeaderboardScreen';
import { LockerOtpModal } from '@/components/LockerOtpModal';
import { BroadcastRadarModal } from '@/components/BroadcastRadarModal';
import { ClaimItemModal } from '@/components/ClaimItemModal';
import { SocialPosterModal } from '@/components/SocialPosterModal';
import { CampusItem } from '@/lib/campusData';
import { useItems } from '@/hooks/use-items';
import { Radio, X } from 'lucide-react';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<string>('campus-hotspots-map');
  const { items, loading, refetch, updateItemStatus, setItems } = useItems();
  const [selectedSector, setSelectedSector] = useState<string>('North Academic Quad');

  // Modals state
  const [isLockerModalOpen, setIsLockerModalOpen] = useState(false);
  const [isRadarModalOpen, setIsRadarModalOpen] = useState(false);
  const [claimModalItem, setClaimModalItem] = useState<CampusItem | null>(null);
  const [posterModalItem, setPosterModalItem] = useState<CampusItem | null>(null);
  const [reportModalType, setReportModalType] = useState<'lost' | 'found'>('lost');

  // Active Broadcast Toast Alert
  const [broadcastNotice, setBroadcastNotice] = useState<string | null>(null);

  const handleOpenReport = (type: 'lost' | 'found') => {
    setReportModalType(type);
    setCurrentTab('report-item');
  };

  const handleItemCreated = (newItem: CampusItem) => {
    setItems((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
  };

  const handleSuccessClaim = async (itemId: string) => {
    try {
      await updateItemStatus(itemId, 'Claimed');
    } catch {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, status: 'Claimed' }
            : item
        )
      );
    }
  };

  const handleBroadcastSuccess = ({ item, sector }: { item: string; sector: string }) => {
    setBroadcastNotice(`🚨 Urgent Lost Radar: "${item}" reported near ${sector}. Student ambassadors alerted!`);
    setTimeout(() => {
      setBroadcastNotice(null);
    }, 8000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenReportModal={handleOpenReport}
        onOpenLockerModal={() => setIsLockerModalOpen(true)}
        onOpenRadarModal={() => setIsRadarModalOpen(true)}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
      />

      {/* Broadcast Alert Toast Banner */}
      {broadcastNotice && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[92%] bg-primary text-on-primary px-4 py-2.5 rounded-xl shadow-2xl flex items-center justify-between gap-3 border border-secondary animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Radio className="w-4 h-4 text-secondary-container animate-pulse flex-shrink-0" />
            <span>{broadcastNotice}</span>
          </div>
          <button
            onClick={() => setBroadcastNotice(null)}
            className="text-white/70 hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View Area (offset for fixed top header 80px + 28px banner) */}
      <main className="w-full pt-[104px] flex-1 flex flex-col">
        {currentTab === 'campus-hotspots-map' && (
          <CampusMapScreen
            items={items}
            onOpenClaimModal={(item) => setClaimModalItem(item)}
            onOpenReportModal={handleOpenReport}
            onOpenLockerModal={() => setIsLockerModalOpen(true)}
            onOpenRadarModal={() => setIsRadarModalOpen(true)}
            selectedSector={selectedSector}
            setSelectedSector={setSelectedSector}
          />
        )}

        {currentTab === 'live-feed' && (
          <LiveFeedScreen
            items={items}
            onOpenClaimModal={(item) => setClaimModalItem(item)}
            onOpenReportModal={handleOpenReport}
            onOpenLockerModal={() => setIsLockerModalOpen(true)}
            onOpenPosterModal={(item) => setPosterModalItem(item)}
          />
        )}

        {currentTab === 'report-item' && (
          <ReportScreen
            initialType={reportModalType}
            onItemCreated={handleItemCreated}
            onNavigateToMap={() => setCurrentTab('campus-hotspots-map')}
          />
        )}

        {currentTab === 'my-claims' && (
          <MyClaimsScreen
            items={items}
            onOpenLockerModal={() => setIsLockerModalOpen(true)}
            onOpenReportModal={handleOpenReport}
          />
        )}

        {currentTab === 'leaderboard' && <LeaderboardScreen />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Locker OTP Modal */}
      <LockerOtpModal
        isOpen={isLockerModalOpen}
        onClose={() => setIsLockerModalOpen(false)}
      />

      {/* Broadcast Radar Modal */}
      <BroadcastRadarModal
        isOpen={isRadarModalOpen}
        onClose={() => setIsRadarModalOpen(false)}
        onBroadcastSuccess={handleBroadcastSuccess}
      />

      {/* Claim Item Modal */}
      <ClaimItemModal
        item={claimModalItem}
        isOpen={!!claimModalItem}
        onClose={() => setClaimModalItem(null)}
        onSuccessClaim={handleSuccessClaim}
      />

      {/* Social Poster / Lost Flyer Modal */}
      <SocialPosterModal
        item={posterModalItem}
        isOpen={!!posterModalItem}
        onClose={() => setPosterModalItem(null)}
      />
    </div>
  );
}
