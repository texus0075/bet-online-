import React from 'react';
import { Layers, Server, Cpu, Database, ShieldCheck, CreditCard, Film, Check, AlertCircle } from 'lucide-react';

interface TechStackProps {
  language: 'hinglish' | 'english';
}

export const TechStackGuide: React.FC<TechStackProps> = ({ language }) => {
  const STACK_LAYERS = [
    {
      category: language === 'hinglish' ? '1. गेम सर्वर और रीयल-टाइम डेटा' : '1. Real-Time Game Server Engine',
      recommended: 'Colyseus.io (Node.js/TypeScript) या Go (Golang)',
      whyRecommendHi:
        'Colyseus खास तौर पर मल्टीप्लेयर गेम्स के लिए बना है। यह हर 16ms (60 FPS) पर रूम स्टेट को कंप्रेस करके भेजता है। Go या Node.js एक ही सर्वर पर 50,000+ खिलाड़ियों के बैटिंग मैच बिना हैंग हुए संभाल सकते हैं।',
      whyRecommendEn:
        'Colyseus is built natively for multiplayer room state synchronization with delta-compression. Go or Node.js cluster handles 50,000+ concurrent batting rooms on modest cloud hardware with sub-15ms tick latency.',
      alternatives: 'Socket.io (अकेला धीमा पड़ सकता है), Nakama (अच्छा विकल्प)',
      icon: Server,
      badge: '60Hz Tick Rate',
    },
    {
      category: language === 'hinglish' ? '2. इन-मेमोरी कैश और मैचमेकिंग' : '2. In-Memory Cache & Matchmaking Queue',
      recommended: 'Redis 7.x (Sorted Sets + Pub/Sub Streams)',
      whyRecommendHi:
        'खिलाड़ियों की रेटिंग (MMR) और ऑल-इंडिया लीडरबोर्ड को मेन डेटाबेस में बार-बार क्वेरी करने से वेबसाइट क्रैश हो जाएगी। Redis मेमोरी के अंदर 1 मिलीसेकंड में लाखों खिलाड़ियों की रैंक और मैचमेकिंग कतार प्रोसेस कर लेता है।',
      whyRecommendEn:
        'Querying SQL for 100,000 players’ MMR or leaderboard ranks causes instant database bottlenecks. Redis Sorted Sets (ZADD/ZRANGE) compute live global rankings and 1v1 matchmaking pairings in under 1ms.',
      alternatives: 'DragonflyDB, KeyDB',
      icon: Cpu,
      badge: '< 1ms Latency',
    },
    {
      category: language === 'hinglish' ? '3. क्लाइंट-साइड गेम इंजन (मोबाइल व वेब)' : '3. Client Game Rendering & Smoothness',
      recommended: 'HTML5 Canvas 2D / PixiJS (Web) + React',
      whyRecommendHi:
        'अगर आप Unity WebGL का इस्तेमाल करेंगे, तो गेम लोड होने में 40MB डेटा लगेगा और सस्ते फोनों पर क्रैश हो जाएगा। PixiJS / Canvas 2D केवल 200KB में लोड होता है और 10,000 रुपये वाले एंड्रॉयड फोन पर भी 60 FPS पर मक्खन की तरह चलता है।',
      whyRecommendEn:
        'Unity WebGL exports are 35MB+ and crash frequently on budget mobile browsers in emerging markets. PixiJS or 2D HTML5 Canvas loads in under 200KB and delivers silky 60fps performance on any device.',
      alternatives: 'Phaser 3, Babylon.js',
      icon: Layers,
      badge: '60 FPS Ultra-Light',
    },
    {
      category: language === 'hinglish' ? '4. सुरक्षित वॉलेट और वित्तीय डेटाबेस' : '4. Secure Wallet & Financial Ledger',
      recommended: 'PostgreSQL (ACID-Compliant Transactions)',
      whyRecommendHi:
        'पैसे के लेन-देन में गलती की कोई गुंजाइश नहीं होती। PostgreSQL के ACID ट्रांजेक्शन यह सुनिश्चित करते हैं कि अगर दो खिलाड़ी एक साथ मैच खेलते हैं, तो किसी का पैसा न तो डबल कटे और न ही गायब हो।',
      whyRecommendEn:
        'Real-money gaming demands strict financial integrity. PostgreSQL ensures double-entry bookkeeping with strict row locks (`SELECT FOR UPDATE`), preventing double-spending and ledger inconsistencies.',
      alternatives: 'TimescaleDB (फॉर एंटी-चीट टेलीमेट्री ऑडिट)',
      icon: Database,
      badge: 'Zero Discrepancy',
    },
    {
      category: language === 'hinglish' ? '5. एंटी-चीट व हैक प्रिवेंशन' : '5. Anti-Cheat & Fair Play Protocols',
      recommended: 'Server-Authoritative Trajectory + Memory Checksums',
      whyRecommendHi:
        'मोबाइल से कभी भी यह भरोसा न करें कि उसने क्या स्कोर भेजा। मोबाइल सिर्फ बैट घुमाने का टाइम भेजेगा। गेंद कब बल्ले पर लगी, वह सर्वर की फिजिक्स कैलकुलेट करेगी। ऑटो-क्लिकर और स्पीडहैक पकड़ने के लिए टाइमिंग वेरिएशन फिल्टर लगता है।',
      whyRecommendEn:
        'Zero client trust. The client only transmits input timestamp and swing angle. The server calculates ball-bat raycasting and registers runs. Statistical variance filters flag superhuman bots (< 15ms reaction time).',
      alternatives: 'WebAssembly Obfuscation, TLS Fingerprinting',
      icon: ShieldCheck,
      badge: 'Zero-Trust Input',
    },
    {
      category: language === 'hinglish' ? '6. पेमेंट गेटवे और रिवार्ड एड्स' : '6. Payment Gateways & Rewarded Ads SDK',
      recommended: 'Razorpay / Cashfree (UPI Instant) + Google AdMob / Unity Ads',
      whyRecommendHi:
        'भारत में 90% खिलाड़ी UPI (GPay, PhonePe, Paytm) से तुरंत पैसे जोड़ना और निकालना चाहते हैं। Cashfree/RazorpayX से 5 सेकंड में पैसा बैंक में जाता है। गूगल एडमॉब का सर्वर-टू-सर्वर (S2S) कॉलबैक फर्जी एड्स देखने वालों को ब्लॉक करता है।',
      whyRecommendEn:
        'Razorpay / Cashfree Payouts enable instant 5-second UPI settlements. Google AdMob and Unity Ads SDKs provide $25+ eCPMs with cryptographic Server-to-Server (S2S) verification preventing simulated view fraud.',
      alternatives: 'Stripe (Global), AppLovin MAX',
      icon: CreditCard,
      badge: 'Instant UPI Payouts',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-100 mb-2">
          {language === 'hinglish'
            ? 'बेस्ट टेक स्टैक गाइड: बिना क्रैश 50,000+ लाइव प्लेयर्स'
            : 'Production Tech Stack: Scalable to 50,000+ Concurrent Players'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
          {language === 'hinglish'
            ? 'गेमिंग में मिलीसेकंड्स की देरी से मैच खराब हो जाता है। यहाँ हमने उन टूल्स और डेटाबेस का कॉम्बिनेशन तैयार किया है जो कभी क्रैश नहीं होते और सर्वर खर्च भी 70% कम रखते हैं।'
            : 'In competitive real-time sports gaming, sub-frame latency and financial precision are paramount. Here is the field-tested architecture matrix.'}
        </p>
      </div>

      {/* Stack Layers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {STACK_LAYERS.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <div
              key={idx}
              className="bg-[#0a0f1d] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm text-slate-200">
                      {layer.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    {layer.badge}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-slate-400 mb-1">
                    {language === 'hinglish' ? 'अनुशंसित टेक्नोलॉजी (Recommended):' : 'Recommended Stack:'}
                  </div>
                  <div className="text-sm font-semibold font-mono text-amber-300">
                    {layer.recommended}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {language === 'hinglish' ? layer.whyRecommendHi : layer.whyRecommendEn}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{language === 'hinglish' ? 'वैकल्पिक विकल्प:' : 'Alternatives:'}</span>
                <span className="font-mono text-slate-400">{layer.alternatives}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison: Why This Architecture Wins */}
      <div className="bg-[#060a14] border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold font-display text-slate-100 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <span>
            {language === 'hinglish'
              ? 'आम गलतियाँ जो नए डेवलपर्स करते हैं (और कैसे बचें)'
              : 'Common Critical Mistakes & Solutions in Batting Games'}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900/60 border border-red-500/20 rounded-xl p-4 space-y-2">
            <div className="font-semibold text-red-400 flex items-center gap-1.5">
              <span>गलती 1: मोबाइल से रन का फैसला कराना</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              अगर मोबाइल ऐप सर्वर को भेजेगा "मैंने छक्का मारा", तो कोई भी हैकर APK मॉड करके हर गेंद पर 6 रन भेज देगा।
            </p>
            <div className="text-emerald-400 pt-1 border-t border-slate-800">
              समाधान: मोबाइल सिर्फ टाइमिंग भेजेगा, रन सर्वर की फिजिक्स तय करेगी।
            </div>
          </div>

          <div className="bg-slate-900/60 border border-amber-500/20 rounded-xl p-4 space-y-2">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5">
              <span>गलती 2: भारी Unity WebGL इस्तेमाल करना</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Unity 40MB का भारी बंडल बनाता है। सस्ते स्मार्टफोन पर गेम 30 सेकंड में लोड होता है और 70% प्लेयर छोड़ देते हैं।
            </p>
            <div className="text-emerald-400 pt-1 border-t border-slate-800">
              समाधान: 200KB का हल्का HTML5 Canvas 2D या PixiJS उपयोग करें।
            </div>
          </div>

          <div className="bg-slate-900/60 border border-blue-500/20 rounded-xl p-4 space-y-2">
            <div className="font-semibold text-blue-400 flex items-center gap-1.5">
              <span>गलती 3: SQL में लाइव लीडरबोर्ड चलाना</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              10,000 मैच एक साथ खत्म होने पर SQL डेटाबेस में 'ORDER BY score' क्वेरी सर्वर को पूरी तरह डाउन कर देगी।
            </p>
            <div className="text-emerald-400 pt-1 border-t border-slate-800">
              समाधान: Redis ZADD का इस्तेमाल करें जो 1ms में रैंकिंग देता है।
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
