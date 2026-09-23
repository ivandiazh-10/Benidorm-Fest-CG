import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveVotingPhase, ParticipantScore, Show } from '../../types/broadcast';
import {
  useRankingChoreography,
  RankingRowModule,
  calculateDynamicRankingLayout,
} from './primitives/RankingSharedEngine';
import {
  ChamferedBar,
  DirectionalLine,
  EASE_BROADCAST,
} from './primitives/BenidormPrimitives';
import { Tv } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScoreboardGraphicProps {
  show: Show;
  isSplitScreen?: boolean;
  maxDisplayCount?: number;
  highlightParticipantId?: string;
  stageLabel?: string;
  overrideActivePoints?: number;
}

export const ScoreboardGraphic: React.FC<ScoreboardGraphicProps> = ({
  show,
  isSplitScreen = true,
  maxDisplayCount,
  highlightParticipantId,
  stageLabel,
}) => {
  const { participants, scores, videoSourceUrl, stageTitle } = show;

  const activePhase: ActiveVotingPhase =
    show.activeVotingPhase ||
    (show.votingStage === 'demoscopic'
      ? 'demoscopic'
      : show.votingStage === 'public'
      ? 'public'
      : 'professionalJury');

  const phaseColumnLabel =
    activePhase === 'demoscopic'
      ? 'DEMOSCÓPICO'
      : activePhase === 'public'
      ? 'PÚBLICO'
      : 'JURADO';

  // Shared ranking choreography engine (Choreographed physical movements, zero persistent highlights)
  const { visualOrder, movingParticipantId, movingState, highlightedParticipantId } =
    useRankingChoreography(participants, scores, maxDisplayCount, highlightParticipantId);

  // Dynamic layout calculation ensures all participants fit between top safe and bottom safe zone
  const dynamicLayout = calculateDynamicRankingLayout(
    visualOrder.length,
    isSplitScreen ? 860 : 890
  );

  // Optional 12-point celebration
  useEffect(() => {
    if (show.activeReveal?.pointsAwarded === 12 && activePhase === 'professionalJury') {
      try {
        confetti({
          particleCount: 50,
          spread: 75,
          origin: { y: 0.6, x: 0.35 },
          colors: ['#f59e0b', '#fbbf24', '#ffffff', '#00e5ff'],
          zIndex: 9999,
          ticks: 100,
        });
      } catch {
        // ignore
      }
    }
  }, [show.activeReveal?.revealedAt, activePhase]);

  // Find active participant receiving points to spotlight on the video standby screen
  const spotlightParticipant =
    participants.find((p) => p.id === highlightedParticipantId) ||
    participants.find((p) => p.id === visualOrder[0]?.id);

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden select-none pointer-events-none">
      
      {/* Container: Split Screen vs Fullscreen layout */}
      <div
        className={`w-full h-full flex ${
          isSplitScreen
            ? 'px-16 pt-14 pb-14 justify-between items-center'
            : 'justify-center items-center p-20'
        }`}
      >
        {/* =========================================================================
            LEFT COLUMN: SCOREBOARD TABLE (Strictly Zero Fades — Masked Geometric Entrance)
            ========================================================================= */}
        <motion.div
          initial={{
            x: -80,
            clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
          }}
          animate={{
            x: 0,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
          exit={{
            x: -70,
            clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
          }}
          transition={{ duration: 0.58, ease: EASE_BROADCAST }}
          className={`flex flex-col ${isSplitScreen ? 'w-[1040px]' : 'w-[1240px]'} z-10`}
        >
          {/* Header Row: Stage Title (Left) + Animated Phase Category Badge (Right) */}
          <div className="flex items-end justify-between mb-3 px-1">
            <ChamferedBar theme="navy" className="px-6 py-2.5 shadow-lg">
              <span className="font-heavy text-[18px] md:text-[20px] font-black tracking-widest text-slate-100 uppercase">
                {stageLabel || stageTitle || 'BENIDORM FEST'} • CLASIFICACIÓN
              </span>
            </ChamferedBar>

            <div className="flex items-center gap-2.5">
              <ChamferedBar
                theme={
                  activePhase === 'professionalJury'
                    ? 'purple'
                    : activePhase === 'demoscopic'
                    ? 'cyan'
                    : 'gold'
                }
                className="px-7 py-2.5 shadow-xl"
              >
                <span className="font-heavy text-[17px] font-black tracking-widest uppercase">
                  {phaseColumnLabel}
                </span>
              </ChamferedBar>
              <ChamferedBar theme="white" className="px-7 py-2.5 shadow-xl">
                <span className="font-heavy text-[17px] font-black tracking-widest uppercase text-black">
                  TOTAL
                </span>
              </ChamferedBar>
            </div>
          </div>

          {/* Ranking Rows Stack with mathematically calculated safe area distribution */}
          <div
            className="flex flex-col w-full"
            style={{ gap: `${dynamicLayout.gapPx}px` }}
          >
            <AnimatePresence initial={false}>
              {visualOrder.map((participant, index) => {
                const scoreData: ParticipantScore = scores[participant.id] || {
                  participantId: participant.id,
                  juryScore: 0,
                  demoscopicScore: 0,
                  publicScore: 0,
                  totalScore: 0,
                  position: index + 1,
                  previousPosition: index + 1,
                  juryVotes: {},
                  votePhaseScores: { professionalJury: 0, demoscopic: 0, public: 0 },
                };

                const isHighlighted = highlightedParticipantId === participant.id;
                const isMoving = movingParticipantId === participant.id;
                const isExiting = isMoving && movingState === 'exiting';
                const isEntering = isMoving && movingState === 'entering';
                const isHiddenInTransit = isMoving && movingState === 'rearranging';

                return (
                  <RankingRowModule
                    key={participant.id}
                    participant={participant}
                    scoreData={scoreData}
                    activePhase={activePhase}
                    isHighlighted={isHighlighted}
                    isMoving={isMoving}
                    isExiting={isExiting}
                    isEntering={isEntering}
                    isHiddenInTransit={isHiddenInTransit}
                    dynamicLayout={dynamicLayout}
                    showPhaseScore={true}
                    showPositionNumber={false}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {/* Bottom subtle directional hairline */}
          <div className="mt-3">
            <DirectionalLine color="purple" />
          </div>
        </motion.div>

        {/* =========================================================================
            RIGHT COLUMN: INDEPENDENT 16:9 VIDEO & MEDIA AREA (Split Screen Only)
            Masked directional geometric entrance — NO FADES
            ========================================================================= */}
        {isSplitScreen && (
          <motion.div
            initial={{
              x: 80,
              clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
            }}
            animate={{
              x: 0,
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            }}
            exit={{
              x: 60,
              clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
            }}
            transition={{ duration: 0.62, ease: EASE_BROADCAST }}
            className="w-[720px] flex flex-col z-10"
          >
            {/* 16:9 Video Frame with Chamfered Frame Element */}
            <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-purple-500/40 bg-[#080414] shadow-2xl shadow-purple-950/80">
              {videoSourceUrl ? (
                <iframe
                  src={videoSourceUrl}
                  className="w-full h-full object-cover pointer-events-none"
                  title="Broadcast Media Feed"
                  allow="autoplay; encrypted-media"
                />
              ) : (
                /* Intentional High-End Television Stage Fallback */
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_50%_45%,_rgba(109,40,217,0.3)_0%,_rgba(10,4,28,0.95)_75%,_#05020f_100%)]">
                  {/* Atmospheric Light Rays */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-full bg-gradient-to-b from-cyan-400/30 to-transparent blur-2xl" />
                    <div className="absolute top-0 right-1/4 w-96 h-full bg-gradient-to-b from-purple-500/30 to-transparent blur-2xl" />
                  </div>

                  {/* Standby Camera Framing Elements (Static clean broadcast style) */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    <span className="font-mono text-[12px] font-bold tracking-widest text-slate-300 uppercase">
                      CÁMARA VIVO • SEÑAL 01
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="font-mono text-[12px] font-bold tracking-widest text-purple-300/90 uppercase">
                      1080p50 • BENIDORM
                    </span>
                  </div>

                  {/* Center Spotlight Artist or Festival Brand */}
                  {spotlightParticipant ? (
                    <div className="flex flex-col items-center text-center z-10 max-w-lg">
                      <div className="chamfer-slant bg-gradient-to-r from-[#6d28d9] to-[#00e5ff] px-5 py-1.5 mb-3.5 shadow-lg">
                        <span className="chamfer-unslant font-mono text-[12px] font-black text-black tracking-widest uppercase">
                          CANDIDATURA #{String(spotlightParticipant.performanceNumber).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="font-heavy text-[44px] font-black uppercase text-white tracking-tight leading-none drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)]">
                        {spotlightParticipant.name || spotlightParticipant.artist}
                      </h3>
                      {spotlightParticipant.song && (
                        <p className="font-broadcast text-[22px] text-cyan-300 font-bold uppercase tracking-wider mt-2.5">
                          «{spotlightParticipant.song}»
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 z-10">
                      <Tv className="w-14 h-14 text-purple-400 opacity-60" />
                      <span className="font-heavy text-2xl uppercase tracking-widest text-slate-300">
                        BENIDORM FEST
                      </span>
                    </div>
                  )}

                  {/* Corner Target Marks */}
                  <div className="absolute bottom-4 left-4 font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    SAFE 16:9 • BROADCAST
                  </div>
                  <div className="absolute bottom-4 right-4 font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    ESCENARIO PRINCIPAL
                  </div>
                </div>
              )}

              {/* Broadcast safe inner corner border accents */}
              <div className="absolute inset-0 pointer-events-none border border-cyan-400/20" />
            </div>

            {/* Video Sub-caption Bar */}
            <div className="flex items-center justify-between mt-3 px-2">
              <span className="font-broadcast text-[14px] font-bold tracking-wider text-purple-200 uppercase">
                {spotlightParticipant
                  ? `${spotlightParticipant.name || spotlightParticipant.artist} • SEÑAL EN DIRECTO`
                  : 'ESCENARIO BENIDORM FEST'}
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[11px] font-black text-slate-300 uppercase tracking-wider">
                  FEED ACTIVO
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
