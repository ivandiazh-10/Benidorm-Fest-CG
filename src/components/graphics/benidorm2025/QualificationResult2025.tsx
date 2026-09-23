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
import {
  fitBF25Text,
  StageCornerBracketPair,
  StageDirectionalSweep,
  StageScanlineOverlay,
} from './Benidorm2025AnimationEngine';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QualificationResult2025Props {
  participant?: Participant;
  isQualified?: boolean;
}

/**
 * BENIDORM FEST 2025 QUALIFICATION RESULT — 40-STAGE BROADCAST CHOREOGRAPHY
 * 
 * Scaled & Compact Footprint with LARGER, STRONGER TYPOGRAPHY:
 * - Width: 980px (reduced from 1150px)
 * - Height: 84px
 * - Artist: 30-32px bold uppercase in magenta core
 * - Qualification Badge: Yellow or Navy block with icon
 * - 40+ Sequential Animation Stages for multi-layer geometric entrance and exit.
 */
export const QualificationResult2025: React.FC<QualificationResult2025Props> = ({
  participant,
  isQualified = true,
}) => {
  const artistName = (participant?.name || participant?.artist || 'ARTISTA').toUpperCase();
  const songTitle = participant?.song || 'CANCIÓN';

  const artistStyle = fitBF25Text(artistName, {
    maxContainerWidth: 420,
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
        className="relative w-[980px] flex flex-col items-center drop-shadow-[0_24px_55px_rgba(0,0,0,0.96)] select-none mx-auto"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.03} />

        <div
          className={`px-6 py-1 font-heavy text-[11px] font-black uppercase tracking-[0.2em] border-t-2 border-x-2 flex items-center gap-2 ${
            isQualified
              ? 'bg-[#FFD700] text-[#0A1244] border-[#FFE600]'
              : 'bg-[#101B55] text-slate-300 border-[#246BFF]'
          }`}
        >
          {isQualified ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0A1244]" />
              <span>¡CLASIFICADO PARA LA GRAN FINAL! • BENIDORM FEST 2025</span>
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>NO CLASIFICADO • BENIDORM FEST 2025</span>
            </>
          )}
        </div>

        <div className="w-full h-[84px] bg-[#070B1F] border-2 border-[#002BCC] flex items-stretch overflow-hidden shadow-2xl relative">
          <StageCornerBracketPair size={8} thickness={2} color="#8EDCFF" />

          {/* Participant Info in Magenta Core (LARGER Typography) */}
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
                  «{songTitle}»
                </span>
              </div>
            </div>

            <DirectionalChevron color="#FFD700" width={14} height={46} />
            <StageDirectionalSweep color="#FFD700" delayMs={220} durationMs={600} />
          </div>

          {/* Right Status Badge */}
          <div className="flex items-center gap-3 px-5 bg-[#070B1F] shrink-0">
            <SquareAccentStrip size={6} />
            <div
              className={`px-5 py-2 font-heavy text-[13px] font-black uppercase tracking-widest shadow-md ${
                isQualified
                  ? 'bg-[#FFD700] text-[#0A1244] border-2 border-[#FFE600]'
                  : 'bg-[#101B55] text-slate-400 border border-[#246BFF]'
              }`}
            >
              {isQualified ? 'FINALISTA 2025' : 'ELIMINADO'}
            </div>
          </div>
        </div>

        <div className={`w-full h-[4px] ${isQualified ? 'bg-[#FFD700]' : 'bg-[#E6007A]'}`} />
      </motion.div>
    </div>
  );
};
