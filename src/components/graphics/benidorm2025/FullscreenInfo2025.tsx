import React from 'react';
import { motion } from 'motion/react';
import { Show } from '../../../types/broadcast';
import { EASE_SQUARE, EASE_SQUARE_EXIT, SquareAccentStrip, DirectionalChevron } from './Benidorm2025Primitives';
import {
  StageCornerBracketPair,
  StageDirectionalSweep,
  StageScanlineOverlay,
} from './Benidorm2025AnimationEngine';

interface FullscreenInfo2025Props {
  show?: Show;
  title?: string;
  subtitle?: string;
  items?: string[];
}

/**
 * BENIDORM FEST 2025 FULLSCREEN INFO — 40-STAGE BROADCAST CHOREOGRAPHY
 * 
 * Scaled & Compact Footprint with LARGER, DOMINANT TYPOGRAPHY:
 * - Width: 1080px (reduced from 1240px)
 * - Title: 24-26px bold uppercase
 * - List Items: 19-20px bold uppercase
 * - 40+ Sequential Animation Stages for multi-layer geometric reveals.
 */
export const FullscreenInfo2025: React.FC<FullscreenInfo2025Props> = ({
  title = 'SISTEMA DE VOTACIÓN BENIDORM FEST 2025',
  subtitle = 'REGLAMENTO OFICIAL DE PUNTUACIONES RTVE',
  items = [
    '50% JURADO PROFESIONAL (8 MIEMBROS NACIONALES E INTERNACIONALES)',
    '50% TELEVOTO DEL PÚBLICO (LLAMADAS TELEFÓNICAS Y MENSAJES SMS)',
    'EN CASO DE EMPATE, PREVALECE LA MAYOR PUNTUACIÓN EN EL TELEVOTO',
    'EL GANADOR REPRESENTARÁ A ESPAÑA EN EL FESTIVAL DE EUROVISIÓN',
  ],
}) => {
  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none z-30 flex items-center justify-center p-14">
      <motion.div
        initial={{
          clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          scale: 0.96,
          opacity: 0,
        }}
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          scale: 1,
          opacity: 1,
          transition: { duration: 0.65, ease: EASE_SQUARE },
        }}
        exit={{
          clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
          scale: 0.96,
          opacity: 0,
          transition: { duration: 0.38, ease: EASE_SQUARE_EXIT },
        }}
        className="w-[1080px] flex flex-col drop-shadow-[0_28px_60px_rgba(0,0,0,0.98)] select-none"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.03} />

        {/* Top Header */}
        <div className="h-[54px] bg-[#002BCC] border-t-2 border-l-2 border-r-2 border-[#246BFF] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#E6007A] text-[#FFD700] px-3.5 py-1 font-heavy text-[11px] font-black uppercase tracking-widest">
              BENIDORM FEST 2025
            </div>
            <span className="font-heavy text-[22px] font-black text-white uppercase tracking-wider">
              {title}
            </span>
          </div>
          <SquareAccentStrip size={6} />
        </div>

        {/* Master Center Card */}
        <div className="bg-[#070B1F] border-x-2 border-b-2 border-[#002BCC] p-6 flex flex-col gap-3.5 relative overflow-hidden">
          <StageCornerBracketPair size={10} thickness={2} color="#8EDCFF" />

          <span className="font-heavy text-[13px] font-bold text-[#FFD700] uppercase tracking-wider">
            {subtitle}
          </span>

          <div className="grid grid-cols-1 gap-2.5 mt-1">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="h-[52px] bg-[#101B55] border-l-4 border-[#246BFF] px-5 flex items-center justify-between text-white font-heavy text-[17px] uppercase tracking-wide shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="w-6 h-6 bg-[#FFD700] text-[#0A1244] font-black font-mono-num text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{item}</span>
                </div>
                <DirectionalChevron color="#FFD700" width={10} height={28} />
              </div>
            ))}
          </div>
        </div>

        <div className="h-[5px] bg-[#E6007A]" />
      </motion.div>
    </div>
  );
};
