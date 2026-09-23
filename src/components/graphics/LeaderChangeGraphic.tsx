import React from 'react';
import { motion } from 'motion/react';
import { Show, Participant, ParticipantScore } from '../../types/broadcast';
import { ArrowUp, Award } from 'lucide-react';
import {
  ChamferedBar,
  EASE_BROADCAST,
  EASE_EXIT,
  ScoreBlock,
} from './primitives/BenidormPrimitives';

interface LeaderChangeGraphicProps {
  show: Show;
  leaderId?: string;
  isNewLeader?: boolean;
}

export const LeaderChangeGraphic: React.FC<LeaderChangeGraphicProps> = ({
  show,
  leaderId,
  isNewLeader = true,
}) => {
  const { participants, scores } = show;

  const currentLeader =
    (leaderId ? participants.find((p) => p.id === leaderId) : null) ||
    participants.find((p) => scores[p.id]?.position === 1);

  const leaderScore: ParticipantScore | undefined = currentLeader
    ? scores[currentLeader.id]
    : undefined;

  if (!currentLeader) return null;

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex items-start justify-center pt-24 z-30">
      <motion.div
        initial={{
          y: -70,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        }}
        animate={{
          y: 0,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}
        exit={{
          y: -60,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          transition: { duration: 0.35, ease: EASE_EXIT },
        }}
        transition={{ duration: 0.52, ease: EASE_BROADCAST }}
        className="flex flex-col items-center drop-shadow-[0_18px_36px_rgba(0,0,0,0.9)] gpu-layer"
      >
        {/* Slanted Header Tag */}
        <div className="chamfer-slant bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 px-10 py-2 border-t-2 border-amber-300 shadow-xl flex items-center gap-2">
          <div className="chamfer-unslant flex items-center gap-2.5">
            <ArrowUp className="w-5 h-5 text-yellow-300" />
            <span className="font-heavy text-[22px] font-black tracking-widest text-white uppercase">
              {isNewLeader ? 'NUEVO LÍDER PROVISIONAL' : 'LÍDER PROVISIONAL'}
            </span>
            <Award className="w-5 h-5 text-yellow-300" />
          </div>
        </div>

        {/* Main Bar with Leader name and total */}
        <div className="flex items-center -mt-1 h-[68px]">
          {/* Rank #1 Pill */}
          <div className="chamfer-slant bg-amber-400 px-7 h-full flex items-center justify-center border-y border-white/60 z-10 shadow-lg">
            <span className="chamfer-unslant font-heavy font-mono-num text-[36px] font-black text-black leading-none">
              #1
            </span>
          </div>

          {/* Name Bar */}
          <div className="chamfer-slant bg-gradient-to-r from-[#0d0f28] via-[#1a1744] to-[#0d0f28] px-12 h-full flex items-center -ml-2.5 border-y border-purple-500/50 shadow-2xl">
            <div className="chamfer-unslant flex items-baseline gap-4">
              <span className="font-heavy text-[36px] font-black tracking-wide text-white uppercase leading-none">
                {currentLeader.name || currentLeader.artist}
              </span>
              {currentLeader.song && (
                <span className="font-broadcast text-[20px] font-semibold text-purple-300">
                  «{currentLeader.song}»
                </span>
              )}
            </div>
          </div>

          {/* White Total Score */}
          <div className="chamfer-slant bg-white px-8 h-full flex items-center justify-center -ml-2.5 shadow-2xl z-10 border-y border-slate-200">
            <div className="chamfer-unslant flex items-baseline gap-1.5">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">
                PTS
              </span>
              <span className="font-heavy font-mono-num text-[36px] font-black text-black leading-none">
                {leaderScore?.totalScore ?? 0}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
