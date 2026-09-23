import React from 'react';
import { motion } from 'motion/react';
import { Participant } from '../../types/broadcast';
import { EASE_BROADCAST, EASE_BROADCAST_EXIT } from './primitives/BenidormPrimitives';

interface PerformanceIdGraphicProps {
  participant?: Participant;
  showPerformanceNumber?: boolean;
  customNumber?: string;
  position?: 'bottom-left' | 'top-left';
}

/**
 * INDEPENDENT PERFORMANCE IDENTIFIER
 * - Sits directly ABOVE the Live Bug in the safe zone
 * - Transparent background (compact, elegant, does not cover screen)
 * - Number + Artist Name (e.g. "03 / ASHA" or "ASHA" if number disabled)
 * - Manual operator control (PREVIEW -> TAKE)
 * - Multi-layer entrance, hold and exit mask choreographies
 */
export const PerformanceIdGraphic: React.FC<PerformanceIdGraphicProps> = ({
  participant,
  showPerformanceNumber,
  customNumber,
  position = 'bottom-left',
}) => {
  const isNumberDisabled =
    showPerformanceNumber === false || customNumber === '';

  const shouldShowNumber = !isNumberDisabled && (
    showPerformanceNumber === true ||
    (customNumber !== undefined && customNumber !== '') ||
    (participant?.performanceNumber !== undefined)
  );

  const num = shouldShowNumber
    ? (customNumber ||
      (participant?.performanceNumber
        ? String(participant.performanceNumber).padStart(2, '0')
        : '01'))
    : undefined;

  const artistName = participant?.name || participant?.artist || 'ARTISTA';

  // Sits directly ABOVE the Live Bug in the bottom-left safe zone
  // Bug typography is at left-20 bottom-14 (y ~= 960px).
  // ID sits directly above at left-20 bottom-[118px] (y ~= 910px).
  const positionClasses =
    position === 'bottom-left'
      ? 'bottom-[120px] left-20'
      : 'top-[120px] left-20';

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none z-50">
      <motion.div
        initial={{
          x: -40,
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        }}
        animate={{
          x: 0,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          transition: { duration: 0.44, ease: EASE_BROADCAST },
        }}
        exit={{
          x: -30,
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
          transition: { duration: 0.32, ease: EASE_BROADCAST_EXIT },
        }}
        className={`absolute ${positionClasses} flex items-center select-none`}
      >
        {/* Compound Transparent Broadcast Identifier: NO BACKGROUND, ALL WHITE */}
        <div className="flex items-center gap-2.5 px-1 py-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          {/* Performance Number */}
          {shouldShowNumber && num && (
            <>
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="block font-heavy font-mono-num text-[28px] font-black text-white leading-none tracking-tight"
                >
                  {num}
                </motion.span>
              </div>

              {/* Clean Slash Divider */}
              <span className="font-heavy text-[24px] font-light text-white/80 leading-none select-none">
                /
              </span>
            </>
          )}

          {/* Artist Name */}
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-heavy font-black text-[26px] tracking-wider uppercase text-white leading-none block whitespace-nowrap"
            >
              {artistName}
            </motion.span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
