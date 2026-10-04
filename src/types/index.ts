export type DeliveryType =
  | 'FAST_OUTSWING'
  | 'FAST_INSWING'
  | 'REVERSE_SWING'
  | 'TOE_CRUSHER_YORKER'
  | 'FAST_BOUNCER'
  | 'OFF_CUTTER'
  | 'LEG_SPIN_SLIDER'
  | 'GOOGLY'
  | 'KNUCKLE_SLOWER';

export type ShotType =
  | 'COVER_DRIVE'
  | 'STRAIGHT_LOFT'
  | 'PULL_SHOT'
  | 'HELICOPTER'
  | 'LATE_CUT'
  | 'DEFENSIVE';

export type ShotResult =
  | 'SIX'
  | 'FOUR'
  | 'DOUBLE'
  | 'SINGLE'
  | 'DOT'
  | 'BOWLED'
  | 'CAUGHT'
  | 'LBW';

export interface BallPhysicsState {
  x: number; // horizontal pitch pos (-100 to 100)
  y: number; // height from ground (0 to 180)
  z: number; // distance from bowler (0 to 1000)
  vx: number;
  vy: number;
  vz: number;
  speedKmph: number;
  deliveryType: DeliveryType;
  bounced: boolean;
  pitchHitSpot: { x: number; z: number } | null;
}

export interface ShotRecord {
  ballNumber: number;
  deliveryType: DeliveryType;
  speedKmph: number;
  shotType: ShotType;
  timing: 'EARLY' | 'PERFECT' | 'LATE';
  timingDeltaMs: number;
  result: ShotResult;
  runs: number;
  distanceMeters: number;
  wagonAngleDeg: number;
  commentary: string;
}

export interface PlayerStats {
  matchesPlayed: number;
  totalRuns: number;
  fours: number;
  sixes: number;
  highestScore: number;
  strikeRate: number;
  winRate: number;
  walletBalance: number;
  ratingMMR: number;
  antiCheatTrustScore: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  rating: number;
  matches: number;
  winRate: string;
  earnings: string;
  trustBadge: string;
}

export interface ArchitecturePhase {
  id: string;
  phaseNumber: number;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  simpleExplanationHi: string;
  simpleExplanationEn: string;
  technicalDetails: string[];
  antiCheatRole: string;
  techInvolved: string[];
  mockPayload: Record<string, any>;
  mockResponse: Record<string, any>;
}
