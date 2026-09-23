import React from 'react';
import { motion } from 'motion/react';
import { EASE_BROADCAST, EASE_BROADCAST_EXIT } from './primitives/BenidormPrimitives';

interface LiveBugGraphicProps {
  festivalName?: string;
  stageName?: string;
  showLiveTag?: boolean;
  liveTagText?: string;
  isHold?: boolean;
  position?: 'bottom-left' | 'top-left' | 'bottom-right';
  isMinimalWhite?: boolean;
}

/**
 * BENIDORM FEST TELEVISION PACKAGE IDENTIFIER (LIVE BUG)
 * Requirements:
 * - Permanent text: BENIDORM FEST (NO "LIVE", NO "DIRECTO", NO "ON AIR")
 * - Dynamic internal looping broadcast animation (traveling beam, chevron travel, edge shifts)
 * - Strictly zero fades on entrance, hold or exit (directional clipping and mask reveals)
 * - Fixed screen position in bottom-left safe broadcast area
 * - When Performance Identifier is ON AIR: transforms smoothly into minimal transparent white version
 */
export const LiveBugGraphic: React.FC<LiveBugGraphicProps> = ({
  festivalName = 'BENIDORM FEST',
  stageName,
  position = 'bottom-left',
  isMinimalWhite = false,
}) => {
  const parts = festivalName.split(' ');
  const line1 = parts[0] || 'BENIDORM';
  const line2 = parts.slice(1).join(' ') || 'FEST';

  const positionClasses =
    position === 'bottom-left'
      ? 'bottom-14 left-20'
      : position === 'top-left'
      ? 'top-14 left-20'
      : 'bottom-14 right-20';

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none z-50">
      {/* Root Layer Container with Strictly Masked Directional Entrance & Exit */}
      <motion.div
        initial={{
          x: -60,
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        }}
        animate={{
          x: 0,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          transition: { duration: 0.52, ease: EASE_BROADCAST },
        }}
        exit={{
          x: -50,
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
          transition: { duration: 0.38, ease: EASE_BROADCAST_EXIT },
        }}
        className={`absolute ${positionClasses} flex items-center drop-shadow-[0_16px_36px_rgba(0,0,0,0.92)]`}
      >
        {/* Compound Multi-Layer Broadcast Bug Element */}
        <div className="relative flex items-center">
          
          {/* =========================================================================
              LAYER 01: BASE STRUCTURAL CHAMFERED CONTAINER (Retracts when isMinimalWhite)
              ========================================================================= */}
          <motion.div
            animate={{
              clipPath: isMinimalWhite
                ? 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
                : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              scaleX: isMinimalWhite ? 0 : 1,
            }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 chamfer-slant bg-gradient-to-r from-[#060818] via-[#0e1336] to-[#181347] border-y border-purple-500/50 shadow-2xl overflow-hidden origin-left pointer-events-none"
          >
            {/* Dark glass backdrop layer */}
            <div className="absolute inset-0 bg-[#050714]/30 pointer-events-none" />

            {/* =====================================================================
                LAYER 02: INTERNAL LOOPING LIGHT BEAM SWEEP (Continuous Broadcast Loop)
                ===================================================================== */}
            <motion.div
              animate={{
                x: ['-160%', '320%'],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
              }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent skew-x-[-22deg] pointer-events-none z-20"
            />

            {/* =====================================================================
                LAYER 03: INTERNAL COLOR SHIFT GEOMETRY (Cyan <-> Royal Purple)
                ===================================================================== */}
            <motion.div
              animate={{
                clipPath: [
                  'polygon(0% 0%, 40% 0%, 20% 100%, 0% 100%)',
                  'polygon(30% 0%, 80% 0%, 60% 100%, 10% 100%)',
                  'polygon(60% 0%, 100% 0%, 100% 100%, 40% 100%)',
                  'polygon(0% 0%, 40% 0%, 20% 100%, 0% 100%)',
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-400/20 to-purple-600/10 pointer-events-none z-10"
            />

            {/* Left Edge Chamfer Accent Bar */}
            <div className="absolute left-0 inset-y-0 w-[4px] bg-gradient-to-b from-cyan-400 via-sky-300 to-purple-600 shadow-[0_0_10px_rgba(0,229,255,0.8)]" />

            {/* Micro chevron travel inside container */}
            <div className="chamfer-unslant relative flex items-center overflow-hidden w-6 h-8 absolute left-6 top-1/2 -translate-y-1/2">
              <motion.div
                animate={{
                  x: [-18, 10],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="flex items-center gap-1.5 absolute"
              >
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-3.5 h-3.5 text-cyan-400/70 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* =========================================================================
              LAYER 05: TYPOGRAPHY (BENIDORM / FEST — Strictly Zero Fades)
              When isMinimalWhite: typography remains pure white, no background
              ========================================================================= */}
          <div className={`relative z-30 transition-all duration-300 ${isMinimalWhite ? 'px-1 py-1' : 'px-6 py-3 pl-14'}`}>
            <div className="flex flex-col leading-none select-none">
              {/* Line 1: BENIDORM */}
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: 28 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="font-heavy font-black text-[26px] tracking-[0.08em] uppercase text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] block"
                >
                  {line1}
                </motion.span>
              </div>

              {/* Line 2: FEST */}
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: -24 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-heavy font-black text-[20px] tracking-[0.28em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] block -mt-0.5 ${
                    isMinimalWhite ? 'text-white' : 'text-cyan-300'
                  }`}
                >
                  {line2}
                </motion.span>
              </div>
            </div>

            {/* Optional Stage/Phase tag */}
            {stageName && !isMinimalWhite && (
              <div className="border-l border-purple-500/50 pl-3.5 mt-1">
                <span className="font-broadcast text-[12px] font-bold tracking-widest text-purple-200 uppercase block">
                  {stageName}
                </span>
              </div>
            )}
          </div>

          {/* =========================================================================
              LAYER 06: DIRECTIONAL THIN BOTTOM ACCENT LINE with internal shift
              (Hidden when isMinimalWhite)
              ========================================================================= */}
          {!isMinimalWhite && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-1 left-2 right-2 h-[2.5px] bg-gradient-to-r from-cyan-400 via-purple-500 to-transparent shadow-[0_0_10px_rgba(0,229,255,0.7)] origin-left"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};
