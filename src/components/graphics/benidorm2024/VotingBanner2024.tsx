import React from 'react';
import { motion } from 'motion/react';
import { Participant } from '../../../types/broadcast';
import { ArtistEmblem2024, LiveBug2024, SAFE_LEFT } from './Benidorm2024Primitives';

interface VotingBanner2024Props {
  participant?: Participant;
  customKeyword?: string;
  customPhone?: string;
  customArtist?: string;
  customSong?: string;
}

const BROADCAST_EASE = [0.16, 1, 0.3, 1] as const;

export const VotingBanner2024: React.FC<VotingBanner2024Props> = ({
  participant,
  customKeyword,
  customPhone,
  customArtist,
  customSong,
}) => {
  const artist = customArtist || participant?.artist || 'Nebulossa';
  const song = customSong || participant?.song || 'Zorra';
  const keyword = customKeyword || participant?.smsKeyword || 'VOTA NEBULOSSA';
  const phone = customPhone || participant?.phone || '905 810 008';

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden pointer-events-none select-none z-30">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.55, ease: BROADCAST_EASE }}
        style={{
          position: 'absolute',
          left: `${SAFE_LEFT + 100}px`,
          bottom: '76px',
        }}
        className="flex items-center gap-3.5"
      >
        {/* Artist + Song Capsule */}
        <div className="h-[62px] px-7 rounded-full border-2 border-white bg-[#080D2B] flex items-center gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
          <ArtistEmblem2024 artist={artist} size={40} />
          <div className="flex flex-col">
            <span className="font-sans font-extrabold text-[20px] text-white tracking-wide truncate max-w-[280px]">
              {artist}
            </span>
            <span className="font-sans font-bold text-[16px] text-[#FF4081] truncate max-w-[280px]">
              {song}
            </span>
          </div>
        </div>

        {/* SMS Voting Capsule */}
        <div className="h-[62px] px-7 rounded-full border-2 border-[#23D9D2] bg-gradient-to-r from-[#151A75] to-[#101044] flex items-center gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
          <span className="font-sans font-black text-[#23D9D2] text-[15px] uppercase tracking-wider">SMS:</span>
          <span className="font-sans font-black text-white text-[22px] tracking-wide">
            {keyword}
          </span>
          <span className="font-sans font-black text-[#FFD900] text-[17px] ml-1">AL 25152</span>
        </div>

        {/* Phone Voting Capsule */}
        <div className="h-[62px] px-7 rounded-full border-2 border-[#FFD900] bg-gradient-to-r from-[#200A38] to-[#101044] flex items-center gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
          <span className="font-sans font-black text-[#FFD900] text-[15px] uppercase tracking-wider">LLAMA:</span>
          <span className="font-sans font-black text-white text-[22px] tabular-nums tracking-wide">
            {phone}
          </span>
        </div>
      </motion.div>

      <LiveBug2024 />
    </div>
  );
};

export default VotingBanner2024;
