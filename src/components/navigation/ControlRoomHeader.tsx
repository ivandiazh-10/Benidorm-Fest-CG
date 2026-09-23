import React, { useState } from 'react';
import { Show, VotingStage } from '../../types/broadcast';
import { ExternalLink, Download, Upload, RefreshCw, Video, Sparkles, CheckCircle2 } from 'lucide-react';
import { generateBenidormFestShow } from '../../utils/sampleData';
import { isBenidormFest2025, isBenidormFest2024 } from '../../utils/visualProfiles';

interface ControlRoomHeaderProps {
  show: Show;
  allShows?: Show[];
  onUpdateShow: (updatedShow: Show) => void;
  onSelectShow?: (showId: string) => void;
  onOpenOBSWindow: () => void;
  onLoad2025Historical?: () => void;
  onReset2025Blank?: () => void;
  onLoad2024Historical?: () => void;
  onReset2024Blank?: () => void;
}

export const ControlRoomHeader: React.FC<ControlRoomHeaderProps> = ({
  show,
  allShows = [],
  onUpdateShow,
  onSelectShow,
  onOpenOBSWindow,
  onLoad2025Historical,
  onReset2025Blank,
  onLoad2024Historical,
  onReset2024Blank,
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState(show.videoSourceUrl || '');
  const [historicalAppliedToast, setHistoricalAppliedToast] = useState(false);

  const is2025 = isBenidormFest2025(show);
  const is2024 = isBenidormFest2024(show);

  const stages2026: { id: VotingStage; label: string; pct: string }[] = [
    { id: 'jury', label: '1. JURADO', pct: '50%' },
    { id: 'demoscopic', label: '2. DEMOSCÓPICO', pct: '25%' },
    { id: 'public', label: '3. PÚBLICO', pct: '25%' },
    { id: 'results', label: '4. GANADOR', pct: '100%' },
  ];

  const stages2025: { id: VotingStage; label: string; pct: string }[] = [
    { id: 'jury', label: '1. JURADO', pct: '50%' },
    { id: 'public', label: '2. TELEVOTO', pct: '50%' },
    { id: 'results', label: '3. GANADOR', pct: '100%' },
  ];

  const stages2024: { id: VotingStage; label: string; pct: string }[] = [
    { id: 'jury', label: '1. JURADO', pct: '50%' },
    { id: 'demoscopic', label: '2. DEMOSCÓPICO', pct: '25%' },
    { id: 'public', label: '3. PÚBLICO', pct: '25%' },
    { id: 'results', label: '4. GANADOR', pct: '100%' },
  ];

  const currentStages = is2024 ? stages2024 : is2025 ? stages2025 : stages2026;

  const handleStageChange = (stage: VotingStage) => {
    onUpdateShow({ ...show, votingStage: stage });
  };

  const handleResetDemo = () => {
    if (is2025) {
      if (confirm('¿Restablecer puntuaciones del Benidorm Fest 2025 a los resultados oficiales (Melody 150 pts)?')) {
        onLoad2025Historical?.();
        setHistoricalAppliedToast(true);
        setTimeout(() => setHistoricalAppliedToast(false), 2500);
      }
    } else {
      if (confirm('¿Restablecer el show completo al set de demostración de Benidorm Fest 2026?')) {
        const demo = generateBenidormFestShow();
        onUpdateShow(demo);
      }
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(show, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${(show.title || show.name).toLowerCase().replace(/\s+/g, '-')}-backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.id && parsed.participants) {
          onUpdateShow(parsed);
        } else {
          alert('Formato de show broadcast no válido.');
        }
      } catch {
        alert('No se pudo procesar el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveVideoSource = () => {
    onUpdateShow({ ...show, videoSourceUrl: videoUrlInput.trim() || undefined });
    setShowConfigModal(false);
  };

  return (
    <header className={`h-14 border-b px-4 flex items-center justify-between select-none z-30 transition-colors ${
      is2024
        ? 'bg-[#101044] border-white/20'
        : is2025
        ? 'bg-[#070B1F] border-[#246BFF]/40'
        : 'bg-[#0a0d14] border-slate-800'
    }`}>
      
      {/* Brand & Show Selector */}
      <div className="flex items-center gap-3">
        {/* Brand Badge */}
        {is2024 ? (
          <div className="flex items-center bg-[#080D2B] border-2 border-white rounded-full px-3 py-1 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E4004F] mr-2 shrink-0 animate-pulse" />
            <span className="font-sans text-xs font-black text-[#FFD900] tracking-wider uppercase">
              BF 2024 • 3ª EDICIÓN
            </span>
          </div>
        ) : is2025 ? (
          <div className="flex items-center bg-[#101B55] border-2 border-[#246BFF] px-2.5 py-1">
            <span className="w-2.5 h-2.5 bg-[#F21878] mr-2 shrink-0" />
            <span className="font-heavy text-xs font-black text-[#FFD900] tracking-widest uppercase">
              BF 2025 • CUADRADO
            </span>
          </div>
        ) : (
          <div className="chamfer-slant bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-3 py-1 shadow-md">
            <span className="chamfer-unslant block font-display font-black text-xs text-white tracking-widest uppercase">
              BF 2026 • DIAGONAL
            </span>
          </div>
        )}

        {/* Multi-Show Selector Dropdown */}
        {allShows.length > 0 && onSelectShow && (
          <div className="flex items-center gap-1.5">
            <select
              value={show.id}
              onChange={(e) => onSelectShow(e.target.value)}
              className={`text-xs font-broadcast font-bold uppercase rounded px-2.5 py-1 focus:outline-none transition-colors cursor-pointer ${
                is2024
                  ? 'bg-[#080D2B] text-white border border-white/60 focus:border-[#FFD900]'
                  : is2025
                  ? 'bg-[#101B55] text-white border border-[#246BFF] focus:border-[#FFD900]'
                  : 'bg-slate-900 text-slate-100 border border-slate-700 focus:border-cyan-400'
              }`}
            >
              {allShows.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.visualProfileId === 'benidorm_fest_2024' || s.id.includes('2024')
                    ? '★ BENIDORM FEST 2024 (3ª EDICIÓN)'
                    : s.visualProfileId === 'benidorm_fest_2025' || s.id.includes('2025')
                    ? '★ BENIDORM FEST 2025 (4ª EDICIÓN)'
                    : '★ BENIDORM FEST 2026 (5ª EDICIÓN)'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 2024 Historical Mode Presets / Toggles */}
        {is2024 && (
          <div className="hidden xl:flex items-center gap-1.5 ml-1">
            <button
              onClick={() => {
                onLoad2024Historical?.();
                setHistoricalAppliedToast(true);
                setTimeout(() => setHistoricalAppliedToast(false), 2500);
              }}
              title="Cargar resultados oficiales de la Gran Final 2024 (Nebulossa ganadora con 156 puntos)"
              className="flex items-center gap-1 px-3 py-1 bg-[#080D2B] hover:bg-[#151A75] text-[#FFD900] border border-[#FFD900]/80 text-[11px] font-sans font-black uppercase tracking-wider rounded-full transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-[#FFD900]" />
              <span>Resultados 2024 (Nebulossa 156p)</span>
            </button>

            <button
              onClick={() => {
                onReset2024Blank?.();
              }}
              title="Reiniciar todos los marcadores a 0 para simulación en directo"
              className="px-2.5 py-1 bg-[#0A0E2A] hover:bg-[#080D2B] text-[#23D9D2] border border-[#23D9D2]/60 text-[11px] font-sans font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
            >
              <span>Reiniciar a 0</span>
            </button>

            {historicalAppliedToast && (
              <span className="flex items-center gap-1 text-[11px] text-[#FFD900] font-bold animate-pulse">
                <CheckCircle2 className="w-3 h-3 text-[#FFD900]" /> ¡Cargado!
              </span>
            )}
          </div>
        )}

        {/* 2025 Historical Mode Presets / Toggles */}
        {is2025 && (
          <div className="hidden xl:flex items-center gap-1.5 ml-1">
            <button
              onClick={() => {
                onLoad2025Historical?.();
                setHistoricalAppliedToast(true);
                setTimeout(() => setHistoricalAppliedToast(false), 2500);
              }}
              title="Cargar resultados oficiales de la Gran Final 2025 (Melody ganadora con 150 puntos)"
              className="flex items-center gap-1 px-2.5 py-1 bg-[#101B55] hover:bg-[#18266D] text-[#FFD900] border border-[#FFD900]/70 text-[11px] font-broadcast font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#FFD900]" />
              <span>Resultados 2025 (Melody 150p)</span>
            </button>

            <button
              onClick={() => {
                onReset2025Blank?.();
              }}
              title="Reiniciar todos los marcadores a 0 para simulación en directo"
              className="px-2 py-1 bg-[#070B1F] hover:bg-[#101B55] text-[#8EDCFF] border border-[#246BFF]/50 text-[11px] font-broadcast font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Reiniciar a 0</span>
            </button>

            {historicalAppliedToast && (
              <span className="flex items-center gap-1 text-[11px] text-[#FFD900] font-bold animate-pulse">
                <CheckCircle2 className="w-3 h-3 text-[#FFD900]" /> ¡Cargado!
              </span>
            )}
          </div>
        )}

        {/* Voting Stages Pill Progression */}
        <div className={`hidden lg:flex items-center border rounded p-0.5 ml-2 ${
          is2024
            ? 'bg-[#080D2B] border-white/30'
            : is2025
            ? 'bg-[#070B1F] border-[#246BFF]/40'
            : 'bg-slate-900 border-slate-800'
        }`}>
          {currentStages.map((st) => (
            <button
              key={st.id}
              onClick={() => handleStageChange(st.id)}
              className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                show.votingStage === st.id
                  ? is2025
                    ? 'bg-[#F21878] text-[#FFD900] shadow'
                    : 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.label} <span className="text-[10px] opacity-75">({st.pct})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Controls: Video Source, OBS Popout, Backup, Settings */}
      <div className="flex items-center gap-2">
        {/* Split Screen Video Feed Source Button */}
        <button
          onClick={() => setShowConfigModal(true)}
          title="Configure Split-Screen Video Feed"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-semibold transition-colors"
        >
          <Video className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Camera Feed</span>
        </button>

        {/* Dedicated OBS Output Popout Button */}
        <button
          id="btn-open-obs-window"
          onClick={onOpenOBSWindow}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-broadcast font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer ${
            is2025
              ? 'bg-[#F21878] hover:bg-[#d61367] text-[#FFD900] border border-[#FFD900]/50'
              : 'rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>OPEN OBS OUTPUT</span>
        </button>

        {/* Export / Backup */}
        <button
          onClick={handleExportJSON}
          title="Export Show JSON"
          className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* Import JSON */}
        <label
          title="Import Show JSON"
          className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
        </label>

        {/* Reset to Demo */}
        <button
          onClick={handleResetDemo}
          title={is2025 ? 'Restablecer resultados 2025' : 'Reset to Benidorm Fest Demo Data'}
          className="p-1.5 text-slate-400 hover:text-purple-300 rounded bg-slate-900 border border-slate-800 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Video Source Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f1422] border border-cyan-500/40 rounded-lg p-5 shadow-2xl text-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-broadcast text-base font-bold text-white uppercase">
                Scoreboard Split-Screen Camera Feed
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter a direct video URL (e.g. MP4/WebM), image stream, or leave empty for the authentic Benidorm Fest stage graphic.
            </p>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Media Feed URL
              </label>
              <input
                type="url"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="https://example.com/live-stage-feed.mp4"
                className="w-full bg-black border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setVideoUrlInput('');
                  onUpdateShow({ ...show, videoSourceUrl: undefined });
                  setShowConfigModal(false);
                }}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-400 cursor-pointer"
              >
                CLEAR (USE DEFAULT STAGE)
              </button>

              <button
                onClick={handleSaveVideoSource}
                className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-xs font-broadcast font-bold uppercase tracking-wider text-black shadow cursor-pointer"
              >
                SAVE VIDEO SOURCE
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

