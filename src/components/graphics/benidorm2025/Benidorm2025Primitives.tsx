import React from 'react';

/**
 * BENIDORM FEST 2025 BROADCAST DESIGN SYSTEM PRIMITIVES
 * Inspired by the official RTVE television broadcast art direction:
 * - Electric Blue (#002BCC / #0038FF / #101B55)
 * - Rich Magenta / Hot Pink (#E6007A / #F21878)
 * - Bright Contrast Yellow (#FFD700 / #FFD900)
 * - Crisp White (#FFFFFF)
 * - Deep Navy / Contrast Base (#050B2E / #070B1F)
 * - Light Cyan / Accent Blue (#8EDCFF)
 */

export const BF25_COLORS = {
  magenta: '#E6007A',
  pink: '#F21878',
  electricBlue: '#0038FF',
  royalBlue: '#002BCC',
  darkNavy: '#101B55',
  deepBase: '#070B1F',
  yellow: '#FFD700',
  brightYellow: '#FFD900',
  lightBlue: '#8EDCFF',
  white: '#FFFFFF',
} as const;

export const EASE_SQUARE = [0.16, 1, 0.3, 1] as const;
export const EASE_SQUARE_EXIT = [0.4, 0, 1, 1] as const;

/**
 * Shared Anchor System for Benidorm Fest 2025 Bug & Performance Identifier
 * Both graphics strictly share the exact same left-side safe area origin.
 */
export const BUG_ORIGIN = {
  left: 96,
  bottom: 54,
  width: 120,
  height: 120,
} as const;

export const PERFORMANCE_IDENTIFIER_ORIGIN = {
  left: 96,
  bottom: 54,
} as const;

/**
 * System-Level Bug Exclusion Zone for Benidorm Fest 2025
 * Fixed in bottom-left safe area: coordinates (left: 96px, bottom: 54px).
 * No lower thirds, scoreboards, or other graphic elements may overlap this coordinate boundary.
 */
export const BUG_EXCLUSION_ZONE = {
  left: 96,
  bottom: 54,
  width: 340,
  height: 280,
  description: 'Permanent bottom-left area reserved for the Live Bug and Vertical Performance Identifier.',
} as const;

export const BUG_EXCLUSION_ZONE_2025 = BUG_EXCLUSION_ZONE;

/**
 * Official Participant Thematic Icons for Benidorm Fest 2025 Finalists
 * As shown in the live broadcast scoreboard on RTVE (Lachispa eye, Lucas Bun moon, Mawot sun, etc.)
 */
export const BF25ArtistIcon: React.FC<{
  artistName?: string;
  size?: number;
  className?: string;
}> = ({ artistName = '', size = 28, className = '' }) => {
  const norm = artistName.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (norm.includes('lachispa')) {
    // Eye with concentric diamond & cyan/yellow iris
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
        <rect width="28" height="28" rx="4" fill="#002BCC" />
        <path d="M4 14C8 8 20 8 24 14C20 20 8 20 4 14Z" fill="#8EDCFF" />
        <circle cx="14" cy="14" r="5" fill="#FFD700" />
        <circle cx="14" cy="14" r="2.5" fill="#070B1F" />
      </svg>
    );
  }

  if (norm.includes('lucasbun')) {
    // Crescent Moon with Star in navy square
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
        <rect width="28" height="28" rx="4" fill="#0A1033" />
        <path
          d="M17 6A8 8 0 1 0 21 18A9 9 0 0 1 17 6Z"
          fill="#FFD700"
        />
        <polygon points="19,8 20.5,12 24.5,12 21,14.5 22.5,18.5 19,16 15.5,18.5 17,14.5 13.5,12 17.5,12" fill="#8EDCFF" transform="scale(0.5) translate(14, 4)" />
      </svg>
    );
  }

  if (norm.includes('mawot')) {
    // Rising sun over geometric horizon lines
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
        <rect width="28" height="28" rx="4" fill="#002BCC" />
        <circle cx="14" cy="13" r="7" fill="#FFD700" />
        <rect x="5" y="15" width="18" height="2" fill="#E6007A" />
        <rect x="4" y="19" width="20" height="2" fill="#8EDCFF" />
        <rect x="7" y="23" width="14" height="2" fill="#FFD700" />
      </svg>
    );
  }

  if (norm.includes('daniela') || norm.includes('blasco')) {
    // Swirling pinwheel / starburst badge
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
        <rect width="28" height="28" rx="4" fill="#0A1033" />
        <circle cx="14" cy="14" r="10" stroke="#8EDCFF" strokeWidth="2" fill="#E6007A" />
        <line x1="6" y1="6" x2="22" y2="22" stroke="#FFD700" strokeWidth="2.5" />
        <line x1="22" y1="6" x2="6" y2="22" stroke="#FFD700" strokeWidth="2.5" />
        <circle cx="14" cy="14" r="3" fill="#FFFFFF" />
      </svg>
    );
  }

  if (norm.includes('kuve')) {
    // Crown / Arch symbol
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
        <rect width="28" height="28" rx="4" fill="#002BCC" />
        <path d="M6 19L8 10L14 15L20 10L22 19H6Z" fill="#FFD700" />
        <circle cx="8" cy="8" r="1.5" fill="#8EDCFF" />
        <circle cx="14" cy="13" r="1.5" fill="#E6007A" />
        <circle cx="20" cy="8" r="1.5" fill="#8EDCFF" />
        <rect x="6" y="20" width="16" height="2" fill="#FFFFFF" />
      </svg>
    );
  }

  if (norm.includes('melomana') || norm.includes('omana')) {
    // Megaphone / Torch beacon
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
        <rect width="28" height="28" rx="4" fill="#0A1033" />
        <circle cx="14" cy="14" r="10" fill="#E6007A" />
        <path d="M8 8L20 20M9 20L19 10" stroke="#FFD700" strokeWidth="3" />
        <circle cx="14" cy="14" r="4" fill="#8EDCFF" />
      </svg>
    );
  }

  if (norm.includes('jkbello') || norm.includes('bello')) {
    // Tuxedo & Bowtie icon
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
        <rect width="28" height="28" rx="4" fill="#070B1F" />
        <polygon points="5,5 14,23 5,23" fill="#FFFFFF" />
        <polygon points="23,5 14,23 23,23" fill="#FFFFFF" />
        <polygon points="10,10 14,12 10,14" fill="#E6007A" />
        <polygon points="18,10 14,12 18,14" fill="#E6007A" />
        <circle cx="14" cy="12" r="1.5" fill="#FFD700" />
      </svg>
    );
  }

  if (norm.includes('melody')) {
    // 8-Point Golden Starburst
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
        <rect width="28" height="28" rx="4" fill="#002BCC" />
        <polygon points="14,4 16.5,10.5 23,10.5 18,15 20,21.5 14,17.5 8,21.5 10,15 5,10.5 11.5,10.5" fill="#FFD700" />
        <circle cx="14" cy="14" r="2.5" fill="#E6007A" />
      </svg>
    );
  }

  // Generic broadcast geometric chevron
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      <rect width="28" height="28" rx="4" fill="#0A1033" />
      <polygon points="7,6 18,14 7,22" fill="#FFD700" />
      <polygon points="14,6 23,14 14,22" fill="#E6007A" />
    </svg>
  );
};

/**
 * Right Directional Chevron / Arrow
 * Pointing from artist magenta bar directly to the score block
 */
export const DirectionalChevron: React.FC<{
  color?: string;
  width?: number;
  height?: number;
}> = ({ color = '#FFD700', width = 16, height = 48 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 48"
      fill="none"
      className="shrink-0"
      preserveAspectRatio="none"
    >
      <polygon points="0,0 16,24 0,48" fill={color} />
    </svg>
  );
};

/**
 * Large Triangular Frame Marker
 * As seen in the reference image separating the scoreboard and video feed
 */
export const LargeChevronMarker: React.FC<{
  size?: number;
  color?: string;
  direction?: 'left' | 'right';
  className?: string;
}> = ({ size = 36, color = '#E6007A', direction = 'left', className = '' }) => {
  const points = direction === 'left' ? '36,0 0,18 36,36' : '0,0 36,18 0,36';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={`shrink-0 drop-shadow-[0_4px_12px_rgba(230,0,122,0.6)] ${className}`}
    >
      <polygon points={points} fill={color} />
    </svg>
  );
};

/**
 * Magenta "L" Corner Bracket
 * As seen in the bottom-right corner of the video frame in the reference image
 */
export const CornerLBracket: React.FC<{
  size?: number;
  thickness?: number;
  color?: string;
  className?: string;
}> = ({ size = 34, thickness = 10, color = '#E6007A', className = '' }) => {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative pointer-events-none drop-shadow-[0_4px_12px_rgba(230,0,122,0.8)] ${className}`}
    >
      {/* Horizontal base */}
      <div
        style={{
          bottom: 0,
          left: 0,
          width: `${size}px`,
          height: `${thickness}px`,
          backgroundColor: color,
        }}
        className="absolute"
      />
      {/* Vertical upright */}
      <div
        style={{
          bottom: 0,
          left: 0,
          width: `${thickness}px`,
          height: `${size}px`,
          backgroundColor: color,
        }}
        className="absolute"
      />
    </div>
  );
};

/**
 * Concentric Circle Bug Graphic
 * The iconic multi-color concentric circular mark in the bottom-left of the 2025 broadcast
 * Now featuring a continuous, seamless, broadcast-grade color loop cycling through:
 * Blue -> Cyan/light blue -> Lilac -> Pink -> Magenta -> Yellow -> Blue.
 */
export const ConcentricCircleGraphic: React.FC<{
  size?: number;
  className?: string;
  enableColorLoop?: boolean;
}> = ({ size = 72, className = '', enableColorLoop = true }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      className={`shrink-0 drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] ${className}`}
    >
      <defs>
        <style>{`
          @keyframes bf25OuterCircleLoop {
            0%   { stroke: #246BFF; }
            16.666% { stroke: #00E5FF; }
            33.333% { stroke: #9D4EDD; }
            50.000% { stroke: #FF4081; }
            66.666% { stroke: #FF007A; }
            83.333% { stroke: #FFD700; }
            100% { stroke: #246BFF; }
          }
          @keyframes bf25LeftArcLoop {
            0%   { fill: #00BFFF; }
            16.666% { fill: #8EDCFF; }
            33.333% { fill: #B588F7; }
            50.000% { fill: #FF69B4; }
            66.666% { fill: #E6007A; }
            83.333% { fill: #FFD700; }
            100% { fill: #00BFFF; }
          }
          @keyframes bf25RightArcLoop {
            0%   { fill: #FFD700; }
            16.666% { fill: #246BFF; }
            33.333% { fill: #00E5FF; }
            50.000% { fill: #9D4EDD; }
            66.666% { fill: #FF4081; }
            83.333% { fill: #FF007A; }
            100% { fill: #FFD700; }
          }
          @keyframes bf25InnerRingLoop {
            0%   { fill: #E6007A; }
            16.666% { fill: #FFD700; }
            33.333% { fill: #246BFF; }
            50.000% { fill: #00E5FF; }
            66.666% { fill: #9D4EDD; }
            83.333% { fill: #FF4081; }
            100% { fill: #E6007A; }
          }
          .bf25-outer-circle-loop {
            animation: bf25OuterCircleLoop 9s linear infinite;
          }
          .bf25-left-arc-loop {
            animation: bf25LeftArcLoop 9s linear infinite;
          }
          .bf25-right-arc-loop {
            animation: bf25RightArcLoop 9s linear infinite;
          }
          .bf25-inner-ring-loop {
            animation: bf25InnerRingLoop 9s linear infinite;
          }
        `}</style>
      </defs>
      {/* Outer Cyan/Blue Arc */}
      <circle
        cx="36"
        cy="36"
        r="32"
        stroke="#246BFF"
        strokeWidth="8"
        fill="none"
        className={enableColorLoop ? 'bf25-outer-circle-loop' : ''}
      />
      {/* Left Cyan Half Arc */}
      <path
        d="M36 4 A32 32 0 0 0 36 68"
        fill="#00BFFF"
        className={enableColorLoop ? 'bf25-left-arc-loop' : ''}
      />
      {/* Right Yellow Half Arc */}
      <path
        d="M36 4 A32 32 0 0 1 36 68"
        fill="#FFD700"
        className={enableColorLoop ? 'bf25-right-arc-loop' : ''}
      />
      {/* Inner Pink/Magenta Ring */}
      <circle
        cx="36"
        cy="36"
        r="18"
        fill="#E6007A"
        className={enableColorLoop ? 'bf25-inner-ring-loop' : ''}
      />
      {/* Center Dark Blue Core */}
      <circle cx="36" cy="36" r="8" fill="#070B1F" />
    </svg>
  );
};

/**
 * 3-Color Square Accent Strip
 */
export const SquareAccentStrip: React.FC<{ size?: number; className?: string }> = ({
  size = 6,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1 shrink-0 ${className}`}>
      <span className="block bg-[#E6007A]" style={{ width: size, height: size }} />
      <span className="block bg-[#0038FF]" style={{ width: size, height: size }} />
      <span className="block bg-[#FFD700]" style={{ width: size, height: size }} />
    </div>
  );
};
