import React, { useState } from 'react';
import { Participant, Show } from '../../types/broadcast';
import {
  Plus,
  Trash2,
  Edit3,
  Copy,
  Search,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  UserMinus,
  UserCheck,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { generateDefaultParticipants } from '../../utils/sampleData';
import {
  removeParticipantFromCompetition,
  restoreParticipantToCompetition,
  resetParticipantScore,
  deleteParticipantPermanently,
} from '../../utils/scoringEngine';
import { useRanking } from '../../utils/hooks/useRanking';

interface ParticipantManagerProps {
  show: Show;
  onUpdateShow: (updatedShow: Show) => void;
}

export const ParticipantManager: React.FC<ParticipantManagerProps> = ({
  show,
  onUpdateShow,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'interval' | 'removed'>('all');
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Confirmation modal states
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<Participant | null>(null);
  const [resetScoreTarget, setResetScoreTarget] = useState<Participant | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formArtist, setFormArtist] = useState('');
  const [formSong, setFormSong] = useState('');
  const [formCategory, setFormCategory] = useState<'competition' | 'special_interval'>('competition');
  const [formNumber, setFormNumber] = useState<number>(show.participants.length + 1);
  const [formComposers, setFormComposers] = useState('');
  const [formArrangers, setFormArrangers] = useState('');
  const [formSmsKeyword, setFormSmsKeyword] = useState('');
  const [formPhone, setFormPhone] = useState('');

  // Authoritative ranking hook for reliable positions and scores
  const { getParticipantRank, getParticipantScore } = useRanking(show);

  const activeCount = show.participants.filter((p) => !p.isRemovedFromCompetition && !p.isSpecialInterval && p.category !== 'special_interval').length;
  const intervalCount = show.participants.filter((p) => !p.isRemovedFromCompetition && (p.isSpecialInterval || p.category === 'special_interval')).length;
  const removedCount = show.participants.filter((p) => !!p.isRemovedFromCompetition).length;

  const filteredParticipants = show.participants.filter((p) => {
    const isInterval = p.isSpecialInterval || p.category === 'special_interval';
    if (statusFilter === 'active' && (p.isRemovedFromCompetition || isInterval)) return false;
    if (statusFilter === 'interval' && (p.isRemovedFromCompetition || !isInterval)) return false;
    if (statusFilter === 'removed' && !p.isRemovedFromCompetition) return false;

    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.artist.toLowerCase().includes(q) ||
      p.song.toLowerCase().includes(q) ||
      String(p.performanceNumber).includes(q)
    );
  });

  const openCreateModal = () => {
    setEditingParticipant(null);
    setFormName('');
    setFormArtist('');
    setFormSong('');
    setFormCategory('competition');
    const nextNum = show.participants.length + 1;
    setFormNumber(nextNum);
    setFormComposers('');
    setFormArrangers('');
    setFormSmsKeyword('');
    setFormPhone(`905 810 0${String(nextNum).padStart(2, '0')}`);
    setIsCreating(true);
  };

  const openEditModal = (p: Participant) => {
    setEditingParticipant(p);
    setFormName(p.name);
    setFormArtist(p.artist);
    setFormSong(p.song);
    setFormCategory(p.category || (p.isSpecialInterval ? 'special_interval' : 'competition'));
    setFormNumber(p.performanceNumber);
    setFormComposers(p.composers || '');
    setFormArrangers(p.arrangers || '');
    setFormSmsKeyword(p.smsKeyword || `VOTA ${p.name}`);
    setFormPhone(p.phone || `905 810 0${String(p.performanceNumber).padStart(2, '0')}`);
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() && !formArtist.trim()) return;

    const artist = formArtist.trim() || formName.trim();
    const name = formName.trim() || formArtist.trim();
    const song = formSong.trim() || 'Canción Oficial';
    const isSpecial = formCategory === 'special_interval';

    if (editingParticipant) {
      const updatedList = show.participants.map((p) =>
        p.id === editingParticipant.id
          ? {
              ...p,
              name,
              artist,
              song,
              category: formCategory,
              isSpecialInterval: isSpecial,
              performanceNumber: Number(formNumber),
              composers: formComposers.trim() || undefined,
              arrangers: formArrangers.trim() || undefined,
              smsKeyword: formSmsKeyword.trim() || `VOTA ${name}`,
              phone: formPhone.trim() || `905 810 0${String(formNumber).padStart(2, '0')}`,
            }
          : p
      );
      onUpdateShow({ ...show, participants: updatedList });
    } else {
      const newParticipant: Participant = {
        id: `participant-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name,
        artist,
        song,
        category: formCategory,
        isSpecialInterval: isSpecial,
        performanceNumber: Number(formNumber),
        composers: formComposers.trim() || undefined,
        arrangers: formArrangers.trim() || undefined,
        smsKeyword: formSmsKeyword.trim() || `VOTA ${name}`,
        phone: formPhone.trim() || `905 810 0${String(formNumber).padStart(2, '0')}`,
        isRemovedFromCompetition: false,
      };

      const updatedScores = {
        ...show.scores,
        [newParticipant.id]: {
          participantId: newParticipant.id,
          juryScore: 0,
          demoscopicScore: 0,
          publicScore: 0,
          totalScore: 0,
          position: show.participants.length + 1,
          previousPosition: show.participants.length + 1,
          juryVotes: {},
        },
      };

      onUpdateShow({
        ...show,
        participants: [...show.participants, newParticipant],
        scores: updatedScores,
      });
    }

    setIsCreating(false);
  };

  const handleToggleCompetitionStatus = (p: Participant) => {
    if (p.isRemovedFromCompetition) {
      const updated = restoreParticipantToCompetition(show, p.id);
      onUpdateShow(updated);
    } else {
      const updated = removeParticipantFromCompetition(show, p.id);
      onUpdateShow(updated);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return;
    const updated = deleteParticipantPermanently(show, deleteConfirmTarget.id);
    onUpdateShow(updated);
    setDeleteConfirmTarget(null);
  };

  const handleConfirmResetScore = () => {
    if (!resetScoreTarget) return;
    const updated = resetParticipantScore(show, resetScoreTarget.id);
    onUpdateShow(updated);
    setResetScoreTarget(null);
  };

  const handleDuplicate = (p: Participant) => {
    const nextNum = show.participants.length + 1;
    const duplicated: Participant = {
      ...p,
      id: `participant-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: `${p.name} (Copy)`,
      artist: `${p.artist} (Copy)`,
      performanceNumber: nextNum,
      isRemovedFromCompetition: false,
    };
    onUpdateShow({
      ...show,
      participants: [...show.participants, duplicated],
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= show.participants.length) return;

    const list = [...show.participants];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const reindexed = list.map((p, idx) => ({
      ...p,
      performanceNumber: idx + 1,
    }));

    onUpdateShow({ ...show, participants: reindexed });
  };

  const handleResetToBenidormLineup = () => {
    if (confirm('Load standard Benidorm Fest lineup (16 participants)?')) {
      const defaultLineup = generateDefaultParticipants();
      onUpdateShow({ ...show, participants: defaultLineup });
    }
  };

  const handleWipeAll = () => {
    if (confirm('Wipe all participants and start completely blank?')) {
      onUpdateShow({ ...show, participants: [], scores: {} });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] border-r border-slate-800 select-none">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-[#0d111a] flex items-center justify-between">
        <div>
          <h2 className="font-broadcast text-sm font-bold tracking-wide uppercase text-slate-100 flex items-center gap-2">
            <span>Participants</span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
              {activeCount} COMP {intervalCount > 0 ? `/ ${intervalCount} GUEST` : ''} {removedCount > 0 ? `/ ${removedCount} RET` : ''}
            </span>
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Running Order & Competition Status
          </span>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-broadcast font-bold uppercase tracking-wider transition-colors shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          ADD ARTIST
        </button>
      </div>

      {/* Search, Filter & Quick Utilities */}
      <div className="p-2 border-b border-slate-800 bg-[#080b11] flex flex-col gap-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search candidate, song, #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2 py-0.5 rounded transition-colors ${
              statusFilter === 'all'
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            All ({show.participants.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-2 py-0.5 rounded transition-colors ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Competición ({activeCount})
          </button>
          {intervalCount > 0 && (
            <button
              onClick={() => setStatusFilter('interval')}
              className={`px-2 py-0.5 rounded transition-colors ${
                statusFilter === 'interval'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              Invitados ({intervalCount})
            </button>
          )}
          {removedCount > 0 && (
            <button
              onClick={() => setStatusFilter('removed')}
              className={`px-2 py-0.5 rounded transition-colors ${
                statusFilter === 'removed'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              Retirados ({removedCount})
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-800/60">
          <button
            onClick={handleResetToBenidormLineup}
            className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Preset Lineup
          </button>

          <button
            onClick={handleWipeAll}
            className="text-rose-400 hover:text-rose-300"
          >
            Wipe All
          </button>
        </div>
      </div>

      {/* Participant List */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
        {filteredParticipants.length === 0 ? (
          <div className="py-8 text-center text-slate-500 font-mono text-xs">
            No participants found. Click "ADD ARTIST" above.
          </div>
        ) : (
          filteredParticipants.map((p, index) => {
            const isRemoved = !!p.isRemovedFromCompetition;
            const currentScore = show.scores[p.id];

            return (
              <div
                key={p.id}
                className={`p-2 rounded border flex flex-col gap-1.5 transition-colors ${
                  isRemoved
                    ? 'bg-amber-950/20 border-amber-800/40 opacity-75'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Reorder & Number */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMove(index, 'up')}
                        className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20"
                      >
                        <ArrowUp className="w-2.5 h-2.5" />
                      </button>
                      <button
                        disabled={index === show.participants.length - 1}
                        onClick={() => handleMove(index, 'down')}
                        className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20"
                      >
                        <ArrowDown className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <div
                      className={`w-7 h-7 rounded flex items-center justify-center font-mono font-black text-xs border ${
                        isRemoved
                          ? 'bg-rose-950 text-rose-300 border-rose-700/60'
                          : (p.isSpecialInterval || p.category === 'special_interval')
                          ? 'bg-amber-950 text-amber-300 border-amber-500/60'
                          : 'bg-indigo-950 text-indigo-300 border-indigo-700/60'
                      }`}
                    >
                      {String(p.performanceNumber).padStart(2, '0')}
                    </div>

                    <div className="flex flex-col min-w-0 max-w-[130px]">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-broadcast text-xs font-bold uppercase truncate ${
                            isRemoved ? 'line-through text-rose-300/80' : 'text-white'
                          }`}
                        >
                          {p.name || p.artist}
                        </span>
                        {(p.isSpecialInterval || p.category === 'special_interval') && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-600/50">
                            GUEST
                          </span>
                        )}
                      </div>
                      <span className="font-broadcast text-[11px] text-purple-300/80 truncate">
                        {p.song}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1">
                    {/* Status Toggle: Remove / Restore */}
                    <button
                      onClick={() => handleToggleCompetitionStatus(p)}
                      className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 font-mono ${
                        isRemoved
                          ? 'bg-amber-800/60 hover:bg-emerald-700 text-amber-100 hover:text-white'
                          : 'hover:bg-slate-800 text-slate-400 hover:text-amber-400'
                      }`}
                      title={
                        isRemoved
                          ? 'Restore to active competition'
                          : 'Remove from active competition (data preserved)'
                      }
                    >
                      {isRemoved ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] uppercase font-bold text-emerald-300">RESTORE</span>
                        </>
                      ) : (
                        <UserMinus className="w-3.5 h-3.5 text-slate-400 hover:text-amber-400" />
                      )}
                    </button>

                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300"
                      title="Edit Profile"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setResetScoreTarget(p)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-purple-300"
                      title="Reset Scores for this participant"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmTarget(p)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                      title="Permanently Delete Participant"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status bar & points indicator */}
                <div className="flex items-center justify-between text-[10px] font-mono px-1 pt-1 border-t border-slate-800/40 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {isRemoved ? (
                      <span className="text-rose-400 font-bold uppercase tracking-wider">
                        • REMOVED FROM COMPETITION
                      </span>
                    ) : (p.isSpecialInterval || p.category === 'special_interval') ? (
                      <span className="text-amber-400 font-semibold uppercase tracking-wider">
                        • ACTUACIÓN ESPECIAL (NO COMPITE)
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold uppercase tracking-wider">
                        • ACTIVE COMPETITOR #{getParticipantRank(p.id) > 0 ? getParticipantRank(p.id) : '-'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!(p.isSpecialInterval || p.category === 'special_interval') && (
                      <span className="text-slate-300">
                        Total: <strong className="text-white">{getParticipantScore(p.id)?.totalScore ?? currentScore?.totalScore ?? 0} pts</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CONFIRMATION MODAL: DELETE PARTICIPANT PERMANENTLY */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e131f] border border-rose-600/70 rounded-lg p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
            <div className="flex items-center gap-3 text-rose-400 border-b border-rose-900/50 pb-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="font-broadcast text-base font-bold uppercase text-white">
                  DELETE PARTICIPANT PERMANENTLY?
                </h3>
                <span className="text-xs font-mono text-rose-300">Irreversible broadcast operation</span>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to permanently erase{' '}
              <strong className="text-white font-bold uppercase">
                {deleteConfirmTarget.name || deleteConfirmTarget.artist}
              </strong>{' '}
              from this show?
            </p>

            <div className="bg-amber-950/40 border border-amber-800/50 rounded p-2.5 text-xs text-amber-200/90 font-mono">
              💡 <strong>Tip:</strong> If you only want to exclude this artist from the active ranking without destroying their record, use <strong>REMOVE FROM COMPETITION</strong> instead.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-broadcast font-bold uppercase tracking-wider"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-broadcast font-bold uppercase tracking-wider shadow-lg shadow-rose-900/40"
              >
                DELETE PERMANENTLY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: RESET PARTICIPANT SCORES */}
      {resetScoreTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e131f] border border-amber-500/60 rounded-lg p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
            <div className="flex items-center gap-3 text-amber-400 border-b border-amber-900/50 pb-3">
              <RotateCcw className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="font-broadcast text-base font-bold uppercase text-white">
                  RESET PARTICIPANT SCORES?
                </h3>
                <span className="text-xs font-mono text-amber-300">Participant scores will return to 0</span>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              Clear all jury, demoscopic, and televote scores for{' '}
              <strong className="text-white font-bold uppercase">
                {resetScoreTarget.name || resetScoreTarget.artist}
              </strong>
              ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetScoreTarget(null)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-broadcast font-bold uppercase tracking-wider"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmResetScore}
                className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-broadcast font-bold uppercase tracking-wider"
              >
                RESET SCORES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg bg-[#0e131f] border border-purple-500/40 rounded-lg p-5 shadow-2xl flex flex-col gap-4 text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-broadcast text-base font-bold text-white uppercase">
                {editingParticipant ? 'Edit Participant' : 'Create New Participant'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Categoría
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as 'competition' | 'special_interval')}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                >
                  <option value="competition">Participante en Competición (Entra a Marcador)</option>
                  <option value="special_interval">Actuación Especial (Interval / Invitado - Fuera de Marcador)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Running # (Nº Actuación)
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={formNumber}
                  onChange={(e) => setFormNumber(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Artist / Group Name
                </label>
                <input
                  type="text"
                  required
                  value={formArtist}
                  onChange={(e) => setFormArtist(e.target.value)}
                  placeholder="e.g. Nebulossa"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Short Display Name (Graphics)
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. NEBULOSSA"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Song Title
              </label>
              <input
                type="text"
                required
                value={formSong}
                onChange={(e) => setFormSong(e.target.value)}
                placeholder="e.g. ZORRA"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Composers / Lyrics
                </label>
                <input
                  type="text"
                  value={formComposers}
                  onChange={(e) => setFormComposers(e.target.value)}
                  placeholder="e.g. María Bas, Mark Dasousa"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Producers / Arrangers
                </label>
                <input
                  type="text"
                  value={formArrangers}
                  onChange={(e) => setFormArrangers(e.target.value)}
                  placeholder="e.g. Atomic Studio"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  SMS Voting Keyword
                </label>
                <input
                  type="text"
                  value={formSmsKeyword}
                  onChange={(e) => setFormSmsKeyword(e.target.value)}
                  placeholder="e.g. VOTA NEBULOSSA"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Phone Voting Number
                </label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="e.g. 905 810 001"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-broadcast font-bold uppercase tracking-wider transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-broadcast font-bold uppercase tracking-wider shadow-lg shadow-purple-900/50 transition-colors"
              >
                {editingParticipant ? 'SAVE CHANGES' : 'CREATE PARTICIPANT'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
