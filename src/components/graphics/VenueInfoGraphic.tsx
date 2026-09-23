import React from 'react';
import { motion } from 'motion/react';
import { Show } from '../../types/broadcast';
import { BenidormBug, EASE_BROADCAST, EASE_EXIT } from './primitives/BenidormPrimitives';

interface VenueInfoGraphicProps {
  show: Show;
  venueName?: string;
  city?: string;
  capacity?: string;
  note?: string;
}

export const VenueInfoGraphic: React.FC<VenueInfoGraphicProps> = ({
  show,
  venueName = "PALAU D'ESPORTS L'ILLA DE BENIDORM",
  city = 'BENIDORM, ALICANTE (COMUNITAT VALENCIANA)',
  capacity = '3.500 ESPECTADORES',
  note = 'PRODUCCIÓN RTVE EN DIRECTO PARA LA 1 Y RTVE PLAY',
}) => {
  return (
    <div className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-end items-center pb-20 z-30">
      <motion.div
        initial={{
          y: 40,
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        }}
        animate={{
          y: 0,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}
        exit={{
          y: 30,
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
          transition: { duration: 0.32, ease: EASE_EXIT },
        }}
        transition={{ duration: 0.5, ease: EASE_BROADCAST }}
        className="w-[900px] flex flex-col drop-shadow-[0_16px_40px_rgba(0,0,0,0.9)] gpu-layer mx-auto"
      >
        {/* Main Banner */}
        <div className="chamfer-slant bg-gradient-to-r from-[#0a0f2b] via-[#121942] to-[#0a0f2b] border-2 border-cyan-400/80 p-6 shadow-2xl">
          <div className="chamfer-unslant flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="bg-cyan-400 text-black px-3 py-0.5 text-xs font-mono font-black uppercase tracking-widest chamfer-slant">
                <span className="chamfer-unslant">SEDE OFICIAL</span>
              </span>
              <span className="font-mono text-xs text-purple-300 uppercase tracking-wider">
                {city}
              </span>
            </div>

            <h2 className="font-heavy text-[38px] font-black text-white uppercase tracking-wide leading-tight">
              {venueName}
            </h2>

            <div className="flex items-center justify-between pt-3 border-t border-indigo-900/80 mt-1 text-xs font-mono">
              <span className="text-cyan-300 font-bold uppercase">
                AFORO: <strong className="text-white font-mono-num font-black">{capacity}</strong>
              </span>
              <span className="text-purple-300/80 uppercase">
                {note}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
