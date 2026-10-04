import React from 'react';
import { Volume2, VolumeX, Globe } from 'lucide-react';
import { getSoundMuted, setSoundMuted } from '../utils/audio';

interface NavbarProps {
  activeView: 'GAME' | 'SPORTSBOOK' | 'CRASH' | 'FLOW' | 'TECH' | 'PROMPTS' | 'TOURNAMENTS' | 'ANTICHEAT';
  setActiveView: (view: 'GAME' | 'SPORTSBOOK' | 'CRASH' | 'FLOW' | 'TECH' | 'PROMPTS' | 'TOURNAMENTS' | 'ANTICHEAT') => void;
  language: 'hinglish' | 'english';
  setLanguage: (lang: 'hinglish' | 'english') => void;
  walletBalance: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  language,
  setLanguage,
  walletBalance,
}) => {
  const [isMuted, setIsMuted] = React.useState(getSoundMuted());

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    setSoundMuted(next);
  };

  const navLinks = [
    { id: 'SPORTSBOOK' as const, labelEn: '1xBet Sportsbook', labelHi: '1xBet स्पोर्ट्सबुक' },
    { id: 'CRASH' as const, labelEn: 'Aviator Crash', labelHi: 'एविएटर क्रैश' },
    { id: 'GAME' as const, labelEn: 'Batting Simulator', labelHi: 'बैटिंग सिम्युलेटर' },
    { id: 'FLOW' as const, labelEn: 'System Flow', labelHi: 'सिस्टम फ्लो' },
    { id: 'PROMPTS' as const, labelEn: 'Master Prompts', labelHi: 'मास्टर प्रॉम्प्ट्स' },
    { id: 'TECH' as const, labelEn: 'Tech Stack', labelHi: 'टेक स्टैक' },
    { id: 'TOURNAMENTS' as const, labelEn: 'Tournaments', labelHi: 'टूर्नामेंट्स' },
    { id: 'ANTICHEAT' as const, labelEn: 'Anti-Cheat', labelHi: 'एंटी-चीट' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070b16]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveView('GAME')}
          className="text-lg sm:text-xl font-extrabold font-display tracking-tight text-slate-100 hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer"
        >
          CricStrike VIP
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveView(link.id)}
              className={`transition-colors whitespace-nowrap hover:text-slate-100 ${
                activeView === link.id
                  ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-1 -mb-1'
                  : 'text-slate-400'
              }`}
            >
              {language === 'hinglish' ? link.labelHi : link.labelEn}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions (Language, Audio, Wallet) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wallet Balance Display */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg">
            <span>₹{walletBalance}</span>
            <span className="text-[10px] text-slate-400 uppercase font-sans font-normal">Escrow</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'hinglish' ? 'english' : 'hinglish')}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-slate-700 transition-all whitespace-nowrap"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hinglish' ? 'Hinglish' : 'English'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Secondary Nav Strip */}
      <div className="lg:hidden flex items-center gap-3 overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-[#090e1c] text-xs font-medium text-slate-400 scrollbar-none">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveView(link.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md transition-colors ${
              activeView === link.id
                ? 'bg-amber-500/15 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'hinglish' ? link.labelHi : link.labelEn}
          </button>
        ))}
      </div>
    </header>
  );
};
