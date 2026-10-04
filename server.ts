import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API: AI Prompt Architect & System Blueprint Generator with Thinking Mode
app.post('/api/ai/generate-prompt', async (req, res) => {
  try {
    const { userQuery, mode = 'full_architecture', targetLanguage = 'hinglish' } = req.body;

    if (!userQuery) {
      return res.status(400).json({ error: 'Missing prompt query' });
    }

    if (!ai) {
      return res.json({
        success: true,
        source: 'local-fallback',
        blueprint: {
          title: "Production Batting Engine & Realtime Infrastructure",
          summary: "Complete blueprint for real-time batting physics, cloud matchmaking, anti-cheat and monetization.",
          promptText: `Create a high-performance Real-Time Cricket Batting Game with realistic bowling physics (swing, seam, bounce, pace variations 120-155km/h). Build on HTML5 Canvas / PixiJS with 60fps server-authoritative reconciliation.\n\nKey Backend Requirements:\n1. WebSocket state sync (30Hz tick rate, Colyseus/Node.js or Go).\n2. Cloud Matchmaking with Redis ELO bucket queues and ping-based server routing.\n3. Anti-Cheat: Zero-trust client input (send only timestamp, swing vector, bat angle). Server recalculates ball-bat raycast collision.\n4. Monetization: Escrow cash wallet with Razorpay/Stripe HMAC webhooks + Rewarded Ads (Unity Ads/AdMob) with server-to-server (S2S) verification callback.\n5. Real-Time Leaderboards using Redis Sorted Sets (ZADD/ZREVRANGE).`,
          techStackRecommendations: [
            { layer: "Game Engine", tech: "HTML5 Canvas 2D / PixiJS (Web), Colyseus.io (Server)", reason: "Ultra-low latency, renders smoothly on low-end mobile devices without WebGL crashes." },
            { layer: "Matchmaking & Cache", tech: "Redis 7.x (Sorted Sets & Pub/Sub)", reason: "Sub-millisecond matchmaking queue grouping and instant global leaderboards." },
            { layer: "Ledger & Anti-Cheat DB", tech: "PostgreSQL with ACID Transactions + TimescaleDB", reason: "Zero balance discrepancies for real-money bets and high-velocity telemetry logs." },
            { layer: "Security & Transport", tech: "WSS with AES-256 + HMAC-SHA256 Token Session", reason: "Blocks packet injection, replay attacks, and memory inspection hacks." }
          ],
          antiCheatChecklist: [
            "Input-only network protocol (client never sends runs or hit outcome)",
            "Statistical anomaly detector for sub-millisecond bot reaction times (<15ms)",
            "Client heartbeat memory checksum against memory editors (GameGuardian, CheatEngine)",
            "Escrow lock prior to match start with automated refund on connection drop"
          ]
        }
      });
    }

    const systemInstruction = `You are a Principal Game Architect & Lead Multiplayer Systems Engineer specialized in high-performance competitive sports games and real-money gaming (RMG) platforms.
The user is asking questions or requesting prompts for building a complete Real-Time Cricket Batting Game website with realistic bowling physics, cloud matchmaking, anti-cheat, secure payment gateway, in-game rewarded ads, and global leaderboards.

Provide the response in simple, crystal-clear, intuitive language (clean Hindi/Hinglish or English based on user preference, avoid convoluted academic jargon).
Make sure to explain:
1. The exact end-to-end player flow (User sign-up -> Wallet escrow -> Cloud matchmaking -> Anti-cheat session -> Real-time batting gameplay -> Rewarded ads -> Instant settlement & Leaderboard).
2. The exact Golden Master Developer Prompt that they can copy-paste into an AI coding assistant (like Claude, Gemini, or Cursor) to build the game.
3. The recommended tech stack and why it prevents lag and hacks.
4. Return your output formatted cleanly.`;

    let generatedText = '';
    let thinkingDetails = '';

    try {
      // First attempt with gemini-3.1-pro-preview with thinkingLevel HIGH as instructed
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `User Query: ${userQuery}\nLanguage Preference: ${targetLanguage}\nMode: ${mode}`,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });
      generatedText = response.text || '';
    } catch (proError: any) {
      console.warn('Fallback to gemini-3.8-flash due to preview model constraint:', proError?.message);
      // Resilient fallback to gemini-3.8-flash
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `User Query: ${userQuery}\nLanguage Preference: ${targetLanguage}\nMode: ${mode}`,
        config: {
          systemInstruction,
        },
      });
      generatedText = fallbackResponse.text || '';
    }

    return res.json({
      success: true,
      text: generatedText,
      query: userQuery,
    });
  } catch (error: any) {
    console.error('API Error in /api/ai/generate-prompt:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// API: Simulated Server-Authoritative Matchmaking Queue
app.post('/api/matchmaking/find-match', (req, res) => {
  const { userId, username, playerMMR = 1250, stakeAmount = 50 } = req.body;

  // Realistic mock matchmaking delay simulation
  const opponents = [
    { id: 'opp_982', name: 'Kabir_SixMachine', mmr: playerMMR + 15, winRate: '68%', ping: '24ms', tier: 'Pro Challenger' },
    { id: 'opp_541', name: 'MasterBlaster_07', mmr: playerMMR - 10, winRate: '64%', ping: '31ms', tier: 'Elite Striker' },
    { id: 'opp_312', name: 'Aarav_YorkerKing', mmr: playerMMR + 25, winRate: '72%', ping: '19ms', tier: 'Grandmaster' },
    { id: 'opp_109', name: 'Rohan_PowerHitter', mmr: playerMMR - 5, winRate: '61%', ping: '28ms', tier: 'Elite Striker' }
  ];

  const matchedOpponent = opponents[Math.floor(Math.random() * opponents.length)];
  const roomId = `room_${Math.random().toString(36).substring(2, 9)}`;

  res.json({
    success: true,
    status: 'MATCHED',
    roomId,
    serverRegion: 'ap-south-mumbai-01',
    serverTickRate: '60Hz',
    escrowLocked: stakeAmount * 2, // Total pot
    stakePerPlayer: stakeAmount,
    opponent: matchedOpponent,
    antiCheatSessionToken: `ac_sec_${Buffer.from(roomId + Date.now()).toString('base64').substring(0, 16)}`,
    estimatedLatencyMs: parseInt(matchedOpponent.ping)
  });
});

// API: Anti-Cheat Trajectory & Swing Verification
app.post('/api/anticheat/verify-swing', (req, res) => {
  const { swingTimestamp, ballArrivalTimestamp, batAngle, shotType, clientReportedResult } = req.body;

  const deltaMs = Math.abs(swingTimestamp - ballArrivalTimestamp);

  // Server physics validation rules
  let verdict = 'VALID';
  let trustScore = 98;
  let flagReason = null;

  if (deltaMs < 1) {
    verdict = 'SUSPICIOUS_MACRO';
    trustScore = 45;
    flagReason = 'Sub-millisecond inhuman timing variance (<1ms). Possible auto-clicker/bot script.';
  } else if (deltaMs > 120 && clientReportedResult === 'SIX') {
    verdict = 'TAMPERING_DETECTED';
    trustScore = 15;
    flagReason = 'Late swing beyond physical hit window reported as boundary. Client packet rejected.';
  }

  res.json({
    verdict,
    trustScore,
    deltaMs: Math.round(deltaMs),
    serverReconciled: true,
    flagReason,
    antiReplayNonce: Date.now().toString(36)
  });
});

// API: Global Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const players = [
    { rank: 1, name: 'Virat_Thunder_18', rating: 2840, matches: 342, winRate: '74.2%', earnings: '₹142,500', trustBadge: 'Verified Clean' },
    { rank: 2, name: 'Sky_Scoop_Specialist', rating: 2790, matches: 310, winRate: '71.5%', earnings: '₹121,000', trustBadge: 'Verified Clean' },
    { rank: 3, name: 'Captain_Cool_07', rating: 2715, matches: 298, winRate: '69.8%', earnings: '₹98,400', trustBadge: 'Verified Clean' },
    { rank: 4, name: 'Boom_Boom_Strike', rating: 2650, matches: 265, winRate: '67.0%', earnings: '₹76,200', trustBadge: 'Verified Clean' },
    { rank: 5, name: 'Helicopter_Mahi', rating: 2590, matches: 240, winRate: '65.4%', earnings: '₹62,000', trustBadge: 'Verified Clean' },
    { rank: 6, name: 'PullShot_Master', rating: 2540, matches: 215, winRate: '64.1%', earnings: '₹51,800', trustBadge: 'Verified Clean' },
    { rank: 7, name: 'CoverDrive_King', rating: 2490, matches: 190, winRate: '62.8%', earnings: '₹43,500', trustBadge: 'Verified Clean' },
  ];

  res.json({ success: true, leaderboard: players, season: 'IPL Season 2026', totalActivePlayers: 28420 });
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CricStrike VIP Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
