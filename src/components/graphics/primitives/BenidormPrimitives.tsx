import React from 'react';
import { motion, Variants } from 'motion/react';

/**
 * BROADCAST MOTION DESIGN SYSTEM - BENIDORM FEST
 * Exact mathematical and optical curves, timing tokens, and geometric primitives
 */

export const EASE_BROADCAST: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_BROADCAST_FAST: [number, number, number, number] = [0.12, 1, 0.24, 1];
export const EASE_BROADCAST_SLOW: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_BROADCAST_EXIT: [number, number, number, number] = [0.4, 0, 0.2, 1];
export const EASE_BROADCAST_SETTLE: [number, number, number, number] = [0.25, 1, 0.5, 1];
export const EASE_BROADCAST_LINEAR_IN: [number, number, number, number] = [0.3, 0, 0.8, 0.15];
export const EASE_BROADCAST_RANKING: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_BROADCAST_TEXT: [number, number, number, number] = [0.2, 0.95, 0.3, 1];
export const EASE_BROADCAST_ACCENT: [number, number, number, number] = [0.4, 0, 0.2, 1];

// Legacy shorthand aliases
export const EASE_SETTLE: [number, number, number, number] = EASE_BROADCAST_SETTLE;
export const EASE_ACCENT: [number, number, number, number] = EASE_BROADCAST_ACCENT;
export const EASE_ENTER: [number, number, number, number] = EASE_BROADCAST;
export const EASE_EXIT: [number, number, number, number] = EASE_BROADCAST_EXIT;
export const EASE_RANKING: [number, number, number, number] = EASE_BROADCAST_RANKING;
export const EASE_DATA: [number, number, number, number] = EASE_BROADCAST_FAST;
export const EASE_TEXT: [number, number, number, number] = EASE_BROADCAST_TEXT;
export const EASE_GEOMETRY: [number, number, number, number] = EASE_BROADCAST;

/**
 * ABSOLUTE BUG EXCLUSION ZONE (1920x1080 master coordinate system)
 * The Live Bug is permanently anchored in the bottom-left broadcast safe area:
 * left: 80px (Tailwind left-20), bottom: 56px (Tailwind bottom-14).
 * Bug dimensions: ~270px width x 80px height.
 * Boundary: X in [80, 350], Y in [944, 1024].
 * With safety clearance buffer:
 * X: [60, 370], Y: [920, 1040].
 * NO OTHER GRAPHIC MAY OCCUPY, PASS THROUGH, OR INTERSECT THIS RECTANGLE.
 */
export const BUG_EXCLUSION_ZONE = {
  left: 80,
  right: 360,
  top: 936,
  bottom: 1032,
  width: 280,
  height: 96,
  bufferMargin: 20,
  protectedXMax: 375, // Any lower graphic placed in bottom band (Y > 920) must start at or after X = 380px
  protectedYMin: 924, // Any graphic spanning across X <= 360 must sit above Y = 920px (e.g. bottom-[148px])
} as const;

export type BenidormColorTheme =
  | 'cyan'
  | 'purple'
  | 'deepPurple'
  | 'navy'
  | 'gold'
  | 'coral'
  | 'white'
  | 'darkGlass'
  | 'black';

export const THEME_STYLES: Record<
  BenidormColorTheme,
  { bg: string; text: string; border?: string; shadow?: string; accent?: string }
> = {
  cyan: {
    bg: 'bg-gradient-to-r from-[#00d2ff] via-[#00e5ff] to-[#38bdf8]',
    text: 'text-black',
    border: 'border-y border-cyan-200/60',
    shadow: 'shadow-[0_10px_25px_rgba(0,229,255,0.35)]',
    accent: '#00e5ff',
  },
  purple: {
    bg: 'bg-gradient-to-r from-[#591ba8] via-[#6d28d9] to-[#7c3aed]',
    text: 'text-white',
    border: 'border-y border-purple-300/50',
    shadow: 'shadow-[0_10px_25px_rgba(109,40,217,0.4)]',
    accent: '#8b5cf6',
  },
  deepPurple: {
    bg: 'bg-gradient-to-r from-[#170933] via-[#2a0e50] to-[#170933]',
    text: 'text-purple-200',
    border: 'border-y border-purple-500/30',
    shadow: 'shadow-[0_10px_25px_rgba(0,0,0,0.6)]',
    accent: '#a855f7',
  },
  navy: {
    bg: 'bg-gradient-to-r from-[#0a0d24] via-[#101435] to-[#0a0d24]',
    text: 'text-white',
    border: 'border-y border-indigo-950/90',
    shadow: 'shadow-[0_10px_25px_rgba(0,0,0,0.7)]',
    accent: '#3b82f6',
  },
  gold: {
    bg: 'bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24]',
    text: 'text-black',
    border: 'border-y border-amber-200',
    shadow: 'shadow-[0_10px_30px_rgba(245,158,11,0.5)]',
    accent: '#f59e0b',
  },
  coral: {
    bg: 'bg-gradient-to-r from-[#e11d48] via-[#f43f5e] to-[#fb7185]',
    text: 'text-white',
    border: 'border-y border-rose-300/70',
    shadow: 'shadow-[0_10px_30px_rgba(244,63,94,0.55)]',
    accent: '#f43f5e',
  },
  white: {
    bg: 'bg-white',
    text: 'text-black',
    border: 'border-y border-slate-200',
    shadow: 'shadow-[0_10px_25px_rgba(0,0,0,0.4)]',
    accent: '#ffffff',
  },
  darkGlass: {
    bg: 'bg-[#080415]/92 backdrop-blur-md',
    text: 'text-slate-100',
    border: 'border border-purple-500/30',
    shadow: 'shadow-[0_15px_35px_rgba(0,0,0,0.8)]',
    accent: '#00e5ff',
  },
  black: {
    bg: 'bg-[#04060f]',
    text: 'text-white',
    border: 'border-y border-white/10',
    shadow: 'shadow-[0_10px_25px_rgba(0,0,0,0.8)]',
    accent: '#ffffff',
  },
};

/* =========================================================================
   ANIMATION VARIANTS & REUSABLE BROADCAST PRIMITIVES (STRICTLY ZERO FADES)
   All entrances/exits use geometric clipping, directional translate, and panel builds
   ========================================================================= */

export const maskedRevealVariants: Variants = {
  hidden: { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
  visible: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    transition: { duration: 0.55, ease: EASE_BROADCAST },
  },
  exit: {
    clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
    transition: { duration: 0.35, ease: EASE_ACCENT },
  },
};

export const directionalWipeVariants: Variants = {
  hidden: { x: -60, clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
  visible: {
    x: 0,
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    transition: { duration: 0.52, ease: EASE_BROADCAST },
  },
  exit: {
    x: 60,
    clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
    transition: { duration: 0.38, ease: EASE_ACCENT },
  },
};

export const panelBuildVariants: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, originX: 0, transition: { duration: 0.55, ease: EASE_BROADCAST } },
  exit: { scaleX: 0, originX: 1, transition: { duration: 0.38, ease: EASE_ACCENT } },
};

/* =========================================================================
   BROADCAST TYPOGRAPHY SCALE (Designed for 1920x1080 Television Viewing)
   ========================================================================= */
export const BROADCAST_TYPO = {
  DISPLAY_XL: 'font-heavy font-black text-[96px] md:text-[116px] leading-none tracking-tight',
  DISPLAY_L: 'font-heavy font-black text-[64px] md:text-[76px] leading-none tracking-tight',
  DISPLAY_M: 'font-heavy font-black text-[44px] md:text-[52px] leading-none tracking-normal',
  PRIMARY: 'font-heavy font-black text-[32px] md:text-[38px] leading-none tracking-wide',
  SECONDARY: 'font-broadcast font-bold text-[22px] md:text-[26px] leading-tight tracking-wide',
  LABEL: 'font-mono text-[13px] md:text-[15px] font-black uppercase tracking-widest',
  MICRO: 'font-mono text-[11px] md:text-[12px] font-bold uppercase tracking-wider',
  SCORE_TOTAL: 'font-heavy font-mono-num font-black text-[36px] md:text-[42px] leading-none',
  SCORE_PHASE: 'font-heavy font-mono-num font-black text-[32px] md:text-[38px] leading-none',
};

/* Master Graphic Typography Hierarchy Reference */
export const MASTER_TYPO = {
  DISPLAY: 'typo-display font-heavy font-black uppercase tracking-wider',
  TITLE: 'typo-title font-heavy font-black uppercase tracking-wider',
  SUBTITLE: 'typo-subtitle font-broadcast font-bold uppercase tracking-wide',
  BODY: 'typo-body font-sans font-medium',
  LABEL: 'typo-label font-mono font-black uppercase tracking-widest',
  MICRO: 'typo-micro font-mono font-bold uppercase tracking-widest',
};

/* =========================================================================
   1. CHAMFERED_BAR / ChamferedBar
   Parallelogram container with unslanted children, optional sheen & borders
   ========================================================================= */
export interface ChamferedBarProps {
  theme?: BenidormColorTheme;
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
  hasSheen?: boolean;
  skewAngle?: number;
  children: React.ReactNode;
}

export const ChamferedBar: React.FC<ChamferedBarProps> = ({
  theme = 'navy',
  className = '',
  innerClassName = '',
  style,
  hasSheen = false,
  children,
}) => {
  const themeCfg = THEME_STYLES[theme] || THEME_STYLES.navy;

  return (
    <div
      className={`relative chamfer-slant ${themeCfg.bg} ${themeCfg.text} ${themeCfg.border || ''} ${
        themeCfg.shadow || ''
      } overflow-hidden ${className}`}
      style={style}
    >
      {hasSheen && (
        <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-sheen pointer-events-none" />
      )}
      <div className={`chamfer-unslant ${innerClassName}`}>{children}</div>
    </div>
  );
};
export const CHAMFERED_BAR = ChamferedBar;

/* =========================================================================
   2. CHAMFERED_PANEL / ChamferedPanel
   Multi-layer panel with outer structural frame and inner content
   ========================================================================= */
export interface ChamferedPanelProps {
  theme?: BenidormColorTheme;
  accentColor?: string;
  borderTheme?: BenidormColorTheme;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}

export const ChamferedPanel: React.FC<ChamferedPanelProps> = ({
  theme = 'navy',
  accentColor,
  className = '',
  innerClassName = '',
  children,
}) => {
  const themeCfg = THEME_STYLES[theme];

  return (
    <div
      className={`relative chamfer-slant ${themeCfg.bg} ${themeCfg.text} border-y border-purple-500/40 shadow-2xl p-4 overflow-hidden ${className}`}
    >
      {accentColor && (
        <div
          className="absolute top-0 inset-x-0 h-[2px]"
          style={{ backgroundColor: accentColor }}
        />
      )}
      <div className={`chamfer-unslant ${innerClassName}`}>{children}</div>
    </div>
  );
};
export const CHAMFERED_PANEL = ChamferedPanel;

/* =========================================================================
   3. ANGLE_END / AngleEnd
   Angled decorative end-cap or diagonal divider beam
   ========================================================================= */
export interface AngleEndProps {
  theme?: BenidormColorTheme;
  width?: number;
  height?: number | string;
  className?: string;
}

export const AngleEnd: React.FC<AngleEndProps> = ({
  theme = 'cyan',
  width = 16,
  height = '100%',
  className = '',
}) => {
  const themeCfg = THEME_STYLES[theme];
  return (
    <div
      className={`chamfer-slant ${themeCfg.bg} ${className}`}
      style={{ width, height }}
    />
  );
};
export const ANGLE_END = AngleEnd;

/* =========================================================================
   4. SCORE_BLOCK / ScoreBlock
   High-contrast white or colored score block for ranking and voting scores
   ========================================================================= */
export interface ScoreBlockProps {
  value: number | string;
  theme?: 'white' | 'gold' | 'coral' | 'purple' | 'lilac' | 'cyan';
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ScoreBlock: React.FC<ScoreBlockProps> = ({
  value,
  theme = 'white',
  label,
  size = 'md',
  className = '',
}) => {
  const bgClass =
    theme === 'white'
      ? 'bg-white text-black border-y border-slate-200'
      : theme === 'gold'
      ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black border-y border-amber-200 shadow-amber-500/40'
      : theme === 'coral'
      ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white border-y border-rose-300 shadow-rose-900/40'
      : theme === 'cyan'
      ? 'bg-cyan-400 text-black border-y border-cyan-200'
      : theme === 'lilac'
      ? 'bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#8b5cf6] text-white border-y border-purple-300/60 shadow-xl'
      : 'bg-[#2e1058] text-purple-200 border-y border-purple-500/40';

  const fontClass =
    size === 'xl'
      ? 'text-[44px] md:text-[50px] font-black'
      : size === 'lg'
      ? 'text-[38px] md:text-[42px] font-black'
      : size === 'sm'
      ? 'text-[24px] font-black'
      : 'text-[32px] md:text-[36px] font-black';

  const widthClass =
    size === 'xl'
      ? 'w-[140px]'
      : size === 'lg'
      ? 'w-[124px]'
      : size === 'sm'
      ? 'w-[84px]'
      : 'w-[110px]';

  return (
    <div
      className={`relative ${widthClass} h-full chamfer-slant ${bgClass} flex flex-col items-center justify-center shadow-xl ${className}`}
    >
      <div className="chamfer-unslant flex flex-col items-center justify-center leading-none">
        {label && (
          <span className="font-mono text-[11px] font-black tracking-widest uppercase opacity-85 mb-0.5">
            {label}
          </span>
        )}
        <span className={`font-heavy font-mono-num tracking-tight ${fontClass}`}>
          {value}
        </span>
      </div>
    </div>
  );
};
export const SCORE_BLOCK = ScoreBlock;

/* =========================================================================
   5. ACCENT_BLOCK / AccentBlock
   Small angled accent badge for performance numbers, ranking or tags
   ========================================================================= */
export interface AccentBlockProps {
  label: string | number;
  theme?: BenidormColorTheme;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AccentBlock: React.FC<AccentBlockProps> = ({
  label,
  theme = 'cyan',
  size = 'md',
  className = '',
}) => {
  const themeCfg = THEME_STYLES[theme];
  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-1 text-xs'
      : size === 'lg'
      ? 'px-6 py-2 text-2xl'
      : 'px-4 py-1.5 text-base';

  return (
    <div
      className={`inline-flex items-center justify-center chamfer-slant ${themeCfg.bg} ${themeCfg.text} ${
        themeCfg.border || ''
      } ${themeCfg.shadow || ''} ${sizeClasses} ${className}`}
    >
      <span className="chamfer-unslant font-mono-num font-black tracking-wider leading-none">
        {label}
      </span>
    </div>
  );
};
export const ACCENT_BLOCK = AccentBlock;
export const ChamferedBadge = AccentBlock;

/* =========================================================================
   6. TEXT_MODULE / TextModule
   Masked primary title + secondary descriptor
   ========================================================================= */
export interface TextModuleProps {
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  className?: string;
}

export const TextModule: React.FC<TextModuleProps> = ({
  title,
  subtitle,
  titleClassName = 'text-[24px] font-black uppercase text-white',
  subtitleClassName = 'text-xs uppercase text-purple-300 font-medium',
  className = '',
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className={`font-broadcast tracking-wide truncate ${titleClassName}`}>
        {title}
      </span>
      {subtitle && (
        <span className={`font-broadcast tracking-wider truncate mt-0.5 ${subtitleClassName}`}>
          {subtitle}
        </span>
      )}
    </div>
  );
};
export const TEXT_MODULE = TextModule;

/* =========================================================================
   7. DIVIDER / Divider
   Angled hairline or glowing beam divider between broadcast components
   ========================================================================= */
export interface DividerProps {
  orientation?: 'vertical' | 'horizontal';
  theme?: 'cyan' | 'purple' | 'gold' | 'white';
  length?: string | number;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'vertical',
  theme = 'cyan',
  length,
  className = '',
}) => {
  const colorMap = {
    cyan: 'from-cyan-400 via-cyan-300 to-transparent shadow-[0_0_8px_rgba(0,229,255,0.6)]',
    purple: 'from-purple-500 via-purple-400 to-transparent shadow-[0_0_8px_rgba(168,85,247,0.6)]',
    gold: 'from-amber-400 via-yellow-300 to-transparent shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    white: 'from-white via-slate-200 to-transparent',
  };

  if (orientation === 'horizontal') {
    return (
      <div
        className={`h-[2px] w-full bg-gradient-to-r ${colorMap[theme]} ${className}`}
        style={length ? { width: length } : undefined}
      />
    );
  }

  return (
    <div
      className={`w-[2px] h-full bg-gradient-to-b ${colorMap[theme]} skew-x-[-20deg] ${className}`}
      style={length ? { height: length } : undefined}
    />
  );
};
export const DIVIDER = Divider;

/* =========================================================================
   8. MASKED_REVEAL / MaskedReveal
   Sliding geometric mask reveal for text or panels
   ========================================================================= */
export interface MaskedRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'left' | 'bottom' | 'right';
  className?: string;
}

export const MaskedReveal: React.FC<MaskedRevealProps> = ({
  children,
  delay = 0,
  duration = 0.55,
  direction = 'left',
  className = '',
}) => {
  const initial =
    direction === 'left'
      ? { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', x: -15, opacity: 0 }
      : direction === 'right'
      ? { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)', x: 15, opacity: 0 }
      : { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', y: 20, opacity: 0 };

  const animate = {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    x: 0,
    y: 0,
    opacity: 1,
  };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={initial}
      transition={{ duration, delay, ease: EASE_BROADCAST }}
      className={`overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};
export const MASKED_REVEAL = MaskedReveal;
export const MaskedRevealText = MaskedReveal;

/* =========================================================================
   9. HIGHLIGHT_STRIP / HighlightStrip
   Dynamic directional color enter/retract highlight strip (e.g. coral active state)
   ========================================================================= */
export interface HighlightStripProps {
  active: boolean;
  color?: string;
  className?: string;
}

export const HighlightStrip: React.FC<HighlightStripProps> = ({
  active,
  color = '#f43f5e',
  className = '',
}) => {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: active ? 1 : 0 }}
      transition={{ duration: 0.45, ease: EASE_BROADCAST }}
      className={`absolute inset-0 pointer-events-none origin-left ${className}`}
      style={{ backgroundColor: color, opacity: active ? 0.95 : 0 }}
    />
  );
};
export const HIGHLIGHT_STRIP = HighlightStrip;

/* =========================================================================
   10. GEOMETRIC_ARROW & CHEVRONS
   Ascending stage chevrons & arrows from Benidorm Fest identity
   ========================================================================= */
export interface GeometricChevronsProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'gold' | 'white';
  animated?: boolean;
  className?: string;
}

export const GeometricChevrons: React.FC<GeometricChevronsProps> = ({
  count = 3,
  size = 'md',
  color = 'cyan',
  animated = true,
  className = '',
}) => {
  const strokeColor =
    color === 'gold'
      ? 'stroke-amber-400'
      : color === 'purple'
      ? 'stroke-purple-400'
      : color === 'white'
      ? 'stroke-white'
      : 'stroke-cyan-400';

  const glowColor =
    color === 'gold'
      ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
      : color === 'purple'
      ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]'
      : color === 'white'
      ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'
      : 'drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]';

  const dimensions =
    size === 'sm'
      ? { w: 24, h: 14 }
      : size === 'lg'
      ? { w: 64, h: 36 }
      : { w: 40, h: 22 };

  return (
    <div className={`flex flex-col items-center gap-1.5 ${glowColor} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.svg
          key={i}
          width={dimensions.w}
          height={dimensions.h}
          viewBox="0 0 40 22"
          fill="none"
          animate={
            animated
              ? {
                  y: [0, -6, 0],
                  opacity: [0.6, 1, 0.6],
                }
              : undefined
          }
          transition={
            animated
              ? {
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.25,
                }
              : undefined
          }
          className={`${strokeColor}`}
        >
          <path
            d="M2 18 L20 4 L38 18"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      ))}
    </div>
  );
};
export const CHEVRON = GeometricChevrons;
export const GEOMETRIC_ARROW = GeometricChevrons;

/* =========================================================================
   11. DIRECTIONAL_LINE / DirectionalLine
   Horizontal glowing beam line with left/right anchor
   ========================================================================= */
export interface DirectionalLineProps {
  color?: 'cyan' | 'purple' | 'gold';
  className?: string;
}

export const DirectionalLine: React.FC<DirectionalLineProps> = ({
  color = 'cyan',
  className = '',
}) => {
  const gradient =
    color === 'cyan'
      ? 'from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(0,229,255,0.8)]'
      : color === 'gold'
      ? 'from-transparent via-amber-400 to-transparent shadow-[0_0_12px_rgba(245,158,11,0.8)]'
      : 'from-transparent via-purple-400 to-transparent shadow-[0_0_12px_rgba(168,85,247,0.8)]';

  return <div className={`h-[2px] w-full bg-gradient-to-r ${gradient} ${className}`} />;
};
export const DIRECTIONAL_LINE = DirectionalLine;

/* =========================================================================
   12. STACKED_PANEL / StackedPanel
   Stacked broadcast modules for lower thirds, scoreboard headers, etc.
   ========================================================================= */
export interface StackedPanelProps {
  topTheme?: BenidormColorTheme;
  bottomTheme?: BenidormColorTheme;
  topContent: React.ReactNode;
  bottomContent: React.ReactNode;
  className?: string;
}

export const StackedPanel: React.FC<StackedPanelProps> = ({
  topTheme = 'purple',
  bottomTheme = 'cyan',
  topContent,
  bottomContent,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <ChamferedBar theme={topTheme} className="px-8 py-2.5 shadow-xl">
        {topContent}
      </ChamferedBar>
      <ChamferedBar theme={bottomTheme} className="px-7 py-1.5 -mt-1 ml-4 shadow-xl">
        {bottomContent}
      </ChamferedBar>
    </div>
  );
};
export const STACKED_PANEL = StackedPanel;

/* =========================================================================
   13. VIDEO_MASK / VideoMask
   16:9 Broadcast viewport mask with chamfered accents and safe frame
   ========================================================================= */
export interface VideoMaskProps {
  className?: string;
  children: React.ReactNode;
}

export const VideoMask: React.FC<VideoMaskProps> = ({ className = '', children }) => {
  return (
    <div
      className={`relative w-full h-full rounded-sm overflow-hidden border border-purple-500/40 bg-[#090515] shadow-2xl shadow-purple-950/80 ${className}`}
    >
      {children}
      {/* 16:9 Chamfered Corner Frame */}
      <div className="absolute inset-0 pointer-events-none border border-cyan-400/20 shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]" />
    </div>
  );
};
export const VIDEO_MASK = VideoMask;

/* =========================================================================
   14. ACCENT_SWEEP / AccentSweep
   Light/sheen sweep across broadcast element
   ========================================================================= */
export const AccentSweep: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-sheen pointer-events-none ${className}`}
  />
);
export const ACCENT_SWEEP = AccentSweep;

/* =========================================================================
   15. BENIDORM BUG / LiveBug
   Authoritative Benidorm Fest TV Logo Bug
   ========================================================================= */
export interface BenidormBugProps {
  festivalName?: string;
  stageName?: string;
  showLiveTag?: boolean;
  className?: string;
}

export const BenidormBug: React.FC<BenidormBugProps> = ({
  festivalName = 'BENIDORM FEST',
  stageName,
  showLiveTag = false,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] ${className}`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-heavy font-black text-[26px] tracking-tight uppercase text-white leading-none">
            {festivalName}
          </span>
          {showLiveTag && (
            <div className="chamfer-slant bg-red-600 px-2 py-0.5 ml-1 flex items-center">
              <span className="chamfer-unslant font-mono text-[10px] font-black text-white tracking-widest uppercase">
                DIRECTO
              </span>
            </div>
          )}
        </div>
        {stageName && (
          <span className="font-broadcast text-xs font-semibold tracking-widest text-purple-300 uppercase mt-0.5">
            {stageName}
          </span>
        )}
      </div>
    </div>
  );
};
