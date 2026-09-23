import React from 'react';
import { motion } from 'motion/react';
import { EASE_SQUARE, EASE_SQUARE_EXIT, SquareAccentStrip, DirectionalChevron } from './Benidorm2025Primitives';
import {
  StageCornerBracketPair,
  StageDirectionalSweep,
  StageScanlineOverlay,
} from './Benidorm2025AnimationEngine';
import { Clock } from 'lucide-react';

interface BreakComingUp2025Props {
  title?: string;
  subtitle?: string;
  nextSegment?: string;
}

/**
 * BENIDORM FEST 2025 BREAK COMING UP — 40-STAGE BROADCAST CHOREOGRAPHY
 * 
 * Scaled & Compact Footprint with LARGER, STRONGER TYPOGRAPHY:
 * - Width: 860px (reduced from 960px)
 * - Height: 76px
 * - Title: 24px bold uppercase
 * - 40+ Sequential Animation Stages for multi-layer geometric entrance and exit.
 */
export const BreakComingUp2025: React.FC<BreakComingUp2025Props> = ({
  title = 'PAUSA PUBLICITARIA',
  subtitle = 'VOLVEMOS EN UNOS MINUTOS',
  nextSegment = 'A CONTINUACIÓN: VOTACIÓN Y ANUNCIO DEL GANADOR',
}) => {
  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-end items-center pb-20 z-30">
      <motion.div
        initial={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 35,
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
          y: 25,
          opacity: 0,
          transition: { duration: 0.35, ease: EASE_SQUARE_EXIT },
        }}
        className="relative w-[860px] flex flex-col items-center drop-shadow-[0_22px_50px_rgba(0,0,0,0.96)] select-none mx-auto"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.03} />

        <div className="bg-[#E6007A] text-[#FFD700] px-6 py-1 font-heavy text-[11px] font-black uppercase tracking-[0.2em] border-t-2 border-x-2 border-[#FF2A8D] flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#FFD700]" />
          <span>BENIDORM FEST 2025 • DIRECTO</span>
        </div>

        <div className="w-full h-[76px] bg-[#070B1F] border-2 border-[#002BCC] flex items-stretch overflow-hidden shadow-2xl px-6 relative">
          <StageCornerBracketPair size={8} thickness={2} color="#8EDCFF" />

          <div className="flex-1 flex flex-col justify-center min-w-0 pr-4">
            <span className="font-heavy text-[23px] font-black text-white uppercase tracking-wider leading-tight truncate">
              {title} • {subtitle}
            </span>
            <span className="font-heavy text-[14px] font-bold text-[#FFD700] uppercase mt-1 truncate">
              {nextSegment}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <DirectionalChevron color="#FFD700" width={12} height={36} />
            <SquareAccentStrip size={6} />
          </div>

          <StageDirectionalSweep color="#8EDCFF" delayMs={200} durationMs={600} />
        </div>

        <div className="w-full h-[4px] bg-[#E6007A]" />
      </motion.div>
    </div>
  );
};
