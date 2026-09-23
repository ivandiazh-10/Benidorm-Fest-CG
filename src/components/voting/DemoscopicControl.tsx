import React, { useState } from 'react';
import { GraphicLayer, Participant, Show } from '../../types/broadcast';
import { updateDemoscopicScore } from '../../utils/scoringEngine';
import { Users, Eye, Radio, CheckCircle, ArrowRight, Minus, Plus, XCircle } from 'lucide-react';

interface DemoscopicControlProps {
  show: Show;
  onUpdateShow: (updatedShow: Show) => void;
  onPreviewGraphic?: (layer: GraphicLayer) => void;
  onTakeGraphic?: (layer: GraphicLayer) => void;
  onTakeOutGraphic?: () => void;
}

// Benidorm Fest 4-point block increments
const PRESET_4_POINTS = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];

export const DemoscopicControl: React.FC<DemoscopicControlProps> = ({
  show,
  onUpdateShow,
  onPreviewGraphic,
  onTakeGraphic,
  onTakeOutGraphic,
}) => {
  const { participants, scores } = show;

  // Filter competition participants only (special intervals never receive votes)
  const competitionParticipants = participants.filter(
    (p) => !p.isRemovedFromCompetition && !p.isSpecialInterval && p.category !== 'special_interval'
  );

  // STEP 1: Point Value (Default 16 pts, blocks of 4)
  const [selectedPoints, setSelectedPoints] = useState<number>(16);

  // STEP 2: Selected Recipient Participant ID
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(
    competitionParticipants[0]?.id || ''
  );

  // Workflow states
  const [scoreApplied, setScoreApplied] = useState<boolean>(false);

  // Adjusters (+4 / -4)
  const handleIncrement = () => {
    setSelectedPoints((prev) => Math.min(100, prev + 4));
    setScoreApplied(false);
  };

  const handleDecrement = () => {
    setSelectedPoints((prev) => Math.max(0, prev - 4));
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
    return {
      id: `layer-vote-demo-${timestamp}`,
      type: 'vote_award',
      name: `Voto Demoscópico: +${selectedPoints} PTS → ${selectedParticipant?.name || selectedParticipant?.artist}`,
      category: 'VOTING',
      isOnAir: false,
      inPreview: true,
      zIndex: 25,
      props: {
        participantId: selectedRecipientId,
        pointsAwarded: selectedPoints,
        phase: 'demoscopic',
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

  // STEP 5: CONFIRM SCORE IN SCORING ENGINE
  const handleConfirmScore = () => {
    if (!selectedRecipientId || selectedPoints <= 0) return;

    // Update persistent scoring engine
    const updated = updateDemoscopicScore(show, selectedRecipientId, selectedPoints);
    updated.votingStage = 'demoscopic';
    updated.activeVotingPhase = 'demoscopic';
    updated.activeReveal = {
      participantId: selectedRecipientId,
      phase: 'demoscopic',
      type: 'demoscopic',
      revealType: 'demoscopicReveal',
      pointsAwarded: selectedPoints,
      isHighScore: selectedPoints >= 36,
      revealedAt: Date.now(),
      durationMs: 4000,
      recipientName: selectedParticipant?.name || selectedParticipant?.artist,
      recipientSong: selectedParticipant?.song,
    };

    onUpdateShow(updated);
    setScoreApplied(true);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-[#090d16] rounded-md border border-slate-800 text-slate-100 select-none shadow-xl">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-broadcast text-xs font-bold tracking-wide uppercase text-white">
              Voto Demoscópico — Control Operativo
            </h2>
            <span className="text-[10px] text-slate-400 font-mono block">
              1. Puntos → 2. Destinatario → 3. Preview → 4. Take → 5. Confirmar en Marcador
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onTakeOutGraphic && (
            <button
              onClick={onTakeOutGraphic}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-mono border border-slate-700 active:scale-95"
              title="Retirar gráfico de emisión"
            >
              <XCircle className="w-3 h-3" />
              <span>OUT GRÁFICO</span>
            </button>
          )}
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
            FASE 2: DEMOSCÓPICO
          </span>
        </div>
      </div>

      {/* Grid Layout: Step 1 & Step 2 */}
      <div className="grid grid-cols-12 gap-3">
        
        {/* =========================================================================
            STEP 1: ENTER POINTS (4-Point increments)
            ========================================================================= */}
        <div className="col-span-6 flex flex-col gap-2 bg-slate-900/60 p-3 rounded border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="font-broadcast text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[9px] font-black">
                1
              </span>
              PUNTOS ASIGNADOS
            </span>
            <span className="text-[10px] font-mono text-slate-400">Bloques de 4</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono font-bold text-xs border border-slate-700 active:scale-95"
            >
              <Minus className="w-3 h-3" />
            </button>

            <div className="flex items-center bg-black/80 border border-cyan-400/80 rounded px-3 py-1">
              <input
                type="number"
                step="4"
                min="0"
                max="100"
                value={selectedPoints}
                onChange={(e) => handleDirectInput(e.target.value)}
                className="w-12 bg-transparent text-center font-heavy font-mono-num text-lg font-black text-cyan-300 outline-none"
              />
              <span className="font-broadcast text-[10px] font-bold text-slate-400 ml-1">PTS</span>
            </div>

            <button
              onClick={handleIncrement}
              className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono font-bold text-xs border border-slate-700 active:scale-95"
            >
              <Plus className="w-3 h-3" />
            </button>

            {/* Quick buttons */}
            <div className="flex-1 flex flex-wrap gap-1 justify-end">
              {PRESET_4_POINTS.slice(0, 8).map((pt) => (
                <button
                  key={pt}
                  onClick={() => {
                    setSelectedPoints(pt);
                    setScoreApplied(false);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    selectedPoints === pt
                      ? 'bg-cyan-500 text-black font-black'
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
            <span className="font-broadcast text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center text-[9px] font-black">
                2
              </span>
              DESTINATARIO
            </span>
            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
              {selectedParticipant?.artist || 'Seleccionar'}
            </span>
          </div>

          <select
            value={selectedRecipientId}
            onChange={(e) => {
              setSelectedRecipientId(e.target.value);
              setScoreApplied(false);
            }}
            className="w-full bg-slate-950 border border-purple-500/40 rounded px-2.5 py-1.5 text-xs font-broadcast font-bold text-white uppercase focus:outline-none focus:border-purple-400"
          >
            {competitionParticipants.map((p) => {
              const currentScore = scores[p.id]?.demoscopicScore ?? 0;
              return (
                <option key={p.id} value={p.id}>
                  #{p.performanceNumber} - {p.name || p.artist} (Demoscópico: {currentScore} pts | Total: {scores[p.id]?.totalScore ?? 0} pts)
                </option>
              );
            })}
          </select>
        </div>

      </div>

      {/* =========================================================================
          STEPS 3, 4, 5: PREVIEW → TAKE ON AIR → CONFIRM SCORE
          ========================================================================= */}
      <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase">PREPARADO:</span>
            <span className="font-broadcast text-xs font-black text-white uppercase">
              <span className="text-cyan-400 font-mono-num font-bold">+{selectedPoints} PTS</span> →{' '}
              <span className="text-amber-300">{selectedParticipant?.name || selectedParticipant?.artist}</span>
            </span>
          </div>

          {scoreApplied && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono">
              <CheckCircle className="w-3 h-3" />
              CONFIRMADO EN MARCADOR
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* STEP 3: PREVIEW */}
          <button
            onClick={handlePreview}
            disabled={!isReady}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded chamfer-slant bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-broadcast font-bold text-xs uppercase transition-all active:scale-95 cursor-pointer"
          >
            <span className="chamfer-unslant flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              3. PREVIEW
            </span>
          </button>

          {/* STEP 4: TAKE (Live on Air) */}
          <button
            onClick={handleTake}
            disabled={!isReady}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded chamfer-slant bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-broadcast font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span className="chamfer-unslant flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-white" />
              4. TAKE ON AIR
            </span>
          </button>

          <ArrowRight className="w-3 h-3 text-slate-600" />

          {/* STEP 5: CONFIRM SCORE IN SCORING ENGINE */}
          <button
            onClick={handleConfirmScore}
            disabled={!isReady || scoreApplied}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded chamfer-slant font-broadcast font-bold text-xs uppercase tracking-wider transition-all ${
              scoreApplied
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 cursor-pointer'
            }`}
          >
            <span className="chamfer-unslant flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-white" />
              5. APLICAR MARCADOR
            </span>
          </button>
        </div>
      </div>

    </div>
  );
};
