import React from 'react';
import { motion } from 'motion/react';
import { Participant } from '../../../types/broadcast';
import { ArtistEmblem2024, LiveBug2024 } from './Benidorm2024Primitives';
import { Benidorm2024Background } from './Benidorm2024Background';

interface StageReady2024Props {
  participant?: Participant;
  customNumber?: number | string;
  customArtist?: string;
  customSong?: string;
  customComposers?: string;
  customArrangers?: string;
}

const BROADCAST_EASE = [0.16, 1, 0.3, 1] as const;

export const StageReady2024: React.FC<StageReady2024Props> = ({
  participant,
  customNumber,
  customArtist,
  customSong,
  customComposers,
  customArrangers,
}) => {
  const number = customNumber ?? participant?.performanceNumber ?? 1;
  const numStr = String(number).padStart(2, '0');
  const artist = customArtist || participant?.artist || 'Nebulossa';
  const song = customSong || participant?.song || 'Zorra';
  const composers = customComposers || participant?.composers || 'María Bas, Mark Dasousa';
  const arrangers = customArrangers || participant?.arrangers || '';

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden pointer-events-none select-none z-20">
      <Benidorm2024Background variant="stage_ready" />

      {/* Central Hero Composition */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Performance Order Circular Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: BROADCAST_EASE }}
          className="w-[110px] h-[110px] rounded-full border-4 border-white bg-gradient-to-br from-[#2927F5] to-[#4A1678] flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.8)] mb-8"
        >
          <span className="font-sans font-black text-white text-[52px] tabular-nums tracking-tighter">
            {numStr}
          </span>
        </motion.div>

        {/* Artist Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: BROADCAST_EASE }}
          className="mb-6 shadow-2xl"
        >
          <ArtistEmblem2024 artist={artist} size={84} />
        </motion.div>

        {/* Artist Name in Rounded White-Outlined Hero Capsule */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: BROADCAST_EASE }}
          className="h-[84px] px-14 rounded-full border-4 border-white bg-[#080D2B] flex items-center justify-center shadow-[0_16px_50px_rgba(0,0,0,0.9)] mb-5"
        >
          <h1 className="font-sans font-black text-[46px] text-white tracking-wide uppercase drop-shadow-md">
            {artist}
          </h1>
        </motion.div>

        {/* Song Title in Magenta Rounded Capsule */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: BROADCAST_EASE }}
          className="h-[68px] px-12 rounded-full border-2 border-[#E4004F] bg-gradient-to-r from-[#200A38] via-[#101044] to-[#0A0D30] flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.85)] mb-8"
        >
          <h2 className="font-sans font-black text-[34px] text-[#FF4081] tracking-wide drop-shadow-md">
            {song}
          </h2>
        </motion.div>

        {/* Composers & Arrangers Credits */}
        {(composers || arrangers) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: BROADCAST_EASE }}
            className="flex flex-col items-center gap-1.5"
          >
            {composers && (
              <p className="font-sans font-bold text-white/90 text-[18px] tracking-wide">
                <span className="text-[#FFD900] font-black uppercase text-[15px] mr-2">Música y Letra:</span>
                {composers}
              </p>
            )}
            {arrangers && (
              <p className="font-sans font-semibold text-white/70 text-[16px] tracking-wide">
                <span className="text-[#23D9D2] font-black uppercase text-[14px] mr-2">Producción:</span>
                {arrangers}
              </p>
            )}
          </motion.div>
        )}
      </div>

      <LiveBug2024 />
    </div>
  );
};

export default StageReady2024;
