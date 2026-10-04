/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BattingCanvasGame } from './components/BattingCanvasGame';
import { SportsbookEngine } from './components/SportsbookEngine';
import { AviatorCrashGame } from './components/AviatorCrashGame';
import { FlowWalkthrough } from './components/FlowWalkthrough';
import { TechStackGuide } from './components/TechStackGuide';
import { PromptEngineeringStudio } from './components/PromptEngineeringStudio';
import { MultiplayerTournaments } from './components/MultiplayerTournaments';
import { AntiCheatInspector } from './components/AntiCheatInspector';
import { PlayerStats } from './types';
import { Play, Shield, Cpu, BookOpen, Trophy, ArrowRight, Zap, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'SPORTSBOOK' | 'CRASH' | 'GAME' | 'FLOW' | 'TECH' | 'PROMPTS' | 'TOURNAMENTS' | 'ANTICHEAT'>('SPORTSBOOK');
  const [language, setLanguage] = useState<'hinglish' | 'english'>('hinglish');

  // Global Player stats
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    matchesPlayed: 14,
    totalRuns: 284,
    fours: 38,
    sixes: 22,
    highestScore: 42,
    strikeRate: 236,
    winRate: 72,
    walletBalance: 1250,
    ratingMMR: 1250,
    antiCheatTrustScore: 100,
  });

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-body antialiased">
      {/* Navbar with strict 3-zone contract */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        language={language}
        setLanguage={setLanguage}
        walletBalance={playerStats.walletBalance}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-8">
        {/* Hero Banner with Key Metrics & Mode Jump */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#0c1527] via-[#091120] to-[#070c17] border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl stadium-lights-glow">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {language === 'hinglish'
                    ? '1xBet, bet365 व Aviator स्टाइल रियल-मनी बेटिंग गेमिंग प्लेटफॉर्म'
                    : 'Premier Real-Money Betting Engine · 1xBet, bet365 & Aviator Architecture'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-100 tracking-tight leading-tight">
                {language === 'hinglish' ? (
                  <>
                    लाइव <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">स्पोर्ट्सबुक, एविएटर क्रैश</span> और बैटिंग फिजिक्स
                  </>
                ) : (
                  <>
                    Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Sportsbook, Aviator Crash</span> & Cricket Engine
                  </>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {language === 'hinglish'
                  ? '1xBet और bet365 की तरह बॉल-बाय-बॉल लाइव बेटिंग, ऑड्स कैलकुलेटर, एविएटर स्टाइल 50X क्रैश गेम, और बिना लैग 50,000+ खिलाड़ियों को संभालने का पूरा आर्किटेक्चर।'
                  : 'Complete ecosystem: In-play cricket betting markets & betslip, Aviator multiplier crash curve, 60fps canvas batting simulator, and production developer prompts.'}
              </p>

              {/* Quick Jump Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-2">
                <button
                  onClick={() => setActiveView('SPORTSBOOK')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeView === 'SPORTSBOOK'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400/50'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{language === 'hinglish' ? '1xBet स्पोर्ट्सबुक' : '1xBet Sportsbook'}</span>
                </button>

                <button
                  onClick={() => setActiveView('CRASH')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeView === 'CRASH'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400/50'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{language === 'hinglish' ? 'एविएटर क्रैश (50X)' : 'Aviator Crash (50X)'}</span>
                </button>

                <button
                  onClick={() => setActiveView('GAME')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeView === 'GAME'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400/50'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'hinglish' ? 'बैटिंग सिम्युलेटर' : 'Batting Simulator'}</span>
                </button>

                <button
                  onClick={() => setActiveView('FLOW')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeView === 'FLOW'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400/50'
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{language === 'hinglish' ? 'सिस्टम फ्लो' : 'System Flow'}</span>
                </button>

                <button
                  onClick={() => setActiveView('PROMPTS')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeView === 'PROMPTS'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400/50'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{language === 'hinglish' ? 'मास्टर प्रॉम्प्ट्स' : 'Master Prompts'}</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Pill Strip */}
            <div className="flex flex-row lg:flex-col gap-4 text-xs font-mono border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 shrink-0">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-sans">Live Odds Feed</div>
                <div className="text-emerald-400 font-bold">&lt; 100ms Push (Sportradar)</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-sans">Crash Algorithm</div>
                <div className="text-amber-400 font-bold">100% Provably Fair (SHA-256)</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-sans">Payment Gateway</div>
                <div className="text-slate-200 font-bold">Instant UPI / Escrow Locks</div>
              </div>
            </div>
          </div>
        </section>

        {/* View Component Switcher */}
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

        {activeView === 'GAME' && (
          <section className="space-y-6">
            <BattingCanvasGame
              language={language}
              playerStats={playerStats}
              setPlayerStats={setPlayerStats}
            />
          </section>
        )}

        {activeView === 'FLOW' && (
          <section className="space-y-6">
            <FlowWalkthrough language={language} />
          </section>
        )}

        {activeView === 'TECH' && (
          <section className="space-y-6">
            <TechStackGuide language={language} />
          </section>
        )}

        {activeView === 'PROMPTS' && (
          <section className="space-y-6">
            <PromptEngineeringStudio language={language} />
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

        {activeView === 'ANTICHEAT' && (
          <section className="space-y-6">
            <AntiCheatInspector language={language} />
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer language={language} setActiveView={setActiveView} />
    </div>
  );
}

