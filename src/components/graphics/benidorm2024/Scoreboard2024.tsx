import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Participant, ParticipantScore, Show } from '../../../types/broadcast';
import { calculateRankings } from '../../../utils/scoringEngine';
import { ArtistEmblem2024, LiveBug2024, SAFE_LEFT } from './Benidorm2024Primitives';
import { Benidorm2024Background } from './Benidorm2024Background';

interface Scoreboard2024Props {
  show: Show;
  isSplitScreen?: boolean;
  maxDisplayCount?: number;
  stageLabel?: string;
}

interface RowState {
  participant: Participant;
  score: ParticipantScore;
  rank: number;
}

const BROADCAST_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * BENIDORM FEST 2024 OFFICIAL BROADCAST SCOREBOARD
 * Reconstructed accurately from Screenshot 1:
 * - Left side safe-area alignment
 * - Connected dual-pill header ("Final" --- "Voto del jurado")
 * - 8 rows with circular artist emblem, white-outlined artist pill, dot indicators, and yellow score pill
 * - Event-driven blue points-awarded animation
 * - Smooth FLIP ranking transitions without bounce or teleportation
 */
export const Scoreboard2024: React.FC<Scoreboard2024Props> = ({
  show,
  isSplitScreen = true,
  maxDisplayCount = 8,
  stageLabel,
}) => {
  // Authoritative ranking calculation
  const rankedData = React.useMemo(() => {
    const { rankedParticipants } = calculateRankings(show.participants, show.scores);
    // Filter out removed or non-competition participants
    const activeRanking = rankedParticipants.filter(
      (r) => !r.isRemovedFromCompetition && r.category !== 'special_interval'
    );
    return activeRanking.slice(0, maxDisplayCount);
  }, [show.participants, show.scores, maxDisplayCount]);

  // Track previous scores to detect score award events
  const prevScoresRef = useRef<Record<string, number>>({});
  const [highlightedParticipantId, setHighlightedParticipantId] = useState<string | null>(null);
  const [movingParticipantId, setMovingParticipantId] = useState<string | null>(null);

  useEffect(() => {
    // Detect which participant received points
    let awardedId: string | null = null;
    rankedData.forEach((row) => {
      const pId = row.id;
      const prev = prevScoresRef.current[pId] ?? 0;
      const curr = row.totalScore;
      if (curr > prev && prevScoresRef.current[pId] !== undefined) {
        awardedId = pId;
      }
      prevScoresRef.current[pId] = curr;
    });

    if (awardedId) {
      setHighlightedParticipantId(awardedId);
      setMovingParticipantId(awardedId);
      const timer = setTimeout(() => {
        setHighlightedParticipantId(null);
        setMovingParticipantId(null);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [rankedData]);

  // Determine current phase label
  const phaseLabel = React.useMemo(() => {
    if (stageLabel) return stageLabel;
    if (show.activeVotingPhase === 'demoscopic') return 'Voto demoscópico';
    if (show.activeVotingPhase === 'public') return 'Televoto';
    if (show.votingStage === 'results' || show.votingStage === 'winner') return 'Puntuación final';
    return 'Voto del jurado';
  }, [stageLabel, show.activeVotingPhase, show.votingStage]);

  const showTitle = show.stageTitle || 'Final';

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden pointer-events-none select-none z-20">
      {/* Full Background if not in split screen (in split screen, right camera box is clear) */}
      {!isSplitScreen ? (
        <Benidorm2024Background variant="scoreboard" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-[#101044]/95 via-[#151A75]/90 to-transparent w-[1100px] pointer-events-none" />
      )}

      {/* Main Scoreboard Left Chassis */}
      <div
        style={{
          position: 'absolute',
          left: `${SAFE_LEFT}px`,
          top: '160px',
          width: '740px',
        }}
        className="flex flex-col"
      >
        {/* Connected Header Capsules: "Final" --- "Voto del jurado" */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: BROADCAST_EASE }}
          className="flex items-center mb-6 pl-1"
        >
          {/* Left Pill: Stage (e.g. "Final") */}
          <div className="h-[46px] px-7 rounded-full bg-[#0E1342] border-2 border-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <span className="font-sans font-bold text-white text-[19px] tracking-wide">
              {showTitle}
            </span>
          </div>

          {/* Connecting Line */}
          <div className="w-8 h-[2px] bg-white opacity-90 shrink-0" />

          {/* Right Pill: Phase (e.g. "Voto del jurado") with bright yellow text */}
          <div className="h-[46px] px-8 rounded-full bg-[#0E1342] border-2 border-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <span className="font-sans font-extrabold text-[#FFD900] text-[19px] tracking-wide">
              {phaseLabel}
            </span>
          </div>
        </motion.div>

        {/* Rows Container */}
        <div className="flex flex-col gap-3.5">
          <AnimatePresence initial={false}>
            {rankedData.map((row, index) => {
              const isHighlighted = highlightedParticipantId === row.id;
              const isMoving = movingParticipantId === row.id;

              return (
                <motion.div
                  key={row.id}
                  layout="position"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{
                    opacity: isMoving ? [0.4, 1] : 1,
                    x: 0,
                    scale: isHighlighted ? [1, 1.025, 1] : 1,
                  }}
                  transition={{
                    layout: { duration: 0.75, ease: BROADCAST_EASE },
                    duration: 0.5,
                    delay: index * 0.04,
                  }}
                  className="flex items-center"
                >
                  {/* Circular Artist Emblem */}
                  <div className="shrink-0 mr-3.5 relative">
                    <ArtistEmblem2024
                      artist={row.artist}
                      size={44}
                      className={isHighlighted ? 'ring-2 ring-[#23D9D2] ring-offset-2 ring-offset-[#0A0E2A]' : ''}
                    />
                  </div>

                  {/* Artist Name Container (Rounded white outlined capsule) */}
                  <div
                    style={{ width: '310px' }}
                    className={`h-[46px] rounded-full border-2 flex items-center px-5 transition-colors duration-400 shadow-[0_4px_16px_rgba(0,0,0,0.5)] ${
                      isHighlighted
                        ? 'border-[#23D9D2] bg-gradient-to-r from-[#2927F5] to-[#151A75] text-white shadow-[0_0_20px_rgba(35,217,210,0.6)]'
                        : 'border-white bg-[#0E1342] text-white'
                    }`}
                  >
                    <span className="font-sans font-extrabold text-[20px] tracking-tight truncate drop-shadow-sm">
                      {row.artist}
                    </span>
                  </div>

                  {/* Three Circular Dot Indicators */}
                  <div className="flex items-center gap-2.5 mx-4 shrink-0">
                    <div
                      className={`w-[26px] h-[26px] rounded-full border-2 transition-all duration-300 ${
                        isHighlighted
                          ? 'border-[#23D9D2] bg-[#2927F5]/80 shadow-[0_0_8px_#23D9D2]'
                          : 'border-white/80 bg-transparent'
                      }`}
                    />
                    <div
                      className={`w-[26px] h-[26px] rounded-full border-2 transition-all duration-300 ${
                        isHighlighted
                          ? 'border-[#23D9D2] bg-[#2927F5]/80 shadow-[0_0_8px_#23D9D2]'
                          : 'border-white/80 bg-transparent'
                      }`}
                    />
                    <div
                      className={`w-[26px] h-[26px] rounded-full border-2 transition-all duration-300 ${
                        isHighlighted
                          ? 'border-[#FFD900] bg-[#FFD900]/40 shadow-[0_0_8px_#FFD900]'
                          : 'border-white/80 bg-transparent'
                      }`}
                    />
                  </div>

                  {/* Score Pill: White outlined capsule with bright yellow bold score */}
                  <div
                    style={{ minWidth: '76px' }}
                    className={`h-[46px] px-5 rounded-full border-2 flex items-center justify-center transition-all duration-400 shadow-[0_4px_16px_rgba(0,0,0,0.6)] ${
                      isHighlighted
                        ? 'border-[#FFD900] bg-[#101044] shadow-[0_0_22px_rgba(255,217,0,0.8)] scale-105'
                        : 'border-white bg-[#0E1342]'
                    }`}
                  >
                    <span className="font-sans font-black text-[#FFD900] text-[22px] tabular-nums tracking-tight">
                      {row.totalScore}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Benidorm Fest 2024 Bug in Bottom-Left Corner */}
      <LiveBug2024 />
    </div>
  );
};

export default Scoreboard2024;
