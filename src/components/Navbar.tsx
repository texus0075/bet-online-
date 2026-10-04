import React from 'react';
import { Volume2, VolumeX, Globe, PlusCircle, ArrowDownRight, Flame, Dices, PieChart, User, Gift } from 'lucide-react';
import { getSoundMuted, setSoundMuted } from '../utils/audio';
import { UserProfile } from '../types';

interface NavbarProps {
  activeView: 'DICE' | 'CRASH';
  setActiveView: (view: 'DICE' | 'CRASH') => void;
  language: 'hinglish' | 'english';
  setLanguage: (lang: 'hinglish' | 'english') => void;
  walletBalance: number;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenAdmin: () => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenReferral: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  language,
  setLanguage,
  walletBalance,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenAdmin,
  userProfile,
  onOpenProfile,
  onOpenReferral,
}) => {
  const [isMuted, setIsMuted] = React.useState(getSoundMuted());

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    setSoundMuted(next);
  };

  const navLinks = [
    {
      id: 'DICE' as const,
      labelEn: 'Royal Dice Arena',
      labelHi: 'रॉयल डाइस अरीना',
      icon: Dices,
      badge: 'HOT · 3 MODES',
    },
    {
      id: 'CRASH' as const,
      labelEn: 'Aviator Crash',
      labelHi: 'एविएटर 50X क्रैश',
      icon: Flame,
      badge: 'PROVABLY FAIR',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070b16]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <button
          onClick={() => setActiveView('DICE')}
          className="flex items-center gap-2.5 text-lg sm:text-xl font-extrabold font-display tracking-tight text-slate-100 hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer group"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform text-sm">
            ⚡
          </span>
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-slate-100 bg-clip-text text-transparent">
            CricStrike VIP
          </span>
        </button>

        {/* Clean 100% Real Games Navigation */}
        <nav className="hidden sm:flex items-center gap-4 text-xs sm:text-sm font-semibold text-slate-300">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveView(link.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{language === 'hinglish' ? link.labelHi : link.labelEn}</span>
                {link.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      link.id === 'DICE'
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

        {/* Primary Actions (Player Profile, Referral, Wallet, Deposit, Withdraw, Admin, Language, Sound) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Player Profile Handle Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-semibold cursor-pointer transition-all"
            title={language === 'hinglish' ? 'प्लेयर प्रोफाइल' : 'Player Profile'}
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline font-mono font-bold text-amber-300">{userProfile.username}</span>
          </button>

          {/* Referral Program Shortcut */}
          <button
            onClick={onOpenReferral}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 hover:border-purple-400 text-purple-300 text-xs font-bold cursor-pointer transition-all"
            title={language === 'hinglish' ? 'रेफरल प्रोग्राम (2% कमीशन)' : 'Referral Program (2%)'}
          >
            <Gift className="w-3.5 h-3.5 text-purple-400" />
            <span>{language === 'hinglish' ? 'रेफरल (2%)' : 'Refer (2%)'}</span>
          </button>

          {/* Wallet Balance Display */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-400 uppercase font-mono font-medium leading-none">
                {language === 'hinglish' ? 'वॉलेट' : 'Balance'}
              </span>
              <span className="text-xs sm:text-sm font-mono font-black text-emerald-400 leading-tight">
                ₹{walletBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Deposit Button */}
          <button
            onClick={onOpenDeposit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-emerald-500/20 cursor-pointer"
            title={language === 'hinglish' ? 'पैसे जमा करें' : 'Deposit Cash'}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'hinglish' ? 'डिपॉजिट' : 'Deposit'}</span>
          </button>

          {/* Withdraw Button */}
          <button
            onClick={onOpenWithdraw}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            title={language === 'hinglish' ? 'पैसे निकालें' : 'Withdraw Cash'}
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'hinglish' ? 'विड्रॉल' : 'Withdraw'}</span>
          </button>

          {/* Admin Owner Panel Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-xl bg-slate-900 border border-purple-500/40 hover:border-purple-400 text-purple-300 transition-colors cursor-pointer"
            title={language === 'hinglish' ? 'मालिक का रेवेन्यू डैशबोर्ड' : 'Owner Revenue Dashboard'}
          >
            <PieChart className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'hinglish' ? 'english' : 'hinglish')}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 transition-all whitespace-nowrap cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hinglish' ? 'Hi' : 'En'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Strip */}
      <div className="sm:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-[#090e1c] text-xs font-medium text-slate-400">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeView === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveView(link.id)}
              className={`flex-1 py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
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
