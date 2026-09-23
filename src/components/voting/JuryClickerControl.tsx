import React, { useState } from 'react';
import { GraphicLayer, Show } from '../../types/broadcast';
import { applyJuryPoints, updateJuryScore } from '../../utils/scoringEngine';
import {
  Award,
  Eye,
  Radio,
  CheckCircle,
  ArrowRight,
  Minus,
  Plus,
  XCircle,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';

interface JuryClickerControlProps {
  show: Show;
  onUpdateShow: (updatedShow: Show) => void;
  onPreviewGraphic?: (layer: GraphicLayer) => void;
  onTakeGraphic?: (layer: GraphicLayer) => void;
  onTakeOutGraphic?: () => void;
  onTriggerReveal?: (participantId: string, points: number, isHighScore: boolean) => void;
}

// Common Benidorm Fest / Eurovision jury point presets
const PRESET_JURY_POINTS = [2, 4, 6, 8, 10, 12, 16, 20, 24, 30];

export const JuryClickerControl: React.FC<JuryClickerControlProps> = ({
  show,
  onUpdateShow,
  onPreviewGraphic,
  onTakeGraphic,
  onTakeOutGraphic,
  onTriggerReveal,
}) => {
  const { participants, scores } = show;

  // Filter competition participants only (special intervals never receive votes)
  const competitionParticipants = participants.filter(
    (p) => !p.isRemovedFromCompetition && !p.isSpecialInterval && p.category !== 'special_interval'
  );

  // STEP 1: Point Value (Default 12 pts)
  const [selectedPoints, setSelectedPoints] = useState<number>(12);

  // STEP 2: Selected Recipient Participant ID
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(
    competitionParticipants[0]?.id || ''
  );

  // Award history for 1-click undo
  const [recentAwards, setRecentAwards] = useState<
    Array<{ participantId: string; participantName: string; points: number; timestamp: number }>
  >([]);

  // Workflow states
  const [scoreApplied, setScoreApplied] = useState<boolean>(false);

  // Adjusters
  const handleIncrement = () => {
    setSelectedPoints((prev) => Math.min(250, prev + 1));
    setScoreApplied(false);
  };

  const handleDecrement = () => {
    setSelectedPoints((prev) => Math.max(1, prev - 1));
    setScoreApplied(false);
  };

  const handleDirectInput = (val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      setSelectedPoints(num);
      setScoreApplied(false);
    }
  };

  const selectedParticipant = participants.find((p) => p.id === selectedRecipientId);
  const isReady = Boolean(selectedRecipientId && selectedPoints > 0);

  // Helper to build the broadcast vote graphic layer
  const buildVoteLayer = (): GraphicLayer => {
    const timestamp = Date.now();
    const isSpecial12 = selectedPoints === 12;
    return {
      id: `layer-vote-jury-${timestamp}`,
      type: 'vote_award',
      name: `Voto Jurado: +${selectedPoints} PTS → ${
        selectedParticipant?.name || selectedParticipant?.artist
      }`,
      category: 'VOTING',
      isOnAir: false,
      inPreview: true,
      zIndex: 25,
      props: {
        participantId: selectedRecipientId,
        pointsAwarded: selectedPoints,
        phase: 'professionalJury',
        isHighScore: isSpecial12,
      },
    };
  };

  // STEP 3: PREVIEW
  const handlePreview = () => {
    if (!isReady) return;
    const layer = buildVoteLayer();
    if (onPreviewGraphic) {
      onPreviewGraphic(layer);
    }
  };

  // STEP 4: TAKE (Live on Air)
  const handleTake = () => {
    if (!isReady) return;
    const layer = buildVoteLayer();
    if (onTakeGraphic) {
      onTakeGraphic(layer);
    }
  };

  // STEP 5: CONFIRM / APPLY POINTS IN SCORING ENGINE
  const handleConfirmScore = () => {
    if (!selectedRecipientId || selectedPoints <= 0) return;

    const isSpecial12 = selectedPoints === 12;
    const recipient = participants.find((p) => p.id === selectedRecipientId);

    // Trigger visual broadcast reveal event if callback provided
    if (onTriggerReveal) {
      onTriggerReveal(selectedRecipientId, selectedPoints, isSpecial12);
    }

    // Apply points directly in central score engine
    const updated = applyJuryPoints(show, selectedRecipientId, selectedPoints);
    updated.votingStage = 'jury';
    updated.activeVotingPhase = 'professionalJury';
    updated.activeReveal = {
      participantId: selectedRecipientId,
      phase: 'professionalJury',
      type: 'jury',
      revealType: isSpecial12 ? 'jurySpecial12' : 'juryStandard',
      pointsAwarded: selectedPoints,
      isHighScore: isSpecial12,
      revealedAt: Date.now(),
      durationMs: isSpecial12 ? 3500 : 2500,
      recipientName: recipient?.name || recipient?.artist,
      recipientSong: recipient?.song,
    };

    onUpdateShow(updated);
    setScoreApplied(true);

    // Push to recent history
    setRecentAwards((prev) => [
      {
        participantId: selectedRecipientId,
        participantName: recipient?.name || recipient?.artist || 'Participante',
        points: selectedPoints,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 14),
    ]);
  };

  // Undo specific recent award
  const handleUndoAward = (index: number) => {
    const target = recentAwards[index];
    if (!target) return;

    // Deduct points from participant's jury score
    const currentScore = scores[target.participantId]?.juryScore || 0;
    const newScore = Math.max(0, currentScore - target.points);
    const updated = updateJuryScore(show, target.participantId, newScore);

    onUpdateShow(updated);
    setRecentAwards((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Clear all jury points (reset phase)
  const handleResetJuryPhase = () => {
    if (!window.confirm('¿Reiniciar todas las puntuaciones del Jurado Profesional a 0?')) return;

    let updated = { ...show };
    competitionParticipants.forEach((p) => {
      updated = updateJuryScore(updated, p.id, 0);
    });
    setRecentAwards([]);
    onUpdateShow(updated);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-[#090d16] rounded-md border border-slate-800 text-slate-100 select-none shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Award className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-broadcast text-xs font-bold tracking-wide uppercase text-white flex items-center gap-2">
              <span>Jurado Profesional — Control Operativo</span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-700/50">
                FASE 1
              </span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono block">
              Puntos directos → Destinatario → Preview / Take → Aplicar en Marcador
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onTakeOutGraphic && (
            <button
              onClick={onTakeOutGraphic}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-mono border border-slate-700 active:scale-95 transition-all"
              title="Retirar rótulo de emisión"
            >
              <XCircle className="w-3 h-3" />
              <span>OUT GRÁFICO</span>
            </button>
          )}
          <button
            onClick={handleResetJuryPhase}
            className="flex items-center gap-1 px-2 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-xs font-mono border border-amber-800/60 active:scale-95 transition-all"
            title="Poner a 0 las puntuaciones del jurado"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET JURADO</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Step 1 (Points) & Step 2 (Recipient) */}
      <div className="grid grid-cols-12 gap-3">
        {/* =========================================================================
            STEP 1: ENTER POINTS (Direct numeric input or presets)
            ========================================================================= */}
        <div className="col-span-6 flex flex-col gap-2 bg-slate-900/60 p-3 rounded border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="font-broadcast text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center text-[9px] font-black">
                1
              </span>
              PUNTOS DEL JURADO
            </span>
            <span className="text-[10px] font-mono text-slate-400">Entrada Directa / Predefinidos</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-400 font-mono font-bold text-xs border border-slate-700 active:scale-95"
              title="Restar 1 punto"
            >
              <Minus className="w-3 h-3" />
            </button>

            <div className="flex items-center bg-black/80 border border-purple-400/80 rounded px-3 py-1">
              <input
                type="number"
                min="1"
                max="250"
                value={selectedPoints}
                onChange={(e) => handleDirectInput(e.target.value)}
                className="w-14 bg-transparent text-center font-heavy font-mono-num text-lg font-black text-purple-300 outline-none"
              />
              <span className="font-broadcast text-[10px] font-bold text-slate-400 ml-1">PTS</span>
            </div>

            <button
              onClick={handleIncrement}
              className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-400 font-mono font-bold text-xs border border-slate-700 active:scale-95"
              title="Sumar 1 punto"
            >
              <Plus className="w-3 h-3" />
            </button>

            {/* Preset quick buttons */}
            <div className="flex-1 flex flex-wrap gap-1 justify-end">
              {PRESET_JURY_POINTS.map((pt) => (
                <button
                  key={pt}
                  onClick={() => {
                    setSelectedPoints(pt);
                    setScoreApplied(false);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                    selectedPoints === pt
                      ? pt === 12
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black shadow-md shadow-amber-500/30'
                        : 'bg-purple-500 text-white font-black shadow-md shadow-purple-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            STEP 2: SELECT RECIPIENT
            ========================================================================= */}
        <div className="col-span-6 flex flex-col gap-2 bg-slate-900/60 p-3 rounded border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="font-broadcast text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[9px] font-black">
                2
              </span>
              PARTICIPANTE DESTINATARIO
            </span>
            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
              {selectedParticipant?.artist || 'Seleccionar'}
            </span>
          </div>

          <select
            value={selectedRecipientId}
            onChange={(e) => {
              setSelectedRecipientId(e.target.value);
              setScoreApplied(false);
            }}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded px-2.5 py-1.5 text-xs font-broadcast font-bold focus:outline-none focus:border-cyan-500"
          >
            {competitionParticipants.map((p) => {
              const juryPts = scores[p.id]?.juryScore ?? 0;
              const totPts = scores[p.id]?.totalScore ?? 0;
              return (
                <option key={p.id} value={p.id}>
                  #{String(p.performanceNumber).padStart(2, '0')} — {p.artist || p.name} — «{p.song}» (Jurado: {juryPts} | Total: {totPts})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Action Bar: PREVIEW, TAKE ON AIR, CONFIRM */}
      <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded border border-slate-800">
        <div className="flex items-center gap-2">
          {onPreviewGraphic && (
            <button
              onClick={handlePreview}
              disabled={!isReady}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-broadcast font-bold border border-slate-700 active:scale-95 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>PREVIEW RÓTULO</span>
            </button>
          )}

          {onTakeGraphic && (
            <button
              onClick={handleTake}
              disabled={!isReady}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-950/80 hover:bg-rose-900 disabled:opacity-40 text-rose-200 text-xs font-broadcast font-bold border border-rose-700 active:scale-95 transition-all shadow-sm"
            >
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              <span>TAKE (A AIRE)</span>
            </button>
          )}
        </div>

        <button
          onClick={handleConfirmScore}
          disabled={!isReady}
          className={`flex items-center gap-2 px-6 py-2 rounded text-xs font-broadcast font-black uppercase tracking-wider transition-all shadow-lg active:scale-95 ${
            isReady
              ? selectedPoints === 12
                ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-black border border-amber-200 shadow-amber-500/20'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white border border-purple-400 shadow-purple-900/40'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          {scoreApplied ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>¡PUNTOS ASIGNADOS!</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-cyan-300 fill-cyan-300" />
              <span>
                APLICAR +{selectedPoints} PTS →{' '}
                {selectedParticipant?.artist || selectedParticipant?.name}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Participants Quick-Status Table & Recent History */}
      <div className="grid grid-cols-12 gap-3 pt-1">
        {/* Left: Quick Participant List with Direct Jury Scores */}
        <div className="col-span-7 bg-slate-950/60 rounded border border-slate-800/80 p-2.5 flex flex-col gap-1.5 max-h-56 overflow-y-auto">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase font-bold px-1">
            <span>Participante</span>
            <div className="flex items-center gap-4">
              <span className="text-purple-300">Jurado</span>
              <span className="text-white">Total</span>
            </div>
          </div>

          {competitionParticipants.map((p) => {
            const isSelected = p.id === selectedRecipientId;
            const juryPts = scores[p.id]?.juryScore ?? 0;
            const totPts = scores[p.id]?.totalScore ?? 0;

            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedRecipientId(p.id);
                  setScoreApplied(false);
                }}
                className={`flex items-center justify-between px-2 py-1 rounded text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-purple-900/40 border border-purple-500/60 text-white'
                    : 'hover:bg-slate-900 text-slate-300 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="font-mono text-[10px] text-slate-500">
                    #{String(p.performanceNumber).padStart(2, '0')}
                  </span>
                  <span className="font-broadcast font-bold truncate">
                    {p.artist || p.name}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 truncate hidden sm:inline">
                    «{p.song}»
                  </span>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono-num font-bold">
                  <span className="text-purple-300 text-right w-8">{juryPts}</span>
                  <span className="text-white text-right w-8">{totPts}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Recent Awards Log with 1-Click Undo */}
        <div className="col-span-5 bg-slate-950/60 rounded border border-slate-800/80 p-2.5 flex flex-col gap-1.5 max-h-56 overflow-y-auto">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase font-bold px-1">
            <span>Historial Reciente</span>
            <span>Deshacer</span>
          </div>

          {recentAwards.length === 0 ? (
            <div className="flex items-center justify-center h-28 text-[11px] text-slate-500 font-mono">
              Sin asignaciones recientes
            </div>
          ) : (
            recentAwards.map((award, idx) => (
              <div
                key={`${award.participantId}-${award.timestamp}`}
                className="flex items-center justify-between px-2 py-1 rounded bg-slate-900/70 border border-slate-800/60 text-xs"
              >
                <div className="flex items-center gap-1.5 truncate pr-2">
                  <span className="font-heavy font-mono-num text-purple-300 font-black">
                    +{award.points}
                  </span>
                  <span className="text-slate-400 text-[10px]">→</span>
                  <span className="font-broadcast font-bold truncate text-slate-200">
                    {award.participantName}
                  </span>
                </div>

                <button
                  onClick={() => handleUndoAward(idx)}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 text-[10px] font-mono border border-slate-700 active:scale-95 transition-all"
                  title="Deshacer esta puntuación"
                >
                  Deshacer
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
