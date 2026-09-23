import React, { useState } from 'react';
import { GraphicLayer, Participant, Show } from '../../types/broadcast';
import {
  Radio,
  Eye,
  XCircle,
  SkipForward,
  Sparkles,
  RotateCcw,
  Trash2,
  Save,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Tv,
  Layers,
  Award,
  Users,
  User,
  Music,
  Info,
  Flame,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { resetAllScores } from '../../utils/scoringEngine';

interface QuickOperationsBarProps {
  show: Show;
  onUpdateShow: (updatedShow: Show) => void;
  previewLayer: GraphicLayer | null;
  onAirLayers: GraphicLayer[];
  targetParticipant: Participant | undefined;
  onSelectTarget: (participant: Participant) => void;
  onTake: () => void;
  onTakeOut: () => void;
  onRemoveLayer?: (layerId: string) => void;
  onClearAll: () => void;
  onSetPreviewLayer: (layer: GraphicLayer) => void;
  onDirectTake: (layer: GraphicLayer) => void;
  onOpenQuickLowerThird: (mode?: 'one_person' | 'two_people' | 'artist_song' | 'info') => void;
  onUndoLastVote: () => void;
  onSaveShow: () => void;
}

export const QuickOperationsBar: React.FC<QuickOperationsBarProps> = ({
  show,
  onUpdateShow,
  previewLayer,
  onAirLayers,
  targetParticipant,
  onSelectTarget,
  onTake,
  onTakeOut,
  onRemoveLayer,
  onClearAll,
  onSetPreviewLayer,
  onDirectTake,
  onOpenQuickLowerThird,
  onUndoLastVote,
  onSaveShow,
}) => {
  const [saveFlash, setSaveFlash] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const { participants, activeVotingPhase, stageTitle } = show;

  const handleConfirmReset = () => {
    const updated = resetAllScores(show);
    onUpdateShow(updated);
    setShowResetModal(false);
  };

  // Live Bug state
  const liveBugOnAirLayer = onAirLayers.find((l) => l.type === 'live_bug');
  const liveBugOnAir = !!liveBugOnAirLayer;
  const liveBugInPreview = previewLayer?.type === 'live_bug';
  const liveBugIsHold = !!liveBugOnAirLayer?.props?.isHold;

  // Performance Identifier state (sits above bug)
  const perfIdOnAirLayer = onAirLayers.find((l) => l.type === 'performance_identifier');
  const perfIdOnAir = !!perfIdOnAirLayer;
  const perfIdInPreview = previewLayer?.type === 'performance_identifier';

  // Cycle prev / next target participant
  const currentIndex = targetParticipant
    ? participants.findIndex((p) => p.id === targetParticipant.id)
    : 0;

  const handlePrevTarget = () => {
    if (participants.length === 0) return;
    const prevIdx = (currentIndex - 1 + participants.length) % participants.length;
    onSelectTarget(participants[prevIdx]);
  };

  const handleNextTarget = () => {
    if (participants.length === 0) return;
    const nextIdx = (currentIndex + 1) % participants.length;
    onSelectTarget(participants[nextIdx]);
  };

  const handleSaveClick = () => {
    onSaveShow();
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  // Live Bug Dedicated Operations
  const handlePreviewLiveBug = () => {
    const timestamp = Date.now();
    onSetPreviewLayer({
      id: `layer-livebug-${timestamp}`,
      type: 'live_bug',
      name: 'BENIDORM FEST Live Bug',
      category: 'GENERAL',
      isOnAir: false,
      inPreview: true,
      zIndex: 40,
      props: {
        festivalName: 'BENIDORM FEST',
        stageName: stageTitle || 'Gran Final',
        showLiveTag: true,
        liveTagText: 'DIRECTO',
        isHold: false,
      },
    });
  };

  const handleTakeLiveBug = () => {
    const timestamp = Date.now();
    onDirectTake({
      id: `layer-livebug-${timestamp}`,
      type: 'live_bug',
      name: 'BENIDORM FEST Live Bug',
      category: 'GENERAL',
      isOnAir: true,
      inPreview: false,
      zIndex: 40,
      props: {
        festivalName: 'BENIDORM FEST',
        stageName: stageTitle || 'Gran Final',
        showLiveTag: true,
        liveTagText: 'DIRECTO',
        isHold: false,
      },
    });
  };

  const handleOutLiveBug = () => {
    if (liveBugOnAirLayer) {
      if (onRemoveLayer) {
        onRemoveLayer(liveBugOnAirLayer.id);
      } else {
        onTakeOut();
      }
    }
  };

  const handleToggleHoldLiveBug = () => {
    if (!liveBugOnAirLayer) return;
    onDirectTake({
      ...liveBugOnAirLayer,
      props: {
        ...liveBugOnAirLayer.props,
        isHold: !liveBugIsHold,
      },
    });
  };

  // Performance Identifier Operations (sits above the bug, manual PREVIEW -> TAKE)
  const handlePreviewPerfId = () => {
    if (!targetParticipant) return;
    const timestamp = Date.now();
    onSetPreviewLayer({
      id: `layer-perfid-${timestamp}`,
      type: 'performance_identifier',
      name: `ID Actuación: #${targetParticipant.performanceNumber} ${targetParticipant.artist}`,
      category: 'PERFORMANCE',
      isOnAir: false,
      inPreview: true,
      zIndex: 25,
      props: {
        participantId: targetParticipant.id,
      },
    });
  };

  const handleTakePerfId = () => {
    if (!targetParticipant) return;
    const timestamp = Date.now();
    onDirectTake({
      id: `layer-perfid-${timestamp}`,
      type: 'performance_identifier',
      name: `ID Actuación: #${targetParticipant.performanceNumber} ${targetParticipant.artist}`,
      category: 'PERFORMANCE',
      isOnAir: true,
      inPreview: false,
      zIndex: 25,
      props: {
        participantId: targetParticipant.id,
      },
    });
  };

  const handleOutPerfId = () => {
    if (perfIdOnAirLayer) {
      if (onRemoveLayer) {
        onRemoveLayer(perfIdOnAirLayer.id);
      } else {
        onTakeOut();
      }
    }
  };

  // Quick Launch helper builders
  const launchScoreboard = () => {
    const timestamp = Date.now();
    onSetPreviewLayer({
      id: `layer-sb-${timestamp}`,
      type: 'scoreboard_split',
      name: 'Scoreboard Split-Screen',
      category: 'SCORES',
      isOnAir: false,
      inPreview: true,
      zIndex: 10,
      props: { stageLabel: activeVotingPhase === 'demoscopic' ? 'DEMOSCÓPICO' : activeVotingPhase === 'public' ? 'PÚBLICO' : 'JURADO' },
    });
  };

  const launchTop5 = () => {
    const timestamp = Date.now();
    onSetPreviewLayer({
      id: `layer-top5-${timestamp}`,
      type: 'top_ranking',
      name: 'Top 5 Ranking Widget',
      category: 'RANKING',
      isOnAir: false,
      inPreview: true,
      zIndex: 15,
      props: { count: 5 },
    });
  };

  const launchStageReady = () => {
    if (!targetParticipant) return;
    const timestamp = Date.now();
    onSetPreviewLayer({
      id: `layer-intro-${timestamp}`,
      type: 'performance_intro',
      name: `Stage Ready: #${targetParticipant.performanceNumber} ${targetParticipant.artist}`,
      category: 'PERFORMANCE',
      isOnAir: false,
      inPreview: true,
      zIndex: 20,
      props: {
        participantId: targetParticipant.id,
        customNumber: String(targetParticipant.performanceNumber).padStart(2, '0'),
        customArtist: targetParticipant.name || targetParticipant.artist,
        customSong: targetParticipant.song,
      },
    });
  };

  const launchCurrentLeader = () => {
    const timestamp = Date.now();
    onSetPreviewLayer({
      id: `layer-leader-${timestamp}`,
      type: 'current_leader',
      name: 'Current Provisional Leader',
      category: 'RANKING',
      isOnAir: false,
      inPreview: true,
      zIndex: 15,
      props: {},
    });
  };

  const launchClassification = () => {
    const timestamp = Date.now();
    onSetPreviewLayer({
      id: `layer-class-${timestamp}`,
      type: 'classification_fullscreen',
      name: 'Clasificación General TV',
      category: 'RANKING',
      isOnAir: false,
      inPreview: true,
      zIndex: 12,
      props: {},
    });
  };

  const launchPodium = () => {
    const timestamp = Date.now();
    onSetPreviewLayer({
      id: `layer-podium-${timestamp}`,
      type: 'top_3_podium',
      name: 'Podio Top 3 Provisional',
      category: 'RANKING',
      isOnAir: false,
      inPreview: true,
      zIndex: 14,
      props: {},
    });
  };

  const launchFullscreenInfo = () => {
    const timestamp = Date.now();
    onSetPreviewLayer({
      id: `layer-info-${timestamp}`,
      type: 'fullscreen_info',
      name: 'Info Sistema Votación',
      category: 'GENERAL',
      isOnAir: false,
      inPreview: true,
      zIndex: 10,
      props: {},
    });
  };

  const launchBreak = () => {
    const timestamp = Date.now();
    onSetPreviewLayer({
      id: `layer-break-${timestamp}`,
      type: 'break_coming_up',
      name: 'Pausa Técnica / Volvemos',
      category: 'GENERAL',
      isOnAir: false,
      inPreview: true,
      zIndex: 10,
      props: {},
    });
  };

  const phaseDisplay =
    activeVotingPhase === 'demoscopic'
      ? '2. DEMOSCÓPICO'
      : activeVotingPhase === 'public'
      ? '3. TELEVOTO PÚBLICO'
      : '1. JURADO PROFESIONAL';

  return (
    <div className="flex flex-col bg-[#07090f] border-b border-slate-800 text-slate-100 select-none">
      
      {/* ROW 1: System Status & Global Target Selector */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#090c16] border-b border-slate-800/80 text-xs">
        
        {/* Left: Broadcast Status Telemetry */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase">SHOW:</span>
            <span className="text-white font-bold truncate max-w-[140px]">{show.name}</span>
          </div>

          <span className="text-slate-700">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase">FASE:</span>
            <span className="text-cyan-400 font-bold">{phaseDisplay}</span>
          </div>

          <span className="text-slate-700">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase">PACKAGE:</span>
            <span className="text-purple-300 font-bold">BENIDORM FEST</span>
          </div>

          <span className="text-slate-700">|</span>

          {/* Status Badges */}
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                previewLayer
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              PREVIEW: {previewLayer ? previewLayer.name.slice(0, 20) : 'VACÍO'}
            </span>

            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                onAirLayers.length > 0
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              ON AIR: {onAirLayers.length} {onAirLayers.length === 1 ? 'CAPA' : 'CAPAS'}
            </span>

            {/* DEDICATED LIVE BUG CONTROLS (Independent persistent broadcast layer) */}
            <div className="flex items-center gap-1 bg-[#050711] border border-cyan-500/30 rounded px-1.5 py-0.5">
              <span className="text-[10px] font-mono font-black text-cyan-300 mr-1">MOSCA BUG:</span>
              <button
                type="button"
                onClick={handlePreviewLiveBug}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                  liveBugInPreview
                    ? 'bg-emerald-600 text-white shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Cargar Mosca Bug en Preview"
              >
                PREV
              </button>
              <button
                type="button"
                onClick={handleTakeLiveBug}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                  liveBugOnAir
                    ? 'bg-rose-600 text-white shadow-[0_0_6px_rgba(225,29,72,0.6)] animate-pulse'
                    : 'bg-slate-800 text-rose-300 hover:bg-rose-900/60'
                }`}
                title="Llevar Mosca Bug a DIRECTO (ON AIR)"
              >
                TAKE
              </button>
              <button
                type="button"
                onClick={handleToggleHoldLiveBug}
                disabled={!liveBugOnAir}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                  !liveBugOnAir
                    ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                    : liveBugIsHold
                    ? 'bg-amber-600 text-black font-black'
                    : 'bg-slate-800 text-amber-300 hover:bg-amber-900/60'
                }`}
                title="Pausar / Continuar bucle de animación de la mosca"
              >
                {liveBugIsHold ? 'HOLD ON' : 'HOLD'}
              </button>
              <button
                type="button"
                onClick={handleOutLiveBug}
                disabled={!liveBugOnAir}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                  liveBugOnAir
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                    : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                }`}
                title="Quitar Mosca Bug de DIRECTO"
              >
                OUT
              </button>
            </div>

            {/* DEDICATED PERFORMANCE IDENTIFIER CONTROLS (Sits above Live Bug) */}
            <div className="flex items-center gap-1 bg-[#050711] border border-purple-500/30 rounded px-1.5 py-0.5">
              <span className="text-[10px] font-mono font-black text-purple-300 mr-1">ID ACTUACIÓN:</span>
              <button
                type="button"
                onClick={handlePreviewPerfId}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                  perfIdInPreview
                    ? 'bg-emerald-600 text-white shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title={`Preparar ID (#${targetParticipant?.performanceNumber || '01'} ${targetParticipant?.artist || ''}) en Preview`}
              >
                PREV
              </button>
              <button
                type="button"
                onClick={handleTakePerfId}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                  perfIdOnAir
                    ? 'bg-rose-600 text-white shadow-[0_0_6px_rgba(225,29,72,0.6)]'
                    : 'bg-slate-800 text-rose-300 hover:bg-rose-900/60'
                }`}
                title="Poner ID de actuación sobre la mosca en ON AIR"
              >
                TAKE
              </button>
              <button
                type="button"
                onClick={handleOutPerfId}
                disabled={!perfIdOnAir}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                  perfIdOnAir
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                    : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                }`}
                title="Quitar ID de actuación de ON AIR"
              >
                OUT
              </button>
            </div>
          </div>
        </div>

        {/* Right: GLOBAL TARGET PARTICIPANT SELECTOR */}
        <div className="flex items-center gap-2 bg-[#04060b] border border-cyan-500/40 rounded px-2.5 py-1">
          <span className="font-broadcast text-[10px] font-bold tracking-wider text-cyan-300 uppercase">
            TARGET PARTICIPANTE:
          </span>

          <button
            onClick={handlePrevTarget}
            className="p-0.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Participante anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <select
            value={targetParticipant?.id || ''}
            onChange={(e) => {
              const found = participants.find((p) => p.id === e.target.value);
              if (found) onSelectTarget(found);
            }}
            className="bg-transparent text-xs font-broadcast font-bold text-white uppercase outline-none cursor-pointer max-w-[220px]"
          >
            {participants.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                #{p.performanceNumber} - {p.name || p.artist} ({p.song})
              </option>
            ))}
          </select>

          <button
            onClick={handleNextTarget}
            className="p-0.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Participante siguiente"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ROW 2: Primary Quick Actions & Quick Launch Strip */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0c0f1d] gap-3">
        
        {/* Quick Actions (TAKE, OUT, PREVIEW, NEXT, REVEAL, UNDO, CLEAR, SAVE) */}
        <div className="flex items-center gap-1.5">
          {/* TAKE (Spacebar) */}
          <button
            onClick={onTake}
            disabled={!previewLayer}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded chamfer-slant font-broadcast font-black text-xs uppercase tracking-wider transition-all shadow-lg ${
              previewLayer
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-900/50 ring-1 ring-red-400 active:scale-95 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
            title="Take preview to on-air (Barra Espaciadora)"
          >
            <span className="chamfer-unslant flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              TAKE (ESPACIO)
            </span>
          </button>

          {/* OUT */}
          <button
            onClick={onTakeOut}
            disabled={onAirLayers.length === 0}
            className={`flex items-center gap-1 px-3 py-1.5 rounded chamfer-slant font-broadcast font-bold text-xs uppercase tracking-wider transition-all ${
              onAirLayers.length > 0
                ? 'bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/40 active:scale-95 cursor-pointer'
                : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
            }`}
            title="Retirar capa activa de emisión"
          >
            <span className="chamfer-unslant flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              OUT
            </span>
          </button>

          {/* NEXT */}
          <button
            onClick={handleNextTarget}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-broadcast font-bold text-xs uppercase active:scale-95 cursor-pointer"
            title="Avanzar al siguiente participante"
          >
            <SkipForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>NEXT</span>
          </button>

          {/* UNDO */}
          <button
            onClick={onUndoLastVote}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-broadcast font-bold text-xs uppercase active:scale-95 cursor-pointer"
            title="Deshacer última puntuación"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>UNDO</span>
          </button>

          {/* CLEAR ALL */}
          <button
            onClick={onClearAll}
            disabled={onAirLayers.length === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-700 font-mono text-[11px] active:scale-95 transition-all cursor-pointer"
            title="Limpiar todas las capas al aire"
          >
            <Trash2 className="w-3 h-3" />
            <span>CLEAR ALL</span>
          </button>

          {/* RESET ALL SCORES */}
          <button
            id="btn-reset-all-scores"
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 hover:text-amber-100 border border-amber-700/60 hover:border-amber-500 font-broadcast font-bold text-xs uppercase active:scale-95 transition-all cursor-pointer shadow-sm"
            title="Restablecer todas las puntuaciones del show"
          >
            <RefreshCw className="w-3 h-3 text-amber-400" />
            <span>RESET SCORES</span>
          </button>

          {/* SAVE SHOW */}
          <button
            onClick={handleSaveClick}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded font-mono text-[11px] border transition-all active:scale-95 cursor-pointer ${
              saveFlash
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Guardar estado del show"
          >
            {saveFlash ? (
              <>
                <CheckCircle className="w-3 h-3 text-white" />
                <span className="font-bold">SAVED!</span>
              </>
            ) : (
              <>
                <Save className="w-3 h-3 text-cyan-400" />
                <span>SAVE</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Launch Buttons Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pl-2 border-l border-slate-800">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold mr-1">
            QUICK LAUNCH:
          </span>

          {/* 1. LT One Person */}
          <button
            onClick={() => onOpenQuickLowerThird('one_person')}
            className="px-2 py-1 rounded bg-[#131b2e] hover:bg-cyan-950 border border-cyan-800/60 hover:border-cyan-400 text-cyan-200 text-xs font-broadcast font-bold uppercase transition-all whitespace-nowrap"
          >
            LT 1 Persona
          </button>

          {/* 2. LT Two People */}
          <button
            onClick={() => onOpenQuickLowerThird('two_people')}
            className="px-2 py-1 rounded bg-[#1e1533] hover:bg-purple-950 border border-purple-800/60 hover:border-purple-400 text-purple-200 text-xs font-broadcast font-bold uppercase transition-all whitespace-nowrap"
          >
            LT 2 Personas
          </button>

          {/* 3. LT Artist / Song */}
          <button
            onClick={() => onOpenQuickLowerThird('artist_song')}
            className="px-2 py-1 rounded bg-gradient-to-r from-cyan-950 to-purple-950 hover:from-cyan-900 hover:to-purple-900 border border-purple-500/40 text-slate-100 text-xs font-broadcast font-bold uppercase transition-all whitespace-nowrap"
          >
            LT Artista / Canción
          </button>

          {/* 4. LT Info */}
          <button
            onClick={() => onOpenQuickLowerThird('info')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-broadcast font-bold uppercase transition-all whitespace-nowrap"
          >
            LT Info
          </button>

          {/* 5. Live Bug Toggle */}
          <button
            onClick={liveBugOnAir ? handleOutLiveBug : handleTakeLiveBug}
            className={`px-2 py-1 rounded border text-xs font-broadcast font-bold uppercase transition-all whitespace-nowrap ${
              liveBugOnAir
                ? 'bg-rose-900/80 border-rose-500 text-rose-200'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-400'
            }`}
          >
            Live Bug {liveBugOnAir ? 'OUT' : 'TAKE'}
          </button>

          {/* 6. Scoreboard */}
          <button
            onClick={launchScoreboard}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-broadcast font-bold uppercase transition-all whitespace-nowrap"
          >
            Scoreboard
          </button>

          {/* 7. Top 5 */}
          <button
            onClick={launchTop5}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-broadcast font-bold uppercase transition-all whitespace-nowrap"
          >
            Top 5
          </button>

          {/* 8. Stage Ready */}
          <button
            onClick={launchStageReady}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-broadcast font-bold uppercase transition-all whitespace-nowrap"
          >
            Stage Ready
          </button>

          {/* 9. Current Leader */}
          <button
            onClick={launchCurrentLeader}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-broadcast font-bold uppercase transition-all whitespace-nowrap"
          >
            Líder
          </button>

          {/* 10. Fullscreen Classification */}
          <button
            onClick={launchClassification}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-purple-600/70 text-purple-200 text-xs font-broadcast font-bold uppercase transition-all whitespace-nowrap"
          >
            Clasificación
          </button>

          {/* 11. Top 3 Podium */}
          <button
            onClick={launchPodium}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-amber-500/70 text-amber-200 text-xs font-broadcast font-bold uppercase transition-all whitespace-nowrap"
          >
            Podio Top 3
          </button>

          {/* 12. Info Sistema */}
          <button
            onClick={launchFullscreenInfo}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-cyan-500/60 text-cyan-200 text-xs font-broadcast font-bold uppercase transition-all whitespace-nowrap"
          >
            Info Sistema
          </button>

          {/* 13. Pausa Técnica */}
          <button
            onClick={launchBreak}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-rose-600/70 text-rose-200 text-xs font-broadcast font-bold uppercase transition-all whitespace-nowrap"
          >
            Volvemos
          </button>
        </div>

      </div>

      {/* Confirmation Modal: RESET ALL SCORES */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1220] border-2 border-amber-500/70 rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              <AlertTriangle className="w-7 h-7 flex-shrink-0" />
              <h3 className="font-broadcast text-lg font-black uppercase tracking-wider text-white">
                RESET ALL SCORES
              </h3>
            </div>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to RESET ALL SCORES for this show? This will zero out jury, demoscopic, and televote points. Participants and setup will remain intact.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold uppercase transition-colors"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded bg-amber-600 hover:bg-amber-500 text-black text-xs font-broadcast font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                CONFIRM RESET
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
