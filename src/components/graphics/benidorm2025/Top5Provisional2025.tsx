import React from 'react';
import { motion } from 'motion/react';
import { Show } from '../../../types/broadcast';
import { getAuthoritativeRanking } from '../../../utils/scoringEngine';
import { Trophy } from 'lucide-react';
import { StageScanlineOverlay, StageCornerBracketPair } from './Benidorm2025AnimationEngine';

interface Top5Provisional2025Props {
  show: Show;
  title?: string;
}

// Broadcast easing curves
const EASE_BROADCAST = [0.22, 1, 0.36, 1] as const;
const EASE_OUTRO = [0.4, 0, 0.7, 0.2] as const;

/**
 * BENIDORM FEST 2025 — TOP 5 PROVISIONAL
 * 
 * Specifically designed as a COMPACT BOTTOM-RIGHT SUMMARY:
 * - Positioned at bottom-right of 1920x1080 safe area (right: 96px, bottom: 74px)
 * - Shows ONLY the top 5 participants and their TOTAL SCORE
 * - Zero phase breakdowns (no separate jury, demoscopic, or public scores)
 * - Compact footprint (400px width, 240px height)
 * - Coordinated sequential row animations
 */
export const Top5Provisional2025: React.FC<Top5Provisional2025Props> = ({
  show,
  title = 'TOP 5 PROVISIONAL',
}) => {
  const ranking = getAuthoritativeRanking(show).slice(0, 5);

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none z-30">
      <motion.div
        initial={{
          opacity: 0,
          x: 40,
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        }}
        animate={{
          opacity: 1,
          x: 0,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          transition: { duration: 0.55, ease: EASE_BROADCAST },
        }}
        exit={{
          opacity: 0,
          x: 30,
          clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
          transition: { duration: 0.4, ease: EASE_OUTRO },
        }}
        style={{
          position: 'absolute',
          right: '96px',
          bottom: '74px',
          width: '420px',
        }}
        className="flex flex-col drop-shadow-[0_20px_50px_rgba(0,0,0,0.96)] border-2 border-[#2A65F5] bg-[#070B1F] overflow-hidden"
      >
        <StageScanlineOverlay opacity={0.03} />

        {/* Header Ribbon */}
        <div className="bg-[#002BCC] px-4 py-2 flex items-center justify-between border-b-2 border-[#2A65F5]">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#FFD700]" />
            <span className="font-heavy text-[13px] font-black uppercase text-white tracking-[0.2em]">
              {title}
            </span>
          </div>
          <span className="font-heavy text-[10px] font-bold text-[#8EDCFF] tracking-wider uppercase">
            TOTAL PUNTOS
          </span>
        </div>

        {/* Top 5 Rows */}
        <div className="flex flex-col divide-y divide-[#2A65F5]/30 relative">
          <StageCornerBracketPair size={6} thickness={1.5} color="#FFD700" />

          {ranking.map((row, idx) => {
            const isFirst = idx === 0;
            const rankNum = idx + 1;
            const artistName = (row.artist || row.name || 'ARTISTA').toUpperCase();

            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.35,
                    delay: 0.15 + idx * 0.08,
                    ease: EASE_BROADCAST,
                  },
                }}
                className={`flex items-stretch h-[38px] ${
                  isFirst ? 'bg-gradient-to-r from-[#FF007A]/25 to-transparent' : 'bg-transparent'
                }`}
              >
                {/* Position / Rank Box */}
                <div
                  className={`w-[44px] flex items-center justify-center shrink-0 border-r border-[#2A65F5]/40 font-heavy font-mono-num font-black ${
                    isFirst
                      ? 'bg-[#FFD700] text-[#0A1244] text-[18px]'
                      : 'bg-[#0A1244] text-[#8EDCFF] text-[15px]'
                  }`}
                >
                  #{rankNum}
                </div>

                {/* Artist Name */}
                <div className="flex-1 px-3 flex items-center min-w-0">
                  <span
                    className={`font-heavy font-black truncate uppercase ${
                      isFirst ? 'text-[#FFD700] text-[15px]' : 'text-white text-[14px]'
                    }`}
                  >
                    {artistName}
                  </span>
                </div>

                {/* Total Points Only */}
                <div
                  className={`w-[74px] flex items-center justify-center shrink-0 border-l border-[#2A65F5]/40 font-heavy font-mono-num font-black ${
                    isFirst
                      ? 'bg-[#FF007A] text-white text-[18px]'
                      : 'bg-[#002BCC]/80 text-[#FFD700] text-[16px]'
                  }`}
                >
                  {row.totalScore}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Accent */}
        <div className="h-[3px] bg-gradient-to-r from-[#FF007A] via-[#FFD700] to-[#002BCC]" />
      </motion.div>
    </div>
  );
};

export default Top5Provisional2025;
