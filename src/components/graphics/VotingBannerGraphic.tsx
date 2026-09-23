import React from 'react';
import { motion } from 'motion/react';
import { Participant } from '../../types/broadcast';
import { Phone, MessageSquare } from 'lucide-react';
import { BenidormBug, EASE_BROADCAST, EASE_EXIT } from './primitives/BenidormPrimitives';

interface VotingBannerGraphicProps {
  participant?: Participant;
  showPerformanceNumber?: boolean;
  customNumber?: string;
  customSmsKeyword?: string;
  customPhone?: string;
  smsShortcode?: string;
}

export const VotingBannerGraphic: React.FC<VotingBannerGraphicProps> = ({
  participant,
  showPerformanceNumber,
  customNumber,
  customSmsKeyword,
  customPhone,
  smsShortcode = '25152',
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
      (participant?.performanceNumber
        ? String(participant.performanceNumber).padStart(2, '0')
        : '01'))
    : undefined;

  const keyword =
    customSmsKeyword || participant?.smsKeyword || `VOTA ${participant?.name || 'CANDIDATO'}`;
  const phone = customPhone || participant?.phone || `905 810 0${num || '01'}`;

  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-end items-center pb-14 z-30">
      <motion.div
        initial={{
          y: 70,
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        }}
        animate={{
          y: 0,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}
        exit={{
          y: 50,
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
          transition: { duration: 0.35, ease: EASE_EXIT },
        }}
        transition={{ duration: 0.55, ease: EASE_BROADCAST }}
        className="w-[1150px] flex flex-col items-start mx-auto gpu-layer"
      >
        {/* Candidate / Performance Indicator on top */}
        <div className="ml-10 mb-1 flex items-center gap-3">
          {shouldShowNumber && num && (
            <div className="chamfer-slant bg-cyan-400 px-5 py-1 shadow-lg">
              <span className="chamfer-unslant block font-heavy font-mono-num text-[32px] font-black text-black leading-none">
                {num}
              </span>
            </div>
          )}
          <span className="font-heavy text-[26px] font-black text-white uppercase drop-shadow-md">
            {participant?.name || participant?.artist}
          </span>
        </div>

        {/* Main Voting Chamfered Banner Bar matching Screenshot 1 */}
        <div className="relative w-full flex items-stretch chamfer-slant bg-gradient-to-r from-[#0c0a26] via-[#1a0f3d] to-[#0c0a26] border-y-2 border-cyan-400 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
          
          {/* Left Icon Accent Box */}
          <div className="w-16 bg-gradient-to-br from-cyan-400 via-sky-500 to-purple-600 flex items-center justify-center shrink-0">
            <div className="chamfer-unslant w-9 h-9 rounded-full border-2 border-white/90 bg-black/40 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Telephone Section */}
          <div className="flex items-center gap-4 px-7 py-3 border-r border-purple-500/30 shrink-0">
            <div className="chamfer-unslant flex flex-col">
              <span className="text-cyan-300 font-broadcast text-xs uppercase tracking-widest font-bold">
                Llama al
              </span>
              <span className="text-white font-heavy font-mono-num text-[30px] font-black tracking-wider leading-none drop-shadow">
                {phone}
              </span>
            </div>
          </div>

          {/* SMS Section */}
          <div className="flex-1 flex items-center justify-between px-7 py-3">
            <div className="chamfer-unslant flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-purple-300 font-broadcast text-xs uppercase tracking-widest font-bold">
                  Envía
                </span>
                <span className="text-amber-400 font-heavy text-[30px] font-black tracking-wider uppercase leading-none drop-shadow">
                  {keyword}
                </span>
              </div>
            </div>

            {/* Shortcode Pill */}
            <div className="chamfer-unslant flex items-baseline gap-2 bg-[#12082b] px-5 py-1.5 rounded border border-cyan-400/50 shadow-inner shrink-0">
              <span className="text-cyan-300 font-broadcast text-sm uppercase font-bold">
                al
              </span>
              <span className="text-amber-400 font-heavy font-mono-num text-[30px] font-black tracking-widest">
                {smsShortcode}
              </span>
            </div>
          </div>

        </div>

        {/* Legal disclaimer line directly underneath */}
        <div className="w-full text-center mt-2 px-6">
          <p className="text-[11px] font-mono text-slate-400/80 tracking-wide">
            Coste 905: 1,45€/llam fijo y 2€/llam móvil | SMS: 1,45€ (IVA incl.) Atn. Clte. 915766214 info@eurostar.es +18 años. Bases ante Notario.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
