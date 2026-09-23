import React from 'react';
import { Benidorm2024Background } from './benidorm2024/Benidorm2024Background';

interface BackgroundStageProps {
  stageTitle?: string;
  intensity?: 'normal' | 'vibrant' | 'dim';
  is2025?: boolean;
  is2024?: boolean;
}

export const BackgroundStage: React.FC<BackgroundStageProps> = ({
  stageTitle = 'Gran Final',
  intensity = 'normal',
  is2025 = false,
  is2024 = false,
}) => {
  if (is2024) {
    return <Benidorm2024Background variant="main" />;
  }

  if (is2025) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-[#070B1F]">
        {/* Benidorm Fest 2025 deep navy / blue background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#101B55] via-[#070B1F] to-[#040612]" />

        {/* Pink Stage Spotlight Glow */}
        <div className="absolute -right-20 top-1/4 w-[650px] h-[650px] bg-gradient-to-l from-[#F21878]/25 via-pink-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Blue Stage Backlight Glow */}
        <div className="absolute -left-20 -bottom-20 w-[600px] h-[600px] bg-gradient-to-tr from-[#246BFF]/25 via-indigo-700/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Geometric square modular grid backdrop pattern for 2025 */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="squareGrid2025" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="80" height="80" fill="none" stroke="#246BFF" strokeWidth="1" strokeOpacity="0.4" />
              <rect x="36" y="36" width="8" height="8" fill="#F21878" fillOpacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#squareGrid2025)" />
        </svg>

        {/* Stage light beams */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[1200px] bg-gradient-to-b from-[#8EDCFF]/15 via-blue-500/5 to-transparent -rotate-12 blur-2xl pointer-events-none animate-stage-pulse" />
        <div className="absolute -top-32 right-1/3 w-[450px] h-[1200px] bg-gradient-to-b from-[#F21878]/15 via-pink-500/5 to-transparent rotate-12 blur-2xl pointer-events-none animate-stage-pulse" />

        {/* Bottom studio floor reflection */}
        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black/80 via-black/40 to-transparent border-t border-[#246BFF]/20" />

        {/* Subtle stage perimeter vignette */}
        <div className="absolute inset-0 ring-1 ring-inset ring-[#246BFF]/20 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-[#150a2b]">
      {/* Deep broadcast television gradient: royal purple / navy */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#260f4d] via-[#160a30] to-[#0a0418]" />

      {/* Right-side warm amber stage glow (matching the pulpit lighting in TV reference) */}
      <div className="absolute -right-20 top-1/4 w-[650px] h-[650px] bg-gradient-to-l from-amber-600/30 via-orange-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Left-side cyan/blue stadium backlight */}
      <div className="absolute -left-20 -bottom-20 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Repeating Benidorm Fest geometric chevron / arrow backdrop pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="chevronPattern" width="160" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M 10 90 L 80 20 L 150 90 L 130 90 L 80 40 L 30 90 Z"
              fill="#a855f7"
              fillOpacity="0.35"
            />
            <path
              d="M 10 110 L 80 40 L 150 110 L 130 110 L 80 60 L 30 110 Z"
              fill="#06b6d4"
              fillOpacity="0.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#chevronPattern)" />
      </svg>

      {/* TV stage light beams */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[1200px] bg-gradient-to-b from-white/10 via-purple-400/5 to-transparent -rotate-12 blur-2xl pointer-events-none animate-stage-pulse" />
      <div className="absolute -top-32 right-1/3 w-[450px] h-[1200px] bg-gradient-to-b from-cyan-300/10 via-purple-500/5 to-transparent rotate-12 blur-2xl pointer-events-none animate-stage-pulse" />

      {/* Bottom studio floor reflection */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black/80 via-black/40 to-transparent border-t border-purple-500/10" />

      {/* Subtle stage perimeter vignette */}
      <div className="absolute inset-0 ring-1 ring-inset ring-purple-500/20 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.8)]" />
    </div>
  );
};
