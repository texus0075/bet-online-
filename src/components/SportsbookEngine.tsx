import React, { useState } from 'react';
import { TrendingUp, Check, X, ShieldCheck, Clock, Zap, ArrowUpRight, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { PlayerStats } from '../types';
import { playCashChime } from '../utils/audio';

interface SportsbookProps {
  language: 'hinglish' | 'english';
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
}

interface BetSelection {
  id: string;
  match: string;
  market: string;
  selection: string;
  odds: number;
}

interface ActiveBet {
  id: string;
  match: string;
  selection: string;
  market: string;
  stake: number;
  odds: number;
  potentialReturn: number;
  cashoutValue: number;
  status: 'OPEN' | 'WON' | 'LOST' | 'CASHED_OUT';
  placedAt: string;
}

export const SportsbookEngine: React.FC<SportsbookProps> = ({
  language,
  playerStats,
  setPlayerStats,
}) => {
  const [selectedMatch, setSelectedMatch] = useState('match_1');
  const [betslipSelections, setBetslipSelections] = useState<BetSelection[]>([]);
  const [stakeAmount, setStakeAmount] = useState<number>(500);
  const [activeBets, setActiveBets] = useState<ActiveBet[]>([
    {
      id: 'bet_101',
      match: 'India vs Australia · T20 Final',
      market: 'Next Ball Outcome (Ball 4.2)',
      selection: 'Boundary (4 or 6)',
      stake: 500,
      odds: 3.40,
      potentialReturn: 1700,
      cashoutValue: 620,
      status: 'OPEN',
      placedAt: 'Just now',
    },
  ]);
  const [activeTab, setActiveTab] = useState<'MARKETS' | 'MY_BETS'>('MARKETS');
  const [betSuccessBanner, setBetSuccessBanner] = useState<string | null>(null);

  // Match info
  const matches = [
    {
      id: 'match_1',
      title: 'India vs Australia',
      subtitle: 'ICC T20 World Cup Final · Live In-Play',
      score: 'IND 142/3 (15.2 Ov) · Need 48 off 28',
      currentBatsmen: 'V. Kohli 64* (42) · H. Pandya 18* (11)',
      currentBowler: 'P. Cummins 2.2-0-21-1',
      runRate: '9.26 RRR: 10.28',
      status: 'LIVE',
    },
    {
      id: 'match_2',
      title: 'Mumbai Indians vs Chennai Super Kings',
      subtitle: 'IPL 2026 Blockbuster · Live In-Play',
      score: 'MI 188/5 (20.0 Ov) vs CSK 74/1 (7.4 Ov)',
      currentBatsmen: 'R. Gaikwad 38* (24) · S. Dube 14* (8)',
      currentBowler: 'J. Bumrah 1.4-0-11-1',
      runRate: '9.65 RRR: 9.32',
      status: 'LIVE',
    },
  ];

  const currentMatchData = matches.find((m) => m.id === selectedMatch) || matches[0];

  // Markets list
  const markets = [
    {
      id: 'm_winner',
      name: language === 'hinglish' ? 'मैच विनर (1X2 Match Winner)' : 'Match Winner (1X2)',
      options: [
        { id: 'opt_ind', label: 'India', odds: 1.68 },
        { id: 'opt_aus', label: 'Australia', odds: 2.24 },
      ],
    },
    {
      id: 'm_next_ball',
      name: language === 'hinglish' ? 'अगली गेंद लाइव प्रेडिक्शन (Ball 15.3 In-Play)' : 'Next Ball Live Market (Ball 15.3)',
      options: [
        { id: 'opt_dot', label: 'Dot Ball (0)', odds: 1.85 },
        { id: 'opt_single', label: '1 or 2 Runs', odds: 2.10 },
        { id: 'opt_four', label: 'Boundary Four (4)', odds: 3.80 },
        { id: 'opt_six', label: 'Maximum Six (6)', odds: 5.50 },
        { id: 'opt_wicket', label: 'Wicket Fall', odds: 4.20 },
      ],
    },
    {
      id: 'm_over_runs',
      name: language === 'hinglish' ? 'ओवर 16 कुल रन (Over 16 Total Runs)' : 'Over 16 Total Runs (Over/Under)',
      options: [
        { id: 'opt_over_95', label: 'Over 9.5 Runs', odds: 1.88 },
        { id: 'opt_under_95', label: 'Under 9.5 Runs', odds: 1.92 },
        { id: 'opt_over_125', label: 'Over 12.5 Runs', odds: 2.65 },
      ],
    },
    {
      id: 'm_kohli_runs',
      name: language === 'hinglish' ? 'विराट कोहली कुल रन (V. Kohli Total Runs)' : 'V. Kohli Total Runs Line',
      options: [
        { id: 'opt_kohli_o75', label: 'Over 75.5 Runs', odds: 1.80 },
        { id: 'opt_kohli_u75', label: 'Under 75.5 Runs', odds: 1.95 },
      ],
    },
  ];

  const handleToggleSelection = (marketName: string, option: { id: string; label: string; odds: number }) => {
    const existing = betslipSelections.find((s) => s.id === option.id);
    if (existing) {
      setBetslipSelections((prev) => prev.filter((s) => s.id !== option.id));
    } else {
      setBetslipSelections([
        {
          id: option.id,
          match: currentMatchData.title,
          market: marketName,
          selection: option.label,
          odds: option.odds,
        },
      ]);
    }
  };

  const handlePlaceBet = () => {
    if (betslipSelections.length === 0 || stakeAmount <= 0) return;
    if (playerStats.walletBalance < stakeAmount) {
      alert(language === 'hinglish' ? 'अपर्याप्त वॉलेट बैलेंस! पहले डिपॉजिट करें।' : 'Insufficient wallet balance! Please add funds.');
      return;
    }

    const sel = betslipSelections[0];
    const potReturn = Math.round(stakeAmount * sel.odds);

    const newBet: ActiveBet = {
      id: `bet_${Date.now().toString().slice(-4)}`,
      match: sel.match,
      market: sel.market,
      selection: sel.selection,
      stake: stakeAmount,
      odds: sel.odds,
      potentialReturn: potReturn,
      cashoutValue: Math.round(stakeAmount * 0.95),
      status: 'OPEN',
      placedAt: 'Just now',
    };

    setActiveBets([newBet, ...activeBets]);
    setPlayerStats((prev) => ({ ...prev, walletBalance: prev.walletBalance - stakeAmount }));
    setBetslipSelections([]);
    setBetSuccessBanner(
      language === 'hinglish'
        ? `बैट सफलतापूर्वक लगाई गई! संभावित रिटर्न: ₹${potReturn}`
        : `Bet Placed Successfully! Potential Return: ₹${potReturn}`
    );
    playCashChime();

    setTimeout(() => setBetSuccessBanner(null), 4000);
  };

  const handleCashout = (betId: string) => {
    const target = activeBets.find((b) => b.id === betId);
    if (!target || target.status !== 'OPEN') return;

    setActiveBets((prev) =>
      prev.map((b) => (b.id === betId ? { ...b, status: 'CASHED_OUT' } : b))
    );
    setPlayerStats((prev) => ({ ...prev, walletBalance: prev.walletBalance + target.cashoutValue }));
    playCashChime();
    setBetSuccessBanner(
      language === 'hinglish'
        ? `कैशआउट सफल! ₹${target.cashoutValue} तुरंत आपके वॉलेट में जोड़े गए।`
        : `Instant Cashout Complete! ₹${target.cashoutValue} credited to wallet.`
    );
    setTimeout(() => setBetSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1xBet / Bet365 Style Live Sportsbook Banner */}
      <div className="bg-[#0b1222] border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>1xBet / bet365 Style Live Sportsbook & Exchange</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold font-display text-slate-100">
            {language === 'hinglish' ? 'लाइव क्रिकेट स्पोर्ट्स बेटिंग और ऑड्स इंजन' : 'Live Cricket Sportsbook & Real-Time Odds Engine'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {language === 'hinglish'
              ? '1xBet और bet365 की तरह बॉल-बाय-बॉल लाइव बेट्स, ओवर/अंडर मार्केट्स, और रियल-टाइम कैशआउट इंजन।'
              : 'Professional in-play ball-by-ball markets, dynamic odds calculation, interactive betslip, and instant UPI cashout.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('MARKETS')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'MARKETS'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'hinglish' ? 'लाइव मार्केट्स' : 'Live Markets'}
          </button>
          <button
            onClick={() => setActiveTab('MY_BETS')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all relative ${
              activeTab === 'MY_BETS'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{language === 'hinglish' ? 'मेरी बेट्स' : 'Open Bets'}</span>
            {activeBets.filter((b) => b.status === 'OPEN').length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono bg-red-500 text-white rounded-full">
                {activeBets.filter((b) => b.status === 'OPEN').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {betSuccessBanner && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{betSuccessBanner}</span>
        </div>
      )}

      {/* Main Grid: Markets on Left, Betslip on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Match Feed & Markets */}
        <div className="lg:col-span-8 space-y-5">
          {/* Match Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {matches.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMatch(m.id)}
                className={`px-4 py-2.5 rounded-xl border text-left shrink-0 transition-all ${
                  selectedMatch === m.id
                    ? 'bg-slate-900 border-amber-500/70 text-slate-100 shadow-md shadow-amber-500/10'
                    : 'bg-[#080d19] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">{m.title}</span>
                </div>
                <div className="text-[11px] font-mono text-amber-400">{m.score}</div>
              </button>
            ))}
          </div>

          {/* Live In-Play Match Scorecard Card */}
          <div className="bg-[#090f1d] border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="font-semibold text-slate-200">{currentMatchData.subtitle}</span>
              <span className="font-mono text-emerald-400">{currentMatchData.runRate}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-2xl font-bold font-mono text-amber-400">{currentMatchData.score}</div>
                <div className="text-xs text-slate-300 font-medium mt-1">{currentMatchData.currentBatsmen}</div>
                <div className="text-xs text-slate-400 mt-0.5">{currentMatchData.currentBowler}</div>
              </div>
              <div className="bg-[#060a14] border border-slate-800 rounded-xl p-3 text-right">
                <div className="text-[10px] uppercase font-mono text-slate-500">Live Odds Update</div>
                <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sub-second Feed Sync</span>
                </div>
              </div>
            </div>
          </div>

          {/* Betting Markets Accordion / Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              {language === 'hinglish' ? 'लाइव इन-प्ले मार्केट्स' : 'Available Betting Markets'}
            </h3>

            {markets.map((m) => (
              <div key={m.id} className="bg-[#090f1d] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">{m.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">Live In-Play</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {m.options.map((opt) => {
                    const isSelected = betslipSelections.some((s) => s.id === opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleToggleSelection(m.name, opt)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                            : 'bg-[#060a14] border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-200'
                        }`}
                      >
                        <div className={`text-xs ${isSelected ? 'font-bold' : 'text-slate-300'}`}>
                          {opt.label}
                        </div>
                        <div className={`text-sm font-bold font-mono mt-1 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`}>
                          {opt.odds.toFixed(2)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Betslip & Cashout Deck */}
        <div className="lg:col-span-4 space-y-5">
          {/* Betslip Container */}
          <div className="bg-[#090f1d] border border-slate-800 rounded-2xl p-5 space-y-4 sticky top-20 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold font-display text-slate-100">
                  {language === 'hinglish' ? 'बैटस्लिप (Betslip)' : 'Interactive Betslip'}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {betslipSelections.length}
                </span>
              </div>
              {betslipSelections.length > 0 && (
                <button
                  onClick={() => setBetslipSelections([])}
                  className="text-[11px] text-slate-500 hover:text-red-400 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Selected Bets List */}
            {betslipSelections.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 space-y-1">
                <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p>{language === 'hinglish' ? 'कोई भी मार्केट चुनकर ऑड्स पर क्लिक करें।' : 'Click any market odds to add to your betslip.'}</p>
                <p className="text-[11px] text-slate-600">Single & Multi-bets supported</p>
              </div>
            ) : (
              <div className="space-y-3">
                {betslipSelections.map((sel) => (
                  <div key={sel.id} className="p-3 bg-[#060a14] border border-slate-800 rounded-xl relative text-xs">
                    <button
                      onClick={() => setBetslipSelections((prev) => prev.filter((s) => s.id !== sel.id))}
                      className="absolute top-2 right-2 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-[10px] text-amber-400 font-semibold uppercase">{sel.match}</div>
                    <div className="font-bold text-slate-100 mt-0.5">{sel.selection}</div>
                    <div className="text-[11px] text-slate-400">{sel.market}</div>
                    <div className="mt-2 flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-400">Odds:</span>
                      <span className="text-emerald-400 text-sm">{sel.odds.toFixed(2)}</span>
                    </div>
                  </div>
                ))}

                {/* Stake Input */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Stake Amount:</span>
                    <span className="font-mono text-emerald-400 font-bold">₹{stakeAmount}</span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">₹</span>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(Math.max(10, Number(e.target.value)))}
                      className="w-full bg-[#060a14] border border-slate-700 rounded-xl py-2 pl-7 pr-3 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Quick Stake Chips */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[100, 500, 1000, 5000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setStakeAmount(amt)}
                        className={`py-1 rounded-lg text-[10px] font-mono font-semibold border transition-all ${
                          stakeAmount === amt
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>

                  {/* Return Summary */}
                  <div className="p-3 bg-[#060a14] border border-slate-800 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Odds:</span>
                      <span className="font-mono text-slate-200">
                        {betslipSelections.reduce((acc, s) => acc * s.odds, 1).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-100 pt-1 border-t border-slate-800">
                      <span>Potential Payout:</span>
                      <span className="font-mono text-amber-400 text-sm">
                        ₹{Math.round(stakeAmount * betslipSelections.reduce((acc, s) => acc * s.odds, 1))}
                      </span>
                    </div>
                  </div>

                  {/* Place Bet Button */}
                  <button
                    onClick={handlePlaceBet}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>
                      {language === 'hinglish' ? `बेट लगाएं (₹${stakeAmount})` : `Place In-Play Bet (₹${stakeAmount})`}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Open Bets List with Cashout */}
          <div className="bg-[#090f1d] border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{language === 'hinglish' ? 'खुली हुई बेट्स (Open Bets)' : 'Active In-Play Bets'}</span>
              <span className="font-mono text-amber-400">{activeBets.filter((b) => b.status === 'OPEN').length}</span>
            </h4>

            {activeBets.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No active bets.</p>
            ) : (
              <div className="space-y-3">
                {activeBets.map((b) => (
                  <div key={b.id} className="p-3 bg-[#060a14] border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-200">{b.selection}</div>
                        <div className="text-[10px] text-slate-400">{b.match}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          b.status === 'OPEN'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>Stake: ₹{b.stake} @ {b.odds}</span>
                      <span className="text-amber-400 font-bold">Return: ₹{b.potentialReturn}</span>
                    </div>

                    {b.status === 'OPEN' && (
                      <button
                        onClick={() => handleCashout(b.id)}
                        className="w-full py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>
                          {language === 'hinglish'
                            ? `तुरंत कैशआउट करें: ₹${b.cashoutValue}`
                            : `Instant Cash Out: ₹${b.cashoutValue}`}
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
