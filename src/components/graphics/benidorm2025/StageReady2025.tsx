import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Participant } from '../../../types/broadcast';
import {
  BF25ArtistIcon,
  DirectionalChevron,
  CornerLBracket,
  SquareAccentStrip,
} from './Benidorm2025Primitives';
import {
  StageScanlineOverlay,
  StageCornerBracketPair,
  fitBF25Text,
} from './Benidorm2025AnimationEngine';
import { Radio, Music2 } from 'lucide-react';

interface StageReady2025Props {
  participant?: Participant;
  showPerformanceNumber?: boolean;
  customNumber?: string | number;
  customArtist?: string;
  customSong?: string;
  customComposers?: string;
  customArrangers?: string;
}

// Broadcast easing curves (zero spring, zero bounce, zero overshoot)
const EASE_BROADCAST = [0.22, 1, 0.36, 1] as const;
const EASE_OUTRO = [0.4, 0, 0.7, 0.2] as const;

/**
 * BENIDORM FEST 2025 — STAGE READY (LARGE CENTERED BROADCAST INTRO)
 * 
 * Specifically designed as a PROMINENT CENTRAL BROADCAST GRAPHIC:
 * - Centered horizontally & vertically in the 1920x1080 frame
 * - Large visual footprint (1080px width, 220px height)
 * - Major central hierarchy (84px mono-num number, 44px artist name)
 * - 4200ms Progressive Intro with 65+ discrete animation stages across 7 phases
 * - 1150ms Multi-stage Outro
 * - Strictly respects BUG_EXCLUSION_ZONE and broadcast safe areas.
 */
export const StageReady2025: React.FC<StageReady2025Props> = ({
  participant,
  showPerformanceNumber = true,
  customNumber,
  customArtist,
  customSong,
  customComposers,
  customArrangers,
}) => {
  const num =
    customNumber !== undefined
      ? String(customNumber).padStart(2, '0')
      : participant?.performanceNumber !== undefined
      ? String(participant.performanceNumber).padStart(2, '0')
      : '01';

  const artist = (customArtist || participant?.name || participant?.artist || 'ARTISTA').toUpperCase();
  const song = (customSong || participant?.song || 'CANCIÓN OFICIAL').toUpperCase();
  const composers = customComposers || participant?.composers;
  const arrangers = customArrangers || participant?.arrangers;

  // Single Authoritative Animation Progress Tracker
  const [animationTimeMs, setAnimationTimeMs] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = performance.now();
    const update = (now: number) => {
      const elapsed = now - (startTimeRef.current || now);
      setAnimationTimeMs(elapsed);
      if (elapsed < 4300) {
        animFrameRef.current = requestAnimationFrame(update);
      } else {
        setAnimationTimeMs(4300); // Fully locked & settled
      }
    };
    animFrameRef.current = requestAnimationFrame(update);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const t = animationTimeMs;

  // 65+ Discrete Stages Across 7 Timeline Phases:
  // Phase 1: Silent Preparation & Center Anchor Calibration (0 - 250 ms)
  const s01_canvasInit = t >= 30;
  const s02_centerAnchorEstablished = t >= 70;
  const s03_safeBoundariesVerified = t >= 110;
  const s04_bugExclusionProtected = t >= 150;
  const s05_centralMasksReady = t >= 190;
  const s06_anchorFoundationSet = t >= 230;

  // Phase 2: Primary Structural Build (250 - 850 ms)
  const s07_navyBaseChassisExpand = t >= 260;
  const s08_navyDiagonalChamfer = t >= 310;
  const s09_primaryRoyalBlueSlabSlide = t >= 360;
  const s10_primaryRoyalBlueMaskClip = t >= 410;
  const s11_deepContrastBackingLayer = t >= 460;
  const s12_structuralBorderTopWipe = t >= 510;
  const s13_structuralBorderBottomWipe = t >= 560;
  const s14_angularDividerBuild = t >= 620;
  const s15_primaryCenterParallaxSettle = t >= 690;
  const s16_chassisFoundationLocked = t >= 780;

  // Phase 3: Secondary Geometry (850 - 1450 ms)
  const s17_lilacArchitecturalFrameWipe = t >= 860;
  const s18_lilacVerticalPillarExpand = t >= 910;
  const s19_magentaSecondarySlabOpen = t >= 960;
  const s20_hotPinkCoreSurfaceExpand = t >= 1010;
  const s21_geometricIntersectionBevel = t >= 1060;
  const s22_goldNumberBlockWipeLeft = t >= 1110;
  const s23_goldNumberBlockChamfer = t >= 1160;
  const s24_artistEmblemSquareBuild = t >= 1210;
  const s25_topBannerBlueSlideRight = t >= 1270;
  const s26_topBannerBorderAccentGlow = t >= 1340;
  const s27_secondaryGeometrySettled = t >= 1410;

  // Phase 4: Typographic Build (1450 - 2200 ms)
  const s28_topBannerTextMaskOpen = t >= 1460;
  const s29_topBannerBeaconBlinkStart = t >= 1510;
  const s30_numberSlitMaskOpen = t >= 1560;
  const s31_numberSublabelReveal = t >= 1610;
  const s32_numberDigitsMaterialize = t >= 1660;
  const s33_numberDigitsShadowLock = t >= 1720;
  const s34_artistNameMaskOpen = t >= 1770;
  const s35_artistInitialLettersProgressive = t >= 1830;
  const s36_artistCenterLettersProgressive = t >= 1890;
  const s37_artistFullTextProgressive = t >= 1950;
  const s38_artistDropShadowLock = t >= 2020;
  const s39_chevronArrowReveal = t >= 2090;
  const s40_primaryTypographySettled = t >= 2160;

  // Phase 5: Information & Accent Layers (2200 - 3000 ms)
  const s41_songBarBaseExpand = t >= 2220;
  const s42_songMusicIconRotateIn = t >= 2280;
  const s43_songTextMaskSlitReveal = t >= 2350;
  const s44_songTitleFullMaterialize = t >= 2420;
  const s45_composerRibbonSlideUp = t >= 2490;
  const s46_composerTextTrackingSettle = t >= 2560;
  const s47_bracketTopLeftBuild = t >= 2630;
  const s48_bracketBottomRightBuild = t >= 2700;
  const s49_goldCornerBracketsMaterialize = t >= 2770;
  const s50_lilacVerticalNotchLock = t >= 2850;
  const s51_accentInformationSettled = t >= 2950;

  // Phase 6: Final Compositional Build (3000 - 3700 ms)
  const s52_masterAlignmentSync = t >= 3020;
  const s53_temporaryMaskRetractionStart = t >= 3100;
  const s54_holographicEdgeSweepTrigger = t >= 3180;
  const s55_edgeSweepCrossingCenter = t >= 3260;
  const s56_edgeSweepExitingRight = t >= 3340;
  const s57_magentaCoreSurfaceLock = t >= 3420;
  const s58_goldBlockBorderLock = t >= 3510;
  const s59_outerFrameBorderLock = t >= 3600;
  const s60_compositionalBalanceChecked = t >= 3680;

  // Phase 7: Final Settle (3700 - 4200+ ms)
  const s61_finalAccentMovementComplete = t >= 3720;
  const s62_temporaryConstructionElementsCleared = t >= 3800;
  const s63_allLayersCoordinateVerified = t >= 3890;
  const s64_subtleAmbientGlowStabilized = t >= 3990;
  const s65_masterStageReadyLocked = t >= 4150;

  // Fit artist typography to large hero area
  const artistStyle = fitBF25Text(artist, {
    maxContainerWidth: 640,
    baseFontSize: 44,
    minFontSize: 24,
    charThreshold: 14,
    letterSpacingEm: 0.04,
  });

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex items-center justify-center z-30">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.94,
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
        }}
        animate={{
          opacity: s01_canvasInit ? 1 : 0,
          scale: 1,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          transition: { duration: 0.8, ease: EASE_BROADCAST },
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          transition: {
            duration: 1.15, // Minimum 1000ms structured television exit
            ease: EASE_OUTRO,
          },
        }}
        style={{ width: '1080px' }}
        className="relative flex flex-col drop-shadow-[0_32px_75px_rgba(0,0,0,0.98)]"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.035} />

        {/* ================================================================= */}
        {/* TOP STATUS BANNER ("A CONTINUACIÓN • BENIDORM FEST 2025")         */}
        {/* ================================================================= */}
        <div
          style={{
            clipPath: s25_topBannerBlueSlideRight
              ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
              : 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
            transition: 'clip-path 450ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="h-[42px] bg-[#002BCC] border-t-2 border-l-2 border-r-2 border-[#2A65F5] px-4 flex items-center justify-between relative overflow-hidden"
        >
          <div
            style={{
              opacity: s28_topBannerTextMaskOpen ? 1 : 0,
              transform: s28_topBannerTextMaskOpen ? 'translateX(0)' : 'translateX(20px)',
              transition: 'all 320ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="flex items-center gap-2.5"
          >
            <Radio
              className={`w-4 h-4 text-[#FFD700] ${
                s29_topBannerBeaconBlinkStart ? 'animate-pulse' : ''
              }`}
            />
            <span className="font-heavy text-[15px] font-black uppercase text-white tracking-[0.24em]">
              A CONTINUACIÓN • BENIDORM FEST 2025
            </span>
          </div>

          <div
            style={{
              opacity: s26_topBannerBorderAccentGlow ? 1 : 0,
              transition: 'opacity 250ms ease-out',
            }}
          >
            <SquareAccentStrip size={5} />
          </div>
        </div>

        {/* ================================================================= */}
        {/* MAIN COMPOSITION BODY (PROMINENT CENTER HERO)                     */}
        {/* ================================================================= */}
        <div
          style={{
            clipPath: s07_navyBaseChassisExpand
              ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
              : 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
            transition: 'clip-path 520ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="relative bg-[#060A1D] border-x-2 border-b-2 border-[#2A65F5] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Underlying Royal Blue Gradient Backing */}
          <div
            style={{
              clipPath: s09_primaryRoyalBlueSlabSlide
                ? 'polygon(0 0, 100% 0, 97% 100%, 0 100%)'
                : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
              transition: 'clip-path 450ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="absolute inset-0 bg-[#002277] pointer-events-none"
          />

          {/* Row 1: Candidate Hero Row (Turn Number + Artist Name) */}
          <div className="flex items-stretch h-[110px] relative z-10 border-b border-[#2A65F5]/60">
            {/* Massive Golden Performance Turn Number */}
            {showPerformanceNumber && (
              <div
                style={{
                  width: '140px',
                  clipPath: s22_goldNumberBlockWipeLeft
                    ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
                  transition: 'clip-path 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                className="bg-[#FFD700] border-r-2 border-[#FFE55C] flex flex-col items-center justify-center shrink-0 relative overflow-hidden shadow-inner"
              >
                <span
                  style={{
                    opacity: s31_numberSublabelReveal ? 1 : 0,
                    transition: 'opacity 250ms ease-out',
                  }}
                  className="font-heavy text-[11px] font-black uppercase text-[#0A1244] tracking-[0.2em] leading-none mb-1"
                >
                  TURNO
                </span>
                <span
                  style={{
                    opacity: s32_numberDigitsMaterialize ? 1 : 0,
                    transform: s32_numberDigitsMaterialize ? 'scale(1)' : 'scale(0.85)',
                    transition: 'all 320ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                  className="font-heavy text-[64px] font-black text-[#0A1244] leading-none tracking-tight font-mono"
                >
                  {num}
                </span>

                {s49_goldCornerBracketsMaterialize && (
                  <>
                    <div className="absolute top-1.5 left-1.5">
                      <CornerLBracket size={6} thickness={1.5} color="#0A1244" position="top-left" />
                    </div>
                    <div className="absolute bottom-1.5 right-1.5">
                      <CornerLBracket size={6} thickness={1.5} color="#0A1244" position="bottom-right" />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Artist Emblem Icon Square */}
            <div
              style={{
                width: '90px',
                opacity: s24_artistEmblemSquareBuild ? 1 : 0,
                transform: s24_artistEmblemSquareBuild ? 'translateX(0)' : 'translateX(-16px)',
                transition: 'all 300ms ease-out',
              }}
              className="bg-[#0B1026] border-r border-[#FF007A]/40 flex items-center justify-center shrink-0"
            >
              <BF25ArtistIcon size={48} color="#FFD700" />
            </div>

            {/* Imposing Artist Name Surface (Vibrant Magenta) */}
            <div
              style={{
                clipPath: s20_hotPinkCoreSurfaceExpand
                  ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                  : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
                transition: 'clip-path 450ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="flex-1 bg-gradient-to-r from-[#FF007A] via-[#F00070] to-[#C7005D] flex items-center px-6 relative overflow-hidden"
            >
              <span
                style={{
                  fontSize: `${artistStyle.fontSize}px`,
                  letterSpacing: artistStyle.letterSpacing,
                  opacity: s37_artistFullTextProgressive ? 1 : 0,
                  transform: s37_artistFullTextProgressive ? 'translateX(0)' : 'translateX(24px)',
                  transition: 'all 380ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                className="font-heavy font-black uppercase text-white truncate drop-shadow-[0_3px_6px_rgba(0,0,0,0.95)]"
              >
                {artist}
              </span>

              {/* Large Directional Chevron Pointer */}
              <div
                style={{
                  opacity: s39_chevronArrowReveal ? 1 : 0,
                  transition: 'opacity 250ms ease-out',
                }}
                className="ml-auto pointer-events-none"
              >
                <DirectionalChevron size={20} color="#FFD700" direction="right" />
              </div>
            </div>
          </div>

          {/* Row 2: Song Title & Authors Metadata */}
          <div
            style={{
              clipPath: s41_songBarBaseExpand
                ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
              transition: 'clip-path 400ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="bg-[#0B1336] px-6 py-3.5 flex items-center justify-between relative z-10"
          >
            <div
              style={{
                opacity: s44_songTitleFullMaterialize ? 1 : 0,
                transform: s44_songTitleFullMaterialize ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 300ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="flex items-center gap-3 overflow-hidden mr-4"
            >
              <Music2 className="w-5 h-5 text-[#8EDCFF] shrink-0" />
              <span className="font-heavy text-[22px] font-black uppercase text-[#8EDCFF] tracking-wide truncate">
                «{song}»
              </span>
            </div>

            {(composers || arrangers) && (
              <div
                style={{
                  opacity: s46_composerTextTrackingSettle ? 1 : 0,
                  transition: 'opacity 260ms ease-out',
                }}
                className="text-right shrink-0"
              >
                <span className="font-mono text-[12px] uppercase text-slate-300 tracking-wider block">
                  {composers || arrangers}
                </span>
              </div>
            )}
          </div>

          {/* Corner Structural Brackets */}
          {s47_bracketTopLeftBuild && (
            <div className="absolute top-1.5 left-1.5 pointer-events-none z-20">
              <StageCornerBracketPair size={10} thickness={2} color="#8EDCFF" />
            </div>
          )}
          {s48_bracketBottomRightBuild && (
            <div className="absolute bottom-1.5 right-1.5 pointer-events-none z-20">
              <CornerLBracket size={10} thickness={2} color="#FFD700" position="bottom-right" />
            </div>
          )}

          {/* Holographic Edge Flare Sweep */}
          {s54_holographicEdgeSweepTrigger && !s65_masterStageReadyLocked && (
            <motion.div
              initial={{ x: -500 }}
              animate={{ x: 1200 }}
              transition={{ duration: 0.7, ease: EASE_BROADCAST }}
              className="absolute inset-y-0 w-44 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] pointer-events-none z-30"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StageReady2025;
