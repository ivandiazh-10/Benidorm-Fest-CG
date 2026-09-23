import React from 'react';
import { motion } from 'motion/react';
import { Participant } from '../../../types/broadcast';
import { LiveBug2024, SAFE_LEFT } from './Benidorm2024Primitives';

interface PerformanceId2024Props {
  participant?: Participant;
  customNumber?: number | string;
  customArtist?: string;
  hasLiveBugLayer?: boolean;
}

const BROADCAST_EASE = [0.16, 1, 0.3, 1] as const;

export const PerformanceId2024: React.FC<PerformanceId2024Props> = ({
  participant,
  customNumber,
  customArtist,
  hasLiveBugLayer = false,
}) => {
  const number = customNumber ?? participant?.performanceNumber ?? 1;
  const numStr = String(number).padStart(2, '0');
  const artist = customArtist || participant?.artist || 'Nebulossa';

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden pointer-events-none select-none z-30">
      {/* Positioned directly above the bug without any overlap */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5, ease: BROADCAST_EASE }}
        style={{
          position: 'absolute',
          left: `${SAFE_LEFT}px`,
          bottom: '160px',
        }}
        className="flex items-center gap-2.5"
      >
        {/* Number Capsule */}
        <div className="w-[48px] h-[48px] rounded-full border-2 border-white bg-[#2927F5] flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.85)]">
          <span className="font-sans font-black text-white text-[22px] tabular-nums">
            {numStr}
          </span>
        </div>

        {/* Artist Name Capsule */}
        <div className="h-[48px] px-6 rounded-full border-2 border-white bg-[#080D2B] flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.85)] max-w-[420px]">
          <span className="font-sans font-extrabold text-[20px] text-white tracking-wide truncate">
            {artist}
          </span>
        </div>
      </motion.div>

      {/* Render bug if not rendered as a separate layer */}
      {!hasLiveBugLayer && <LiveBug2024 />}
    </div>
  );
};

export default PerformanceId2024;
