import React from 'react';
import { motion } from 'motion/react';
import { Show } from '../../../types/broadcast';
import { calculateRankings } from '../../../utils/scoringEngine';
import { ArtistEmblem2024, LiveBug2024, SAFE_LEFT, SAFE_RIGHT, SAFE_TOP, SAFE_BOTTOM } from './Benidorm2024Primitives';
import { Benidorm2024Background } from './Benidorm2024Background';

interface Classification2024Props {
  show: Show;
  title?: string;
  subtitle?: string;
}

const BROADCAST_EASE = [0.16, 1, 0.3, 1] as const;

export const Classification2024: React.FC<Classification2024Props> = ({
  show,
  title = 'Clasificación General',
  subtitle = 'Gran Final Benidorm Fest 2024',
}) => {
  const { rankedParticipants } = calculateRankings(show.participants, show.scores);
  const activeRanking = rankedParticipants.filter(
    (r) => !r.isRemovedFromCompetition && r.category !== 'special_interval'
  );

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden pointer-events-none select-none z-20">
      <Benidorm2024Background variant="classification" />

      {/* Main Container within safe areas */}
      <div
        style={{
          position: 'absolute',
          left: `${SAFE_LEFT}px`,
          right: `${1920 - SAFE_RIGHT}px`,
          top: `${SAFE_TOP + 40}px`,
          bottom: `${1080 - SAFE_BOTTOM}px`,
        }}
        className="flex flex-col"
      >
        {/* Header: Connected Capsules */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: BROADCAST_EASE }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            {/* Title Pill */}
            <div className="h-[54px] px-9 rounded-full bg-[#0E1342] border-2 border-white flex items-center shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
              <span className="font-sans font-extrabold text-white text-[24px] tracking-wide">
                {title}
              </span>
            </div>

            {/* Connecting Line */}
            <div className="w-8 h-[2px] bg-white opacity-80" />

            {/* Subtitle Pill */}
            <div className="h-[54px] px-8 rounded-full bg-[#0E1342] border-2 border-[#FFD900] flex items-center shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
              <span className="font-sans font-black text-[#FFD900] text-[22px] tracking-wide uppercase">
                {subtitle}
              </span>
            </div>
          </div>

          {/* Edition Tag */}
          <div className="h-[46px] px-6 rounded-full bg-[#151A75]/90 border border-white/40 flex items-center">
            <span className="font-sans font-bold text-white text-[16px] tracking-widest uppercase">
              3ª Edición
            </span>
          </div>
        </motion.div>

        {/* Classification Table Grid */}
        <div className="flex-1 flex flex-col gap-3">
          {activeRanking.map((row, index) => {
            const isLeader = index === 0;

            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: BROADCAST_EASE,
                }}
                className={`h-[68px] rounded-full border-2 flex items-center px-6 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.5)] ${
                  isLeader
                    ? 'border-[#FFD900] bg-gradient-to-r from-[#2927F5]/90 via-[#151A75] to-[#4A1678]/80 shadow-[0_0_24px_rgba(255,217,0,0.35)]'
                    : 'border-white/80 bg-[#0E1342]/90 hover:border-white'
                }`}
              >
                {/* Position Badge */}
                <div
                  className={`w-[44px] h-[44px] rounded-full flex items-center justify-center font-sans font-black text-[22px] shrink-0 mr-4 shadow-md ${
                    isLeader
                      ? 'bg-[#FFD900] text-[#0A0E2A]'
                      : 'bg-white/10 text-white border border-white/40'
                  }`}
                >
                  {row.position}
                </div>

                {/* Artist Emblem */}
                <div className="shrink-0 mr-4">
                  <ArtistEmblem2024 artist={row.artist} size={44} />
                </div>

                {/* Artist & Song */}
                <div className="flex-1 flex items-baseline gap-4 min-w-0 pr-4">
                  <span className="font-sans font-extrabold text-[24px] text-white tracking-tight truncate drop-shadow-sm">
                    {row.artist}
                  </span>
                  <span className="font-sans font-bold text-[19px] text-[#FF4081] truncate">
                    {row.song}
                  </span>
                </div>

                {/* Total Score Capsule */}
                <div className="h-[48px] px-7 rounded-full bg-[#101044] border-2 border-white flex items-center justify-center shrink-0 shadow-inner">
                  <span className="font-sans font-black text-[#FFD900] text-[24px] tabular-nums tracking-tight">
                    {row.totalScore} <span className="text-[14px] text-white/70 ml-1 font-bold">PTS</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <LiveBug2024 />
    </div>
  );
};

export default Classification2024;
