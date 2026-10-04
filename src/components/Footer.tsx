import React from 'react';
import { ShieldCheck, Award, Lock, HelpCircle, PhoneCall, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  language: 'hinglish' | 'english';
  setActiveView: (view: 'SPORTSBOOK' | 'CRASH' | 'DICE' | 'GAME' | 'TOURNAMENTS') => void;
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
                CricStrike VIP
              </span>
            </div>
            <p className="text-slate-400 max-w-md text-xs leading-relaxed">
              {language === 'hinglish'
                ? 'भारत का प्रमुख ऑनलाइन बेटिंग और गेमिंग प्लेटफॉर्म। 1xBet ऑड्स, एविएटर 50X क्रैश, रॉयल डाइस और 60FPS क्रिकेट बैटिंग।'
                : 'Premier Online Sportsbook, Aviator Multiplier, Royal Dice & High-Fidelity Cricket Gaming Platform.'}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[10px]">
                18+ ONLY
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> PROVABLY FAIR RNG
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[10px]">
                INSTANT UPI PAYOUTS
              </span>
            </div>
          </div>

          {/* Games Quick Jump */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {language === 'hinglish' ? 'गेम्स और मार्केट्स' : 'Games & Arena'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveView('SPORTSBOOK')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {language === 'hinglish' ? '1xBet स्पोर्ट्सबुक (लाइव क्रिकेट)' : '1xBet Sportsbook'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('CRASH')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {language === 'hinglish' ? 'एविएटर 50X क्रैश' : 'Aviator 50X Crash'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('DICE')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {language === 'hinglish' ? 'रॉयल 3D डाइस व ओवर-अंडर 7' : 'Royal 3D Dice Casino'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('GAME')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {language === 'hinglish' ? 'क्रिकेट बैटिंग आर्केड' : 'Cricket Batting Arcade'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('TOURNAMENTS')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {language === 'hinglish' ? 'वीकली टूर्नामेंट्स व लीडरबोर्ड' : 'Weekly Tournaments'}
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
                <span>256-Bit SSL Encrypted Escrow</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Certified Random Number Generator</span>
              </li>
              <li className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                <span>24x7 VIP Support & Telegram</span>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                {language === 'hinglish'
                  ? 'कृपया जिम्मेदारी से खेलें। लत लगने का जोखिम हो सकता है।'
                  : 'Play responsibly. Terms & Conditions apply.'}
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
            <span>Fair Play Certified</span>
            <span>·</span>
            <span>Zero Withdrawal Fees</span>
            <span>·</span>
            <span>Instant Auto-Settlement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
