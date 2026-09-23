import React from 'react';
import { motion } from 'motion/react';
import { Participant } from '../../../types/broadcast';
import {
  EASE_SQUARE,
  EASE_SQUARE_EXIT,
  BF25ArtistIcon,
  DirectionalChevron,
  SquareAccentStrip,
} from './Benidorm2025Primitives';
import { fitBF25Text, StageCornerBracketPair, StageDirectionalSweep, StageScanlineOverlay } from './Benidorm2025AnimationEngine';

interface PerformanceIntro2025Props {
  participant?: Participant;
  showPerformanceNumber?: boolean;
  customNumber?: string | number;
  customArtist?: string;
  customSong?: string;
  customComposers?: string;
  customArrangers?: string;
}

/**
 * BENIDORM FEST 2025 PERFORMANCE INTRO — 40-STAGE BROADCAST CHOREOGRAPHY
 * 
 * Scaled & Compact Footprint with MASSIVE, POWERFUL TYPOGRAPHY:
 * - Width: 1040px (reduced from 1260px, eliminating excess padding)
 * - Performance Number: 92px bold mono-num in yellow candidate block
 * - Artist Headline: 50-54px bold uppercase in magenta core
 * - Song Title: 30px bold yellow in royal blue container
 * - 40+ Sequential Animation Stages for multi-layer geometric reveals.
 */
export const PerformanceIntro2025: React.FC<PerformanceIntro2025Props> = ({
  participant,
  showPerformanceNumber = true,
  customNumber,
  customArtist,
  customSong,
  customComposers,
  customArrangers,
}) => {
  const num =
    customNumber !== undefined
      ? String(customNumber).padStart(2, '0')
      : participant?.performanceNumber !== undefined
      ? String(participant.performanceNumber).padStart(2, '0')
      : '01';

  const artist = (customArtist || participant?.name || participant?.artist || 'ARTISTA').toUpperCase();
  const song = customSong || participant?.song || 'CANCIÓN';
  const composers = customComposers || participant?.composers || 'Compositores Oficiales RTVE';
  const arrangers = customArrangers || participant?.arrangers || 'Producción Musical Benidorm Fest';

  const artistStyle = fitBF25Text(artist, {
    maxContainerWidth: 680,
    baseFontSize: 52,
    minFontSize: 30,
    charThreshold: 14,
    letterSpacingEm: 0.04,
  });

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none z-30 flex items-center justify-center p-12">
      <motion.div
        initial={{
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          scale: 0.96,
          opacity: 0,
        }}
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          scale: 1,
          opacity: 1,
          transition: { duration: 0.65, ease: EASE_SQUARE },
        }}
        exit={{
          clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
          scale: 0.96,
          opacity: 0,
          transition: { duration: 0.42, ease: EASE_SQUARE_EXIT },
        }}
        className="w-[1040px] flex flex-col drop-shadow-[0_32px_75px_rgba(0,0,0,0.98)] select-none"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.03} />

        {/* Top Header Tag */}
        <div className="h-[40px] bg-[#002BCC] border-t-2 border-l-2 border-r-2 border-[#246BFF] px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#E6007A] text-[#FFD700] px-3 py-0.5 font-heavy text-[11px] font-black uppercase tracking-widest">
              BENIDORM FEST 2025
            </div>
            <span className="font-heavy text-[14px] font-black text-white uppercase tracking-wider">
              PRESENTACIÓN OFICIAL
            </span>
          </div>
          <SquareAccentStrip size={6} />
        </div>

        {/* Master Identity Center Area */}
        <div className="bg-[#070B1F] border-x-2 border-b-2 border-[#002BCC] p-6 flex items-stretch gap-6 relative overflow-hidden">
          <StageCornerBracketPair size={10} thickness={2.5} color="#8EDCFF" />

          {/* Left: Giant Bright Yellow Performance Number Block */}
          {showPerformanceNumber && (
            <div className="w-[150px] bg-[#FFD700] border-2 border-[#FFE600] flex flex-col items-center justify-center shrink-0 shadow-2xl relative overflow-hidden">
              <span className="font-heavy text-[11px] font-black uppercase text-[#070B1F] tracking-widest leading-none mb-1">
                ACTUACIÓN
              </span>
              <span className="font-heavy font-mono-num text-[92px] font-black text-[#0A1244] leading-none">
                {num}
              </span>
            </div>
          )}

          {/* Right: Artist, Song & Official Credits */}
          <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
            {/* Magenta Artist Header with DOMINANT Typography */}
            <div className="bg-[#E6007A] px-5 py-3.5 flex items-center justify-between shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-4 min-w-0 pr-3">
                <BF25ArtistIcon artistName={artist} size={44} className="shrink-0" />
                <span
                  style={{
                    fontSize: `${artistStyle.fontSize}px`,
                    letterSpacing: artistStyle.letterSpacing,
                    lineHeight: artistStyle.lineHeight,
                  }}
                  className="font-heavy font-black text-white uppercase tracking-wider truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                >
                  {artist}
                </span>
              </div>
              <DirectionalChevron color="#FFD700" width={16} height={52} />
              <StageDirectionalSweep color="#FFD700" delayMs={240} durationMs={650} />
            </div>

            {/* Song Title in Royal Blue Bar */}
            <div className="mt-2.5 bg-[#002BCC] px-5 py-2 flex items-center gap-3">
              <span className="font-heavy text-[12px] font-bold text-[#8EDCFF] uppercase tracking-wider">
                CANCIÓN:
              </span>
              <span className="font-heavy text-[30px] font-black text-[#FFD700] uppercase tracking-wide truncate">
                «{song}»
              </span>
            </div>

            {/* RTVE Official Production Credits */}
            <div className="mt-3.5 pt-3 border-t border-[#002BCC]/60 flex items-center justify-between text-[#8EDCFF]">
              <div className="flex items-center gap-2">
                <span className="font-heavy text-[11px] font-black uppercase text-white/70">MÚSICA Y LETRA:</span>
                <span className="font-heavy text-[13px] font-bold text-white uppercase tracking-wide truncate max-w-[340px]">
                  {composers}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-heavy text-[11px] font-black uppercase text-white/70">PRODUCCIÓN:</span>
                <span className="font-heavy text-[13px] font-bold text-[#FFD700] uppercase tracking-wide truncate max-w-[280px]">
                  {arrangers}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, transition: { duration: 0.5, delay: 0.22 } }}
          className="w-full h-[5px] bg-[#E6007A]"
        />
      </motion.div>
    </div>
  );
};
