import React, { useState, useEffect, useRef } from 'react';
import { Dices, Trophy, Swords, Sparkles, TrendingUp, DollarSign, RotateCcw, ShieldCheck, Flame, Zap, ArrowRight, UserCheck, HelpCircle, AlertCircle } from 'lucide-react';
import { PlayerStats } from '../types';
import { playDiceRoll, playCashChime, playLossBuzzer } from '../utils/audio';

interface DiceGameProps {
  language: 'hinglish' | 'english';
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
}

const faceRotationMap: Record<number, string> = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateX(0deg) rotateY(180deg)',
  3: 'rotateX(0deg) rotateY(-90deg)',
  4: 'rotateX(0deg) rotateY(90deg)',
  5: 'rotateX(-90deg) rotateY(0deg)',
  6: 'rotateX(90deg) rotateY(0deg)',
};

const dotsMap: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

// 3D Dice Component
const DiceCube: React.FC<{ value: number; isRolling: boolean; color?: string; size?: number }> = ({
  value,
  isRolling,
  color = '#f59e0b',
  size = 90,
}) => {
  return (
    <div
      className="dice-container flex items-center justify-center select-none"
      style={{ width: `${size}px`, height: `${size}px`, perspective: '900px' }}
    >
      <div
        className={`dice-cube ${isRolling ? 'dice-rolling' : ''}`}
        style={{
          width: '100%',
          height: '100%',
          transform: !isRolling ? faceRotationMap[value] || faceRotationMap[1] : undefined,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((face) => (
          <div
            key={face}
            className={`dice-face face-${face}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderColor: color,
              boxShadow: `inset 0 0 15px rgba(0,0,0,0.8), 0 0 12px ${color}33`,
            }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`dot transition-opacity duration-200 ${
                  dotsMap[face].includes(i) ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundColor: color,
                  boxShadow: dotsMap[face].includes(i) ? `0 0 8px ${color}` : 'none',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const DiceGame: React.FC<DiceGameProps> = ({
  language,
  playerStats,
  setPlayerStats,
}) => {
  // Mode selection
  const [activeTab, setActiveTab] = useState<'BETTING' | 'SPS' | 'FORTUNE' | 'TOURNAMENT'>('BETTING');

  // --- 1. Casino Betting Mode State ---
  const [dice1, setDice1] = useState<number>(3);
  const [dice2, setDice2] = useState<number>(4);
  const [isRolling, setIsRolling] = useState(false);
  const [betStake, setBetStake] = useState<number>(100);
  const [betType, setBetType] = useState<'LOW' | 'HIGH' | 'EXACT_7' | 'EVEN' | 'ODD' | 'EXACT_NUM'>('HIGH');
  const [exactNumChosen, setExactNumChosen] = useState<number>(6);
  const [lastRoundResult, setLastRoundResult] = useState<{
    won: boolean;
    sum: number;
    d1: number;
    d2: number;
    payout: number;
    message: string;
  } | null>(null);

  const [rollHistory, setRollHistory] = useState<{ d1: number; d2: number; sum: number; win: boolean }[]>([
    { d1: 4, d2: 5, sum: 9, win: true },
    { d1: 2, d2: 3, sum: 5, win: false },
    { d1: 6, d2: 1, sum: 7, win: true },
    { d1: 3, d2: 4, sum: 7, win: true },
    { d1: 5, d2: 6, sum: 11, win: true },
  ]);

  // Odds calculation
  const getOdds = () => {
    switch (betType) {
      case 'LOW': return 2.1; // Sum 2-6
      case 'HIGH': return 2.1; // Sum 8-12
      case 'EXACT_7': return 5.8; // Lucky 7
      case 'EVEN': return 1.95;
      case 'ODD': return 1.95;
      case 'EXACT_NUM': return 5.5; // Single die exact match
      default: return 2.0;
    }
  };

  const handleRollBet = () => {
    if (isRolling) return;
    if (playerStats.walletBalance < betStake) {
      alert(language === 'hinglish' ? 'वॉलेट में बैलेंस कम है! कृपया बैलेंस रीचार्ज करें।' : 'Insufficient balance! Please add funds.');
      return;
    }

    // Deduct stake
    setPlayerStats(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - betStake,
    }));

    setIsRolling(true);
    setLastRoundResult(null);
    playDiceRoll();

    setTimeout(() => {
      const finalD1 = Math.floor(Math.random() * 6) + 1;
      const finalD2 = Math.floor(Math.random() * 6) + 1;
      const sum = finalD1 + finalD2;

      setDice1(finalD1);
      setDice2(finalD2);
      setIsRolling(false);

      // Evaluate win
      let won = false;
      const odds = getOdds();

      if (betType === 'LOW' && sum < 7) won = true;
      else if (betType === 'HIGH' && sum > 7) won = true;
      else if (betType === 'EXACT_7' && sum === 7) won = true;
      else if (betType === 'EVEN' && sum % 2 === 0) won = true;
      else if (betType === 'ODD' && sum % 2 !== 0) won = true;
      else if (betType === 'EXACT_NUM' && (finalD1 === exactNumChosen || finalD2 === exactNumChosen)) won = true;

      const payout = won ? Math.round(betStake * odds) : 0;

      if (won) {
        playCashChime();
        setPlayerStats(prev => ({
          ...prev,
          walletBalance: prev.walletBalance + payout,
          winRate: Math.min(100, prev.winRate + 1),
        }));
      } else {
        playLossBuzzer();
      }

      setLastRoundResult({
        won,
        sum,
        d1: finalD1,
        d2: finalD2,
        payout,
        message: won
          ? (language === 'hinglish' ? `जीत गए! ₹${payout} का पेआउट मिला!` : `WINNER! Payout ₹${payout}!`)
          : (language === 'hinglish' ? `यह राउंड हार गए। अगली बार लक आजमाएं!` : `Round lost. Better luck next roll!`),
      });

      setRollHistory(prev => [{ d1: finalD1, d2: finalD2, sum, win: won }, ...prev.slice(0, 7)]);
    }, 1200);
  };

  // --- 2. Stone Paper Scissors (Battle Mode) ---
  const [spsP1Score, setSpsP1Score] = useState(0);
  const [spsP2Score, setSpsP2Score] = useState(0);
  const [spsRound, setSpsRound] = useState(1);
  const [spsStatus, setSpsStatus] = useState<'IDLE' | 'COUNTDOWN' | 'REVEAL'>('IDLE');
  const [spsCountdown, setSpsCountdown] = useState(3);
  const [spsChoices, setSpsChoices] = useState<['Stone' | 'Paper' | 'Scissors', 'Stone' | 'Paper' | 'Scissors'] | null>(null);
  const [spsRoundWinner, setSpsRoundWinner] = useState<'P1' | 'P2' | 'DRAW' | null>(null);

  const startSpsBattle = () => {
    setSpsStatus('COUNTDOWN');
    setSpsCountdown(3);
    playDiceRoll();

    let c = 3;
    const interval = setInterval(() => {
      c--;
      if (c > 0) {
        setSpsCountdown(c);
      } else {
        clearInterval(interval);
        // Reveal choices
        const choices: ('Stone' | 'Paper' | 'Scissors')[] = ['Stone', 'Paper', 'Scissors'];
        const p1Choice = choices[Math.floor(Math.random() * 3)];
        const p2Choice = choices[Math.floor(Math.random() * 3)];
        setSpsChoices([p1Choice, p2Choice]);

        let winner: 'P1' | 'P2' | 'DRAW' = 'DRAW';
        if (p1Choice === p2Choice) {
          winner = 'DRAW';
        } else if (
          (p1Choice === 'Stone' && p2Choice === 'Scissors') ||
          (p1Choice === 'Paper' && p2Choice === 'Stone') ||
          (p1Choice === 'Scissors' && p2Choice === 'Paper')
        ) {
          winner = 'P1';
          setSpsP1Score(s => s + 1);
          playCashChime();
        } else {
          winner = 'P2';
          setSpsP2Score(s => s + 1);
          playLossBuzzer();
        }
        setSpsRoundWinner(winner);
        setSpsStatus('REVEAL');
      }
    }, 600);
  };

  // --- 3. Fortune & Decider Mode ---
  const [fortuneDie, setFortuneDie] = useState(6);
  const [fortuneRolling, setFortuneRolling] = useState(false);
  const [fortuneCategory, setFortuneCategory] = useState<'LUCK' | 'DECIDER' | 'YOGA'>('LUCK');

  const rollFortune = () => {
    if (fortuneRolling) return;
    setFortuneRolling(true);
    playDiceRoll();
    setTimeout(() => {
      const val = Math.floor(Math.random() * 6) + 1;
      setFortuneDie(val);
      setFortuneRolling(false);
      playCashChime();
    }, 1000);
  };

  const getFortuneText = (v: number) => {
    if (fortuneCategory === 'LUCK') {
      if (v === 6) return { title: 'SUPER JACKPOT! 🌟', desc: 'आज किस्मत पूरे 100% आपके साथ है! बड़े दांव का समय है।' };
      if (v >= 4) return { title: 'HIGH LUCK! ✨', desc: 'सकारात्मक ऊर्जा है! आज अच्छी जीत के आसार हैं।' };
      if (v >= 2) return { title: 'NEUTRAL VIBES ⚖️', desc: 'संतुलित खेलें, छोटे दांव लगाकर आगे बढ़ें।' };
      return { title: 'LOW RISK TIME 🍀', desc: 'सावधानी बरतें, धैर्य से खेलें।' };
    } else if (fortuneCategory === 'DECIDER') {
      return v % 2 === 0
        ? { title: 'HELL YES! ✅', desc: 'पासे ने हरी झंडी दे दी है! आगे बढ़ो।' }
        : { title: 'PROBABLY NOT ❌', desc: 'पासा मना कर रहा है, थोड़ा इंतजार करो।' };
    } else {
      const poses = [
        'पर्वतासन (Mountain Pose 🏔️)',
        'वृक्षासन (Tree Pose 🌳)',
        'वीरभद्रासन (Warrior Pose ⚔️)',
        'सेतुबंधासन (Bridge Pose 🌉)',
        'बालासन (Child Pose 👶)',
        'कुंभकासन (Plank 🪵)',
      ];
      return { title: poses[v - 1], desc: '5 मिनट के लिए इस मुद्रा का अभ्यास करें और रिफ्रेश हों।' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Header & Mode Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Dices className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>{language === 'hinglish' ? 'रॉयल डाइस अरीना' : 'Royal Dice Arena'}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                PROVABLY FAIR 98.2% RTP
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'hinglish'
                ? '3D डाइस रोल, ओवर-अंडर 7 कैसीनो बेटिंग, स्टोन-पेपर-सिज़र्स बैटल'
                : '3D Physics Dice, Over/Under 7 Casino Odds, Rock-Paper-Scissors Battle'}
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('BETTING')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'BETTING'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>{language === 'hinglish' ? 'कैसीनो 7 बेटिंग' : 'Casino 7 Bet'}</span>
          </button>

          <button
            onClick={() => setActiveTab('SPS')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'SPS'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>{language === 'hinglish' ? 'डाइस बैटल (SPS)' : 'Dice Battle'}</span>
          </button>

          <button
            onClick={() => setActiveTab('FORTUNE')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'FORTUNE'
                ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'hinglish' ? 'लक-ओ-मीटर व फॉर्च्यून' : 'Luck-O-Meter'}</span>
          </button>
        </div>
      </div>

      {/* ================= MODE 1: CASINO 7 BETTING ================= */}
      {activeTab === 'BETTING' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 3D Dice Stage */}
          <div className="lg:col-span-2 bg-[#090e1c] border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            {/* Top Stat Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-slate-300">
                  {language === 'hinglish' ? 'लाइव टेबल #77 · दो डाइस' : 'Live Table #77 · Double Dice'}
                </span>
              </div>

              {/* Multiplier / Odds Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{language === 'hinglish' ? 'करंट ऑड्स:' : 'Current Odds:'}</span>
                <span className="text-sm font-black font-mono px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg">
                  {getOdds()}x
                </span>
              </div>
            </div>

            {/* 3D Dice Arena Stage */}
            <div className="py-12 sm:py-16 flex flex-col items-center justify-center relative">
              {/* Background Glow */}
              <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

              {/* Two 3D Dice */}
              <div className="flex items-center justify-center gap-8 sm:gap-12 relative z-10">
                <DiceCube value={dice1} isRolling={isRolling} color="#f59e0b" size={105} />
                <DiceCube value={dice2} isRolling={isRolling} color="#38bdf8" size={105} />
              </div>

              {/* Total Sum Display */}
              <div className="mt-8 flex flex-col items-center">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  {isRolling ? (language === 'hinglish' ? 'डाइस रोल हो रहे हैं...' : 'Rolling...') : (language === 'hinglish' ? 'कुल योग (Total Sum)' : 'Total Sum')}
                </div>
                <div className="text-4xl sm:text-5xl font-black font-mono text-slate-100 tracking-tight mt-1">
                  {isRolling ? '--' : dice1 + dice2}
                </div>
                {!isRolling && (
                  <div className="text-xs text-slate-500 mt-1">
                    ({dice1} + {dice2})
                  </div>
                )}
              </div>

              {/* Result Banner */}
              {lastRoundResult && !isRolling && (
                <div
                  className={`mt-4 px-6 py-2.5 rounded-2xl border font-bold text-sm sm:text-base flex items-center gap-2 animate-in zoom-in duration-300 ${
                    lastRoundResult.won
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/20'
                      : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{lastRoundResult.message}</span>
                </div>
              )}
            </div>

            {/* History Ticker */}
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-slate-500 font-semibold uppercase">{language === 'hinglish' ? 'हालिया रोल:' : 'Recent Rolls:'}</span>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {rollHistory.map((h, i) => (
                  <div
                    key={i}
                    className={`px-2.5 py-1 rounded-lg font-mono font-bold border text-xs flex items-center gap-1 ${
                      h.sum === 7
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : h.sum > 7
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                    }`}
                  >
                    <span>{h.sum}</span>
                    <span className="text-[10px] text-slate-500">({h.d1}+{h.d2})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Betting Controls & Markets */}
          <div className="space-y-4">
            <div className="bg-[#090e1c] border border-slate-800 rounded-3xl p-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{language === 'hinglish' ? 'मार्केट और दांव चुनें' : 'Choose Market & Stake'}</span>
              </h3>

              {/* Market Choices Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setBetType('LOW')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    betType === 'LOW'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] text-slate-400">{language === 'hinglish' ? 'अंडर 7 (2 से 6)' : 'Under 7 (2-6)'}</div>
                  <div className="text-sm font-bold mt-0.5">LOW</div>
                  <div className="text-xs font-mono font-bold text-amber-400 mt-1">2.10x Odds</div>
                </button>

                <button
                  onClick={() => setBetType('HIGH')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    betType === 'HIGH'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-600/20'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] text-slate-400">{language === 'hinglish' ? 'ओवर 7 (8 से 12)' : 'Over 7 (8-12)'}</div>
                  <div className="text-sm font-bold mt-0.5">HIGH</div>
                  <div className="text-xs font-mono font-bold text-amber-400 mt-1">2.10x Odds</div>
                </button>

                <button
                  onClick={() => setBetType('EXACT_7')}
                  className={`col-span-2 p-3.5 rounded-2xl border text-left transition-all ${
                    betType === 'EXACT_7'
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-amber-400/80 font-bold uppercase tracking-wider">
                        {language === 'hinglish' ? 'लकी 7 जैकपॉट' : 'Lucky 7 Jackpot'}
                      </div>
                      <div className="text-base font-extrabold text-amber-300">EXACT 7 SUM</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black font-mono text-amber-400">5.80x</div>
                      <div className="text-[10px] text-slate-400">HUGE WIN</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setBetType('EVEN')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    betType === 'EVEN'
                      ? 'bg-sky-600/20 border-sky-500 text-sky-300'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] text-slate-400">{language === 'hinglish' ? 'सम संख्या' : 'Even Sum'}</div>
                  <div className="text-sm font-bold mt-0.5">EVEN (2,4,6...)</div>
                  <div className="text-xs font-mono font-bold text-amber-400 mt-1">1.95x Odds</div>
                </button>

                <button
                  onClick={() => setBetType('ODD')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    betType === 'ODD'
                      ? 'bg-pink-600/20 border-pink-500 text-pink-300'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] text-slate-400">{language === 'hinglish' ? 'विषम संख्या' : 'Odd Sum'}</div>
                  <div className="text-sm font-bold mt-0.5">ODD (3,5,7...)</div>
                  <div className="text-xs font-mono font-bold text-amber-400 mt-1">1.95x Odds</div>
                </button>
              </div>

              {/* Bet on Specific Die Face */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{language === 'hinglish' ? 'किसी एक डाइस पर नंबर (5.5x):' : 'Single Die Exact (5.5x):'}</span>
                  <button
                    onClick={() => setBetType('EXACT_NUM')}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      betType === 'EXACT_NUM' ? 'bg-amber-400 text-slate-950' : 'text-amber-400 hover:underline'
                    }`}
                  >
                    {language === 'hinglish' ? 'सलेक्ट करें' : 'Select'}
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setExactNumChosen(num);
                        setBetType('EXACT_NUM');
                      }}
                      className={`py-2 rounded-xl text-xs font-black font-mono border transition-all ${
                        betType === 'EXACT_NUM' && exactNumChosen === num
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stake Amount Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{language === 'hinglish' ? 'दांव राशि (Stake Amount):' : 'Stake Amount:'}</span>
                  <span className="font-mono text-emerald-400 font-bold">₹{betStake}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 250, 500].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setBetStake(amt)}
                      className={`py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                        betStake === amt
                          ? 'bg-slate-800 text-amber-300 border-amber-400/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payout Forecast */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">{language === 'hinglish' ? 'संभावित पेआउट:' : 'Potential Payout:'}</span>
                <span className="text-base font-extrabold font-mono text-emerald-400">
                  ₹{Math.round(betStake * getOdds())}
                </span>
              </div>

              {/* Roll Bet Button */}
              <button
                onClick={handleRollBet}
                disabled={isRolling}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl active:scale-98 ${
                  isRolling
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/25 cursor-pointer'
                }`}
              >
                <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
                <span>
                  {isRolling
                    ? (language === 'hinglish' ? 'रोलिंग हो रही है...' : 'ROLLING...')
                    : (language === 'hinglish' ? `₹${betStake} का दांव लगाएं और रोल करें` : `ROLL DICE (BET ₹${betStake})`)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODE 2: STONE PAPER SCISSORS (SPS BATTLE) ================= */}
      {activeTab === 'SPS' && (
        <div className="bg-[#090e1c] border border-teal-900/40 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-6">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">
                {language === 'hinglish' ? 'डाइस हथियार बैटल' : 'Dice Weapon Battle'}
              </span>
              <h3 className="text-2xl font-black text-slate-100">Stone · Paper · Scissors</h3>
              <p className="text-xs text-slate-400">
                {language === 'hinglish'
                  ? 'पासा आपके लिए हथियार चुनेगा! 3 राउंड पहले जीतने वाला मैच जीतेगा।'
                  : 'The dice picks your weapon! First to 3 rounds wins the match.'}
              </p>
            </div>

            {/* Scorecard */}
            <div className="flex items-center gap-4 bg-teal-950/80 px-6 py-3 rounded-2xl border border-teal-500/30 font-mono">
              <div className="text-center">
                <div className="text-[10px] text-teal-400 uppercase font-sans font-bold">YOU</div>
                <div className="text-2xl font-black text-teal-200">{spsP1Score}</div>
              </div>
              <div className="text-lg font-black text-slate-600">:</div>
              <div className="text-center">
                <div className="text-[10px] text-rose-400 uppercase font-sans font-bold">BOT</div>
                <div className="text-2xl font-black text-rose-200">{spsP2Score}</div>
              </div>
            </div>
          </div>

          {/* Active Battle Arena */}
          <div className="min-h-[260px] flex flex-col items-center justify-center text-center space-y-6">
            {spsStatus === 'IDLE' && (
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center mx-auto text-teal-300">
                  <Swords className="w-10 h-10 animate-bounce" />
                </div>
                <h4 className="text-xl font-bold text-slate-100">
                  {language === 'hinglish' ? 'क्या आप मुकाबले के लिए तैयार हैं?' : 'Ready to Clash?'}
                </h4>
                <button
                  onClick={startSpsBattle}
                  className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-teal-500/30 text-sm tracking-wide cursor-pointer transition-transform active:scale-95"
                >
                  {language === 'hinglish' ? 'बैटल रोल शुरू करें!' : 'START BATTLE ROLL!'}
                </button>
              </div>
            )}

            {spsStatus === 'COUNTDOWN' && (
              <div className="space-y-3">
                <div className="text-7xl sm:text-8xl font-black font-mono text-teal-400 animate-pulse">
                  {spsCountdown}
                </div>
                <p className="text-xs uppercase font-mono tracking-widest text-teal-300/80">
                  {language === 'hinglish' ? 'डाइस हथियार चुन रहा है...' : 'Assigning Weapon Fates...'}
                </p>
              </div>
            )}

            {spsStatus === 'REVEAL' && spsChoices && (
              <div className="space-y-6 w-full max-w-md">
                <div className="flex items-center justify-between gap-4">
                  {/* Player Choice */}
                  <div className="flex-1 bg-teal-950/60 border border-teal-500/40 p-4 rounded-2xl text-center">
                    <span className="text-[11px] font-bold text-teal-400 block mb-1">YOU</span>
                    <div className="text-3xl font-black text-slate-100">{spsChoices[0]}</div>
                  </div>

                  <div className="text-xl font-black text-slate-500">VS</div>

                  {/* Bot Choice */}
                  <div className="flex-1 bg-rose-950/60 border border-rose-500/40 p-4 rounded-2xl text-center">
                    <span className="text-[11px] font-bold text-rose-400 block mb-1">BOT</span>
                    <div className="text-3xl font-black text-slate-100">{spsChoices[1]}</div>
                  </div>
                </div>

                <div className="text-lg font-black text-slate-100 py-2">
                  {spsRoundWinner === 'DRAW'
                    ? (language === 'hinglish' ? '🤝 ड्रॉ हो गया!' : '🤝 IT IS A DRAW!')
                    : spsRoundWinner === 'P1'
                    ? (language === 'hinglish' ? '⚡ आप जीत गए!' : '⚡ YOU WON THIS ROUND!')
                    : (language === 'hinglish' ? '❌ विरोधी जीत गया!' : '❌ OPPONENT WON!')}
                </div>

                <button
                  onClick={startSpsBattle}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                >
                  {language === 'hinglish' ? 'अगला राउंड खेलें' : 'Next Round'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODE 3: LUCK-O-METER & FORTUNE ================= */}
      {activeTab === 'FORTUNE' && (
        <div className="bg-[#090e1c] border border-purple-900/40 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-900/40 pb-6">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                {language === 'hinglish' ? 'भाग्य और निर्णय पासा' : 'Fortune & Smart Decider'}
              </span>
              <h3 className="text-2xl font-black text-slate-100">
                {language === 'hinglish' ? 'लकी रोल व प्रेडिक्शन' : 'Luck-O-Meter & Wisdom'}
              </h3>
            </div>

            {/* Category Toggle */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setFortuneCategory('LUCK')}
                className={`px-3 py-1.5 rounded-lg ${fortuneCategory === 'LUCK' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Luck-O-Meter
              </button>
              <button
                onClick={() => setFortuneCategory('DECIDER')}
                className={`px-3 py-1.5 rounded-lg ${fortuneCategory === 'DECIDER' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Decider (Yes/No)
              </button>
              <button
                onClick={() => setFortuneCategory('YOGA')}
                className={`px-3 py-1.5 rounded-lg ${fortuneCategory === 'YOGA' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Yoga Routine
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <DiceCube value={fortuneDie} isRolling={fortuneRolling} color="#a855f7" size={110} />

            {/* Fortune Message */}
            <div className="text-center max-w-md bg-purple-950/30 border border-purple-500/30 p-5 rounded-2xl">
              <h4 className="text-xl font-black text-purple-300">
                {getFortuneText(fortuneDie).title}
              </h4>
              <p className="text-xs text-slate-300 mt-1.5">
                {getFortuneText(fortuneDie).desc}
              </p>
            </div>

            <button
              onClick={rollFortune}
              disabled={fortuneRolling}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/30 text-xs uppercase tracking-wider cursor-pointer"
            >
              {fortuneRolling ? 'रोलिंग...' : (language === 'hinglish' ? 'अपना भाग्य रोल करें' : 'ROLL YOUR FORTUNE')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
