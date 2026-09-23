import React, { useState, useRef, useEffect } from 'react';
import { GraphicLayer, Participant, Show } from '../../types/broadcast';
import { calculateRankings } from '../../utils/scoringEngine';
import { Award, CheckCircle2, AlertCircle, Sparkles, Send, RotateCcw } from 'lucide-react';

interface VotingControl2025Props {
  show: Show;
  onUpdateShow: (updatedShow: Show) => void;
  onPreviewGraphic?: (layer: GraphicLayer) => void;
  onTakeGraphic?: (layer: GraphicLayer) => void;
  onTakeOutGraphic?: () => void;
}

const COMMON_POINT_PRESETS = [4, 8, 12, 16, 24, 32, 40, 75, 100, 250];

/**
 * BENIDORM FEST 2025 DIRECT VOTING CONTROL INTERFACE
 * - Real controlled text input with label "POINTS TO AWARD"
 * - Supports custom positive integers (4, 8, 12, 16, 24, 32, 40, 75, 100, 250...)
 * - Strict validation for empty, zero, negative and invalid values
 * - Direct submission on Enter key press
 * - Automatically clears input and restores focus
 * - Direct point-entry workflow for Professional Jury & Public Televote without juror selectors
 */
export const VotingControl2025: React.FC<VotingControl2025Props> = ({
  show,
  onUpdateShow,
  onPreviewGraphic,
  onTakeGraphic,
}) => {
  const { participants, scores } = show;
  const competitionParticipants = participants.filter(
    (p) => !p.isRemovedFromCompetition && !p.isSpecialInterval && p.category !== 'special_interval'
  );

  // Active Phase: 'professionalJury' | 'demoscopic' | 'public'
  const [activePhase, setActivePhase] = useState<'professionalJury' | 'demoscopic' | 'public'>(
    show.activeVotingPhase || 'professionalJury'
  );

  // Selected Recipient Participant ID
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>(
    competitionParticipants[0]?.id || ''
  );

  // Controlled text input value
  const [pointsInput, setPointsInput] = useState<string>('12');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [lastAwardSuccess, setLastAwardSuccess] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync activePhase to show state when changed
  const handlePhaseChange = (phase: 'professionalJury' | 'demoscopic' | 'public') => {
    setActivePhase(phase);
    onUpdateShow({
      ...show,
      activeVotingPhase: phase,
      votingStage: phase === 'professionalJury' ? 'jury' : phase === 'public' ? 'public' : 'demoscopic',
      updatedAt: Date.now(),
    });
    setValidationError(null);
    inputRef.current?.focus();
  };

  // Submit points to scoring engine
  const handleApplyPoints = () => {
    setValidationError(null);
    setLastAwardSuccess(null);

    const trimmed = pointsInput.trim();
    if (!trimmed) {
      setValidationError('Please enter points to award.');
      inputRef.current?.focus();
      return;
    }

    const pointsNum = Number(trimmed);
    if (!Number.isInteger(pointsNum) || isNaN(pointsNum)) {
      setValidationError('Point value must be an integer.');
      inputRef.current?.focus();
      return;
    }

    if (pointsNum <= 0) {
      setValidationError('Point value must be a positive number greater than zero.');
      inputRef.current?.focus();
      return;
    }

    if (!selectedParticipantId) {
      setValidationError('Please select a recipient participant.');
      return;
    }

    const recipient = participants.find((p) => p.id === selectedParticipantId);
    if (!recipient) {
      setValidationError('Selected participant not found.');
      return;
    }

    // Update the participant's score in the active phase
    const currentScore = scores[selectedParticipantId] || {
      participantId: selectedParticipantId,
      juryScore: 0,
      demoscopicScore: 0,
      publicScore: 0,
      totalScore: 0,
      position: 1,
      previousPosition: 1,
      juryVotes: {},
      votePhaseScores: {
        professionalJury: 0,
        demoscopic: 0,
        public: 0,
      },
    };

    const phaseScores = {
      professionalJury:
        currentScore.votePhaseScores?.professionalJury ?? currentScore.juryScore ?? 0,
      demoscopic:
        currentScore.votePhaseScores?.demoscopic ?? currentScore.demoscopicScore ?? 0,
      public: currentScore.votePhaseScores?.public ?? currentScore.publicScore ?? 0,
    };

    if (activePhase === 'professionalJury') {
      phaseScores.professionalJury += pointsNum;
    } else if (activePhase === 'demoscopic') {
      phaseScores.demoscopic += pointsNum;
    } else if (activePhase === 'public') {
      phaseScores.public += pointsNum;
    }

    const newTotal = phaseScores.professionalJury + phaseScores.demoscopic + phaseScores.public;

    const updatedParticipantScore = {
      ...currentScore,
      juryScore: phaseScores.professionalJury,
      demoscopicScore: phaseScores.demoscopic,
      publicScore: phaseScores.public,
      totalScore: newTotal,
      votePhaseScores: phaseScores,
      // explicit phase fields
      professionalJuryPhaseScore: phaseScores.professionalJury,
      demoscopicPhaseScore: phaseScores.demoscopic,
      publicPhaseScore: phaseScores.public,
    };

    const newScores = {
      ...scores,
      [selectedParticipantId]: updatedParticipantScore,
    };

    const { updatedScores, newLeaderId } = calculateRankings(participants, newScores);

    const updatedShow: Show = {
      ...show,
      activeVotingPhase: activePhase,
      scores: updatedScores,
      currentLeaderId: newLeaderId || show.currentLeaderId,
      updatedAt: Date.now(),
    };

    onUpdateShow(updatedShow);

    // Provide visual feedback
    const phaseLabel =
      activePhase === 'professionalJury' ? 'JURADO' : activePhase === 'public' ? 'TELEVOTO' : 'DEMOSCÓPICO';
    setLastAwardSuccess(`+${pointsNum} PTS aplicados a ${recipient.name || recipient.artist} (${phaseLabel})`);

    // Reset input and return focus
    setPointsInput('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyPoints();
    }
  };

  const selectedParticipant = participants.find((p) => p.id === selectedParticipantId);
  const currentRecipientScore = selectedParticipantId ? scores[selectedParticipantId] : undefined;

  return (
    <div className="flex flex-col h-full bg-[#080C1E] text-slate-100 p-4 select-none overflow-y-auto">
      {/* 1. PHASE SELECTOR BUTTONS */}
      <div className="mb-4">
        <div className="text-[11px] font-broadcast font-bold uppercase tracking-wider text-[#8EDCFF] mb-1.5 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#FFD900]" />
          <span>1. FASE DE VOTACIÓN ACTIVA</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handlePhaseChange('professionalJury')}
            className={`py-2 px-3 border font-broadcast font-black text-xs uppercase tracking-wider transition-all ${
              activePhase === 'professionalJury'
                ? 'bg-[#246BFF] text-white border-[#8EDCFF] shadow-[0_0_15px_rgba(36,107,255,0.4)]'
                : 'bg-[#0F163D] text-slate-300 border-[#246BFF]/40 hover:bg-[#16215A]'
            }`}
          >
            PROFESSIONAL JURY (50%)
          </button>
          <button
            type="button"
            onClick={() => handlePhaseChange('public')}
            className={`py-2 px-3 border font-broadcast font-black text-xs uppercase tracking-wider transition-all ${
              activePhase === 'public'
                ? 'bg-[#F21878] text-[#FFD900] border-[#FFD900] shadow-[0_0_15px_rgba(242,24,120,0.4)]'
                : 'bg-[#0F163D] text-slate-300 border-[#246BFF]/40 hover:bg-[#16215A]'
            }`}
          >
            PUBLIC / TELEVOTE (50%)
          </button>
          <button
            type="button"
            onClick={() => handlePhaseChange('demoscopic')}
            className={`py-2 px-3 border font-broadcast font-black text-xs uppercase tracking-wider transition-all ${
              activePhase === 'demoscopic'
                ? 'bg-[#FFD900] text-[#101B55] border-[#FFD900]'
                : 'bg-[#0F163D] text-slate-400 border-[#246BFF]/40 hover:bg-[#16215A]'
            }`}
          >
            DEMOSCOPIC
          </button>
        </div>
      </div>

      {/* 2. PARTICIPANT SELECTION GRID */}
      <div className="mb-4">
        <div className="text-[11px] font-broadcast font-bold uppercase tracking-wider text-[#8EDCFF] mb-1.5 flex items-center justify-between">
          <span>2. SELECCIONAR ARTISTA RECEPTOR</span>
          {selectedParticipant && (
            <span className="text-[#FFD900] font-mono">
              Total Actual: {currentRecipientScore?.totalScore ?? 0} PTS
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {competitionParticipants.map((p) => {
            const isSelected = selectedParticipantId === p.id;
            const pScore = scores[p.id];
            const phasePts =
              activePhase === 'professionalJury'
                ? pScore?.votePhaseScores?.professionalJury ?? pScore?.juryScore ?? 0
                : activePhase === 'public'
                ? pScore?.votePhaseScores?.public ?? pScore?.publicScore ?? 0
                : pScore?.votePhaseScores?.demoscopic ?? pScore?.demoscopicScore ?? 0;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedParticipantId(p.id);
                  inputRef.current?.focus();
                }}
                className={`p-2 border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-[#FFD900] bg-[#1A2566] shadow-[0_0_12px_rgba(255,217,0,0.3)]'
                    : 'border-[#246BFF]/40 bg-[#0B1130] hover:bg-[#111B4C] hover:border-[#246BFF]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#FFD900]">
                    #{String(p.performanceNumber).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-xs font-black text-white">
                    {pScore?.totalScore ?? 0} pts
                  </span>
                </div>
                <div className="font-heavy text-xs font-black uppercase text-white truncate mt-1">
                  {p.name || p.artist}
                </div>
                <div className="text-[10px] font-mono text-[#8EDCFF] truncate">
                  Fase: +{phasePts}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. POINTS TO AWARD TEXT INPUT */}
      <div className="bg-[#0D153B] border-2 border-[#246BFF] p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="bf25-points-to-award-input"
            className="text-[13px] font-broadcast font-black uppercase tracking-widest text-[#FFD900]"
          >
            POINTS TO AWARD
          </label>
          <span className="text-[11px] font-mono text-[#8EDCFF]">
            Enter key para aplicar
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Direct Controlled Numeric Input */}
          <div className="relative flex-1">
            <input
              id="bf25-points-to-award-input"
              ref={inputRef}
              type="number"
              min="1"
              max="999"
              placeholder="Enter points..."
              value={pointsInput}
              onChange={(e) => {
                setPointsInput(e.target.value);
                setValidationError(null);
              }}
              onKeyDown={handleKeyDown}
              className="w-full h-12 bg-[#070B1F] border-2 border-[#246BFF] focus:border-[#FFD900] focus:ring-1 focus:ring-[#FFD900] text-white px-4 font-mono font-black text-2xl outline-none placeholder:text-slate-600 placeholder:text-base placeholder:font-sans transition-all"
            />
          </div>

          {/* Apply Points Action Button */}
          <button
            type="button"
            id="btn-apply-points-2025"
            onClick={handleApplyPoints}
            className="h-12 px-6 bg-[#FFD900] hover:bg-yellow-300 text-[#101B55] font-broadcast font-black text-sm uppercase tracking-widest flex items-center gap-2 border-2 border-[#FFD900] active:scale-98 transition-all shrink-0 shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>APPLY POINTS</span>
          </button>
        </div>

        {/* Quick Click Preset Buttons */}
        <div className="flex items-center flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#246BFF]/30">
          <span className="text-[10px] font-broadcast font-bold uppercase text-slate-400 mr-1">
            PRESETS:
          </span>
          {COMMON_POINT_PRESETS.map((pt) => (
            <button
              key={pt}
              type="button"
              onClick={() => {
                setPointsInput(String(pt));
                setValidationError(null);
                inputRef.current?.focus();
              }}
              className="px-2.5 py-1 bg-[#101B55] hover:bg-[#246BFF] text-[#8EDCFF] hover:text-white border border-[#246BFF]/60 font-mono font-bold text-xs uppercase transition-all"
            >
              +{pt}
            </button>
          ))}
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="mt-3 p-2 bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Success Feedback Alert */}
        {lastAwardSuccess && (
          <div className="mt-3 p-2 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{lastAwardSuccess}</span>
          </div>
        )}
      </div>

      {/* 4. BROADCAST OVERLAY GRAPHIC TRIGGER */}
      {onPreviewGraphic && onTakeGraphic && (
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              if (!selectedParticipant) return;
              const pts = Number(pointsInput) || 12;
              const layer: GraphicLayer = {
                id: `layer-vote-2025-${Date.now()}`,
                type: 'vote_award',
                name: `Voto 2025: +${pts} PTS → ${selectedParticipant.name || selectedParticipant.artist}`,
                category: 'VOTING',
                isOnAir: false,
                inPreview: true,
                zIndex: 30,
                props: {
                  participantId: selectedParticipantId,
                  pointsAwarded: pts,
                  phase: activePhase,
                  recipient: selectedParticipant,
                },
              };
              onPreviewGraphic(layer);
            }}
            className="flex-1 py-2 bg-[#101B55] hover:bg-[#16246E] text-[#8EDCFF] border border-[#246BFF] font-broadcast font-bold text-xs uppercase tracking-wider transition-all text-center"
          >
            PREVIEW GRÁFICO REVELACIÓN
          </button>
          <button
            type="button"
            onClick={() => {
              if (!selectedParticipant) return;
              const pts = Number(pointsInput) || 12;
              const layer: GraphicLayer = {
                id: `layer-vote-2025-${Date.now()}`,
                type: 'vote_award',
                name: `Voto 2025: +${pts} PTS → ${selectedParticipant.name || selectedParticipant.artist}`,
                category: 'VOTING',
                isOnAir: true,
                inPreview: false,
                zIndex: 30,
                props: {
                  participantId: selectedParticipantId,
                  pointsAwarded: pts,
                  phase: activePhase,
                  recipient: selectedParticipant,
                },
              };
              onTakeGraphic(layer);
            }}
            className="flex-1 py-2 bg-[#F21878] hover:bg-pink-600 text-white font-broadcast font-black text-xs uppercase tracking-wider transition-all text-center shadow-md"
          >
            LANZAR A DIRECTO (ON AIR)
          </button>
        </div>
      )}
    </div>
  );
};
