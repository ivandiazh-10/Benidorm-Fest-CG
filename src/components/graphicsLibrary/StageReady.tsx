import React from 'react';
import { motion } from 'motion/react';
import { Participant } from '../../types/broadcast';
import { EASE_BROADCAST } from '../graphics/primitives/BenidormPrimitives';
import { fitTextToBox } from '../../utils/textFitting';

export interface StageReadyProps {
  participant?: Participant;
  showPerformanceNumber?: boolean;
  customNumber?: string;
  customArtist?: string;
  customSong?: string;
  customComposers?: string;
  customArrangers?: string;
}

/**
 * STAGE READY — MASTER TELEVISION GRAPHIC
 * 
 * Symmetrical, television-grade graphic with 28 coordinated animation layers:
 * 1. Top Horizon Guide (Left)
 * 2. Top Horizon Guide (Right)
 * 3. Bottom Horizon Guide (Left)
 * 4. Bottom Horizon Guide (Right)
 * 5. Horizontal Main Convergence Beam (Left)
 * 6. Horizontal Main Convergence Beam (Right)
 * 7. Center Focal Diamond Locking Core
 * 8. Top Vertical Center Axis Pin
 * 9. Bottom Vertical Center Axis Pin
 * 10. Outer Chamfer Framing Bracket (Left)
 * 11. Outer Chamfer Framing Bracket (Right)
 * 12. Symmetrical Chevron Crown (Top)
 * 13. Symmetrical Chevron Anchor (Bottom)
 * 14. Performance Number Outer Chamfer Container
 * 15. Performance Number "ACTUACIÓN" Masked Label Reveal
 * 16. Performance Number Geometric Skew Divider
 * 17. Performance Number Massive Digit Masked Reveal
 * 18. Central Artist Outer Chamfer Container
 * 19. Central Artist Masked Center-Outward Reveal
 * 20. Song Title Chamfered Purple/Cyan Strip Expansion
 * 21. Song Title Typography Wipe Reveal
 * 22. Metadata Horizontal Horizon Bar
 * 23. Metadata Column 1: Intérprete Label & Value
 * 24. Metadata Column 2: Compositores Label & Value
 * 25. Metadata Column 3: Arreglos Label & Value
 * 26. Corner Registration Crosshairs (Top-Left & Top-Right)
 * 27. Corner Registration Crosshairs (Bottom-Left & Bottom-Right)
 * 28. Symmetrical Satellite Horizon Flare
 * 
 * ZERO FADES: pure geometric wipes, clip paths, directional movement, and scale transforms.
 */
export const StageReady: React.FC<StageReadyProps> = ({
  participant,
  showPerformanceNumber,
  customNumber,
  customArtist,
  customSong,
  customComposers,
  customArrangers,
}) => {
  const isNumberDisabled =
    showPerformanceNumber === false || customNumber === '';

  const shouldShowNumber =
    !isNumberDisabled &&
    (showPerformanceNumber === true ||
      (customNumber !== undefined && customNumber !== '') ||
      participant?.performanceNumber !== undefined);

  const num = shouldShowNumber
    ? customNumber ||
      (participant?.performanceNumber
        ? String(participant.performanceNumber).padStart(2, '0')
        : '01')
    : undefined;

  const rawArtist = customArtist || participant?.name || participant?.artist || 'NEBULOSSA';
  const rawSong = customSong || participant?.song || 'ZORRA';
  const composers =
    customComposers ||
    participant?.composers ||
    (participant as any)?.composer ||
    'Mark Dasousa / Mery Bas';
  const arrangers =
    customArrangers ||
    (participant as any)?.arrangers ||
    'Mark Dasousa';

  // Dynamic typography scale: huge bold display size for standard names, adapting gracefully
  const artistStyle = fitTextToBox(rawArtist, {
    baseFontSize: 104,
    minFontSize: 46,
    charThreshold: 11,
    targetWidthPx: 1280,
    letterSpacing: '0.03em',
  });

  const songStyle = fitTextToBox(rawSong, {
    baseFontSize: 44,
    minFontSize: 24,
    charThreshold: 18,
    targetWidthPx: 960,
    letterSpacing: '0.04em',
  });

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none overflow-hidden z-30 flex flex-col items-center justify-center">
      {/* =========================================================================
          LAYERS 01 & 02: TOP HORIZON GUIDES (LEFT -> CENTER <- RIGHT)
          ========================================================================= */}
      <div className="absolute top-20 inset-x-24 flex items-center justify-between pointer-events-none">
        <motion.div
          initial={{ scaleX: 0, x: -300 }}
          animate={{ scaleX: 1, x: 0 }}
          exit={{ scaleX: 0, x: -300 }}
          transition={{ duration: 0.5, ease: EASE_BROADCAST }}
          className="w-[420px] h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-cyan-400 origin-left"
        />
        <motion.div
          initial={{ scaleX: 0, x: 300 }}
          animate={{ scaleX: 1, x: 0 }}
          exit={{ scaleX: 0, x: 300 }}
          transition={{ duration: 0.5, ease: EASE_BROADCAST }}
          className="w-[420px] h-[1.5px] bg-gradient-to-l from-transparent via-purple-500 to-cyan-400 origin-right"
        />
      </div>

      {/* =========================================================================
          LAYERS 03 & 04: BOTTOM HORIZON GUIDES (LEFT -> CENTER <- RIGHT)
          ========================================================================= */}
      <div className="absolute bottom-20 inset-x-24 flex items-center justify-between pointer-events-none">
        <motion.div
          initial={{ scaleX: 0, x: -300 }}
          animate={{ scaleX: 1, x: 0 }}
          exit={{ scaleX: 0, x: -300 }}
          transition={{ duration: 0.5, ease: EASE_BROADCAST }}
          className="w-[420px] h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-purple-500 origin-left"
        />
        <motion.div
          initial={{ scaleX: 0, x: 300 }}
          animate={{ scaleX: 1, x: 0 }}
          exit={{ scaleX: 0, x: 300 }}
          transition={{ duration: 0.5, ease: EASE_BROADCAST }}
          className="w-[420px] h-[1.5px] bg-gradient-to-l from-transparent via-cyan-400 to-purple-500 origin-right"
        />
      </div>

      {/* =========================================================================
          LAYERS 05 & 06: HORIZONTAL MAIN CONVERGENCE BEAMS
          ========================================================================= */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-24 flex items-center justify-center pointer-events-none">
        {/* Layer 05: Left Beam */}
        <motion.div
          initial={{ x: -1100, scaleX: 0 }}
          animate={{ x: 0, scaleX: 1 }}
          exit={{ x: -1100, scaleX: 0 }}
          transition={{ duration: 0.58, ease: EASE_BROADCAST }}
          className="w-[740px] h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-white shadow-[0_0_16px_rgba(0,229,255,0.8)] origin-right"
        />

        {/* Layer 07: Center Focal Diamond Lock */}
        <motion.div
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 45 }}
          exit={{ scale: 0, rotate: 45 }}
          transition={{ delay: 0.18, duration: 0.45, ease: EASE_BROADCAST }}
          className="w-5 h-5 bg-white border-2 border-cyan-400 shadow-[0_0_20px_#00e5ff] mx-3 shrink-0"
        />

        {/* Layer 06: Right Beam */}
        <motion.div
          initial={{ x: 1100, scaleX: 0 }}
          animate={{ x: 0, scaleX: 1 }}
          exit={{ x: 1100, scaleX: 0 }}
          transition={{ duration: 0.58, ease: EASE_BROADCAST }}
          className="w-[740px] h-[3px] bg-gradient-to-l from-transparent via-cyan-400 to-white shadow-[0_0_16px_rgba(0,229,255,0.8)] origin-left"
        />
      </div>

      {/* =========================================================================
          LAYERS 08 & 09: VERTICAL CENTER AXIS PINS (TOP & BOTTOM)
          ========================================================================= */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-between pointer-events-none py-16">
        {/* Layer 08: Top Vertical Guide */}
        <motion.div
          initial={{ y: -450, scaleY: 0 }}
          animate={{ y: 0, scaleY: 1 }}
          exit={{ y: -450, scaleY: 0 }}
          transition={{ delay: 0.08, duration: 0.52, ease: EASE_BROADCAST }}
          className="w-[2px] h-[190px] bg-gradient-to-b from-transparent via-purple-400 to-cyan-300 origin-top shadow-[0_0_12px_rgba(168,85,247,0.7)]"
        />

        {/* Layer 09: Bottom Vertical Guide */}
        <motion.div
          initial={{ y: 450, scaleY: 0 }}
          animate={{ y: 0, scaleY: 1 }}
          exit={{ y: 450, scaleY: 0 }}
          transition={{ delay: 0.08, duration: 0.52, ease: EASE_BROADCAST }}
          className="w-[2px] h-[190px] bg-gradient-to-t from-transparent via-cyan-400 to-purple-300 origin-bottom shadow-[0_0_12px_rgba(0,229,255,0.7)]"
        />
      </div>

      {/* =========================================================================
          LAYERS 10 & 11: OUTER CHAMFER FRAMING BRACKETS (LEFT & RIGHT FLANKS)
          ========================================================================= */}
      <div className="absolute inset-x-28 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
        <motion.div
          initial={{ x: -160, opacity: 1, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          animate={{ x: 0, opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          exit={{ x: -160, opacity: 1, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          transition={{ delay: 0.12, duration: 0.48, ease: EASE_BROADCAST }}
          className="w-6 h-44 border-l-2 border-y-2 border-cyan-400/70 skew-y-[-12deg]"
        />
        <motion.div
          initial={{ x: 160, opacity: 1, clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
          animate={{ x: 0, opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          exit={{ x: 160, opacity: 1, clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
          transition={{ delay: 0.12, duration: 0.48, ease: EASE_BROADCAST }}
          className="w-6 h-44 border-r-2 border-y-2 border-cyan-400/70 skew-y-[12deg]"
        />
      </div>

      {/* =========================================================================
          LAYER 12: SYMMETRICAL CHEVRON CROWN (TOP ASCENDING)
          ========================================================================= */}
      <div className="relative z-10 flex flex-col items-center mb-4">
        <motion.div
          initial={{
            clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
            scale: 0.8,
            y: -15,
          }}
          animate={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            scale: 1,
            y: 0,
          }}
          exit={{
            clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
            scale: 0.8,
            y: -15,
          }}
          transition={{ delay: 0.14, duration: 0.52, ease: EASE_BROADCAST }}
          className="flex flex-col items-center drop-shadow-[0_0_18px_rgba(0,229,255,0.6)]"
        >
          <svg width="68" height="26" viewBox="0 0 68 26" fill="none">
            <path
              d="M3 23 L34 5 L65 23"
              stroke="#00e5ff"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

      {/* =========================================================================
          LAYERS 14, 15, 16, 17: PERFORMANCE NUMBER BADGE (4 COORDINATED SUB-LAYERS)
          ========================================================================= */}
      {shouldShowNumber && num && (
        <motion.div
          initial={{
            clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
            y: -24,
          }}
          animate={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            y: 0,
          }}
          exit={{
            clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
            y: -24,
          }}
          transition={{ delay: 0.2, duration: 0.54, ease: EASE_BROADCAST }}
          className="relative z-20 flex items-center justify-center gap-4 mb-4"
        >
          {/* Left Chamfer Accent */}
          <div className="w-8 h-2 bg-gradient-to-r from-transparent to-cyan-400 skew-x-[-22deg]" />

          {/* Layer 14: Central Badge Container */}
          <div className="chamfer-slant bg-gradient-to-r from-[#0d1230] via-[#1a144b] to-[#0d1230] border-y-2 border-cyan-400 px-8 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.85)] flex items-center gap-4">
            <div className="chamfer-unslant flex items-center gap-3">
              {/* Layer 15: Actuación Label Mask Reveal */}
              <motion.span
                initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
                animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                transition={{ delay: 0.26, duration: 0.4, ease: EASE_BROADCAST }}
                className="font-mono text-cyan-300 text-[18px] font-black tracking-widest uppercase"
              >
                ACTUACIÓN
              </motion.span>

              {/* Layer 16: Divider */}
              <div className="w-1.5 h-5 bg-cyan-400 skew-x-[-22deg]" />

              {/* Layer 17: Digit Mask Reveal */}
              <motion.span
                initial={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }}
                animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                transition={{ delay: 0.3, duration: 0.45, ease: EASE_BROADCAST }}
                className="font-heavy font-mono-num font-black text-white text-[28px] tracking-tight leading-none"
              >
                {num}
              </motion.span>
            </div>
          </div>

          {/* Right Chamfer Accent */}
          <div className="w-8 h-2 bg-gradient-to-l from-transparent to-cyan-400 skew-x-[-22deg]" />
        </motion.div>
      )}

      {/* =========================================================================
          LAYERS 18 & 19: CENTRAL ARTIST NAME (CHAMFER CONTAINER & TEXT REVEAL)
          ========================================================================= */}
      <div className="relative z-20 max-w-[1500px] text-center px-12 overflow-hidden py-2">
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
            y: -40,
          }}
          transition={{ delay: 0.28, duration: 0.62, ease: EASE_BROADCAST }}
          className="flex justify-center"
        >
          <h1
            style={artistStyle}
            className="font-heavy font-black text-white uppercase drop-shadow-[0_16px_36px_rgba(0,0,0,0.95)] tracking-tight inline-block select-none"
          >
            {rawArtist}
          </h1>
        </motion.div>
      </div>

      {/* =========================================================================
          LAYERS 20 & 21: SONG TITLE (SLANTED STRIP & TYPOGRAPHY WIPE)
          ========================================================================= */}
      <motion.div
        initial={{
          scaleX: 0,
          clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
        }}
        animate={{
          scaleX: 1,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}
        exit={{
          scaleX: 0,
          clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
        }}
        transition={{ delay: 0.36, duration: 0.55, ease: EASE_BROADCAST }}
        className="relative z-20 mt-3 origin-center"
      >
        <div className="chamfer-slant bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 px-12 py-2.5 border-y border-purple-300/60 shadow-[0_12px_28px_rgba(67,56,202,0.45)]">
          <div className="chamfer-unslant flex items-center justify-center gap-3">
            <motion.span
              initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
              animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
              transition={{ delay: 0.42, duration: 0.5, ease: EASE_BROADCAST }}
              style={songStyle}
              className="font-broadcast font-bold text-cyan-200 tracking-wider uppercase leading-none drop-shadow-md"
            >
              «{rawSong}»
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* =========================================================================
          LAYERS 22, 23, 24, 25: METADATA SECTION (HORIZON BAR & 3 COLUMNS)
          ========================================================================= */}
      <motion.div
        initial={{
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          y: 25,
        }}
        animate={{
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          y: 0,
        }}
        exit={{
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          y: 25,
        }}
        transition={{ delay: 0.44, duration: 0.56, ease: EASE_BROADCAST }}
        className="relative z-20 mt-6 flex items-center justify-center gap-10 px-12 py-3 bg-[#0d0926]/90 border-y border-purple-500/40 chamfer-slant shadow-[0_10px_30px_rgba(0,0,0,0.85)] max-w-[1300px]"
      >
        {/* Layer 23: Column 1 (Intérprete) */}
        <div className="chamfer-unslant flex flex-col items-center text-center px-4">
          <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-0.5">
            INTÉRPRETE
          </span>
          <span className="font-broadcast text-xs font-bold text-slate-100 uppercase tracking-wide">
            {rawArtist}
          </span>
        </div>

        {/* Separator Needle */}
        <div className="chamfer-unslant w-[1px] h-7 bg-purple-500/50" />

        {/* Layer 24: Column 2 (Compositores) */}
        <div className="chamfer-unslant flex flex-col items-center text-center px-4">
          <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-0.5">
            COMPOSICIÓN Y LETRA
          </span>
          <span className="font-broadcast text-xs font-bold text-slate-100 uppercase tracking-wide">
            {composers}
          </span>
        </div>

        {/* Separator Needle */}
        <div className="chamfer-unslant w-[1px] h-7 bg-purple-500/50" />

        {/* Layer 25: Column 3 (Arreglos) */}
        <div className="chamfer-unslant flex flex-col items-center text-center px-4">
          <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-0.5">
            PRODUCCIÓN / ARREGLOS
          </span>
          <span className="font-broadcast text-xs font-bold text-slate-100 uppercase tracking-wide">
            {arrangers}
          </span>
        </div>
      </motion.div>

      {/* =========================================================================
          LAYERS 26 & 27: CORNER REGISTRATION CROSSHAIRS (TV SAFE 1920x1080)
          ========================================================================= */}
      <div className="absolute inset-16 pointer-events-none flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: EASE_BROADCAST }}
            className="w-4 h-4 border-t-2 border-l-2 border-cyan-400/60"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: EASE_BROADCAST }}
            className="w-4 h-4 border-t-2 border-r-2 border-cyan-400/60"
          />
        </div>
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: EASE_BROADCAST }}
            className="w-4 h-4 border-b-2 border-l-2 border-cyan-400/60"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: EASE_BROADCAST }}
            className="w-4 h-4 border-b-2 border-r-2 border-cyan-400/60"
          />
        </div>
      </div>

      {/* =========================================================================
          LAYER 28: SATELLITE BILATERAL FLARE & LOWER ACCENT BAR
          ========================================================================= */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{ delay: 0.5, duration: 0.48, ease: EASE_BROADCAST }}
        className="relative z-10 w-[540px] h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-8 origin-center shadow-[0_0_12px_#00e5ff]"
      />
    </div>
  );
};

// Aliases for compatibility with all project callers
export const StageReadyGraphic = StageReady;
export default StageReady;
