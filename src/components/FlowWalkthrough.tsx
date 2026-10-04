import React, { useState } from 'react';
import { UserCheck, Shield, Users, Lock, Zap, Film, Trophy, ArrowRight, CheckCircle2, Terminal, RefreshCw } from 'lucide-react';
import { ArchitecturePhase } from '../types';

interface FlowWalkthroughProps {
  language: 'hinglish' | 'english';
}

const PHASES: ArchitecturePhase[] = [
  {
    id: 'p1_signup',
    phaseNumber: 1,
    titleEn: 'User Sign-Up & Device Fingerprinting',
    titleHi: 'यूजर साइन-अप और डिवाइस वेरिफिकेशन',
    subtitleEn: 'Preventing bot accounts and multi-accounting from Day 1',
    subtitleHi: 'फेक बॉट और डुप्लीकेट एकाउंट्स को शुरुआत में ही रोकना',
    simpleExplanationHi:
      'जब नया प्लेयर ऐप खोलता है, तो उसका फोन नंबर OTP से वेरीफाई होता है। साथ ही सिस्टम फोन का यूनिक हार्डवेयर फिंगरप्रिंट सेव कर लेता है। इसका फायदा यह है कि एक ही मोबाइल से कोई 10 फेक अकाउंट बनाकर बोनस नहीं लूट सकता और कोई ऑटोमेटेड बॉट स्क्रिप्ट गेम में नहीं घुस सकती।',
    simpleExplanationEn:
      'The player signs up via Phone OTP or Google OAuth. The backend captures a secure device hardware fingerprint. This ensures one device cannot create multiple accounts to exploit sign-up bonuses, and automated headless bots are immediately blocked.',
    technicalDetails: [
      'JWT Auth with refresh token rotation (15m expiry)',
      'Device Fingerprint ID (Canvas hash, WebGL vendor, OS signature)',
      'Rate-limiting: 5 OTP attempts per IP per hour via Redis token bucket',
    ],
    antiCheatRole: 'Blocks multi-accounting, emulator spoofing, and mass bot generation.',
    techInvolved: ['PostgreSQL', 'Redis', 'Twilio / Firebase Phone Auth', 'FingerprintJS Pro'],
    mockPayload: {
      action: 'USER_REGISTER',
      phoneNumber: '+91 98765 43210',
      deviceFingerprint: 'df_8a92f091c7b8',
      platform: 'Android PWA / Web',
      clientNonce: '81f02c',
    },
    mockResponse: {
      status: 'VERIFIED',
      userId: 'usr_cric_8829',
      walletBalance: 250,
      trustRating: 'TIER_1_CLEAN',
      sessionToken: 'jwt_eyJhbGciOiJIUzI1NiIsInR5cCI6...',
    },
  },
  {
    id: 'p2_escrow',
    phaseNumber: 2,
    titleEn: 'Wallet Deposit & Match Escrow Lock',
    titleHi: 'वॉलेट डिपॉजिट और एस्क्रो लॉक',
    subtitleEn: 'Zero-discrepancy financial lock before match commences',
    subtitleHi: 'मैच शुरू होने से पहले सुरक्षित वॉलेट लॉक ताकि कोई भाग न सके',
    simpleExplanationHi:
      'जब दो प्लेयर 1v1 बैटल या टूर्नामेंट में जाते हैं (जैसे ₹50 की एंट्री), तो दोनों के पैसे मैच शुरू होने से पहले ही सिस्टम के "एस्क्रो वॉल्ट" (Escrow Lock) में सुरक्षित हो जाते हैं। अगर कोई खिलाड़ी हारने के डर से इंटरनेट बंद कर दे, तो उसके पैसे नहीं डूबते बल्कि नियमों के तहत सही विनर को मिल जाते हैं।',
    simpleExplanationEn:
      'Before entering a 1v1 battle or tournament, each player stakes their entry fee (e.g., ₹50). The backend moves this amount from available balance into an isolated Escrow Vault. This guarantees funds are secure, preventing rage-quits from avoiding payout.',
    technicalDetails: [
      'Two-Phase ACID Transaction (SELECT FOR UPDATE on PostgreSQL ledger)',
      'Escrow state: PENDING -> LOCKED -> SETTLED / REFUNDED',
      'Webhook signature verification (HMAC-SHA256) on Stripe / Razorpay deposits',
    ],
    antiCheatRole: 'Prevents double-spending, negative balance glitches, and rage-quit exploit.',
    techInvolved: ['PostgreSQL (ACID Ledger)', 'Razorpay / Cashfree / Stripe', 'Redis Locks'],
    mockPayload: {
      action: 'ESCROW_LOCK',
      userId: 'usr_cric_8829',
      matchType: '1V1_CHALLENGER',
      entryFee: 50,
      expectedPot: 100,
    },
    mockResponse: {
      escrowId: 'esc_77391a',
      status: 'FUNDS_LOCKED',
      totalPot: 100,
      rakePlatformFee: '₹10 (10%)',
      winnerPrizePool: '₹90',
      timestamp: '2026-10-04T08:00:00Z',
    },
  },
  {
    id: 'p3_matchmaking',
    phaseNumber: 3,
    titleEn: 'Cloud Matchmaking & Ping Routing',
    titleHi: 'क्लाउड मैचमेकिंग और लो-लेटेंसी कनेक्ट',
    subtitleEn: 'Sub-second fair pairing based on MMR and ping < 40ms',
    subtitleHi: '2 सेकंड में बराबर के हुनरमंद खिलाड़ी से मुकाबला (< 40ms पिंग)',
    simpleExplanationHi:
      'सिस्टम तुरंत देखता है कि दोनों खिलाड़ियों का बैटिंग स्किल स्कोर (MMR) बराबर हो ताकि नया खिलाड़ी किसी प्रो से न पिटे। साथ ही दोनों को सबसे नजदीकी सर्वर (जैसे मुंबई सर्वर) पर जोड़ा जाता है ताकि गेम में जरा भी लैग या झटका न आए।',
    simpleExplanationEn:
      'The matchmaking engine groups players into MMR skill brackets in Redis sorted sets. Once paired, players are routed to the nearest regional edge node (e.g. Mumbai AWS/GCP region) to guarantee ultra-low ping (<40ms) for smooth gameplay.',
    technicalDetails: [
      'Redis ZRANGEBYSCORE for MMR skill window expansion (±50 MMR every 2s)',
      'Geo-DNS edge routing with WebSockets (WSS)',
      'Room allocation via Colyseus or custom Node.js cluster',
    ],
    antiCheatRole: 'Stops smurfing, rank manipulation, and high-ping network throttling exploits.',
    techInvolved: ['Redis Sorted Sets', 'Colyseus / SocketCluster', 'AWS/GCP Edge Mumbai'],
    mockPayload: {
      action: 'ENTER_MATCHMAKING',
      userId: 'usr_cric_8829',
      playerMMR: 1250,
      geoRegion: 'ap-south-1',
      maxLatencyToleranceMs: 60,
    },
    mockResponse: {
      status: 'ROOM_ASSIGNED',
      roomId: 'room_batting_9921',
      opponent: { name: 'Kabir_PowerStriker', mmr: 1265, ping: '24ms' },
      wsGateway: 'wss://game-mumbai.cricstrike.io/room_9921',
      matchStartTime: 1772619000,
    },
  },
  {
    id: 'p4_anticheat_session',
    phaseNumber: 4,
    titleEn: 'Anti-Cheat Handshake & Physics Seed',
    titleHi: 'एंटी-चीट हैंडशेक और सर्वर फिजिक्स',
    subtitleEn: 'Zero-trust architecture where the client NEVER decides runs',
    subtitleHi: 'जीरो-ट्रस्ट सिस्टम: मोबाइल कभी रन तय नहीं करता, सब सर्वर पर होता है',
    simpleExplanationHi:
      'यह सबसे जरूरी सुरक्षा चक्र है! पुराने गेम्स में हैकर मोबाइल की मेमोरी बदलकर रन 100 कर देते थे। हमारे सिस्टम में प्लेयर का मोबाइल सिर्फ एक सिग्नल भेजता है: "मैंने किस मिलीसेकंड पर बल्ला घुमाया"। गेंद कहाँ गिरी, बैट पर कब लगी और चौका हुआ या छक्का—यह 100% सर्वर खुद कैलकुलेट करता है। इसलिए कोई हैक मुमकिन ही नहीं है।',
    simpleExplanationEn:
      'This is the heart of competitive integrity. The client is strictly an input terminal. The player only sends swing timestamp and vector angle. The game server runs the physics equations, raycasting, and ball collision. Direct memory alterations or injection mods are mathematically impossible.',
    technicalDetails: [
      'Server-authoritative physics: Trajectory raycast calculated at 60Hz tick',
      'Client memory heartbeat checks (detects CheatEngine, Frida, GameGuardian)',
      'Cryptographic delivery seed shared only upon bowler release',
    ],
    antiCheatRole: 'Blocks memory editors, speedhacks, modified APKs, and fake score injections.',
    techInvolved: ['Server Physics Loop (Node/C++)', 'WebAssembly Integrity Hash', 'TLS 1.3'],
    mockPayload: {
      action: 'SYNC_SESSION_SEED',
      roomId: 'room_batting_9921',
      clientWasmHash: 'sha256_7b819f2a',
      heartbeatMs: 16.6,
    },
    mockResponse: {
      handshake: 'AUTHORIZED',
      physicsSeed: 'seed_phys_33109',
      allowedToleranceMs: 45,
      antiReplayNonce: 'nonce_981a',
    },
  },
  {
    id: 'p5_gameplay',
    phaseNumber: 5,
    titleEn: 'Real-Time Batting & Smooth Delta Sync',
    titleHi: 'रियल-टाइम बैटिंग और स्मूथ 60FPS सिंक्रोनाइजेशन',
    subtitleEn: 'Lag-compensated input prediction with instant sound & visual feedback',
    subtitleHi: 'बिना किसी लैग के गेंद की स्विंग, सीम और बैट का करारा शॉट',
    simpleExplanationHi:
      'जैसे ही बॉलर 145 km/h की रफ्तार से गेंद फेंकता है, प्लेयर स्क्रीन पर "कवर ड्राइव" या "हेलीकॉप्टर शॉट" का बटन दबाता है। टाइमिंग मीटर मिलीसेकंड्स में नापता है कि बल्ला सही वक्त पर लगा या नहीं। प्लेयर को तुरंत लकड़ी पर लेदर गेंद टकराने की आवाज (Willow Thwack) और क्राउड का शोर सुनाई देता है।',
    simpleExplanationEn:
      'The bowler delivers variations (outswing, yorker, bouncer). The player executes shots (Pull, Cover Drive, Helicopter) with sub-frame precision. Client-side prediction renders smooth 60fps animations while server reconciliation guarantees identical physics state across players.',
    technicalDetails: [
      'Client prediction with lag compensation (buffer 2-3 ticks)',
      'HTML5 Canvas 2D / PixiJS hardware-accelerated rendering',
      'Web Audio API procedural sound synthesis (Zero MP3 download latency)',
    ],
    antiCheatRole: 'Detects impossible superhuman reaction times (< 15ms) across consecutive deliveries.',
    techInvolved: ['HTML5 Canvas', 'Web Audio API', 'Binary WebSocket Payloads (Protobuf/Msgpack)'],
    mockPayload: {
      event: 'BATSMAN_SWING',
      swingTimestamp: 1772619045120,
      shotType: 'HELICOPTER',
      batAngleRad: 1.22,
      inputDevice: 'TOUCH_SCREEN',
    },
    mockResponse: {
      outcome: 'SIX',
      distanceMeters: 104,
      ballSpeedKmph: 147,
      wagonAngle: 72,
      serverScoreboard: { runs: 18, balls: 4, wickets: 0 },
    },
  },
  {
    id: 'p6_monetization',
    phaseNumber: 6,
    titleEn: 'In-Game Ads & Rewarded Videos',
    titleHi: 'कमाई के साधन: इन-गेम एड्स और रिवार्ड वीडियो',
    subtitleEn: 'High eCPM rewarded video triggers with Server-to-Server (S2S) verification',
    subtitleHi: 'कंपनी और प्लेयर दोनों की कमाई: 2X मल्टीप्लायर और फ्री लाइफ के लिए वीडियो',
    simpleExplanationHi:
      'गेम में दो तरह से कमाई होती है: (1) खिलाड़ी ओवर खत्म होने पर 5-15 सेकंड का स्पॉन्सर्ड वीडियो देखता है और बदले में उसे 2X स्कोर मल्टीप्लायर या फ्री रिवाइवल मिलता है। (2) प्लेटफॉर्म हर कैश मैच के पॉट से 5-10% प्लेटफॉर्म सर्विस फीस (Rake) कमाता है। फर्जी एड व्यूज रोकने के लिए गूगल एडमॉब का सर्वर खुद हमारे सर्वर को सिग्नल देता है।',
    simpleExplanationEn:
      'Dual monetization engine: (1) Rewarded video ads offer players 2X run multipliers or match revivals, delivering $25+ eCPMs in sports gaming. (2) Platform rake (5-10%) on cash tournament pools. Server-to-Server (S2S) callbacks prevent ad-fraud.',
    technicalDetails: [
      'Google AdMob / Unity Ads / AppLovin MAX mediation',
      'Server-to-Server (S2S) Rewarded Callback with cryptographic HMAC check',
      'Daily view caps to protect player retention (max 6 rewarded ads/day)',
    ],
    antiCheatRole: 'Blocks fake ad-completion injection using signed cryptographic tokens from ad network.',
    techInvolved: ['Google AdMob S2S', 'Unity Ads SDK', 'Redis Ad-Cooldown Timers'],
    mockPayload: {
      action: 'REWARDED_AD_COMPLETED',
      adNetwork: 'Google_AdMob',
      placementId: 'rewarded_multiplier_2x',
      s2sCallbackToken: 's2s_hmac_e88a0921f',
    },
    mockResponse: {
      bonusGranted: '2X_RUN_MULTIPLIER',
      bonusEscrowAdded: 50,
      expiresInMinutes: 30,
      status: 'VERIFIED_BY_ADMOB_S2S',
    },
  },
  {
    id: 'p7_settlement_leaderboard',
    phaseNumber: 7,
    titleEn: 'Instant Settlement & Global Leaderboard',
    titleHi: 'तुरंत ईनाम ट्रांसफर और ग्लोबल लीडरबोर्ड',
    subtitleEn: 'Automated escrow release, tax compliance (TDS), and real-time rank display',
    subtitleHi: 'जीतते ही वॉलेट में पैसे ट्रांसफर और ऑल-इंडिया रैंकिंग अपडेट',
    simpleExplanationHi:
      'जैसे ही छठा बॉल खत्म होता है, विनर तय हो जाता है। एस्क्रो वॉल्ट से पैसे विनर के वॉलेट में 1 सेकंड में ट्रांसफर हो जाते हैं (जिसे वह तुरंत UPI/Paytm से निकाल सकता है)। साथ ही ऑल-इंडिया लीडरबोर्ड पर उसकी रैंक लाइव ऊपर चढ़ जाती है और उसे "Verified Fair Player" का बैज मिल जाता है।',
    simpleExplanationEn:
      'Upon match completion, the escrow contract settles instantly. Winnings are deposited into the winner wallet with automated tax/TDS invoice logging. The global leaderboard updates in real-time using Redis Sorted Sets, displaying verified clean player badges.',
    technicalDetails: [
      'Redis ZADD / ZINCRBY for real-time leaderboard ranking (< 1ms)',
      'Automated withdrawal routing via RazorpayX / Cashfree Instant Payouts',
      'PostgreSQL audit ledger entry for compliance and tax reporting',
    ],
    antiCheatRole: 'Final anti-cheat audit before cash withdrawal approval (flags anomalous win streaks).',
    techInvolved: ['Redis Sorted Sets', 'RazorpayX Instant UPI', 'PostgreSQL Ledger', 'WebSockets'],
    mockPayload: {
      action: 'SETTLE_MATCH',
      roomId: 'room_batting_9921',
      winnerId: 'usr_cric_8829',
      finalScore: '28/0 (6 balls)',
      prizeAmount: 90,
    },
    mockResponse: {
      settlementStatus: 'PAID_INSTANTLY',
      newWalletBalance: 340,
      newLeaderboardRank: 142,
      mmrGain: '+24 MMR',
      trustScore: '100% CLEAN',
    },
  },
];

export const FlowWalkthrough: React.FC<FlowWalkthroughProps> = ({ language }) => {
  const [selectedPhase, setSelectedPhase] = useState<ArchitecturePhase>(PHASES[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState<Record<string, any> | null>(null);

  const handleSimulate = (phase: ArchitecturePhase) => {
    setIsSimulating(true);
    setSimulatedResult(null);

    setTimeout(() => {
      setIsSimulating(false);
      setSimulatedResult(phase.mockResponse);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header introduction */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-100">
              {language === 'hinglish' ? 'पूरा सिस्टम फ्लो: साइन-अप से लेकर लीडरबोर्ड तक' : 'End-to-End System Architecture Pipeline'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {language === 'hinglish'
                ? 'सरल भाषा में समझें कि एक प्रोफेशनल बैटिंग गेम वेबसाइट अंदर से कैसे काम करती है'
                : 'Understand how a production real-time batting platform runs seamlessly without lag or hacks'}
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Phase Navigator Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {PHASES.map((phase) => {
          const isSelected = selectedPhase.id === phase.id;
          return (
            <button
              key={phase.id}
              onClick={() => {
                setSelectedPhase(phase);
                setSimulatedResult(null);
              }}
              className={`px-3.5 py-2.5 rounded-xl text-left shrink-0 border transition-all ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500/60 text-slate-100 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {phase.phaseNumber}
                </span>
                <span className="text-xs font-semibold whitespace-nowrap">
                  {language === 'hinglish' ? phase.titleHi : phase.titleEn}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Selected Phase Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0a0f1d] border border-slate-800 rounded-2xl p-6 sm:p-8">
        {/* Left Column: Plain-language explanation */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="text-xs text-amber-400 font-semibold tracking-wider uppercase mb-1">
              Phase {selectedPhase.phaseNumber} of 7
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-100 mb-1">
              {language === 'hinglish' ? selectedPhase.titleHi : selectedPhase.titleEn}
            </h3>
            <p className="text-sm text-slate-400">
              {language === 'hinglish' ? selectedPhase.subtitleHi : selectedPhase.subtitleEn}
            </p>
          </div>

          {/* Simple Explanation Box (No heavy jargon!) */}
          <div className="bg-[#0e1627] border border-emerald-500/30 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'hinglish' ? 'सरल भाषा में समझें (Plain Explanation)' : 'Easy Understanding'}</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {language === 'hinglish'
                ? selectedPhase.simpleExplanationHi
                : selectedPhase.simpleExplanationEn}
            </p>
          </div>

          {/* Anti-cheat specific role */}
          <div className="bg-[#0f172a]/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-0.5">
                {language === 'hinglish' ? 'हैकिंग व चीटिंग से कैसे बचाता है?' : 'Anti-Cheat Defense Role'}
              </div>
              <p className="text-xs text-slate-300 leading-normal">{selectedPhase.antiCheatRole}</p>
            </div>
          </div>

          {/* Core Technical Highlights */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {language === 'hinglish' ? 'इंजीनियरिंग स्पेसिफिकेशन' : 'Engineering Specifications'}
            </div>
            <ul className="space-y-2">
              {selectedPhase.technicalDetails.map((tech, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{tech}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Involved Badges */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {language === 'hinglish' ? 'उपयोग होने वाली टेक्नोलॉजीज' : 'Underlying Technologies'}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedPhase.techInvolved.map((t, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 text-xs rounded-lg font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Data Packet Inspector & Interactive Simulator */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#060a14] border border-slate-800/90 rounded-xl p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>DATA PACKET INSPECTOR</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Live Mock Trace</span>
            </div>

            {/* Request Payload */}
            <div className="space-y-1 mb-4">
              <div className="text-[11px] font-semibold text-slate-400">
                1. Client WebSocket / HTTP Payload:
              </div>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto">
                {JSON.stringify(selectedPhase.mockPayload, null, 2)}
              </pre>
            </div>

            {/* Response Payload */}
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                <span>2. Server-Authoritative Response:</span>
                {simulatedResult && (
                  <span className="text-[10px] text-emerald-400 font-mono">200 OK (24ms)</span>
                )}
              </div>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-amber-300 overflow-x-auto min-h-[140px]">
                {isSimulating ? (
                  <div className="flex items-center gap-2 text-slate-400 pt-6 justify-center">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Processing server validation...</span>
                  </div>
                ) : simulatedResult ? (
                  JSON.stringify(simulatedResult, null, 2)
                ) : (
                  JSON.stringify(selectedPhase.mockResponse, null, 2)
                )}
              </pre>
            </div>
          </div>

          {/* Test step button */}
          <button
            onClick={() => handleSimulate(selectedPhase)}
            disabled={isSimulating}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>
              {language === 'hinglish'
                ? `फेज ${selectedPhase.phaseNumber} का सर्वर टेस्ट चलाएं`
                : `Simulate Phase ${selectedPhase.phaseNumber} Packet`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
