import React from 'react';
import { motion } from 'motion/react';
import { Show } from '../../../types/broadcast';
import { calculateRankings } from '../../../utils/scoringEngine';
import { ArtistEmblem2024, LiveBug2024, SAFE_RIGHT } from './Benidorm2024Primitives';

interface Top5Provisional2024Props {
  show: Show;
  title?: string;
}

const BROADCAST_EASE = [0.16, 1, 0.3, 1] as const;

export const Top5Provisional2024: React.FC<Top5Provisional2024Props> = ({
  show,
  title = 'TOP 5 PROVISIONAL',
}) => {
  const { rankedParticipants } = calculateRankings(show.participants, show.scores);
  const top5 = rankedParticipants
    .filter((r) => !r.isRemovedFromCompetition && r.category !== 'special_interval')
    .slice(0, 5);

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden pointer-events-none select-none z-20">
      {/* Positioned in bottom-right safe area */}
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.6, ease: BROADCAST_EASE }}
        style={{
          position: 'absolute',
          right: `${1920 - SAFE_RIGHT}px`,
          bottom: '74px',
          width: '460px',
        }}
        className="flex flex-col gap-2.5"
      >
        {/* Header Pill */}
        <div className="h-[44px] px-6 rounded-full bg-[#0E1342] border-2 border-[#FFD900] flex items-center justify-between shadow-[0_4px_16px_rgba(0,0,0,0.6)] mb-1">
          <span className="font-sans font-black text-[#FFD900] text-[17px] tracking-wider uppercase">
            {title}
          </span>
          <span className="font-sans font-bold text-white/80 text-[13px] uppercase">
            Benidorm Fest 2024
          </span>
        </div>

        {/* 5 Rows */}
        {top5.map((row, idx) => {
          const isLeader = idx === 0;

          return (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease: BROADCAST_EASE }}
              className={`h-[48px] rounded-full border-2 flex items-center px-4 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${
                isLeader
                  ? 'border-[#FFD900] bg-gradient-to-r from-[#2927F5] to-[#151A75] text-white shadow-[0_0_16px_rgba(255,217,0,0.4)]'
                  : 'border-white bg-[#0E1342] text-white'
              }`}
            >
              {/* Rank */}
              <div
                className={`w-[26px] h-[26px] rounded-full flex items-center justify-center font-sans font-black text-[14px] shrink-0 mr-2.5 ${
                  isLeader ? 'bg-[#FFD900] text-[#0A0E2A]' : 'bg-white/20 text-white'
                }`}
              >
                {row.position}
              </div>

              {/* Artist Emblem */}
              <div className="shrink-0 mr-3">
                <ArtistEmblem2024 artist={row.artist} size={30} />
              </div>

              {/* Artist Name */}
              <span className="font-sans font-extrabold text-[17px] text-white tracking-tight truncate flex-1 drop-shadow-sm">
                {row.artist}
              </span>

              {/* Score */}
              <div className="h-[32px] px-3.5 rounded-full bg-[#101044] border border-white/60 flex items-center justify-center shrink-0 ml-2">
                <span className="font-sans font-black text-[#FFD900] text-[16px] tabular-nums">
                  {row.totalScore}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <LiveBug2024 />
    </div>
  );
};

export default Top5Provisional2024;
