import React from 'react';
import { motion } from 'motion/react';
import { Show } from '../../../types/broadcast';
import { ArtistEmblem2024, LiveBug2024 } from './Benidorm2024Primitives';

interface VoteReveal2024Props {
  show: Show;
  activeReveal?: any;
}

const BROADCAST_EASE = [0.16, 1, 0.3, 1] as const;

export const VoteReveal2024: React.FC<VoteReveal2024Props> = ({ show, activeReveal }) => {
  const reveal = activeReveal || show.activeReveal;
  if (!reveal) return null;

  const participant = show.participants.find((p) => p.id === reveal.participantId);
  const artistName = reveal.recipientName || participant?.artist || 'Artista';
  const points = reveal.pointsAwarded ?? 0;
  const isHigh = reveal.isHighScore || points >= 12;

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden pointer-events-none select-none z-30">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.55, ease: BROADCAST_EASE }}
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '84px',
          transform: 'translateX(-50%)',
        }}
        className="flex items-center gap-3.5"
      >
        {/* Recipient Capsule */}
        <div
          className={`h-[64px] px-8 rounded-full border-2 flex items-center gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.85)] ${
            isHigh
              ? 'border-[#FFD900] bg-gradient-to-r from-[#2927F5] via-[#4A1678] to-[#101044] shadow-[0_0_28px_rgba(255,217,0,0.5)]'
              : 'border-white bg-[#0E1342]'
          }`}
        >
          <ArtistEmblem2024 artist={artistName} size={42} />
          <span className="font-sans font-extrabold text-[24px] text-white tracking-wide truncate max-w-[420px]">
            {artistName}
          </span>
        </div>

        {/* Points Awarded Capsule */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.15, 1] }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="h-[64px] px-7 rounded-full border-2 border-white bg-[#101044] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.85)]"
        >
          <span className="font-sans font-black text-[#FFD900] text-[30px] tabular-nums tracking-tight">
            +{points} <span className="text-[16px] text-white/80 font-bold ml-1">PUNTOS</span>
          </span>
        </motion.div>
      </motion.div>

      <LiveBug2024 />
    </div>
  );
};

export default VoteReveal2024;
