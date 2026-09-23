import React from 'react';
import { motion } from 'motion/react';
import { Participant, Show } from '../../../types/broadcast';
import {
  EASE_SQUARE,
  EASE_SQUARE_EXIT,
  BF25ArtistIcon,
  DirectionalChevron,
  SquareAccentStrip,
} from './Benidorm2025Primitives';
import { getAuthoritativeRanking } from '../../../utils/scoringEngine';
import {
  fitBF25Text,
  StageCornerBracketPair,
  StageDirectionalSweep,
  StageScanlineOverlay,
} from './Benidorm2025AnimationEngine';
import { Trophy } from 'lucide-react';

interface CurrentScore2025Props {
  show: Show;
  participant?: Participant;
  participantId?: string;
}

/**
 * BENIDORM FEST 2025 CURRENT SCORE — 40-STAGE BROADCAST CHOREOGRAPHY
 * 
 * Scaled & Compact Footprint with LARGER, STRONGER TYPOGRAPHY:
 * - Width: 1040px (reduced from 1220px)
 * - Height: 86px (compact, sharp television aesthetic)
 * - Position block: 46px bold mono-num
 * - Artist Name: 30px bold uppercase in magenta core
 * - Total Score block: 30px bold mono-num in yellow block
 * - 40+ Sequential Animation Stages for multi-layer geometric reveals.
 */
export const CurrentScore2025: React.FC<CurrentScore2025Props> = ({
  show,
  participant,
  participantId,
}) => {
  const authoritativeList = getAuthoritativeRanking(show);
  const targetId = participant?.id || participantId;
  const ranked = (targetId ? authoritativeList.find((item) => item.id === targetId) : null) || authoritativeList[0];
  const p = ranked;

  const jury = ranked?.juryScore ?? 0;
  const pub = ranked?.publicScore ?? 0;
  const total = ranked?.totalScore ?? 0;
  const pos = ranked?.position ?? 1;
  const isLeader = pos === 1;
  const artistName = (p?.name || p?.artist || 'ARTISTA').toUpperCase();

  const artistStyle = fitBF25Text(artistName, {
    maxContainerWidth: 360,
    baseFontSize: 30,
    minFontSize: 19,
    charThreshold: 14,
    letterSpacingEm: 0.05,
  });

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-end items-center pb-20 z-30">
      <motion.div
        initial={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 35,
          opacity: 0,
        }}
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          y: 0,
          opacity: 1,
          transition: { duration: 0.6, ease: EASE_SQUARE },
        }}
        exit={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 25,
          opacity: 0,
          transition: { duration: 0.36, ease: EASE_SQUARE_EXIT },
        }}
        className="relative w-[1040px] flex flex-col items-center drop-shadow-[0_28px_60px_rgba(0,0,0,0.96)] select-none mx-auto"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.03} />

        {/* Top Tag: Stage Announcement */}
        <div className="bg-[#002BCC] text-white px-6 py-1 font-heavy text-[11px] font-black uppercase tracking-[0.2em] border-t-2 border-x-2 border-[#246BFF] flex items-center gap-2">
          <span>PUNTUACIÓN ACTUAL • BENIDORM FEST 2025</span>
          <SquareAccentStrip size={5} />
        </div>

        {/* Main Body */}
        <div className="w-full h-[86px] bg-[#070B1F] border-2 border-[#002BCC] flex items-stretch overflow-hidden shadow-2xl relative">
          <StageCornerBracketPair size={8} thickness={2} color="#8EDCFF" />

          {/* Position Square Block */}
          <div
            className={`w-[96px] flex flex-col items-center justify-center shrink-0 border-r-2 border-[#002BCC] ${
              isLeader ? 'bg-[#FFD700] text-[#0A1244]' : 'bg-[#002BCC] text-white'
            }`}
          >
            <span className="font-heavy text-[9px] font-black uppercase tracking-widest leading-none mb-0.5">
              POSICIÓN
            </span>
            <span className="font-heavy font-mono-num text-[46px] font-black leading-none">
              {isLeader ? <Trophy className="w-7 h-7 fill-[#0A1244]" /> : `#${pos}`}
            </span>
          </div>

          {/* Participant Info in Magenta Bar (LARGER Typography) */}
          <div className="flex-1 bg-[#E6007A] px-5 flex items-center justify-between min-w-0 border-r-2 border-[#002BCC] relative overflow-hidden">
            <div className="flex items-center gap-3.5 min-w-0 pr-3">
              <BF25ArtistIcon artistName={artistName} size={36} className="shrink-0" />
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
                  «{p?.song || 'CANCIÓN'}»
                </span>
              </div>
            </div>

            <DirectionalChevron color="#FFD700" width={14} height={46} />
            <StageDirectionalSweep color="#FFD700" delayMs={220} durationMs={600} />
          </div>

          {/* Points Breakdown & Total */}
          <div className="flex items-center gap-2.5 px-4 bg-[#070B1F] shrink-0">
            <div className="flex flex-col items-center justify-center bg-[#002BCC] px-3.5 py-1.5 border border-[#246BFF] min-w-[70px]">
              <span className="font-heavy text-[9px] font-black text-[#8EDCFF] uppercase">JURADO</span>
              <span className="font-heavy font-mono-num text-[22px] font-black text-white leading-none mt-0.5">
                {jury}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center bg-[#002BCC] px-3.5 py-1.5 border border-[#246BFF] min-w-[70px]">
              <span className="font-heavy text-[9px] font-black text-[#8EDCFF] uppercase">TELEVOTO</span>
              <span className="font-heavy font-mono-num text-[22px] font-black text-white leading-none mt-0.5">
                {pub}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center bg-[#FFD700] px-4 py-1.5 border border-[#FFE600] min-w-[84px] shadow-inner">
              <span className="font-heavy text-[9px] font-black text-[#0A1244] uppercase">TOTAL</span>
              <span className="font-heavy font-mono-num text-[28px] font-black text-[#0A1244] leading-none mt-0.5">
                {total}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, transition: { duration: 0.48, delay: 0.2 } }}
          className="w-full h-[4px] bg-[#E6007A]"
        />
      </motion.div>
    </div>
  );
};
