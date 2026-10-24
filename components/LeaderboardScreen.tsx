'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Award, 
  Sparkles, 
  Trophy, 
  Coffee, 
  BookOpen, 
  GraduationCap, 
  CheckCircle, 
  ChevronRight,
  Shield,
  Gift
} from 'lucide-react';
import { KARMA_LEADERBOARD } from '@/lib/campusData';

export function LeaderboardScreen() {
  const [redeemedPerk, setRedeemedPerk] = useState<string | null>(null);

  const perks = [
    {
      id: 'perk-1',
      title: 'Free Artisanal Coffee Voucher',
      provider: 'Nescafe & Campus Food Hub',
      cost: 150,
      icon: Coffee,
      desc: 'Valid for any handcrafted brew or iced latte at the Central Library Nescafe bar.'
    },
    {
      id: 'perk-2',
      title: 'Priority Library Study Cubicle (1 Week)',
      provider: 'Central Library Administration',
      cost: 250,
      icon: BookOpen,
      desc: 'Reserved private study room with power outlets on the 3rd Floor Silent Wing.'
    },
    {
      id: 'perk-3',
      title: '$25 University Bookstore Credit',
      provider: 'Student Union Store',
      cost: 400,
      icon: Gift,
      desc: 'Applicable towards university apparel, engineering tools, and course textbooks.'
    },
    {
      id: 'perk-4',
      title: 'Dean of Students Commendation Certificate',
      provider: 'Office of Student Affairs',
      cost: 500,
      icon: GraduationCap,
      desc: 'Official co-curricular leadership certificate verifying student ethics and peer assistance.'
    }
  ];

  const handleRedeem = (title: string) => {
    setRedeemedPerk(title);
    setTimeout(() => setRedeemedPerk(null), 4000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Hero Profile Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-secondary/20 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-4 ring-secondary-container flex-shrink-0 shadow-lg">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdz9ajjOFDIL3XIM5dw-yYh-Bha-8ls7ZBAxiwPqH1CefwquNohcflZZDJ0u4XHwYS8rHY_bMIDcnWP9DXqGD7ksICQSqGD6SAEXrKn_2DIivPE0Lr5Iw1QxJJroaH_-ZQD1atih_2DKLT_ccNShf0S2XGoDurzHDqr6GLFYaqq9OWwQl_olqQlSRhASqzku31T35flkPPyLGSQqgAkdAZa0OO1AXG2F6I8nqGkodBhZswiva7NbUYRg"
                alt="Aarav"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-black text-xl sm:text-2xl text-white">Aarav Verma</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[10px] font-extrabold uppercase">
                  Rank #4
                </span>
              </div>
              <p className="text-xs text-outline-variant mt-0.5">Computer Science Dept · Class of 2027</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-white/90">
                <span className="flex items-center gap-1 font-bold text-secondary-container">
                  <Sparkles className="w-4 h-4" /> 420 Karma Points
                </span>
                <span>·</span>
                <span>8 Misplaced Items Reunited</span>
                <span>·</span>
                <span className="text-emerald-400 font-semibold">100% Return Integrity</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 self-start md:self-auto">
            <Trophy className="w-6 h-6 text-secondary-container" />
            <div>
              <div className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Badge Tier</div>
              <div className="font-headline font-bold text-sm text-white">Quad Ambassador</div>
            </div>
          </div>
        </div>
      </div>

      {redeemedPerk && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Success! Voucher for &quot;{redeemedPerk}&quot; sent to student email aarav.v@campus.edu.</span>
          </div>
        </div>
      )}

      {/* Grid: Leaderboard Table and Karma Rewards Store */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-container shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div>
              <h2 className="font-headline font-black text-lg text-on-surface">
                Campus Good Karma League
              </h2>
              <p className="text-xs text-on-surface-variant">
                Top students, professors, and security champions reuniting items this semester.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-container text-on-surface">
              Semester Standings
            </span>
          </div>

          <div className="divide-y divide-surface-container">
            {KARMA_LEADERBOARD.map((user) => (
              <div
                key={user.rank}
                className={`py-3.5 px-3 rounded-xl flex items-center justify-between transition-colors ${
                  user.name.includes('You')
                    ? 'bg-secondary-fixed/30 border border-secondary/20'
                    : 'hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-headline font-black text-xs ${
                      user.rank === 1
                        ? 'bg-secondary-container text-on-secondary-fixed'
                        : user.rank === 2
                        ? 'bg-surface-container-highest text-on-surface font-bold'
                        : user.rank === 3
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-surface-container text-outline'
                    }`}
                  >
                    #{user.rank}
                  </span>

                  <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0 bg-surface-container ring-1 ring-surface-container-highest">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-on-surface">{user.name}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-surface-container text-on-surface-variant font-semibold">
                        {user.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-outline block">{user.department}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-headline font-black text-xs text-secondary flex items-center justify-end gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{user.karmaPoints} pts</span>
                  </div>
                  <span className="text-[10px] text-outline">{user.itemsReunited} handovers</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Karma Rewards Store (1 Col) */}
        <div className="bg-white rounded-2xl border border-surface-container shadow-sm p-6 space-y-4">
          <div className="border-b border-surface-container pb-3">
            <h3 className="font-headline font-black text-base text-on-surface">
              Good Karma Perks Store
            </h3>
            <p className="text-xs text-on-surface-variant">
              Redeem verified karma points for campus benefits.
            </p>
          </div>

          <div className="space-y-3">
            {perks.map((perk) => {
              const Icon = perk.icon;
              const canAfford = 420 >= perk.cost;

              return (
                <div
                  key={perk.id}
                  className="p-3.5 rounded-xl border border-surface-container bg-surface-container-low hover:bg-white transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-white border border-surface-container text-secondary">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-on-surface leading-tight">
                          {perk.title}
                        </h4>
                        <span className="text-[10px] text-outline">{perk.provider}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {perk.desc}
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-secondary flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {perk.cost} Karma
                    </span>
                    <button
                      onClick={() => handleRedeem(perk.title)}
                      disabled={!canAfford}
                      className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[11px] font-bold transition-all disabled:opacity-40 cursor-pointer"
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
