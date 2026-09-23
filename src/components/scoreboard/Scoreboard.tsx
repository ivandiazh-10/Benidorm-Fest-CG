import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Show } from '../../types/broadcast';
import { useRanking } from '../../utils/hooks/useRanking';
import { AuthoritativeRankedParticipant } from '../../utils/scoringEngine';
import { BroadcastAnimationController } from '../../utils/animation';
import {
  BUG_ORIGIN,
  BF25ArtistIcon,
  CornerLBracket,
} from '../graphics/benidorm2025/Benidorm2025Primitives';
import {
  StageScanlineOverlay,
  StageCornerBracketPair,
  fitBF25Text,
} from '../graphics/benidorm2025/Benidorm2025AnimationEngine';

/* =========================================================================
   SCOREBOARD CONSTANTS & BROADCAST MATH (1920x1080 Broadcast Canvas)
   ========================================================================= */
const MAX_SCOREBOARD_HEIGHT = 540; // Strictly <= 50% of 1080px screen height
const SCOREBOARD_WIDTH = 580;     // Compact broadcast width, maximum data density
const SAFE_LEFT = BUG_ORIGIN.left; // 96px safe margin, aligned with live bug left anchor

// Smooth professional television broadcast easing curves (Cubic, zero elastic, zero bounce)
const EASE_BROADCAST = [0.22, 1, 0.36, 1] as const;
const EASE_EXIT = [0.4, 0, 0.7, 0.2] as const;

export type ScoreboardAnimState =
  | 'IDLE'
  | 'BUILDING_BACKGROUND'
  | 'BUILDING_ROWS'
  | 'ON_AIR'
  | 'COORDINATED_TRANSITION'
  | 'POINTS_AWARDED_STATIONARY'
  | 'EXITING';

export interface ScoreboardProps {
  show: Show;
  isSplitScreen?: boolean;
  maxDisplayCount?: number;
  stageLabel?: string;
}

/**
 * BENIDORM FEST 2025 SCOREBOARD — BROADCAST IMPLEMENTATION
 * 
 * Features:
 * 1. Dual-Case Blue Points-Awarded Engine:
 *    - CASE A (Points awarded + ranking changes): Continuous FLIP movement with blue highlight.
 *    - CASE B (Points awarded but ranking DOES NOT CHANGE): Row remains at exact position,
 *      triggers RTVE 2025 royal blue & cyber cyan geometric pulse, counter increment, and settles.
 * 2. Authoritative Single-Source Ranking via `useRanking(show)`:
 *    - Descending order strictly verified.
 * 3. 60fps Broadcast Synchronized Timing.
 */
export const Scoreboard: React.FC<ScoreboardProps> = ({
  show,
  maxDisplayCount,
  stageLabel,
}) => {
  // 1. Authoritative ranking hook
  const { ranking } = useRanking(show);

  // 2. Active voting phase label
  const currentPhase = show.activeVotingPhase || 'professionalJury';
  const phaseLabel =
    currentPhase === 'professionalJury'
      ? 'JURADO'
      : currentPhase === 'demoscopic'
      ? 'DEMOSCÓPICO'
      : currentPhase === 'public'
      ? 'TELEVOTO'
      : 'TOTAL';

  // 3. Display list limited by maxDisplayCount if provided
  const displayList = useMemo(() => {
    return maxDisplayCount ? ranking.slice(0, maxDisplayCount) : ranking;
  }, [ranking, maxDisplayCount]);

  // 4. Vertical dimension math (Height <= 540px, centered vertically at (1080 - H) / 2)
  const count = displayList.length || 8;
  const headerHeight = 38;
  const gapBetweenRows = 5;
  const availableRowsHeight = MAX_SCOREBOARD_HEIGHT - headerHeight - 12;
  const rowHeight = Math.min(
    54,
    Math.max(40, Math.floor((availableRowsHeight - (count - 1) * gapBetweenRows) / count))
  );
  const totalScoreboardHeight = headerHeight + 10 + count * rowHeight + (count - 1) * gapBetweenRows;
  const scoreboardTop = Math.round((1080 - totalScoreboardHeight) / 2);

  // 5. Coordinated Animation State & Measurement
  const [animState, setAnimState] = useState<ScoreboardAnimState>('BUILDING_BACKGROUND');
  const [hasEntered, setHasEntered] = useState(false);
  const [climbingArtistId, setClimbingArtistId] = useState<string | null>(null);
  const [bluePointsAwardedId, setBluePointsAwardedId] = useState<string | null>(null);
  const [transitionDuration, setTransitionDuration] = useState<number>(1.25);

  const prevPositionsRef = useRef<Record<string, number>>({});
  const prevScoresRef = useRef<Record<string, number>>({});
  const isInitialMountRef = useRef(true);
  const activeTimersRef = useRef<NodeJS.Timeout[]>([]);
  const lastActiveRevealKeyRef = useRef<string | null>(null);

  const clearAllTimers = () => {
    activeTimersRef.current.forEach(clearTimeout);
    activeTimersRef.current = [];
  };

  const scheduleStep = (fn: () => void, delayMs: number) => {
    const timer = setTimeout(fn, delayMs);
    activeTimersRef.current.push(timer);
    return timer;
  };

  // Helper to trigger blue points-awarded animation reliably
  const triggerBluePointsAnimation = (participantId: string) => {
    setBluePointsAwardedId(participantId);
    scheduleStep(() => {
      setBluePointsAwardedId((prev) => (prev === participantId ? null : prev));
    }, 1300);
  };

  // Initial Entrance Sequence
  useEffect(() => {
    clearAllTimers();
    setAnimState('BUILDING_BACKGROUND');

    const bgDelay = 380;
    const rowStagger = 85;
    const totalEntranceTime = bgDelay + count * rowStagger + 450;

    scheduleStep(() => {
      setAnimState('BUILDING_ROWS');
    }, bgDelay);

    scheduleStep(() => {
      setHasEntered(true);
      setAnimState('ON_AIR');
    }, totalEntranceTime);

    return () => clearAllTimers();
  }, [count]);

  // Subscribe to BroadcastAnimationController Points Awarded Event Bus
  useEffect(() => {
    const unsubscribe = BroadcastAnimationController.onPointsAwarded((payload) => {
      triggerBluePointsAnimation(payload.participantId);
    });
    return () => unsubscribe();
  }, []);

  // Monitor show.activeReveal for external point awards
  useEffect(() => {
    if (show.activeReveal && show.activeReveal.participantId && show.activeReveal.pointsAwarded > 0) {
      const key = `${show.activeReveal.participantId}_${show.activeReveal.revealedAt || show.activeReveal.pointsAwarded}`;
      if (lastActiveRevealKeyRef.current !== key) {
        lastActiveRevealKeyRef.current = key;
        triggerBluePointsAnimation(show.activeReveal.participantId);
      }
    }
  }, [show.activeReveal]);

  // Coordinated FLIP Ranking Changes and In-Place Score Updates
  useEffect(() => {
    if (isInitialMountRef.current) {
      displayList.forEach((p, idx) => {
        prevPositionsRef.current[p.id] = idx;
        prevScoresRef.current[p.id] = p.totalScore;
      });
      isInitialMountRef.current = false;
      return;
    }

    let climbedId: string | null = null;
    let scoredId: string | null = null;
    let maxSlotDistance = 0;

    displayList.forEach((p, currentSlotIdx) => {
      const prevSlotIdx = prevPositionsRef.current[p.id] ?? currentSlotIdx;
      const prevScore = prevScoresRef.current[p.id] ?? p.totalScore;

      if (p.totalScore !== prevScore) {
        scoredId = p.id;
      }

      // Check slot index change
      if (currentSlotIdx < prevSlotIdx) {
        climbedId = p.id;
        const dist = prevSlotIdx - currentSlotIdx;
        if (dist > maxSlotDistance) maxSlotDistance = dist;
      } else if (currentSlotIdx > prevSlotIdx) {
        const dist = currentSlotIdx - prevSlotIdx;
        if (dist > maxSlotDistance) maxSlotDistance = dist;
      }

      // Update refs
      prevPositionsRef.current[p.id] = currentSlotIdx;
      prevScoresRef.current[p.id] = p.totalScore;
    });

    // CASE A: Points awarded AND ranking changes (FLIP layout move)
    if (climbedId || maxSlotDistance > 0) {
      clearAllTimers();
      setClimbingArtistId(climbedId);
      if (climbedId) {
        triggerBluePointsAnimation(climbedId);
      }

      const duration = maxSlotDistance >= 5 ? 1.5 : maxSlotDistance >= 2 ? 1.25 : 1.0;
      setTransitionDuration(duration);
      setAnimState('COORDINATED_TRANSITION');

      scheduleStep(() => {
        setClimbingArtistId(null);
        setAnimState('ON_AIR');
      }, duration * 1000 + 150);

      return () => clearAllTimers();
    }

    // CASE B: Points awarded BUT ranking DOES NOT CHANGE
    if (scoredId && !climbedId) {
      triggerBluePointsAnimation(scoredId);
      setAnimState('POINTS_AWARDED_STATIONARY');
      scheduleStep(() => {
        setAnimState('ON_AIR');
      }, 1300);
    }
  }, [displayList]);

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none z-30">
      <motion.div
        initial={{
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          x: -28,
          opacity: 0,
        }}
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          x: 0,
          opacity: 1,
          transition: { duration: 0.58, ease: EASE_BROADCAST },
        }}
        exit={{
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          x: -20,
          opacity: 0,
          transition: { duration: 0.38, ease: EASE_EXIT },
        }}
        style={{
          top: `${scoreboardTop}px`,
          left: `${SAFE_LEFT}px`,
          width: `${SCOREBOARD_WIDTH}px`,
          height: `${totalScoreboardHeight}px`,
        }}
        className="absolute flex flex-col drop-shadow-[0_24px_55px_rgba(0,0,0,0.96)]"
      >
        {/* Layer 1: TV Scanline Micro-Texture */}
        <StageScanlineOverlay opacity={0.035} />

        {/* ScoreboardHeader: Title + Active Voting Phase */}
        <ScoreboardHeader
          headerHeight={headerHeight}
          stageTitle={stageLabel || show.stageTitle || 'FINAL'}
          phaseLabel={phaseLabel}
        />

        {/* ScoreboardList: Master coordinate container for FLIP-positioned rows */}
        <div className="flex-1 relative w-full overflow-visible">
          {displayList.map((participant, index) => {
            const targetY = index * (rowHeight + gapBetweenRows);

            const currentPhaseScore =
              currentPhase === 'public'
                ? participant.publicScore
                : currentPhase === 'demoscopic'
                ? participant.demoscopicScore
                : participant.juryScore;

            const isClimbing = participant.id === climbingArtistId;
            const isBlueHighlighted = participant.id === bluePointsAwardedId;

            // Stagger for initial entrance only
            const entranceDelay = hasEntered ? 0 : 380 + index * 85;

            return (
              <ScoreboardRow
                key={participant.id}
                participant={participant}
                targetY={targetY}
                phaseScore={currentPhaseScore}
                totalScore={participant.totalScore}
                rowHeight={rowHeight}
                index={index}
                entranceDelay={entranceDelay}
                hasEntered={hasEntered}
                transitionDuration={transitionDuration}
                isClimbing={isClimbing}
                isBlueHighlighted={isBlueHighlighted}
              />
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

/* =========================================================================
   SCOREBOARD HEADER
   ========================================================================= */
interface ScoreboardHeaderProps {
  headerHeight: number;
  stageTitle: string;
  phaseLabel: string;
}

const ScoreboardHeader: React.FC<ScoreboardHeaderProps> = ({
  headerHeight,
  stageTitle,
  phaseLabel,
}) => {
  return (
    <div
      style={{ height: `${headerHeight}px` }}
      className="flex items-stretch justify-between shrink-0 mb-[6px] relative"
    >
      {/* Left Title Panel ("FINAL") */}
      <div className="flex-1 bg-[#121B52] border-t-2 border-l-2 border-r border-[#2A65F5]/90 flex items-center justify-center mr-[4px] shadow-md relative overflow-hidden">
        <span className="font-heavy text-[17px] font-black tracking-[0.25em] text-[#8EDCFF] uppercase">
          {stageTitle}
        </span>
        <StageCornerBracketPair size={8} thickness={2} color="#8EDCFF" />
      </div>

      {/* Right Phase Panel ("JURADO" / "TELEVOTO") */}
      <div className="w-[176px] bg-[#002BCC] border-t-2 border-r-2 border-l border-[#2A65F5] flex items-center justify-center shrink-0 shadow-md relative overflow-hidden">
        <span className="font-heavy text-[17px] font-black tracking-[0.18em] text-[#FFD700] uppercase">
          {phaseLabel}
        </span>
        <StageCornerBracketPair size={8} thickness={2} color="#FFD700" />
      </div>
    </div>
  );
};

/* =========================================================================
   SCOREBOARD ROW (Measured FLIP Coordinate Transform & Blue Points Highlight)
   ========================================================================= */
interface ScoreboardRowProps {
  participant: AuthoritativeRankedParticipant;
  targetY: number;
  phaseScore: number;
  totalScore: number;
  rowHeight: number;
  index: number;
  entranceDelay: number;
  hasEntered: boolean;
  transitionDuration: number;
  isClimbing: boolean;
  isBlueHighlighted: boolean;
}

const ScoreboardRow: React.FC<ScoreboardRowProps> = ({
  participant,
  targetY,
  phaseScore,
  totalScore,
  rowHeight,
  index,
  entranceDelay,
  hasEntered,
  transitionDuration,
  isClimbing,
  isBlueHighlighted,
}) => {
  const isFirstPlace = index === 0;
  const rawName = (participant.name || participant.artist || '').toUpperCase();

  // High-impact broadcast typography
  const artistStyle = fitBF25Text(rawName, {
    maxContainerWidth: 320,
    baseFontSize: 24,
    minFontSize: 16,
    charThreshold: 13,
    letterSpacingEm: 0.04,
  });

  const isHighlighted = isClimbing || isBlueHighlighted;

  return (
    <motion.div
      initial={
        hasEntered
          ? false
          : {
              y: targetY,
              x: -36,
              clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
              opacity: 0,
            }
      }
      animate={{
        y: targetY,
        x: 0,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        opacity: 1,
        transition: hasEntered
          ? {
              y: { duration: transitionDuration, ease: EASE_BROADCAST },
              x: { duration: 0.3 },
              clipPath: { duration: 0.3 },
              opacity: { duration: 0.3 },
            }
          : {
              duration: 0.5,
              delay: entranceDelay / 1000,
              ease: EASE_BROADCAST,
            },
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: `${rowHeight}px`,
        zIndex: isHighlighted ? 25 : isFirstPlace ? 20 : 10,
      }}
      className={`flex items-stretch w-full overflow-hidden select-none transition-shadow duration-300 ${
        isHighlighted
          ? 'shadow-[0_0_28px_rgba(0,229,255,0.85)] ring-2 ring-[#00E5FF]'
          : 'shadow-lg'
      }`}
    >
      {/* Layer 1: Left Square Emblem Container */}
      <div
        style={{ width: `${rowHeight}px` }}
        className={`shrink-0 flex items-center justify-center relative border-r overflow-hidden transition-colors duration-400 ${
          isHighlighted
            ? 'bg-[#001F5C] border-[#00E5FF]'
            : 'bg-[#0B1026] border-[#FF007A]/40'
        }`}
      >
        <BF25ArtistIcon
          size={Math.round(rowHeight * 0.52)}
          color={isHighlighted ? '#00E5FF' : isFirstPlace ? '#FFD700' : '#FFFFFF'}
        />
      </div>

      {/* Layer 2: Artist Name Container (Vibrant Magenta or Blue Highlight) */}
      <div
        style={{ right: '176px', left: `${rowHeight}px` }}
        className={`absolute top-0 bottom-0 flex items-center px-3 z-10 transition-colors duration-400 ${
          isHighlighted
            ? 'bg-gradient-to-r from-[#002277] via-[#0044CC] to-[#001855]'
            : isFirstPlace
            ? 'bg-gradient-to-r from-[#FF007A] via-[#F00070] to-[#C7005D]'
            : 'bg-gradient-to-r from-[#E6007A] via-[#CC006C] to-[#A30056]'
        }`}
      >
        <span
          style={{
            fontSize: `${artistStyle.fontSize}px`,
            letterSpacing: artistStyle.letterSpacing,
            lineHeight: 1.05,
          }}
          className={`font-heavy font-black uppercase truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
            isHighlighted ? 'text-[#8EDCFF]' : 'text-white'
          }`}
        >
          {rawName}
        </span>

        {/* Blue Points Awarded Traveling Accent Pulse */}
        {isBlueHighlighted && (
          <motion.div
            initial={{ x: -200 }}
            animate={{ x: 380 }}
            transition={{ duration: 0.9, repeat: 1, ease: EASE_BROADCAST }}
            className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent skew-x-[-20deg] pointer-events-none"
          />
        )}
      </div>

      {/* Layer 3: Triangular Chevron Indicator pointing right to the score blocks */}
      <div
        style={{ right: '168px' }}
        className="absolute top-0 bottom-0 flex items-center justify-center z-20 pointer-events-none"
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: `${Math.round(rowHeight * 0.38)}px solid transparent`,
            borderBottom: `${Math.round(rowHeight * 0.38)}px solid transparent`,
            borderLeft: `10px solid ${isHighlighted ? '#00E5FF' : '#FFD700'}`,
          }}
        />
      </div>

      {/* Layer 4: Phase Score Block (Royal Blue #002BCC, 26px mono-num white) */}
      <div
        style={{ width: '84px', right: '92px' }}
        className={`absolute top-0 bottom-0 flex items-center justify-center border-l-2 z-10 transition-colors duration-400 ${
          isHighlighted
            ? 'bg-[#002277] border-[#00E5FF]'
            : 'bg-[#002BCC] border-[#2A65F5]/80'
        }`}
      >
        <span
          className={`font-heavy font-black text-[26px] tracking-tight drop-shadow-sm font-mono ${
            isHighlighted ? 'text-[#00E5FF]' : 'text-white'
          }`}
        >
          {phaseScore}
        </span>
      </div>

      {/* Layer 5: Grand Total Score Block (Bright Yellow or Cyber Cyan Highlight) */}
      <div
        style={{ width: '92px', right: '0px' }}
        className={`absolute top-0 bottom-0 flex items-center justify-center border-l-2 z-10 transition-colors duration-400 ${
          isHighlighted
            ? 'bg-[#00E5FF] border-white shadow-[inset_0_0_14px_#00A3FF]'
            : 'bg-[#FFD700] border-[#FFE55C]'
        }`}
      >
        <span
          className={`font-heavy font-black text-[29px] tracking-tight font-mono ${
            isHighlighted ? 'text-[#001844]' : 'text-[#0A1244]'
          }`}
        >
          {totalScore}
        </span>
      </div>

      {/* Layer 6: Corner Accents */}
      <div className="absolute top-0 right-0 z-20 pointer-events-none">
        <CornerLBracket
          size={7}
          thickness={1.5}
          color={isHighlighted ? '#00E5FF' : '#0A1244'}
          position="top-right"
        />
      </div>
      <div className="absolute bottom-0 right-0 z-20 pointer-events-none">
        <CornerLBracket
          size={7}
          thickness={1.5}
          color={isHighlighted ? '#00E5FF' : '#0A1244'}
          position="bottom-right"
        />
      </div>
    </motion.div>
  );
};

export default Scoreboard;
