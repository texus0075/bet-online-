import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';

interface FooterProps {
  language: 'hinglish' | 'english';
  setActiveView: (view: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, setActiveView }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#060913] text-slate-400 text-xs py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand statement */}
        <div className="space-y-1 text-center md:text-left">
          <div className="text-sm font-bold font-display text-slate-200">
            CricStrike VIP
          </div>
          <p className="text-slate-500 max-w-sm text-[11px]">
            {language === 'hinglish'
              ? 'रियल-टाइम बैटिंग गेम इंजन, सर्वर-ऑथॉरिटेटिव एंटी-चीट आर्किटेक्चर और मोनेटाइजेशन ब्लूप्रिंट।'
              : 'Production-grade real-time cricket batting engine, zero-trust physics, and matchmaking architecture.'}
          </p>
        </div>

        {/* Navigation jump links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
          <button onClick={() => setActiveView('GAME')} className="hover:text-amber-400 transition-colors">
            {language === 'hinglish' ? 'बैटिंग सिम्युलेटर' : 'Batting Simulator'}
          </button>
          <button onClick={() => setActiveView('FLOW')} className="hover:text-amber-400 transition-colors">
            {language === 'hinglish' ? '7-फेज सिस्टम फ्लो' : 'System Flow Pipeline'}
          </button>
          <button onClick={() => setActiveView('TECH')} className="hover:text-amber-400 transition-colors">
            {language === 'hinglish' ? 'टेक स्टैक गाइड' : 'Tech Stack Matrix'}
          </button>
          <button onClick={() => setActiveView('PROMPTS')} className="hover:text-amber-400 transition-colors">
            {language === 'hinglish' ? 'मास्टर प्रॉम्प्ट्स' : 'Master Prompts'}
          </button>
          <button onClick={() => setActiveView('ANTICHEAT')} className="hover:text-amber-400 transition-colors">
            {language === 'hinglish' ? 'एंटी-चीट लैब' : 'Anti-Cheat Defense'}
          </button>
        </div>

        {/* Trust badge */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Fair Play Guaranteed · 60Hz Server Sync</span>
        </div>
      </div>
    </footer>
  );
};
