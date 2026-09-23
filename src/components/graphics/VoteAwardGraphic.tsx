import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ActiveRevealState, Show } from '../../types/broadcast';
import { BenidormBug, EASE_BROADCAST, EASE_EXIT, EASE_DATA } from './primitives/BenidormPrimitives';

interface VoteAwardGraphicProps {
  show: Show;
  activeReveal?: ActiveRevealState;
  overridePoints?: number;
  overrideParticipantId?: string;
  overridePhase?: 'professionalJury' | 'demoscopic' | 'public';
}

export const VoteAwardGraphic: React.FC<VoteAwardGraphicProps> = ({
  show,
  activeReveal: propActiveReveal,
  overridePoints,
  overrideParticipantId,
  overridePhase,
}) => {
  const activeReveal = propActiveReveal || show.activeReveal;
  const participantId = overrideParticipantId || activeReveal?.participantId;
  const points = overridePoints ?? activeReveal?.pointsAwarded ?? 0;
  
  const phase =
    overridePhase ||
    activeReveal?.phase ||
    (show.votingStage === 'demoscopic'
      ? 'demoscopic'
      : show.votingStage === 'public'
      ? 'public'
      : 'professionalJury');

  const participant = show.participants.find((p) => p.id === participantId);
  const scoreData = participantId ? show.scores[participantId] : undefined;

  // Previous score and total
  const prevTotal = scoreData?.totalScore ?? 0;
  const newTotal = prevTotal + (points > 0 ? points : 0);

  // Subtle counter animation for points
  const [displayPoints, setDisplayPoints] = useState<number>(0);

  useEffect(() => {
    let start = 0;
    const end = points;
    if (end <= 0) {
      setDisplayPoints(0);
      return;
    }
    const duration = 400; // fast 400ms count-up with smooth deceleration
    const startTime = performance.now();

    let animFrame: number;
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth cubic deceleration curve (1 - (1 - t)^3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easeProgress * end);
      setDisplayPoints(current);
      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [points]);

  if (!participant && !participantId) return null;

  const phaseTitle =
    phase === 'demoscopic'
      ? 'PANEL DEMOSCÓPICO'
      : phase === 'public'
      ? 'TELEVOTO PÚBLICO'
      : 'VOTACIÓN DEL JURADO';

  const isJury12 = phase === 'professionalJury' && points === 12;

  const artistName = participant?.name || participant?.artist || 'PARTICIPANTE';
  const songName = participant?.song || 'Canción';
  const num = participant?.performanceNumber
    ? String(participant.performanceNumber).padStart(2, '0')
    : undefined;

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-end items-center pb-24 z-30">
      {/* Main Broadcast Award Graphic Container (Strictly Zero Fades) */}
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
        transition={{ duration: 0.52, ease: EASE_BROADCAST }}
        className="relative flex flex-col items-center drop-shadow-[0_16px_40px_rgba(0,0,0,0.92)] gpu-layer"
      >
        {/* TOP LAYER: Slanted Category Tag */}
        <motion.div
          initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', y: -10 }}
          animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', y: 0 }}
          exit={{ clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="self-start -mb-2 ml-8 z-30"
        >
          <div className="chamfer-slant bg-gradient-to-r from-[#180b33] via-[#2d1259] to-[#180b33] border border-purple-400/50 px-6 py-1.5 shadow-xl">
            <span className="chamfer-unslant block font-broadcast text-[14px] font-black tracking-widest text-cyan-300 uppercase leading-tight">
              {phaseTitle}
            </span>
          </div>
        </motion.div>

        {/* MIDDLE LAYER: Primary Parallelograms (Number + Artist + Song + Points) */}
        <div className="relative flex items-center">
          
          {/* Midnight Navy Backing Bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-y-0 -inset-x-4 chamfer-slant bg-[#060918] -z-10 shadow-2xl origin-left"
          />

          {/* Performance Number Pill */}
          {num && (
            <motion.div
              initial={{ x: -25, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
              animate={{ x: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
              exit={{ x: -20, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
              transition={{ delay: 0.08, duration: 0.4 }}
              className="chamfer-slant bg-[#0a0d24] border-2 border-cyan-400 px-5 py-3.5 -mr-2 z-30 shadow-xl"
            >
              <span className="chamfer-unslant block font-mono-num text-[30px] font-black text-cyan-300">
                {num}
              </span>
            </motion.div>
          )}

          {/* Electric Cyan Artist Block */}
          <motion.div
            initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
            animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
            exit={{ clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative chamfer-slant bg-gradient-to-r from-[#00e5ff] via-[#22d3ee] to-[#38bdf8] px-10 py-4 z-20 shadow-2xl border-y border-cyan-100/60 overflow-hidden"
          >
            {/* Travelling sheen highlight */}
            <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-sheen pointer-events-none" />

            <div className="chamfer-unslant flex items-center">
              <span className="font-heavy font-black text-[36px] tracking-wide text-black uppercase leading-none whitespace-nowrap">
                {artistName}
              </span>
            </div>
          </motion.div>

          {/* Royal Purple Song Block */}
          <motion.div
            initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', x: -10 }}
            animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', x: 0 }}
            exit={{ clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' }}
            transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative chamfer-slant bg-gradient-to-r from-[#591ba8] via-[#6d28d9] to-[#7c3aed] px-9 py-4 -ml-3 z-10 shadow-2xl border-y border-purple-300/40 overflow-hidden"
          >
            <div className="chamfer-unslant flex items-center">
              <span className="font-broadcast text-[30px] font-bold tracking-wide text-white leading-none whitespace-nowrap">
                {songName}
              </span>
            </div>
          </motion.div>

          {/* Points Awarded Block */}
          <motion.div
            initial={{ x: 30, clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
            animate={{ x: 0, clipPath: 'polygon(0% 0, 100% 0, 100% 100%, 0% 100%)' }}
            exit={{ x: 20, clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
            transition={{ delay: 0.25, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`relative chamfer-slant px-8 py-4 -ml-3 z-30 shadow-2xl border-y overflow-hidden ${
              isJury12
                ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border-amber-200 text-black'
                : 'bg-gradient-to-r from-[#0d1430] via-[#162150] to-[#0d1430] border-cyan-400/80 text-cyan-300'
            }`}
          >
            <div className="chamfer-unslant flex items-baseline gap-2">
              <span className="font-heavy font-mono-num text-[40px] font-black leading-none tracking-tight">
                +{displayPoints}
              </span>
              <span className="font-broadcast text-[18px] font-black tracking-wider uppercase opacity-90">
                PTS
              </span>
            </div>
          </motion.div>

        </div>

        {/* BOTTOM ACCENT: Score Projection Guide Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex items-center justify-between px-8 py-1.5 bg-[#090518]/90 border border-purple-500/30 chamfer-slant -mt-1 shadow-lg"
        >
          <div className="chamfer-unslant flex items-center gap-6 text-xs font-mono font-bold text-slate-300 uppercase">
            <span>
              PUNTOS PREVIOS:{' '}
              <strong className="text-white font-mono-num">{prevTotal} PTS</strong>
            </span>
            <span className="text-cyan-400">→</span>
            <span>
              NUEVO TOTAL:{' '}
              <strong className="text-amber-300 font-mono-num font-black">{newTotal} PTS</strong>
            </span>
          </div>
          <div className="chamfer-unslant">
            <span className="font-broadcast text-[11px] font-bold text-purple-300 tracking-wider uppercase">
              ASIGNACIÓN CONFIRMADA
            </span>
          </div>
        </motion.div>

      </motion.div>

    </div>
  );
};
