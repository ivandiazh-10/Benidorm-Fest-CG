import React from 'react';
import { motion } from 'motion/react';
import { Participant, ParticipantScore, Show } from '../../types/broadcast';
import {
  ChamferedBar,
  DirectionalLine,
  EASE_BROADCAST,
  EASE_EXIT,
} from './primitives/BenidormPrimitives';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QualificationResultGraphicProps {
  show: Show;
  mode?: 'qualified' | 'not_qualified' | 'eliminated';
  title?: string;
  subtitle?: string;
}

export const QualificationResultGraphic: React.FC<QualificationResultGraphicProps> = ({
  show,
  mode = 'qualified',
  title,
  subtitle,
}) => {
  const { participants, scores, stageTitle } = show;
  const isEliminated = mode === 'eliminated' || mode === 'not_qualified';

  const activeParticipants = participants.filter((p) => !p.isRemovedFromCompetition);

  const sorted = [...activeParticipants].sort((a, b) => {
    const posA = scores[a.id]?.position ?? 999;
    const posB = scores[b.id]?.position ?? 999;
    return posA - posB;
  });

  // Qualifiers are top 4; eliminated are 5th onwards
  const displayed = isEliminated ? sorted.slice(4) : sorted.slice(0, 4);

  const defaultTitle = isEliminated
    ? 'NO CLASIFICADOS'
    : 'CLASIFICADOS A LA GRAN FINAL';

  const defaultSubtitle = isEliminated
    ? 'CANDIDATURAS QUE FINALIZAN SU RECORRIDO EN BENIDORM FEST'
    : 'LOS 4 CANDIDATOS QUE AVANZAN A LA FINAL DE BENIDORM FEST';

  const themeColor = isEliminated ? 'rose' : 'emerald';
  const borderClass = isEliminated ? 'border-rose-500/80' : 'border-emerald-400/80';
  const badgeBg = isEliminated
    ? 'bg-gradient-to-r from-rose-600 to-red-600'
    : 'bg-gradient-to-r from-emerald-500 to-teal-400';

  return (
    <motion.div
      initial={{
        y: 60,
        clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
      }}
      animate={{
        y: 0,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      }}
      exit={{
        y: 50,
        clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        transition: { duration: 0.35, ease: EASE_EXIT },
      }}
      transition={{ duration: 0.55, ease: EASE_BROADCAST }}
      className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-between px-24 py-16 z-30 overflow-hidden gpu-layer"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-500/40 max-w-6xl mx-auto w-full">
        <div
          className={`chamfer-slant ${
            isEliminated
              ? 'bg-gradient-to-r from-rose-950 via-red-950 to-rose-950 border border-rose-500/60'
              : 'bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 border border-emerald-400/60'
          } px-7 py-2.5 shadow-xl`}
        >
          <span
            className={`chamfer-unslant block font-heavy text-[26px] font-black tracking-wider ${
              isEliminated ? 'text-rose-300' : 'text-emerald-300'
            } uppercase drop-shadow-md`}
          >
            {title || defaultTitle}
          </span>
        </div>
        <div className="chamfer-slant bg-white text-black px-5 py-2 font-mono text-xs font-black tracking-widest uppercase shadow-md">
          {stageTitle || 'BENIDORM FEST'}
        </div>
      </div>

      {/* Subtitle */}
      <div className="text-center max-w-6xl mx-auto w-full">
        <span className="font-mono text-xs text-purple-200 tracking-wider uppercase font-semibold">
          {subtitle || defaultSubtitle}
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto w-full my-auto">
        {displayed.map((p, idx) => {
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
            <motion.div
              key={p.id}
              initial={{
                x: -40,
                clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
              }}
              animate={{
                x: 0,
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              }}
              exit={{
                x: -30,
                clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
              }}
              transition={{ delay: 0.12 + idx * 0.08, duration: 0.48, ease: EASE_BROADCAST }}
              className={`chamfer-slant bg-gradient-to-r from-[#060a1e] via-[#0d1430] to-[#060a1e] border-2 ${borderClass} p-5 shadow-2xl flex items-center justify-between`}
            >
              <div className="chamfer-unslant flex items-center gap-4 flex-1 truncate">
                {/* Position badge */}
                <div
                  className={`w-12 h-12 chamfer-slant ${badgeBg} text-white flex items-center justify-center flex-shrink-0 shadow-lg`}
                >
                  <span className="chamfer-unslant font-heavy font-mono-num text-[24px] font-black">
                    #{scoreData.position}
                  </span>
                </div>

                <div className="flex flex-col truncate">
                  <span className="font-heavy text-[26px] font-black text-white uppercase truncate leading-snug">
                    {p.name || p.artist}
                  </span>
                  {p.song && (
                    <span
                      className={`font-broadcast text-xs ${
                        isEliminated ? 'text-rose-300' : 'text-emerald-300'
                      } uppercase truncate`}
                    >
                      «{p.song}»
                    </span>
                  )}
                </div>
              </div>

              {/* Status Tag & Total Score */}
              <div className="chamfer-unslant flex flex-col items-end pl-4 border-l border-white/10">
                <div
                  className={`chamfer-slant ${
                    isEliminated
                      ? 'bg-rose-500/20 border border-rose-400/60 text-rose-300'
                      : 'bg-emerald-500/20 border border-emerald-400/60 text-emerald-300'
                  } px-3 py-0.5 mb-1`}
                >
                  <span className="chamfer-unslant font-heavy text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                    {isEliminated ? (
                      <>
                        <XCircle className="w-3 h-3 text-rose-400" /> ELIMINADO
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> FINALISTA
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heavy font-mono-num text-[26px] font-black text-white leading-none">
                    {scoreData.totalScore}
                  </span>
                  <span className="font-broadcast text-[10px] font-black text-cyan-300">
                    PTS
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center px-6 py-2 bg-[#080516]/90 border border-purple-500/30 chamfer-slant shadow-lg">
        <span className="chamfer-unslant text-xs font-mono text-slate-300 uppercase">
          {stageTitle || 'BENIDORM FEST'} • RESULTADO OFICIAL
        </span>
        <span
          className={`chamfer-unslant text-xs font-mono ${
            isEliminated ? 'text-rose-400' : 'text-emerald-400'
          } font-bold uppercase`}
        >
          {isEliminated ? 'FIN DE PARTICIPACIÓN' : 'CONCURSANTES CLASIFICADOS'}
        </span>
      </div>
    </motion.div>
  );
};
