import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Show } from '../../../types/broadcast';
import { useRanking } from '../../../utils/hooks/useRanking';
import { AuthoritativeRankedParticipant } from '../../../utils/scoringEngine';
import {
  BF25ArtistIcon,
  DirectionalChevron,
  SquareAccentStrip,
  CornerLBracket,
} from './Benidorm2025Primitives';
import {
  StageScanlineOverlay,
  StageCornerBracketPair,
  fitBF25Text,
} from './Benidorm2025AnimationEngine';

interface Classification2025Props {
  show: Show;
  count?: number;
  title?: string;
}

const EASE_BROADCAST = [0.22, 1, 0.36, 1] as const;

/**
 * Calculates responsive vertical row distribution spanning TOP SAFE to BOTTOM SAFE.
 * Ensures all active participants fit vertically without scrolling or pagination.
 */
function calculateClassificationLayout(
  participantCount: number,
  availableHeightPx: number = 840
) {
  const n = Math.max(1, participantCount);
  let gapPx = 5;
  let rowHeightPx = 54;

  if (n <= 4) {
    rowHeightPx = Math.min(88, Math.floor((availableHeightPx - (n - 1) * 12) / n));
    gapPx = 10;
  } else if (n <= 6) {
    rowHeightPx = Math.min(78, Math.floor((availableHeightPx - (n - 1) * 10) / n));
    gapPx = 8;
  } else if (n <= 8) {
    rowHeightPx = Math.min(68, Math.floor((availableHeightPx - (n - 1) * 7) / n));
    gapPx = 6;
  } else if (n <= 12) {
    rowHeightPx = Math.floor((availableHeightPx - (n - 1) * 5) / n);
    gapPx = 4;
  } else if (n <= 16) {
    rowHeightPx = Math.floor((availableHeightPx - (n - 1) * 3) / n);
    gapPx = 3;
  } else {
    rowHeightPx = Math.max(26, Math.floor((availableHeightPx - (n - 1) * 2) / n));
    gapPx = 2;
  }

  const fontSizeRank = Math.max(14, Math.min(30, Math.round(rowHeightPx * 0.46)));
  const fontSizeName = Math.max(15, Math.min(28, Math.round(rowHeightPx * 0.42)));
  const fontSizeScore = Math.max(16, Math.min(32, Math.round(rowHeightPx * 0.48)));
  const showSongSubtitle = rowHeightPx >= 60;

  return {
    rowHeightPx,
    gapPx,
    fontSizeRank,
    fontSizeName,
    fontSizeScore,
    showSongSubtitle,
  };
}

/**
 * BENIDORM FEST 2025 CLASIFICACIÓN GENERAL
 * 
 * Rebuilt using the authoritative television broadcast design reference:
 * - Authoritative descending ranking via `useRanking(show)`.
 * - Full safe area utilization (Top Safe 64px to Bottom Safe 1016px).
 * - Vibrant hot pink / magenta artist rows (#FF007A / #E6007A).
 * - Square artist emblem with custom iconography.
 * - Pointing chevron arrow towards score blocks.
 * - Royal blue phase score column (#002BCC).
 * - Bright yellow grand total column (#FFD700).
 * - Multi-stage entrance with controlled row stagger.
 * - Coordinated FLIP ranking transitions without downward glitches.
 */
export const Classification2025: React.FC<Classification2025Props> = ({
  show,
  count,
  title,
}) => {
  // 1. Authoritative ranking hook
  const { ranking } = useRanking(show);

  const displayList = useMemo(() => {
    return count ? ranking.slice(0, count) : ranking;
  }, [ranking, count]);

  // 2. Active voting phase
  const currentPhase = show.activeVotingPhase || 'professionalJury';
  const phaseLabel =
    currentPhase === 'professionalJury'
      ? 'JURADO'
      : currentPhase === 'demoscopic'
      ? 'DEMOSCÓPICO'
      : currentPhase === 'public'
      ? 'TELEVOTO'
      : 'TOTAL';

  // 3. Vertical Safe Area Distribution
  const layout = useMemo(() => {
    return calculateClassificationLayout(displayList.length, 840);
  }, [displayList.length]);

  // 4. Track position changes for measured FLIP transitions
  const [changedParticipantIds, setChangedParticipantIds] = useState<Set<string>>(new Set());
  const prevPositionsRef = useRef<Record<string, number>>({});
  const updateTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const entranceDuration = 450 + (displayList.length || 8) * 80 + 400;
    const timer = setTimeout(() => setHasEntered(true), entranceDuration);
    return () => clearTimeout(timer);
  }, [displayList.length]);

  useEffect(() => {
    const movedIds = new Set<string>();
    displayList.forEach((p) => {
      const prev = prevPositionsRef.current[p.id];
      if (prev !== undefined && prev !== p.position) {
        movedIds.add(p.id);
      }
      prevPositionsRef.current[p.id] = p.position;
    });

    if (movedIds.size > 0) {
      setChangedParticipantIds(movedIds);
      const timer = setTimeout(() => {
        setChangedParticipantIds(new Set());
      }, 1800);
      updateTimeoutRef.current.push(timer);
    }

    return () => {
      updateTimeoutRef.current.forEach(clearTimeout);
      updateTimeoutRef.current = [];
    };
  }, [displayList]);

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none z-20 flex flex-col items-center pt-[64px] pb-[64px]">
      <motion.div
        initial={{
          clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          opacity: 0,
        }}
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          opacity: 1,
          transition: { duration: 0.55, ease: EASE_BROADCAST },
        }}
        exit={{
          clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          opacity: 0,
          transition: { duration: 0.35, ease: EASE_BROADCAST },
        }}
        className="relative w-[1140px] flex flex-col drop-shadow-[0_32px_75px_rgba(0,0,0,0.98)] select-none"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.03} />

        {/* Top Header Panel */}
        <div className="w-full h-[54px] bg-[#101B55] border-t-2 border-l-2 border-r-2 border-[#2A65F5] px-6 flex items-center justify-between relative overflow-hidden shadow-xl">
          <div className="flex items-center gap-3 relative z-10">
            {/* Brand Stamp */}
            <div className="bg-[#E6007A] text-[#FFD700] px-3.5 py-1 font-heavy text-[11px] font-black uppercase tracking-widest shadow-md">
              BENIDORM FEST 2025
            </div>

            {/* Header Title */}
            <span className="font-heavy text-[22px] font-black text-white uppercase tracking-wider">
              {title || 'CLASIFICACIÓN GENERAL'}
            </span>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            {/* Stage Title Badge */}
            <div className="bg-[#002BCC] text-[#8EDCFF] border border-[#2A65F5] px-3 py-1 font-heavy text-[12px] font-black uppercase tracking-wider">
              {show.stageTitle || 'GRAN FINAL'}
            </div>

            {/* Phase Badge */}
            <div className="bg-[#FFD700] text-[#0A1244] px-3 py-1 font-heavy text-[12px] font-black uppercase tracking-wider shadow-sm">
              {phaseLabel}
            </div>

            <SquareAccentStrip size={6} />
          </div>

          <StageCornerBracketPair size={8} thickness={2} color="#8EDCFF" />
        </div>

        {/* Rows Container */}
        <div
          style={{ gap: `${layout.gapPx}px` }}
          className="w-full bg-[#060A1D] border-x-2 border-b-2 border-[#2A65F5] p-3 shadow-2xl flex flex-col relative"
        >
          {displayList.map((participant, index) => {
            const isFirstPlace = index === 0;
            const isMoved = changedParticipantIds.has(participant.id);
            const rawName = (participant.name || participant.artist || '').toUpperCase();

            const currentPhaseScore =
              currentPhase === 'public'
                ? participant.publicScore
                : currentPhase === 'demoscopic'
                ? participant.demoscopicScore
                : participant.juryScore;

            const nameStyle = fitBF25Text(rawName, {
              maxContainerWidth: 540,
              baseFontSize: layout.fontSizeName,
              minFontSize: 14,
              charThreshold: 18,
              letterSpacingEm: 0.04,
            });

            const entranceDelay = hasEntered ? 0 : 0.4 + index * 0.07;

            return (
              <motion.div
                key={participant.id}
                layout
                layoutId={`classification-row-${participant.id}`}
                transition={{
                  duration: isMoved ? 1.4 : 0.45,
                  ease: EASE_BROADCAST,
                }}
                initial={
                  hasEntered
                    ? false
                    : {
                        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
                        x: -30,
                        opacity: 0,
                      }
                }
                animate={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                  x: 0,
                  opacity: 1,
                  transition: hasEntered
                    ? { duration: 0.45, ease: EASE_BROADCAST }
                    : { duration: 0.5, delay: entranceDelay, ease: EASE_BROADCAST },
                }}
                style={{ height: `${layout.rowHeightPx}px` }}
                className="relative flex items-stretch w-full overflow-hidden shadow-md select-none"
              >
                {/* 1. Rank Position Badge */}
                <div
                  style={{
                    width: `${Math.round(layout.rowHeightPx * 0.95)}px`,
                    fontSize: `${layout.fontSizeRank}px`,
                  }}
                  className={`shrink-0 flex items-center justify-center font-heavy font-black font-mono border-r ${
                    isFirstPlace
                      ? 'bg-[#FFD700] text-[#0A1244] border-[#FFE55C]'
                      : 'bg-[#0F1638] text-[#8EDCFF] border-[#2A65F5]/60'
                  }`}
                >
                  {String(participant.position).padStart(2, '0')}
                </div>

                {/* 2. Artist Emblem Icon */}
                <div
                  style={{ width: `${layout.rowHeightPx}px` }}
                  className="shrink-0 bg-[#0A0F26] border-r border-[#FF007A]/40 flex items-center justify-center relative overflow-hidden"
                >
                  <BF25ArtistIcon
                    size={Math.round(layout.rowHeightPx * 0.52)}
                    color={isFirstPlace ? '#FFD700' : '#FFFFFF'}
                  />
                </div>

                {/* 3. Hot Pink / Magenta Artist Name Container */}
                <div
                  className={`flex-1 flex items-center px-4 relative z-10 ${
                    isFirstPlace
                      ? 'bg-gradient-to-r from-[#FF007A] via-[#F00070] to-[#C7005D]'
                      : 'bg-gradient-to-r from-[#E6007A] via-[#CC006C] to-[#A30056]'
                  }`}
                >
                  <span
                    style={{
                      fontSize: `${nameStyle.fontSize}px`,
                      letterSpacing: nameStyle.letterSpacing,
                      lineHeight: 1.1,
                    }}
                    className="font-heavy font-black uppercase text-white truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                  >
                    {rawName}
                  </span>

                  {layout.showSongSubtitle && participant.song && (
                    <span className="font-heavy text-[12px] text-pink-200/90 ml-3 truncate uppercase tracking-wider font-semibold">
                      — {participant.song}
                    </span>
                  )}
                </div>

                {/* 4. Directional Chevron Pointer */}
                <div className="absolute right-[228px] top-0 bottom-0 flex items-center justify-center z-20 pointer-events-none">
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: `${Math.round(layout.rowHeightPx * 0.38)}px solid transparent`,
                      borderBottom: `${Math.round(layout.rowHeightPx * 0.38)}px solid transparent`,
                      borderLeft: '11px solid #FFD700',
                    }}
                  />
                </div>

                {/* 5. Phase Score Block (Royal Blue #002BCC) */}
                <div
                  style={{
                    width: '110px',
                    fontSize: `${layout.fontSizeScore}px`,
                  }}
                  className="shrink-0 bg-[#002BCC] border-l-2 border-[#2A65F5] flex items-center justify-center z-10"
                >
                  <span className="font-heavy font-black text-white tracking-tight drop-shadow-sm font-mono">
                    {currentPhaseScore}
                  </span>
                </div>

                {/* 6. Grand Total Score Block (Bright Yellow #FFD700) */}
                <div
                  style={{
                    width: '120px',
                    fontSize: `${Math.round(layout.fontSizeScore * 1.08)}px`,
                  }}
                  className="shrink-0 bg-[#FFD700] border-l-2 border-[#FFE55C] flex items-center justify-center z-10"
                >
                  <span className="font-heavy font-black text-[#0A1244] tracking-tight font-mono">
                    {participant.totalScore}
                  </span>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 right-0 z-20 pointer-events-none">
                  <CornerLBracket size={6} thickness={1.5} color="#0A1244" position="top-right" />
                </div>
                <div className="absolute bottom-0 right-0 z-20 pointer-events-none">
                  <CornerLBracket size={6} thickness={1.5} color="#0A1244" position="bottom-right" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Classification2025;
