import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, ShieldCheck, Zap, Award, Film, Activity, TrendingUp, AlertTriangle, Crosshair } from 'lucide-react';
import { DeliveryType, ShotType, ShotResult, ShotRecord, PlayerStats } from '../types';
import { playBatThwack, playCrowdCheer, playStumpsClatter, playCashChime, getSoundMuted, setSoundMuted } from '../utils/audio';

interface BattingCanvasProps {
  language: 'hinglish' | 'english';
  onAddScore?: (runs: number, shot: ShotRecord) => void;
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
}

const DELIVERY_PRESETS: { type: DeliveryType; nameEn: string; nameHi: string; speed: number; descEn: string; descHi: string }[] = [
  { type: 'FAST_OUTSWING', nameEn: '145 km/h Outswinger', nameHi: '145 km/h आउटस्विंग', speed: 145, descEn: 'Pitches on middle, shapes away late towards slip', descHi: 'मिडिल पर टप्पा खाकर बाहर की तरफ घूमेगी' },
  { type: 'TOE_CRUSHER_YORKER', nameEn: 'Toe-Crushing Yorker', nameHi: 'ब्लॉकहोल यॉर्कर', speed: 148, descEn: 'Direct at the base of leg/middle stump', descHi: 'सीधे जूतों पर और स्टंप्स की जड़ में' },
  { type: 'FAST_BOUNCER', nameEn: '142 km/h Sharp Bouncer', nameHi: 'शार्प बाउंसर', speed: 142, descEn: 'Pitches short, rears up to batsman helmet level', descHi: 'शॉर्ट पिच गेंद जो तेजी से छाती तक उठेगी' },
  { type: 'LEG_SPIN_SLIDER', nameEn: 'Leg-Spin Slider', nameHi: 'लेग स्पिन स्लाइडर', speed: 108, descEn: 'Drifts in, turns sharply away with high revs', descHi: 'हवा में ड्रिफ्ट और टप्पा खाकर तीखा टर्न' },
  { type: 'GOOGLY', nameEn: 'Mystery Googly', nameHi: 'मिस्ट्री गुगली', speed: 102, descEn: 'Disguised release, spins sharply into the right-hander', descHi: 'उल्टे हाथ का टर्न, बल्लेबाज के अंदर आएगी' },
  { type: 'KNUCKLE_SLOWER', nameEn: 'Deceptive Knuckleball', nameHi: 'धीमी नकल बॉल', speed: 112, descEn: 'No seam rotation, floats and dips suddenly', descHi: 'अचानक डिप करने वाली धीमी गेंद' },
];

export const BattingCanvasGame: React.FC<BattingCanvasProps> = ({
  language,
  playerStats,
  setPlayerStats,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Match & Inning State
  const [matchOver, setMatchOver] = useState(false);
  const [currentOverBalls, setCurrentOverBalls] = useState(0); // 0 to 6
  const [runsThisOver, setRunsThisOver] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [recentShots, setRecentShots] = useState<ShotRecord[]>([]);
  const [latestCommentary, setLatestCommentary] = useState<string>(
    language === 'hinglish'
      ? 'बॉलर रन-अप ले रहा है! तैयार हो जाओ स्ट्राइक पर।'
      : 'Bowler at the mark, ready to steam in. Get your eye in on strike!'
  );
  const [activeDelivery, setActiveDelivery] = useState<DeliveryType>('FAST_OUTSWING');
  const [currentSpeed, setCurrentSpeed] = useState<number>(145);

  // Physics Debugger Toggle State
  const [physicsDebugger, setPhysicsDebugger] = useState(true);

  // Ball & Bowling Animation State
  const [gameState, setGameState] = useState<'IDLE' | 'BOWLING' | 'BALL_HIT' | 'WICKET'>('IDLE');
  const [soundEnabled, setSoundEnabled] = useState(!getSoundMuted());

  // Timing Meter
  const [timingGauge, setTimingGauge] = useState(0); // 0 to 100
  const [timingFeedback, setTimingFeedback] = useState<{ text: string; color: string } | null>(null);

  // Rewarded Ad & Multiplier State
  const [showRewardedModal, setShowRewardedModal] = useState(false);
  const [rewardedBonusActive, setRewardedBonusActive] = useState(false);
  const [adWatchCountdown, setAdWatchCountdown] = useState(0);

  // Anti-cheat mock telemetry display
  const [antiCheatStatus, setAntiCheatStatus] = useState({
    latency: '24ms',
    jitter: '1.2ms',
    serverVerified: true,
    timingDeltaMs: 0,
    raycastConfirmed: true,
  });

  // Sound toggle handler
  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    setSoundMuted(!newState);
  };

  // Ball physics internal state ref
  const ballRef = useRef({
    z: 0, // 0 = bowler release, 1000 = batting crease
    x: 0, // -150 to 150 (horizontal lateral offset)
    y: 120, // 0 = ground, 120 = release height
    vx: 0,
    vy: -2,
    vz: 16,
    speedKmph: 145,
    bounced: false,
    bounceZ: 620,
    active: false,
    delivery: 'FAST_OUTSWING' as DeliveryType,
    swingAcc: 0.08,
    hitTraj: null as null | {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      distance: number;
      angle: number;
    },
    batsmanSwing: false,
    batAngle: 0,
    pitchHitSpot: null as null | { x: number; z: number },
    trailPoints: [] as { screenX: number; screenY: number; z: number; vx: number; vy: number; vz: number }[],
  });

  // Start delivery
  const bowlDelivery = useCallback((deliveryType?: DeliveryType) => {
    if (gameState === 'BOWLING' || matchOver) return;

    const chosen = deliveryType || activeDelivery;
    const preset = DELIVERY_PRESETS.find((p) => p.type === chosen) || DELIVERY_PRESETS[0];

    // Speed calculation
    const baseSpeed = preset.speed;
    const variance = (Math.random() - 0.5) * 4;
    const finalSpeed = Math.round(baseSpeed + variance);
    setCurrentSpeed(finalSpeed);

    // Physics parameters based on delivery
    let bounceZ = 620;
    let swingAcc = 0;
    let initialX = (Math.random() - 0.5) * 10;
    let initialY = 130;
    let vz = (finalSpeed / 140) * 16.5;

    if (chosen === 'FAST_OUTSWING') {
      bounceZ = 640;
      swingAcc = 0.09; // swings late to off-side
    } else if (chosen === 'TOE_CRUSHER_YORKER') {
      bounceZ = 920; // right at batsman feet
      swingAcc = -0.02;
    } else if (chosen === 'FAST_BOUNCER') {
      bounceZ = 430; // short pitch
      swingAcc = 0.01;
    } else if (chosen === 'LEG_SPIN_SLIDER') {
      bounceZ = 680;
      swingAcc = 0.12;
      vz = 11.5;
    } else if (chosen === 'GOOGLY') {
      bounceZ = 670;
      swingAcc = -0.11; // cuts back into right-hander
      vz = 10.8;
    } else if (chosen === 'KNUCKLE_SLOWER') {
      bounceZ = 700;
      swingAcc = 0.03;
      vz = 11.2;
    }

    ballRef.current = {
      z: 0,
      x: initialX,
      y: initialY,
      vx: 0,
      vy: -1.2,
      vz,
      speedKmph: finalSpeed,
      bounced: false,
      bounceZ,
      active: true,
      delivery: chosen,
      swingAcc,
      hitTraj: null,
      batsmanSwing: false,
      batAngle: 0,
      pitchHitSpot: null,
      trailPoints: [],
    };

    setGameState('BOWLING');
    setTimingGauge(0);
    setTimingFeedback(null);
  }, [activeDelivery, gameState, matchOver]);

  // Execute batsman shot
  const playShot = (shotType: ShotType) => {
    if (gameState !== 'BOWLING' || !ballRef.current.active) return;

    const ball = ballRef.current;
    const currentZ = ball.z;
    const optimalZ = 890; // ideal contact point
    const delta = currentZ - optimalZ;
    const deltaMs = Math.round(Math.abs(delta) * 1.8);

    ball.batsmanSwing = true;

    // Sweet spot detection
    let timing: 'PERFECT' | 'EARLY' | 'LATE' = 'PERFECT';
    let runs = 0;
    let result: ShotResult = 'DOT';
    let commentary = '';
    let wagonAngle = 0;
    let distance = 0;

    // Angle configuration per shot
    if (shotType === 'COVER_DRIVE') wagonAngle = 135;
    else if (shotType === 'STRAIGHT_LOFT') wagonAngle = 90;
    else if (shotType === 'PULL_SHOT') wagonAngle = 35;
    else if (shotType === 'HELICOPTER') wagonAngle = 70;
    else if (shotType === 'LATE_CUT') wagonAngle = 160;
    else if (shotType === 'DEFENSIVE') wagonAngle = 95;

    // Anti-cheat verification simulation
    setAntiCheatStatus({
      latency: `${Math.floor(20 + Math.random() * 10)}ms`,
      jitter: `${(0.8 + Math.random() * 0.8).toFixed(1)}ms`,
      serverVerified: true,
      timingDeltaMs: deltaMs,
      raycastConfirmed: true,
    });

    if (Math.abs(delta) <= 45) {
      // PERFECT TIMING
      timing = 'PERFECT';
      setTimingFeedback({ text: language === 'hinglish' ? 'शानदार टाइमिंग! (PERFECT)' : 'SWEET SPOT! PERFECT', color: 'text-emerald-400' });
      playBatThwack(1.2);
      playCrowdCheer();

      if (shotType === 'HELICOPTER' || shotType === 'STRAIGHT_LOFT') {
        runs = 6;
        result = 'SIX';
        distance = Math.round(92 + Math.random() * 20);
        commentary = language === 'hinglish'
          ? `गगनचुंबी छक्का! ${distance}m दूर स्टेडियम की दूसरी मंजिल पर!`
          : `MASSIVE SIX! Launched ${distance}m into the top tier!`;
      } else if (shotType === 'COVER_DRIVE' || shotType === 'PULL_SHOT') {
        runs = 4;
        result = 'FOUR';
        distance = Math.round(75 + Math.random() * 12);
        commentary = language === 'hinglish'
          ? `खूबसूरत चौका! फील्डर के पास कोई मौका नहीं था।`
          : `CLASSIC BOUNDARY! Pierced the gap with pure elegance!`;
      } else if (shotType === 'LATE_CUT') {
        runs = 4;
        result = 'FOUR';
        distance = 68;
        commentary = language === 'hinglish'
          ? `चतुराई भरा लेट कट! गेंद सीधे बाउंड्री पार गई।`
          : `Deft late cut! Guided neatly past third man for four!`;
      } else {
        runs = 1;
        result = 'SINGLE';
        distance = 25;
        commentary = language === 'hinglish' ? `गेंद को रोका और तेजी से 1 रन चुराया।` : `Solid defense, nudged into the gap for a quick single.`;
      }
    } else if (delta < -45 && delta > -110) {
      // EARLY SWING
      timing = 'EARLY';
      setTimingFeedback({ text: language === 'hinglish' ? 'थोड़ा जल्दी बल्ला चला (EARLY)' : 'EARLY ON THE SHOT', color: 'text-amber-400' });
      playBatThwack(0.7);

      if (Math.random() > 0.4) {
        runs = 1;
        result = 'SINGLE';
        distance = 32;
        commentary = language === 'hinglish' ? `जल्दी खेल बैठे, लीडिंग एज से 1 रन मिला।` : `Through the shot early, mistimed leading edge for one.`;
      } else {
        runs = 0;
        result = 'DOT';
        distance = 18;
        commentary = language === 'hinglish' ? `टाइमिंग मिस हुई, सीधे फील्डर के हाथ में गेंद।` : `Mistimed, straight to the cover fielder for no run.`;
      }
    } else if (delta > 45 && delta < 110) {
      // LATE SWING
      timing = 'LATE';
      setTimingFeedback({ text: language === 'hinglish' ? 'देरी से बल्ला आया (LATE)' : 'LATE SWING', color: 'text-orange-400' });
      playBatThwack(0.6);

      if (Math.random() > 0.5) {
        runs = 2;
        result = 'DOUBLE';
        distance = 45;
        commentary = language === 'hinglish' ? `इनसाइड एज लगा और 2 रन चुराए।` : `Squirted off the inside edge to fine leg, scamper for two.`;
      } else {
        runs = 0;
        result = 'DOT';
        distance = 15;
        commentary = language === 'hinglish' ? `पूरी तरह बीट हुए, गेंद विकेटकीपर के पास गई।` : `Beaten for pace, ball thuds into keeper gloves.`;
      }
    } else {
      // COMPLETE MISS - WICKET OR DOT
      if (Math.abs(ball.x) < 30 && ball.y < 90) {
        // Stumps hit
        playStumpsClatter();
        result = 'BOWLED';
        runs = 0;
        distance = 0;
        setTimingFeedback({ text: language === 'hinglish' ? 'बोल्ड! स्टंप्स उड़ गए' : 'CLEAN BOWLED!', color: 'text-red-400' });
        commentary = language === 'hinglish'
          ? `क्लीन बोल्ड! बैट और पैड के बीच से स्टंप्स बिखर गए!`
          : `CLEAN BOWLED! Knocked all three poles out of the ground!`;
        setWickets((w) => w + 1);
      } else {
        runs = 0;
        result = 'DOT';
        distance = 0;
        setTimingFeedback({ text: language === 'hinglish' ? 'मिस हुआ (DOT)' : 'PLAYED & MISSED', color: 'text-slate-400' });
        commentary = language === 'hinglish'
          ? `बल्ला गेंद से काफी दूर रहा, कोई रन नहीं।`
          : `Swung across the line and missed it completely.`;
      }
    }

    // Apply Rewarded Video Bonus if active
    let awardedRuns = runs;
    if (rewardedBonusActive && runs > 0) {
      awardedRuns = runs * 2;
      commentary += language === 'hinglish' ? ' (2X बोनस रिवार्ड लागू!)' : ' (2X Reward Multiplier Applied!)';
    }

    // Set ball hit flight
    if (runs > 0 || (result !== 'BOWLED' && distance > 0)) {
      setGameState('BALL_HIT');
      ball.hitTraj = {
        x: ball.x,
        y: ball.y,
        z: ball.z,
        vx: ((wagonAngle - 90) / 45) * 4,
        vy: runs >= 4 ? 6 : 2.5,
        vz: runs === 6 ? -14 : -9,
        distance,
        angle: wagonAngle,
      };
    } else if (result === 'BOWLED') {
      setGameState('WICKET');
    } else {
      setGameState('IDLE');
    }

    // Record shot
    const newRecord: ShotRecord = {
      ballNumber: currentOverBalls + 1,
      deliveryType: ball.delivery,
      speedKmph: ball.speedKmph,
      shotType,
      timing,
      timingDeltaMs: deltaMs,
      result,
      runs: awardedRuns,
      distanceMeters: distance,
      wagonAngleDeg: wagonAngle,
      commentary,
    };

    setRecentShots((prev) => [newRecord, ...prev]);
    setLatestCommentary(commentary);
    setRunsThisOver((r) => r + awardedRuns);

    // Update global player stats
    setPlayerStats((prev) => {
      const newRuns = prev.totalRuns + awardedRuns;
      const newMatches = currentOverBalls === 5 ? prev.matchesPlayed + 1 : prev.matchesPlayed;
      return {
        ...prev,
        totalRuns: newRuns,
        fours: result === 'FOUR' ? prev.fours + 1 : prev.fours,
        sixes: result === 'SIX' ? prev.sixes + 1 : prev.sixes,
        highestScore: Math.max(prev.highestScore, runsThisOver + awardedRuns),
        strikeRate: Math.round(((newRuns) / Math.max(1, (prev.matchesPlayed * 6 + currentOverBalls + 1))) * 100),
        walletBalance: prev.walletBalance + (awardedRuns * 5),
        matchesPlayed: newMatches,
      };
    });

    const nextBall = currentOverBalls + 1;
    setCurrentOverBalls(nextBall);

    if (nextBall >= 6) {
      setMatchOver(true);
      playCashChime();
    }
  };

  // Canvas render and physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw Night Stadium Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#040711');
      skyGrad.addColorStop(0.35, '#081220');
      skyGrad.addColorStop(0.65, '#062016');
      skyGrad.addColorStop(1, '#091c13');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Stadium floodlights & ambient glow
      const drawFloodlight = (x: number, y: number) => {
        const glow = ctx.createRadialGradient(x, y, 5, x, y, 160);
        glow.addColorStop(0, 'rgba(255, 235, 180, 0.45)');
        glow.addColorStop(0.3, 'rgba(245, 158, 11, 0.15)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 160, 0, Math.PI * 2);
        ctx.fill();

        // Tower framework
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x - 12, y - 6, 24, 12);
        ctx.fillStyle = '#fef08a';
        for (let i = -10; i <= 10; i += 5) {
          ctx.beginPath();
          ctx.arc(x + i, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      drawFloodlight(width * 0.18, height * 0.18);
      drawFloodlight(width * 0.82, height * 0.18);

      // Distant crowd silhouette
      ctx.fillStyle = '#060d15';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.45);
      for (let x = 0; x <= width; x += 15) {
        const yOffset = Math.sin(x * 0.05) * 4;
        ctx.lineTo(x, height * 0.42 + yOffset);
      }
      ctx.lineTo(width, height * 0.52);
      ctx.lineTo(0, height * 0.52);
      ctx.fill();

      // Circular boundary rope line
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.ellipse(width * 0.5, height * 0.52, width * 0.45, height * 0.15, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. 3D Perspective Cricket Turf Pitch
      const pitchFarY = height * 0.48;
      const pitchNearY = height * 0.94;
      const pitchFarW = width * 0.14;
      const pitchNearW = width * 0.52;
      const centerX = width * 0.5;

      // Outer outfield grass
      const outfieldGrad = ctx.createLinearGradient(0, pitchFarY, 0, height);
      outfieldGrad.addColorStop(0, '#06291a');
      outfieldGrad.addColorStop(1, '#03190e');
      ctx.fillStyle = outfieldGrad;
      ctx.beginPath();
      ctx.moveTo(0, pitchFarY);
      ctx.lineTo(width, pitchFarY);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Pitch strip (clay and turf texture)
      const pitchGrad = ctx.createLinearGradient(0, pitchFarY, 0, pitchNearY);
      pitchGrad.addColorStop(0, '#53432b');
      pitchGrad.addColorStop(0.5, '#735c3c');
      pitchGrad.addColorStop(1, '#8b6f47');
      ctx.fillStyle = pitchGrad;

      ctx.beginPath();
      ctx.moveTo(centerX - pitchFarW / 2, pitchFarY);
      ctx.lineTo(centerX + pitchFarW / 2, pitchFarY);
      ctx.lineTo(centerX + pitchNearW / 2, pitchNearY);
      ctx.lineTo(centerX - pitchNearW / 2, pitchNearY);
      ctx.closePath();
      ctx.fill();

      // Pitch borders
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Popping crease (white line at batsman end)
      const creaseY = pitchNearY - (pitchNearY - pitchFarY) * 0.12;
      const creaseW = pitchNearW * 0.85;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX - creaseW / 2, creaseY);
      ctx.lineTo(centerX + creaseW / 2, creaseY);
      ctx.stroke();

      // Bowling crease at far end
      const bowlingCreaseY = pitchFarY + (pitchNearY - pitchFarY) * 0.08;
      const bowlingCreaseW = pitchFarW * 0.9;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - bowlingCreaseW / 2, bowlingCreaseY);
      ctx.lineTo(centerX + bowlingCreaseW / 2, bowlingCreaseY);
      ctx.stroke();

      // 3. Stumps at batsman end
      const stumpX = centerX;
      const stumpY = creaseY - 5;
      const stumpHeight = 44;
      ctx.fillStyle = '#fef08a';
      // 3 stumps
      [-8, 0, 8].forEach((offset) => {
        ctx.fillRect(stumpX + offset - 1.5, stumpY - stumpHeight, 3, stumpHeight);
      });
      // Bails on top
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(stumpX - 10, stumpY - stumpHeight - 2, 20, 3);

      // 4. Bowler at Far End
      const bowlerY = pitchFarY - 14;
      ctx.fillStyle = '#10b981';
      // Bowler head
      ctx.beginPath();
      ctx.arc(centerX, bowlerY - 20, 5, 0, Math.PI * 2);
      ctx.fill();
      // Bowler torso
      ctx.fillRect(centerX - 4, bowlerY - 15, 8, 14);

      // 5. Ball Physics Simulation Loop
      const ball = ballRef.current;

      if (ball.active && gameState === 'BOWLING') {
        // Advance z towards batsman
        ball.z += ball.vz;

        // Apply swing acceleration after release
        if (ball.z > 200) {
          ball.x += ball.swingAcc * (ball.z / 100);
        }

        // Gravity and bounce
        ball.y += ball.vy;
        ball.vy -= 0.16; // gravity

        // Check pitch bounce
        if (ball.z >= ball.bounceZ && !ball.bounced) {
          ball.bounced = true;
          ball.vy = Math.abs(ball.vy) * 0.64; // restitution
          ball.pitchHitSpot = { x: ball.x, z: ball.z };
        }

        // Update timing meter progress
        const timingProgress = Math.min(100, Math.max(0, (ball.z / 1000) * 100));
        setTimingGauge(timingProgress);

        // Check if ball passed batsman without shot
        if (ball.z >= 1040) {
          ball.active = false;
          // Determine missed outcome
          if (Math.abs(ball.x) < 20 && ball.y < 80) {
            playStumpsClatter();
            setGameState('WICKET');
            setWickets((w) => w + 1);
            setTimingFeedback({ text: language === 'hinglish' ? 'बोल्ड! गेंद स्टंप्स में लगी' : 'CLEAN BOWLED!', color: 'text-red-400' });
            setLatestCommentary(language === 'hinglish' ? 'पूरी तरह चूके! गेंद सीधे स्टंप्स से जा टकराई!' : 'Completely beaten! Timber rattled!');
          } else {
            setGameState('IDLE');
            setTimingFeedback({ text: language === 'hinglish' ? 'डॉट बॉल' : 'DOT BALL', color: 'text-slate-400' });
            setLatestCommentary(language === 'hinglish' ? 'अच्छी लाइन, विकेटकीपर के दस्तानों में।' : 'Clean take by the keeper.');
          }

          setCurrentOverBalls((b) => {
            const next = b + 1;
            if (next >= 6) setMatchOver(true);
            return next;
          });
        }
      }

      // 6. Draw Ball on Pitch
      if (ball.active && ball.z <= 1040) {
        // 3D projection
        const progress = Math.min(1, ball.z / 1000);
        const screenY = pitchFarY + (pitchNearY - pitchFarY) * progress - ball.y * (0.15 + progress * 0.35);
        const pitchWidthAtZ = pitchFarW + (pitchNearW - pitchFarW) * progress;
        const screenX = centerX + (ball.x / 100) * (pitchWidthAtZ * 0.5);
        const ballRadius = 3 + progress * 7;

        // Record trajectory trail points for physics debugger
        if (ball.trailPoints.length === 0 || Math.hypot(screenX - ball.trailPoints[ball.trailPoints.length - 1].screenX, screenY - ball.trailPoints[ball.trailPoints.length - 1].screenY) > 5) {
          ball.trailPoints.push({ screenX, screenY, z: ball.z, vx: ball.vx, vy: ball.vy, vz: ball.vz });
        }

        // Ball shadow on turf
        const shadowY = pitchFarY + (pitchNearY - pitchFarY) * progress;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(screenX, shadowY, ballRadius * 1.1, ballRadius * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Leather Cricket Ball with seam
        const ballGrad = ctx.createRadialGradient(
          screenX - ballRadius * 0.3,
          screenY - ballRadius * 0.3,
          1,
          screenX,
          screenY,
          ballRadius
        );
        ballGrad.addColorStop(0, '#ff4d4d');
        ballGrad.addColorStop(0.7, '#c51616');
        ballGrad.addColorStop(1, '#660505');
        ctx.fillStyle = ballGrad;

        ctx.beginPath();
        ctx.arc(screenX, screenY, ballRadius, 0, Math.PI * 2);
        ctx.fill();

        // Golden seam stitch lines
        ctx.strokeStyle = 'rgba(255, 235, 170, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(screenX, screenY, ballRadius * 0.85, 0.2, Math.PI * 0.85);
        ctx.stroke();

        // Speed radar indicator above ball (when debugger is off)
        if (!physicsDebugger && progress > 0.25 && progress < 0.75) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
          ctx.fillRect(screenX - 25, screenY - ballRadius - 20, 50, 14);
          ctx.fillStyle = '#fbbf24';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${ball.speedKmph}kph`, screenX, screenY - ballRadius - 9);
        }
      }

      // ==========================================
      // REAL-TIME PHYSICS DEBUGGER OVERLAYS
      // ==========================================
      if (physicsDebugger) {
        // 1. COLLISION HITBOX: Stumps Target Zone
        const stumpBoxW = 34;
        const stumpBoxH = 55;
        const inStumpDanger = ball.active && Math.abs(ball.x) < 22 && ball.y < 85 && ball.z > 680;

        ctx.save();
        ctx.strokeStyle = inStumpDanger ? '#ef4444' : 'rgba(239, 68, 68, 0.75)';
        ctx.lineWidth = inStumpDanger ? 2.5 : 1.5;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(stumpX - stumpBoxW / 2, stumpY - stumpBoxH, stumpBoxW, stumpBoxH);
        ctx.fillStyle = inStumpDanger ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.12)';
        ctx.fillRect(stumpX - stumpBoxW / 2, stumpY - stumpBoxH, stumpBoxW, stumpBoxH);
        ctx.setLineDash([]);

        // Stumps corner crosshairs
        const ch = 5;
        ctx.strokeStyle = inStumpDanger ? '#f87171' : '#fca5a5';
        ctx.lineWidth = 1.5;
        // top-left corner
        ctx.beginPath();
        ctx.moveTo(stumpX - stumpBoxW / 2 - 2, stumpY - stumpBoxH + ch);
        ctx.lineTo(stumpX - stumpBoxW / 2 - 2, stumpY - stumpBoxH - 2);
        ctx.lineTo(stumpX - stumpBoxW / 2 + ch, stumpY - stumpBoxH - 2);
        // top-right corner
        ctx.moveTo(stumpX + stumpBoxW / 2 + 2, stumpY - stumpBoxH + ch);
        ctx.lineTo(stumpX + stumpBoxW / 2 + 2, stumpY - stumpBoxH - 2);
        ctx.lineTo(stumpX + stumpBoxW / 2 - ch, stumpY - stumpBoxH - 2);
        ctx.stroke();

        ctx.fillStyle = inStumpDanger ? '#ef4444' : 'rgba(248, 113, 113, 0.9)';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          inStumpDanger ? '⚠️ COLLISION IMMINENT: BOWLED' : '[HITBOX: STUMPS 34x55]',
          stumpX,
          stumpY - stumpBoxH - 5
        );
        ctx.restore();

        // 2. COLLISION HITBOX: Batsman Sweet Spot 3D Volume (Z: 840 to 940)
        const zStart = 840;
        const zEnd = 940;
        const p1 = zStart / 1000;
        const p2 = zEnd / 1000;
        const ySweet1 = pitchFarY + (pitchNearY - pitchFarY) * p1 - 8;
        const ySweet2 = pitchFarY + (pitchNearY - pitchFarY) * p2 - 8;
        const wSweet1 = pitchFarW + (pitchNearW - pitchFarW) * p1 * 0.72;
        const wSweet2 = pitchFarW + (pitchNearW - pitchFarW) * p2 * 0.72;
        const inSweetSpot = ball.active && ball.z >= zStart && ball.z <= zEnd;

        ctx.save();
        // Ground footprint of sweet spot
        ctx.fillStyle = inSweetSpot ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.12)';
        ctx.strokeStyle = inSweetSpot ? '#34d399' : 'rgba(16, 185, 129, 0.65)';
        ctx.lineWidth = inSweetSpot ? 2 : 1.2;
        ctx.setLineDash([5, 4]);

        ctx.beginPath();
        ctx.moveTo(centerX - wSweet1 / 2, ySweet1);
        ctx.lineTo(centerX + wSweet1 / 2, ySweet1);
        ctx.lineTo(centerX + wSweet2 / 2, ySweet2);
        ctx.lineTo(centerX - wSweet2 / 2, ySweet2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 3D vertical elevation prism
        const sweetHeight = 72;
        ctx.strokeStyle = inSweetSpot ? '#10b981' : 'rgba(52, 211, 153, 0.45)';
        ctx.strokeRect(centerX - wSweet2 / 2, ySweet2 - sweetHeight, wSweet2, sweetHeight);
        ctx.setLineDash([]);

        ctx.fillStyle = inSweetSpot ? '#34d399' : '#10b981';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          inSweetSpot ? '>>> SWEET SPOT INTERSECT (±45ms ACTIVE) <<<' : '[SWEET SPOT VOLUME Z:840-940]',
          centerX,
          ySweet2 - sweetHeight - 6
        );
        ctx.restore();

        // 3. PITCH BOUNCE SPOT TARGET RETICLE
        const bounceP = Math.min(1, ball.bounceZ / 1000);
        const bounceScreenY = pitchFarY + (pitchNearY - pitchFarY) * bounceP;
        const bouncePitchW = pitchFarW + (pitchNearW - pitchFarW) * bounceP;
        const bounceScreenX = centerX + (ball.x / 100) * (bouncePitchW * 0.5);

        ctx.save();
        ctx.strokeStyle = ball.bounced ? '#38bdf8' : '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(bounceScreenX, bounceScreenY, 13, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(bounceScreenX, bounceScreenY, 5, 0, Math.PI * 2);
        ctx.stroke();
        // Crosshair ticks
        ctx.beginPath();
        ctx.moveTo(bounceScreenX - 17, bounceScreenY);
        ctx.lineTo(bounceScreenX + 17, bounceScreenY);
        ctx.moveTo(bounceScreenX, bounceScreenY - 17);
        ctx.lineTo(bounceScreenX, bounceScreenY + 17);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = ball.bounced ? '#38bdf8' : '#fbbf24';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          ball.bounced ? `BOUNCE HIT: Z=${ball.bounceZ} (e=0.64)` : `PREDICTED BOUNCE: Z=${ball.bounceZ}`,
          bounceScreenX,
          bounceScreenY + 22
        );
        ctx.restore();

        // 4. HISTORICAL TRAJECTORY TRAIL & VERTEX NODES
        if (ball.trailPoints && ball.trailPoints.length > 1) {
          ctx.save();
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ball.trailPoints[0].screenX, ball.trailPoints[0].screenY);
          for (let i = 1; i < ball.trailPoints.length; i++) {
            ctx.lineTo(ball.trailPoints[i].screenX, ball.trailPoints[i].screenY);
          }
          ctx.stroke();

          // Vertex dots along trajectory
          ctx.fillStyle = '#22d3ee';
          for (let i = 0; i < ball.trailPoints.length; i += 2) {
            ctx.beginPath();
            ctx.arc(ball.trailPoints[i].screenX, ball.trailPoints[i].screenY, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // 5. VELOCITY & MAGNUS SWING VECTORS AT CURRENT BALL POSITION
        if (ball.active && ball.z <= 1040) {
          const bProgress = Math.min(1, ball.z / 1000);
          const curY = pitchFarY + (pitchNearY - pitchFarY) * bProgress - ball.y * (0.15 + bProgress * 0.35);
          const curPitchW = pitchFarW + (pitchNearW - pitchFarW) * bProgress;
          const curX = centerX + (ball.x / 100) * (curPitchW * 0.5);

          ctx.save();
          // Velocity Vector Arrow V
          const vLen = Math.min(52, Math.max(22, (ball.speedKmph / 140) * 36));
          const vAngle = Math.atan2((pitchNearY - pitchFarY) * (ball.vz / 1000) - ball.vy * 0.25, (ball.vx / 100) * (pitchNearW * 0.5));
          const tipX = curX + Math.cos(vAngle) * vLen;
          const tipY = curY + Math.sin(vAngle) * vLen;

          // Velocity vector shaft
          ctx.strokeStyle = '#38bdf8';
          ctx.fillStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(curX, curY);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();

          // Arrowhead
          const hLen = 7;
          ctx.beginPath();
          ctx.moveTo(tipX, tipY);
          ctx.lineTo(tipX - hLen * Math.cos(vAngle - Math.PI / 6), tipY - hLen * Math.sin(vAngle - Math.PI / 6));
          ctx.lineTo(tipX - hLen * Math.cos(vAngle + Math.PI / 6), tipY - hLen * Math.sin(vAngle + Math.PI / 6));
          ctx.closePath();
          ctx.fill();

          // Velocity vector label
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`v⃗ [${ball.speedKmph}kph]`, tipX + 5, tipY - 2);

          // Lateral Magnus Swing Acceleration Vector (Amber arrow)
          if (Math.abs(ball.swingAcc) > 0.005) {
            const swingLen = ball.swingAcc * 190;
            ctx.strokeStyle = '#f59e0b';
            ctx.fillStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(curX, curY);
            ctx.lineTo(curX + swingLen, curY);
            ctx.stroke();

            // Swing arrowhead
            const sDir = swingLen > 0 ? 1 : -1;
            ctx.beginPath();
            ctx.moveTo(curX + swingLen, curY);
            ctx.lineTo(curX + swingLen - sDir * 5, curY - 4);
            ctx.lineTo(curX + swingLen - sDir * 5, curY + 4);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#f59e0b';
            ctx.font = '8px monospace';
            ctx.textAlign = swingLen > 0 ? 'left' : 'right';
            ctx.fillText(
              `a_swing: ${ball.swingAcc > 0 ? '+' : ''}${ball.swingAcc.toFixed(2)}m/s²`,
              curX + swingLen + (swingLen > 0 ? 6 : -6),
              curY - 3
            );
          }
          ctx.restore();
        }

        // 6. ON-CANVAS REAL-TIME PHYSICS ENGINE TELEMETRY PANEL (Top-Right)
        ctx.save();
        const hudW = 215;
        const hudH = 118;
        const hudX = width - hudW - 14;
        const hudY = 14;

        ctx.fillStyle = 'rgba(6, 11, 23, 0.9)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(hudX, hudY, hudW, hudH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('⚡ PHYSICS ENGINE 60Hz', hudX + 10, hudY + 16);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px monospace';
        ctx.fillText(
          `POS : X:${ball.x > 0 ? '+' : ''}${ball.x.toFixed(1)} Y:${ball.y.toFixed(1)} Z:${Math.round(ball.z)}/1000`,
          hudX + 10,
          hudY + 34
        );
        ctx.fillText(
          `VEL : Vx:${ball.vx.toFixed(2)} Vy:${ball.vy.toFixed(2)} Vz:${ball.vz.toFixed(1)}`,
          hudX + 10,
          hudY + 49
        );
        ctx.fillText(
          `SPEED: ${ball.speedKmph} km/h (${(ball.speedKmph * 0.2778).toFixed(1)} m/s)`,
          hudX + 10,
          hudY + 64
        );
        ctx.fillText(
          `BOUNCE: Z=${ball.bounceZ} (${ball.bounced ? 'BOUNCED' : 'AIRBORNE'})`,
          hudX + 10,
          hudY + 79
        );

        let collisionStatus = 'IN FLIGHT (AIR)';
        let statusColor = '#38bdf8';
        if (ball.z >= 840 && ball.z <= 940) {
          collisionStatus = 'SWEET SPOT INTERSECT';
          statusColor = '#10b981';
        } else if (ball.z > 680 && Math.abs(ball.x) < 22 && ball.y < 85) {
          collisionStatus = 'STUMPS COLLISION PATH';
          statusColor = '#ef4444';
        } else if (ball.bounced) {
          collisionStatus = 'PITCH REBOUND (e=0.64)';
          statusColor = '#fbbf24';
        }

        ctx.fillStyle = statusColor;
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`STATUS: ${collisionStatus}`, hudX + 10, hudY + 98);
        ctx.restore();
      }

      // 7. Hit Flight Trajectory
      if (gameState === 'BALL_HIT' && ball.hitTraj) {
        const traj = ball.hitTraj;
        traj.x += traj.vx;
        traj.y += traj.vy;
        traj.vy -= 0.2; // gravity on fly
        traj.z += traj.vz;

        const screenX = centerX + traj.x * 2.5;
        const screenY = creaseY - traj.y * 2.2;
        const radius = Math.max(3, 10 - (traj.z * -0.01));

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.min(14, radius), 0, Math.PI * 2);
        ctx.fill();

        // Trail glow
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, creaseY - 20);
        ctx.lineTo(screenX, screenY);
        ctx.stroke();

        if (screenY > height || traj.y < -50) {
          setGameState('IDLE');
        }
      }

      // 8. Batsman Avatar & Willow Bat (Positioned at Crease)
      const batY = creaseY - 10;
      const batsmanX = centerX - 30;

      // Batsman body
      ctx.fillStyle = '#0284c7'; // Jersey
      ctx.fillRect(batsmanX - 8, batY - 50, 16, 30);
      // Helmet
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(batsmanX, batY - 60, 9, 0, Math.PI * 2);
      ctx.fill();
      // Pads & boots
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(batsmanX - 7, batY - 20, 6, 20);
      ctx.fillRect(batsmanX + 1, batY - 20, 6, 20);

      // Cricket Bat
      ctx.save();
      ctx.translate(batsmanX + 10, batY - 25);
      if (ball.batsmanSwing) {
        ctx.rotate(0.6); // swing follow through
      } else {
        ctx.rotate(-0.35); // backlift stance
      }
      // Bat blade (English Willow color)
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(0, -25, 8, 38);
      // Bat grip
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(2, -37, 4, 12);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState, language, physicsDebugger]);

  // Keyboard shortcut listener for batting & debugger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle physics debugger on KeyP or KeyX anytime
      if (e.code === 'KeyP' || e.code === 'KeyX') {
        setPhysicsDebugger((prev) => !prev);
        return;
      }

      if (gameState !== 'BOWLING') {
        if (e.code === 'KeyB' || e.code === 'Enter') {
          bowlDelivery();
        }
        return;
      }
      if (e.code === 'KeyA') playShot('COVER_DRIVE');
      else if (e.code === 'KeyW') playShot('STRAIGHT_LOFT');
      else if (e.code === 'KeyD') playShot('PULL_SHOT');
      else if (e.code === 'KeyS') playShot('LATE_CUT');
      else if (e.code === 'Space') playShot('HELICOPTER');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, bowlDelivery]);

  // Rewarded Ad Simulation
  const triggerRewardedAd = () => {
    setShowRewardedModal(true);
    setAdWatchCountdown(5);

    const timer = setInterval(() => {
      setAdWatchCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setRewardedBonusActive(true);
          setShowRewardedModal(false);
          playCashChime();
          setPlayerStats((p) => ({ ...p, walletBalance: p.walletBalance + 50 }));
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const resetMatch = () => {
    setMatchOver(false);
    setCurrentOverBalls(0);
    setRunsThisOver(0);
    setWickets(0);
    setRecentShots([]);
    setGameState('IDLE');
    setRewardedBonusActive(false);
    setTimingFeedback(null);
    setLatestCommentary(
      language === 'hinglish'
        ? 'नया मैच शुरू हुआ! 6 गेंदों में अधिकतम रन बनाएं।'
        : 'New match underway! Target: Maximum runs in 1 over (6 balls).'
    );
  };

  return (
    <div className="w-full bg-[#0a0f1d] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Match HUD Bar */}
      <div className="bg-[#0e1626] border-b border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Score & Overs */}
        <div className="flex items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400">
              {language === 'hinglish' ? 'स्कोर' : 'SCORE'}
            </span>
            <span className="text-2xl font-bold font-mono text-amber-400">
              {runsThisOver}/{wickets}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({currentOverBalls}.0 / 6)
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400 border-l border-slate-700/60 pl-4">
            <div>
              <span>SR: </span>
              <span className="font-mono text-slate-200">
                {currentOverBalls > 0 ? Math.round((runsThisOver / currentOverBalls) * 100) : 0}
              </span>
            </div>
            <div>
              <span>Proj: </span>
              <span className="font-mono text-slate-200">
                {currentOverBalls > 0 ? Math.round((runsThisOver / currentOverBalls) * 6) : 0}
              </span>
            </div>
            <div>
              <span>Wallet: </span>
              <span className="font-mono text-emerald-400 font-semibold">₹{playerStats.walletBalance}</span>
            </div>
          </div>
        </div>

        {/* Status badges & sound */}
        <div className="flex items-center gap-3">
          {rewardedBonusActive && (
            <div className="flex items-center gap-1.5 text-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-md">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>2X Multiplier Boost Active</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Anti-Cheat 60Hz Reconciled</span>
          </div>

          {/* Physics Debugger Toggle Button in HUD */}
          <button
            onClick={() => setPhysicsDebugger(!physicsDebugger)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
              physicsDebugger
                ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-semibold shadow-sm shadow-cyan-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Physics Debugger (Collision Hitboxes & Trajectory Vectors - Hotkey: P)"
          >
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>Physics Debugger {physicsDebugger ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Batting Arena & Visual Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[520px] bg-[#050811] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain"
        />

        {/* Live Delivery Info Overlay (Top-Left) */}
        <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl p-3 max-w-xs text-xs pointer-events-none">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-slate-200">
              {DELIVERY_PRESETS.find((d) => d.type === activeDelivery)?.nameEn}
            </span>
            <span className="font-mono text-amber-400 font-bold">{currentSpeed} km/h</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-tight">
            {language === 'hinglish'
              ? DELIVERY_PRESETS.find((d) => d.type === activeDelivery)?.descHi
              : DELIVERY_PRESETS.find((d) => d.type === activeDelivery)?.descEn}
          </p>
        </div>

        {/* Dynamic Timing Feedback Pop (Center) */}
        {timingFeedback && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-bounce">
            <div className={`text-xl sm:text-2xl font-extrabold uppercase tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] ${timingFeedback.color}`}>
              {timingFeedback.text}
            </div>
          </div>
        )}

        {/* Sweet Spot Timing Meter Bar (Bottom of Canvas) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-72 sm:w-96 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-xl p-2.5 shadow-xl">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 px-1">
            <span>Early</span>
            <span className="text-emerald-400 font-semibold tracking-wide">SWEET SPOT</span>
            <span>Late</span>
          </div>
          {/* Progress bar with green center zone */}
          <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            {/* Center sweet spot indicator */}
            <div className="absolute left-[78%] -translate-x-1/2 w-14 h-full bg-emerald-500/35 border-x border-emerald-400" />
            {/* Moving ball pointer */}
            <div
              className="absolute top-0 bottom-0 w-2.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b] transition-all duration-75"
              style={{ left: `calc(${timingGauge}% - 5px)` }}
            />
          </div>
        </div>

        {/* Match Over Banner */}
        {matchOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <Award className="w-12 h-12 text-amber-400 mb-3 animate-pulse" />
            <h3 className="text-2xl font-bold font-display text-slate-100 mb-1">
              {language === 'hinglish' ? 'ओवर समाप्त! शानदार इनिंग' : 'OVER FINISHED! INNINGS COMPLETE'}
            </h3>
            <p className="text-slate-400 text-sm max-w-md mb-4">
              {language === 'hinglish'
                ? `आपने 6 गेंदों में ${runsThisOver} रन बनाए! कुल ईनाम वॉलेट में क्रेडिट कर दिया गया है।`
                : `You scored ${runsThisOver} runs off 6 balls! Prize coins have been credited to your escrow wallet.`}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={resetMatch}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{language === 'hinglish' ? 'नया ओवर खेलें' : 'Play Another Over'}</span>
              </button>
              <button
                onClick={triggerRewardedAd}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold rounded-xl text-sm transition-all flex items-center gap-2"
              >
                <Film className="w-4 h-4 text-amber-400" />
                <span>{language === 'hinglish' ? 'रिवार्ड एड देखें (2X Bonus)' : 'Watch Rewarded Ad (2X Bonus)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Cockpit & Shot Execution Deck */}
      <div className="p-5 bg-[#0a0f1d] border-t border-slate-800/80 space-y-4">
        {/* Row 1: Delivery selector & Bowling trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              {language === 'hinglish' ? 'बॉलर वेरिएशन:' : 'Bowler Variation:'}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {DELIVERY_PRESETS.map((preset) => (
                <button
                  key={preset.type}
                  onClick={() => {
                    setActiveDelivery(preset.type);
                    if (gameState === 'IDLE') bowlDelivery(preset.type);
                  }}
                  disabled={gameState === 'BOWLING'}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                    activeDelivery === preset.type
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-medium'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {language === 'hinglish' ? preset.nameHi : preset.nameEn}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPhysicsDebugger(!physicsDebugger)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                physicsDebugger
                  ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
              title="Toggle Physics Debugger (Collision Hitboxes & Trajectory Vectors - Hotkey: P)"
            >
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              <span>Physics Debugger {physicsDebugger ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => bowlDelivery()}
              disabled={gameState === 'BOWLING' || matchOver}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                gameState === 'BOWLING'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {gameState === 'BOWLING'
                  ? language === 'hinglish'
                    ? 'गेंद हवा में है...'
                    : 'Ball In Air...'
                  : language === 'hinglish'
                  ? 'गेंद फेंको (Bowl Next Ball)'
                  : 'Bowl Delivery'}
              </span>
            </button>
          </div>
        </div>

        {/* Row 2: Batsman Shot Action Buttons with hotkeys */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { type: 'COVER_DRIVE' as ShotType, label: 'Cover Drive', key: 'A', desc: 'Off-side Drive (4s)' },
            { type: 'STRAIGHT_LOFT' as ShotType, label: 'Straight Loft', key: 'W', desc: 'Over Bowler (6s)' },
            { type: 'PULL_SHOT' as ShotType, label: 'Pull Shot', key: 'D', desc: 'Mid-wicket Boundary' },
            { type: 'HELICOPTER' as ShotType, label: 'Helicopter 6', key: 'Space', desc: 'Yorker Punisher (6s)' },
            { type: 'LATE_CUT' as ShotType, label: 'Late Cut', key: 'S', desc: 'Behind Point (4s)' },
            { type: 'DEFENSIVE' as ShotType, label: 'Solid Defend', key: 'Def', desc: 'Save Wicket / 1 Run' },
          ].map((shot) => (
            <button
              key={shot.type}
              onClick={() => playShot(shot.type)}
              disabled={gameState !== 'BOWLING'}
              className={`p-3 rounded-xl border text-left transition-all ${
                gameState === 'BOWLING'
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-amber-500/60 active:scale-95 cursor-pointer shadow-md'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-600 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs text-slate-200">{shot.label}</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-amber-400 rounded border border-slate-700">
                  {shot.key}
                </kbd>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">{shot.desc}</p>
            </button>
          ))}
        </div>

        {/* Row 3: Live Commentary Ticker & Wagon Wheel Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/60">
          {/* Live Commentary box */}
          <div className="md:col-span-2 bg-[#080d19] p-3 rounded-xl border border-slate-800 flex items-start gap-3">
            <Activity className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                {language === 'hinglish' ? 'लाइव कमेंट्री' : 'LIVE COMMENTARY'}
              </div>
              <p className="text-xs text-slate-200 font-medium">{latestCommentary}</p>
            </div>
          </div>

          {/* Anti-cheat real-time telemetry badge */}
          <div className="bg-[#080d19] p-3 rounded-xl border border-slate-800 flex flex-col justify-between text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>Server Sync:</span>
              <span className="text-emerald-400 font-mono">60Hz Tick</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Input Timing Delta:</span>
              <span className="text-slate-200 font-mono">{antiCheatStatus.timingDeltaMs} ms</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Integrity Hash:</span>
              <span className="text-amber-400 font-mono">SHA256_VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rewarded Video Ad Modal Simulator */}
      {showRewardedModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
              <Film className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-100">
                {language === 'hinglish' ? 'रिवार्ड एड स्पॉन्सरशिप' : 'Sponsored Rewarded Video'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'hinglish'
                  ? 'विज्ञापन पूरा होने पर आपके खाते में 2X मल्टीप्लायर और ₹50 बोनस क्रेडिट होगा।'
                  : 'Watching ad unlocks instant 2X run multiplier & ₹50 bonus tournament escrow.'}
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-2xl font-bold font-mono text-amber-400">
                {adWatchCountdown}s
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Simulating Unity Ads / Google AdMob S2S Verification
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
