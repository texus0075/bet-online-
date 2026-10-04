import React, { useState } from 'react';
import { X, QrCode, Smartphone, CheckCircle2, ShieldCheck, Zap, ArrowRight, Copy, Check } from 'lucide-react';
import { playCashChime } from '../utils/audio';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'hinglish' | 'english';
  onDepositSuccess: (amount: number) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  language,
  onDepositSuccess,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [100, 500, 1000, 2000, 5000];
  const upiId = "cricstrikevip@icici";

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      playCashChime();
      onDepositSuccess(selectedAmount);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b1324] border border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-100">
                {language === 'hinglish' ? 'इंस्टेंट UPI डिपॉजिट' : 'Instant UPI Deposit'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'hinglish' ? 'PhonePe, GPay, Paytm या किसी भी UPI से' : 'PhonePe, GPay, Paytm or Any UPI'}
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
              {language === 'hinglish' ? `₹${selectedAmount} सफलतापूर्वक जमा हो गए!` : `₹${selectedAmount} Deposited Successfully!`}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'hinglish' ? 'आपके गेमिंग वॉलेट में बैलेंस अपडेट हो गया है।' : 'Balance updated in your gaming wallet.'}
            </p>
          </div>
        ) : (
          <>
            {/* Quick Amount Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                {language === 'hinglish' ? 'डिपॉजिट राशि चुनें:' : 'Select Deposit Amount:'}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      selectedAmount === amt
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated UPI QR Code */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <div className="w-40 h-40 bg-white p-3 rounded-2xl flex flex-col items-center justify-center relative shadow-lg">
                <QrCode className="w-32 h-32 text-slate-900" />
                <span className="text-[9px] font-bold text-slate-800 font-mono">SCAN & PAY ₹{selectedAmount}</span>
              </div>

              {/* UPI ID Copy Strip */}
              <div className="flex items-center justify-between w-full bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl text-xs">
                <span className="text-slate-400 font-mono text-[11px] truncate">{upiId}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors ml-2 shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 bg-emerald-500/5 border border-emerald-500/20 px-3 py-2 rounded-xl">
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-Bit Escrow Safe</span>
              </span>
              <span className="text-amber-400 font-bold">+ 100% First Deposit Bonus</span>
            </div>

            {/* Action Button */}
            <button
              onClick={handleDeposit}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer active:scale-98 transition-all"
            >
              {isProcessing ? (
                <span>{language === 'hinglish' ? 'पेमेंट प्रोसेस हो रही है...' : 'Processing Payment...'}</span>
              ) : (
                <>
                  <span>{language === 'hinglish' ? `₹${selectedAmount} तुरंत वॉलेट में जमा करें` : `PAY & ADD ₹${selectedAmount}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
