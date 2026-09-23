import React from 'react';
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
  THEME_STYLES,
} from './primitives/BenidormPrimitives';

interface ClassificationGraphicProps {
  show: Show;
  count?: number; // e.g. 3, 5, 8, 16, or undefined for all active
  title?: string;
  highlightParticipantId?: string;
}

/**
 * BROADCAST CLASSIFICATION GENERAL TV GRAPHIC
 * - Consumes the SAME shared RankingSharedEngine as the Scoreboard Split Screen
 * - Identical row geometry, layout transitions, active coral highlights, 5s lifetime
 * - Adaptive multi-column presentation for 8+ participants
 * - Independent visual order vs data order during 3-stage choreography
 * - Completely decoupled from Live Bug (zero duplicate bugs)
 */
export const ClassificationGraphic: React.FC<ClassificationGraphicProps> = ({
  show,
  count,
  title,
  highlightParticipantId,
}) => {
  const { participants, scores, stageTitle } = show;

  const activePhase: ActiveVotingPhase =
    show.activeVotingPhase ||
    (show.votingStage === 'demoscopic'
      ? 'demoscopic'
      : show.votingStage === 'public'
      ? 'public'
      : 'professionalJury');

  const phaseLabel =
    activePhase === 'demoscopic'
      ? 'DEMOSCÓPICO'
      : activePhase === 'public'
      ? 'PÚBLICO'
      : 'JURADO';

  const { visualOrder, movingParticipantId, movingState, highlightedParticipantId } =
    useRankingChoreography(participants, scores, count, highlightParticipantId);

  const isMultiCol = visualOrder.length > 8;
  const col1 = isMultiCol ? visualOrder.slice(0, Math.ceil(visualOrder.length / 2)) : visualOrder;
  const col2 = isMultiCol ? visualOrder.slice(Math.ceil(visualOrder.length / 2)) : [];

  const rowsPerCol = isMultiCol ? col1.length : visualOrder.length;
  const dynamicLayout = calculateDynamicRankingLayout(rowsPerCol, 840);

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden select-none pointer-events-none flex flex-col justify-center items-center px-24 py-12">
      
      {/* Centered Classification Graphic Canvas */}
      <motion.div
        initial={{
          y: 70,
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        }}
        animate={{
          y: 0,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}
        exit={{
          y: 60,
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        }}
        transition={{ duration: 0.58, ease: EASE_BROADCAST }}
        className={`flex flex-col ${isMultiCol ? 'w-[1680px]' : 'w-[1180px]'} z-10`}
      >
        {/* Main Broadcast Header Banner */}
        <div className="flex items-end justify-between mb-4 px-2">
          <div className="flex items-center gap-3">
            <ChamferedBar theme="navy" className="px-7 py-2.5 shadow-xl">
              <span className="font-heavy text-[22px] tracking-widest text-white uppercase">
                {title || 'CLASIFICACIÓN GENERAL'}
              </span>
            </ChamferedBar>
            <ChamferedBar theme="deepPurple" className="px-5 py-2.5 shadow-xl">
              <span className="font-broadcast text-xs font-bold tracking-widest text-purple-200 uppercase">
                {stageTitle || 'BENIDORM FEST'}
              </span>
            </ChamferedBar>
          </div>

          {/* Right Phase & Total Indicator Badges */}
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
              <span className="font-heavy text-base font-black tracking-widest uppercase">
                {phaseLabel}
              </span>
            </ChamferedBar>
            <ChamferedBar theme="white" className="px-7 py-2.5 shadow-xl">
              <span className="font-heavy text-base font-black tracking-widest uppercase text-black">
                TOTAL
              </span>
            </ChamferedBar>
          </div>
        </div>

        {/* Rows Presentation: Single Column or Dual Columns */}
        {isMultiCol ? (
          <div className="grid grid-cols-2 gap-8 w-full">
            {/* Column 1 */}
            <div className="flex flex-col" style={{ gap: `${dynamicLayout.gapPx}px` }}>
              <AnimatePresence initial={false}>
                {col1.map((p, idx) => {
                  const scoreData: ParticipantScore = scores[p.id] || {
                    participantId: p.id,
                    juryScore: 0,
                    demoscopicScore: 0,
                    publicScore: 0,
                    totalScore: 0,
                    position: idx + 1,
                    previousPosition: idx + 1,
                    juryVotes: {},
                  };

                  return (
                    <RankingRowModule
                      key={p.id}
                      participant={p}
                      scoreData={scoreData}
                      activePhase={activePhase}
                      isHighlighted={highlightedParticipantId === p.id}
                      isMoving={movingParticipantId === p.id}
                      isExiting={movingParticipantId === p.id && movingState === 'exiting'}
                      isEntering={movingParticipantId === p.id && movingState === 'entering'}
                      isHiddenInTransit={movingParticipantId === p.id && movingState === 'rearranging'}
                      dynamicLayout={dynamicLayout}
                      showPhaseScore={true}
                    />
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col" style={{ gap: `${dynamicLayout.gapPx}px` }}>
              <AnimatePresence initial={false}>
                {col2.map((p, idx) => {
                  const globalIdx = col1.length + idx;
                  const scoreData: ParticipantScore = scores[p.id] || {
                    participantId: p.id,
                    juryScore: 0,
                    demoscopicScore: 0,
                    publicScore: 0,
                    totalScore: 0,
                    position: globalIdx + 1,
                    previousPosition: globalIdx + 1,
                    juryVotes: {},
                  };

                  return (
                    <RankingRowModule
                      key={p.id}
                      participant={p}
                      scoreData={scoreData}
                      activePhase={activePhase}
                      isHighlighted={highlightedParticipantId === p.id}
                      isMoving={movingParticipantId === p.id}
                      isExiting={movingParticipantId === p.id && movingState === 'exiting'}
                      isEntering={movingParticipantId === p.id && movingState === 'entering'}
                      isHiddenInTransit={movingParticipantId === p.id && movingState === 'rearranging'}
                      dynamicLayout={dynamicLayout}
                      showPhaseScore={true}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full" style={{ gap: `${dynamicLayout.gapPx}px` }}>
            <AnimatePresence initial={false}>
              {visualOrder.map((p, idx) => {
                const scoreData: ParticipantScore = scores[p.id] || {
                  participantId: p.id,
                  juryScore: 0,
                  demoscopicScore: 0,
                  publicScore: 0,
                  totalScore: 0,
                  position: idx + 1,
                  previousPosition: idx + 1,
                  juryVotes: {},
                };

                return (
                  <RankingRowModule
                    key={p.id}
                    participant={p}
                    scoreData={scoreData}
                    activePhase={activePhase}
                    isHighlighted={highlightedParticipantId === p.id}
                    isMoving={movingParticipantId === p.id}
                    isExiting={movingParticipantId === p.id && movingState === 'exiting'}
                    isEntering={movingParticipantId === p.id && movingState === 'entering'}
                    isHiddenInTransit={movingParticipantId === p.id && movingState === 'rearranging'}
                    dynamicLayout={dynamicLayout}
                    showPhaseScore={true}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Bottom Horizontal Accent Line */}
        <div className="mt-4">
          <DirectionalLine color="cyan" />
        </div>
      </motion.div>
    </div>
  );
};
