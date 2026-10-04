import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Share2, Copy, Check, Users, Gift, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserProfile, PlayerStats, TransactionRecord } from '../types';
import { playCashChime } from '../utils/audio';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'hinglish' | 'english';
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  onRecordTransaction?: (tx: TransactionRecord) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  language,
  userProfile,
  setUserProfile,
  playerStats,
  setPlayerStats,
  onRecordTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'REFERRAL'>('PROFILE');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inputReferral, setInputReferral] = useState('');
  const [referralAppliedSuccess, setReferralAppliedSuccess] = useState(false);
  const [referralError, setReferralError] = useState<string | null>(null);

  // Form states for profile editing
  const [username, setUsername] = useState(userProfile.username);
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [mobile, setMobile] = useState(userProfile.mobile);
  const [email, setEmail] = useState(userProfile.email);
  const [location, setLocation] = useState(userProfile.location);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const referralLink = `https://cricstrike.vip/ref/${userProfile.referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userProfile.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      username: username.startsWith('@') ? username : `@${username}`,
      fullName,
      mobile,
      email,
      location,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleApplyReferralCode = () => {
    setReferralError(null);
    if (!inputReferral.trim()) {
      setReferralError(language === 'hinglish' ? 'कृपया रेफरल कोड दर्ज करें।' : 'Please enter a referral code.');
      return;
    }
    if (inputReferral.toUpperCase() === userProfile.referralCode) {
      setReferralError(language === 'hinglish' ? 'आप स्वयं का कोड इस्तेमाल नहीं कर सकते!' : 'Cannot use your own code!');
      return;
    }
    if (userProfile.referredBy) {
      setReferralError(language === 'hinglish' ? 'आपने पहले ही एक रेफरल कोड अप्लाई कर रखा है।' : 'Referral code already applied.');
      return;
    }

    // Give ₹50 joining bonus
    const bonus = 50;
    playCashChime();
    setPlayerStats(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + bonus,
    }));
    setUserProfile(prev => ({
      ...prev,
      referredBy: inputReferral.toUpperCase(),
    }));
    setReferralAppliedSuccess(true);

    if (onRecordTransaction) {
      onRecordTransaction({
        id: Date.now().toString(),
        type: 'REFERRAL_BONUS',
        amount: bonus,
        description: `Referral Welcome Bonus (${inputReferral.toUpperCase()})`,
        timestamp: new Date().toLocaleTimeString(),
        username: userProfile.username,
        mobile: userProfile.mobile,
        location: userProfile.location,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#090e1c] border border-amber-500/30 w-full max-w-xl max-h-[90vh] rounded-3xl p-6 sm:p-7 shadow-2xl overflow-y-auto relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
              {userProfile.username.substring(1, 3).toUpperCase() || 'VIP'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-100">
                  {userProfile.username}
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  VERIFIED PLAYER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {userProfile.location} · {userProfile.mobile}
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

        {/* Tab Switcher: Profile Info vs. Referral Network */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'PROFILE'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{language === 'hinglish' ? 'प्लेयर प्रोफाइल' : 'Player Profile'}</span>
          </button>

          <button
            onClick={() => setActiveTab('REFERRAL')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'REFERRAL'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>{language === 'hinglish' ? 'रेफरल और कमाई (2%)' : 'Refer & Earn (2%)'}</span>
          </button>
        </div>

        {/* TAB 1: PROFILE INFO & EDIT */}
        {activeTab === 'PROFILE' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="text-amber-400 font-bold block mb-1">
                {language === 'hinglish' ? '💡 एडमिन लाइव मॉनिटरिंग:' : '💡 Admin Live Tracking:'}
              </span>
              <span>
                {language === 'hinglish'
                  ? 'यह यूजरनेम और लोकेशन हर बाज़ी और ट्रांजेक्शन के साथ एडमिन पैनल में रिकॉर्ड होती है ताकि ओनर को ठीक-ठीक पता रहे कि कौन सा खिलाड़ी कहाँ से दांव लगा रहा है।'
                  : 'This username and city is logged in the Admin Owner Panel for real-time monitoring of stakes, payouts, and locations.'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'hinglish' ? 'यूजरनेम (Player Handle)' : 'Username'}</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono font-bold focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'hinglish' ? 'पूरा नाम' : 'Full Name'}</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'hinglish' ? 'मोबाइल नंबर' : 'Mobile Number'}</span>
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>{language === 'hinglish' ? 'ईमेल आईडी (Gmail)' : 'Email (Gmail)'}</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{language === 'hinglish' ? 'शहर व राज्य (Location)' : 'City / Location'}</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-rose-400"
                  required
                />
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in zoom-in duration-200">
                <Check className="w-4 h-4" />
                <span>{language === 'hinglish' ? 'प्रोफाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile updated successfully!'}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {language === 'hinglish' ? 'प्रोफाइल विवरण सुरक्षित करें' : 'Save Profile Changes'}
            </button>
          </form>
        )}

        {/* TAB 2: REFERRAL CODE & EARNING CHANNEL */}
        {activeTab === 'REFERRAL' && (
          <div className="space-y-5">
            {/* Referral Hero Banner */}
            <div className="bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/40 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-purple-400" />
                  <span>{language === 'hinglish' ? 'रेफरल से पैसे कमाएं' : 'Refer & Earn Lifetime 2%'}</span>
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  2% COMMISSIONS
                </span>
              </div>

              <div className="text-2xl font-black text-slate-100">
                {language === 'hinglish'
                  ? 'दोस्तों को जोड़ें और हर बाज़ी पर 2% रॉयल्टी पाएं!'
                  : 'Invite Friends & Earn 2% On Every Game Played!'}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'hinglish'
                  ? 'जब भी आपका दोस्त रजिस्टर कर डाइस या एविएटर खेलेगा, उसके हर दांव का 2% तुरंत आपके वॉलेट में लाइफटाइम जुड़ता रहेगा। नए दोस्त को ₹50 वेलकम बोनस मिलेगा।'
                  : 'Get 2% instant royalty on every bet placed by invited players. Your friend gets ₹50 free welcome cash.'}
              </p>
            </div>

            {/* Unique Code & Copy Strip */}
            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    {language === 'hinglish' ? 'आपका व्यक्तिगत रेफरल कोड:' : 'Your Referral Code:'}
                  </div>
                  <div className="text-2xl font-black font-mono text-purple-400 tracking-wider">
                    {userProfile.referralCode}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-purple-600/20"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
                  </button>
                </div>
              </div>

              {/* Referral Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Friends Invited</div>
                  <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                    {userProfile.totalReferralsCount} Users
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Active in your area</div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Referral Royalties Earned</div>
                  <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                    ₹{userProfile.totalReferralEarnings.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Direct into wallet</div>
                </div>
              </div>

              {/* Apply Someone Else's Referral Code Section */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'hinglish' ? 'दोस्त का रेफरल कोड डालें (₹50 बोनस पाएं)' : 'Have an invite code? Get ₹50'}</span>
                  </span>
                  {userProfile.referredBy && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      Applied: {userProfile.referredBy}
                    </span>
                  )}
                </div>

                {!userProfile.referredBy ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. VIP-CRIC-9900"
                      value={inputReferral}
                      onChange={(e) => setInputReferral(e.target.value.toUpperCase())}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs uppercase focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleApplyReferralCode}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      {language === 'hinglish' ? 'बोनस क्लेम करें' : 'Claim ₹50'}
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'hinglish' ? 'बधाई! ₹50 का वेलकम बोनस आपके वॉलेट में जुड़ चुका है।' : '₹50 welcome bonus credited to wallet!'}</span>
                  </div>
                )}

                {referralError && (
                  <p className="text-rose-400 text-xs font-semibold">{referralError}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
