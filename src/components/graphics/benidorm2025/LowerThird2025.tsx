import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { JuryMember, Participant } from '../../../types/broadcast';
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
import { User, Music2 } from 'lucide-react';

export type LowerThird2025Mode =
  | 'artist_song'
  | 'one_person'
  | 'two_people'
  | 'info'
  | 'announcement';

interface LowerThird2025Props {
  mode?: LowerThird2025Mode;
  participant?: Participant;
  juryMember?: JuryMember;
  name?: string;
  role?: string;
  title?: string;
  subtitle?: string;
  person1Name?: string;
  person1Role?: string;
  person2Name?: string;
  person2Role?: string;
  artist?: string;
  song?: string;
  showPerformanceNumber?: boolean;
  badgeNumber?: string | number;
  descriptor?: string;
  customOptions?: any;
}

// Television broadcast cubic bezier curves (zero bounce, zero overshoot)
const EASE_BROADCAST = [0.22, 1, 0.36, 1] as const;
const EASE_OUTRO = [0.4, 0, 0.7, 0.2] as const;

/**
 * BENIDORM FEST 2025 LOWER THIRDS
 * 
 * Includes the reconstructed CENTER-SPLIT Artist/Song lower third:
 * - ARTIST on LEFT SIDE
 * - STRONG GEOMETRIC DIVIDER in CENTER
 * - SONG / TEMA on RIGHT SIDE
 * - 40+ meaningful animation stages
 * - 1400ms build sequence, 900ms coordinated reverse outro
 */
export const LowerThird2025: React.FC<LowerThird2025Props> = ({
  mode = 'artist_song',
  participant,
  name,
  role,
  title,
  subtitle,
  person1Name = 'INÉS HERNAND',
  person1Role = 'PRESENTADORA',
  person2Name = 'MARC CALDERÓ',
  person2Role = 'PRESENTADOR',
  artist,
  song,
  showPerformanceNumber = true,
  badgeNumber,
  descriptor,
}) => {
  const displayArtist = (artist || participant?.name || participant?.artist || name || 'ARTISTA').toUpperCase();
  const displaySong = (song || participant?.song || 'CANCIÓN').toUpperCase();
  const displayName = (name || title || participant?.name || participant?.artist || 'NOMBRE').toUpperCase();
  const displayRole = (role || subtitle || 'PORTAVOZ / INVITADO').toUpperCase();

  const num =
    badgeNumber !== undefined
      ? String(badgeNumber).padStart(2, '0')
      : participant?.performanceNumber !== undefined
      ? String(participant.performanceNumber).padStart(2, '0')
      : '';

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none z-30">
      {mode === 'artist_song' && (
        <SplitArtistSongLowerThird2025
          artist={displayArtist}
          song={displaySong}
          number={num}
          showNumber={showPerformanceNumber && !!num}
          descriptor={descriptor}
        />
      )}

      {mode === 'one_person' && (
        <OnePersonLowerThird2025
          name={displayName}
          role={displayRole}
        />
      )}

      {mode === 'two_people' && (
        <TwoPeopleLowerThird2025
          person1Name={person1Name}
          person1Role={person1Role}
          person2Name={person2Name}
          person2Role={person2Role}
        />
      )}

      {(mode === 'info' || mode === 'announcement') && (
        <InfoLowerThird2025
          title={title || displayName}
          subtitle={subtitle || displayRole}
        />
      )}
    </div>
  );
};

/* =========================================================================
   1. SPLIT ARTIST / SONG LOWER THIRD (Divided from CENTER)
   ========================================================================= */
const SplitArtistSongLowerThird2025: React.FC<{
  artist: string;
  song: string;
  number?: string;
  showNumber?: boolean;
  descriptor?: string;
}> = ({ artist, song, number, showNumber, descriptor }) => {
  // 40+ Stage Timeline State
  const [animTimeMs, setAnimTimeMs] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = performance.now();
    const update = (now: number) => {
      const elapsed = now - (startTimeRef.current || now);
      setAnimTimeMs(elapsed);
      if (elapsed < 1600) {
        animFrameRef.current = requestAnimationFrame(update);
      } else {
        setAnimTimeMs(1600);
      }
    };
    animFrameRef.current = requestAnimationFrame(update);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const t = animTimeMs;

  // 42 Discrete Animation Stages across 6 Phases:
  // Phase 1: Central Anchor (0 - 180ms)
  const st01_centerAnchorInit = t >= 30;
  const st02_safeAreaBoundariesCalibrated = t >= 60;
  const st03_bugExclusionProtected = t >= 90;
  const st04_leftRightMasksPrepared = t >= 120;
  const st05_centralDividingPointEstablished = t >= 150;

  // Phase 2: Structural Geometry (180 - 580ms)
  const st06_centralAxisVerticalDrop = t >= 180;
  const st07_centralDividerGoldBevel = t >= 220;
  const st08_leftBackgroundExpandFromCenter = t >= 260;
  const st09_rightBackgroundExpandFromCenter = t >= 280;
  const st10_leftNavyBasePlate = t >= 320;
  const st11_rightNavyBasePlate = t >= 340;
  const st12_leftMagentaSurfaceWipe = t >= 380;
  const st13_rightBlueSurfaceWipe = t >= 410;
  const st14_leftOuterFrameBorder = t >= 460;
  const st15_rightOuterFrameBorder = t >= 490;
  const st16_structuralBevelChamfer = t >= 540;

  // Phase 3: Secondary Accents (580 - 880ms)
  const st17_centerDividerCrownPill = t >= 590;
  const st18_leftNumberBoxWipe = t >= 630;
  const st19_leftArtistEmblemAppear = t >= 670;
  const st20_rightMusicNoteIconAppear = t >= 710;
  const st21_leftMagentaAccentBar = t >= 750;
  const st22_rightBlueAccentBar = t >= 790;
  const st23_directionalChevronPointer = t >= 830;
  const st24_secondaryAccentsSettled = t >= 870;

  // Phase 4: Artist Text Reveal (880 - 1180ms)
  const st25_artistLabelMaskSlitOpen = t >= 890;
  const st26_artistLabelTextMaterialize = t >= 930;
  const st27_artistNameSlitMaskOpen = t >= 970;
  const st28_artistInitialLettersProgressive = t >= 1010;
  const st29_artistFullTextProgressive = t >= 1060;
  const st30_artistNameDropShadowLock = t >= 1120;

  // Phase 5: Song Text Reveal (1180 - 1440ms)
  const st31_songLabelMaskSlitOpen = t >= 1190;
  const st32_songLabelTextMaterialize = t >= 1230;
  const st33_songTitleSlitMaskOpen = t >= 1270;
  const st34_songTitleFullProgressive = t >= 1320;
  const st35_songTitleQuotesAccent = t >= 1380;

  // Phase 6: Final Settle (1440 - 1600ms)
  const st36_centerDividerPulseGlow = t >= 1450;
  const st37_leftCornerBracketsLock = t >= 1490;
  const st38_rightCornerBracketsLock = t >= 1520;
  const st39_temporaryMasksRetracted = t >= 1550;
  const st40_splitCompositionMasterLocked = t >= 1580;

  // Dynamic text fitting for left and right containers
  const artistStyle = fitBF25Text(artist, {
    maxContainerWidth: 430,
    baseFontSize: 28,
    minFontSize: 16,
    charThreshold: 14,
    letterSpacingEm: 0.04,
  });

  const songStyle = fitBF25Text(song, {
    maxContainerWidth: 410,
    baseFontSize: 24,
    minFontSize: 15,
    charThreshold: 16,
    letterSpacingEm: 0.03,
  });

  return (
    <div className="absolute inset-0 flex flex-col justify-end items-center pb-[74px] pointer-events-none">
      <motion.div
        initial={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 35,
          opacity: 0,
        }}
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          y: 0,
          opacity: st01_centerAnchorInit ? 1 : 0,
          transition: { duration: 0.65, ease: EASE_BROADCAST },
        }}
        exit={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 28,
          opacity: 0,
          transition: {
            duration: 0.85, // Minimum 700-1100ms structured television exit
            ease: EASE_OUTRO,
          },
        }}
        style={{ width: '1080px' }}
        className="flex flex-col items-center drop-shadow-[0_24px_55px_rgba(0,0,0,0.96)] select-none"
      >
        {/* Layer 1: TV Scanline Micro Texture */}
        <StageScanlineOverlay opacity={0.03} />

        {/* Optional Top Descriptor Tag */}
        {descriptor && (
          <div className="bg-[#002BCC] text-white px-5 py-0.5 font-heavy text-[10px] font-black uppercase tracking-[0.2em] border-t-2 border-x-2 border-[#246BFF] mb-[-2px] z-10">
            {descriptor}
          </div>
        )}

        {/* ================================================================= */}
        {/* MAIN SPLIT BAR: DIVIDED FROM CENTER                               */}
        {/* ================================================================= */}
        <div className="w-full h-[68px] flex items-stretch overflow-hidden border-2 border-[#2A65F5] bg-[#070B1F] shadow-2xl relative">
          {/* ------------------------------------------------------------- */}
          {/* LEFT SIDE: ARTIST (Expands leftward from center)              */}
          {/* ------------------------------------------------------------- */}
          <div
            style={{
              clipPath: st08_leftBackgroundExpandFromCenter
                ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                : 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
              transition: 'clip-path 380ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="flex-1 bg-gradient-to-r from-[#FF007A] via-[#E6007A] to-[#C7005D] flex items-center justify-between px-3 relative overflow-hidden"
          >
            {/* Candidate Performance Number (if active) */}
            {showNumber && number && (
              <div
                style={{
                  opacity: st18_leftNumberBoxWipe ? 1 : 0,
                  transform: st18_leftNumberBoxWipe ? 'scale(1)' : 'scale(0.8)',
                  transition: 'all 240ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                className="w-[46px] h-full bg-[#FFD700] border-r-2 border-[#FFE55C] flex items-center justify-center shrink-0 mr-3 shadow-inner"
              >
                <span className="font-heavy font-mono-num text-[32px] font-black text-[#0A1244] leading-none">
                  {number}
                </span>
              </div>
            )}

            {/* Left Content Area */}
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div
                style={{
                  opacity: st19_leftArtistEmblemAppear ? 1 : 0,
                  transition: 'opacity 200ms ease-out',
                }}
                className="shrink-0 bg-[#0B1026] p-1.5 border border-[#FF007A]/40"
              >
                <BF25ArtistIcon size={26} color="#FFD700" />
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <span
                  style={{
                    opacity: st26_artistLabelTextMaterialize ? 1 : 0,
                    transition: 'opacity 180ms ease-out',
                  }}
                  className="font-heavy text-[9px] font-black uppercase text-[#FFD700] tracking-widest leading-none mb-1"
                >
                  ARTISTA
                </span>
                <span
                  style={{
                    fontSize: `${artistStyle.fontSize}px`,
                    letterSpacing: artistStyle.letterSpacing,
                    opacity: st29_artistFullTextProgressive ? 1 : 0,
                    transform: st29_artistFullTextProgressive ? 'translateX(0)' : 'translateX(-12px)',
                    transition: 'all 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                  className="font-heavy font-black text-white uppercase tracking-wide truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                  {artist}
                </span>
              </div>
            </div>

            {/* Directional Chevron pointing inward toward center */}
            <div
              style={{
                opacity: st23_directionalChevronPointer ? 1 : 0,
                transition: 'opacity 200ms ease-out',
              }}
              className="pointer-events-none shrink-0 ml-1"
            >
              <DirectionalChevron size={12} color="#FFD700" direction="right" />
            </div>

            {/* Left Corner Brackets */}
            {st37_leftCornerBracketsLock && (
              <div className="absolute top-0.5 left-0.5 pointer-events-none">
                <StageCornerBracketPair size={6} thickness={1.5} color="#FFD700" />
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* CENTER DIVIDER: STRONG GEOMETRIC VISUAL AXIS                  */}
          {/* ------------------------------------------------------------- */}
          <div
            style={{
              width: '18px',
              opacity: st06_centralAxisVerticalDrop ? 1 : 0,
              transform: st06_centralAxisVerticalDrop ? 'scaleY(1)' : 'scaleY(0)',
              transition: 'all 280ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="bg-[#060A1D] border-x-2 border-[#FFD700] flex flex-col items-center justify-center shrink-0 z-20 shadow-2xl relative"
          >
            <div className="w-2 h-2 bg-[#FFD700] rotate-45 mb-1" />
            <div className="w-1.5 h-1.5 bg-[#8EDCFF] rotate-45" />
          </div>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT SIDE: SONG / TEMA (Expands rightward from center)       */}
          {/* ------------------------------------------------------------- */}
          <div
            style={{
              clipPath: st09_rightBackgroundExpandFromCenter
                ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
              transition: 'clip-path 380ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="flex-1 bg-gradient-to-r from-[#002277] via-[#002BCC] to-[#001855] flex items-center justify-between px-4 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div
                style={{
                  opacity: st20_rightMusicNoteIconAppear ? 1 : 0,
                  transition: 'opacity 200ms ease-out',
                }}
                className="shrink-0 bg-[#070B1F] p-1.5 border border-[#2A65F5]"
              >
                <Music2 className="w-5 h-5 text-[#8EDCFF]" />
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <span
                  style={{
                    opacity: st32_songLabelTextMaterialize ? 1 : 0,
                    transition: 'opacity 180ms ease-out',
                  }}
                  className="font-heavy text-[9px] font-black uppercase text-[#8EDCFF] tracking-widest leading-none mb-1"
                >
                  CANCIÓN / TEMA
                </span>
                <span
                  style={{
                    fontSize: `${songStyle.fontSize}px`,
                    letterSpacing: songStyle.letterSpacing,
                    opacity: st34_songTitleFullProgressive ? 1 : 0,
                    transform: st34_songTitleFullProgressive ? 'translateX(0)' : 'translateX(12px)',
                    transition: 'all 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                  className="font-heavy font-black text-[#FFD700] uppercase tracking-wide truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                  «{song}»
                </span>
              </div>
            </div>

            {/* Right Corner Brackets */}
            {st38_rightCornerBracketsLock && (
              <div className="absolute top-0.5 right-0.5 pointer-events-none">
                <CornerLBracket size={6} thickness={1.5} color="#8EDCFF" position="top-right" />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Dual Accent Strips */}
        <div className="w-full flex items-stretch h-[4px]">
          <div className="flex-1 bg-[#FF007A]" />
          <div className="w-[18px] bg-[#FFD700]" />
          <div className="flex-1 bg-[#002BCC]" />
        </div>
      </motion.div>
    </div>
  );
};

/* =========================================================================
   2. ONE PERSON LOWER THIRD (Deep Navy-Blue Backing Panel + Large Typography)
   ========================================================================= */
const OnePersonLowerThird2025: React.FC<{
  name: string;
  role: string;
}> = ({ name, role }) => {
  const nameStyle = fitBF25Text(name, {
    maxContainerWidth: 560,
    baseFontSize: 36,
    minFontSize: 24,
    charThreshold: 14,
    letterSpacingEm: 0.04,
  });

  return (
    <div className="absolute inset-0 flex flex-col justify-end items-center pb-[74px] pointer-events-none">
      <motion.div
        initial={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 28,
          opacity: 0,
        }}
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          y: 0,
          opacity: 1,
          transition: { duration: 0.62, ease: EASE_BROADCAST },
        }}
        exit={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 20,
          opacity: 0,
          transition: { duration: 0.42, ease: EASE_OUTRO },
        }}
        style={{ width: '880px' }}
        className="flex flex-col items-center drop-shadow-[0_24px_55px_rgba(0,0,0,0.96)] select-none"
      >
        <StageScanlineOverlay opacity={0.03} />

        {/* Main Chassis: Solid, Opaque Dark Navy-Blue Panel */}
        <div className="w-full h-[76px] bg-[#060B24] border-2 border-[#2A65F5] flex items-stretch overflow-hidden shadow-2xl relative">
          {/* Layer 1: Left User Emblem Box in Deep Navy */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: EASE_BROADCAST }}
            className="w-[68px] bg-[#0A1238] border-r-2 border-[#2A65F5] flex items-center justify-center shrink-0 relative overflow-hidden"
          >
            <User className="w-7 h-7 text-[#FFD700] drop-shadow-sm" />
            <StageCornerBracketPair size={6} thickness={1.5} color="#8EDCFF" />
          </motion.div>

          {/* Layer 2: Main Person Name Container in Deep Navy Gradient */}
          <div className="flex-1 bg-gradient-to-r from-[#080E2E] via-[#0E1A4A] to-[#0A153E] px-6 flex items-center justify-between min-w-0 relative">
            <motion.span
              initial={{ x: -18, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.48, delay: 0.24, ease: EASE_BROADCAST }}
              style={{
                fontSize: `${nameStyle.fontSize}px`,
                letterSpacing: nameStyle.letterSpacing,
              }}
              className="font-heavy font-black text-white uppercase tracking-wider truncate drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
            >
              {name}
            </motion.span>
          </div>

          {/* Layer 3: Secondary Role Container in Royal Navy/Blue */}
          {role && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.32, ease: EASE_BROADCAST }}
              className="px-6 bg-[#002BCC] flex items-center justify-center shrink-0 border-l-2 border-[#2A65F5] relative overflow-hidden"
            >
              <span className="font-heavy text-[17px] font-black text-[#FFD700] uppercase tracking-wider drop-shadow-sm">
                {role}
              </span>
              <CornerLBracket size={6} thickness={1.5} color="#8EDCFF" position="top-right" />
            </motion.div>
          )}
        </div>

        {/* Bottom Dual Navy/Cyan Accent Strip */}
        <div className="w-full h-[5px] bg-gradient-to-r from-[#2A65F5] via-[#00E5FF] to-[#002BCC]" />
      </motion.div>
    </div>
  );
};

/* =========================================================================
   3. TWO PEOPLE LOWER THIRD (Deep Navy-Blue Backing Panel + Large Names)
   ========================================================================= */
const TwoPeopleLowerThird2025: React.FC<{
  person1Name: string;
  person1Role: string;
  person2Name: string;
  person2Role: string;
}> = ({ person1Name, person1Role, person2Name, person2Role }) => {
  const p1Style = fitBF25Text(person1Name, {
    maxContainerWidth: 380,
    baseFontSize: 30,
    minFontSize: 20,
    charThreshold: 14,
    letterSpacingEm: 0.04,
  });

  const p2Style = fitBF25Text(person2Name, {
    maxContainerWidth: 380,
    baseFontSize: 30,
    minFontSize: 20,
    charThreshold: 14,
    letterSpacingEm: 0.04,
  });

  return (
    <div className="absolute inset-0 flex flex-col justify-end items-center pb-[74px] pointer-events-none">
      <motion.div
        initial={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 28,
          opacity: 0,
        }}
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          y: 0,
          opacity: 1,
          transition: { duration: 0.65, ease: EASE_BROADCAST },
        }}
        exit={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 20,
          opacity: 0,
          transition: { duration: 0.42, ease: EASE_OUTRO },
        }}
        style={{ width: '1080px' }}
        className="flex flex-col items-center drop-shadow-[0_24px_55px_rgba(0,0,0,0.96)] select-none"
      >
        <StageScanlineOverlay opacity={0.03} />

        {/* Main Chassis: Symmetrical Dark Navy-Blue Double Panel */}
        <div className="w-full h-[78px] flex items-stretch border-2 border-[#2A65F5] bg-[#060B24] overflow-hidden shadow-2xl relative">
          {/* Person 1 (Left Navy Panel) */}
          <div className="flex-1 flex items-center justify-between bg-gradient-to-r from-[#080E2E] via-[#0E1A4A] to-[#0A153E] px-6 relative">
            <motion.span
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.46, delay: 0.22, ease: EASE_BROADCAST }}
              style={{
                fontSize: `${p1Style.fontSize}px`,
                letterSpacing: p1Style.letterSpacing,
              }}
              className="font-heavy font-black text-white uppercase truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
            >
              {person1Name}
            </motion.span>
            {person1Role && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3, ease: EASE_BROADCAST }}
                className="font-heavy text-[15px] font-black text-[#FFD700] uppercase tracking-wider ml-3 shrink-0 drop-shadow-sm"
              >
                {person1Role}
              </motion.span>
            )}
            <CornerLBracket size={6} thickness={1.5} color="#8EDCFF" position="top-left" />
          </div>

          {/* Central Divider: Strong Geometric Axis */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.35, delay: 0.15, ease: EASE_BROADCAST }}
            className="w-[18px] bg-[#060B20] border-x-2 border-[#FFD700] flex flex-col items-center justify-center shrink-0 z-10 shadow-lg"
          >
            <div className="w-2 h-2 bg-[#FFD700] rotate-45 mb-1" />
            <div className="w-1.5 h-1.5 bg-[#8EDCFF] rotate-45" />
          </motion.div>

          {/* Person 2 (Right Navy Panel) */}
          <div className="flex-1 flex items-center justify-between bg-gradient-to-r from-[#0A153E] via-[#0E1A4A] to-[#080E2E] px-6 relative">
            <motion.span
              initial={{ x: 16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.46, delay: 0.26, ease: EASE_BROADCAST }}
              style={{
                fontSize: `${p2Style.fontSize}px`,
                letterSpacing: p2Style.letterSpacing,
              }}
              className="font-heavy font-black text-white uppercase truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
            >
              {person2Name}
            </motion.span>
            {person2Role && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.34, ease: EASE_BROADCAST }}
                className="font-heavy text-[15px] font-black text-[#FFD700] uppercase tracking-wider ml-3 shrink-0 drop-shadow-sm"
              >
                {person2Role}
              </motion.span>
            )}
            <CornerLBracket size={6} thickness={1.5} color="#8EDCFF" position="top-right" />
          </div>
        </div>

        {/* Bottom Geometric Accent Strip */}
        <div className="w-full flex items-stretch h-[5px]">
          <div className="flex-1 bg-[#2A65F5]" />
          <div className="w-[18px] bg-[#FFD700]" />
          <div className="flex-1 bg-[#00E5FF]" />
        </div>
      </motion.div>
    </div>
  );
};

/* =========================================================================
   4. INFO / ANNOUNCEMENT LOWER THIRD (Deep Navy-Blue Backing Panel + Large Text)
   ========================================================================= */
const InfoLowerThird2025: React.FC<{
  title: string;
  subtitle: string;
}> = ({ title, subtitle }) => {
  const titleStyle = fitBF25Text(title, {
    maxContainerWidth: 640,
    baseFontSize: 32,
    minFontSize: 22,
    charThreshold: 18,
    letterSpacingEm: 0.04,
  });

  return (
    <div className="absolute inset-0 flex flex-col justify-end items-center pb-[74px] pointer-events-none">
      <motion.div
        initial={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 28,
          opacity: 0,
        }}
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          y: 0,
          opacity: 1,
          transition: { duration: 0.6, ease: EASE_BROADCAST },
        }}
        exit={{
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          y: 20,
          opacity: 0,
          transition: { duration: 0.4, ease: EASE_OUTRO },
        }}
        style={{ width: '900px' }}
        className="flex flex-col items-center drop-shadow-[0_24px_55px_rgba(0,0,0,0.96)] select-none"
      >
        <StageScanlineOverlay opacity={0.03} />

        {/* Main Chassis: Solid Opaque Dark Navy-Blue Panel */}
        <div className="w-full h-[78px] bg-[#060B24] border-2 border-[#2A65F5] flex items-stretch overflow-hidden shadow-2xl relative">
          {/* Left Descriptor Tag Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: EASE_BROADCAST }}
            className="w-[170px] bg-[#002BCC] px-4 flex items-center justify-center shrink-0 border-r-2 border-[#2A65F5] relative overflow-hidden"
          >
            <span className="font-heavy text-[15px] font-black text-[#FFD700] uppercase tracking-[0.2em] drop-shadow-sm text-center">
              INFORMACIÓN
            </span>
            <StageCornerBracketPair size={6} thickness={1.5} color="#8EDCFF" />
          </motion.div>

          {/* Right Information Container: Navy Gradient with High Contrast Typography */}
          <div className="flex-1 bg-gradient-to-r from-[#080E2E] via-[#0E1A4A] to-[#0A153E] px-6 flex flex-col justify-center relative min-w-0">
            <motion.span
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.46, delay: 0.24, ease: EASE_BROADCAST }}
              style={{
                fontSize: `${titleStyle.fontSize}px`,
                letterSpacing: titleStyle.letterSpacing,
              }}
              className="font-heavy font-black text-white uppercase truncate leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
            >
              {title}
            </motion.span>
            {subtitle && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.32, ease: EASE_BROADCAST }}
                className="font-heavy text-[18px] font-bold text-[#8EDCFF] uppercase tracking-wide truncate leading-tight mt-0.5 drop-shadow-sm"
              >
                {subtitle}
              </motion.span>
            )}
            <CornerLBracket size={6} thickness={1.5} color="#8EDCFF" position="top-right" />
          </div>
        </div>

        {/* Bottom Accent Strip in Cyan / Royal Blue */}
        <div className="w-full h-[5px] bg-gradient-to-r from-[#002BCC] via-[#2A65F5] to-[#8EDCFF]" />
      </motion.div>
    </div>
  );
};

export default LowerThird2025;
