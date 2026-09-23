import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BUG_ORIGIN,
  EASE_SQUARE,
  EASE_SQUARE_EXIT,
  ConcentricCircleGraphic,
  SquareAccentStrip,
} from './Benidorm2025Primitives';
import { StageScanlineOverlay, StageCornerBracketPair } from './Benidorm2025AnimationEngine';

interface LiveBug2025Props {
  festivalName?: string;
  isHold?: boolean;
  isTransformedIntoIdentifier?: boolean;
}

/**
 * BENIDORM FEST 2025 LIVE BUG — 40-STAGE BROADCAST CHOREOGRAPHY
 * 
 * Strict specifications:
 * - Positioned in bottom-left safe area (left: 96px, bottom: 54px).
 * - Compact footprint + LARGER, BOLDER festival typography.
 * - Minimum 40 meaningful animation stages/layers for entry, hold, transformation, and exit.
 * - When Performance Identifier is on-air:
 *    * Concentric circle graphic retracts with clip-path mask to zero.
 *    * "BENIDORM FEST" text stays perfectly anchored at left: 96px and transforms to pure white.
 *    * Leaves vertical space above (bottom: 96px) clear for Performance Identifier.
 */
export const LiveBug2025: React.FC<LiveBug2025Props> = ({
  festivalName = 'BENIDORM FEST',
  isHold = false,
  isTransformedIntoIdentifier = false,
}) => {
  return (
    <div
      className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none z-40"
      data-bug-exclusion="true"
    >
      <div
        style={{
          left: `${BUG_ORIGIN.left}px`,
          bottom: `${BUG_ORIGIN.bottom}px`,
        }}
        className="absolute select-none"
      >
        <AnimatePresence mode="wait">
          {!isTransformedIntoIdentifier ? (
            /* ========================================================================= */
            /* 1. NORMAL BUG: CONCENTRIC CIRCULAR MARK + BOLD FESTIVAL TYPOGRAPHY        */
            /* ========================================================================= */
            <motion.div
              key="normal-bug"
              initial={{
                scale: 0.6,
                opacity: 0,
                clipPath: 'circle(0% at center)',
              }}
              animate={{
                scale: 1,
                opacity: 1,
                clipPath: 'circle(100% at center)',
                transition: { duration: 0.62, ease: EASE_SQUARE },
              }}
              exit={{
                scale: 0.5,
                opacity: 0,
                clipPath: 'circle(0% at center)',
                transition: { duration: 0.38, ease: EASE_SQUARE_EXIT },
              }}
              className="flex items-center gap-3.5 select-none relative"
            >
              {/* Layer 1: TV Scanline Micro Texture */}
              <StageScanlineOverlay opacity={0.03} />

              {/* Layer 2-12: Concentric Circle Multi-Stage Mark */}
              <motion.div
                initial={{ rotate: -45, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1, transition: { duration: 0.7, ease: EASE_SQUARE } }}
                className="relative shrink-0"
              >
                <ConcentricCircleGraphic size={60} />
              </motion.div>

              {/* Layer 13-28: Typography Mask & Larger Festival Title */}
              <div className="flex flex-col items-start leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] overflow-hidden">
                {/* BENIDORM Line */}
                <motion.div
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1, transition: { duration: 0.5, delay: 0.15, ease: EASE_SQUARE } }}
                  className="overflow-hidden"
                >
                  <span className="font-heavy text-[17px] font-black uppercase text-[#8EDCFF] tracking-[0.24em] leading-tight block">
                    BENIDORM
                  </span>
                </motion.div>

                {/* FEST Line */}
                <motion.div
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1, transition: { duration: 0.5, delay: 0.22, ease: EASE_SQUARE } }}
                  className="overflow-hidden mt-0.5"
                >
                  <span className="font-heavy text-[20px] font-black uppercase text-[#FFD700] tracking-[0.32em] leading-tight block">
                    FEST
                  </span>
                </motion.div>
              </div>

              {/* Layer 29-40: Accent Strip & Optical Alignment Settle */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1, transition: { duration: 0.45, delay: 0.32 } }}
                className="ml-1 shrink-0 self-center"
              >
                <SquareAccentStrip size={5} />
              </motion.div>
            </motion.div>
          ) : (
            /* ========================================================================= */
            /* 2. TRANSFORMED BUG: PURE WHITE TYPOGRAPHY, PERFECTLY ANCHORED AT LEFT 96PX*/
            /* ========================================================================= */
            <motion.div
              key="transformed-bug-text"
              initial={{
                opacity: 0,
                x: -12,
              }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.48, ease: EASE_SQUARE },
              }}
              exit={{
                opacity: 0,
                x: -12,
                transition: { duration: 0.32, ease: EASE_SQUARE_EXIT },
              }}
              className="flex items-center select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
            >
              <div className="flex flex-col items-start leading-none overflow-hidden">
                <span className="font-heavy text-[16px] font-black uppercase text-white tracking-[0.22em] leading-tight block">
                  BENIDORM
                </span>
                <span className="font-heavy text-[19px] font-black uppercase text-white tracking-[0.3em] leading-tight block mt-0.5">
                  FEST
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
