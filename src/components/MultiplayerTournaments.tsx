import React, { useState } from 'react';
import { Trophy, Users, ShieldCheck, Zap, ArrowRight, Play, CheckCircle2, RefreshCw, Award } from 'lucide-react';
import { LeaderboardEntry, PlayerStats } from '../types';

interface MultiplayerTournamentsProps {
  language: 'hinglish' | 'english';
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  onLaunchMatch: () => void;
}

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, name: 'Virat_Thunder_18', rating: 2840, matches: 342, winRate: '74.2%', earnings: '₹142,500', trustBadge: 'Verified Clean' },
  { rank: 2, name: 'Sky_Scoop_Specialist', rating: 2790, matches: 310, winRate: '71.5%', earnings: '₹121,000', trustBadge: 'Verified Clean' },
  { rank: 3, name: 'Captain_Cool_07', rating: 2715, matches: 298, winRate: '69.8%', earnings: '₹98,400', trustBadge: 'Verified Clean' },
  { rank: 4, name: 'Boom_Boom_Strike', rating: 2650, matches: 265, winRate: '67.0%', earnings: '₹76,200', trustBadge: 'Verified Clean' },
  { rank: 5, name: 'Helicopter_Mahi', rating: 2590, matches: 240, winRate: '65.4%', earnings: '₹62,000', trustBadge: 'Verified Clean' },
  { rank: 6, name: 'PullShot_Master', rating: 2540, matches: 215, winRate: '64.1%', earnings: '₹51,800', trustBadge: 'Verified Clean' },
  { rank: 7, name: 'CoverDrive_King', rating: 2490, matches: 190, winRate: '62.8%', earnings: '₹43,500', trustBadge: 'Verified Clean' },
  { rank: 8, name: 'Yorker_Punisher', rating: 2420, matches: 178, winRate: '61.5%', earnings: '₹37,200', trustBadge: 'Verified Clean' },
];

export const MultiplayerTournaments: React.FC<MultiplayerTournamentsProps> = ({
  language,
  playerStats,
  setPlayerStats,
  onLaunchMatch,
}) => {
  const [activeTab, setActiveTab] = useState<'1V1_BATTLE' | 'BRACKETS' | 'LEADERBOARD'>('1V1_BATTLE');

  // Matchmaking simulation state
  const [isSearchingMatch, setIsSearchingMatch] = useState(false);
  const [matchedOpponent, setMatchedOpponent] = useState<{
    name: string;
    mmr: number;
    winRate: string;
    ping: string;
    room: string;
    escrowLocked: number;
  } | null>(null);

  const handleStartMatchmaking = async () => {
    setIsSearchingMatch(true);
    setMatchedOpponent(null);

    try {
      const res = await fetch('/api/matchmaking/find-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr_me_109',
          username: 'You (Striker)',
          playerMMR: playerStats.ratingMMR,
          stakeAmount: 50,
        }),
      });
      const data = await res.json();

      setTimeout(() => {
        setIsSearchingMatch(false);
        if (data.success) {
          setMatchedOpponent({
            name: data.opponent.name,
            mmr: data.opponent.mmr,
            winRate: data.opponent.winRate,
            ping: data.opponent.ping,
            room: data.roomId,
            escrowLocked: data.escrowLocked,
          });
          // Deduct stake from player wallet into escrow
          setPlayerStats((p) => ({ ...p, walletBalance: Math.max(0, p.walletBalance - 50) }));
        }
      }, 1500);
    } catch (e) {
      setIsSearchingMatch(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-[#0a0f1d] border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('1V1_BATTLE')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === '1V1_BATTLE'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {language === 'hinglish' ? '1v1 लाइव मुकाबला' : '1v1 Quick Battle'}
        </button>
        <button
          onClick={() => setActiveTab('BRACKETS')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'BRACKETS'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {language === 'hinglish' ? 'नॉकआउट टूर्नामेंट्स' : 'Tournament Brackets'}
        </button>
        <button
          onClick={() => setActiveTab('LEADERBOARD')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'LEADERBOARD'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {language === 'hinglish' ? 'ऑल-इंडिया लीडरबोर्ड' : 'Global Leaderboard'}
        </button>
      </div>

      {/* Tab 1: 1v1 Battle Arena & Cloud Matchmaking Simulator */}
      {activeTab === '1V1_BATTLE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#0a0f1d] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <div className="text-xs text-amber-400 font-semibold tracking-wider uppercase mb-1">
                {language === 'hinglish' ? 'क्लाउड मैचमेकिंग सिमुलेटर' : 'Cloud Matchmaking Arena'}
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-100">
                {language === 'hinglish' ? '1v1 रियल-टाइम बैटिंग मुकाबला' : '1v1 Real-Time Head-to-Head Battle'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {language === 'hinglish'
                  ? 'Redis मैचमेकिंग कतार में बराबर के खिलाड़ी को ढूंढें, ₹50 एस्क्रो में लॉक करें और 6 गेंदों का लाइव मैच खेलें।'
                  : 'Queue into the Redis ELO pool, lock ₹50 into secure escrow, and battle in a 6-ball live chase.'}
              </p>
            </div>

            {/* Stake Box */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#060a14] border border-slate-800 rounded-xl text-center">
              <div>
                <div className="text-[11px] text-slate-400 mb-0.5">Entry Stake</div>
                <div className="text-lg font-bold font-mono text-slate-200">₹50</div>
              </div>
              <div className="border-x border-slate-800">
                <div className="text-[11px] text-slate-400 mb-0.5">Total Pot Pool</div>
                <div className="text-lg font-bold font-mono text-amber-400">₹100</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 mb-0.5">Winner Payout</div>
                <div className="text-lg font-bold font-mono text-emerald-400">₹90 (90%)</div>
              </div>
            </div>

            {/* Matchmaking Action Button */}
            {!matchedOpponent ? (
              <button
                onClick={handleStartMatchmaking}
                disabled={isSearchingMatch}
                className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isSearchingMatch
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/20 active:scale-95'
                }`}
              >
                {isSearchingMatch ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>
                      {language === 'hinglish'
                        ? 'खिलाड़ी ढूंढ रहे हैं (Redis MMR कतार)...'
                        : 'Finding matched opponent in Redis queue...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>
                      {language === 'hinglish'
                        ? '1v1 प्रतिद्वंद्वी खोजें (₹50 एस्क्रो लॉक)'
                        : 'Find 1v1 Opponent (₹50 Escrow Lock)'}
                    </span>
                  </>
                )}
              </button>
            ) : (
              /* Matched View */
              <div className="space-y-4">
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {language === 'hinglish' ? 'मुकाबला मिल गया!' : 'Opponent Found!'}
                      </span>
                    </span>
                    <span className="font-mono text-slate-400">Room: {matchedOpponent.room}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <div>
                      <div className="text-sm font-bold text-slate-200">
                        {matchedOpponent.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        MMR: <span className="font-mono text-amber-400">{matchedOpponent.mmr}</span> · Win Rate: {matchedOpponent.winRate}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-emerald-400 font-semibold">
                        Ping: {matchedOpponent.ping}
                      </div>
                      <div className="text-[10px] text-slate-500">Mumbai Edge WSS</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Escrow Status:</span>
                    <span className="text-emerald-400 font-mono">₹100 LOCKED IN VAULT</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onLaunchMatch}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>
                      {language === 'hinglish' ? 'मैच शुरू करें (Start 6-Ball Match)' : 'Launch 6-Ball Match'}
                    </span>
                  </button>
                  <button
                    onClick={() => setMatchedOpponent(null)}
                    className="px-4 py-3 bg-slate-800 text-slate-300 text-xs rounded-xl hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Anti-cheat guarantee note */}
            <div className="flex items-center gap-2.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {language === 'hinglish'
                  ? 'मैच सर्वर-ऑथॉरिटेटिव मोड में चलेगा। कोई भी थर्ड पार्टी स्क्रिप्ट या ऑटो-क्लिकर ब्लॉक कर दिए जाएंगे।'
                  : 'Encrypted WSS session with server trajectory verification. Bot macros are blocked in real-time.'}
              </span>
            </div>
          </div>

          {/* Right Column: Live Matchmaking Stats */}
          <div className="lg:col-span-5 bg-[#060a14] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {language === 'hinglish' ? 'रियल-टाइम सर्वर कतार आँकड़े' : 'Live Matchmaking Telemetry'}
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Active Players in Queue:</span>
                <span className="font-mono text-emerald-400 font-bold">1,482</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Average Pairing Time:</span>
                <span className="font-mono text-slate-200 font-bold">1.4 seconds</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Average Regional Ping:</span>
                <span className="font-mono text-amber-400 font-bold">22 ms</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Escrow Security:</span>
                <span className="font-mono text-emerald-400 font-bold">ACID Locked</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <div className="font-semibold text-slate-300 mb-1">
                {language === 'hinglish' ? 'एस्क्रो रिफंड सुरक्षा नियम:' : 'Escrow Protection Rule:'}
              </div>
              {language === 'hinglish'
                ? 'यदि पहली गेंद फेंके जाने से पहले किसी खिलाड़ी का इंटरनेट टूटता है, तो दोनों के पैसे 100% वापस उनके वॉलेट में क्रेडिट हो जाते हैं।'
                : 'If a connection drop occurs prior to delivery 1, 100% of escrow stakes are refunded to both player wallets automatically.'}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tournament Brackets */}
      {activeTab === 'BRACKETS' && (
        <div className="bg-[#0a0f1d] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-amber-400 font-semibold tracking-wider uppercase mb-1">
                {language === 'hinglish' ? 'नॉकआउट टूर्नामेंट' : 'Knockout Tournament'}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-100">
                {language === 'hinglish' ? 'चैलेंजर कप: 8-प्लेयर नॉकआउट' : 'Challenger Cup: 8-Player Bracket'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg font-mono">
                Prize Pool: ₹400
              </span>
            </div>
          </div>

          {/* Interactive Bracket Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Round 1: Quarter Finals */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Quarter-Finals (Round 1)
              </div>
              <div className="space-y-3">
                {[
                  { p1: 'You (Striker)', s1: '24 runs', p2: 'Rohan_P', s2: '16 runs', win: 1 },
                  { p1: 'Kabir_Sixer', s1: '32 runs', p2: 'Boom_Boom', s2: '28 runs', win: 1 },
                  { p1: 'Master_07', s1: '26 runs', p2: 'Aarav_K', s2: '18 runs', win: 1 },
                  { p1: 'Helicopter_M', s1: '30 runs', p2: 'Speedy_99', s2: '22 runs', win: 1 },
                ].map((match, i) => (
                  <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between text-slate-200 font-medium">
                      <span>{match.p1}</span>
                      <span className="font-mono text-emerald-400 font-bold">{match.s1}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{match.p2}</span>
                      <span className="font-mono">{match.s2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Round 2: Semi Finals */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Semi-Finals (Round 2)
              </div>
              <div className="space-y-6 pt-3">
                {[
                  { p1: 'You (Striker)', s1: '28 runs', p2: 'Kabir_Sixer', s2: '24 runs', win: 1 },
                  { p1: 'Master_07', s1: '34 runs', p2: 'Helicopter_M', s2: '29 runs', win: 1 },
                ].map((match, i) => (
                  <div key={i} className="p-3.5 bg-slate-900 border border-amber-500/30 rounded-xl space-y-1.5 text-xs shadow-md">
                    <div className="flex justify-between text-slate-100 font-bold">
                      <span>{match.p1}</span>
                      <span className="font-mono text-emerald-400 font-bold">{match.s1}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{match.p2}</span>
                      <span className="font-mono">{match.s2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Round 3: Grand Final */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Grand Final (Championship)
              </div>
              <div className="pt-8">
                <div className="p-5 bg-gradient-to-b from-amber-500/15 to-slate-900 border border-amber-500/50 rounded-2xl space-y-3 text-xs shadow-xl">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Trophy className="w-4 h-4" />
                    <span>Grand Championship Match</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="font-bold text-slate-100 text-sm">You (Striker)</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">36 runs</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Master_07</span>
                    <span className="font-mono text-slate-300">30 runs</span>
                  </div>
                  <div className="pt-2 text-[11px] text-emerald-400 font-semibold text-center bg-emerald-500/10 rounded-lg py-1.5">
                    Prize: ₹250 1st Place Credited to Wallet
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Global Leaderboard */}
      {activeTab === 'LEADERBOARD' && (
        <div className="bg-[#0a0f1d] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-amber-400 font-semibold tracking-wider uppercase mb-1">
                {language === 'hinglish' ? 'लाइव रैंकिंग' : 'Redis Real-Time Rankings'}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-100">
                {language === 'hinglish' ? 'ऑल-इंडिया टॉप स्ट्राइकर्स' : 'All-India Premier Strikers'}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Redis ZREVRANGE Sync (1ms)</span>
            </div>
          </div>

          {/* Leaderboard Table adhering to Zero-Pill & Tabular Discipline */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-3 px-4"># Rank</th>
                  <th className="py-3 px-4">Player Name</th>
                  <th className="py-3 px-4">MMR Rating</th>
                  <th className="py-3 px-4">Matches</th>
                  <th className="py-3 px-4">Win Rate</th>
                  <th className="py-3 px-4">Total Earnings</th>
                  <th className="py-3 px-4">Integrity Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {LEADERBOARD_DATA.map((player) => (
                  <tr key={player.rank} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-bold">
                      {player.rank === 1 ? (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 fill-current" />
                          <span>1</span>
                        </span>
                      ) : player.rank === 2 ? (
                        <span className="text-slate-300">2</span>
                      ) : player.rank === 3 ? (
                        <span className="text-amber-600">3</span>
                      ) : (
                        <span className="text-slate-500">{player.rank}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                      {player.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-400 tabular-nums">
                      {player.rating}
                    </td>
                    <td className="py-3 px-4 text-slate-300 tabular-nums">
                      {player.matches}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 tabular-nums">
                      {player.winRate}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-200 tabular-nums">
                      {player.earnings}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{player.trustBadge}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
