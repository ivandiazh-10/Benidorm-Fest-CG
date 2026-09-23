import React from 'react';
import { motion } from 'motion/react';
import { Show } from '../../types/broadcast';
import { BenidormBug, EASE_BROADCAST, EASE_EXIT } from './primitives/BenidormPrimitives';

interface FullscreenInfoGraphicProps {
  show: Show;
  title?: string;
  subtitle?: string;
  items?: Array<{
    title: string;
    description: string;
    badge?: string;
  }>;
}

export const FullscreenInfoGraphic: React.FC<FullscreenInfoGraphicProps> = ({
  show,
  title,
  subtitle,
  items,
}) => {
  const { stageTitle, votingConfig } = show;

  const defaultItems = [
    {
      title: 'JURADO PROFESIONAL',
      description: `${votingConfig.juryWeight}% del peso total. Panel compuesto por 8 expertos nacionales e internacionales.`,
      badge: `${votingConfig.juryWeight}%`,
    },
    {
      title: 'PANEL DEMOSCÓPICO',
      description: `${votingConfig.demoscopicWeight}% del peso total. Muestra estadística representativa de 350 ciudadanos de España.`,
      badge: `${votingConfig.demoscopicWeight}%`,
    },
    {
      title: 'TELEVOTO POPULAR',
      description: `${votingConfig.publicWeight}% del peso total. Llamadas y mensajes SMS emitidos durante la ventana de votación.`,
      badge: `${votingConfig.publicWeight}%`,
    },
  ];

  const infoList = items && items.length > 0 ? items : defaultItems;

  return (
    <motion.div
      initial={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      }}
      animate={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      }}
      exit={{
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        transition: { duration: 0.35, ease: EASE_EXIT },
      }}
      transition={{ duration: 0.55, ease: EASE_BROADCAST }}
      className="absolute inset-0 w-[1920px] h-[1080px] pointer-events-none select-none flex flex-col justify-center px-24 py-16 z-30 overflow-hidden gpu-layer"
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col h-full justify-between py-6">
        
        {/* Header */}
        <motion.div
          initial={{ y: -30, clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' }}
          animate={{ y: 0, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
          exit={{ y: -20 }}
          transition={{ duration: 0.45, ease: EASE_BROADCAST }}
          className="flex items-center justify-end pb-4 border-b border-purple-500/40 w-full"
        >
          <div className="flex items-center gap-3">
            <div className="chamfer-slant bg-gradient-to-r from-[#180838] via-[#2d115e] to-[#180838] border border-purple-400/50 px-6 py-2 shadow-xl">
              <span className="chamfer-unslant block font-broadcast text-[26px] font-black tracking-wider text-white uppercase drop-shadow-md">
                {title || 'SISTEMA DE VOTACIÓN'}
              </span>
            </div>
            <div className="chamfer-slant bg-cyan-400 px-4 py-2 text-black font-mono text-xs font-black tracking-widest uppercase">
              REGLAMENTO OFICIAL
            </div>
          </div>
        </motion.div>

        {/* Subtitle if present */}
        {subtitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center my-2"
          >
            <p className="font-broadcast text-lg text-purple-200 tracking-wide uppercase">
              {subtitle}
            </p>
          </motion.div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-3 gap-6 my-auto">
          {infoList.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{
                y: 35,
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
              }}
              animate={{
                y: 0,
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              }}
              exit={{ y: 20 }}
              transition={{ delay: 0.12 + idx * 0.08, duration: 0.48, ease: EASE_BROADCAST }}
              className="chamfer-slant bg-gradient-to-b from-[#0e1236] to-[#080a20] border-2 border-indigo-900/80 p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between h-[340px]"
            >
              {/* Card top accent */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500" />

              <div className="chamfer-unslant">
                {item.badge && (
                  <div className="inline-block chamfer-slant bg-cyan-400 text-black px-4 py-1 font-heavy font-mono-num text-[22px] font-black mb-4">
                    <span className="chamfer-unslant">{item.badge}</span>
                  </div>
                )}
                <h3 className="font-broadcast text-[24px] font-black text-white uppercase tracking-wider mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans text-slate-300 text-base leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="chamfer-unslant pt-4 border-t border-indigo-950/80 flex justify-between items-center text-xs font-mono text-purple-300/70 uppercase">
                <span>BENIDORM FEST</span>
                <span>RTVE</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full flex justify-between items-center px-6 py-2.5 bg-[#080516]/90 border border-purple-500/30 chamfer-slant shadow-lg"
        >
          <div className="chamfer-unslant text-xs font-mono text-slate-300 uppercase">
            <span>AUDITORÍA NOTARIAL PERMANENTE DURANTE TODO EL PROCESO DE VOTACIÓN</span>
          </div>
          <div className="chamfer-unslant text-xs font-mono text-cyan-400 font-bold uppercase">
            RTVE PLAY • LA 1
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};
