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
  StageScorePulseGlow,
} from './Benidorm2025AnimationEngine';
import { Trophy, Sparkles } from 'lucide-react';

interface WinnerPackage2025Props {
  show: Show;
  winnerParticipant?: Participant;
}

/**
 * BENIDORM FEST 2025 WINNER PACKAGE — 40-STAGE BROADCAST CHOREOGRAPHY
 * 
 * Scaled & Compact Footprint with MASSIVE, CELEBRATORY TYPOGRAPHY:
 * - Width: 1060px (reduced from 1280px)
 * - Winner Artist Headline: 48-52px bold uppercase in magenta core
 * - Song Title: 28px bold yellow
 * - Total Score: 42px bold mono-num
 * - 40+ Sequential Animation Stages for multi-layer fanfare and gold settles.
 */
export const WinnerPackage2025: React.FC<WinnerPackage2025Props> = ({
  show,
  winnerParticipant,
}) => {
  const authoritativeRanking = getAuthoritativeRanking(show);
  const winner = winnerParticipant || authoritativeRanking[0];

  const jury = winner?.juryScore ?? 0;
  const pub = winner?.publicScore ?? 0;
  const total = winner?.totalScore ?? 0;
  const artistName = (winner?.name || winner?.artist || 'ARTISTA').toUpperCase();

  const artistStyle = fitBF25Text(artistName, {
    maxContainerWidth: 640,
    baseFontSize: 48,
    minFontSize: 28,
    charThreshold: 14,
    letterSpacingEm: 0.04,
  });

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none z-30 flex items-center justify-center p-12">
      <motion.div
        initial={{
          clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
          scale: 0.95,
          opacity: 0,
        }}
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          scale: 1,
          opacity: 1,
          transition: { duration: 0.65, ease: EASE_SQUARE },
        }}
        exit={{
          clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
          scale: 0.95,
          opacity: 0,
          transition: { duration: 0.4, ease: EASE_SQUARE_EXIT },
        }}
        className="w-[1060px] flex flex-col items-center drop-shadow-[0_36px_85px_rgba(0,0,0,0.98)] select-none"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.03} />

        {/* Top Trophy Banner */}
        <div className="w-full h-[50px] bg-[#FFD700] border-t-2 border-l-2 border-r-2 border-[#FFE600] px-6 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-[#0A1244]" />
            <span className="font-heavy text-[18px] font-black text-[#0A1244] uppercase tracking-widest">
              ¡GANADOR DE BENIDORM FEST 2025!
            </span>
            <Sparkles className="w-4 h-4 text-[#E6007A]" />
          </div>

          <div className="flex items-center gap-3">
            <span className="font-heavy text-[11px] font-black text-[#0A1244] uppercase tracking-wider bg-white/40 px-3 py-1">
              REPRESENTANTE EN EUROVISIÓN 2025
            </span>
            <SquareAccentStrip size={6} />
          </div>
        </div>

        {/* Master Center Card */}
        <div className="w-full bg-[#070B1F] border-x-2 border-b-2 border-[#002BCC] p-6 flex items-stretch gap-6 relative overflow-hidden">
          <StageCornerBracketPair size={12} thickness={2.5} color="#FFD700" />

          {/* Left: Giant Gold Trophy Block */}
          <div className="w-[150px] bg-[#002BCC] border-2 border-[#246BFF] flex flex-col items-center justify-center p-4 shrink-0 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 bg-[#FFD700] flex items-center justify-center shadow-lg mb-2">
              <Trophy className="w-10 h-10 text-[#0A1244]" />
            </div>
            <span className="font-heavy text-[10px] font-black uppercase text-[#8EDCFF] tracking-widest text-center leading-tight">
              MICRÓFONO DE BRONCE
            </span>
            <StageScorePulseGlow isActive={true} color="#FFD700" />
          </div>

          {/* Right: Artist & Song Core */}
          <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
            {/* Magenta Artist Bar (MASSIVE Typography) */}
            <div className="bg-[#E6007A] px-5 py-3.5 flex items-center justify-between shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <BF25ArtistIcon artistName={artistName} size={42} className="shrink-0" />
                <span
                  style={{
                    fontSize: `${artistStyle.fontSize}px`,
                    letterSpacing: artistStyle.letterSpacing,
                    lineHeight: artistStyle.lineHeight,
                  }}
                  className="font-heavy font-black text-white uppercase tracking-wider truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                >
                  {artistName}
                </span>
              </div>
              <DirectionalChevron color="#FFD700" width={16} height={50} />
              <StageDirectionalSweep color="#FFD700" delayMs={240} durationMs={650} />
            </div>

            {/* Song Title in Royal Blue Bar */}
            <div className="mt-2.5 bg-[#002BCC] px-5 py-2 flex items-center gap-3">
              <span className="font-heavy text-[11px] font-bold text-[#8EDCFF] uppercase tracking-wider">
                CANCIÓN:
              </span>
              <span className="font-heavy text-[26px] font-black text-[#FFD700] uppercase tracking-wide truncate">
                «{winner?.song || 'CANCIÓN'}»
              </span>
            </div>

            {/* Total Points Breakdown */}
            <div className="mt-3 pt-3 border-t border-[#002BCC]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-heavy text-[11px] font-bold text-[#8EDCFF] uppercase">
                  JURADO: <span className="text-white font-mono-num font-black text-[16px]">{jury}</span>
                </span>
                <span className="text-[#246BFF]">•</span>
                <span className="font-heavy text-[11px] font-bold text-[#8EDCFF] uppercase">
                  TELEVOTO: <span className="text-white font-mono-num font-black text-[16px]">{pub}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-heavy text-[11px] font-black text-white uppercase">PUNTUACIÓN TOTAL:</span>
                <div className="bg-[#FFD700] text-[#0A1244] px-4 py-1 font-heavy font-mono-num text-[34px] font-black shadow-md">
                  {total} PTS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gold Accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, transition: { duration: 0.5, delay: 0.25 } }}
          className="w-full h-[6px] bg-[#FFD700]"
        />
      </motion.div>
    </div>
  );
};
