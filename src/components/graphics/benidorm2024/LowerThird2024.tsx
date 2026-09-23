import React from 'react';
import { motion } from 'motion/react';
import { Participant } from '../../../types/broadcast';
import { LiveBug2024, SAFE_LEFT } from './Benidorm2024Primitives';

export type LowerThirdMode2024 = 'artist_song' | 'one_person' | 'two_people' | 'info';

interface LowerThird2024Props {
  mode?: LowerThirdMode2024;
  participant?: Participant;
  artist?: string;
  song?: string;
  name?: string;
  role?: string;
  title?: string;
  subtitle?: string;
  person1Name?: string;
  person1Role?: string;
  person2Name?: string;
  person2Role?: string;
  showBug?: boolean;
}

const BROADCAST_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * BENIDORM FEST 2024 OFFICIAL LOWER THIRD
 * Directly matches Screenshot 2:
 * - Upper rounded container: White outline, dark navy fill, bold white artist name
 * - Lower rounded container: Shifted to the right, overlapping, magenta border, pink/magenta song title
 * - Bottom-left concentric circular radar bug
 */
export const LowerThird2024: React.FC<LowerThird2024Props> = ({
  mode = 'artist_song',
  participant,
  artist,
  song,
  name,
  role,
  title,
  subtitle,
  person1Name,
  person1Role,
  person2Name,
  person2Role,
  showBug = true,
}) => {
  const displayArtist = artist || participant?.artist || name || 'Ruth Lorenzo';
  const displaySong = song || participant?.song || subtitle || 'Dancing in the rain';

  // 1. ARTIST + SONG (Matches Screenshot 2!)
  if (mode === 'artist_song') {
    return (
      <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden pointer-events-none select-none z-30">
        <div
          style={{
            position: 'absolute',
            left: `${SAFE_LEFT + 100}px`,
            bottom: '76px',
          }}
          className="flex flex-col items-start"
        >
          {/* Upper Bar: Artist Name (Rounded capsule with white outline and navy fill) */}
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.55, ease: BROADCAST_EASE }}
            className="h-[58px] px-8 rounded-full border-2 border-white bg-[#080D2B] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.85)] z-20"
          >
            <span className="font-sans font-extrabold text-[24px] text-white tracking-wide truncate drop-shadow-md">
              {displayArtist}
            </span>
          </motion.div>

          {/* Lower Bar: Song Title (Shifted to right, nested, with magenta border) */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.55, delay: 0.15, ease: BROADCAST_EASE }}
            style={{
              marginLeft: '95px',
              marginTop: '-12px',
            }}
            className="h-[50px] px-8 rounded-full border-2 border-[#E4004F] bg-gradient-to-r from-[#200A38] via-[#101044] to-[#0A0D30] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.85)] z-10"
          >
            <span className="font-sans font-bold text-[21px] text-[#FF4081] tracking-wide truncate drop-shadow-md">
              {displaySong}
            </span>
          </motion.div>
        </div>

        {/* Live Bug in bottom-left */}
        {showBug && <LiveBug2024 />}
      </div>
    );
  }

  // 2. ONE PERSON LOWER THIRD
  if (mode === 'one_person') {
    const personName = name || artist || 'Presentador';
    const personRole = role || subtitle || 'Benidorm Fest 2024';

    return (
      <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden pointer-events-none select-none z-30">
        <div
          style={{
            position: 'absolute',
            left: `${SAFE_LEFT + 100}px`,
            bottom: '76px',
          }}
          className="flex flex-col items-start"
        >
          {/* Main Person Name Capsule */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.55, ease: BROADCAST_EASE }}
            className="h-[60px] px-9 rounded-full border-2 border-white bg-[#080D2B] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.85)] z-20"
          >
            <span className="font-sans font-extrabold text-[26px] text-white tracking-wide truncate drop-shadow-md">
              {personName}
            </span>
          </motion.div>

          {/* Subtitle / Role Capsule */}
          {personRole && (
            <motion.div
              initial={{ opacity: 0, x: -30, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.55, delay: 0.15, ease: BROADCAST_EASE }}
              style={{
                marginLeft: '80px',
                marginTop: '-12px',
              }}
              className="h-[48px] px-7 rounded-full border-2 border-[#2927F5] bg-gradient-to-r from-[#151A75] to-[#101044] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.85)] z-10"
            >
              <span className="font-sans font-extrabold text-[18px] text-[#FFD900] tracking-wide uppercase truncate drop-shadow-sm">
                {personRole}
              </span>
            </motion.div>
          )}
        </div>

        {showBug && <LiveBug2024 />}
      </div>
    );
  }

  // 3. TWO PEOPLE LOWER THIRD
  if (mode === 'two_people') {
    const p1 = person1Name || 'Presentador 1';
    const r1 = person1Role || 'Presentación';
    const p2 = person2Name || 'Presentador 2';
    const r2 = person2Role || 'Presentación';

    return (
      <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden pointer-events-none select-none z-30">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          transition={{ duration: 0.6, ease: BROADCAST_EASE }}
          style={{
            position: 'absolute',
            left: `${SAFE_LEFT + 100}px`,
            bottom: '76px',
          }}
          className="flex items-center gap-4"
        >
          {/* Person 1 */}
          <div className="h-[60px] px-8 rounded-full border-2 border-white bg-[#080D2B] flex items-center gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
            <span className="font-sans font-extrabold text-[23px] text-white tracking-wide">
              {p1}
            </span>
            <span className="font-sans font-black text-[15px] text-[#FFD900] uppercase tracking-wider">
              {r1}
            </span>
          </div>

          {/* Divider */}
          <div className="w-[18px] h-[3px] bg-white opacity-80" />

          {/* Person 2 */}
          <div className="h-[60px] px-8 rounded-full border-2 border-[#E4004F] bg-gradient-to-r from-[#200A38] to-[#101044] flex items-center gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
            <span className="font-sans font-extrabold text-[23px] text-white tracking-wide">
              {p2}
            </span>
            <span className="font-sans font-black text-[15px] text-[#23D9D2] uppercase tracking-wider">
              {r2}
            </span>
          </div>
        </motion.div>

        {showBug && <LiveBug2024 />}
      </div>
    );
  }

  // 4. INFORMATION LOWER THIRD
  const infoTitle = title || 'INFORMACIÓN';
  const infoSub = subtitle || '';

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] overflow-hidden pointer-events-none select-none z-30">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 25 }}
        transition={{ duration: 0.6, ease: BROADCAST_EASE }}
        style={{
          position: 'absolute',
          left: `${SAFE_LEFT + 100}px`,
          bottom: '76px',
        }}
        className="flex flex-col items-start"
      >
        <div className="h-[58px] px-9 rounded-full border-2 border-white bg-[#080D2B] flex items-center shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
          <span className="font-sans font-extrabold text-[24px] text-white tracking-wide">
            {infoTitle}
          </span>
          {infoSub && (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFD900] mx-4 shrink-0" />
              <span className="font-sans font-bold text-[20px] text-[#FFD900] tracking-wide">
                {infoSub}
              </span>
            </>
          )}
        </div>
      </motion.div>

      {showBug && <LiveBug2024 />}
    </div>
  );
};

export default LowerThird2024;
