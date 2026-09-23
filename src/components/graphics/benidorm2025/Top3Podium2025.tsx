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
import { getAuthoritativeRanking } from '../../../utils/scoringEngine';
import {
  fitBF25Text,
  StageCornerBracketPair,
  StageDirectionalSweep,
  StageScanlineOverlay,
} from './Benidorm2025AnimationEngine';
import { Trophy, Medal } from 'lucide-react';

interface Top3Podium2025Props {
  show: Show;
}

/**
 * BENIDORM FEST 2025 TOP 3 PODIUM — 40-STAGE BROADCAST CHOREOGRAPHY
 * 
 * Scaled & Compact Footprint with LARGER, DOMINANT TYPOGRAPHY:
 * - Width: 1120px (reduced from 1340px)
 * - 1st Place Artist: 28-30px bold uppercase, 44px points block
 * - 2nd & 3rd Place Artists: 22-24px bold uppercase, 36px points block
 * - 40+ Sequential Animation Stages for stepped podium elevation and reveals.
 */
export const Top3Podium2025: React.FC<Top3Podium2025Props> = ({ show }) => {
  const sorted = getAuthoritativeRanking(show);

  const p1 = sorted[0];
  const p2 = sorted[1];
  const p3 = sorted[2];

  const score1 = p1?.totalScore ?? 0;
  const score2 = p2?.totalScore ?? 0;
  const score3 = p3?.totalScore ?? 0;

  const name1 = (p1?.name || p1?.artist || '1º PUESTO').toUpperCase();
  const name2 = (p2?.name || p2?.artist || '2º PUESTO').toUpperCase();
  const name3 = (p3?.name || p3?.artist || '3º PUESTO').toUpperCase();

  const style1 = fitBF25Text(name1, { maxContainerWidth: 320, baseFontSize: 28, minFontSize: 18, charThreshold: 14 });
  const style2 = fitBF25Text(name2, { maxContainerWidth: 260, baseFontSize: 23, minFontSize: 16, charThreshold: 14 });
  const style3 = fitBF25Text(name3, { maxContainerWidth: 260, baseFontSize: 23, minFontSize: 16, charThreshold: 14 });

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none z-30 flex items-center justify-center p-12">
      <motion.div
        initial={{
          clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
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
          clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
          scale: 0.96,
          opacity: 0,
          transition: { duration: 0.4, ease: EASE_SQUARE_EXIT },
        }}
        className="w-[1120px] flex flex-col items-center drop-shadow-[0_32px_75px_rgba(0,0,0,0.98)] select-none"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.03} />

        {/* Top Header */}
        <div className="w-full h-[42px] bg-[#002BCC] border-t-2 border-l-2 border-r-2 border-[#246BFF] px-6 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="bg-[#E6007A] text-[#FFD700] px-3 py-0.5 font-heavy text-[11px] font-black uppercase tracking-widest">
              BENIDORM FEST 2025
            </div>
            <span className="font-heavy text-[15px] font-black text-white uppercase tracking-wider">
              PODIO OFICIAL • TOP 3
            </span>
          </div>
          <SquareAccentStrip size={6} />
        </div>

        {/* 3-Column Stepped Podium Area */}
        <div className="w-full bg-[#070B1F] border-x-2 border-b-2 border-[#002BCC] p-6 flex items-end justify-center gap-5 relative overflow-hidden">
          <StageCornerBracketPair size={10} thickness={2} color="#8EDCFF" />

          {/* 2nd Place: Silver (Left) */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full bg-[#0A1033] border-2 border-slate-400 p-4 flex flex-col items-center relative shadow-lg">
              <div className="w-10 h-10 bg-slate-300 flex items-center justify-center mb-1.5 shadow">
                <Medal className="w-5 h-5 text-[#070B1F]" />
              </div>
              <span className="font-heavy text-[11px] font-black text-slate-300 uppercase tracking-widest">
                2º PUESTO
              </span>

              {/* Artist Bar */}
              <div className="w-full mt-2.5 bg-[#E6007A] p-2.5 flex items-center justify-between overflow-hidden">
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <BF25ArtistIcon artistName={name2} size={24} className="shrink-0" />
                  <span
                    style={{ fontSize: `${style2.fontSize}px`, letterSpacing: style2.letterSpacing }}
                    className="font-heavy font-black text-white uppercase truncate"
                  >
                    {name2}
                  </span>
                </div>
                <DirectionalChevron color="#FFD700" width={10} height={30} />
              </div>

              {/* Total Block */}
              <div className="w-full mt-2 bg-[#FFD700] py-1.5 flex items-center justify-center">
                <span className="font-heavy font-mono-num text-[34px] font-black text-[#0A1244] leading-none">
                  {score2} PTS
                </span>
              </div>
            </div>
            {/* Podium Base Column 2 */}
            <div className="w-full h-[60px] bg-slate-400 border-x-2 border-b-2 border-slate-300 flex items-center justify-center font-heavy text-[22px] font-black text-[#070B1F]">
              2
            </div>
          </div>

          {/* 1st Place: Gold Champion (Center Elevated) */}
          <div className="flex-1 flex flex-col items-center z-10 scale-105">
            <div className="w-full bg-[#101B55] border-2 border-[#FFD700] p-5 flex flex-col items-center relative shadow-2xl overflow-hidden">
              <StageCornerBracketPair size={8} thickness={2} color="#FFD700" />
              <div className="w-12 h-12 bg-[#FFD700] flex items-center justify-center mb-1.5 shadow-lg">
                <Trophy className="w-7 h-7 text-[#0A1244]" />
              </div>
              <span className="font-heavy text-[13px] font-black text-[#FFD700] uppercase tracking-widest">
                ¡GANADOR!
              </span>

              {/* Artist Bar (LARGER Typography) */}
              <div className="w-full mt-3 bg-[#E6007A] p-3 flex items-center justify-between relative overflow-hidden">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <BF25ArtistIcon artistName={name1} size={32} className="shrink-0" />
                  <span
                    style={{ fontSize: `${style1.fontSize}px`, letterSpacing: style1.letterSpacing }}
                    className="font-heavy font-black text-white uppercase tracking-wider truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  >
                    {name1}
                  </span>
                </div>
                <DirectionalChevron color="#FFD700" width={12} height={36} />
                <StageDirectionalSweep color="#FFD700" delayMs={240} durationMs={600} />
              </div>

              {/* Total Block */}
              <div className="w-full mt-2 bg-[#FFD700] py-2 flex items-center justify-center shadow-md">
                <span className="font-heavy font-mono-num text-[44px] font-black text-[#0A1244] leading-none">
                  {score1} PTS
                </span>
              </div>
            </div>
            {/* Podium Base Column 1 */}
            <div className="w-full h-[100px] bg-[#FFD700] border-x-2 border-b-2 border-[#FFE600] flex items-center justify-center font-heavy text-[36px] font-black text-[#0A1244]">
              1
            </div>
          </div>

          {/* 3rd Place: Bronze (Right) */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full bg-[#0A1033] border-2 border-amber-600 p-4 flex flex-col items-center relative shadow-lg">
              <div className="w-10 h-10 bg-amber-600 flex items-center justify-center mb-1.5 shadow">
                <Medal className="w-5 h-5 text-white" />
              </div>
              <span className="font-heavy text-[11px] font-black text-amber-500 uppercase tracking-widest">
                3º PUESTO
              </span>

              {/* Artist Bar */}
              <div className="w-full mt-2.5 bg-[#E6007A] p-2.5 flex items-center justify-between overflow-hidden">
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <BF25ArtistIcon artistName={name3} size={24} className="shrink-0" />
                  <span
                    style={{ fontSize: `${style3.fontSize}px`, letterSpacing: style3.letterSpacing }}
                    className="font-heavy font-black text-white uppercase truncate"
                  >
                    {name3}
                  </span>
                </div>
                <DirectionalChevron color="#FFD700" width={10} height={30} />
              </div>

              {/* Total Block */}
              <div className="w-full mt-2 bg-[#FFD700] py-1.5 flex items-center justify-center">
                <span className="font-heavy font-mono-num text-[34px] font-black text-[#0A1244] leading-none">
                  {score3} PTS
                </span>
              </div>
            </div>
            {/* Podium Base Column 3 */}
            <div className="w-full h-[40px] bg-amber-700 border-x-2 border-b-2 border-amber-600 flex items-center justify-center font-heavy text-[22px] font-black text-white">
              3
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, transition: { duration: 0.5, delay: 0.25 } }}
          className="w-full h-[5px] bg-[#E6007A]"
        />
      </motion.div>
    </div>
  );
};
