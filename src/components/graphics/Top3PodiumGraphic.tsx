import React from 'react';
import { motion } from 'motion/react';
import { Participant, ParticipantScore, Show } from '../../types/broadcast';
import { BenidormBug, EASE_BROADCAST, EASE_EXIT } from './primitives/BenidormPrimitives';

interface Top3PodiumGraphicProps {
  show: Show;
  title?: string;
}

export const Top3PodiumGraphic: React.FC<Top3PodiumGraphicProps> = ({
  show,
  title = 'PODIO PROVISIONAL TOP 3',
}) => {
  const { participants, scores, stageTitle } = show;

  // Filter out removed participants
  const activeParticipants = participants.filter((p) => !p.isRemovedFromCompetition);

  const sorted = [...activeParticipants].sort((a, b) => {
    const posA = scores[a.id]?.position ?? 999;
    const posB = scores[b.id]?.position ?? 999;
    return posA - posB;
  });

  const p1 = sorted[0];
  const p2 = sorted[1];
  const p3 = sorted[2];

  const getScore = (p?: Participant): ParticipantScore => {
    if (!p) {
      return {
        participantId: '',
        juryScore: 0,
        demoscopicScore: 0,
        publicScore: 0,
        totalScore: 0,
        position: 0,
        previousPosition: 0,
        juryVotes: {},
      };
    }
    return (
      scores[p.id] || {
        participantId: p.id,
        juryScore: 0,
        demoscopicScore: 0,
        publicScore: 0,
        totalScore: 0,
        position: 1,
        previousPosition: 1,
        juryVotes: {},
      }
    );
  };

  const s1 = getScore(p1);
  const s2 = getScore(p2);
  const s3 = getScore(p3);

  // Helper for rendering each podium pillar
  const renderPillar = (
    p: Participant | undefined,
    score: ParticipantScore,
    rank: 1 | 2 | 3,
    heightClass: string,
    delay: number
  ) => {
    if (!p) return <div className="w-1/3" />;

    const isGold = rank === 1;
    const isSilver = rank === 2;
    const isBronze = rank === 3;

    const rankColor = isGold
      ? 'from-amber-400 via-yellow-300 to-amber-500 text-black border-amber-200'
      : isSilver
      ? 'from-slate-200 via-white to-slate-300 text-black border-slate-100'
      : 'from-amber-700 via-orange-600 to-amber-800 text-white border-orange-400';

    const bgGradient = isGold
      ? 'from-[#231505] via-[#1a1104] to-[#0c0802] border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
      : isSilver
      ? 'from-[#141724] via-[#0d101c] to-[#070912] border-slate-400/60'
      : 'from-[#211009] via-[#140b07] to-[#0a0504] border-orange-600/60';

    return (
      <motion.div
        initial={{
          y: 60,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        }}
        animate={{
          y: 0,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ delay, duration: 0.52, ease: EASE_BROADCAST }}
        className="flex-1 flex flex-col items-center justify-end gpu-layer"
      >
        {/* Upper Info Box */}
        <div className="w-full max-w-[340px] mb-3 text-center flex flex-col items-center">
          {/* Position Badge */}
          <div
            className={`chamfer-slant bg-gradient-to-r ${rankColor} px-6 py-1.5 shadow-xl border mb-2`}
          >
            <span className="chamfer-unslant font-heavy font-mono-num text-[28px] font-black leading-none">
              #{rank} {isGold ? 'LÍDER' : ''}
            </span>
          </div>

          <h3 className="font-heavy text-[26px] font-black text-white uppercase tracking-wide truncate w-full">
            {p.name || p.artist}
          </h3>
          <p className="font-broadcast text-xs text-purple-300 uppercase truncate w-full">
            «{p.song}»
          </p>
        </div>

        {/* Podium Block */}
        <div
          className={`w-full max-w-[340px] ${heightClass} chamfer-slant bg-gradient-to-b ${bgGradient} border-2 p-5 flex flex-col justify-between items-center shadow-2xl relative overflow-hidden`}
        >
          {/* Top highlight bar */}
          <div
            className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${rankColor}`}
          />

          <div className="chamfer-unslant flex flex-col items-center text-center mt-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-widest">
              PUNTUACIÓN TOTAL
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-heavy font-mono-num text-[44px] font-black text-white leading-none">
                {score.totalScore}
              </span>
              <span className="font-broadcast text-xs font-black text-cyan-400">PTS</span>
            </div>
          </div>

          <div className="chamfer-unslant w-full pt-3 border-t border-white/10 flex justify-between text-[11px] font-mono text-slate-400 uppercase">
            <span>J: {score.juryScore}</span>
            <span>D: {score.demoscopicScore}</span>
            <span>T: {score.publicScore}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      }}
      animate={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      }}
      exit={{
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        transition: { duration: 0.35, ease: EASE_EXIT },
      }}
      transition={{ duration: 0.55, ease: EASE_BROADCAST }}
      className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-between px-24 py-16 z-30 overflow-hidden gpu-layer"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-500/40 max-w-6xl mx-auto w-full">
        <div className="chamfer-slant bg-gradient-to-r from-[#180838] via-[#2d115e] to-[#180838] border border-purple-400/50 px-6 py-2 shadow-xl">
          <span className="chamfer-unslant block font-broadcast text-[26px] font-black tracking-wider text-white uppercase drop-shadow-md">
            {title}
          </span>
        </div>
      </div>

      {/* Main 3-Pillar Podium (Order: #2 on left, #1 in center/highest, #3 on right) */}
      <div className="max-w-6xl mx-auto w-full flex items-end justify-center gap-6 my-auto pt-6">
        {renderPillar(p2, s2, 2, 'h-[240px]', 0.15)}
        {renderPillar(p1, s1, 1, 'h-[310px]', 0.25)}
        {renderPillar(p3, s3, 3, 'h-[200px]', 0.35)}
      </div>

      {/* Footer Tag */}
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center px-6 py-2 bg-[#080516]/90 border border-purple-500/30 chamfer-slant shadow-lg">
        <span className="chamfer-unslant text-xs font-mono text-slate-300 uppercase">
          BENIDORM FEST • CLASIFICACIÓN VIRTUAL
        </span>
        <span className="chamfer-unslant text-xs font-broadcast text-amber-400 font-bold uppercase">
          ★ MÁXIMA PUNTUACIÓN ACUMULADA
        </span>
      </div>
    </motion.div>
  );
};
