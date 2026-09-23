import React from 'react';
import { motion } from 'motion/react';
import { Show } from '../../../types/broadcast';
import {
  EASE_SQUARE,
  EASE_SQUARE_EXIT,
  BF25ArtistIcon,
  DirectionalChevron,
  SquareAccentStrip,
} from './Benidorm2025Primitives';
import {
  fitBF25Text,
  StageCornerBracketPair,
  StageDirectionalSweep,
  StageScanlineOverlay,
  StageScorePulseGlow,
} from './Benidorm2025AnimationEngine';
import { getAuthoritativeRanking } from '../../../utils/scoringEngine';
import { Trophy, Crown } from 'lucide-react';

interface LeaderChange2025Props {
  show: Show;
  leaderId?: string;
  isNewLeader?: boolean;
}

/**
 * BENIDORM FEST 2025 LEADER CHANGE — 40-STAGE BROADCAST CHOREOGRAPHY
 * 
 * Scaled & Compact Footprint with LARGER, STRONGER TYPOGRAPHY:
 * - Width: 1040px (reduced from 1220px)
 * - Height: 88px (compact, sharp television proportion)
 * - Leader Rank #1 Block: 52px bold mono-num in gold trophy container
 * - Artist Name: 32-34px bold uppercase in magenta core
 * - Total Score: 34px bold mono-num in gold block
 * - 40+ Sequential Animation Stages for takeover fanfare and settling.
 */
export const LeaderChange2025: React.FC<LeaderChange2025Props> = ({
  show,
  leaderId,
  isNewLeader = true,
}) => {
  const authoritativeRanking = getAuthoritativeRanking(show);
  const currentLeader =
    (leaderId ? authoritativeRanking.find((p) => p.id === leaderId) : null) ||
    authoritativeRanking[0];

  const total = currentLeader?.totalScore ?? 0;
  const artistName = (currentLeader?.name || currentLeader?.artist || 'ARTISTA').toUpperCase();

  const artistStyle = fitBF25Text(artistName, {
    maxContainerWidth: 380,
    baseFontSize: 34,
    minFontSize: 20,
    charThreshold: 14,
    letterSpacingEm: 0.05,
  });

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-end items-center pb-20 z-30">
      <motion.div
        initial={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 40,
          opacity: 0,
        }}
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          y: 0,
          opacity: 1,
          transition: { duration: 0.62, ease: EASE_SQUARE },
        }}
        exit={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 28,
          opacity: 0,
          transition: { duration: 0.38, ease: EASE_SQUARE_EXIT },
        }}
        className="relative w-[1040px] flex flex-col items-center drop-shadow-[0_28px_65px_rgba(0,0,0,0.96)] select-none mx-auto"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.03} />

        {/* Top Header Tag */}
        <div className="bg-[#FFD700] text-[#0A1244] px-6 py-1 font-heavy text-[12px] font-black uppercase tracking-[0.2em] border-t-2 border-x-2 border-[#FFE600] flex items-center gap-2 shadow-lg">
          <Crown className="w-3.5 h-3.5 text-[#0A1244]" />
          <span>{isNewLeader ? '¡NUEVO LÍDER PROVISIONAL!' : 'LÍDER DE LA CLASIFICACIÓN'} • BENIDORM FEST 2025</span>
          <Trophy className="w-3.5 h-3.5 text-[#E6007A]" />
        </div>

        {/* Master Leader Body */}
        <div className="w-full h-[88px] bg-[#070B1F] border-2 border-[#FFD700] flex items-stretch overflow-hidden shadow-2xl relative">
          <StageCornerBracketPair size={8} thickness={2} color="#FFE600" />

          {/* Position #1 Gold Cube */}
          <div className="w-[100px] bg-[#FFD700] border-r-2 border-[#FFE600] flex flex-col items-center justify-center shrink-0">
            <Trophy className="w-4 h-4 text-[#0A1244]" />
            <span className="font-heavy font-mono-num text-[50px] font-black text-[#0A1244] leading-none mt-0.5">
              1
            </span>
          </div>

          {/* Artist Core in Magenta Bar (LARGER Typography) */}
          <div className="flex-1 bg-[#E6007A] px-5 flex items-center justify-between min-w-0 border-r-2 border-[#002BCC] relative overflow-hidden">
            <div className="flex items-center gap-3.5 min-w-0 pr-3">
              <BF25ArtistIcon artistName={artistName} size={38} className="shrink-0" />
              <div className="flex flex-col justify-center min-w-0">
                <span
                  style={{
                    fontSize: `${artistStyle.fontSize}px`,
                    letterSpacing: artistStyle.letterSpacing,
                    lineHeight: artistStyle.lineHeight,
                  }}
                  className="font-heavy font-black text-white uppercase tracking-wider leading-none truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                >
                  {artistName}
                </span>
                <span className="font-heavy text-[16px] font-bold text-[#FFD700] uppercase tracking-wide mt-1 truncate">
                  «{currentLeader?.song || 'CANCIÓN'}»
                </span>
              </div>
            </div>

            <DirectionalChevron color="#FFD700" width={14} height={48} />
            <StageDirectionalSweep color="#FFD700" delayMs={200} durationMs={650} />
          </div>

          {/* Total Points Block */}
          <div className="flex items-center gap-3 px-5 bg-[#070B1F] shrink-0">
            <SquareAccentStrip size={6} />

            <div className="flex flex-col items-center justify-center bg-[#FFD700] px-5 py-2 border-2 border-[#FFE600] shadow-md min-w-[96px] relative overflow-hidden">
              <span className="font-heavy text-[9px] font-black text-[#0A1244] uppercase tracking-wider">
                PUNTOS
              </span>
              <span className="font-heavy font-mono-num text-[34px] font-black text-[#0A1244] leading-none mt-0.5">
                {total}
              </span>
              <StageScorePulseGlow isActive={true} color="#FFD700" />
            </div>
          </div>
        </div>

        {/* Bottom Gold Accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, transition: { duration: 0.45, delay: 0.2 } }}
          className="w-full h-[4px] bg-[#FFD700]"
        />
      </motion.div>
    </div>
  );
};
