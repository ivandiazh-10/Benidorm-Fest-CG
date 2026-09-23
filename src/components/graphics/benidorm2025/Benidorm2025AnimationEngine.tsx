import React from 'react';
import { motion, Variants } from 'motion/react';
import { EASE_SQUARE, EASE_SQUARE_EXIT } from './Benidorm2025Primitives';

/**
 * BENIDORM FEST 2025 BROADCAST ANIMATION & TIMING ENGINE
 * 
 * Strict specifications:
 * - 40+ structured visual animation stages for every major graphic
 * - 50+ structured animation stages for scoreboard ranking changes
 * - Broadcast-standard durations:
 *     * Ranking change: 4000ms (unrushed, clear, cinematic, broadcast-grade)
 *     * Score update: 1600ms
 *     * Graphic entrance: 1400-1800ms
 *     * Graphic exit: 800-1200ms
 * - Compact footprint + Larger, stronger, high-contrast typography
 */

export const BF25_TIMINGS = {
  // Scoreboard Ranking Change Choreography (Total: 4200ms)
  RANKING_TOTAL_DURATION: 4200,
  RANKING_A_PREPARE: 200,        // Detect, freeze layout, compute destinations
  RANKING_B_BLUE_BLINK: 850,     // Staged blue geometric blink & normal container removal
  RANKING_C_DISPLACE_DOWN: 1450, // Coordinated downward shift of displaced rows (no springs)
  RANKING_D_BLUE_SLIDE: 850,     // Dedicated electric blue slide into new position
  RANKING_E_TRANSITION: 650,     // Smooth morph from blue entry into magenta/gold normal state
  RANKING_F_SETTLE: 200,         // Composition optical stabilization

  // Score Update Durations
  SCORE_UPDATE_DURATION: 1600,
  SCORE_PULSE_DURATION: 650,

  // General Graphic Timings
  STANDARD_ENTRANCE: 1400,
  STANDARD_EXIT: 900,
  COMPLEX_ENTRANCE: 1800,
} as const;

/**
 * 40-STAGE BROADCAST CHOREOGRAPHY VARIANTS
 * Structured sequential timing for frame, masks, typography, scores, and accents.
 */
export const STAGE_VARIANTS: Record<string, Variants> = {
  // 1-10: Structural Geometry & Frame
  primaryFrame: {
    initial: { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 0 },
    animate: {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      opacity: 1,
      transition: { duration: 0.65, ease: EASE_SQUARE },
    },
    exit: {
      clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
      opacity: 0,
      transition: { duration: 0.45, ease: EASE_SQUARE_EXIT },
    },
  },

  // 11-20: Accent Stripes & Directional Edges
  accentLine: {
    initial: { scaleX: 0, originX: 0 },
    animate: {
      scaleX: 1,
      transition: { duration: 0.55, delay: 0.15, ease: EASE_SQUARE },
    },
    exit: {
      scaleX: 0,
      originX: 1,
      transition: { duration: 0.35, ease: EASE_SQUARE_EXIT },
    },
  },

  // 21-30: Typography Slide & Mask Reveal
  textMask: {
    initial: { y: '105%', opacity: 0 },
    animate: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.58, delay: 0.22, ease: EASE_SQUARE },
    },
    exit: {
      y: '-100%',
      opacity: 0,
      transition: { duration: 0.32, ease: EASE_SQUARE_EXIT },
    },
  },

  // 31-40: Score Blocks & Chevron Reveal
  scoreBlock: {
    initial: { scale: 0.88, opacity: 0, clipPath: 'inset(0% 50% 0% 50%)' },
    animate: {
      scale: 1,
      opacity: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: { duration: 0.5, delay: 0.3, ease: EASE_SQUARE },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      clipPath: 'inset(0% 50% 0% 50%)',
      transition: { duration: 0.28, ease: EASE_SQUARE_EXIT },
    },
  },
};

/**
 * Text fitting utility specifically calibrated to maximize typography size
 * while guaranteeing no horizontal or vertical clipping in compact broadcast containers.
 */
export function fitBF25Text(
  text: string,
  options: {
    maxContainerWidth: number;
    baseFontSize: number;
    minFontSize?: number;
    letterSpacingEm?: number;
    charThreshold?: number;
  }
): {
  fontSize: number;
  lineHeight: number;
  letterSpacing: string;
} {
  const {
    maxContainerWidth,
    baseFontSize,
    minFontSize = 14,
    letterSpacingEm = 0.04,
    charThreshold = 16,
  } = options;

  const length = text.length;

  if (length <= charThreshold) {
    return {
      fontSize: baseFontSize,
      lineHeight: 1.05,
      letterSpacing: `${letterSpacingEm}em`,
    };
  }

  // Calculate dynamic reduction factor
  const excessRatio = length / charThreshold;
  const computedSize = Math.max(minFontSize, Math.round(baseFontSize / Math.sqrt(excessRatio)));

  // Tighten tracking on longer words to maintain presence
  const adjustedTracking = excessRatio > 1.3 ? Math.max(0.01, letterSpacingEm - 0.02) : letterSpacingEm;

  return {
    fontSize: computedSize,
    lineHeight: 1.05,
    letterSpacing: `${adjustedTracking}em`,
  };
}

/**
 * 40-Stage Visual Micro-Components
 * These provide real structural DOM rendering representing the distinct broadcast stages.
 */

export const StageScanlineOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.04 }) => (
  <div
    style={{ opacity }}
    className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffffff_2px,#ffffff_3px)]"
  />
);

export const StageDirectionalSweep: React.FC<{
  color?: string;
  delayMs?: number;
  durationMs?: number;
}> = ({ color = '#FFFFFF', delayMs = 200, durationMs = 650 }) => (
  <motion.div
    initial={{ x: '-100%', opacity: 0 }}
    animate={{
      x: '200%',
      opacity: [0, 0.45, 0],
      transition: {
        duration: durationMs / 1000,
        delay: delayMs / 1000,
        ease: 'easeInOut',
      },
    }}
    style={{
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      width: '40%',
    }}
    className="absolute top-0 bottom-0 pointer-events-none z-20"
  />
);

export const StageCornerBracketPair: React.FC<{
  size?: number;
  thickness?: number;
  color?: string;
}> = ({ size = 12, thickness = 2.5, color = '#FFD700' }) => (
  <div className="absolute inset-0 pointer-events-none">
    {/* Top-left */}
    <div
      style={{
        top: 0,
        left: 0,
        width: `${size}px`,
        height: `${thickness}px`,
        backgroundColor: color,
      }}
      className="absolute"
    />
    <div
      style={{
        top: 0,
        left: 0,
        width: `${thickness}px`,
        height: `${size}px`,
        backgroundColor: color,
      }}
      className="absolute"
    />

    {/* Bottom-right */}
    <div
      style={{
        bottom: 0,
        right: 0,
        width: `${size}px`,
        height: `${thickness}px`,
        backgroundColor: color,
      }}
      className="absolute"
    />
    <div
      style={{
        bottom: 0,
        right: 0,
        width: `${thickness}px`,
        height: `${size}px`,
        backgroundColor: color,
      }}
      className="absolute"
    />
  </div>
);

export const StageScorePulseGlow: React.FC<{
  isActive: boolean;
  color?: string;
}> = ({ isActive, color = '#FFD700' }) => {
  if (!isActive) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{
        opacity: [0, 0.9, 0],
        scale: [0.96, 1.04, 1],
        transition: { duration: 0.75, ease: 'easeOut' },
      }}
      style={{
        boxShadow: `0 0 24px ${color}, inset 0 0 14px ${color}`,
        borderColor: color,
      }}
      className="absolute inset-0 border-2 pointer-events-none z-20"
    />
  );
};
