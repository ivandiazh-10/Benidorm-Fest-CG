import React from 'react';

export type BF24BackgroundVariant =
  | 'main'
  | 'scoreboard'
  | 'voting'
  | 'classification'
  | 'stage_ready'
  | 'neutral';

interface Benidorm2024BackgroundProps {
  variant?: BF24BackgroundVariant;
  opacity?: number;
  className?: string;
  showParticles?: boolean;
}

/**
 * Reusable Benidorm Fest 2024 Full-Screen Broadcast Background
 * Inspired directly by Screenshot 1 & 2:
 * Deep electric blue and purple background, large sweeping curved magenta/pink shapes,
 * blue geometric bands, and subtle micro-particle/starlight atmosphere.
 */
export const Benidorm2024Background: React.FC<Benidorm2024BackgroundProps> = ({
  variant = 'main',
  opacity = 1,
  className = '',
  showParticles = true,
}) => {
  return (
    <div
      style={{ opacity }}
      className={`absolute inset-0 w-[1920px] h-[1080px] overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* Layer 1: Base Dark Blue / Purple Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#101044] via-[#151A75] to-[#4A1678]" />

      {/* Layer 2: Radial Depth Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(41,39,245,0.45)_0%,rgba(16,16,68,0)_75%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,rgba(217,0,105,0.35)_0%,rgba(74,22,120,0)_60%)]" />

      {/* Layer 3: Large Sweeping Curved Geometry (Right / Bottom Arcs) */}
      <svg
        viewBox="0 0 1920 1080"
        className="absolute inset-0 w-full h-full preserve-3d"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="bf24MagentaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D90069" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E4004F" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="bf24PinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F00065" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#6824A5" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="bf24BlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2927F5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#101044" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="bf24CyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#23D9D2" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2927F5" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Deep Magenta Sweeping Curve */}
        <path
          d="M 1200 1080 C 1350 850 1520 620 1780 400 L 1920 400 L 1920 1080 Z"
          fill="url(#bf24MagentaGrad)"
        />

        {/* Middle Pink Accent Curve */}
        <path
          d="M 1050 1080 C 1220 920 1420 780 1720 540 L 1820 620 C 1520 860 1320 980 1150 1080 Z"
          fill="url(#bf24PinkGrad)"
        />

        {/* Lower Right Deep Electric Blue Curve */}
        <path
          d="M 1480 1080 C 1600 950 1740 820 1920 720 L 1920 1080 Z"
          fill="url(#bf24BlueGrad)"
        />

        {/* Bottom Corner Accent Arc */}
        <path
          d="M 980 1080 C 1200 1000 1450 1020 1680 1080 Z"
          fill="#D90069"
          opacity="0.6"
        />

        {/* Top-Right Ambient Glow Band */}
        <path
          d="M 1720 0 C 1720 220 1820 340 1920 380 L 1920 0 Z"
          fill="#6824A5"
          opacity="0.5"
        />

        {/* Left Subdued Ambient Arc */}
        {variant !== 'scoreboard' && (
          <path
            d="M 0 350 C 240 500 320 780 120 1080 L 0 1080 Z"
            fill="url(#bf24CyanGrad)"
          />
        )}
      </svg>

      {/* Layer 4: Subtle Dust / Particle Starlight Texture */}
      {showParticles && (
        <div
          className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #FFFFFF 1px, transparent 1px), radial-gradient(circle, #23D9D2 1px, transparent 1px)`,
            backgroundSize: '160px 160px, 240px 240px',
            backgroundPosition: '0 0, 80px 120px',
          }}
        />
      )}

      {/* Layer 5: Film Grain & TV Scanline Polish */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 3px)',
        }}
      />
    </div>
  );
};
