import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JuryMember, Participant } from '../../types/broadcast';
import { EASE_BROADCAST, EASE_EXIT } from './primitives/BenidormPrimitives';
import { fitTextToBox } from '../../utils/textFitting';

export type LowerThirdMode =
  | 'one_person'
  | 'two_people'
  | 'artist_song'
  | 'info'
  | 'performance'
  | 'jury'
  | 'jury_dual'
  | 'announcement';

export interface LowerThirdCustomOptions {
  artistPosition?: 'top' | 'left';
  songPosition?: 'bottom' | 'right';
  showPerformanceNumber?: boolean;
  alignment?: 'left' | 'center';
  accent?: 'cyan' | 'purple' | 'coral' | 'gold';
  fontSizeScale?: 'compact' | 'standard' | 'large';
}

interface LowerThirdGraphicProps {
  mode?: LowerThirdMode;
  participant?: Participant;
  jury?: JuryMember;
  secondaryJury?: JuryMember;
  // Type 01: Two People
  person1Name?: string;
  person1Role?: string;
  person2Name?: string;
  person2Role?: string;
  // Type 02: Artist + Song
  artist?: string;
  song?: string;
  showPerformanceNumber?: boolean;
  badgeNumber?: string | number;
  descriptor?: string;
  customOptions?: LowerThirdCustomOptions;
  // Type 03: One Person
  name?: string;
  role?: string;
  // Type 04: Information
  title?: string;
  subtitle?: string;
}

/**
 * TELEVISION LOWER THIRDS PACKAGE — BENIDORM FEST OFFICIAL MASTER
 * Fixed generous television dimensions (1320px master width).
 * Substantial, centered, and mathematically symmetrical.
 * Intelligent layout recomposition: when performance number is disabled,
 * the layout seamlessly closes and expands without empty holes or placeholders.
 * Strictly Zero Fades: Geometric construction choreography.
 */
export const LowerThirdGraphic: React.FC<LowerThirdGraphicProps> = ({
  mode = 'one_person',
  participant,
  jury,
  secondaryJury,
  person1Name,
  person1Role,
  person2Name,
  person2Role,
  artist,
  song,
  showPerformanceNumber,
  badgeNumber,
  descriptor,
  customOptions,
  name,
  role,
  title,
  subtitle,
}) => {
  const resolvedMode: 'one_person' | 'two_people' | 'artist_song' | 'info' =
    mode === 'two_people' || mode === 'jury_dual'
      ? 'two_people'
      : mode === 'artist_song' || mode === 'performance'
      ? 'artist_song'
      : mode === 'info' || mode === 'announcement'
      ? 'info'
      : 'one_person';

  // =========================================================================
  // CRITICAL ARCHITECTURAL RESOLUTION OF PERFORMANCE NUMBER
  // =========================================================================
  // If showPerformanceNumber is explicitly false, or customOptions.showPerformanceNumber is false,
  // or badgeNumber is explicitly empty string '', the number is strictly DISABLED.
  const isNumberDisabled =
    showPerformanceNumber === false ||
    customOptions?.showPerformanceNumber === false ||
    badgeNumber === '';

  const shouldShowNumber = !isNumberDisabled && (
    showPerformanceNumber === true ||
    customOptions?.showPerformanceNumber === true ||
    (badgeNumber !== undefined && badgeNumber !== null && badgeNumber !== '') ||
    (participant?.performanceNumber !== undefined && badgeNumber === undefined)
  );

  const resolvedBadgeNumber: string | undefined = shouldShowNumber
    ? (badgeNumber !== undefined && badgeNumber !== null && badgeNumber !== ''
        ? String(badgeNumber).padStart(2, '0')
        : participant?.performanceNumber
        ? String(participant.performanceNumber).padStart(2, '0')
        : '01')
    : undefined;

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-end pb-16 px-24 z-30">
      <div className="relative w-full flex flex-col items-center justify-center">
        {resolvedMode === 'two_people' && (
          <TwoPeopleLowerThird
            person1Name={person1Name || jury?.name || 'RUTH LORENZO'}
            person1Role={person1Role || jury?.title || 'PRESENTADORA'}
            person2Name={person2Name || secondaryJury?.name || 'MARC CALDERÓ'}
            person2Role={person2Role || secondaryJury?.title || 'PRESENTADOR'}
          />
        )}

        {resolvedMode === 'artist_song' && (
          <ArtistSongLowerThird
            artist={artist || participant?.name || participant?.artist || title || 'NEBULOSSA'}
            song={song || participant?.song || subtitle || 'ZORRA'}
            showNumber={Boolean(shouldShowNumber && resolvedBadgeNumber)}
            badgeNumber={resolvedBadgeNumber}
            descriptor={descriptor}
            customOptions={customOptions}
          />
        )}

        {resolvedMode === 'one_person' && (
          <OnePersonLowerThird
            name={name || title || jury?.name || participant?.name || 'MARTA GARCÍA'}
            role={role || subtitle || jury?.title || 'PORTAVOZ DEL JURADO'}
          />
        )}

        {resolvedMode === 'info' && (
          <InfoLowerThird
            title={title || 'BENIDORM'}
            subtitle={subtitle || 'PALAU D\'ESPORTS L\'ILLA DE BENIDORM'}
          />
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   TYPE 01: TWO PEOPLE LOWER THIRD (BENIDORM FEST MASTER)
   Symmetrical, visually balanced dual presentation with central divider beam.
   Substantial fixed width: 1360px.
   Matching RTVE broadcast screenshot 2.
   Strictly Zero Fades.
   ========================================================================= */
const TwoPeopleLowerThird: React.FC<{
  person1Name: string;
  person1Role: string;
  person2Name: string;
  person2Role: string;
}> = ({ person1Name, person1Role, person2Name, person2Role }) => {
  const p1NameStyle = fitTextToBox(person1Name, { baseFontSize: 30, minFontSize: 18, charThreshold: 18, targetWidthPx: 450 });
  const p1RoleStyle = fitTextToBox(person1Role, { baseFontSize: 17, minFontSize: 13, charThreshold: 26, targetWidthPx: 450 });
  const p2NameStyle = fitTextToBox(person2Name, { baseFontSize: 30, minFontSize: 18, charThreshold: 18, targetWidthPx: 450 });
  const p2RoleStyle = fitTextToBox(person2Role, { baseFontSize: 17, minFontSize: 13, charThreshold: 26, targetWidthPx: 450 });

  return (
    <motion.div
      initial={{
        clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
        y: 40,
      }}
      animate={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        y: 0,
      }}
      exit={{
        clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
        y: 35,
        transition: { duration: 0.35, ease: EASE_EXIT },
      }}
      transition={{ duration: 0.52, ease: EASE_BROADCAST }}
      className="relative w-[1150px] flex items-center justify-between drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] select-none mx-auto"
    >
      {/* Structural midnight navy backing container */}
      <div className="absolute inset-0 chamfer-slant bg-[#060915] border-y border-purple-500/40 -z-10 shadow-2xl" />

      {/* PERSON 01: Left balanced module */}
      <div className="flex-1 w-[550px] px-8 py-3.5 flex flex-col justify-center">
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.08, duration: 0.45, ease: EASE_BROADCAST }}
            className="flex items-center gap-3"
          >
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 chamfer-slant shrink-0" />
            <span
              style={p1NameStyle}
              className="font-heavy font-black uppercase text-white truncate drop-shadow-md"
            >
              {person1Name}
            </span>
          </motion.div>
        </div>

        <div className="overflow-hidden mt-1 pl-6">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.16, duration: 0.45, ease: EASE_BROADCAST }}
          >
            <span
              style={p1RoleStyle}
              className="font-broadcast font-bold text-cyan-300 uppercase block truncate tracking-wider"
            >
              {person1Role}
            </span>
          </motion.div>
        </div>
      </div>

      {/* CENTRAL VISUAL DIVIDER AXIS */}
      <div className="relative w-[6px] h-[74px] flex items-center justify-center shrink-0">
        <div className="w-[2px] h-full bg-gradient-to-b from-cyan-400 via-purple-400 to-transparent skew-x-[-20deg]" />
        <div className="absolute w-2.5 h-2.5 bg-cyan-400 transform rotate-45 shadow-[0_0_10px_rgba(0,229,255,0.9)]" />
      </div>

      {/* PERSON 02: Right balanced module */}
      <div className="flex-1 w-[550px] px-8 py-3.5 flex flex-col justify-center">
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.12, duration: 0.45, ease: EASE_BROADCAST }}
            className="flex items-center gap-3"
          >
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-sky-400 chamfer-slant shrink-0" />
            <span
              style={p2NameStyle}
              className="font-heavy font-black uppercase text-white truncate drop-shadow-md"
            >
              {person2Name}
            </span>
          </motion.div>
        </div>

        <div className="overflow-hidden mt-1 pl-6">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.45, ease: EASE_BROADCAST }}
          >
            <span
              style={p2RoleStyle}
              className="font-broadcast font-bold text-purple-300 uppercase block truncate tracking-wider"
            >
              {person2Role}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Directional bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{ delay: 0.22, duration: 0.5, ease: EASE_BROADCAST }}
        className="absolute -bottom-[2px] inset-x-4 h-[3px] bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.8)] origin-center"
      />
    </motion.div>
  );
};

/* =========================================================================
   TYPE 02: ARTIST + SONG LOWER THIRD (AUTHENTIC BENIDORM FEST MASTER)
   Matching Screenshot 1 (Captura de pantalla 2026-09-12 220207.png).
   Fixed generous television template: w-[1320px], centered horizontally.
   Intelligently recomposes when performance number is disabled:
   - When Number is ON: [ACT. 03] [ARTIST (Cyan)] [SONG (Purple)]
   - When Number is OFF: [ARTIST (Cyan)] [SONG (Purple)] (50% / 50% split)
   - NEVER leaves an empty gap, placeholder, or awkward void!
   - On-Air update choreography: Number retracts geometrically, remaining blocks
     smoothly expand and recompose without remounting or full IN replay.
   Strictly Zero Fades.
   ========================================================================= */
const ArtistSongLowerThird: React.FC<{
  artist: string;
  song: string;
  showNumber: boolean;
  badgeNumber?: string | number;
  descriptor?: string;
  customOptions?: LowerThirdCustomOptions;
}> = ({ artist, song, showNumber, badgeNumber, descriptor, customOptions }) => {
  const accent = customOptions?.accent || 'cyan';
  const fontSizeScale = customOptions?.fontSizeScale || 'standard';

  const baseArtistSize =
    fontSizeScale === 'large' ? 44 : fontSizeScale === 'compact' ? 32 : 38;
  const baseSongSize =
    fontSizeScale === 'large' ? 36 : fontSizeScale === 'compact' ? 24 : 30;

  const artistStyle = fitTextToBox(artist, {
    baseFontSize: baseArtistSize,
    minFontSize: 18,
    charThreshold: 16,
    targetWidthPx: showNumber ? 460 : 520,
  });

  const songStyle = fitTextToBox(song, {
    baseFontSize: baseSongSize,
    minFontSize: 16,
    charThreshold: 18,
    targetWidthPx: showNumber ? 460 : 520,
  });

  const accentBorder =
    accent === 'coral'
      ? 'from-rose-500 via-red-500 to-purple-600'
      : accent === 'gold'
      ? 'from-amber-400 via-yellow-300 to-amber-500'
      : accent === 'purple'
      ? 'from-purple-500 via-indigo-400 to-purple-600'
      : 'from-cyan-400 via-sky-300 to-purple-600';

  return (
    <motion.div
      initial={{
        clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
        y: 40,
      }}
      animate={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        y: 0,
      }}
      exit={{
        clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
        y: 35,
        transition: { duration: 0.35, ease: EASE_EXIT },
      }}
      transition={{ duration: 0.52, ease: EASE_BROADCAST }}
      className="relative w-[1150px] flex flex-col items-center drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] select-none mx-auto"
    >
      {/* Optional Top Secondary Descriptor Bar (Centered symmetrically) */}
      {descriptor && (
        <div className="overflow-hidden mb-1">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.35, ease: EASE_BROADCAST }}
            className="chamfer-slant bg-gradient-to-r from-[#180b33] via-[#2d1259] to-[#180b33] px-8 py-1 border-t border-purple-400/50 shadow-lg"
          >
            <span className="chamfer-unslant block font-broadcast text-[13px] font-bold text-cyan-300 uppercase tracking-widest text-center">
              {descriptor}
            </span>
          </motion.div>
        </div>
      )}

      {/* Main Structural Compound Bar (Fixed 1320px width, 80px height) */}
      <div className="relative w-full flex items-stretch h-[80px] chamfer-slant bg-[#050814] border-y-2 border-purple-500/40 shadow-2xl overflow-hidden">
        
        {/* OPTIONAL PERFORMANCE NUMBER BADGE
            Retracts geometrically with 0 width when disabled: NO EMPTY HOLE! */}
        <AnimatePresence initial={false}>
          {showNumber && badgeNumber && (
            <motion.div
              key="perf-number-block"
              layout
              initial={{
                width: 0,
                scaleX: 0,
                clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
              }}
              animate={{
                width: 120,
                scaleX: 1,
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              }}
              exit={{
                width: 0,
                scaleX: 0,
                clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
              }}
              transition={{ duration: 0.38, ease: EASE_BROADCAST }}
              className="h-full bg-[#070b1e] border-r-2 border-cyan-400 flex items-center justify-center shrink-0 z-30 overflow-hidden origin-left"
            >
              <div className="w-[120px] flex flex-col items-center justify-center chamfer-unslant px-2">
                <span className="text-[10px] font-mono font-black text-cyan-300 uppercase tracking-widest leading-tight">
                  ACT.
                </span>
                <span className="font-heavy font-mono-num text-[36px] font-black text-white leading-none tracking-tight drop-shadow">
                  {String(badgeNumber).padStart(2, '0')}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PRIMARY ARTIST BLOCK (Electric Turquoise / Cyan matching Screenshot 1)
            Uses motion.div layout to smoothly expand to 50% when number is omitted */}
        <motion.div
          layout
          transition={{ duration: 0.4, ease: EASE_BROADCAST }}
          className="flex-1 h-full bg-gradient-to-r from-[#00e5ff] via-[#12d6eb] to-[#00b4d8] px-8 flex items-center justify-center relative overflow-hidden z-20"
        >
          {/* Subtle inner linear highlight */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-white/40 pointer-events-none" />

          <div className="overflow-hidden w-full text-center">
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.08, duration: 0.44, ease: EASE_BROADCAST }}
              style={artistStyle}
              className="chamfer-unslant block font-heavy font-black uppercase text-black leading-none truncate tracking-wider drop-shadow-sm"
            >
              {artist}
            </motion.span>
          </div>
        </motion.div>

        {/* Angled Center Seam Separator */}
        <div className="w-[3px] h-full bg-gradient-to-b from-white via-cyan-300 to-purple-400 skew-x-[-20deg] shrink-0 z-30 shadow-[0_0_8px_rgba(255,255,255,0.7)]" />

        {/* SECONDARY SONG BLOCK (Royal Purple / Violet matching Screenshot 1)
            Uses motion.div layout to smoothly expand to 50% when number is omitted */}
        <motion.div
          layout
          transition={{ duration: 0.4, ease: EASE_BROADCAST }}
          className="flex-1 h-full bg-gradient-to-r from-[#591ba8] via-[#6d28d9] to-[#4c1d95] px-8 flex items-center justify-center relative overflow-hidden z-10"
        >
          {/* Subtle inner linear highlight */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-purple-300/40 pointer-events-none" />

          <div className="overflow-hidden w-full text-center">
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.14, duration: 0.44, ease: EASE_BROADCAST }}
              style={songStyle}
              className="chamfer-unslant block font-heavy font-bold uppercase text-white leading-none truncate tracking-wide drop-shadow-md"
            >
              «{song}»
            </motion.span>
          </div>
        </motion.div>

        {/* Top subtle sheen highlight line across entire container */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent pointer-events-none z-40" />
      </div>

      {/* Symmetrical Bottom Directional Accent Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{ delay: 0.22, duration: 0.5, ease: EASE_BROADCAST }}
        className={`w-full h-[4px] bg-gradient-to-r ${accentBorder} shadow-[0_0_14px_rgba(0,229,255,0.9)] origin-center mt-1.5`}
      />
    </motion.div>
  );
};

/* =========================================================================
   TYPE 03: ONE PERSON LOWER THIRD (BENIDORM FEST MASTER)
   Symmetrical compound construction: Name on upper purple bar, Role on lower cyan bar.
   Substantial fixed width: 1240px, centered horizontally.
   Flanked by bilateral geometric chevrons.
   Strictly Zero Fades.
   ========================================================================= */
const OnePersonLowerThird: React.FC<{
  name: string;
  role: string;
}> = ({ name, role }) => {
  const nameStyle = fitTextToBox(name, { baseFontSize: 36, minFontSize: 20, charThreshold: 18 });
  const roleStyle = fitTextToBox(role, { baseFontSize: 22, minFontSize: 13, charThreshold: 26 });

  return (
    <motion.div
      initial={{
        clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
        y: 40,
      }}
      animate={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        y: 0,
      }}
      exit={{
        clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
        y: 35,
        transition: { duration: 0.35, ease: EASE_EXIT },
      }}
      transition={{ duration: 0.52, ease: EASE_BROADCAST }}
      className="relative w-[1150px] flex flex-col items-center drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] select-none mx-auto"
    >
      {/* Upper Royal Purple Name Bar (Centered, 1150px) */}
      <div className="relative w-[1150px] h-[68px] chamfer-slant bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#4c1d95] px-12 flex items-center justify-center shadow-2xl border-y-2 border-purple-300/50 z-20">
        {/* Left Bilateral Chevron Accent */}
        <div className="absolute left-4 w-4 h-4 bg-cyan-400 transform rotate-45 shadow-[0_0_8px_rgba(0,229,255,0.8)]" />

        <div className="overflow-hidden w-full text-center">
          <motion.span
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.08, duration: 0.44, ease: EASE_BROADCAST }}
            style={nameStyle}
            className="chamfer-unslant block font-heavy font-black text-white uppercase truncate tracking-wide drop-shadow-md"
          >
            {name}
          </motion.span>
        </div>

        {/* Right Bilateral Chevron Accent */}
        <div className="absolute right-4 w-4 h-4 bg-cyan-400 transform rotate-45 shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
      </div>

      {/* Lower Offset Electric Cyan Role Bar (Centered, 980px) */}
      <div className="relative w-[980px] h-[46px] chamfer-slant bg-gradient-to-r from-[#00e5ff] via-[#22d3ee] to-[#00b4d8] px-10 -mt-1.5 flex items-center justify-center shadow-xl border-y border-cyan-100/70 z-10">
        {/* Left Small Diamond Accent */}
        <div className="absolute left-4 w-2.5 h-2.5 bg-purple-900 transform rotate-45" />

        <div className="overflow-hidden w-full text-center">
          <motion.span
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.16, duration: 0.44, ease: EASE_BROADCAST }}
            style={roleStyle}
            className="chamfer-unslant block font-broadcast font-bold text-black uppercase tracking-wider truncate"
          >
            {role}
          </motion.span>
        </div>

        {/* Right Small Diamond Accent */}
        <div className="absolute right-4 w-2.5 h-2.5 bg-purple-900 transform rotate-45" />
      </div>

      {/* Symmetrical Directional Guide Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{ delay: 0.24, duration: 0.5, ease: EASE_BROADCAST }}
        className="w-[980px] h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-1 shadow-[0_0_10px_rgba(0,229,255,0.9)] origin-center"
      />
    </motion.div>
  );
};

/* =========================================================================
   TYPE 04: INFORMATION LOWER THIRD (BENIDORM FEST MASTER)
   Fixed generous television template: w-[1200px], centered horizontally.
   TITLE + SUBTITLE with bilateral geometric wing accents.
   Strictly Zero Fades.
   ========================================================================= */
const InfoLowerThird: React.FC<{
  title: string;
  subtitle?: string;
}> = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{
        clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
        y: 40,
      }}
      animate={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        y: 0,
      }}
      exit={{
        clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
        y: 35,
        transition: { duration: 0.35, ease: EASE_EXIT },
      }}
      transition={{ duration: 0.52, ease: EASE_BROADCAST }}
      className="relative w-[1150px] flex items-stretch h-[76px] chamfer-slant bg-[#070b18] border-y-2 border-purple-500/40 shadow-2xl drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] select-none overflow-hidden mx-auto"
    >
      {/* Left Symmetrical Cyan Accent Block */}
      <div className="w-[54px] h-full bg-cyan-400 flex items-center justify-center shrink-0 z-20">
        <span className="w-3.5 h-3.5 bg-black transform rotate-45" />
      </div>

      {/* Primary Title Bar */}
      <div className="h-full bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#591ba8] px-10 flex items-center justify-center border-r-2 border-cyan-400/50 z-10 shrink-0">
        <div className="overflow-hidden">
          <motion.span
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.08, duration: 0.44, ease: EASE_BROADCAST }}
            className="chamfer-unslant block font-heavy text-[26px] md:text-[28px] font-black tracking-widest text-white uppercase whitespace-nowrap drop-shadow"
          >
            {title}
          </motion.span>
        </div>
      </div>

      {/* Secondary Subtitle Bar (Expanded across remainder of container) */}
      <div className="flex-1 h-full px-8 flex items-center justify-center bg-[#0a0f26]">
        <div className="overflow-hidden w-full text-center">
          <motion.span
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.16, duration: 0.44, ease: EASE_BROADCAST }}
            className="chamfer-unslant block font-broadcast text-[19px] font-bold text-cyan-300 uppercase tracking-wider truncate"
          >
            {subtitle || 'BENIDORM FEST'}
          </motion.span>
        </div>
      </div>

      {/* Right Symmetrical Cyan Accent Block */}
      <div className="w-[54px] h-full bg-cyan-400 flex items-center justify-center shrink-0 z-20">
        <span className="w-3.5 h-3.5 bg-black transform rotate-45" />
      </div>

      {/* Symmetrical Bottom Accent Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{ delay: 0.22, duration: 0.5, ease: EASE_BROADCAST }}
        className="absolute -bottom-[1px] inset-x-0 h-[3px] bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.9)] origin-center"
      />
    </motion.div>
  );
};
