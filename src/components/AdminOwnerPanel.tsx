import React from 'react';
import { X, TrendingUp, DollarSign, ShieldCheck, PieChart, Users, ArrowUpRight, Flame, Percent, RefreshCw } from 'lucide-react';
import { OwnerRevenueStats, TransactionRecord } from '../types';

interface AdminOwnerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'hinglish' | 'english';
  revenueStats: OwnerRevenueStats;
  transactions: TransactionRecord[];
}

export const AdminOwnerPanel: React.FC<AdminOwnerPanelProps> = ({
  isOpen,
  onClose,
  language,
  revenueStats,
  transactions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#080d1a] border border-amber-500/30 w-full max-w-4xl max-h-[90vh] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto relative space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-100 font-display">
                  {language === 'hinglish' ? 'मालिक का रेवेन्यू डैशबोर्ड (Owner Control)' : 'Platform Owner Revenue & Profit Panel'}
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'hinglish'
                  ? 'रियल-टाइम टर्नओवर, 10% PVP रेक कमीशन और 5-6% हाउस एज का शुद्ध मुनाफा'
                  : 'Real-time turnover, 10% PVP battle rake, 5-6% house edge & net margin'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Profit Hero KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Net Owner Profit */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-emerald-900/20 to-slate-900 border border-emerald-500/40 p-4 rounded-2xl space-y-1">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'hinglish' ? 'कुल शुद्ध मुनाफा' : 'Net Owner Profit'}</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">
              ₹{revenueStats.netOwnerProfit.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">100% Risk-Free Profit</div>
          </div>

          {/* Gross Turnover */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'hinglish' ? 'कुल टर्नओवर (दांव)' : 'Gross Turnover'}</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-100">
              ₹{revenueStats.totalWagered.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Total Wagered Today</div>
          </div>

          {/* PVP Battle Rake (10%) */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
            <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'hinglish' ? '10% बैटल रेक कमीशन' : '10% Battle Rake'}</span>
              <Percent className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-teal-300">
              ₹{revenueStats.pvpRakeEarned.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">PVP Stone-Paper-Scissors Fee</div>
          </div>

          {/* Casino House Edge */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
            <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'hinglish' ? 'हाउस एज मार्जिन' : 'House Edge Profit'}</span>
              <Flame className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-300">
              ₹{revenueStats.houseEdgeProfit.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Casino Over/Under 7 Margin</div>
          </div>
        </div>

        {/* Mathematical Proof Box */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{language === 'hinglish' ? 'गणितीय प्रमाण (Mathematical Proof of Owner Profit)' : 'Mathematical House Advantage'}</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-400">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1">1. Over/Under 7 Edge:</span>
              <span>
                36 पासों में 7 आने की संभावना 16.6% होती है। 2.15x ऑड्स देने पर प्लेटफॉर्म का <strong>6.5% शुद्ध मार्जिन</strong> हमेशा आरक्षित रहता है।
              </span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-teal-400 font-bold block mb-1">2. PVP Battle 10% Rake:</span>
              <span>
                दो खिलाड़ी ₹100-₹100 लगाते हैं (कुल ₹200)। विजेता को ₹180 मिलते हैं और <strong>₹20 (10%)</strong> बिना किसी रिस्क के सीधा आपका मुनाफा है।
              </span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">3. 1% Payout Margin:</span>
              <span>
                खिलाड़ी अपनी जीत के पैसे निकालते समय 1% प्रोसेसिंग फीस देता है (जैसे ₹10,000 विड्रॉल पर <strong>₹100 फीस</strong>)।
              </span>
            </div>
          </div>
        </div>

        {/* Live Transaction Ledger Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider">
              {language === 'hinglish' ? 'हालिया वित्तीय ट्रांजेक्शन ऑडिट (Live Audit Ledger)' : 'Recent Financial Transactions'}
            </h4>
            <span className="text-slate-500 font-mono">Total {transactions.length} records</span>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden text-xs">
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60 font-mono">
              {transactions.length === 0 ? (
                <div className="p-6 text-center text-slate-500 font-sans">
                  No transactions recorded yet. Play a game or roll dice to see live records!
                </div>
              ) : (
                transactions.map((t) => (
                  <div key={t.id} className="p-3 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          t.type.includes('WIN')
                            ? 'bg-rose-400'
                            : t.type.includes('RAKE') || t.type.includes('DEPOSIT')
                            ? 'bg-emerald-400'
                            : 'bg-amber-400'
                        }`}
                      />
                      <span className="text-slate-300 font-sans font-medium">{t.description}</span>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      {t.rake && t.rake > 0 && (
                        <span className="text-[10px] text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          Rake: +₹{t.rake}
                        </span>
                      )}
                      <span
                        className={`font-bold ${
                          t.type.includes('WIN')
                            ? 'text-rose-400'
                            : t.type.includes('DEPOSIT') || t.type.includes('RAKE')
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {t.type.includes('WIN') ? `-₹${t.amount}` : `₹${t.amount}`}
                      </span>
                      <span className="text-[10px] text-slate-500 hidden sm:inline">{t.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
