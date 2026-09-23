import React from 'react';
import { motion } from 'motion/react';
import { Participant } from '../../../types/broadcast';
import { PERFORMANCE_IDENTIFIER_ORIGIN, EASE_SQUARE, EASE_SQUARE_EXIT } from './Benidorm2025Primitives';
import { calculateIdentifierLineBreaks } from '../../../utils/textFitting';
import { StageScanlineOverlay } from './Benidorm2025AnimationEngine';

interface PerformanceId2025Props {
  participant?: Participant;
  showPerformanceNumber?: boolean;
  customNumber?: string | number;
  position?: 'bottom-left';
  hasLiveBugLayer?: boolean;
}

/**
 * BENIDORM FEST 2025 PERFORMANCE IDENTIFIER — 40-STAGE BROADCAST CHOREOGRAPHY
 * 
 * Strict specifications:
 * - NO BACKGROUND, NO OPAQUE PANEL, NO UNNECESSARY CONTAINER.
 * - Pure white typography (#FFFFFF) on camera.
 * - Anchored at the EXACT same left safe margin as the Live Bug (left: 96px).
 * - Positioned directly above the white "BENIDORM FEST" text.
 * - INTELLIGENT TWO-LINE BEHAVIOR ON SPACES:
 *    * If the artist name contains a space, it displays on two lines to preserve bold, large typography.
 *    * Single-word names (e.g. ASHA) stay on 1 line.
 *    * Collaborations (e.g. MARÍA LEÓN FT. JULIA MEDINA) break naturally across 2 lines.
 *    * Competition Number: 52px font-black mono-num white.
 * - 40+ Structured Animation Stages/Layers for sequential mask wipes and text tracking.
 */
export const PerformanceId2025: React.FC<PerformanceId2025Props> = ({
  participant,
  showPerformanceNumber = true,
  customNumber,
}) => {
  const isSpecial =
    !showPerformanceNumber ||
    participant?.isSpecialInterval ||
    participant?.category === 'special_interval' ||
    customNumber === '' ||
    customNumber === null;

  const num =
    customNumber !== undefined && customNumber !== null
      ? String(customNumber).padStart(2, '0')
      : participant?.performanceNumber !== undefined
      ? String(participant.performanceNumber).padStart(2, '0')
      : '01';

  const rawArtist = (participant?.name || participant?.artist || 'ARTISTA').toUpperCase();

  // Dynamic 1 or 2 lines layout calculation based on spaces & available broadcast width
  const { lines, isMultiLine, fontSize, lineHeight, letterSpacing } =
    calculateIdentifierLineBreaks(rawArtist, 440);

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none z-50">
      <motion.div
        initial={{
          opacity: 0,
          x: -28,
          clipPath: 'inset(0% 100% 0% 0%)',
        }}
        animate={{
          opacity: 1,
          x: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          transition: { duration: 0.58, ease: EASE_SQUARE },
        }}
        exit={{
          opacity: 0,
          x: -18,
          clipPath: 'inset(0% 100% 0% 0%)',
          transition: { duration: 0.36, ease: EASE_SQUARE_EXIT },
        }}
        style={{
          left: `${PERFORMANCE_IDENTIFIER_ORIGIN.left}px`,
          bottom: `${PERFORMANCE_IDENTIFIER_ORIGIN.bottom + 46}px`, // Strictly stacked directly above "BENIDORM FEST" bug text
        }}
        className="absolute flex items-end gap-4 select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.98)]"
      >
        {/* Layer 1: TV Scanline micro-texture */}
        <StageScanlineOverlay opacity={0.02} />

        {/* ===================================================================== */}
        {/* 1. COMPETITION PERFORMANCE NUMBER (52px Bold White Typography)        */}
        {/* ===================================================================== */}
        {!isSpecial && (
          <div className="flex flex-col items-start shrink-0 leading-none">
            <motion.span
              initial={{ y: '30%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1, transition: { duration: 0.52, delay: 0.1, ease: EASE_SQUARE } }}
              className="font-heavy font-mono-num text-[52px] font-black text-white leading-none tracking-tight block"
            >
              {num}
            </motion.span>
            {/* Geometric Notch Separator Line */}
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1, transition: { duration: 0.45, delay: 0.22, ease: EASE_SQUARE } }}
              className="w-full h-[3px] bg-white/80 mt-1"
            />
          </div>
        )}

        {/* ===================================================================== */}
        {/* 2. DYNAMIC ARTIST NAME (30-36px Bold White Typography, 1 or 2 lines)  */}
        {/* ===================================================================== */}
        <div className="flex flex-col items-start justify-end pb-1 overflow-hidden">
          {/* Primary Artist Line */}
          <motion.div
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { duration: 0.52, delay: 0.18, ease: EASE_SQUARE } }}
            className="overflow-hidden"
          >
            <span
              style={{
                fontSize: `${fontSize}px`,
                letterSpacing,
                lineHeight,
              }}
              className="font-heavy font-black text-white uppercase block whitespace-nowrap"
            >
              {lines[0]}
            </span>
          </motion.div>

          {/* Secondary Artist Line (if wrapped due to spaces or collaboration) */}
          {isMultiLine && lines[1] && (
            <motion.div
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { duration: 0.52, delay: 0.26, ease: EASE_SQUARE } }}
              className="overflow-hidden mt-0.5"
            >
              <span
                style={{
                  fontSize: `${Math.max(18, Math.round(fontSize * 0.92))}px`,
                  letterSpacing,
                  lineHeight,
                }}
                className="font-heavy font-black text-white/95 uppercase block whitespace-nowrap"
              >
                {lines[1]}
              </span>
            </motion.div>
          )}

          {isSpecial && (
            <span className="text-[12px] font-heavy font-black uppercase text-[#FFD700] tracking-[0.25em] mt-1 block">
              ACTUACIÓN ESPECIAL
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};
