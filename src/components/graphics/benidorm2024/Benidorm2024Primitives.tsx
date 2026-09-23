import React from 'react';

/**
 * BENIDORM FEST 2024 — BROADCAST PRIMITIVES, COLOR TOKENS, AND GEOMETRY
 * Authoritative coordinate system: 1920 x 1080 (16:9)
 */

export const BF24_COLORS = {
  electricBlue: '#2927F5',
  deepBlue: '#151A75',
  darkNavy: '#101044',
  chassisNavy: '#0A0E2A',
  purple: '#4A1678',
  violet: '#6824A5',
  magenta: '#D90069',
  hotPink: '#F00065',
  redPink: '#E4004F',
  cyan: '#23D9D2',
  lightBlue: '#4B9DFF',
  yellow: '#FFD900',
  white: '#FFFFFF',
  softWhite: '#F2F3FF',
};

// Safe Area Constants (EBU / SMPTE Broadcast Standard 90% Action Safe)
export const SAFE_LEFT = 96;
export const SAFE_RIGHT = 1824;
export const SAFE_TOP = 54;
export const SAFE_BOTTOM = 1006;

// Permanent exclusion zone for Bug in bottom-left corner
export const BUG_EXCLUSION_ZONE = {
  left: 96,
  bottom: 54,
  width: 140,
  height: 140,
};

/**
 * Benidorm Fest 2024 Circular Artist Emblem / Icon
 * Inspired by the official broadcast iconography in the 2024 scoreboard
 */
export const ArtistEmblem2024: React.FC<{
  artist: string;
  size?: number;
  className?: string;
}> = ({ artist, size = 38, className = '' }) => {
  const norm = (artist || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  let bg = 'linear-gradient(135deg, #2927F5, #6824A5)';
  let borderColor = '#FFFFFF';
  let iconSvg: React.ReactNode = null;

  if (norm.includes('maria pelae') || norm.includes('pelae')) {
    // Stylized flower / fan in cyan & magenta
    bg = 'linear-gradient(135deg, #00C9FF, #92FE9D)';
    borderColor = '#23D9D2';
    iconSvg = (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="none" stroke="#0A0E2A" strokeWidth="2.5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" fill="#D90069" stroke="none" />
      </svg>
    );
  } else if (norm.includes('st. pedro') || norm.includes('pedro')) {
    // Red / Yellow Heart with halo rays
    bg = 'linear-gradient(135deg, #FFD900, #FF5E36)';
    borderColor = '#FFD900';
    iconSvg = (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="#E4004F">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  } else if (norm.includes('angy')) {
    // Megaphone / Microphone in cyan
    bg = 'linear-gradient(135deg, #23D9D2, #2927F5)';
    borderColor = '#23D9D2';
    iconSvg = (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
        <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  } else if (norm.includes('jorge')) {
    // Fire / Flame in vibrant orange & yellow
    bg = 'linear-gradient(135deg, #FF0844, #FFB199)';
    borderColor = '#FFD900';
    iconSvg = (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="#FFD900">
        <path d="M12 2c-.5 2.5-3 5-3 8 0 3.3 2.7 6 6 6s6-2.7 6-6c0-3-2.5-5.5-3-8-.5 2-1 3.5-3 3.5s-2.5-1.5-3-3.5z" />
      </svg>
    );
  } else if (norm.includes('nebulossa')) {
    // Disco ball / globe in pink & cyan
    bg = 'linear-gradient(135deg, #D90069, #23D9D2)';
    borderColor = '#F00065';
    iconSvg = (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="none" stroke="#FFFFFF" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18M3 12h18" />
      </svg>
    );
  } else if (norm.includes('sofia') || norm.includes('coll')) {
    // Clam shell with pearl in magenta
    bg = 'linear-gradient(135deg, #F00065, #6824A5)';
    borderColor = '#FFFFFF';
    iconSvg = (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="none" stroke="#FFFFFF" strokeWidth="2">
        <path d="M12 21a9 9 0 0 1-9-9c0-5 4-9 9-9s9 4 9 9a9 9 0 0 1-9 9z" />
        <circle cx="12" cy="15" r="2.5" fill="#FFD900" stroke="none" />
      </svg>
    );
  } else if (norm.includes('miss caffeina') || norm.includes('caffeina')) {
    // Audio equalizer / pills in lime green & cyan
    bg = 'linear-gradient(135deg, #00FF87, #60EFFF)';
    borderColor = '#00FF87';
    iconSvg = (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="#0A0E2A">
        <rect x="5" y="6" width="3" height="12" rx="1.5" />
        <rect x="10.5" y="3" width="3" height="18" rx="1.5" />
        <rect x="16" y="8" width="3" height="8" rx="1.5" />
      </svg>
    );
  } else if (norm.includes('almacor')) {
    // 4-Point radiant star / sparkle in cyan
    bg = 'linear-gradient(135deg, #23D9D2, #4B9DFF)';
    borderColor = '#FFFFFF';
    iconSvg = (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="#FFFFFF">
        <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
      </svg>
    );
  } else if (norm.includes('lerica')) {
    // Astronaut / rocket
    bg = 'linear-gradient(135deg, #2927F5, #23D9D2)';
    borderColor = '#23D9D2';
    iconSvg = (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="none" stroke="#FFFFFF" strokeWidth="2">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      </svg>
    );
  } else if (norm.includes('noan')) {
    // Guitar / lightning
    bg = 'linear-gradient(135deg, #E4004F, #FFD900)';
    borderColor = '#FFD900';
    iconSvg = (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="#FFFFFF">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    );
  } else if (norm.includes('marlena')) {
    // Sun / summer rays
    bg = 'linear-gradient(135deg, #FF5E36, #FFD900)';
    borderColor = '#FFD900';
    iconSvg = (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
        <circle cx="12" cy="12" r="4" fill="#FFD900" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
      </svg>
    );
  } else {
    // Default musical note / star
    bg = 'linear-gradient(135deg, #2927F5, #D90069)';
    borderColor = '#FFFFFF';
    iconSvg = (
      <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="#FFFFFF">
        <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
      </svg>
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: bg,
        border: `2px solid ${borderColor}`,
      }}
      className={`rounded-full flex items-center justify-center shrink-0 shadow-md ${className}`}
    >
      {iconSvg}
    </div>
  );
};

/**
 * Concentric Circle Radar/Target Bug Graphic (Benidorm Fest 2024)
 * As seen in Screenshot 1 & 2:
 * Concentric multi-color circular radar mark with continuous, smooth color cycle:
 * Blue -> Cyan -> Purple -> Pink -> Magenta -> Yellow -> Blue.
 */
export const LiveBug2024: React.FC<{
  size?: number;
  className?: string;
  enableColorLoop?: boolean;
}> = ({ size = 68, className = '', enableColorLoop = true }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${SAFE_LEFT}px`,
        bottom: '74px',
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={`select-none pointer-events-none z-50 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 72 72"
        fill="none"
        className="w-full h-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)]"
      >
        <defs>
          <style>{`
            @keyframes bf24OuterLoop {
              0%   { stroke: #FFD900; }
              16.666% { stroke: #23D9D2; }
              33.333% { stroke: #2927F5; }
              50.000% { stroke: #6824A5; }
              66.666% { stroke: #D90069; }
              83.333% { stroke: #F00065; }
              100% { stroke: #FFD900; }
            }
            @keyframes bf24MiddleLoop {
              0%   { fill: #F00065; }
              16.666% { fill: #FFD900; }
              33.333% { fill: #23D9D2; }
              50.000% { fill: #2927F5; }
              66.666% { fill: #6824A5; }
              83.333% { fill: #D90069; }
              100% { fill: #F00065; }
            }
            @keyframes bf24InnerLoop {
              0%   { fill: #E4004F; }
              16.666% { fill: #F00065; }
              33.333% { fill: #FFD900; }
              50.000% { fill: #23D9D2; }
              66.666% { fill: #2927F5; }
              83.333% { fill: #6824A5; }
              100% { fill: #E4004F; }
            }
            .bf24-outer-loop {
              animation: bf24OuterLoop 9s linear infinite;
            }
            .bf24-middle-loop {
              animation: bf24MiddleLoop 9s linear infinite;
            }
            .bf24-inner-loop {
              animation: bf24InnerLoop 9s linear infinite;
            }
          `}</style>
        </defs>

        {/* Outer Ring */}
        <circle
          cx="36"
          cy="36"
          r="30"
          stroke="#FFD900"
          strokeWidth="7"
          fill="none"
          className={enableColorLoop ? 'bf24-outer-loop' : ''}
        />

        {/* Middle Ring Disc */}
        <circle
          cx="36"
          cy="36"
          r="23"
          fill="#F00065"
          className={enableColorLoop ? 'bf24-middle-loop' : ''}
        />

        {/* Inner Ring Disc */}
        <circle
          cx="36"
          cy="36"
          r="15"
          fill="#E4004F"
          className={enableColorLoop ? 'bf24-inner-loop' : ''}
        />

        {/* Center Dark Core */}
        <circle
          cx="36"
          cy="36"
          r="8"
          fill="#0A0E2A"
        />
      </svg>
    </div>
  );
};
