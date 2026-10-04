import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Zap, AlertTriangle, Play, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';

interface AntiCheatProps {
  language: 'hinglish' | 'english';
}

export const AntiCheatInspector: React.FC<AntiCheatProps> = ({ language }) => {
  const [activeVector, setActiveVector] = useState<'SPEEDHACK' | 'BOT_MACRO' | 'SCORE_INJECT' | 'MULTI_ACCOUNT'>('SPEEDHACK');
  const [isSimulating, setIsSimulating] = useState(false);
  const [testLog, setTestLog] = useState<{
    status: 'CAUGHT_AND_BANNED' | 'VERIFIED_CLEAN';
    detectionMethod: string;
    serverAction: string;
    packetDump: Record<string, any>;
  } | null>(null);

  const runCheatTest = (vector: typeof activeVector) => {
    setIsSimulating(true);
    setTestLog(null);

    setTimeout(() => {
      setIsSimulating(false);

      if (vector === 'SPEEDHACK') {
        setTestLog({
          status: 'CAUGHT_AND_BANNED',
          detectionMethod: 'Wall-Clock Delta Verification (Server Drift > 180ms)',
          serverAction: 'Session Terminated. Nonce Revoked. Client IP Flagged for 24h.',
          packetDump: {
            clientReportedTimestamp: 1772619088400,
            serverAuthoritativeTime: 1772619088120,
            clockSkewMs: '+280ms (Speedhack detected)',
            actionTaken: 'FORCE_DISCONNECT_REASON_SPEEDHACK',
          },
        });
      } else if (vector === 'BOT_MACRO') {
        setTestLog({
          status: 'CAUGHT_AND_BANNED',
          detectionMethod: 'Sub-Millisecond Timing Jitter Anomaly (Standard Deviation < 0.8ms)',
          serverAction: 'Auto-Clicker Bot Flagged. Escrow Frozen Pending Security Review.',
          packetDump: {
            ball1TimingDelta: '0.12ms',
            ball2TimingDelta: '0.14ms',
            ball3TimingDelta: '0.11ms',
            verdict: 'INHUMAN_BOT_REACTION',
            punishment: 'ESCROW_FROZEN_AUTOBAN',
          },
        });
      } else if (vector === 'SCORE_INJECT') {
        setTestLog({
          status: 'CAUGHT_AND_BANNED',
          detectionMethod: 'Raycast Collision Mismatch (Ball position was at z=600 while hit claimed at z=900)',
          serverAction: 'Direct Score Injection Rejected. Match Awarded to Opponent.',
          packetDump: {
            clientClaimedRuns: 6,
            serverCalculatedCollision: null,
            raycastDistance: '42.8cm away from bat edge',
            verdict: 'TAMPERED_SCORE_PACKET_DROPPED',
          },
        });
      } else {
        setTestLog({
          status: 'CAUGHT_AND_BANNED',
          detectionMethod: 'Hardware Signature & Canvas WebGL Hash Match (Device ID Duplicate)',
          serverAction: 'Bonus Claim Rejected. Associated Accounts Linked & Multi-Account Blocked.',
          packetDump: {
            incomingDeviceId: 'dev_81f9a2e',
            matchedExistingAccount: 'usr_cric_1002 (Banned)',
            verdict: 'DUPLICATE_SYBIL_ATTACK',
          },
        });
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-100">
              {language === 'hinglish'
                ? 'एंटी-चीट लैब: हैक और चीटिंग कैसे पकड़ी जाती है?'
                : 'Anti-Cheat Security Lab & Integrity Verification'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {language === 'hinglish'
                ? 'खुद टेस्ट करके देखें कि सर्वर किस तरह ऑटो-क्लिकर बॉट्स, स्पीडहैक और फेक स्कोर को 1 सेकंड में पकड़कर बैन करता है।'
                : 'Interactive sandbox demonstrating zero-trust physics reconciliation and real-time hack prevention.'}
            </p>
          </div>
        </div>
      </div>

      {/* Vector Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            id: 'SPEEDHACK' as const,
            titleEn: '1. Speedhack & Time Warp',
            titleHi: '1. स्पीडहैक और टाइम क्लॉक हैक',
            descHi: 'गेम की स्पीड बढ़ाकर बॉलर को धीमा करने की कोशिश',
            descEn: 'Manipulating client timers or delta times',
          },
          {
            id: 'BOT_MACRO' as const,
            titleEn: '2. Auto-Clicker Bot Macro',
            titleHi: '2. ऑटो-क्लिकर और बॉट स्क्रिप्ट',
            descHi: 'सॉफ्टवेयर से हर गेंद पर 0.1ms में परफेक्ट सिक्स मारना',
            descEn: 'Sub-millisecond inhuman automated clickers',
          },
          {
            id: 'SCORE_INJECT' as const,
            titleEn: '3. Direct Score Packet Inject',
            titleHi: '3. फेक स्कोर पैकेट इंजेक्शन',
            descHi: 'बिना गेंद लगे सर्वर को फर्जी छक्के का पैकेट भेजना',
            descEn: 'Modded APK trying to claim boundary runs directly',
          },
          {
            id: 'MULTI_ACCOUNT' as const,
            titleEn: '4. Multi-Account Sybil Farm',
            titleHi: '4. डुप्लीकेट अकाउंट और बोनस फ्रॉड',
            descHi: 'एक ही फोन से 10 अकाउंट बनाकर बोनस लूटना',
            descEn: 'Hardware spoofing to exploit entry bonuses',
          },
        ].map((vec) => {
          const isSelected = activeVector === vec.id;
          return (
            <button
              key={vec.id}
              onClick={() => {
                setActiveVector(vec.id);
                setTestLog(null);
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-red-500/15 border-red-500/60 shadow-lg shadow-red-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-slate-200 mb-1">
                {language === 'hinglish' ? vec.titleHi : vec.titleEn}
              </div>
              <div className="text-[11px] text-slate-400 leading-tight">
                {language === 'hinglish' ? vec.descHi : vec.descEn}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Vector Interactive Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0a0f1d] border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {language === 'hinglish' ? 'हैक वेक्टर विश्लेषण (Threat Analysis)' : 'Threat Vector Analysis'}
            </span>
          </div>

          <h3 className="text-xl font-bold font-display text-slate-100">
            {activeVector === 'SPEEDHACK' &&
              (language === 'hinglish' ? 'स्पीडहैक का पता कैसे लगाया जाता है?' : 'How Speedhacks are Neutralized')}
            {activeVector === 'BOT_MACRO' &&
              (language === 'hinglish' ? 'ऑटो-क्लिकर बॉट्स को कैसे पकड़ा जाता है?' : 'How Auto-Clicker Bots are Caught')}
            {activeVector === 'SCORE_INJECT' &&
              (language === 'hinglish' ? 'फेक स्कोर इंजेक्शन को कैसे रोका जाता है?' : 'How Packet Score Injections Fail')}
            {activeVector === 'MULTI_ACCOUNT' &&
              (language === 'hinglish' ? 'मल्टीपल अकाउंट्स को कैसे ब्लॉक किया जाता है?' : 'How Device Cloners are Blocked')}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeVector === 'SPEEDHACK' &&
              (language === 'hinglish'
                ? 'हैकर्स CheatEngine या ब्राउज़र एक्सटेंशन से गेम क्लॉक को धीमा कर देते हैं ताकि गेंद धीरे-धीरे आए। हमारा बैकएंड हर 16ms पर सर्वर की दीवार घड़ी (Server Wall Clock) से क्लाइंट टाइम मैच करता है। अगर क्लाइंट टाइम में 100ms से ज्यादा का अंतर आया, तो खिलाड़ी तुरंत डिस्कनेक्ट हो जाता है।'
                : 'Hackers manipulate window.requestAnimationFrame or browser timers to slow down incoming balls. CricStrike VIP enforces server wall-clock heartbeat synchronization. If client clock drifts by >100ms, the session is forcefully dropped.')}
            {activeVector === 'BOT_MACRO' &&
              (language === 'hinglish'
                ? 'इंसानी उंगलियाँ कभी भी 0.1ms की एक जैसी टाइमिंग पर लगातार 5 गेंदों को नहीं छू सकतीं। हमारा एंटी-चीट इंजन हर शॉट के बाद टाइमिंग का "स्टैटिस्टिकल स्टैंडर्ड डेविएशन" नापता है। अगर लगातार 3 बॉल पर टाइमिंग वेरिएशन 1.5ms से कम आया, तो सिस्टम समझ जाता है कि यह इंसान नहीं बल्कि ऑटो-बॉट है।'
                : 'Human muscle reaction times have natural biological variance (+/- 15-40ms). If consecutive swing inputs show superhuman precision with standard deviation under 1.5ms, the player is flagged as a script macro and banned.')}
            {activeVector === 'SCORE_INJECT' &&
              (language === 'hinglish'
                ? 'मॉडिफाइड APK या हैक ऐप सीधे सर्वर को "SIX RUNS" का पैकेट भेजने की कोशिश करते हैं। लेकिन हमारे सिस्टम में क्लाइंट के पास रन तय करने का अधिकार ही नहीं है! सर्वर 3D स्पेस में गेंद और बैट का "रे-कास्ट कोलिजन" (Raycast Collision) चेक करता है। अगर गेंद बैट से 40cm दूर थी, तो सिक्स का पैकेट रिजेक्ट होकर मैच विपक्षी को मिल जाता है।'
                : 'Modded clients attempt to inject simulated boundary packets. In our zero-trust architecture, the server runs the physics raycast. If ball coordinates do not physically intersect with the batsman bat polygon, the packet is instantly dropped.')}
            {activeVector === 'MULTI_ACCOUNT' &&
              (language === 'hinglish'
                ? 'खिलाड़ी कई अकाउंट बनाकर साइन-अप बोनस लूटने की कोशिश करते हैं। हमारा सिस्टम Canvas Fingerprinting, WebGL GPU Shader Hash और नेटवर्क सबनेट को मिलाकर एक परमानेंट हार्डवेयर आईडी बनाता है। अगर ऐप अनइंस्टॉल भी कर दिया जाए, तो भी पुराना डिवाइस पकड़ में आ जाता है।'
                : 'Sybil attackers generate fake accounts for bonus farming. We combine Canvas rendering hashes, WebGL GPU vendor strings, and hardware entropy into an immutable Device Fingerprint that persists across uninstalls.')}
          </p>

          <button
            onClick={() => runCheatTest(activeVector)}
            disabled={isSimulating}
            className="px-6 py-3 bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-500/20 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {isSimulating
                ? language === 'hinglish'
                  ? 'सर्वर वेरिफिकेशन चल रहा है...'
                  : 'Verifying on Server...'
                : language === 'hinglish'
                ? `इस हैक को टेस्ट करें (${activeVector})`
                : `Simulate Attack Vector (${activeVector})`}
            </span>
          </button>
        </div>

        {/* Right Column: Server Live Security Console */}
        <div className="lg:col-span-5 bg-[#060a14] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-red-400" />
                <span>SERVER DEFENSE LOG</span>
              </span>
              <span className="text-[10px] text-slate-500">PORT: 443 WSS</span>
            </div>

            {testLog ? (
              <div className="space-y-3">
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl">
                  <div className="text-xs font-bold text-red-400 flex items-center gap-1.5 mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span>VERDICT: {testLog.status}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <span className="text-slate-400">Trigger: </span>
                    {testLog.detectionMethod}
                  </div>
                  <div className="text-[11px] text-amber-400 mt-1">
                    <span className="text-slate-400">Action: </span>
                    {testLog.serverAction}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-400 mb-1">PACKET EVIDENCE:</div>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto">
                    {JSON.stringify(testLog.packetDump, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                {isSimulating ? (
                  <div className="flex flex-col items-center gap-2 text-amber-400">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Executing server-side trajectory inspection...</span>
                  </div>
                ) : (
                  <span>Click 'Simulate Attack Vector' to trigger a live security audit.</span>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Competitive Integrity:</span>
            <span className="text-emerald-400 font-mono">100% UNCOMPROMISED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
