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
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { AdminOwnerPanel } from './components/AdminOwnerPanel';
import { PlayerStats, OwnerRevenueStats, TransactionRecord } from './types';
import { Play, Trophy, Flame, TrendingUp, Dices, PlusCircle, ArrowDownRight, PieChart } from 'lucide-react';
import { playCashChime } from './utils/audio';

export default function App() {
  const [activeView, setActiveView] = useState<'SPORTSBOOK' | 'CRASH' | 'DICE' | 'GAME' | 'TOURNAMENTS'>('SPORTSBOOK');
  const [language, setLanguage] = useState<'hinglish' | 'english'>('hinglish');

  // Modals
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

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

  // Owner Revenue & Platform Financial Tracker
  const [revenueStats, setRevenueStats] = useState<OwnerRevenueStats>({
    totalWagered: 145000,
    totalPayouts: 132400,
    houseEdgeProfit: 7800,
    pvpRakeEarned: 4600,
    withdrawalFeesEarned: 1200,
    netOwnerProfit: 13600,
    activePlayersToday: 184,
  });

  // Live Audit Ledger Transactions
  const [transactions, setTransactions] = useState<TransactionRecord[]>([
    {
      id: 'tx_1',
      type: 'BATTLE_RAKE',
      amount: 180,
      rake: 20,
      description: 'PVP SPS Battle Rake Collected (Rahul vs Amit)',
      timestamp: '14:20:15',
    },
    {
      id: 'tx_2',
      type: 'WIN_CASINO',
      amount: 1075,
      description: 'Player Won Under 7 Bet (₹500 @ 2.15x)',
      timestamp: '14:15:30',
    },
    {
      id: 'tx_3',
      type: 'BET_CASINO',
      amount: 500,
      description: 'Player Lost Over 7 Bet (₹500 to House)',
      timestamp: '14:10:02',
    },
    {
      id: 'tx_4',
      type: 'DEPOSIT',
      amount: 2000,
      description: 'UPI Deposit via PhonePe (UTR 42198031)',
      timestamp: '14:02:11',
    },
  ]);

  const handleRecordTransaction = (tx: TransactionRecord) => {
    setTransactions(prev => [tx, ...prev.slice(0, 49)]);
  };

  const handleUpdateOwnerRevenue = (wager: number, payout: number, pvpRake: number, houseEdge: number) => {
    setRevenueStats(prev => {
      const newWagered = prev.totalWagered + wager;
      const newPayouts = prev.totalPayouts + payout;
      const newHouseEdge = prev.houseEdgeProfit + houseEdge;
      const newPvpRake = prev.pvpRakeEarned + pvpRake;
      const newNetProfit = newHouseEdge + newPvpRake + prev.withdrawalFeesEarned;
      return {
        ...prev,
        totalWagered: newWagered,
        totalPayouts: newPayouts,
        houseEdgeProfit: newHouseEdge,
        pvpRakeEarned: newPvpRake,
        netOwnerProfit: newNetProfit,
      };
    });
  };

  const handleDepositSuccess = (amount: number) => {
    setPlayerStats(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
    handleRecordTransaction({
      id: Date.now().toString(),
      type: 'DEPOSIT',
      amount,
      description: `Instant UPI Deposit (+₹${amount})`,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const handleWithdrawSuccess = (amount: number, fee: number) => {
    setPlayerStats(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - amount,
    }));
    setRevenueStats(prev => ({
      ...prev,
      withdrawalFeesEarned: prev.withdrawalFeesEarned + fee,
      netOwnerProfit: prev.netOwnerProfit + fee,
    }));
    handleRecordTransaction({
      id: Date.now().toString(),
      type: 'WITHDRAW',
      amount: amount - fee,
      rake: fee,
      description: `Bank Withdrawal Dispatched (Fee: ₹${fee})`,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-body antialiased">
      {/* Navbar with deposit/withdraw/admin modal triggers */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        language={language}
        setLanguage={setLanguage}
        walletBalance={playerStats.walletBalance}
        onOpenDeposit={() => setDepositModalOpen(true)}
        onOpenWithdraw={() => setWithdrawModalOpen(true)}
        onOpenAdmin={() => setAdminPanelOpen(true)}
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

            {/* Quick Balance & Fast Actions Card */}
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3 min-w-[250px] shrink-0">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">{language === 'hinglish' ? 'आपका वॉलेट:' : 'Your Wallet:'}</span>
                <span className="text-xs font-bold text-amber-400">VIP ELITE</span>
              </div>
              <div className="text-3xl font-black font-mono text-emerald-400">
                ₹{playerStats.walletBalance.toLocaleString()}
              </div>

              {/* Deposit and Withdraw Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setDepositModalOpen(true)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{language === 'hinglish' ? 'डिपॉजिट' : 'Deposit'}</span>
                </button>
                <button
                  onClick={() => setWithdrawModalOpen(true)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>{language === 'hinglish' ? 'विड्रॉल' : 'Withdraw'}</span>
                </button>
              </div>

              {/* Owner revenue shortcut */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span>Net Owner Profit:</span>
                <button
                  onClick={() => setAdminPanelOpen(true)}
                  className="text-emerald-400 font-mono font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>₹{revenueStats.netOwnerProfit.toLocaleString()}</span>
                  <PieChart className="w-3 h-3 text-purple-400" />
                </button>
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
              onRecordTransaction={handleRecordTransaction}
              onUpdateOwnerRevenue={handleUpdateOwnerRevenue}
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

      {/* Real-Money Deposit Modal */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        language={language}
        onDepositSuccess={handleDepositSuccess}
      />

      {/* Real-Money Withdrawal Modal (1% Fee) */}
      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        language={language}
        walletBalance={playerStats.walletBalance}
        onWithdrawSuccess={handleWithdrawSuccess}
      />

      {/* Platform Owner Revenue & Control Dashboard */}
      <AdminOwnerPanel
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
        language={language}
        revenueStats={revenueStats}
        transactions={transactions}
      />
    </div>
  );
}
