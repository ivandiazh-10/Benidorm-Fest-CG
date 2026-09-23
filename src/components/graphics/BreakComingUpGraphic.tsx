import React from 'react';
import { motion } from 'motion/react';
import { Show } from '../../types/broadcast';
import {
  ChamferedBar,
  DirectionalLine,
  EASE_BROADCAST,
  EASE_EXIT,
} from './primitives/BenidormPrimitives';

interface BreakComingUpGraphicProps {
  show: Show;
  mode?: 'break' | 'back_in' | 'coming_up' | 'next' | 'announcement' | 'live';
  message?: string;
  subMessage?: string;
  tag?: string;
}

export const BreakComingUpGraphic: React.FC<BreakComingUpGraphicProps> = ({
  show,
  mode = 'break',
  message,
  subMessage,
  tag,
}) => {
  const defaultTag =
    mode === 'coming_up'
      ? 'A CONTINUACIÓN'
      : mode === 'next'
      ? 'SIGUIENTE ACTUACIÓN'
      : mode === 'back_in'
      ? 'VOLVEMOS EN'
      : mode === 'announcement'
      ? 'COMUNICADO OFICIAL'
      : mode === 'live'
      ? 'EN DIRECTO'
      : 'PAUSA TÉCNICA';

  const defaultMessage =
    mode === 'coming_up'
      ? 'A CONTINUACIÓN: ACTUACIONES Y VOTACIONES'
      : mode === 'next'
      ? 'EN EL ESCENARIO EN BREVE'
      : mode === 'back_in'
      ? 'VOLVEMOS EN 2 MINUTOS'
      : mode === 'announcement'
      ? 'COMUNICADO DE LA DIRECCIÓN'
      : mode === 'live'
      ? 'EMISIÓN EN RIGUROSO DIRECTO'
      : 'VOLVEMOS EN BREVE';

  const defaultSub =
    mode === 'coming_up'
      ? 'EL ESPECTÁCULO CONTINÚA DESDE EL PALAU D\'ESPORTS L\'ILLA DE BENIDORM'
      : mode === 'next'
      ? 'PREPARADOS PARA LA SIGUIENTE CANDIDATURA EN EL ESCENARIO'
      : mode === 'announcement'
      ? 'RESOLUCIÓN OFICIAL DE RTVE Y EL COMITÉ DE BENIDORM FEST'
      : 'LA GRAN FINAL CONTINÚA A CONTINUACIÓN CON LAS VOTACIONES EN DIRECTO';

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
        className="w-[900px] flex flex-col drop-shadow-[0_16px_40px_rgba(0,0,0,0.95)] gpu-layer mx-auto"
      >
        {/* Top Tag */}
        <div className="flex items-center gap-3 mb-2 ml-4">
          <div className="chamfer-slant bg-rose-600 text-white px-5 py-1 font-mono text-xs font-black tracking-widest uppercase shadow-md">
            {tag || defaultTag}
          </div>
          <div className="chamfer-slant bg-[#100d2b] border border-purple-500/40 text-purple-200 px-4 py-1 font-mono text-xs font-semibold tracking-wider uppercase">
            {show.stageTitle || 'BENIDORM FEST'}
          </div>
        </div>

        {/* Main Chamfered Card */}
        <div className="chamfer-slant bg-gradient-to-r from-[#0a0c24] via-[#14183e] to-[#0a0c24] border-2 border-purple-500/70 p-6 shadow-2xl">
          <div className="chamfer-unslant flex items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.9)]" />
                <h2 className="font-heavy text-[36px] font-black text-white uppercase tracking-wider leading-none">
                  {message || defaultMessage}
                </h2>
              </div>
              <p className="font-broadcast text-xs text-purple-300 uppercase tracking-wide mt-1.5 ml-6">
                {subMessage || defaultSub}
              </p>
            </div>

            <div className="chamfer-slant bg-gradient-to-r from-purple-700 to-indigo-800 px-7 py-3 border border-purple-400/50 shadow-lg">
              <span className="chamfer-unslant block font-heavy text-sm font-black text-cyan-200 uppercase tracking-widest text-center whitespace-nowrap">
                RTVE • LA 1
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2 ml-2">
          <DirectionalLine color="cyan" />
        </div>
      </motion.div>
    </div>
  );
};
