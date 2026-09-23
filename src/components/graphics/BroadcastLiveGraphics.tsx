import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GraphicType, Participant, Show } from '../../types/broadcast';
import { EASE_BROADCAST, ChamferedBar, DirectionalLine } from './primitives/BenidormPrimitives';
import { fitTextToBox } from '../../utils/textFitting';

interface BroadcastLiveGraphicsProps {
  type: GraphicType;
  props?: Record<string, any>;
  show?: Show;
  participant?: Participant;
}

/**
 * MASTER BROADCAST & LIVE GRAPHICS MODULE
 * Symmetrical, television-grade live indicators, studio rooms, clocks, identifiers, and transitions.
 * Strictly adheres to Benidorm Fest visual language:
 * - Chamfered slants
 * - Cyan & Royal Purple / Obsidian / Gold palette
 * - Directional wipes & masked reveals — ZERO FADES
 * - Broadcast safe margins (1920x1080)
 */
export const BroadcastLiveGraphics: React.FC<BroadcastLiveGraphicsProps> = ({
  type,
  props: inputProps,
  show,
  participant,
}) => {
  const props: Record<string, any> = inputProps || {};
  // Clock state for real-time broadcast clocks
  const [currentTime, setCurrentTime] = useState<string>(() => {
    const d = new Date();
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  const [countdownSeconds, setCountdownSeconds] = useState<number>(props.countdown || 30);

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (type.includes('countdown')) {
      const cdTimer = setInterval(() => {
        setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(cdTimer);
    }
  }, [type]);

  // Format countdown mm:ss
  const formatCountdown = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const festivalName = props.festivalName || show?.stageTitle || 'BENIDORM FEST';

  // 1. REPLAY / SLOW MOTION / LIVE + REPLAY
  if (type === 'replay' || type === 'slow_motion' || type === 'live_replay') {
    const label =
      type === 'slow_motion'
        ? 'CÁMARA LENTA'
        : type === 'live_replay'
        ? 'REPETICIÓN DIRECTO'
        : 'REPETICIÓN';
    const speed = props.speed || (type === 'slow_motion' ? '0.5x' : '1.0x');

    return (
      <div className="absolute top-12 left-16 z-30 pointer-events-none select-none">
        <motion.div
          initial={{
            x: -80,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          }}
          animate={{
            x: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
          exit={{
            x: -80,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          }}
          transition={{ duration: 0.45, ease: EASE_BROADCAST }}
          className="flex items-center drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
        >
          {/* Animated Replay Indicator Icon */}
          <div className="chamfer-slant bg-rose-600 border-y border-rose-300 px-3.5 py-2 flex items-center justify-center">
            <div className="chamfer-unslant flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <span className="font-mono text-[11px] font-black text-white tracking-wider uppercase">
                REC
              </span>
            </div>
          </div>

          {/* Main Label Chamfered Bar */}
          <div className="chamfer-slant -ml-1 bg-gradient-to-r from-[#0d1230] via-[#1a144b] to-[#0d1230] border-y border-cyan-400/80 px-6 py-2 flex items-center gap-3">
            <span className="chamfer-unslant font-heavy text-base font-black tracking-widest text-cyan-200 uppercase">
              {label}
            </span>
            <div className="chamfer-unslant w-1 h-3.5 bg-cyan-400 skew-x-[-22deg]" />
            <span className="chamfer-unslant font-mono text-xs font-bold text-slate-300">
              {speed}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. CAMERA IDENTIFIER / SHOT IDENTIFIER
  if (type === 'camera_identifier' || type === 'shot_identifier') {
    const camName = props.cameraName || props.title || 'CÁMARA 01 — GRÚA PRINCIPAL';
    const operator = props.operator || props.subtitle || 'SEÑAL ENLACE HD';

    return (
      <div className="absolute top-12 left-16 z-30 pointer-events-none select-none">
        <motion.div
          initial={{
            y: -40,
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          }}
          animate={{
            y: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
          exit={{
            y: -40,
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          }}
          transition={{ duration: 0.42, ease: EASE_BROADCAST }}
          className="flex items-center drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
        >
          <div className="chamfer-slant bg-cyan-500 text-black px-3.5 py-1.5 font-mono text-xs font-black tracking-wider">
            <span className="chamfer-unslant">CAM</span>
          </div>
          <div className="chamfer-slant -ml-1 bg-[#0b0e27]/95 border-y border-cyan-400 px-5 py-1.5 flex items-center gap-3">
            <span className="chamfer-unslant font-heavy text-sm font-black text-white uppercase tracking-wider">
              {camName}
            </span>
            <span className="chamfer-unslant font-mono text-[10px] text-cyan-300 tracking-wider">
              • {operator}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. STUDIO ROOMS: BACKSTAGE / GREEN ROOM / JURY ROOM / VOTING ROOM / LIVE LOCATION
  if (
    type === 'backstage' ||
    type === 'green_room' ||
    type === 'jury_room' ||
    type === 'voting_room' ||
    type === 'live_location'
  ) {
    const roomTitle =
      props.title ||
      (type === 'backstage'
        ? 'BACKSTAGE — ZONA TÉCNICA'
        : type === 'green_room'
        ? 'GREEN ROOM — SALA DE ARTISTAS'
        : type === 'jury_room'
        ? 'SALA DE DELIBERACIÓN DEL JURADO'
        : type === 'voting_room'
        ? 'CENTRO DE CONTROL DE VOTACIONES'
        : 'EN DIRECTO DESDE BENIDORM');

    const roomSubtitle =
      props.subtitle ||
      (type === 'green_room'
        ? 'PALAU D\'ESPORTS L\'ILLA'
        : type === 'jury_room'
        ? 'JURADO PROFESIONAL NACIONAL E INTERNACIONAL'
        : 'RTVE PRODUCCIÓN EN VIVO');

    return (
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none">
        <motion.div
          initial={{
            scaleX: 0,
            clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          }}
          animate={{
            scaleX: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
          exit={{
            scaleX: 0,
            clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
          }}
          transition={{ duration: 0.52, ease: EASE_BROADCAST }}
          className="flex flex-col items-center drop-shadow-[0_16px_36px_rgba(0,0,0,0.9)] origin-center"
        >
          <div className="flex items-center">
            {/* Left Accent */}
            <div className="w-10 h-1 bg-gradient-to-r from-transparent to-cyan-400" />

            {/* Central Capsule */}
            <div className="chamfer-slant bg-gradient-to-r from-[#0d1230] via-[#1a144b] to-[#0d1230] border-y-2 border-cyan-400 px-8 py-2.5 flex items-center gap-4">
              <div className="chamfer-unslant flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff]" />
                <span className="font-heavy text-base font-black tracking-widest text-white uppercase">
                  {roomTitle}
                </span>
                <div className="w-1 h-4 bg-purple-400 skew-x-[-22deg]" />
                <span className="font-broadcast text-xs font-bold tracking-wider text-purple-200 uppercase">
                  {roomSubtitle}
                </span>
              </div>
            </div>

            {/* Right Accent */}
            <div className="w-10 h-1 bg-gradient-to-l from-transparent to-cyan-400" />
          </div>
        </motion.div>
      </div>
    );
  }

  // 4. PROGRAMME CLOCK / SEGMENT CLOCK / SHOW COUNTDOWN / PERFORMANCE COUNTDOWN
  if (
    type === 'programme_clock' ||
    type === 'segment_clock' ||
    type === 'show_countdown' ||
    type === 'performance_countdown'
  ) {
    const isCd = type.includes('countdown');
    const clockLabel =
      props.label ||
      (type === 'programme_clock'
        ? 'HORA OFICIAL EMISIÓN'
        : type === 'segment_clock'
        ? 'DURACIÓN BLOQUE'
        : type === 'show_countdown'
        ? 'COMIENZO DE GALA'
        : 'TIEMPO RESTANTE ACTUACIÓN');

    const displayValue = isCd ? formatCountdown(countdownSeconds) : currentTime;

    return (
      <div className="absolute top-12 right-16 z-30 pointer-events-none select-none">
        <motion.div
          initial={{
            x: 80,
            clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
          }}
          animate={{
            x: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
          exit={{
            x: 80,
            clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
          }}
          transition={{ duration: 0.48, ease: EASE_BROADCAST }}
          className="flex items-center drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
        >
          <div className="chamfer-slant bg-gradient-to-r from-[#0d1230] to-[#1a144b] border-y border-purple-400/80 px-4 py-2 flex flex-col items-end">
            <span className="chamfer-unslant font-mono text-[9px] font-bold tracking-widest text-purple-300 uppercase">
              {clockLabel}
            </span>
            <span className="chamfer-unslant font-heavy font-mono-num text-xl font-black text-white tracking-widest leading-none mt-0.5">
              {displayValue}
            </span>
          </div>
          <div className="chamfer-slant -ml-1 bg-purple-600 text-white px-3 py-3.5 flex items-center justify-center border-y border-purple-300">
            <span className="chamfer-unslant font-mono text-[10px] font-black">
              {isCd ? 'T-MIN' : 'UTC+1'}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // 5. ACT IDENTIFIER / ROUND IDENTIFIER / SEMIFINAL IDENTIFIER / FINAL IDENTIFIER
  if (
    type === 'act_identifier' ||
    type === 'round_identifier' ||
    type === 'semifinal_identifier' ||
    type === 'final_identifier'
  ) {
    const stageName =
      props.stageName ||
      (type === 'final_identifier'
        ? 'GRAN FINAL'
        : type === 'semifinal_identifier'
        ? 'PRIMERA SEMIFINAL'
        : type === 'round_identifier'
        ? 'RONDA DE ACTUACIONES'
        : 'ACTUACIONES EN COMPETICIÓN');

    const descriptor = props.descriptor || 'BENIDORM FEST 2026 • RTVE';

    return (
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none">
        <motion.div
          initial={{
            clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
            y: -30,
          }}
          animate={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            y: 0,
          }}
          exit={{
            clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
            y: -30,
          }}
          transition={{ duration: 0.54, ease: EASE_BROADCAST }}
          className="flex flex-col items-center drop-shadow-[0_16px_36px_rgba(0,0,0,0.9)]"
        >
          {/* Top Golden Accent */}
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent mb-1" />

          <div className="chamfer-slant bg-gradient-to-r from-[#0d1230] via-[#1a144b] to-[#0d1230] border-y-2 border-amber-300/80 px-10 py-3 flex flex-col items-center">
            <span className="chamfer-unslant font-heavy text-2xl font-black tracking-widest text-amber-300 uppercase leading-tight">
              {stageName}
            </span>
            <span className="chamfer-unslant font-broadcast text-xs font-bold tracking-widest text-slate-300 uppercase mt-0.5">
              {descriptor}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // 6. BREAK IN / BREAK OUT / COMING BACK / NEXT SEGMENT / TEASE
  if (
    type === 'break_in' ||
    type === 'break_out' ||
    type === 'coming_back' ||
    type === 'next_segment' ||
    type === 'tease'
  ) {
    const teaseText =
      props.title ||
      (type === 'coming_back'
        ? 'VOLVEMOS EN BREVE'
        : type === 'break_in'
        ? 'PAUSA PUBLICITARIA'
        : type === 'break_out'
        ? 'REGRESAMOS A BENIDORM'
        : type === 'next_segment'
        ? 'A CONTINUACIÓN: VOTACIÓN POPULAR'
        : 'EN EL PRÓXIMO BLOQUE: RECUENTO FINAL');

    const teaseSub = props.subtitle || 'BENIDORM FEST • PALAU D\'ESPORTS';

    return (
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none">
        <motion.div
          initial={{
            clipPath: 'polygon(50% 100%, 50% 100%, 50% 100%, 50% 100%)',
            y: 40,
          }}
          animate={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            y: 0,
          }}
          exit={{
            clipPath: 'polygon(50% 100%, 50% 100%, 50% 100%, 50% 100%)',
            y: 40,
          }}
          transition={{ duration: 0.54, ease: EASE_BROADCAST }}
          className="flex flex-col items-center drop-shadow-[0_16px_36px_rgba(0,0,0,0.9)]"
        >
          <div className="chamfer-slant bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 border-y-2 border-cyan-400 px-12 py-3.5 flex flex-col items-center">
            <span className="chamfer-unslant font-heavy text-2xl font-black tracking-widest text-white uppercase leading-none">
              {teaseText}
            </span>
            <span className="chamfer-unslant font-broadcast text-xs font-bold tracking-widest text-cyan-300 uppercase mt-1">
              {teaseSub}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // 7. AUDIENCE VOTE / LIVE POLL / SOCIAL MOMENT / HASHTAG MOMENT
  if (
    type === 'audience_vote' ||
    type === 'live_poll' ||
    type === 'social_moment' ||
    type === 'hashtag_moment'
  ) {
    const hashtag = props.hashtag || '#BenidormFest2026';
    const pollPrompt = props.prompt || props.title || '¿QUIÉN MERECE EL MICRÓFONO DE BRONCE?';
    const source = props.source || '@eurovision_tve • RTVE Play';

    return (
      <div className="absolute bottom-20 left-24 z-30 pointer-events-none select-none">
        <motion.div
          initial={{
            x: -80,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          }}
          animate={{
            x: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
          exit={{
            x: -80,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          }}
          transition={{ duration: 0.52, ease: EASE_BROADCAST }}
          className="flex items-center drop-shadow-[0_16px_36px_rgba(0,0,0,0.9)]"
        >
          {/* Hashtag Tag */}
          <div className="chamfer-slant bg-gradient-to-r from-cyan-400 to-cyan-500 text-black px-6 py-3 border-y border-cyan-200">
            <span className="chamfer-unslant font-heavy text-base font-black tracking-wider uppercase">
              {hashtag}
            </span>
          </div>

          {/* Social Query Body */}
          <div className="chamfer-slant -ml-1.5 bg-[#0a0d24] border-y border-purple-500/80 px-8 py-2.5 flex flex-col">
            <span className="chamfer-unslant font-heavy text-base font-black text-white uppercase tracking-wide">
              {pollPrompt}
            </span>
            <span className="chamfer-unslant font-mono text-[10px] text-purple-300 uppercase tracking-widest mt-0.5">
              {source}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // 8. OFFICIAL RESULT / RESULTS PENDING / VERIFIED RESULT / RECORD / NEW RECORD
  if (
    type === 'official_result' ||
    type === 'results_pending' ||
    type === 'verified_result' ||
    type === 'record' ||
    type === 'new_record'
  ) {
    const statusTitle =
      props.title ||
      (type === 'results_pending'
        ? 'ESCRUTINIO EN CURSO'
        : type === 'verified_result'
        ? 'RESULTADO OFICIAL AUDITADO'
        : type === 'new_record'
        ? '¡NUEVO RÉCORD DE PUNTUACIÓN!'
        : 'RESULTADOS DEFINITIVOS');

    const statusSubtitle =
      props.subtitle ||
      (type === 'results_pending'
        ? 'AUDITORÍA ANTE NOTARIO PÚBLICO'
        : 'VALIDACIÓN RTVE Y FEDERACIÓN EUROPEA');

    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none">
        <motion.div
          initial={{
            scaleY: 0,
            clipPath: 'polygon(0 50%, 100% 50%, 100% 50%, 0 50%)',
          }}
          animate={{
            scaleY: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
          exit={{
            scaleY: 0,
            clipPath: 'polygon(0 50%, 100% 50%, 100% 50%, 0 50%)',
          }}
          transition={{ duration: 0.52, ease: EASE_BROADCAST }}
          className="flex flex-col items-center drop-shadow-[0_16px_36px_rgba(0,0,0,0.9)] origin-center"
        >
          <div className="chamfer-slant bg-gradient-to-r from-[#0d1230] via-[#1a144b] to-[#0d1230] border-y-2 border-emerald-400 px-10 py-3 flex items-center gap-4">
            <div className="chamfer-unslant w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            <div className="chamfer-unslant flex flex-col items-center">
              <span className="font-heavy text-lg font-black tracking-widest text-white uppercase leading-tight">
                {statusTitle}
              </span>
              <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-300 uppercase mt-0.5">
                {statusSubtitle}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // 9. HOST IDENTIFIER / PRESENTER IDENTIFIER / VENUE IDENTIFIER / LOCATION IDENTIFIER
  if (
    type === 'host_identifier' ||
    type === 'presenter_identifier' ||
    type === 'venue_identifier' ||
    type === 'location_identifier'
  ) {
    const name = props.name || props.title || 'RUTH LORENZO & MARC CALDERÓ';
    const role = props.role || props.subtitle || 'PRESENTADORES OFICIALES • BENIDORM FEST';

    return (
      <div className="absolute bottom-20 left-24 z-30 pointer-events-none select-none">
        <motion.div
          initial={{
            x: -100,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          }}
          animate={{
            x: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
          exit={{
            x: -100,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          }}
          transition={{ duration: 0.52, ease: EASE_BROADCAST }}
          className="flex flex-col drop-shadow-[0_16px_36px_rgba(0,0,0,0.9)]"
        >
          {/* Main Identifier Bar */}
          <div className="chamfer-slant bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 border-y border-purple-300 px-8 py-3 w-fit">
            <span className="chamfer-unslant font-heavy text-xl font-black text-white uppercase tracking-wider">
              {name}
            </span>
          </div>

          {/* Subtitle Bar */}
          <div className="chamfer-slant -mt-1 ml-4 bg-[#0d1230] border-y border-cyan-400 px-6 py-1.5 w-fit">
            <span className="chamfer-unslant font-broadcast text-xs font-bold text-cyan-300 uppercase tracking-widest">
              {role}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // 10. SHOW OPEN / SHOW CLOSE / SECTION OPEN / SECTION CLOSE / BUMPER / STING / TRANSITION
  // Symmetrical full-screen energetic wipe transition with dual chevron convergence
  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none z-40 flex items-center justify-center overflow-hidden">
      {/* Upper Symmetrical Sweeping Beam */}
      <motion.div
        initial={{ x: -1920 }}
        animate={{ x: 0 }}
        exit={{ x: 1920 }}
        transition={{ duration: 0.62, ease: EASE_BROADCAST }}
        className="absolute top-1/3 left-0 w-full h-[4px] bg-gradient-to-r from-cyan-400 via-white to-purple-500 shadow-[0_0_24px_#00e5ff]"
      />

      {/* Lower Symmetrical Sweeping Beam */}
      <motion.div
        initial={{ x: 1920 }}
        animate={{ x: 0 }}
        exit={{ x: -1920 }}
        transition={{ duration: 0.62, ease: EASE_BROADCAST }}
        className="absolute bottom-1/3 left-0 w-full h-[4px] bg-gradient-to-r from-purple-500 via-white to-cyan-400 shadow-[0_0_24px_#a855f7]"
      />

      {/* Central Emblem Core */}
      <motion.div
        initial={{
          scale: 0.5,
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
        }}
        animate={{
          scale: 1,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        }}
        exit={{
          scale: 0.5,
          clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
        }}
        transition={{ delay: 0.1, duration: 0.55, ease: EASE_BROADCAST }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="chamfer-slant bg-gradient-to-r from-[#0d1230] via-[#1a144b] to-[#0d1230] border-y-2 border-cyan-400 px-14 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex flex-col items-center">
          <span className="chamfer-unslant font-heavy text-3xl font-black tracking-widest text-white uppercase">
            {props.title || festivalName}
          </span>
          <span className="chamfer-unslant font-broadcast text-sm font-bold tracking-widest text-cyan-300 uppercase mt-1">
            {props.subtitle || 'RTVE DIRECTO'}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
