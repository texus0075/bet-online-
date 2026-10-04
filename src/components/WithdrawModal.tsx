import React, { useState } from 'react';
import { X, ArrowDownRight, CheckCircle2, ShieldCheck, AlertCircle, Building2, Smartphone } from 'lucide-react';
import { playCashChime, playLossBuzzer } from '../utils/audio';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'hinglish' | 'english';
  walletBalance: number;
  onWithdrawSuccess: (amount: number, fee: number) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  language,
  walletBalance,
  onWithdrawSuccess,
}) => {
  const [withdrawMethod, setWithdrawMethod] = useState<'UPI' | 'BANK'>('UPI');
  const [amount, setAmount] = useState<number>(500);
  const [upiId, setUpiId] = useState<string>('');
  const [bankAcc, setBankAcc] = useState<string>('');
  const [ifsc, setIfsc] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const fee = Math.max(5, Math.round(amount * 0.01)); // 1% fee (Min ₹5)
  const netPayout = Math.max(0, amount - fee);

  const handleWithdraw = () => {
    setError(null);
    if (amount < 200) {
      setError(language === 'hinglish' ? 'न्यूनतम विड्रॉल ₹200 होना चाहिए।' : 'Minimum withdrawal is ₹200.');
      playLossBuzzer();
      return;
    }
    if (amount > walletBalance) {
      setError(language === 'hinglish' ? 'वॉलेट में पर्याप्त बैलेंस नहीं है!' : 'Insufficient wallet balance!');
      playLossBuzzer();
      return;
    }
    if (withdrawMethod === 'UPI' && (!upiId || !upiId.includes('@'))) {
      setError(language === 'hinglish' ? 'कृपया मान्य UPI ID दर्ज करें (उदा. name@upi)।' : 'Please enter a valid UPI ID (e.g. name@upi).');
      playLossBuzzer();
      return;
    }
    if (withdrawMethod === 'BANK' && (!bankAcc || !ifsc)) {
      setError(language === 'hinglish' ? 'कृपया बैंक खाता और IFSC कोड भरें।' : 'Please enter Bank Account and IFSC code.');
      playLossBuzzer();
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      playCashChime();
      onWithdrawSuccess(amount, fee);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b1324] border border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-100">
                {language === 'hinglish' ? 'तुरंत विड्रॉल (पैसे निकालें)' : 'Instant Payout / Withdrawal'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'hinglish' ? 'उपलब्ध बैलेंस:' : 'Available Balance:'}{' '}
                <span className="font-mono text-emerald-400 font-bold">₹{walletBalance.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-100">
              {language === 'hinglish' ? `₹${netPayout} का विड्रॉल स्वीकृत!` : `₹${netPayout} Payout Approved!`}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'hinglish'
                ? `1% प्रोसेसिंग फीस (₹${fee}) काटकर पैसे आपके खाते में भेज दिए गए हैं।`
                : `₹${fee} (1% fee) deducted. Funds dispatched to your destination.`}
            </p>
          </div>
        ) : (
          <>
            {/* Method Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setWithdrawMethod('UPI')}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  withdrawMethod === 'UPI'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI Transfer</span>
              </button>

              <button
                onClick={() => setWithdrawMethod('BANK')}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  withdrawMethod === 'BANK'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Bank IMPS</span>
              </button>
            </div>

            {/* Amount Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-semibold">
                <span>{language === 'hinglish' ? 'विड्रॉल राशि (₹):' : 'Withdraw Amount (₹):'}</span>
                <button
                  onClick={() => setAmount(walletBalance)}
                  className="text-amber-400 hover:underline text-[11px] cursor-pointer"
                >
                  {language === 'hinglish' ? 'पूरा बैलेंस' : 'Max All'}
                </button>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={200}
                max={walletBalance}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 font-mono font-bold text-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Destination inputs */}
            {withdrawMethod === 'UPI' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">
                  {language === 'hinglish' ? 'आपकी UPI ID:' : 'Your UPI ID:'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. mobile@paytm or name@okaxis"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Account Number</label>
                  <input
                    type="text"
                    placeholder="Enter Account Number"
                    value={bankAcc}
                    onChange={(e) => setBankAcc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0001234"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono uppercase"
                  />
                </div>
              </div>
            )}

            {/* Fee Breakdown Card */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{language === 'hinglish' ? 'कुल निकासी:' : 'Requested Amount:'}</span>
                <span className="font-mono text-slate-200">₹{amount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{language === 'hinglish' ? 'प्रोसेसिंग फीस (1%):' : 'Platform Fee (1%):'}</span>
                <span className="font-mono text-amber-400">-₹{fee}</span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 flex justify-between font-bold text-slate-100">
                <span>{language === 'hinglish' ? 'आपके बैंक/UPI में आएगा:' : 'You Receive:'}</span>
                <span className="font-mono text-emerald-400 text-sm">₹{netPayout}</span>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleWithdraw}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer active:scale-98 transition-all"
            >
              {isProcessing ? (
                <span>{language === 'hinglish' ? 'निकासी प्रोसेस हो रही है...' : 'Processing Dispatch...'}</span>
              ) : (
                <span>{language === 'hinglish' ? `₹${netPayout} बैंक में ट्रांसफर करें` : `CONFIRM WITHDRAWAL ₹${netPayout}`}</span>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
