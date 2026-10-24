'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Clock, 
  Lock, 
  FileText, 
  HeartHandshake, 
  MapPin, 
  Radio, 
  AlertCircle
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface-variant border-t border-surface-container mt-auto">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-headline text-lg text-on-surface font-extrabold">
                findr<span className="text-secondary font-black">.campus</span>
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              The hyper-local campus recovery grid. Reconnecting university students, faculty, and security personnel with misplaced essentials in minutes.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface text-[11px] font-bold border border-surface-container-high">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                Dean of Students Endorsed
              </span>
            </div>
          </div>

          {/* Col 2: Campus Security Stations */}
          <div className="space-y-2.5">
            <h4 className="font-headline text-xs font-bold text-on-surface uppercase tracking-wider">
              Campus Security Stations
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-on-surface-variant">
                <Phone className="w-3.5 h-3.5 text-outline flex-shrink-0" />
                <span>Central Gate Alpha: 080-2899-1001</span>
              </li>
              <li className="flex items-center gap-2 text-on-surface-variant">
                <MapPin className="w-3.5 h-3.5 text-outline flex-shrink-0" />
                <span>North Library Post: Ext. 4021</span>
              </li>
              <li className="flex items-center gap-2 text-on-surface-variant">
                <MapPin className="w-3.5 h-3.5 text-outline flex-shrink-0" />
                <span>Sports Complex & Arena: Ext. 4088</span>
              </li>
              <li className="flex items-center gap-2 text-on-surface-variant">
                <MapPin className="w-3.5 h-3.5 text-outline flex-shrink-0" />
                <span>Hostel Quad Desk: Block C Ground</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Emergency & WhatsApp */}
          <div className="space-y-2.5">
            <h4 className="font-headline text-xs font-bold text-on-surface uppercase tracking-wider">
              Emergency & WhatsApp
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-on-surface-variant">
                <MessageSquare className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <span>WhatsApp Dispatch: +1 (555) 890-CAMPUS</span>
              </li>
              <li className="flex items-center gap-2 text-on-surface-variant font-medium text-error">
                <AlertCircle className="w-3.5 h-3.5 text-error flex-shrink-0" />
                <span>24/7 Red Phone: 1-800-LOST-AID</span>
              </li>
              <li className="flex items-center gap-2 text-on-surface-variant">
                <Clock className="w-3.5 h-3.5 text-outline flex-shrink-0" />
                <span>Drop Box Hours: 24/7 at all posts</span>
              </li>
              <li className="flex items-center gap-2 text-on-surface-variant">
                <Lock className="w-3.5 h-3.5 text-outline flex-shrink-0" />
                <span>Locker Retrieval: Mon-Sat, 8am-8pm</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Student Protocols */}
          <div className="space-y-2.5">
            <h4 className="font-headline text-xs font-bold text-on-surface uppercase tracking-wider">
              Student Protocols
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => alert('Student Protocol: All claimed items require verification via campus student ID number and unique identifying question.')}
                  className="hover:text-on-surface transition-colors flex items-center gap-1.5 text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                  <span>Verified ID Matching Protocol</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Custody Vault: Electronics valued over $100 are automatically transferred to secured dual-key lockers with surveillance.')}
                  className="hover:text-on-surface transition-colors flex items-center gap-1.5 text-left"
                >
                  <Lock className="w-3.5 h-3.5 text-secondary" />
                  <span>High-Value Item Custody Vault</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Good Karma: Returning student items earns reputation points redeemable for library perks and bookstore coupons.')}
                  className="hover:text-on-surface transition-colors flex items-center gap-1.5 text-left"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-secondary" />
                  <span>Good Karma Rewards System</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Privacy Policy: All location traces and peer-pings are strictly restricted to university geofenced campus quadrants.')}
                  className="hover:text-on-surface transition-colors flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-secondary" />
                  <span>Privacy, GPS & Surveillance Policy</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <div>
            © 2026 findr.campus · Student Affairs & Campus Security Technical Division. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-[11px] font-semibold">
            <button onClick={() => alert('Terms of Claim: Items remaining unclaimed in Safe Lockers past 30 days are logged with Dean of Students.')} className="hover:text-on-surface transition-colors">
              Terms of Claim
            </button>
            <button onClick={() => alert('Student Privacy: No personal phone numbers or dorm room numbers are revealed.')} className="hover:text-on-surface transition-colors">
              Student Privacy Protocol
            </button>
            <button onClick={() => alert('Campus Abuse Hotline: Ext. 4099')} className="hover:text-on-surface transition-colors">
              Report Abuse
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
