import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Participant } from '../../../types/broadcast';
import {
  BF25ArtistIcon,
  DirectionalChevron,
  SquareAccentStrip,
  CornerLBracket,
} from './Benidorm2025Primitives';
import {
  fitBF25Text,
  StageCornerBracketPair,
  StageScanlineOverlay,
} from './Benidorm2025AnimationEngine';
import { Phone, MessageSquare, Vote } from 'lucide-react';

interface VotingBanner2025Props {
  participant?: Participant;
  showPerformanceNumber?: boolean;
  customNumber?: string | number;
  customSmsKeyword?: string;
  customPhone?: string;
  smsShortcode?: string;
}

// Professional television broadcast cubic bezier curves
const EASE_BROADCAST = [0.22, 1, 0.36, 1] as const;
const EASE_EXIT = [0.4, 0, 0.7, 0.2] as const;

/**
 * BENIDORM FEST 2025 — COMPACT "APOYA / VOTO TV" GRAPHIC
 * 
 * Sleek, low-height (52px), high-density broadcast voting prompt.
 * Replaces bulky, oversized banners with a compact, ultra-readable TV strip:
 * 
 * Composition:
 * - [YELLOW #FFD700]: Candidate Number Block (e.g. "01")
 * - [MAGENTA #FF007A]: "APOYA A [ARTISTA]"
 * - [ROYAL BLUE #002BCC]: "VOTO TV • 905 810 0XX | SMS 25152"
 * 
 * Animation:
 * - 32 Discrete Animation Stages across 5 Progressive Phases:
 *   - Phase 1: Anchor & Boundary Calibration (0 - 150 ms)
 *   - Phase 2: Geometric Build (Directional wipes, panels) (150 - 450 ms)
 *   - Phase 3: Typographic Reveal (APOYA, Artist, Numbers) (450 - 850 ms)
 *   - Phase 4: Accents & Information (Badges, Chevrons, Brackets) (850 - 1250 ms)
 *   - Phase 5: Final Settle (Flare sweep, broadcast lock) (1250 - 1600 ms)
 */
export const VotingBanner2025: React.FC<VotingBanner2025Props> = ({
  participant,
  showPerformanceNumber = true,
  customNumber,
  customSmsKeyword,
  customPhone,
  smsShortcode = '25152',
}) => {
  const num =
    customNumber !== undefined
      ? String(customNumber).padStart(2, '0')
      : participant?.performanceNumber !== undefined
      ? String(participant.performanceNumber).padStart(2, '0')
      : '01';

  const rawArtist = (participant?.name || participant?.artist || 'ARTISTA').toUpperCase();
  const phone = customPhone || participant?.phone || `905 810 0${num}`;
  const sms = customSmsKeyword || participant?.smsKeyword || `VOTA ${num}`;

  // Time-based animation stage progression
  const [animTimeMs, setAnimTimeMs] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = performance.now();
    const update = (now: number) => {
      const elapsed = now - (startTimeRef.current || now);
      setAnimTimeMs(elapsed);
      if (elapsed < 1700) {
        animFrameRef.current = requestAnimationFrame(update);
      } else {
        setAnimTimeMs(1700);
      }
    };
    animFrameRef.current = requestAnimationFrame(update);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const t = animTimeMs;

  // 32 Discrete Animation Stages
  // Phase 1: Anchor (0 - 150ms)
  const st01_anchorReady = t >= 30;
  const st02_safeBoundariesChecked = t >= 70;
  const st03_bugExclusionClear = t >= 110;
  const st04_chassisMaskPrepared = t >= 140;

  // Phase 2: Geometric Build (150 - 450ms)
  const st05_baseStripWipe = t >= 160;
  const st06_darkNavyUnderlay = t >= 200;
  const st07_goldNumberBoxWipe = t >= 240;
  const st08_artistMagentaSlabWipe = t >= 280;
  const st09_votoTvBlueSlabWipe = t >= 330;
  const st10_geometricSeparators = t >= 370;
  const st11_cornerBracketsBase = t >= 410;
  const st12_geometrySettled = t >= 450;

  // Phase 3: Text Reveal (450 - 850ms)
  const st13_numberDigitSlitReveal = t >= 470;
  const st14_apoyaLabelMaskOpen = t >= 520;
  const st15_artistNameTextMaskOpen = t >= 570;
  const st16_artistFullTextReveal = t >= 620;
  const st17_votoTvBadgeReveal = t >= 670;
  const st18_phoneIconReveal = t >= 720;
  const st19_phoneNumberReveal = t >= 770;
  const st20_smsTextReveal = t >= 820;

  // Phase 4: Accents (850 - 1250ms)
  const st21_chevronArrowReveal = t >= 870;
  const st22_squareStripsReveal = t >= 920;
  const st23_yellowDividerLines = t >= 970;
  const st24_phoneCallPulse = t >= 1030;
  const st25_bracketTopLeftLock = t >= 1090;
  const st26_bracketBottomRightLock = t >= 1150;
  const st27_accentsSettled = t >= 1210;

  // Phase 5: Final Settle (1250 - 1600ms)
  const st28_edgeFlareSweepStart = t >= 1260;
  const st29_edgeFlareSweepAcross = t >= 1340;
  const st30_temporaryMasksClear = t >= 1420;
  const st31_typographyHierarchyLock = t >= 1500;
  const st32_broadcastReadySettled = t >= 1580;

  // Fit artist typography to container
  const artistStyle = fitBF25Text(rawArtist, {
    maxContainerWidth: 320,
    baseFontSize: 22,
    minFontSize: 15,
    charThreshold: 14,
    letterSpacingEm: 0.04,
  });

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-end items-center pb-[52px] z-30">
      <motion.div
        initial={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 28,
          opacity: 0,
        }}
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          y: 0,
          opacity: st01_anchorReady ? 1 : 0,
          transition: { duration: 0.5, ease: EASE_BROADCAST },
        }}
        exit={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 20,
          opacity: 0,
          transition: { duration: 0.35, ease: EASE_EXIT },
        }}
        style={{
          width: '940px',
          height: '52px', // Compact low-height television strip
        }}
        className="relative flex items-stretch drop-shadow-[0_16px_40px_rgba(0,0,0,0.96)] overflow-hidden border-2 border-[#2A65F5] bg-[#070B1F]"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.035} />

        {/* ================================================================= */}
        {/* BLOCK 1: GOLD PERFORMANCE NUMBER (Width: 64px)                    */}
        {/* ================================================================= */}
        {showPerformanceNumber && (
          <div
            style={{
              width: '64px',
              clipPath: st07_goldNumberBoxWipe
                ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
              transition: 'clip-path 300ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="bg-[#FFD700] border-r-2 border-[#FFE55C] flex flex-col items-center justify-center shrink-0 relative overflow-hidden"
          >
            <span
              style={{
                opacity: st13_numberDigitSlitReveal ? 1 : 0,
                transform: st13_numberDigitSlitReveal ? 'scale(1)' : 'scale(0.8)',
                transition: 'all 240ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="font-heavy text-[32px] font-black text-[#0A1244] leading-none tracking-tight font-mono"
            >
              {num}
            </span>
          </div>
        )}

        {/* Artist Emblem Icon */}
        <div
          style={{ width: '48px' }}
          className="shrink-0 bg-[#0B1026] border-r border-[#FF007A]/40 flex items-center justify-center"
        >
          <BF25ArtistIcon size={24} color="#FFD700" />
        </div>

        {/* ================================================================= */}
        {/* BLOCK 2: "APOYA A" + ARTIST NAME CONTAINER (Vibrant Magenta)      */}
        {/* ================================================================= */}
        <div
          style={{
            clipPath: st08_artistMagentaSlabWipe
              ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
              : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
            transition: 'clip-path 340ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="flex-1 bg-gradient-to-r from-[#FF007A] via-[#E6007A] to-[#C7005D] flex items-center px-3.5 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 overflow-hidden mr-1">
            <span
              style={{
                opacity: st14_apoyaLabelMaskOpen ? 1 : 0,
                transition: 'opacity 200ms ease-out',
              }}
              className="bg-[#0A1244] text-[#FFD700] px-2 py-0.5 font-heavy text-[11px] font-black uppercase tracking-wider shrink-0"
            >
              APOYA A
            </span>
            <span
              style={{
                fontSize: `${artistStyle.fontSize}px`,
                letterSpacing: artistStyle.letterSpacing,
                opacity: st16_artistFullTextReveal ? 1 : 0,
                transform: st16_artistFullTextReveal ? 'translateX(0)' : 'translateX(14px)',
                transition: 'all 260ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="font-heavy font-black uppercase text-white truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
            >
              {rawArtist}
            </span>
          </div>

          {/* Directional Chevron Transitioning to Voting Numbers */}
          <div
            style={{
              opacity: st21_chevronArrowReveal ? 1 : 0,
              transition: 'opacity 200ms ease-out',
            }}
            className="ml-auto pointer-events-none shrink-0"
          >
            <DirectionalChevron size={12} color="#FFD700" direction="right" />
          </div>
        </div>

        {/* ================================================================= */}
        {/* BLOCK 3: "VOTO TV" CAPSULE (Royal Blue #002BCC)                   */}
        {/* ================================================================= */}
        <div
          style={{
            width: '420px',
            clipPath: st09_votoTvBlueSlabWipe
              ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
              : 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
            transition: 'clip-path 340ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="bg-[#002BCC] border-l-2 border-[#2A65F5] flex items-center justify-between px-3 shrink-0 relative overflow-hidden"
        >
          {/* Badge: "VOTO TV" */}
          <div
            style={{
              opacity: st17_votoTvBadgeReveal ? 1 : 0,
              transition: 'opacity 200ms ease-out',
            }}
            className="bg-[#FFD700] text-[#0A1244] px-2 py-0.5 font-heavy text-[11px] font-black uppercase tracking-wider shrink-0"
          >
            VOTO TV
          </div>

          {/* Phone Call Instructions */}
          <div
            style={{
              opacity: st19_phoneNumberReveal ? 1 : 0,
              transition: 'opacity 220ms ease-out',
            }}
            className="flex items-center gap-1.5 shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="font-heavy text-[14px] font-black text-white tracking-tight font-mono">
              {phone}
            </span>
          </div>

          <div className="w-[1.5px] h-6 bg-[#2A65F5]" />

          {/* SMS Shortcode Instructions */}
          <div
            style={{
              opacity: st20_smsTextReveal ? 1 : 0,
              transition: 'opacity 220ms ease-out',
            }}
            className="flex items-center gap-1.5 shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#8EDCFF]" />
            <span className="font-heavy text-[14px] font-black text-[#FFD700] tracking-tight font-mono">
              {sms} <span className="text-white text-[12px]">AL</span> {smsShortcode}
            </span>
          </div>
        </div>

        {/* Corner Accents */}
        {st25_bracketTopLeftLock && (
          <div className="absolute top-0.5 left-0.5 pointer-events-none z-20">
            <StageCornerBracketPair size={6} thickness={1.5} color="#8EDCFF" />
          </div>
        )}
        {st26_bracketBottomRightLock && (
          <div className="absolute bottom-0.5 right-0.5 pointer-events-none z-20">
            <CornerLBracket size={6} thickness={1.5} color="#FFD700" position="bottom-right" />
          </div>
        )}

        {/* Holographic Edge Flare Sweep */}
        {st28_edgeFlareSweepStart && !st32_broadcastReadySettled && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 1050 }}
            transition={{ duration: 0.55, ease: EASE_BROADCAST }}
            className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none z-30"
          />
        )}
      </motion.div>
    </div>
  );
};

export default VotingBanner2025;
