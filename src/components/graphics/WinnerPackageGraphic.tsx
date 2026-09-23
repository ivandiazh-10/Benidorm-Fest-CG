import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Show, Participant, ParticipantScore } from '../../types/broadcast';
import { Trophy, Crown, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ChamferedBar,
  DirectionalLine,
  EASE_BROADCAST,
  EASE_EXIT,
} from './primitives/BenidormPrimitives';

interface WinnerPackageGraphicProps {
  show: Show;
  winnerParticipant?: Participant;
}

export const WinnerPackageGraphic: React.FC<WinnerPackageGraphicProps> = ({
  show,
  winnerParticipant,
}) => {
  const { participants, scores, stageTitle } = show;

  const winner =
    winnerParticipant ||
    (() => {
      const topScore = (Object.values(scores) as ParticipantScore[]).find((s) => s.position === 1);
      return participants.find((p) => p.id === topScore?.participantId) || participants[0];
    })();

  const winnerScore: ParticipantScore | undefined = winner ? scores[winner.id] : undefined;

  // Elegant celebratory confetti
  useEffect(() => {
    try {
      const end = Date.now() + 3500;
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          startVelocity: 35,
          spread: 360,
          ticks: 120,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
          colors: ['#f59e0b', '#fbbf24', '#00e5ff', '#ffffff', '#a855f7'],
        });
      }, 400);
      return () => clearInterval(interval);
    } catch {
      // ignore
    }
  }, []);

  if (!winner) return null;

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col items-center justify-center p-16 z-30">
      {/* Background radial gold & purple aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(245,158,11,0.18)_0%,_rgba(109,40,217,0.25)_40%,_transparent_75%)] pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{
          clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
          y: 40,
        }}
        animate={{
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          y: 0,
        }}
        exit={{
          clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
          y: 30,
          transition: { duration: 0.38, ease: EASE_EXIT },
        }}
        transition={{ duration: 0.62, ease: EASE_BROADCAST }}
        className="relative z-10 flex flex-col items-center drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-w-5xl w-full gpu-layer"
      >
        {/* Top Trophy & Festival Badge */}
        <motion.div
          initial={{
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            y: -25,
          }}
          animate={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            y: 0,
          }}
          transition={{ delay: 0.15, duration: 0.48, ease: EASE_BROADCAST }}
          className="flex items-center gap-3 chamfer-slant bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-10 py-2.5 border-2 border-white shadow-2xl mb-4"
        >
          <div className="chamfer-unslant flex items-center gap-3">
            <Trophy className="w-7 h-7 text-black fill-black" />
            <span className="font-heavy text-[26px] font-black tracking-widest text-black uppercase">
              GANADOR • {stageTitle || 'BENIDORM FEST'}
            </span>
            <Crown className="w-7 h-7 text-black fill-black" />
          </div>
        </motion.div>

        {/* Champion Artist Card Header */}
        <div className="relative w-full chamfer-slant bg-gradient-to-r from-[#0d0926] via-[#1a0f3d] to-[#0d0926] border-2 border-amber-400/80 p-8 shadow-2xl overflow-hidden text-center">
          {/* Metallic sheen */}
          <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent animate-sheen pointer-events-none" />

          <div className="chamfer-unslant flex flex-col items-center">
            {/* Number Pill */}
            <div className="flex items-center gap-2 text-amber-300 font-heavy text-lg font-bold tracking-widest uppercase mb-2">
              <Star className="w-4 h-4 fill-amber-300" />
              <span>CANDIDATURA #{String(winner.performanceNumber).padStart(2, '0')}</span>
              <Star className="w-4 h-4 fill-amber-300" />
            </div>

            {/* Huge Winning Artist Name */}
            <h1 className="font-heavy font-black text-[110px] text-white uppercase tracking-tight leading-none drop-shadow-[0_8px_25px_rgba(0,0,0,0.95)]">
              {winner.name || winner.artist}
            </h1>

            {/* Song Title */}
            {winner.song && (
              <h2 className="font-broadcast text-[42px] font-bold text-amber-300 uppercase tracking-wide mt-3 drop-shadow-md">
                «{winner.song}»
              </h2>
            )}

            {/* Score Breakdown Pills */}
            <div className="flex items-center justify-center gap-4 mt-6">
              {/* Total Score White Block */}
              <div className="chamfer-slant bg-white px-8 py-2.5 shadow-2xl flex items-center justify-center">
                <div className="chamfer-unslant flex items-baseline gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                    PUNTOS TOTALES
                  </span>
                  <span className="font-heavy font-mono-num text-[40px] font-black text-black leading-none">
                    {winnerScore?.totalScore ?? 0}
                  </span>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="chamfer-slant bg-[#170a36]/90 border border-purple-400/40 px-6 py-2.5 shadow-lg flex items-center gap-6">
                <div className="chamfer-unslant text-center font-mono">
                  <span className="block text-[10px] text-purple-300 uppercase">JURADO</span>
                  <span className="text-lg font-bold text-white">
                    {winnerScore?.juryScore ?? 0}
                  </span>
                </div>
                <div className="chamfer-unslant text-center font-mono">
                  <span className="block text-[10px] text-cyan-300 uppercase">DEMOSCÓPICO</span>
                  <span className="text-lg font-bold text-white">
                    {winnerScore?.demoscopicScore ?? 0}
                  </span>
                </div>
                <div className="chamfer-unslant text-center font-mono">
                  <span className="block text-[10px] text-amber-300 uppercase">PÚBLICO</span>
                  <span className="text-lg font-bold text-white">
                    {winnerScore?.publicScore ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-4">
          <DirectionalLine color="gold" />
        </div>
      </motion.div>
    </div>
  );
};
