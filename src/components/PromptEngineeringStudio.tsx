import React, { useState } from 'react';
import { Copy, Check, Sparkles, Send, Terminal, BookOpen, Layers, Shield, Trophy } from 'lucide-react';

interface PromptStudioProps {
  language: 'hinglish' | 'english';
}

interface PromptPreset {
  id: string;
  titleEn: string;
  titleHi: string;
  category: string;
  descriptionEn: string;
  descriptionHi: string;
  promptText: string;
}

const MASTER_PROMPTS: PromptPreset[] = [
  {
    id: 'master_batting_game',
    titleEn: '1. Complete Batting Game Engine & Physics Master Prompt',
    titleHi: '1. कंप्लीट बैटिंग गेम इंजन और फिजिक्स मास्टर प्रॉम्प्ट',
    category: 'Game Engine',
    descriptionEn: 'The definitive prompt to build the realistic batting simulator, physics, scoreboard, and wagon wheel.',
    descriptionHi: 'यह पूरा प्रॉम्प्ट कॉपी करके आप AI (Claude/Gemini/GPT) से पूरा रियलिस्टिक बैटिंग गेम बनवा सकते हैं।',
    promptText: `Act as a Senior Game Developer & Physics Engineer. Build a high-performance Real-Time Cricket Batting Game in React and HTML5 Canvas 2D / PixiJS with 60 FPS performance on mobile devices.

Core Requirements:
1. Realistic Bowling Physics Engine:
   - Bowling variations: Fast Outswinger (145 km/h, late lateral swing), Toe-Crushing Yorker (148 km/h, lands at blockhole z=920), Fast Bouncer (142 km/h, pitches short at z=430, rears to chest height), Leg-Spin Slider (108 km/h, drifting into pads and spinning away), and Knuckleball Slower.
   - 3D-perspective coordinate trajectory: z (0 to 1000 distance), y (ground to height), x (lateral line). Realistic pitch collision with restitution coefficient e=0.62 and seam friction.
2. Batting Mechanics & Sweet Spot:
   - Dynamic timing meter with a green sweet-spot zone (arrival window +/-45ms).
   - Six distinct shot types: Cover Drive (off-side drive), Straight Loft (straight 6), Pull Shot (mid-wicket 4/6), Helicopter Shot (power loft against yorker), Late Cut (behind third man), and Solid Defense.
   - Hit classification: Distance calculation (0 to 120m), 360-degree wagon wheel spray chart, runs (6, 4, 2, 1, Dot, Bowled, Caught).
3. Audio & Scoreboard:
   - Web Audio API procedural synthesis for crisp bat-ball willow sound ("thwack"), stumps rattling clatter, and crowd cheering roar (zero external audio file dependencies).
   - Live broadcast-style scoreboard: Runs, Wickets, Overs, Strike Rate, Projected Score, and dynamic ball-by-ball commentary.
4. Mobile Optimization:
   - Touch controls and responsive aspect ratio with zero layout shifts.`,
  },
  {
    id: 'master_anticheat_backend',
    titleEn: '2. Anti-Cheat & Server-Authoritative Backend Prompt',
    titleHi: '2. एंटी-चीट और सर्वर-ऑथॉरिटेटिव बैकएंड प्रॉम्प्ट',
    category: 'Security & Anti-Cheat',
    descriptionEn: 'Prompt for designing zero-trust input synchronization, trajectory validation, and bot macro detection.',
    descriptionHi: 'हैकर्स और ऑटो-क्लिकर बॉट्स को रोकने वाला सर्वर बैकएंड कोड बनवाने का प्रॉम्प्ट।',
    promptText: `Act as a Principal Multiplayer Security Architect. Build a zero-trust, server-authoritative backend in Node.js (Colyseus.io / WebSockets) or Go for a competitive real-money cricket batting platform.

Architectural Invariants & Hack Prevention:
1. Input-Only Client Protocol:
   - The client NEVER transmits runs, boundary outcomes, or scores.
   - The client sends ONLY: { swingTimestampMs, batAngleRad, shotType, clientNonce, memoryChecksum }.
2. Server-Authoritative Trajectory & Hit Verification:
   - The game server runs the physics equations independently at 60Hz tick rate.
   - When swing input arrives, the server checks if the ball was physically in the hit window (+/- 45ms). If the difference is > 100ms and client rendered a 6, reject packet immediately as TAMPERING.
3. Bot & Macro Detection:
   - Statistical variance analysis: If consecutive swing timestamps exhibit sub-millisecond reaction variance (< 1.5ms standard deviation) across 5 balls, flag as auto-clicker script.
4. Memory & Speedhack Defense:
   - Time delta verification: Reject packets if client clock advances faster than server wall-clock time (speedhack defense).
   - Enforce WebAssembly module hashing and TLS 1.3 mutual payload signing.`,
  },
  {
    id: 'master_matchmaking_escrow',
    titleEn: '3. Cloud Matchmaking, Tournament Brackets & Escrow Vault Prompt',
    titleHi: '3. क्लाउड मैचमेकिंग, टूर्नामेंट और एस्क्रो वॉलेट प्रॉम्प्ट',
    category: 'Matchmaking & Ledger',
    descriptionEn: 'Prompt to build Redis sorted-set matchmaking queues, 1v1 escrow hold, and knock-out brackets.',
    descriptionHi: '1v1 मुकाबला और 16-प्लेयर टूर्नामेंट में सुरक्षित पैसे लॉक और तुरंत पेआउट का प्रॉम्प्ट।',
    promptText: `Act as a High-Throughput Distributed Systems Engineer. Design a cloud matchmaking and financial escrow engine for a real-time multiplayer cricket game.

Technical Architecture:
1. Cloud Matchmaking in Redis 7.x:
   - Use Redis Sorted Sets (ZADD, ZRANGEBYSCORE) for ELO/MMR matchmaking buckets.
   - Players are grouped by MMR window (+/- 50 MMR). If no match found within 3 seconds, expand window by +/- 30 MMR.
   - Route matched pairs to regional edge WebSocket gateways based on lowest ping (< 40ms in India/Mumbai).
2. Financial Escrow Vault (ACID Double-Entry Ledger):
   - When match initiates, lock entry fees (e.g. 2 x ₹50 = ₹100 pot) using PostgreSQL 'SELECT FOR UPDATE' row lock.
   - Escrow status states: PENDING_MATCH -> LOCKED -> SETTLED -> REFUNDED (if connection drops before Ball 1).
   - Deduct platform rake (8-10%) and credit winner instantly via automated payout webhook (RazorpayX / Cashfree).
3. Real-Time Global Leaderboards:
   - Use Redis ZREVRANGE to query Top 100 players in under 1ms.
   - Maintain weekly tournament brackets (Quarter-finals -> Semi-finals -> Grand Finals) with automated prize distribution.`,
  },
  {
    id: 'master_monetization_ads',
    titleEn: '4. Rewarded Video Ads & High eCPM Monetization Pipeline Prompt',
    titleHi: '4. इन-गेम एड्स और 2X रिवार्ड वीडियो मोनेटाइजेशन प्रॉम्प्ट',
    category: 'Monetization',
    descriptionEn: 'Prompt to integrate Google AdMob / Unity Ads with Server-to-Server (S2S) HMAC verification.',
    descriptionHi: 'विज्ञापन से कमाई: ओवर के बीच में 2X मल्टीप्लायर और फ्री लाइफ देकर ज्यादा रेवेन्यू बनाने का प्रॉम्प्ट।',
    promptText: `Act as a Mobile Gaming Monetization & AdTech Specialist. Implement a high-eCPM Rewarded Video Ads and In-Game Sponsorship pipeline for a cricket batting game.

Monetization Mechanics:
1. Rewarded Video Ad Placements:
   - "2X Multiplier Boost": Watching a 15-second video ad doubles the runs scored in the upcoming over.
   - "Free Match Revival": If player is bowled on Ball 1, offer a rewarded ad to revive with a free hit delivery.
2. Server-to-Server (S2S) Fraud Prevention:
   - Never credit rewards based on client-side JS ad event listener (which hackers can easily mock with console.log).
   - Configure Server-to-Server (S2S) Webhook callback with Google AdMob / Unity Ads. The ad network server sends a signed HMAC-SHA256 callback to /api/ads/verify-reward.
   - The game server validates the cryptographic signature and credits player escrow/multiplier in real-time.
3. Native In-Game Sponsorship:
   - Render branded boundary ropes and stadium billboards using dynamic texture swap without blocking frame rates.`,
  },
  {
    id: 'master_1xbet_sportsbook',
    titleEn: '5. 1xBet / bet365 Style Live Cricket Sportsbook & Odds Engine Prompt',
    titleHi: '5. 1xBet / bet365 स्टाइल लाइव क्रिकेट स्पोर्ट्सबुक प्रॉम्प्ट',
    category: '1xBet / bet365 Sportsbook',
    descriptionEn: 'The definitive prompt to build a real-time sportsbook with live odds feeds, in-play ball markets, and betslip ledger.',
    descriptionHi: '1xBet और bet365 जैसी लाइव स्पोर्ट्स बेटिंग वेबसाइट, ऑड्स कैलकुलेटर और बैटस्लिप बनाने का मास्टर प्रॉम्प्ट।',
    promptText: `Act as a Principal Gambling Systems Architect (ex-bet365 / 1xBet). Build a high-throughput Live Cricket Sportsbook & Betting Exchange platform in React, Node.js, and PostgreSQL/Redis.

Core Sportsbook Architecture:
1. Live Odds Feeds & WebSocket Push:
   - Real-time in-play odds calculation with configurable house margin (overround 105%-108%).
   - Markets: 1X2 Match Winner, Ball-by-Ball Live In-Play (Dot, 1-2 Runs, Boundary 4, Maximum 6, Wicket), Over Totals (Over/Under 9.5), and Player Individual Runs.
   - Sub-100ms WebSocket binary broadcast (Protobuf/MessagePack) for odds updates to 50,000+ simultaneous clients.
2. Betslip & Risk Liability Engine:
   - Support Single Bets, Accumulator / Parlay / Multi-bets, and System bets with compound odds multiplication.
   - Server-side liability manager: Automatically freeze markets or adjust odds downward when one-sided heavy stake exposure is detected.
   - Live Cashout feature: Dynamically calculate fair cashout value during match play using Poisson/Monte-Carlo match projection models.
3. Financial Ledger & Indian Payments:
   - Double-entry bookkeeping in PostgreSQL with row-level locks ('SELECT FOR UPDATE') to guarantee zero balance discrepancies.
   - Instant UPI deposits and automated payouts via RazorpayX / Cashfree API with HMAC-SHA256 webhook signatures.
   - Strict Anti-Money Laundering (AML), device fingerprinting, and KYC verification tiering.`,
  },
  {
    id: 'master_aviator_crash',
    titleEn: '6. Aviator / Spribe Style Provably Fair Crash Multiplier Engine Prompt',
    titleHi: '6. एविएटर (Aviator) स्टाइल क्रैश गेम और प्रूवेबली फेयर प्रॉम्प्ट',
    category: 'Aviator Crash Game',
    descriptionEn: 'Prompt to build the iconic soaring curve multiplier crash game with provably fair cryptographic SHA-256 verification.',
    descriptionHi: 'Aviator की तरह 1.00x से 50.00x तक उड़ने वाला क्रैश गेम, ऑटो-कैशआउट और प्रूवेबली फेयर एल्गोरिदम का प्रॉम्प्ट।',
    promptText: `Act as a Casino Game Mathematical Engineer & Full-Stack Developer. Build an Aviator / Spribe-style Crash Multiplier Betting Game in React, HTML5 Canvas, and Node.js.

Key Mechanics & Cryptographic Fairness:
1. Multiplier Flying Curve & Canvas 60FPS Loop:
   - Smooth exponential curve: multiplier = e^(0.09 * t) running at 60fps on HTML5 Canvas with starfield/grid backdrop.
   - Real-time player cashout trigger: Player clicks "Cash Out" to claim [Stake * Current Multiplier] before the crash event.
   - Auto-Cashout feature: Player pre-selects target multiplier (e.g., 2.00x) with server-side authoritative auto-settlement.
2. 100% Provably Fair Cryptographic Algorithm:
   - Implement the industry standard Provably Fair RNG (HMAC-SHA512).
   - Server Seed generated beforehand and hashed with SHA-256 (shown to player before round begins).
   - Client Seed provided by player / first 3 betting players in the room.
   - Crash point formula: crash_multiplier = floor((100 * 2^32 - h) / (2^32 - h)) / 100 with a transparent 3% house edge.
   - Verification modal allowing players to cryptographically verify any past round's hash themselves.
3. Multiplayer Synchronization:
   - Redis Pub/Sub room synchronization broadcasting live bets, cashout ticks, and past round history bar to all room participants.`,
  },
];

export const PromptEngineeringStudio: React.FC<PromptStudioProps> = ({ language }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptPreset>(MASTER_PROMPTS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Architect State
  const [customQuery, setCustomQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateCustomPrompt = async () => {
    if (!customQuery.trim()) return;

    setIsGenerating(true);
    setGeneratedResult(null);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: customQuery,
          targetLanguage: language,
          mode: 'custom_game_prompt',
        }),
      });

      const data = await response.json();
      if (data.text) {
        setGeneratedResult(data.text);
      } else if (data.blueprint) {
        setGeneratedResult(data.blueprint.promptText);
      } else {
        setErrorMsg('Failed to generate response. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error contacting AI engine');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-100">
              {language === 'hinglish' ? 'मास्टर प्रॉम्प्ट लाइब्रेरी और AI प्रॉम्प्ट आर्किटेक्ट' : 'Master Prompt Studio & AI Prompt Architect'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {language === 'hinglish'
                ? 'इन तैयार प्रॉम्प्ट्स को कॉपी करके आप किसी भी AI कोडिंग टूल से पूरा बैटिंग गेम, एंटी-चीट बैकएंड और पेमेंट सिस्टम बनवा सकते हैं।'
                : 'Production-grade prompts tested and verified for developer engines, game architects, and AI generators.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Golden Master Prompts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider text-xs">
            {language === 'hinglish' ? '4 रेडी-टू-यूज मास्टर प्रॉम्प्ट्स' : '4 Production-Ready Master Prompts'}
          </h3>
          <span className="text-xs text-slate-400">One-click copy</span>
        </div>

        {/* Prompt Selection Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MASTER_PROMPTS.map((prompt) => {
            const isSelected = selectedPrompt.id === prompt.id;
            return (
              <button
                key={prompt.id}
                onClick={() => setSelectedPrompt(prompt)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="text-[10px] font-mono uppercase text-amber-400 mb-1">
                  {prompt.category}
                </div>
                <div className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">
                  {language === 'hinglish' ? prompt.titleHi : prompt.titleEn}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2">
                  {language === 'hinglish' ? prompt.descriptionHi : prompt.descriptionEn}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Master Prompt Code View */}
        <div className="bg-[#070b16] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 bg-[#0d1424] border-b border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-200">
                {language === 'hinglish' ? selectedPrompt.titleHi : selectedPrompt.titleEn}
              </span>
              <span className="text-xs text-slate-500 ml-2">({selectedPrompt.category})</span>
            </div>
            <button
              onClick={() => handleCopy(selectedPrompt.promptText, selectedPrompt.id)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 active:scale-95"
            >
              {copiedId === selectedPrompt.id ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'hinglish' ? 'कॉपी हो गया!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{language === 'hinglish' ? 'प्रॉम्प्ट कॉपी करें' : 'Copy Prompt'}</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-5 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-96">
            {selectedPrompt.promptText}
          </pre>
        </div>
      </div>

      {/* AI Prompt Architect with Thinking Mode */}
      <div className="bg-[#0a0f1d] border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-5 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-lg">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
              <span>{language === 'hinglish' ? 'AI प्रॉम्प्ट आर्किटेक्ट (हाई थिंकिंग मोड)' : 'AI Prompt Architect (High Thinking Mode)'}</span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/40">
                ThinkingLevel: HIGH
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hinglish'
                ? 'अपने मनपसंद नए फीचर (जैसे IPL नॉकआउट, ₹20 एंट्री, या स्पिनर बॉलिंग मशीन) को यहाँ लिखें। AI पूरा कोड प्रॉम्प्ट बनाकर देगा।'
                : 'Describe your custom cricket feature or monetization idea. Powered by Gemini with deep analytical reasoning.'}
            </p>
          </div>
        </div>

        {/* Input box */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder={
                language === 'hinglish'
                  ? 'उदाहरण: मुझे एक 100-प्लेयर का बैटिंग टूर्नामेंट बनाना है जिसमें ₹25 एंट्री फीस हो, पहले 3 बॉल पावरप्ले 2X रन दें, और अगर कोई नेटवर्क डिस्कनेक्ट करे तो 30 सेकंड में ऑटो-रिफंड हो जाए...'
                  : 'Example: Design an 8-player knockout cricket tournament with a ₹25 entry fee, powerplay over with 2X multiplier, and automatic disconnect escrow refund...'
              }
              className="w-full bg-[#060a14] border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/80 transition-all resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>
                {language === 'hinglish'
                  ? 'सरल भाषा में इनपुट दें, AI टेक्निकल आर्किटेक्चर खुद तैयार करेगा।'
                  : 'Zero jargon required: Enter plain text and receive production blueprints.'}
              </span>
            </div>

            <button
              onClick={handleGenerateCustomPrompt}
              disabled={isGenerating || !customQuery.trim()}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all ${
                isGenerating || !customQuery.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isGenerating
                  ? language === 'hinglish'
                    ? 'AI सोच रहा है (हाई थिंकिंग)...'
                    : 'Reasoning with High Thinking...'
                  : language === 'hinglish'
                  ? 'कस्टम प्रॉम्प्ट बनाएं'
                  : 'Generate Custom Prompt'}
              </span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Generated Result View */}
        {generatedResult && (
          <div className="bg-[#060a14] border border-emerald-500/40 rounded-xl overflow-hidden mt-4">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'hinglish' ? 'तैयार किया गया कस्टम प्रॉम्प्ट' : 'Generated Custom Blueprint'}</span>
              </span>
              <button
                onClick={() => handleCopy(generatedResult, 'custom_result')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-all flex items-center gap-1"
              >
                {copiedId === 'custom_result' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-200 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-80">
              {generatedResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
