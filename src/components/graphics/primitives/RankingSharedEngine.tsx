import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Participant, ParticipantScore, ActiveVotingPhase } from '../../../types/broadcast';
import { getParticipantPhaseScore } from '../../../utils/scoringEngine';
import { calculateRanking } from '../../../utils/hooks/useRanking';
import { EASE_BROADCAST, EASE_SETTLE } from './BenidormPrimitives';
import { fitTextToBox } from '../../../utils/textFitting';

export interface DynamicRankingLayout {
  rowHeightPx: number;
  gapPx: number;
  totalHeightPx: number;
  rankWidthPx: number;
  scoreWidthPx: number;
  fontSizeRank: number;
  fontSizeName: number;
  fontSizeScore: number;
  fontSizePhaseLabel: number;
  showSongSubtitle: boolean;
}

/**
 * calculateDynamicRankingLayout()
 * Mathematically distributes rows and spacing across the vertical safe area
 * between TOP SAFE ZONE and BOTTOM SAFE ZONE (~890px).
 * Ensures ALL participants (from 3 to 30+) fit simultaneously with:
 * - NO pagination
 * - NO scrolling
 * - NO hidden participants
 * - NO clipped rows
 * - NO empty unused gap at the bottom
 */
export function calculateDynamicRankingLayout(
  participantCount: number,
  availableHeightPx: number = 880
): DynamicRankingLayout {
  const n = Math.max(1, participantCount);

  let gapPx = 6;
  let rowHeightPx = 64;

  if (n <= 4) {
    // Generous spacious rows spanning the safe area
    rowHeightPx = Math.min(94, Math.floor((availableHeightPx - (n - 1) * 20) / n));
    gapPx = Math.max(12, Math.floor((availableHeightPx - n * rowHeightPx) / Math.max(1, n - 1)));
  } else if (n <= 6) {
    rowHeightPx = Math.min(86, Math.floor((availableHeightPx - (n - 1) * 14) / n));
    gapPx = Math.max(10, Math.floor((availableHeightPx - n * rowHeightPx) / (n - 1)));
  } else if (n <= 8) {
    rowHeightPx = Math.min(78, Math.floor((availableHeightPx - (n - 1) * 10) / n));
    gapPx = Math.max(8, Math.floor((availableHeightPx - n * rowHeightPx) / (n - 1)));
  } else if (n <= 12) {
    rowHeightPx = Math.floor((availableHeightPx - (n - 1) * 5) / n);
    gapPx = 5;
  } else if (n <= 16) {
    rowHeightPx = Math.floor((availableHeightPx - (n - 1) * 3) / n);
    gapPx = 3;
  } else if (n <= 22) {
    rowHeightPx = Math.floor((availableHeightPx - (n - 1) * 2) / n);
    gapPx = 2;
  } else {
    // 23 to 32+ participants
    rowHeightPx = Math.max(22, Math.floor((availableHeightPx - (n - 1) * 1) / n));
    gapPx = 1;
  }

  const totalHeightPx = n * rowHeightPx + (n - 1) * gapPx;
  const rankWidthPx = Math.max(34, Math.min(80, Math.round(rowHeightPx * 1.08)));
  const scoreWidthPx = Math.max(54, Math.min(124, Math.round(rowHeightPx * 1.55)));

  const fontSizeRank = Math.max(13, Math.min(36, Math.round(rowHeightPx * 0.5)));
  const fontSizeName = Math.max(12, Math.min(30, Math.round(rowHeightPx * 0.44)));
  const fontSizeScore = Math.max(13, Math.min(38, Math.round(rowHeightPx * 0.52)));
  const fontSizePhaseLabel = Math.max(8, Math.min(11, Math.round(rowHeightPx * 0.16)));

  const showSongSubtitle = rowHeightPx >= 54;

  return {
    rowHeightPx,
    gapPx,
    totalHeightPx,
    rankWidthPx,
    scoreWidthPx,
    fontSizeRank,
    fontSizeName,
    fontSizeScore,
    fontSizePhaseLabel,
    showSongSubtitle,
  };
}

/**
 * Directional masked score number counter
 * Strictly no fades, no bounce, no random slot machine
 */
export const AnimatedScoreNumber: React.FC<{
  value: number;
  duration?: number;
  className?: string;
}> = ({ value, duration = 650, className = '' }) => {
  const [displayVal, setDisplayVal] = useState<number>(value);
  const prevValRef = useRef<number>(value);

  useEffect(() => {
    const startVal = prevValRef.current;
    const endVal = value;
    prevValRef.current = value;

    if (startVal === endVal) {
      setDisplayVal(endVal);
      return;
    }

    const startTime = performance.now();
    let animId: number;
    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth broadcast cubic easing (0.16, 1, 0.3, 1 approximation)
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.round(startVal + (endVal - startVal) * eased));

      if (progress < 1) {
        animId = requestAnimationFrame(update);
      }
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  return <span className={className}>{displayVal}</span>;
};

/**
 * Shared choreography hook for Ranking & Scoreboard
 * Strictly follows TV broadcast rules:
 * - Active coral state is bound ONLY to moving participant during ranking displacement
 * - When movement finishes: STOP. Everything settles. Static hold with zero highlight/pulse
 * - Other rows never disappear; they translate downward smoothly to their new slots
 */
export function useRankingChoreography(
  participants: Participant[],
  scores: Record<string, ParticipantScore>,
  count?: number,
  manualActiveId?: string | null
) {
  const activeParticipants = participants.filter((p) => !p.isRemovedFromCompetition);

  const computeDataOrder = (): Participant[] => {
    const ranked = calculateRanking(participants, scores);
    return count ? ranked.slice(0, count) : ranked;
  };

  const [visualOrder, setVisualOrder] = useState<Participant[]>(() => computeDataOrder());
  const [movingParticipantId, setMovingParticipantId] = useState<string | null>(null);
  const [movingState, setMovingState] = useState<'idle' | 'exiting' | 'rearranging' | 'entering'>('idle');
  const [highlightedParticipantId, setHighlightedParticipantId] = useState<string | null>(null);

  const prevScoresRef = useRef<Record<string, number>>({});
  const prevPositionsRef = useRef<Record<string, number>>({});
  const animTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // If manual active ID is passed for a transient operator cue, clear it once settled
  useEffect(() => {
    if (manualActiveId) {
      setHighlightedParticipantId(manualActiveId);
      const timer = setTimeout(() => {
        setHighlightedParticipantId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [manualActiveId]);

  useEffect(() => {
    const targetOrder = computeDataOrder();
    let movedId: string | null = null;

    for (const p of targetOrder) {
      const currentScore = scores[p.id]?.totalScore ?? 0;
      const currentPos = scores[p.id]?.position ?? 999;
      const prevScore = prevScoresRef.current[p.id];
      const prevPos = prevPositionsRef.current[p.id];

      // Detect who gained points AND climbed in ranking
      if (
        prevPos !== undefined &&
        currentPos < prevPos &&
        prevScore !== undefined &&
        currentScore > prevScore
      ) {
        movedId = p.id;
      }

      prevScoresRef.current[p.id] = currentScore;
      prevPositionsRef.current[p.id] = currentPos;
    }

    // Choreograph physical movement only when a participant changes position
    if (movedId && movingState === 'idle') {
      const activeId = movedId;
      setMovingParticipantId(activeId);
      setHighlightedParticipantId(activeId);
      setMovingState('rearranging');

      animTimeoutsRef.current.forEach(clearTimeout);
      animTimeoutsRef.current = [];

      // Stage 1 (0–380ms): Update detection, row preparation and structural accent activation
      const t1 = setTimeout(() => {
        // Stage 2 (380–2400ms): Target visual order updates, FLIP motion smoothly moves rows up/down
        setVisualOrder(targetOrder);
      }, 380);

      // Stage 3 (2600ms): Final scoreboard settle — static broadcast hold
      const t2 = setTimeout(() => {
        setMovingParticipantId(null);
        setHighlightedParticipantId(null);
        setMovingState('idle');
      }, 2600);

      animTimeoutsRef.current = [t1, t2];
    } else if (movingState === 'idle') {
      setVisualOrder(targetOrder);
    }
  }, [scores, participants, count]);

  useEffect(() => {
    return () => {
      animTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  return {
    visualOrder,
    movingParticipantId,
    movingState,
    highlightedParticipantId,
  };
}

/**
 * Shared Ranking Row Module
 * Redesigned for maximum broadcast television readability:
 * - Substantially larger typography and taller rows
 * - Identical structural component for Phase Score block (Lilac) and Total Score block (White)
 * - Zero fades (directional clipping and geometric translation)
 * - Stable hold state (no continuing pulse/glow)
 */
export interface RankingRowModuleProps {
  participant: Participant;
  scoreData: ParticipantScore;
  activePhase: ActiveVotingPhase;
  isHighlighted: boolean;
  isMoving: boolean;
  isExiting: boolean;
  isEntering: boolean;
  isHiddenInTransit: boolean;
  compact?: boolean;
  showPhaseScore?: boolean;
  showPositionNumber?: boolean;
  dynamicLayout?: DynamicRankingLayout;
}

export const RankingRowModule: React.FC<RankingRowModuleProps> = ({
  participant,
  scoreData,
  activePhase,
  isHighlighted,
  isMoving,
  isExiting,
  isEntering,
  isHiddenInTransit,
  compact = false,
  showPhaseScore = true,
  showPositionNumber = false,
  dynamicLayout,
}) => {
  const isTop1 = scoreData.position === 1;
  const isTop4 = scoreData.position <= 4;
  const phaseScore = getParticipantPhaseScore(scoreData, activePhase);

  const phaseLabel =
    activePhase === 'demoscopic'
      ? 'DEMO'
      : activePhase === 'public'
      ? 'PÚBLICO'
      : 'JURADO';

  // Dynamic layout calculations or clean fallbacks
  const rowHeightPx = dynamicLayout?.rowHeightPx;
  const rankWidthPx = dynamicLayout?.rankWidthPx;
  const scoreBlockWidthPx = dynamicLayout?.scoreWidthPx;
  const showSongSubtitle = dynamicLayout ? dynamicLayout.showSongSubtitle : !compact;

  const rowHeightClass = rowHeightPx ? '' : compact ? 'h-[56px]' : 'h-[68px]';
  const rankWidthClass = rankWidthPx ? '' : compact ? 'w-[62px]' : 'w-[76px]';
  const scoreBlockWidthClass = scoreBlockWidthPx ? '' : compact ? 'w-[98px]' : 'w-[116px]';

  const artistName = participant.name || participant.artist || 'ARTISTA';

  // Fit text to box for participant name so long names NEVER break row bounds
  const nameStyle = fitTextToBox(artistName, {
    baseFontSize: dynamicLayout?.fontSizeName ?? (compact ? 22 : 32),
    minFontSize: 11,
    charThreshold: 14,
  });

  // Only apply active coral during physical ranking motion
  const isActivelyMoving = isMoving && (isExiting || isHiddenInTransit || isEntering);

  return (
    <motion.div
      key={participant.id}
      layout="position"
      transition={{
        layout: {
          duration: 2.2,
          ease: EASE_SETTLE, // Physical smooth translation, NO bounce or spring
        },
      }}
      style={rowHeightPx ? { height: `${rowHeightPx}px` } : undefined}
      className={`relative flex items-center ${rowHeightClass} w-full gpu-layer`}
    >
      {/* Row Inner Container with physical directional clip for moving row */}
      <motion.div
        animate={{
          x: isExiting ? 140 : isEntering ? 0 : 0,
          clipPath: isHiddenInTransit
            ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
            : isExiting
            ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
            : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scale: isEntering ? [0.97, 1] : 1,
        }}
        transition={{
          duration: isExiting ? 0.38 : isEntering ? 0.55 : 0.3,
          ease: EASE_BROADCAST,
        }}
        className="relative flex items-center w-full h-full drop-shadow-[0_10px_24px_rgba(0,0,0,0.9)]"
      >
        {/* Active Coral highlight strictly for moving participant during displacement */}
        {isActivelyMoving && (
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 z-10 pointer-events-none chamfer-slant shadow-[0_0_24px_rgba(244,63,94,0.7)]" />
        )}

        {/* 1. POSITION BADGE / LEADING ACCENT (Position numbers omitted when showPositionNumber is false) */}
        {showPositionNumber ? (
          <div
            style={rankWidthPx ? { width: `${rankWidthPx}px` } : undefined}
            className={`relative ${rankWidthClass} h-full chamfer-slant flex items-center justify-center z-20 ${
              isTop1
                ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-black border-y border-amber-200 shadow-xl'
                : isTop4
                ? 'bg-[#240e4f] text-cyan-300 border-l-2 border-cyan-400 border-y border-purple-500/50'
                : 'bg-[#12082b] text-purple-200 border-l border-purple-600/30 border-y border-purple-900/40'
            }`}
          >
            <span
              style={
                dynamicLayout?.fontSizeRank
                  ? { fontSize: `${dynamicLayout.fontSizeRank}px` }
                  : undefined
              }
              className={`chamfer-unslant font-heavy font-mono-num leading-none ${
                !dynamicLayout ? (compact ? 'text-[26px]' : 'text-[34px]') : ''
              } font-black ${isTop1 ? 'text-black' : 'text-white'}`}
            >
              {scoreData.position}
            </span>
          </div>
        ) : (
          <div
            style={{ width: `${Math.max(22, Math.round((rankWidthPx || 76) * 0.38))}px` }}
            className={`relative h-full chamfer-slant flex items-center justify-center z-20 shrink-0 ${
              isTop1
                ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-y border-amber-200 shadow-[0_0_16px_rgba(251,191,36,0.7)]'
                : isTop4
                ? 'bg-gradient-to-r from-cyan-400 to-purple-600 border-l-2 border-cyan-400 border-y border-purple-500/50'
                : 'bg-gradient-to-r from-purple-700 to-[#12082b] border-l border-purple-600/40 border-y border-purple-900/40'
            }`}
          >
            {isTop1 ? (
              <div className="chamfer-unslant w-2 h-2 rounded-full bg-amber-100 shadow-[0_0_8px_#fbbf24]" />
            ) : (
              <div className="chamfer-unslant w-1 h-3 bg-white/40 skew-x-[-22deg]" />
            )}
          </div>
        )}

        {/* 2. MAIN PARTICIPANT NAME & SONG BAR */}
        <div
          className={`relative flex-1 h-full chamfer-slant -ml-2 px-4 flex items-center justify-between z-10 border-y overflow-hidden ${
            isActivelyMoving
              ? 'bg-transparent text-white border-rose-300'
              : 'bg-[#0b0e27] text-white border-indigo-950/90'
          }`}
        >
          <div className="chamfer-unslant flex items-baseline gap-3 overflow-hidden flex-1 mr-2">
            <span
              style={nameStyle}
              className="font-heavy uppercase font-black drop-shadow-sm leading-none shrink min-w-0"
              title={artistName}
            >
              {artistName}
            </span>
            {participant.song && showSongSubtitle && (
              <span
                style={
                  dynamicLayout?.fontSizeName
                    ? { fontSize: `${Math.max(10, Math.round(dynamicLayout.fontSizeName * 0.65))}px` }
                    : undefined
                }
                className="font-broadcast font-bold text-purple-300/90 truncate tracking-wide shrink-0 hidden sm:inline"
              >
                • {participant.song}
              </span>
            )}
          </div>
        </div>

        {/* 3. PHASE SCORE BLOCK (LILAC / PURPLE) — Matches Total Score Block geometry & size */}
        {showPhaseScore && (
          <div
            style={scoreBlockWidthPx ? { width: `${scoreBlockWidthPx}px` } : undefined}
            className={`relative ${scoreBlockWidthClass} h-full chamfer-slant -ml-2 bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#8b5cf6] text-white flex flex-col items-center justify-center z-20 shadow-xl border-y border-purple-300/60 overflow-hidden`}
          >
            <div className="chamfer-unslant flex flex-col items-center justify-center leading-none">
              <span
                style={
                  dynamicLayout?.fontSizePhaseLabel
                    ? { fontSize: `${dynamicLayout.fontSizePhaseLabel}px` }
                    : undefined
                }
                className="font-mono text-[9px] md:text-[10px] font-black tracking-widest text-purple-200 uppercase mb-0.5 opacity-90"
              >
                {phaseLabel}
              </span>
              <span
                style={
                  dynamicLayout?.fontSizeScore
                    ? { fontSize: `${dynamicLayout.fontSizeScore}px` }
                    : undefined
                }
                className={`font-heavy font-mono-num font-black leading-none ${
                  !dynamicLayout ? (compact ? 'text-[28px]' : 'text-[34px] md:text-[38px]') : ''
                }`}
              >
                {phaseScore > 0 ? `+${phaseScore}` : '0'}
              </span>
            </div>
          </div>
        )}

        {/* 4. TOTAL SCORE BLOCK (WHITE / LIGHT) — Identical structure to Phase Score block */}
        <div
          style={scoreBlockWidthPx ? { width: `${scoreBlockWidthPx}px` } : undefined}
          className={`relative ${scoreBlockWidthClass} h-full chamfer-slant -ml-2 bg-white text-black flex flex-col items-center justify-center z-20 shadow-2xl border-y border-slate-200 overflow-hidden`}
        >
          <div className="chamfer-unslant flex flex-col items-center justify-center leading-none">
            <span
              style={
                dynamicLayout?.fontSizePhaseLabel
                  ? { fontSize: `${dynamicLayout.fontSizePhaseLabel}px` }
                  : undefined
              }
              className="font-mono text-[9px] md:text-[10px] font-black tracking-widest text-slate-500 uppercase mb-0.5"
            >
              TOTAL
            </span>
            <span
              style={
                dynamicLayout?.fontSizeScore
                  ? { fontSize: `${dynamicLayout.fontSizeScore}px` }
                  : undefined
              }
              className={`font-heavy font-mono-num font-black leading-none text-black ${
                !dynamicLayout ? (compact ? 'text-[30px]' : 'text-[36px] md:text-[40px]') : ''
              }`}
            >
              <AnimatedScoreNumber value={scoreData.totalScore} />
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
