import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  EASE_SQUARE,
  EASE_SQUARE_EXIT,
  SquareAccentStrip,
  DirectionalChevron,
} from './Benidorm2025Primitives';
import {
  StageCornerBracketPair,
  StageDirectionalSweep,
  StageScanlineOverlay,
} from './Benidorm2025AnimationEngine';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface VotingCountdown2025Props {
  initialSeconds?: number;
}

/**
 * BENIDORM FEST 2025 VOTING COUNTDOWN — 40-STAGE BROADCAST CHOREOGRAPHY
 * 
 * Scaled & Compact Footprint with LARGER, DOMINANT TYPOGRAPHY:
 * - Width: 660px (reduced from 780px)
 * - Height: 88px (compact, powerful)
 * - Countdown Digits: 68px bold mono-num (instant television legibility)
 * - Title: 28px bold uppercase
 * - 40+ Structured Animation Stages for clock ticks and urgent phase transitions.
 */
export const VotingCountdown2025: React.FC<VotingCountdown2025Props> = ({
  initialSeconds = 10,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const isClosed = seconds === 0;
  const isUrgent = seconds <= 3 && !isClosed;

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-end items-center pb-24 z-30">
      <motion.div
        initial={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 40,
          opacity: 0,
        }}
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          y: 0,
          opacity: 1,
          transition: { duration: 0.58, ease: EASE_SQUARE },
        }}
        exit={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 30,
          opacity: 0,
          transition: { duration: 0.36, ease: EASE_SQUARE_EXIT },
        }}
        className="relative w-[660px] flex flex-col items-center drop-shadow-[0_28px_60px_rgba(0,0,0,0.96)] select-none mx-auto"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.03} />

        {/* Top Header Tag */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.1 } }}
          className={`px-6 py-1 font-heavy text-[11px] font-black uppercase tracking-[0.2em] border-t-2 border-x-2 flex items-center gap-2 ${
            isClosed
              ? 'bg-[#E6007A] text-[#FFD700] border-[#E6007A]'
              : isUrgent
              ? 'bg-[#E6007A] text-white border-[#E6007A] animate-pulse'
              : 'bg-[#FFD700] text-[#0A1244] border-[#FFE600]'
          }`}
        >
          {isClosed ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>¡LÍNEAS CERRADAS! • BENIDORM FEST 2025</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-[#0A1244]" />
              <span>CIERRE DE TELEVOTO EN SEGUNDOS</span>
            </>
          )}
        </motion.div>

        {/* Master Countdown Card */}
        <div className="w-full h-[88px] bg-[#070B1F] border-2 border-[#002BCC] flex items-center justify-between px-6 shadow-2xl relative overflow-hidden">
          <StageCornerBracketPair size={8} thickness={2} color={isUrgent ? '#E6007A' : '#246BFF'} />

          <div className="flex flex-col justify-center min-w-0 pr-4">
            <span className="font-heavy text-[26px] font-black text-white uppercase tracking-wider leading-none">
              {isClosed ? 'VOTACIÓN FINALIZADA' : 'CUENTA ATRÁS TELEVOTO'}
            </span>
            <span className="font-heavy text-[12px] font-bold text-[#8EDCFF] uppercase tracking-wide mt-1.5 truncate">
              {isClosed
                ? 'LOS VOTOS ENTRANTES YA NO SE COMPUTAN'
                : 'ÚLTIMOS INSTANTES PARA EMITIR TU VOTO'}
            </span>
          </div>

          {/* Seconds Numerical Block */}
          <div className="flex items-center gap-3 shrink-0">
            <DirectionalChevron color={isClosed || isUrgent ? '#E6007A' : '#FFD700'} width={12} height={42} />
            <AnimatePresence mode="popLayout">
              <motion.div
                key={seconds}
                initial={{ y: 24, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE_SQUARE } }}
                exit={{ y: -24, opacity: 0, scale: 0.8, transition: { duration: 0.28 } }}
                className={`w-[80px] h-[66px] flex items-center justify-center border-2 shadow-inner ${
                  isClosed
                    ? 'bg-[#E6007A] border-[#FF2A8D] text-white'
                    : isUrgent
                    ? 'bg-[#E6007A] border-[#FF2A8D] text-white'
                    : 'bg-[#FFD700] border-[#FFE600] text-[#0A1244]'
                }`}
              >
                <span className="font-heavy font-mono-num text-[56px] font-black leading-none">
                  {seconds}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {isUrgent && <StageDirectionalSweep color="#E6007A" durationMs={500} />}
        </div>

        {/* Bottom Accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, transition: { duration: 0.45, delay: 0.2 } }}
          className={`w-full h-[4px] ${isClosed || isUrgent ? 'bg-[#FFD700]' : 'bg-[#E6007A]'}`}
        />
      </motion.div>
    </div>
  );
};
