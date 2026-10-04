/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SportsbookEngine } from './components/SportsbookEngine';
import { AviatorCrashGame } from './components/AviatorCrashGame';
import { DiceGame } from './components/DiceGame';
import { BattingCanvasGame } from './components/BattingCanvasGame';
import { MultiplayerTournaments } from './components/MultiplayerTournaments';
import { PlayerStats } from './types';
import { Play, Trophy, Flame, TrendingUp, Dices, PlusCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { playCashChime } from './utils/audio';

export default function App() {
  const [activeView, setActiveView] = useState<'SPORTSBOOK' | 'CRASH' | 'DICE' | 'GAME' | 'TOURNAMENTS'>('SPORTSBOOK');
  const [language, setLanguage] = useState<'hinglish' | 'english'>('hinglish');
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  // Global Player stats
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    matchesPlayed: 14,
    totalRuns: 284,
    fours: 38,
    sixes: 22,
    highestScore: 42,
    strikeRate: 236,
    winRate: 72,
    walletBalance: 2500,
    ratingMMR: 1250,
    antiCheatTrustScore: 100,
  });

  const handleQuickDeposit = (amount: number = 500) => {
    setPlayerStats(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
    playCashChime();
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-body antialiased">
      {/* Navbar with 5 real gaming modes & wallet */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        language={language}
        setLanguage={setLanguage}
        walletBalance={playerStats.walletBalance}
        onQuickDeposit={() => handleQuickDeposit(500)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-8">
        {/* Casino & Sports VIP Hero Banner */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#0c1527] via-[#091120] to-[#070c17] border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl stadium-lights-glow">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[11px] font-bold">
                  {language === 'hinglish' ? 'VIP क्लब लाइव' : 'VIP CLUB ACTIVE'}
                </span>
                <span>
                  {language === 'hinglish'
                    ? '1xBet ऑड्स, 50X एविएटर और 3D रॉयल डाइस'
                    : 'Premier Sportsbook, 50X Aviator & 3D Royal Dice'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-100 tracking-tight leading-tight">
                {language === 'hinglish' ? (
                  <>
                    लाइव <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-100">स्पोर्ट्सबुक, एविएटर क्रैश</span> और रॉयल डाइस
                  </>
                ) : (
                  <>
                    Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-100">Sportsbook, Aviator Crash</span> & Royal Dice
                  </>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {language === 'hinglish'
                  ? 'बॉल-बाय-बॉल क्रिकेट लाइव ऑड्स, 50X एविएटर क्रैश मल्टीप्लायर, 3D फिजिक्स डाइस व 60FPS क्रिकेट बैटिंग आर्केड। तुरंत विनिंग पेआउट्स।'
                  : 'Real-time in-play cricket betting, high-multiplier Aviator curve, 3D dice over/under 7, and 60FPS batting arcade with instant escrow payouts.'}
              </p>

              {/* Game Mode Navigation Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-2">
                <button
                  onClick={() => setActiveView('SPORTSBOOK')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeView === 'SPORTSBOOK'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 ring-1 ring-amber-400'
                      : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400/50'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{language === 'hinglish' ? '1xBet स्पोर्ट्सबुक' : '1xBet Sportsbook'}</span>
                </button>

                <button
                  onClick={() => setActiveView('CRASH')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeView === 'CRASH'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 ring-1 ring-amber-400'
                      : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400/50'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{language === 'hinglish' ? 'एविएटर क्रैश (50X)' : 'Aviator Crash'}</span>
                </button>

                <button
                  onClick={() => setActiveView('DICE')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeView === 'DICE'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 ring-1 ring-amber-400'
                      : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400/50'
                  }`}
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>{language === 'hinglish' ? 'रॉयल डाइस अरीना' : 'Royal Dice'}</span>
                </button>

                <button
                  onClick={() => setActiveView('GAME')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeView === 'GAME'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 ring-1 ring-amber-400'
                      : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400/50'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'hinglish' ? 'बैटिंग आर्केड' : 'Batting Arcade'}</span>
                </button>

                <button
                  onClick={() => setActiveView('TOURNAMENTS')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeView === 'TOURNAMENTS'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 ring-1 ring-amber-400'
                      : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400/50'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{language === 'hinglish' ? 'टूर्नामेंट्स (₹1.5L)' : 'Tournaments'}</span>
                </button>
              </div>
            </div>

            {/* Quick Balance & VIP Status Card */}
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3 min-w-[240px] shrink-0">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">{language === 'hinglish' ? 'आपका वॉलेट:' : 'Your Wallet:'}</span>
                <span className="text-xs font-bold text-amber-400">VIP ELITE</span>
              </div>
              <div className="text-3xl font-black font-mono text-emerald-400">
                ₹{playerStats.walletBalance.toLocaleString()}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleQuickDeposit(500)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ ₹500</span>
                </button>
                <button
                  onClick={() => handleQuickDeposit(2000)}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ ₹2,000</span>
                </button>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span>Win Rate: {playerStats.winRate}%</span>
                <span>Matches: {playerStats.matchesPlayed}</span>
              </div>
            </div>
          </div>
        </section>

        {/* View Component Switcher (Pure Gaming Views Only) */}
        {activeView === 'SPORTSBOOK' && (
          <section className="space-y-6">
            <SportsbookEngine
              language={language}
              playerStats={playerStats}
              setPlayerStats={setPlayerStats}
            />
          </section>
        )}

        {activeView === 'CRASH' && (
          <section className="space-y-6">
            <AviatorCrashGame
              language={language}
              playerStats={playerStats}
              setPlayerStats={setPlayerStats}
            />
          </section>
        )}

        {activeView === 'DICE' && (
          <section className="space-y-6">
            <DiceGame
              language={language}
              playerStats={playerStats}
              setPlayerStats={setPlayerStats}
            />
          </section>
        )}

        {activeView === 'GAME' && (
          <section className="space-y-6">
            <BattingCanvasGame
              language={language}
              playerStats={playerStats}
              setPlayerStats={setPlayerStats}
            />
          </section>
        )}

        {activeView === 'TOURNAMENTS' && (
          <section className="space-y-6">
            <MultiplayerTournaments
              language={language}
              playerStats={playerStats}
              setPlayerStats={setPlayerStats}
              onLaunchMatch={() => setActiveView('GAME')}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer language={language} setActiveView={setActiveView} />
    </div>
  );
}
