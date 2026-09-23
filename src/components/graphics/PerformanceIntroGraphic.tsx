import React from 'react';
import { motion } from 'motion/react';
import { Participant } from '../../types/broadcast';
import { BenidormBug, GeometricChevrons } from './primitives/BenidormPrimitives';

interface PerformanceIntroGraphicProps {
  participant?: Participant;
  showPerformanceNumber?: boolean;
  customNumber?: string;
  customArtist?: string;
  customSong?: string;
  customComposers?: string;
  customArrangers?: string;
}

export const PerformanceIntroGraphic: React.FC<PerformanceIntroGraphicProps> = ({
  participant,
  showPerformanceNumber,
  customNumber,
  customArtist,
  customSong,
  customComposers,
  customArrangers,
}) => {
  const isNumberDisabled =
    showPerformanceNumber === false || customNumber === '';

  const shouldShowNumber = !isNumberDisabled && (
    showPerformanceNumber === true ||
    (customNumber !== undefined && customNumber !== '') ||
    (participant?.performanceNumber !== undefined)
  );

  const num = shouldShowNumber
    ? (customNumber ||
      (participant?.performanceNumber ? String(participant.performanceNumber).padStart(2, '0') : '01'))
    : undefined;
  const artistName = customArtist || participant?.name || participant?.artist || 'MAYO';
  const songName = customSong || participant?.song || 'Tócame';
  const composers =
    customComposers || participant?.composers || 'Álvaro Mayo, Rose Molina, Raúl Gómez';
  const arrangers = customArrangers || participant?.arrangers || 'Mike Wit, Álvaro Mayo';

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none overflow-hidden z-30">
      
      {/* =========================================================================
          LAYER 01 & 02: ATMOSPHERIC DEEP STAGE BACKGROUND & LIGHT BEAMS
          ========================================================================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-[#09041a]/92"
      >
        {/* Dynamic stage glow gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(109,40,217,0.35)_0%,_rgba(15,3,35,0.85)_70%,_#09041a_100%)]" />
        
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Diagonal light rays */}
        <motion.div
          animate={{ opacity: [0.15, 0.35, 0.15], rotate: [-15, -12, -15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 left-1/4 w-[600px] h-[1400px] bg-gradient-to-b from-cyan-400/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], rotate: [15, 18, 15] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -top-40 right-1/4 w-[600px] h-[1400px] bg-gradient-to-b from-purple-500/25 via-pink-600/10 to-transparent blur-3xl pointer-events-none"
        />
      </motion.div>

      {/* =========================================================================
          LAYER 03 & 04: GEOMETRIC DIRECTIONAL UPWARD CHEVRONS & ARROWS
          ========================================================================= */}
      {/* Left chevron flight */}
      <div className="absolute left-16 top-1/4 flex flex-col items-center gap-6 opacity-40">
        <GeometricChevrons count={4} size="lg" color="cyan" animated={true} />
      </div>

      {/* Right chevron flight */}
      <div className="absolute right-16 top-1/4 flex flex-col items-center gap-6 opacity-40">
        <GeometricChevrons count={4} size="lg" color="purple" animated={true} />
      </div>

      {/* Center ascending chevron accent above typography */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.8, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute top-16 inset-x-0 flex justify-center"
      >
        <GeometricChevrons count={2} size="md" color="gold" animated={true} />
      </motion.div>

      {/* =========================================================================
          LAYER 05 - 15: CENTER COMPOSITION — MASSIVE TYPOGRAPHY & FRAMES
          ========================================================================= */}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-24 z-30">
        
        {/* Massive Centered Card Module */}
        <div className="relative w-full max-w-6xl flex flex-col items-center text-center">
          
          {/* LAYER 05: Performance Number Badge in Chamfered Diamond Box (Omitted if disabled) */}
          {shouldShowNumber && num && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2, y: -60 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-3"
            >
              {/* Left accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="w-32 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-white origin-right"
              />

              {/* Performance Number Slanted Pill */}
              <div className="chamfer-slant bg-gradient-to-r from-[#0d1338] via-[#1a2158] to-[#0d1338] border-2 border-cyan-400 px-8 py-2 shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                <span className="chamfer-unslant block font-heavy font-mono-num text-[44px] font-black tracking-widest text-cyan-200 leading-none">
                  {num}
                </span>
              </div>

              {/* Right accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="w-32 h-[2px] bg-gradient-to-l from-transparent via-cyan-400 to-white origin-left"
              />
            </motion.div>
          )}

          {/* LAYER 06 & 07: HUGE ARTIST NAME (e.g. MAYO / NEBULOSSA) Matching Screenshot 3 */}
          <div className="relative overflow-hidden py-2 px-8">
            <motion.h1
              initial={{ opacity: 0, y: 120, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -100, scale: 1.05 }}
              transition={{ delay: 0.22, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="font-heavy font-black text-[160px] tracking-tight text-white uppercase leading-[0.88] drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
            >
              {artistName}
            </motion.h1>

            {/* Light sweep highlight over the huge typography */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ delay: 0.8, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] pointer-events-none"
            />
          </div>

          {/* LAYER 08: Song Title Bar with Chamfered Cyan/Purple Accents */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ delay: 0.38, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mt-1 mb-10"
          >
            <div className="w-12 h-1 bg-cyan-400 chamfer-slant" />
            <h2 className="font-broadcast text-[52px] font-semibold text-slate-100 tracking-wide drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]">
              {songName}
            </h2>
            <div className="w-12 h-1 bg-purple-400 chamfer-slant" />
          </motion.div>

          {/* LAYER 09 - 14: 3-COLUMN BROADCAST CREDITS PANEL Matching Screenshot 3 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ delay: 0.5, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl chamfer-slant bg-gradient-to-r from-[#0c0a22]/90 via-[#18113e]/90 to-[#0c0a22]/90 border border-purple-400/30 px-12 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
          >
            {/* Travelling sheen highlight on panel */}
            <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-sheen pointer-events-none" />

            <div className="chamfer-unslant grid grid-cols-3 gap-8 text-left">
              
              {/* Column 1: Intérprete */}
              <div className="border-r border-purple-500/20 pr-4">
                <span className="block font-broadcast text-[16px] uppercase tracking-widest text-cyan-300 font-bold mb-1">
                  Intérprete
                </span>
                <span className="block font-broadcast text-[22px] font-bold text-white leading-tight">
                  {participant?.artist || artistName}
                </span>
              </div>

              {/* Column 2: Compositores */}
              <div className="border-r border-purple-500/20 pr-4">
                <span className="block font-broadcast text-[16px] uppercase tracking-widest text-purple-300 font-bold mb-1">
                  Compositores
                </span>
                <span className="block font-broadcast text-[19px] font-medium text-slate-200 leading-snug">
                  {composers}
                </span>
              </div>

              {/* Column 3: Arreglos */}
              <div>
                <span className="block font-broadcast text-[16px] uppercase tracking-widest text-purple-300 font-bold mb-1">
                  Arreglos
                </span>
                <span className="block font-broadcast text-[19px] font-medium text-slate-200 leading-snug">
                  {arrangers}
                </span>
              </div>

            </div>
          </motion.div>

        </div>

      </div>

      {/* Bottom Horizontal Accent Beam (Screen Width) */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-12 inset-x-20 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(0,229,255,0.9)]"
      />

    </div>
  );
};
