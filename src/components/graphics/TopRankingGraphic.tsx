import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Show, ParticipantScore, ActiveVotingPhase } from '../../types/broadcast';
import {
  useRankingChoreography,
  RankingRowModule,
} from './primitives/RankingSharedEngine';
import {
  ChamferedBar,
  DirectionalLine,
  EASE_BROADCAST,
  EASE_EXIT,
} from './primitives/BenidormPrimitives';

interface TopRankingGraphicProps {
  show: Show;
  count?: 3 | 5 | 8 | 10;
  title?: string;
  highlightParticipantId?: string;
}

export const TopRankingGraphic: React.FC<TopRankingGraphicProps> = ({
  show,
  count = 5,
  title,
  highlightParticipantId,
}) => {
  const { participants, scores } = show;

  const activePhase: ActiveVotingPhase =
    show.activeVotingPhase ||
    (show.votingStage === 'demoscopic'
      ? 'demoscopic'
      : show.votingStage === 'public'
      ? 'public'
      : 'professionalJury');

  const { visualOrder, movingParticipantId, movingState, highlightedParticipantId } =
    useRankingChoreography(participants, scores, count, highlightParticipantId);

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex justify-end items-end p-20 z-20">
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
          x: 70,
          clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
          transition: { duration: 0.35, ease: EASE_EXIT },
        }}
        transition={{ duration: 0.55, ease: EASE_BROADCAST }}
        className="w-[640px] flex flex-col drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] gpu-layer"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-2">
          <ChamferedBar theme="navy" className="px-6 py-2 border-t-2 border-cyan-400">
            <span className="font-heavy text-[20px] tracking-widest text-white uppercase">
              {title || `TOP ${count} PROVISIONAL`}
            </span>
          </ChamferedBar>
          <ChamferedBar theme="white" className="px-5 py-2">
            <span className="font-heavy text-xs font-black text-black tracking-widest uppercase">
              TOTAL
            </span>
          </ChamferedBar>
        </div>

        {/* Rows with smooth FLIP layout animation */}
        <div className="flex flex-col gap-1.5 w-full">
          <AnimatePresence initial={false}>
            {visualOrder.map((p, index) => {
              const scoreData: ParticipantScore = scores[p.id] || {
                participantId: p.id,
                juryScore: 0,
                demoscopicScore: 0,
                publicScore: 0,
                totalScore: 0,
                position: index + 1,
                previousPosition: index + 1,
                juryVotes: {},
                votePhaseScores: { professionalJury: 0, demoscopic: 0, public: 0 },
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
                  compact={true}
                  showPhaseScore={false}
                />
              );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-2">
          <DirectionalLine color="cyan" />
        </div>
      </motion.div>
    </div>
  );
};
