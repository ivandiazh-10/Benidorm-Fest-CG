import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE_BROADCAST, EASE_EXIT } from './primitives/BenidormPrimitives';

interface VotingCountdownGraphicProps {
  initialSeconds?: number;
  onFinish?: () => void;
}

export const VotingCountdownGraphic: React.FC<VotingCountdownGraphicProps> = ({
  initialSeconds = 10,
  onFinish,
}) => {
  const [count, setCount] = useState<number>(initialSeconds);
  const isClosed = count <= 0;

  useEffect(() => {
    if (count <= 0) {
      if (onFinish) onFinish();
      return;
    }
    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [count, onFinish]);

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.92, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
        animate={{ scale: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
        exit={{
          scale: 0.92,
          clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          transition: { duration: 0.32, ease: EASE_EXIT },
        }}
        transition={{ duration: 0.48, ease: EASE_BROADCAST }}
        className="flex flex-col items-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] gpu-layer"
      >
        {!isClosed ? (
          <div className="flex flex-col items-center">
            {/* Countdown Badge Header */}
            <div className="chamfer-slant bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-10 py-2 border-t-2 border-amber-300 shadow-xl mb-4">
              <span className="chamfer-unslant block font-broadcast text-[28px] font-black tracking-widest text-white uppercase">
                CIERRE DE LÍNEAS / COUNTDOWN
              </span>
            </div>

            {/* Giant Chamfered Digital Countdown Box */}
            <div className="relative w-[320px] h-[320px] chamfer-slant bg-gradient-to-br from-[#12072e] via-[#1d0b47] to-[#0a031c] border-4 border-cyan-400/80 flex items-center justify-center shadow-2xl shadow-purple-950/90 overflow-hidden">
              {/* Radial glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent" />
              
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={count}
                  initial={{ y: -60, scale: 1.25 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 60, scale: 0.75 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="chamfer-unslant font-broadcast font-mono-num text-[180px] font-black text-white leading-none drop-shadow-[0_4px_25px_rgba(234,179,8,0.8)]"
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* At 0: Dramatic VOTING CLOSED / LÍNEAS CERRADAS */
          <motion.div
            initial={{ scale: 0.85, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            animate={{ scale: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            className="flex flex-col items-center"
          >
            <div className="chamfer-slant bg-[#ef4444] px-16 py-6 border-2 border-white shadow-2xl shadow-red-900/80">
              <span className="chamfer-unslant block font-display font-black text-[72px] tracking-wider text-white uppercase leading-none drop-shadow-md">
                LÍNEAS CERRADAS
              </span>
            </div>
            <div className="chamfer-slant bg-[#101438] px-12 py-3 -mt-2 border-b-2 border-cyan-400">
              <span className="chamfer-unslant block font-broadcast text-[28px] font-bold tracking-widest text-cyan-300 uppercase">
                VOTING COMPLETED • RESULTADOS EN PROCESO
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
