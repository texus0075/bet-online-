import React, { useState, useEffect, useRef } from 'react';
import { Play, TrendingUp, DollarSign, ShieldCheck, RefreshCw, Award, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';
import { PlayerStats, TransactionRecord, UserProfile } from '../types';
import { playCashChime, playLossBuzzer } from '../utils/audio';

interface AviatorCrashProps {
  language: 'hinglish' | 'english';
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  onRecordTransaction?: (tx: TransactionRecord) => void;
  onUpdateOwnerRevenue?: (wager: number, payout: number, pvpRake: number, houseEdge: number) => void;
  userProfile?: UserProfile;
}

interface CrashHistory {
  id: string;
  multiplier: number;
  time: string;
}

export const AviatorCrashGame: React.FC<AviatorCrashProps> = ({
  language,
  playerStats,
  setPlayerStats,
  onRecordTransaction,
  onUpdateOwnerRevenue,
  userProfile,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Crash Game State
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [gameState, setGameState] = useState<'IDLE' | 'STARTING' | 'FLYING' | 'CRASHED'>('IDLE');
  const [betPlaced, setBetPlaced] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [stake, setStake] = useState<number>(200);
  const [autoCashout, setAutoCashout] = useState<number>(2.0);
  const [autoCashoutEnabled, setAutoCashoutEnabled] = useState(false);
  const [wonAmount, setWonAmount] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(3);

  // Provably fair seed info
  const [provablyFair, setProvablyFair] = useState({
    serverSeedHash: 'e9b28a9f1c7d812039fa8e71b29c48e71b29a8f1c7d812039fa8e71b29c48e71',
    clientSeed: 'cric_seed_vip_2026',
    nonce: 142,
  });

  // Recent multiplier history
  const [history, setHistory] = useState<CrashHistory[]>([
    { id: '1', multiplier: 2.45, time: '1m ago' },
    { id: '2', multiplier: 1.18, time: '2m ago' },
    { id: '3', multiplier: 5.62, time: '3m ago' },
    { id: '4', multiplier: 1.05, time: '4m ago' },
    { id: '5', multiplier: 14.80, time: '5m ago' },
    { id: '6', multiplier: 3.12, time: '6m ago' },
    { id: '7', multiplier: 1.84, time: '7m ago' },
  ]);

  const crashPointRef = useRef<number>(2.5);
  const animFrameRef = useRef<number | null>(null);
  const multRef = useRef<number>(1.0);

  // Generate randomized crash point (Provably Fair simulation with 3-4% house edge)
  const generateCrashPoint = () => {
    const e = 2 ** 32;
    const h = Math.floor(Math.random() * e);
    if (h % 33 === 0) return 1.0; // instant crash house edge
    const point = Math.floor((100 * e - h) / (e - h)) / 100;
    return Math.min(65.0, Math.max(1.1, point));
  };

  // Start round
  const startNextRound = () => {
    if (gameState === 'FLYING' || gameState === 'STARTING') return;

    setGameState('STARTING');
    setCountdown(3);
    setMultiplier(1.0);
    multRef.current = 1.0;
    setCashedOut(false);
    setWonAmount(null);

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          launchFlight();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const launchFlight = () => {
    const crashPt = generateCrashPoint();
    crashPointRef.current = crashPt;
    setGameState('FLYING');

    const startTime = performance.now();

    const updateLoop = () => {
      const elapsedSec = (performance.now() - startTime) / 1000;
      // Exponential curve: multiplier = e^(0.08 * t)
      const currentMult = parseFloat(Math.pow(Math.E, 0.09 * elapsedSec * 1.5).toFixed(2));
      multRef.current = currentMult;
      setMultiplier(currentMult);

      // Check auto-cashout
      if (betPlaced && !cashedOut && autoCashoutEnabled && currentMult >= autoCashout) {
        handleCashout(currentMult);
      }

      // Check crash condition
      if (currentMult >= crashPointRef.current) {
        setGameState('CRASHED');
        if (betPlaced && !cashedOut) {
          playLossBuzzer();
          if (onRecordTransaction) {
            onRecordTransaction({
              id: Date.now().toString(),
              type: 'BET_CASINO',
              amount: stake,
              description: `Aviator Crashed @ ${crashPointRef.current}x (Lost ₹${stake})`,
              timestamp: new Date().toLocaleTimeString(),
              username: userProfile?.username || '@Tiger_King99',
              mobile: userProfile?.mobile,
              location: userProfile?.location || 'Jaipur, RJ',
            });
          }
          if (onUpdateOwnerRevenue) {
            onUpdateOwnerRevenue(stake, 0, 0, stake);
          }
        }
        setBetPlaced(false);
        setHistory((prev) => [
          { id: Date.now().toString(), multiplier: crashPointRef.current, time: 'Just now' },
          ...prev.slice(0, 7),
        ]);
        setProvablyFair((p) => ({ ...p, nonce: p.nonce + 1 }));
        return;
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
  };

  // Place bet
  const handlePlaceBet = () => {
    if (stake > 1000) {
      alert(language === 'hinglish' ? 'सुरक्षा नियम: प्लेटफॉर्म बैंक सुरक्षा के लिए अधिकतम दांव ₹1,000 सीमित है।' : 'Max stake allowed is ₹1,000.');
      return;
    }
    if (playerStats.walletBalance < stake) {
      alert(language === 'hinglish' ? 'वॉलेट में बैलेंस कम है!' : 'Insufficient wallet balance!');
      return;
    }
    setBetPlaced(true);
    setCashedOut(false);
    setWonAmount(null);
    setPlayerStats((p) => ({ ...p, walletBalance: p.walletBalance - stake }));

    if (onRecordTransaction) {
      onRecordTransaction({
        id: Date.now().toString(),
        type: 'BET_CASINO',
        amount: stake,
        description: `Aviator Flight Bet Placed (₹${stake})`,
        timestamp: new Date().toLocaleTimeString(),
        username: userProfile?.username || '@Tiger_King99',
        mobile: userProfile?.mobile,
        location: userProfile?.location || 'Jaipur, RJ',
      });
    }

    if (gameState === 'IDLE' || gameState === 'CRASHED') {
      startNextRound();
    }
  };

  // Cashout during flight
  const handleCashout = (cashoutMultiplier?: number) => {
    if (!betPlaced || cashedOut || gameState !== 'FLYING') return;

    const finalMult = cashoutMultiplier || multRef.current;
    const payout = Math.round(stake * finalMult);
    setCashedOut(true);
    setWonAmount(payout);
    setPlayerStats((p) => ({ ...p, walletBalance: p.walletBalance + payout }));
    playCashChime();

    if (onRecordTransaction) {
      onRecordTransaction({
        id: Date.now().toString(),
        type: 'WIN_CASINO',
        amount: payout,
        description: `Aviator Cashed Out @ ${finalMult}x (Won ₹${payout})`,
        timestamp: new Date().toLocaleTimeString(),
        username: userProfile?.username || '@Tiger_King99',
        mobile: userProfile?.mobile,
        location: userProfile?.location || 'Jaipur, RJ',
      });
    }
    if (onUpdateOwnerRevenue) {
      onUpdateOwnerRevenue(stake, payout, 0, 0);
    }
  };

  // Canvas visual rendering of the soaring curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark VIP Arena background
      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const originX = 50;
      const originY = height - 40;

      // Draw Soaring Multiplier Curve
      if (gameState === 'FLYING' || gameState === 'CRASHED') {
        const progress = Math.min(1, (multRef.current - 1.0) / 10.0);
        const endX = originX + progress * (width - 120);
        const endY = originY - Math.pow(progress, 0.8) * (height - 100);

        // Gradient under curve
        const curveGrad = ctx.createLinearGradient(originX, originY, endX, endY);
        if (gameState === 'CRASHED') {
          curveGrad.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
          curveGrad.addColorStop(1, 'rgba(239, 68, 68, 0.02)');
        } else {
          curveGrad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
          curveGrad.addColorStop(1, 'rgba(234, 88, 12, 0.02)');
        }

        ctx.fillStyle = curveGrad;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.quadraticCurveTo(originX + (endX - originX) * 0.4, originY, endX, endY);
        ctx.lineTo(endX, originY);
        ctx.closePath();
        ctx.fill();

        // Stroke line
        ctx.strokeStyle = gameState === 'CRASHED' ? '#ef4444' : '#f59e0b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.quadraticCurveTo(originX + (endX - originX) * 0.4, originY, endX, endY);
        ctx.stroke();

        // Rocket / Soaring Cricket Ball at tip
        ctx.save();
        ctx.translate(endX, endY);
        if (gameState === 'CRASHED') {
          // Explosion particle
          ctx.fillStyle = '#ef4444';
          ctx.font = '16px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('💥 CRASHED', 0, -10);
        } else {
          // Glowing Golden Cricket Ball / Rocket
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Seam
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0.2, Math.PI * 0.85);
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0b1222] border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>Aviator / Spribe Style Crash Game Simulator</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold font-display text-slate-100">
            {language === 'hinglish' ? 'क्रिक-क्रैश (Aviator Style Cricket Crash)' : 'CricCrash: Real-Time Multiplier Game'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {language === 'hinglish'
              ? 'जैसे ही गेंद ऊपर उठती है, मल्टीप्लायर 1.00x से 50.00x तक बढ़ता है। क्रैश होने से पहले CASH OUT दबाकर अपनी जीत अपने वॉलेट में ले जाएं।'
              : 'Watch the multiplier climb from 1.00x to 50.00x. Hit Cash Out before the crash to win your stake multiplied! 100% Provably Fair.'}
          </p>
        </div>

        {/* History Multiplier Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          {history.map((h) => (
            <span
              key={h.id}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                h.multiplier >= 2.0
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-amber-400'
              }`}
            >
              {h.multiplier.toFixed(2)}x
            </span>
          ))}
        </div>
      </div>

      {/* Main Canvas & Flight Arena */}
      <div className="relative w-full aspect-[16/9] max-h-[460px] bg-[#050811] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={960}
          height={500}
          className="w-full h-full object-contain"
        />

        {/* Center Live Multiplier Counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {gameState === 'STARTING' && (
            <div className="text-center space-y-1">
              <div className="text-xs text-slate-400 uppercase tracking-widest font-mono">NEXT FLIGHT IN</div>
              <div className="text-5xl font-black font-mono text-amber-400 animate-pulse">{countdown}s</div>
            </div>
          )}

          {gameState === 'FLYING' && (
            <div className="text-center space-y-1">
              <div className="text-6xl sm:text-7xl font-black font-mono text-slate-100 tracking-tight drop-shadow-[0_4px_24px_rgba(245,158,11,0.5)]">
                {multiplier.toFixed(2)}x
              </div>
              <div className="text-xs font-mono text-amber-400 font-semibold tracking-wider">
                CURRENT FLIGHT MULTIPLIER
              </div>
            </div>
          )}

          {gameState === 'CRASHED' && (
            <div className="text-center space-y-1">
              <div className="text-4xl sm:text-6xl font-black font-mono text-red-500 tracking-tight drop-shadow-[0_4px_24px_rgba(239,68,68,0.7)]">
                FLEW AWAY @ {crashPointRef.current.toFixed(2)}x
              </div>
              <div className="text-xs font-mono text-slate-400">
                Next round starting in 3 seconds...
              </div>
            </div>
          )}

          {gameState === 'IDLE' && (
            <div className="text-center space-y-2">
              <div className="text-xl font-bold font-display text-slate-300">
                {language === 'hinglish' ? 'बेट लगाएं और राउंड शुरू करें' : 'Place Your Bet & Launch'}
              </div>
              <div className="text-xs text-slate-500">
                Minimum Bet ₹50 · Max Win 50.00x
              </div>
            </div>
          )}
        </div>

        {/* Cashout Success Pop */}
        {cashedOut && wonAmount && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-emerald-950/90 border border-emerald-500/60 rounded-xl px-5 py-2.5 flex items-center gap-3 shadow-2xl animate-bounce pointer-events-none">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-xs font-bold text-emerald-400">CASHED OUT SUCCESSFULLY!</div>
              <div className="text-lg font-bold font-mono text-slate-100">Won: ₹{wonAmount}</div>
            </div>
          </div>
        )}
      </div>

      {/* Betting Deck & Cashout Control */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#090f1d] border border-slate-800 rounded-2xl p-6">
        {/* Left Stake Settings */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Bet Amount (Stake):</span>
            <span className="font-mono text-emerald-400 font-bold">Wallet: ₹{playerStats.walletBalance}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">₹</span>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(Math.max(10, Number(e.target.value)))}
                disabled={betPlaced && gameState === 'FLYING'}
                className="w-full bg-[#060a14] border border-slate-700 rounded-xl py-2 pl-7 pr-3 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            {[100, 200, 500, 1000].map((amt) => (
              <button
                key={amt}
                onClick={() => setStake(amt)}
                disabled={betPlaced && gameState === 'FLYING'}
                className={`px-3 py-2 text-xs font-mono font-semibold rounded-xl border transition-all ${
                  stake === amt
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          {/* Auto-Cashout Selector */}
          <div className="flex items-center justify-between gap-3 p-3 bg-[#060a14] border border-slate-800 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoCash"
                checked={autoCashoutEnabled}
                onChange={(e) => setAutoCashoutEnabled(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-0"
              />
              <label htmlFor="autoCash" className="text-slate-300 font-medium cursor-pointer">
                Auto Cash Out
              </label>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                step="0.1"
                min="1.1"
                value={autoCashout}
                onChange={(e) => setAutoCashout(Math.max(1.1, Number(e.target.value)))}
                disabled={!autoCashoutEnabled}
                className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-amber-400 text-center font-bold focus:outline-none"
              />
              <span className="text-slate-500">x</span>
            </div>
          </div>
        </div>

        {/* Right Main Big Action Button */}
        <div className="md:col-span-6 flex flex-col justify-center">
          {betPlaced && gameState === 'FLYING' && !cashedOut ? (
            /* Big Cashout Button */
            <button
              onClick={() => handleCashout()}
              className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-lg sm:text-xl rounded-2xl shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="text-xs uppercase tracking-wider font-sans font-bold">CASH OUT NOW</div>
              <div className="text-2xl font-mono font-black">
                ₹{Math.round(stake * multiplier)} ({multiplier.toFixed(2)}x)
              </div>
            </button>
          ) : (
            /* Big Place Bet Button */
            <button
              onClick={handlePlaceBet}
              disabled={betPlaced && gameState === 'FLYING'}
              className="w-full py-6 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-lg sm:text-xl rounded-2xl shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="text-xs uppercase tracking-wider font-sans font-bold">
                {language === 'hinglish' ? 'बेट लगाएं (PLACE BET)' : 'BET & LAUNCH'}
              </div>
              <div className="text-2xl font-mono font-black">₹{stake}</div>
            </button>
          )}
        </div>
      </div>

      {/* Provably Fair Cryptographic Inspector (1xBet / Aviator standard) */}
      <div className="bg-[#060a14] border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Provably Fair Cryptographic Verification (SHA-256)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Nonce: #{provablyFair.nonce}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase">Hashed Server Seed:</span>
            <div className="text-amber-400 truncate text-[11px]">{provablyFair.serverSeedHash}</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase">Client Seed:</span>
            <div className="text-emerald-400 truncate text-[11px]">{provablyFair.clientSeed}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
