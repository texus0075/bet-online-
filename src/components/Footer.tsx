import React from 'react';
import { ShieldCheck, Lock, PhoneCall, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  language: 'hinglish' | 'english';
  setActiveView: (view: 'DICE' | 'CRASH') => void;
}

export const Footer: React.FC<FooterProps> = ({ language, setActiveView }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#060913] text-slate-400 text-xs py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-sm">
                ⚡
              </span>
              <span className="text-base font-black font-display text-slate-100 tracking-tight">
                CricStrike VIP Casino
              </span>
            </div>
            <p className="text-slate-400 max-w-md text-xs leading-relaxed">
              {language === 'hinglish'
                ? 'भारत का 100% वेरिफाइड रियल-मनी कसीनो व डाइस प्लेटफॉर्म। 50X एविएटर क्रैश, 3D रॉयल डाइस बेटिंग, 10% रेक PVP बैटल व तुरंत UPI विड्रॉल।'
                : 'Premier Verified Real-Money Casino & Dice Arena. 50X Aviator Multiplier, 3D Royal Dice Over/Under 7, 10% Rake PVP Battles & Instant UPI Payouts.'}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[10px]">
                18+ ONLY
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> PROVABLY FAIR 98.2% RTP
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[10px]">
                INSTANT UPI AUTO-PAYOUT
              </span>
            </div>
          </div>

          {/* Real Games Links */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {language === 'hinglish' ? 'रियल-मनी गेम्स' : 'Active Games'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveView('DICE')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  {language === 'hinglish' ? '🎲 रॉयल डाइस अरीना (कैसीनो 7 व बैटल)' : '🎲 Royal Dice Arena (Casino 7 & PVP)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('CRASH')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  {language === 'hinglish' ? '🚀 एविएटर क्रैश (50X मल्टीप्लायर)' : '🚀 Aviator Crash (50X Flight)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('DICE')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  {language === 'hinglish' ? '🏆 10-रोल्स वीकली मेगा टूर्नामेंट' : '🏆 10-Rolls Weekly Championship'}
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Support */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {language === 'hinglish' ? 'सुरक्षा व सहायता' : 'Security & Help'}
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit Escrow Vault</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>SHA-256 Provably Fair Randomness</span>
              </li>
              <li className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                <span>24x7 Priority VIP Support</span>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                {language === 'hinglish'
                  ? 'जिम्मेदारी से खेलें। यह गेम 18 वर्ष से अधिक आयु के उपयोगकर्ताओं के लिए है।'
                  : 'Play responsibly. 18+ Users only.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} CricStrike VIP. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>100% Certified Math</span>
            <span>·</span>
            <span>Zero Withdrawal Commission Leak</span>
            <span>·</span>
            <span>Instant UPI & IMPS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
