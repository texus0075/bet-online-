import React from 'react';
import { Volume2, VolumeX, Globe, PlusCircle, Flame, Trophy, Dices, TrendingUp, Play } from 'lucide-react';
import { getSoundMuted, setSoundMuted, playCashChime } from '../utils/audio';

interface NavbarProps {
  activeView: 'SPORTSBOOK' | 'CRASH' | 'DICE' | 'GAME' | 'TOURNAMENTS';
  setActiveView: (view: 'SPORTSBOOK' | 'CRASH' | 'DICE' | 'GAME' | 'TOURNAMENTS') => void;
  language: 'hinglish' | 'english';
  setLanguage: (lang: 'hinglish' | 'english') => void;
  walletBalance: number;
  onQuickDeposit?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  language,
  setLanguage,
  walletBalance,
  onQuickDeposit,
}) => {
  const [isMuted, setIsMuted] = React.useState(getSoundMuted());

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    setSoundMuted(next);
  };

  const navLinks = [
    {
      id: 'SPORTSBOOK' as const,
      labelEn: 'Sportsbook',
      labelHi: '1xBet स्पोर्ट्सबुक',
      icon: TrendingUp,
      badge: 'LIVE',
    },
    {
      id: 'CRASH' as const,
      labelEn: 'Aviator Crash',
      labelHi: 'एविएटर क्रैश',
      icon: Flame,
      badge: '50X',
    },
    {
      id: 'DICE' as const,
      labelEn: 'Dice Casino',
      labelHi: 'रॉयल डाइस',
      icon: Dices,
      badge: 'HOT',
    },
    {
      id: 'GAME' as const,
      labelEn: 'Cricket Arcade',
      labelHi: 'क्रिकेट बैटिंग',
      icon: Play,
      badge: '60FPS',
    },
    {
      id: 'TOURNAMENTS' as const,
      labelEn: 'Tournaments',
      labelHi: 'टूर्नामेंट्स',
      icon: Trophy,
      badge: '₹1.5L',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070b16]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <button
          onClick={() => setActiveView('SPORTSBOOK')}
          className="flex items-center gap-2 text-lg sm:text-xl font-extrabold font-display tracking-tight text-slate-100 hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer group"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            ⚡
          </span>
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-slate-100 bg-clip-text text-transparent">
            CricStrike VIP
          </span>
        </button>

        {/* Clean Gaming Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-300">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveView(link.id)}
                className={`flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer py-1 ${
                  isActive
                    ? 'text-amber-400 font-bold border-b-2 border-amber-400'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{language === 'hinglish' ? link.labelHi : link.labelEn}</span>
                {link.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      link.badge === 'LIVE'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                        : link.badge === 'HOT'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Primary Actions (Wallet, Deposit, Language, Audio) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wallet Balance Display & Quick Add */}
          <div className="flex items-center gap-2 bg-slate-900 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-medium leading-none">
                {language === 'hinglish' ? 'वॉलेट' : 'Balance'}
              </span>
              <span className="text-sm font-mono font-black text-emerald-400 leading-tight">
                ₹{walletBalance.toLocaleString()}
              </span>
            </div>

            {onQuickDeposit && (
              <button
                onClick={onQuickDeposit}
                className="p-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors cursor-pointer"
                title={language === 'hinglish' ? '₹500 डिपॉजिट करें' : 'Quick Deposit ₹500'}
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'hinglish' ? 'english' : 'hinglish')}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-slate-700 transition-all whitespace-nowrap cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hinglish' ? 'Hinglish' : 'English'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Secondary Nav Strip */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-[#090e1c] text-xs font-medium text-slate-400 scrollbar-none">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeView === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveView(link.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                isActive
                  ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{language === 'hinglish' ? link.labelHi : link.labelEn}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
