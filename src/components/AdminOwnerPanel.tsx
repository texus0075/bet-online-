import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, ShieldCheck, PieChart, Users, ArrowUpRight, Flame, Percent, RefreshCw, Trophy, Gift, Search, AlertTriangle, Lock, MapPin, Phone, Clock } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  // Filter transactions by player username, location, or type
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      (t.username && t.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.location && t.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      selectedTypeFilter === 'ALL' ||
      (selectedTypeFilter === 'PVP' && (t.type === 'BATTLE_STAKE' || t.type === 'BATTLE_WIN' || t.type === 'BATTLE_RAKE')) ||
      (selectedTypeFilter === 'CASINO' && (t.type === 'BET_CASINO' || t.type === 'WIN_CASINO')) ||
      (selectedTypeFilter === 'BANKING' && (t.type === 'DEPOSIT' || t.type === 'WITHDRAW')) ||
      (selectedTypeFilter === 'REFERRAL' && t.type === 'REFERRAL_BONUS') ||
      (selectedTypeFilter === 'TOURNAMENT' && (t.type === 'TOURNAMENT_ENTRY' || t.type === 'TOURNAMENT_PRIZE'));

    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#080d1a] border border-amber-500/30 w-full max-w-5xl max-h-[92vh] rounded-3xl p-5 sm:p-8 shadow-2xl overflow-y-auto relative space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-100 font-display">
                  {language === 'hinglish' ? 'मालिक का रेवेन्यू और ऑडिट कंट्रोल' : 'Platform Owner Revenue & Profit Panel'}
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'hinglish'
                  ? '5 कमाई के स्रोत, लाइव प्लेयर ट्रैकिंग (स्थान/यूजरनेम) और बैंक सुरक्षा वॉलेट शील्ड'
                  : '5 Active revenue streams, live player metadata tracking & bankroll protection shield'}
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

        {/* Big Profit Hero KPI Strip: All 5 Monetization Channels */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Channel 1: Casino House Edge */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'hinglish' ? '1. हाउस एज मार्जिन' : '1. Casino Edge'}</span>
              <Flame className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-indigo-300">
              ₹{revenueStats.houseEdgeProfit.toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-400">Over/Under 7 & Aviator 6%</div>
          </div>

          {/* Channel 2: 10% PVP Match Rake */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'hinglish' ? '2. 10% PVP रेक' : '2. PVP Rake (10%)'}</span>
              <Percent className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-teal-300">
              ₹{revenueStats.pvpRakeEarned.toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-400">Zero Risk 1v1 Battle Rake</div>
          </div>

          {/* Channel 3: 1% Withdrawal Fees */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'hinglish' ? '3. 1% विड्रॉल फीस' : '3. Payout Fee (1%)'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-sky-300">
              ₹{revenueStats.withdrawalFeesEarned.toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-400">Bank / UPI Transfer Charge</div>
          </div>

          {/* Channel 4: 20% Tournament Ticket Margin */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'hinglish' ? '4. टूर्नामेंट टिकट 20%' : '4. Tournament 20%'}</span>
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-purple-300">
              ₹{revenueStats.tournamentMarginEarned.toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-400">₹20 / ₹100 Ticket Margin</div>
          </div>

          {/* Channel 5: Referral / Affiliate Spread */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-1 col-span-2 lg:col-span-1">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'hinglish' ? '5. रेफरल स्प्रेड' : '5. Referral Spread'}</span>
              <Gift className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-300">
              ₹{revenueStats.referralNetMargin.toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-400">Viral Viral Acquisition Spread</div>
          </div>
        </div>

        {/* Master Net Profit Strip */}
        <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/40 border border-emerald-500/50 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>{language === 'hinglish' ? 'प्लेटफॉर्म का कुल शुद्ध मुनाफा (Net Owner Profit):' : 'Platform Total Net Profit:'}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-300 mt-1">
              ₹{revenueStats.netOwnerProfit.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Turnover Today: ₹{revenueStats.totalWagered.toLocaleString()} · Total Payouts: ₹{revenueStats.totalPayouts.toLocaleString()}
            </div>
          </div>

          {/* Bankroll Safeguard Box */}
          <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 text-xs font-mono shrink-0 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'hinglish' ? 'बैंक सुरक्षा लिमिट (Vault Cap):' : 'House Bankroll Vault Cap:'}</span>
            </div>
            <div className="text-slate-200">
              Vault Reserve: <strong className="text-emerald-400">₹{revenueStats.reservePoolVault.toLocaleString()}</strong>
            </div>
            <div className="text-[10px] text-slate-400">
              Max Allowed Single Bet: <strong className="text-amber-400">₹1,000</strong> (Protected from big loss)
            </div>
          </div>
        </div>

        {/* Owner Safety & Banking Architecture Advisory */}
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {language === 'hinglish'
                ? 'मालिक के लिए साइबर सेल और बैंक अकाउंट सुरक्षा एडवाइजरी (Bank Freeze Protection)'
                : 'Owner Account Freeze Protection & USDT Cold Wallet Strategy'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-400 text-[11px] leading-relaxed">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <strong className="text-slate-200 block mb-1">खतरा (Risk of Bank Accounts / UPI):</strong>
              {language === 'hinglish'
                ? 'यदि किसी भी सामान्य या म्यूल बैंक अकाउंट में दिनभर में 50-100 UPI लेनदेन आते हैं, या कोई एक हारा हुआ खिलाड़ी साइबर सेल (1930) में शिकायत कर देता है, तो बैंक पूरा खाता फ्रीज (Lien) कर देता है।'
                : 'High frequency UPI velocity or a single user chargeback/complaint on cybercrime portal freezes the account instantly.'}
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <strong className="text-emerald-400 block mb-1">सुरक्षित समाधान (USDT Zero-Balance Rule):</strong>
              {language === 'hinglish'
                ? 'कलेक्शन खाते में कभी भी ₹50,000 से अधिक राशि न छोड़ें। प्रतिदिन के मुनाफे को तुरंत USDT (क्रिप्टो कोल्ड वॉलेट) में स्वीप कर लें, जिसे कोई भी बैंक या साइबर सेल कभी ब्लॉक या जब्त नहीं कर सकता।'
                : 'Never hold > ₹50,000 in collection accounts. Sweep daily net profits into TRC-20 USDT cold hardware wallets.'}
            </div>
          </div>
        </div>

        {/* Live Transaction Ledger with User Details & Search Filter */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <h4 className="font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>{language === 'hinglish' ? 'लाइव खिलाड़ी व वित्तीय ऑडिट लेजर' : 'Live Player & Financial Audit Ledger'}</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                {language === 'hinglish'
                  ? 'हर खिलाड़ी का यूजरनेम, शहर, समय और दांव राशि का लाइव रिकॉर्ड'
                  : 'Audited log with username, city location, timestamp, and net operator margins'}
              </p>
            </div>

            {/* Search and Category Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder={language === 'hinglish' ? 'यूजर / शहर खोजें...' : 'Search user/city...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none font-semibold cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="PVP">PVP Battle</option>
                <option value="CASINO">Casino / Dice</option>
                <option value="BANKING">Deposit / Withdraw</option>
                <option value="REFERRAL">Referral</option>
                <option value="TOURNAMENT">Tournament</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden text-xs">
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 font-mono">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-sans">
                  No records matching your search query or filter.
                </div>
              ) : (
                filteredTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50 transition-colors"
                  >
                    {/* User & Location Info */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          t.type.includes('WIN')
                            ? 'bg-rose-400'
                            : t.type.includes('RAKE') || t.type.includes('DEPOSIT') || t.type.includes('REFERRAL')
                            ? 'bg-emerald-400'
                            : 'bg-amber-400'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap font-sans">
                          <span className="font-bold text-slate-200">{t.username || '@Player'}</span>
                          <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-rose-400" />
                            <span>{t.location || 'India'}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{t.timestamp}</span>
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-sans">
                          {t.description}
                        </div>
                      </div>
                    </div>

                    {/* Financial Amount & Platform Gain */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
                      {t.rake && t.rake > 0 && (
                        <span className="text-[10px] text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          Rake: +₹{t.rake}
                        </span>
                      )}

                      <span
                        className={`text-sm font-bold ${
                          t.type.includes('WIN')
                            ? 'text-rose-400'
                            : t.type.includes('DEPOSIT') || t.type.includes('RAKE') || t.type.includes('REFERRAL')
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {t.type.includes('WIN') ? `-₹${t.amount}` : `₹${t.amount}`}
                      </span>
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
