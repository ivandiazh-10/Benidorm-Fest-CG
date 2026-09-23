import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ActiveRevealState, Show } from '../../../types/broadcast';
import {
  BF25ArtistIcon,
  DirectionalChevron,
  CornerLBracket,
} from './Benidorm2025Primitives';
import {
  fitBF25Text,
  StageCornerBracketPair,
  StageScanlineOverlay,
} from './Benidorm2025AnimationEngine';

interface VoteReveal2025Props {
  show: Show;
  activeReveal?: ActiveRevealState | null;
}

// Broadcast easing curves (zero spring, zero bounce, zero overshoot)
const EASE_BROADCAST = [0.22, 1, 0.36, 1] as const;
const EASE_OUTRO = [0.4, 0, 0.7, 0.2] as const;

/**
 * BENIDORM FEST 2025 — "APOYA / VOTO TV (CLEAN)" POINTS AWARDED GRAPHIC
 * 
 * Specifically communicates points awarded to a recipient artist (e.g. "+14 — Melody").
 * 
 * Features:
 * - Ultra-compact low-height broadcast strip (54px height, 680px width)
 * - Visually Dominant Points Block: e.g. "+14" (Bright Yellow #FFD700 / 38px bold mono-num)
 * - Clear Geometric Chevron Separator
 * - Recipient Artist Name: e.g. "Melody" (Vibrant Magenta #FF007A / 26px bold uppercase)
 * - Small Controlled "VOTO TV" / Phase Badge
 * - 32 Discrete Animation Stages across 6 Progressive Phases (850ms build, 500ms outro)
 * - Perfectly safe-area and BUG_EXCLUSION_ZONE compliant.
 */
export const VoteReveal2025: React.FC<VoteReveal2025Props> = ({
  show,
  activeReveal,
}) => {
  const reveal = activeReveal || show.activeReveal;
  if (!reveal) return null;

  const participant = show.participants.find((p) => p.id === reveal.participantId);
  const artist = (reveal.recipientName || participant?.name || participant?.artist || 'ARTISTA').toUpperCase();
  const points = reveal.pointsAwarded ?? 0;
  const pointsString = points > 0 ? `+${points}` : `${points}`;

  const phaseTag =
    reveal.phase === 'public'
      ? 'VOTO TV'
      : reveal.phase === 'demoscopic'
      ? 'DEMOSCÓPICO'
      : 'JURADO';

  // 32-Stage Progressive Animation Timeline
  const [animTimeMs, setAnimTimeMs] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = performance.now();
    const update = (now: number) => {
      const elapsed = now - (startTimeRef.current || now);
      setAnimTimeMs(elapsed);
      if (elapsed < 1000) {
        animFrameRef.current = requestAnimationFrame(update);
      } else {
        setAnimTimeMs(1000);
      }
    };
    animFrameRef.current = requestAnimationFrame(update);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [reveal.revealedAt, reveal.participantId, reveal.pointsAwarded]);

  const t = animTimeMs;

  // 32 Discrete Animation Stages across 6 Phases:
  // Phase 1: Compact Anchor (0 - 120ms)
  const st01_anchorReady = t >= 25;
  const st02_safeBoundariesChecked = t >= 50;
  const st03_bugZoneClear = t >= 75;
  const st04_chassisMaskPrepared = t >= 100;

  // Phase 2: Background Construction (120 - 350ms)
  const st05_baseStripWipe = t >= 120;
  const st06_navyBaseUnderlay = t >= 150;
  const st07_goldPointsPanelWipe = t >= 180;
  const st08_magentaArtistPanelWipe = t >= 220;
  const st09_royalBlueVotoTagWipe = t >= 260;
  const st10_geometricSeparators = t >= 300;

  // Phase 3: Points Reveal (350 - 550ms)
  const st11_pointsSlitMaskOpen = t >= 350;
  const st12_pointsPlusSignMaterialize = t >= 390;
  const st13_pointsDigitsScaleIn = t >= 430;
  const st14_pointsDropShadowLock = t >= 480;
  const st15_pointsPulseAura = t >= 520;

  // Phase 4: Artist Reveal (550 - 750ms)
  const st16_artistTextMaskOpen = t >= 550;
  const st17_artistNameInitialProgressive = t >= 590;
  const st18_artistNameFullProgressive = t >= 630;
  const st19_artistDropShadowLock = t >= 680;
  const st20_artistIconMaterialize = t >= 720;

  // Phase 5: Final Accents (750 - 900ms)
  const st21_chevronArrowReveal = t >= 750;
  const st22_votoTvPillTextReveal = t >= 780;
  const st23_bracketTopLeftLock = t >= 810;
  const st24_bracketBottomRightLock = t >= 840;
  const st25_goldDividerLineLock = t >= 870;

  // Phase 6: Final Settle (900 - 1000ms)
  const st26_edgeFlareSweepStart = t >= 900;
  const st27_edgeFlareSweepAcross = t >= 930;
  const st28_edgeFlareSweepExit = t >= 960;
  const st29_temporaryMasksClear = t >= 980;
  const st30_masterLayoutLocked = t >= 990;
  const st31_readabilityConfirmed = t >= 995;
  const st32_broadcastReadyStable = t >= 1000;

  // Dynamic text fitting for artist
  const artistStyle = fitBF25Text(artist, {
    maxContainerWidth: 380,
    baseFontSize: 26,
    minFontSize: 16,
    charThreshold: 14,
    letterSpacingEm: 0.04,
  });

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-end items-center pb-[72px] z-30">
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
          transition: { duration: 0.48, ease: EASE_BROADCAST },
        }}
        exit={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 20,
          opacity: 0,
          transition: {
            duration: 0.42, // Clean 400-800ms television exit
            ease: EASE_OUTRO,
          },
        }}
        style={{
          width: '740px',
          height: '54px', // Compact low-height television strip
        }}
        className="relative flex items-stretch drop-shadow-[0_20px_50px_rgba(0,0,0,0.96)] overflow-hidden border-2 border-[#2A65F5] bg-[#070B1F]"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.035} />

        {/* ================================================================= */}
        {/* BLOCK 1: POINTS AWARDED VALUE (VISUALLY DOMINANT) e.g. "+14"      */}
        {/* ================================================================= */}
        <div
          style={{
            width: '120px',
            clipPath: st07_goldPointsPanelWipe
              ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
              : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
            transition: 'clip-path 260ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="bg-[#FFD700] border-r-2 border-[#FFE55C] flex items-center justify-center shrink-0 relative overflow-hidden shadow-inner"
        >
          <span
            style={{
              opacity: st13_pointsDigitsScaleIn ? 1 : 0,
              transform: st13_pointsDigitsScaleIn ? 'scale(1)' : 'scale(0.8)',
              transition: 'all 200ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="font-heavy text-[38px] font-black text-[#0A1244] leading-none tracking-tight font-mono drop-shadow-sm"
          >
            {pointsString}
          </span>
        </div>

        {/* Emblem Icon Square */}
        <div
          style={{
            width: '46px',
            opacity: st20_artistIconMaterialize ? 1 : 0,
            transition: 'opacity 180ms ease-out',
          }}
          className="shrink-0 bg-[#0B1026] border-r border-[#FF007A]/40 flex items-center justify-center"
        >
          <BF25ArtistIcon size={24} color="#FFD700" />
        </div>

        {/* ================================================================= */}
        {/* BLOCK 2: RECIPIENT ARTIST NAME e.g. "Melody"                      */}
        {/* ================================================================= */}
        <div
          style={{
            clipPath: st08_magentaArtistPanelWipe
              ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
              : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
            transition: 'clip-path 300ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="flex-1 bg-gradient-to-r from-[#FF007A] via-[#E6007A] to-[#C7005D] flex items-center px-4 relative overflow-hidden"
        >
          <span
            style={{
              fontSize: `${artistStyle.fontSize}px`,
              letterSpacing: artistStyle.letterSpacing,
              opacity: st18_artistNameFullProgressive ? 1 : 0,
              transform: st18_artistNameFullProgressive ? 'translateX(0)' : 'translateX(14px)',
              transition: 'all 240ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="font-heavy font-black uppercase text-white truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
          >
            {artist}
          </span>

          {/* Directional Chevron Divider pointing toward phase tag */}
          <div
            style={{
              opacity: st21_chevronArrowReveal ? 1 : 0,
              transition: 'opacity 180ms ease-out',
            }}
            className="ml-auto pointer-events-none shrink-0"
          >
            <DirectionalChevron size={13} color="#FFD700" direction="right" />
          </div>
        </div>

        {/* ================================================================= */}
        {/* BLOCK 3: SMALL VOTO TV / PHASE BADGE                              */}
        {/* ================================================================= */}
        <div
          style={{
            width: '140px',
            clipPath: st09_royalBlueVotoTagWipe
              ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
              : 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
            transition: 'clip-path 260ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="bg-[#002BCC] border-l-2 border-[#2A65F5] flex items-center justify-center px-3 shrink-0 relative overflow-hidden"
        >
          <span
            style={{
              opacity: st22_votoTvPillTextReveal ? 1 : 0,
              transition: 'opacity 180ms ease-out',
            }}
            className="font-heavy text-[13px] font-black text-[#FFD700] uppercase tracking-[0.16em]"
          >
            {phaseTag}
          </span>
        </div>

        {/* Corner Accents */}
        {st23_bracketTopLeftLock && (
          <div className="absolute top-0.5 left-0.5 pointer-events-none z-20">
            <StageCornerBracketPair size={6} thickness={1.5} color="#0A1244" />
          </div>
        )}
        {st24_bracketBottomRightLock && (
          <div className="absolute bottom-0.5 right-0.5 pointer-events-none z-20">
            <CornerLBracket size={6} thickness={1.5} color="#FFD700" position="bottom-right" />
          </div>
        )}

        {/* Holographic Edge Flare Sweep */}
        {st26_edgeFlareSweepStart && !st32_broadcastReadyStable && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 800 }}
            transition={{ duration: 0.45, ease: EASE_BROADCAST }}
            className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] pointer-events-none z-30"
          />
        )}
      </motion.div>
    </div>
  );
};

export default VoteReveal2025;
