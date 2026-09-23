import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GraphicLayer, Participant, PreviewSettings, Show } from './types/broadcast';
import {
  loadShow,
  loadAllShows,
  saveShow,
  setActiveShowId,
  loadPreviewLayer,
  savePreviewLayer,
  loadOnAirLayers,
  saveOnAirLayers,
} from './utils/storage';
import { recalculateJuryScores, resetAllScores } from './utils/scoringEngine';
import { load2025HistoricalScores, reset2025ScoresToBlank } from './utils/sampleData2025';
import { load2024HistoricalScores, reset2024ScoresToBlank } from './utils/sampleData2024';
import { BroadcastSyncBus } from './utils/broadcastChannel';
import { ControlRoomHeader } from './components/navigation/ControlRoomHeader';
import { ParticipantManager } from './components/participants/ParticipantManager';
import { PreviewMonitor } from './components/preview/PreviewMonitor';
import { JuryClickerControl } from './components/voting/JuryClickerControl';
import { DemoscopicControl } from './components/voting/DemoscopicControl';
import { PublicControl } from './components/voting/PublicControl';
import { VotingControl2025 } from './components/voting/VotingControl2025';
import { isBenidormFest2025 } from './utils/visualProfiles';
import { GraphicsCatalog } from './components/graphicsLibrary/GraphicsCatalog';
import { OnAirLayersPanel } from './components/graphicsLibrary/OnAirLayersPanel';
import { OBSOutputWindow } from './components/obs/OBSOutputWindow';
import { QuickOperationsBar } from './components/controlRoom/QuickOperationsBar';
import { Users, Vote, Flame, Radio, Award, Tv, AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  // Check if current URL is OBS output window mode
  const [isOBSWindow, setIsOBSWindow] = useState<boolean>(() => {
    return (
      window.location.pathname.includes('/obs') ||
      window.location.search.includes('obs=true') ||
      window.location.hash.includes('obs')
    );
  });

  // Multi-Show list & active show state
  const [allShows, setAllShows] = useState<Show[]>(() => loadAllShows());
  const [show, setShow] = useState<Show>(() => loadShow());

  // Show switching and preset handlers
  const handleSelectShow = useCallback((showId: string) => {
    setActiveShowId(showId);
    const freshShows = loadAllShows();
    setAllShows(freshShows);
    const found = freshShows.find((s) => s.id === showId);
    if (found) {
      setShow(found);
      setTargetParticipantId(found.participants[0]?.id || '');
      setOnAirLayers([]);
      setPreviewLayer(null);
    }
  }, []);

  const handleLoad2025Historical = useCallback(() => {
    setShow((prev) => {
      const updated = load2025HistoricalScores(prev);
      saveShow(updated);
      setAllShows(loadAllShows());
      return updated;
    });
  }, []);

  const handleReset2025Blank = useCallback(() => {
    setShow((prev) => {
      const updated = reset2025ScoresToBlank(prev);
      saveShow(updated);
      setAllShows(loadAllShows());
      return updated;
    });
  }, []);

  const handleLoad2024Historical = useCallback(() => {
    setShow((prev) => {
      const updated = load2024HistoricalScores(prev);
      saveShow(updated);
      setAllShows(loadAllShows());
      return updated;
    });
  }, []);

  const handleReset2024Blank = useCallback(() => {
    setShow((prev) => {
      const updated = reset2024ScoresToBlank(prev);
      saveShow(updated);
      setAllShows(loadAllShows());
      return updated;
    });
  }, []);

  // Independent Preview and On Air layer states
  const [previewLayer, setPreviewLayer] = useState<GraphicLayer | null>(() => loadPreviewLayer());
  const [onAirLayers, setOnAirLayers] = useState<GraphicLayer[]>(() => loadOnAirLayers());

  // Global target participant for fast live operation
  const [targetParticipantId, setTargetParticipantId] = useState<string>(
    () => show.participants[0]?.id || ''
  );

  const targetParticipant =
    show.participants.find((p) => p.id === targetParticipantId) || show.participants[0];

  // Quick lower third editor trigger
  const [quickEditorMode, setQuickEditorMode] = useState<
    'one_person' | 'two_people' | 'artist_song' | 'info' | null
  >(null);

  // Monitor inspector viewmode: 'preview' (inspect green layer) or 'on_air' (inspect red composite)
  const [monitorViewMode, setMonitorViewMode] = useState<'preview' | 'on_air'>('preview');

  // Active voting tab in control room bottom dock
  const [activeVotingTab, setActiveVotingTab] = useState<'jury' | 'demoscopic' | 'public'>('jury');
  const [showResetScoresModal, setShowResetScoresModal] = useState<boolean>(false);

  // Preview monitor safe area & stage settings
  const [previewSettings, setPreviewSettings] = useState<PreviewSettings>({
    zoomMode: 'fit',
    showActionSafe: true,
    showTitleSafe: true,
    showCenterGrid: false,
    showStageBackground: true,
  });

  // Create real-time sync bus singleton
  const syncBus = useMemo(() => new BroadcastSyncBus(), []);

  // Sync state changes across windows
  useEffect(() => {
    saveShow(show);
    syncBus.syncShow(show);
  }, [show, syncBus]);

  useEffect(() => {
    savePreviewLayer(previewLayer);
  }, [previewLayer]);

  useEffect(() => {
    saveOnAirLayers(onAirLayers);
    syncBus.updateOnAirLayers(onAirLayers);
  }, [onAirLayers, syncBus]);

  // Listen for sync events from other windows
  useEffect(() => {
    const unsubscribe = syncBus.subscribe((event) => {
      switch (event.type) {
        case 'SYNC_SHOW':
        case 'UPDATE_SCORES':
        case 'REVEAL_SCORE':
          setShow(event.payload);
          break;
        case 'UPDATE_ON_AIR_LAYERS':
          setOnAirLayers(event.payload);
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [syncBus]);

  // Handle global target participant change
  const handleSelectTarget = useCallback(
    (participant: Participant) => {
      setTargetParticipantId(participant.id);

      // If current preview layer is participant-dependent, update immediately in Preview without going on air!
      setPreviewLayer((prev) => {
        if (!prev) return null;
        if (prev.type === 'lower_third_artist_song' || prev.type === 'lower_third') {
          return {
            ...prev,
            name: `Lower Third: ${participant.name || participant.artist} — ${participant.song}`,
            props: {
              ...prev.props,
              participantId: participant.id,
              artist: participant.name || participant.artist,
              song: participant.song,
              badgeNumber: String(participant.performanceNumber).padStart(2, '0'),
            },
          };
        } else if (prev.type === 'performance_identifier') {
          return {
            ...prev,
            name: `Performance Bug: #${participant.performanceNumber} ${participant.artist}`,
            props: {
              ...prev.props,
              participantId: participant.id,
              performanceNumber: participant.performanceNumber,
              artist: participant.name || participant.artist,
              song: participant.song,
            },
          };
        } else if (prev.type === 'performance_intro') {
          return {
            ...prev,
            name: `Stage Ready: #${participant.performanceNumber} ${participant.artist}`,
            props: {
              ...prev.props,
              participantId: participant.id,
              customNumber: String(participant.performanceNumber).padStart(2, '0'),
              customArtist: participant.name || participant.artist,
              customSong: participant.song,
            },
          };
        }
        return prev;
      });
    },
    []
  );

  // TAKE: Moves preview layer to on air, clears preview, updates broadcast bus
  const handleTake = useCallback(() => {
    if (!previewLayer) return;

    setOnAirLayers((prev) => {
      // Remove any layer of identical type if replacing, or append
      const filtered = prev.filter((l) => l.type !== previewLayer.type);
      const takenLayer: GraphicLayer = {
        ...previewLayer,
        isOnAir: true,
        inPreview: false,
        takenAt: Date.now(),
      };
      const next = [...filtered, takenLayer];
      syncBus.take(takenLayer);
      return next;
    });

    // Clear preview slot
    setPreviewLayer(null);
    // Switch monitor viewmode to program so operator sees the live take
    setMonitorViewMode('on_air');
  }, [previewLayer, syncBus]);

  // DIRECT TAKE: Instantly fires a layer to on-air without needing preview first
  const handleDirectTake = useCallback(
    (layer: GraphicLayer) => {
      setOnAirLayers((prev) => {
        const existingIndex = prev.findIndex((l) => l.id === layer.id);
        const takenLayer: GraphicLayer = {
          ...layer,
          isOnAir: true,
          inPreview: false,
          takenAt: layer.takenAt || Date.now(),
        };

        if (existingIndex >= 0) {
          // Update in-place to preserve layering and key identity
          const next = [...prev];
          next[existingIndex] = takenLayer;
          syncBus.take(takenLayer);
          return next;
        }

        const filtered = prev.filter((l) => l.type !== layer.type);
        const next = [...filtered, takenLayer];
        syncBus.take(takenLayer);
        return next;
      });
      setMonitorViewMode('on_air');
    },
    [syncBus]
  );

  // AUTHORITATIVE LIVE UPDATE: Updates active lower thirds in preview and on-air without re-triggering entrance animations
  const handleUpdateActiveLowerThird = useCallback(
    (updatedProps: Record<string, any>) => {
      // 1. Update Preview layer if it's a lower third
      setPreviewLayer((prev) => {
        if (prev && (prev.type.startsWith('lower_third') || prev.type === 'announcement')) {
          return {
            ...prev,
            props: { ...prev.props, ...updatedProps },
          };
        }
        return prev;
      });

      // 2. Update On-Air layers if there is an active lower third
      setOnAirLayers((prev) => {
        let changed = false;
        const next = prev.map((layer) => {
          if (layer.type.startsWith('lower_third') || layer.type === 'announcement') {
            changed = true;
            return {
              ...layer,
              props: { ...layer.props, ...updatedProps },
            };
          }
          return layer;
        });
        return changed ? next : prev;
      });
    },
    []
  );

  // TAKE OUT: removes a single layer from on air
  const handleRemoveLayer = useCallback(
    (layerId: string) => {
      setOnAirLayers((prev) => {
        const next = prev.filter((l) => l.id !== layerId);
        syncBus.out(layerId);
        return next;
      });
    },
    [syncBus]
  );

  // Quick OUT: pulls the top active layer off air, protecting persistent live bug
  const handleQuickOut = useCallback(() => {
    if (onAirLayers.length === 0) return;
    // When removing graphics, protect the persistent live bug unless it is the only layer
    const nonBugLayers = onAirLayers.filter((l) => l.type !== 'live_bug');
    if (nonBugLayers.length > 0) {
      const topLayer = nonBugLayers[nonBugLayers.length - 1];
      handleRemoveLayer(topLayer.id);
    } else {
      const topLayer = onAirLayers[onAirLayers.length - 1];
      handleRemoveLayer(topLayer.id);
    }
  }, [onAirLayers, handleRemoveLayer]);

  // CLEAR ALL ON AIR
  const handleClearAllOnAir = useCallback(() => {
    setOnAirLayers([]);
    syncBus.clearAllOnAir();
  }, [syncBus]);

  // UNDO LAST VOTE
  const handleUndoLastVote = useCallback(() => {
    setShow((prev) => {
      if (prev.activeVotingPhase === 'professionalJury' || prev.votingStage === 'jury') {
        const jury = prev.juries.find((j) => j.id === prev.currentJuryId) || prev.juries[0];
        if (!jury) return prev;
        const entries = Object.entries(jury.votes || {});
        if (entries.length === 0) return prev;
        const [lastPId] = entries[entries.length - 1];
        const nextVotes = { ...jury.votes };
        delete nextVotes[lastPId];
        const updatedJuries = prev.juries.map((j) =>
          j.id === jury.id ? { ...j, votes: nextVotes } : j
        );
        return recalculateJuryScores({ ...prev, juries: updatedJuries }, jury.id, lastPId, 0);
      }
      return prev;
    });
  }, []);

  // SAVE SHOW
  const handleSaveShow = useCallback(() => {
    saveShow(show);
  }, [show]);

  // Reorder On Air layers stack
  const handleMoveLayer = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= onAirLayers.length) return;

    const list = [...onAirLayers];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setOnAirLayers(list);
  };

  // Keyboard Shortcuts (Space for TAKE)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' && previewLayer) {
        e.preventDefault();
        handleTake();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTake, previewLayer]);

  // Open separate popout window for OBS
  const handleOpenOBSWindow = () => {
    const obsUrl = `${window.location.origin}${window.location.pathname}?obs=true`;
    window.open(
      obsUrl,
      'LiveFestOBSOutput',
      'width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no'
    );
  };

  // If in OBS mode, render dedicated transparent output
  if (isOBSWindow) {
    return (
      <div className="w-screen h-screen bg-transparent">
        <OBSOutputWindow />
      </div>
    );
  }

  // Otherwise, render full professional Control Room UI
  return (
    <div className="flex flex-col w-screen h-screen bg-[#07090e] text-slate-100 font-sans overflow-hidden">
      
      {/* 1. Master Control Room Header */}
      <ControlRoomHeader
        show={show}
        allShows={allShows}
        onUpdateShow={setShow}
        onSelectShow={handleSelectShow}
        onOpenOBSWindow={handleOpenOBSWindow}
        onLoad2025Historical={handleLoad2025Historical}
        onReset2025Blank={handleReset2025Blank}
        onLoad2024Historical={handleLoad2024Historical}
        onReset2024Blank={handleReset2024Blank}
      />

      {/* 2. LIVE FAST OPERATIONS BAR (Quick Actions, Global Target & Quick Launch) */}
      <QuickOperationsBar
        show={show}
        onUpdateShow={setShow}
        previewLayer={previewLayer}
        onAirLayers={onAirLayers}
        targetParticipant={targetParticipant}
        onSelectTarget={handleSelectTarget}
        onTake={handleTake}
        onTakeOut={handleQuickOut}
        onRemoveLayer={handleRemoveLayer}
        onClearAll={handleClearAllOnAir}
        onSetPreviewLayer={(layer) => {
          setPreviewLayer(layer);
          setMonitorViewMode('preview');
        }}
        onDirectTake={handleDirectTake}
        onOpenQuickLowerThird={(mode) => {
          setQuickEditorMode(mode || 'one_person');
        }}
        onUndoLastVote={handleUndoLastVote}
        onSaveShow={handleSaveShow}
      />

      {/* 3. Main Studio Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Participant Roster & Performance Order (approx 310px) */}
        <div className="w-80 h-full flex-shrink-0">
          <ParticipantManager
            show={show}
            onUpdateShow={setShow}
          />
        </div>

        {/* Center Canvas & Voting Workspace (Flexible Center) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#090b12] border-x border-slate-800">
          
          {/* Top: 16:9 Broadcast Preview Monitor */}
          <div className="h-[56%] p-3 pb-1 flex flex-col min-h-0">
            <PreviewMonitor
              show={show}
              previewLayer={previewLayer}
              onAirLayers={onAirLayers}
              previewSettings={previewSettings}
              onUpdateSettings={(newSettings) =>
                setPreviewSettings((prev) => ({ ...prev, ...newSettings }))
              }
              onTake={handleTake}
              onClearPreview={() => setPreviewLayer(null)}
              viewMode={monitorViewMode}
              onChangeViewMode={setMonitorViewMode}
            />
          </div>

          {/* Bottom: Voting Control Stations (Jury Clicker, Demoscopic, Public) */}
          <div className="h-[44%] p-3 pt-2 flex flex-col min-h-0">
            {/* Voting Tabs Selector */}
            {isBenidormFest2025(show) ? (
              <div className="flex items-center justify-between mb-2 bg-[#0c1018] p-1.5 rounded-md border border-[#246BFF]/50">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 bg-[#F21878] text-[#FFD900] font-broadcast font-black text-xs uppercase tracking-widest border border-[#FFD900]">
                    BENIDORM FEST 2025
                  </span>
                  <span className="font-heavy text-xs font-black uppercase text-white tracking-wider">
                    SISTEMA DE VOTACIÓN DIRECTA • ENTRADA CONTROLADA DE PUNTOS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="btn-voting-reset-all-scores-2025"
                    onClick={() => setShowResetScoresModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 hover:text-amber-100 border border-amber-700/60 font-broadcast font-bold text-xs uppercase transition-all shadow-sm active:scale-95"
                    title="Reset all voting scores to 0 for simulation"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>RESET ALL SCORES (0 PTS)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2 bg-[#0c1018] p-1 rounded-md border border-slate-800/80">
                <button
                  onClick={() => setActiveVotingTab('jury')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-broadcast font-bold uppercase tracking-wider transition-all ${
                    activeVotingTab === 'jury'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Vote className="w-3.5 h-3.5" />
                  <span>1. JURADO PROFESIONAL (CLICKER)</span>
                </button>

                <button
                  onClick={() => setActiveVotingTab('demoscopic')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-broadcast font-bold uppercase tracking-wider transition-all ${
                    activeVotingTab === 'demoscopic'
                      ? 'bg-cyan-600 text-black shadow-md shadow-cyan-900/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>2. PANEL DEMOSCÓPICO</span>
                </button>

                <button
                  onClick={() => setActiveVotingTab('public')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-broadcast font-bold uppercase tracking-wider transition-all ${
                    activeVotingTab === 'public'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-900/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>3. TELEVOTO PÚBLICO</span>
                </button>

                {/* Dedicated Reset All Scores in Voting Control Station */}
                <div className="ml-auto pr-1">
                  <button
                    id="btn-voting-reset-all-scores"
                    onClick={() => setShowResetScoresModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 hover:text-amber-100 border border-amber-700/60 font-broadcast font-bold text-xs uppercase transition-all shadow-sm active:scale-95"
                    title="Reset all voting scores for the active show"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>RESET ALL SCORES</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto">
              {isBenidormFest2025(show) ? (
                <VotingControl2025
                  show={show}
                  onUpdateShow={setShow}
                  onPreviewGraphic={(layer) => {
                    setPreviewLayer(layer);
                    setMonitorViewMode('preview');
                  }}
                  onTakeGraphic={(layer) => {
                    handleDirectTake(layer);
                  }}
                  onTakeOutGraphic={handleQuickOut}
                />
              ) : (
                <>
                  {activeVotingTab === 'jury' && (
                    <JuryClickerControl
                      show={show}
                      onUpdateShow={setShow}
                      onPreviewGraphic={(layer) => {
                        setPreviewLayer(layer);
                        setMonitorViewMode('preview');
                      }}
                      onTakeGraphic={(layer) => {
                        handleDirectTake(layer);
                      }}
                      onTakeOutGraphic={handleQuickOut}
                    />
                  )}

                  {activeVotingTab === 'demoscopic' && (
                    <DemoscopicControl
                      show={show}
                      onUpdateShow={setShow}
                      onPreviewGraphic={(layer) => {
                        setPreviewLayer(layer);
                        setMonitorViewMode('preview');
                      }}
                      onTakeGraphic={(layer) => {
                        handleDirectTake(layer);
                      }}
                      onTakeOutGraphic={handleQuickOut}
                    />
                  )}

                  {activeVotingTab === 'public' && (
                    <PublicControl
                      show={show}
                      onUpdateShow={setShow}
                      onPreviewGraphic={(layer) => {
                        setPreviewLayer(layer);
                        setMonitorViewMode('preview');
                      }}
                      onTakeGraphic={(layer) => {
                        handleDirectTake(layer);
                      }}
                      onTakeOutGraphic={handleQuickOut}
                    />
                  )}
                </>
              )}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Graphics Library & Active On-Air Layers (approx 380px) */}
        <div className="w-[390px] h-full flex flex-col flex-shrink-0 bg-[#0a0d14]">
          {/* Graphics Catalog & Lower Third Quick Editor */}
          <div className="flex-1 overflow-hidden">
            <GraphicsCatalog
              show={show}
              previewLayer={previewLayer}
              onAirLayers={onAirLayers}
              onUpdateActiveLayerProps={handleUpdateActiveLowerThird}
              onSelectPreview={(layer) => {
                setPreviewLayer(layer);
                setMonitorViewMode('preview');
              }}
              onDirectTake={handleDirectTake}
              onTakeOutGraphic={handleRemoveLayer}
              initialQuickEditorMode={quickEditorMode}
              onCloseQuickEditor={() => setQuickEditorMode(null)}
            />
          </div>

          {/* Always-visible Active On-Air Layers List */}
          <div className="flex-shrink-0">
            <OnAirLayersPanel
              onAirLayers={onAirLayers}
              onRemoveLayer={handleRemoveLayer}
              onClearAll={handleClearAllOnAir}
              onMoveLayer={handleMoveLayer}
            />
          </div>
        </div>

      </div>

      {/* Reset All Scores Confirmation Modal */}
      {showResetScoresModal && (
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
                onClick={() => setShowResetScoresModal(false)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold uppercase transition-colors"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = isBenidormFest2025(show) ? reset2025ScoresToBlank(show) : resetAllScores(show);
                  setShow(updated);
                  saveShow(updated);
                  setShowResetScoresModal(false);
                }}
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
}
