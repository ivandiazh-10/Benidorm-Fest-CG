import React from 'react';
import { motion } from 'motion/react';
import { Participant, ParticipantScore, Show } from '../../types/broadcast';
import { BenidormBug, EASE_BROADCAST, EASE_EXIT } from './primitives/BenidormPrimitives';

interface CurrentScoreGraphicProps {
  show: Show;
  participant?: Participant;
  participantId?: string;
}

export const CurrentScoreGraphic: React.FC<CurrentScoreGraphicProps> = ({
  show,
  participant: propParticipant,
  participantId: propParticipantId,
}) => {
  const participant =
    propParticipant ||
    (propParticipantId
      ? show.participants.find((p) => p.id === propParticipantId)
      : show.participants[0]);

  if (!participant) return null;

  const scoreData: ParticipantScore = show.scores[participant.id] || {
    participantId: participant.id,
    juryScore: 0,
    demoscopicScore: 0,
    publicScore: 0,
    totalScore: 0,
    position: 1,
    previousPosition: 1,
    juryVotes: {},
    votePhaseScores: { professionalJury: 0, demoscopic: 0, public: 0 },
  };

  const juryPts = scoreData.votePhaseScores?.professionalJury ?? scoreData.juryScore ?? 0;
  const demoPts = scoreData.votePhaseScores?.demoscopic ?? scoreData.demoscopicScore ?? 0;
  const pubPts = scoreData.votePhaseScores?.public ?? scoreData.publicScore ?? 0;
  const totalPts = scoreData.totalScore;
  const pos = scoreData.position;

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-end items-center pb-20 z-30">
      <motion.div
        initial={{
          y: 40,
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        }}
        animate={{
          y: 0,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}
        exit={{
          y: 30,
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
          transition: { duration: 0.32, ease: EASE_EXIT },
        }}
        transition={{ duration: 0.5, ease: EASE_BROADCAST }}
        className="w-[900px] flex flex-col drop-shadow-[0_16px_40px_rgba(0,0,0,0.92)] gpu-layer mx-auto"
      >
        {/* Top Header Tag */}
        <div className="flex items-center gap-3 mb-1 ml-4">
          <div className="chamfer-slant bg-cyan-400 text-black px-4 py-1 font-mono text-xs font-black uppercase tracking-wider">
            <span className="chamfer-unslant">DESGLOSE DE PUNTUACIÓN</span>
          </div>
        </div>

        {/* Main Composite Card */}
        <div className="chamfer-slant bg-gradient-to-r from-[#070b20] via-[#0d1436] to-[#070b20] border-2 border-indigo-900/90 shadow-2xl p-6">
          <div className="chamfer-unslant flex items-center justify-between gap-6">
            
            {/* Left: Position and Artist */}
            <div className="flex items-center gap-4 flex-1 truncate">
              <div className="chamfer-slant bg-amber-400 text-black w-14 h-14 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="chamfer-unslant font-heavy font-mono-num text-[32px] font-black leading-none">
                  {pos}
                </span>
              </div>

              <div className="flex flex-col truncate">
                <span className="font-heavy text-[32px] font-black text-white uppercase truncate leading-tight">
                  {participant.name || participant.artist}
                </span>
                <span className="font-broadcast text-sm text-cyan-300 uppercase truncate">
                  «{participant.song}»
                </span>
              </div>
            </div>

            {/* Right: 3 Phases + Total Block */}
            <div className="flex items-center gap-3">
              {/* Jurado */}
              <div className="chamfer-slant bg-[#180d32] border border-purple-500/40 px-4 py-2 text-center min-w-[85px]">
                <div className="chamfer-unslant">
                  <span className="block text-[10px] font-mono text-purple-300 font-bold uppercase">
                    JURADO
                  </span>
                  <span className="font-heavy font-mono-num text-[22px] font-black text-white">
                    {juryPts}
                  </span>
                </div>
              </div>

              {/* Demoscópico */}
              <div className="chamfer-slant bg-[#0b2034] border border-cyan-500/40 px-4 py-2 text-center min-w-[85px]">
                <div className="chamfer-unslant">
                  <span className="block text-[10px] font-mono text-cyan-300 font-bold uppercase">
                    DEMOSC.
                  </span>
                  <span className="font-heavy font-mono-num text-[22px] font-black text-white">
                    {demoPts}
                  </span>
                </div>
              </div>

              {/* Televoto */}
              <div className="chamfer-slant bg-[#300b1a] border border-rose-500/40 px-4 py-2 text-center min-w-[85px]">
                <div className="chamfer-unslant">
                  <span className="block text-[10px] font-mono text-rose-300 font-bold uppercase">
                    PÚBLICO
                  </span>
                  <span className="font-heavy font-mono-num text-[22px] font-black text-white">
                    {pubPts}
                  </span>
                </div>
              </div>

              {/* Total Pts Pill */}
              <div className="chamfer-slant bg-white text-black px-6 py-2 text-center shadow-xl min-w-[110px] border-y border-slate-200">
                <div className="chamfer-unslant">
                  <span className="block text-[10px] font-mono text-slate-600 font-black uppercase">
                    TOTAL
                  </span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-heavy font-mono-num text-[28px] font-black text-black leading-none">
                      {totalPts}
                    </span>
                    <span className="text-[11px] font-black font-broadcast uppercase">PTS</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};
