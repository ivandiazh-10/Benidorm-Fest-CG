import React, { useState } from 'react';
import { GraphicLayer, LowerThirdPreset, Participant, Show } from '../../types/broadcast';
import {
  loadLowerThirdPresets,
  addLowerThirdPreset,
  updateLowerThirdPreset,
  deleteLowerThirdPreset,
} from '../../utils/lowerThirdPresets';
import { LowerThirdCustomOptions } from '../graphics/LowerThirdGraphic';
import {
  Eye,
  Radio,
  BookmarkPlus,
  Trash2,
  User,
  Users,
  Music,
  Info,
  Sparkles,
  Sliders,
  Check,
  Save,
  Zap,
} from 'lucide-react';

interface LowerThirdQuickEditorProps {
  show: Show;
  onPreview: (layer: GraphicLayer) => void;
  onTake: (layer: GraphicLayer) => void;
  onUpdateActiveLayerProps?: (updatedProps: Record<string, any>) => void;
  previewLayer?: GraphicLayer | null;
  onAirLayers?: GraphicLayer[];
  initialMode?: 'one_person' | 'two_people' | 'artist_song' | 'info';
  onClose?: () => void;
}

export const LowerThirdQuickEditor: React.FC<LowerThirdQuickEditorProps> = ({
  show,
  onPreview,
  onTake,
  onUpdateActiveLayerProps,
  previewLayer,
  onAirLayers = [],
  initialMode = 'artist_song',
  onClose,
}) => {
  const [mode, setMode] = useState<'one_person' | 'two_people' | 'artist_song' | 'info'>(initialMode);

  // Type 01: Two People
  const [person1Name, setPerson1Name] = useState<string>('RUTH LORENZO');
  const [person1Role, setPerson1Role] = useState<string>('PRESENTADORA');
  const [person2Name, setPerson2Name] = useState<string>('MARC CALDERÓ');
  const [person2Role, setPerson2Role] = useState<string>('PRESENTADOR');

  // Type 02: Artist / Song (Customizable)
  const [artist, setArtist] = useState<string>('NEBULOSSA');
  const [song, setSong] = useState<string>('ZORRA');
  const [badgeNumber, setBadgeNumber] = useState<string>('08');
  const [showNumber, setShowNumber] = useState<boolean>(true);
  const [descriptor, setDescriptor] = useState<string>('');
  const [accent, setAccent] = useState<'cyan' | 'purple' | 'coral' | 'gold'>('cyan');
  const [fontSizeScale, setFontSizeScale] = useState<'compact' | 'standard' | 'large'>('standard');
  const [alignment, setAlignment] = useState<'left' | 'center'>('left');
  const [artistPosition, setArtistPosition] = useState<'left' | 'top'>('left');

  // Advanced customization accordion toggle
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Type 03: One Person
  const [onePersonName, setOnePersonName] = useState<string>('MARTA GARCÍA');
  const [onePersonRole, setOnePersonRole] = useState<string>('PRESENTADORA');

  // Type 04: Information
  const [infoTitle, setInfoTitle] = useState<string>('VOTACIÓN ABIERTA');
  const [infoSubtitle, setInfoSubtitle] = useState<string>('TELÉFONO Y SMS ACTIVOS');

  // Presets state
  const [presets, setPresets] = useState<LowerThirdPreset[]>(() => loadLowerThirdPresets());
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [presetNameInput, setPresetNameInput] = useState<string>('');
  const [showSavePreset, setShowSavePreset] = useState<boolean>(false);

  // Filter presets by active mode
  const currentModePresets = presets.filter((p) => p.mode === mode);

  // Apply a preset to inputs
  const handleApplyPreset = (preset: LowerThirdPreset) => {
    setSelectedPresetId(preset.id);
    if (preset.mode === 'one_person') {
      setOnePersonName(preset.props.title || preset.props.name || '');
      setOnePersonRole(preset.props.subtitle || preset.props.role || '');
    } else if (preset.mode === 'two_people') {
      setPerson1Name(preset.props.person1Name || '');
      setPerson1Role(preset.props.person1Role || '');
      setPerson2Name(preset.props.person2Name || '');
      setPerson2Role(preset.props.person2Role || '');
    } else if (preset.mode === 'artist_song') {
      setArtist(preset.props.artist || '');
      setSong(preset.props.song || '');
      setBadgeNumber(preset.props.badgeNumber ? String(preset.props.badgeNumber) : '');
      setShowNumber(preset.props.customOptions?.showPerformanceNumber !== false && Boolean(preset.props.badgeNumber));
      setDescriptor(preset.props.descriptor || '');
      if (preset.props.customOptions?.accent) setAccent(preset.props.customOptions.accent);
      if (preset.props.customOptions?.fontSizeScale) setFontSizeScale(preset.props.customOptions.fontSizeScale);
      if (preset.props.customOptions?.alignment) setAlignment(preset.props.customOptions.alignment);
    } else if (preset.mode === 'info') {
      setInfoTitle(preset.props.title || '');
      setInfoSubtitle(preset.props.subtitle || '');
    }
  };

  // Quick launch preset directly to ON AIR
  const handleQuickLaunchPreset = (preset: LowerThirdPreset) => {
    handleApplyPreset(preset);
    const layer = buildLayerForPreset(preset);
    onTake(layer);
  };

  // Save current fields as a new preset
  const handleSavePreset = () => {
    if (!presetNameInput.trim()) return;

    const customOptions: LowerThirdCustomOptions = {
      showPerformanceNumber: showNumber,
      accent,
      fontSizeScale,
      alignment,
      artistPosition,
    };

    let props: Record<string, any> = {};
    if (mode === 'one_person') {
      props = { title: onePersonName, subtitle: onePersonRole, name: onePersonName, role: onePersonRole };
    } else if (mode === 'two_people') {
      props = { person1Name, person1Role, person2Name, person2Role };
    } else if (mode === 'artist_song') {
      props = {
        artist,
        song,
        badgeNumber: showNumber ? badgeNumber : undefined,
        descriptor,
        customOptions,
      };
    } else if (mode === 'info') {
      props = { title: infoTitle, subtitle: infoSubtitle };
    }

    addLowerThirdPreset({
      name: presetNameInput.trim(),
      mode,
      props,
    });

    setPresets(loadLowerThirdPresets());
    setPresetNameInput('');
    setShowSavePreset(false);
  };

  // Update existing selected preset
  const handleUpdateCurrentPreset = () => {
    if (!selectedPresetId) return;
    const existing = presets.find((p) => p.id === selectedPresetId);
    if (!existing) return;

    const customOptions: LowerThirdCustomOptions = {
      showPerformanceNumber: showNumber,
      accent,
      fontSizeScale,
      alignment,
      artistPosition,
    };

    let props: Record<string, any> = {};
    if (mode === 'one_person') {
      props = { title: onePersonName, subtitle: onePersonRole, name: onePersonName, role: onePersonRole };
    } else if (mode === 'two_people') {
      props = { person1Name, person1Role, person2Name, person2Role };
    } else if (mode === 'artist_song') {
      props = {
        artist,
        song,
        badgeNumber: showNumber ? badgeNumber : undefined,
        descriptor,
        customOptions,
      };
    } else if (mode === 'info') {
      props = { title: infoTitle, subtitle: infoSubtitle };
    }

    updateLowerThirdPreset({
      ...existing,
      props,
    });

    setPresets(loadLowerThirdPresets());
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteLowerThirdPreset(id);
    if (selectedPresetId === id) setSelectedPresetId(null);
    setPresets(loadLowerThirdPresets());
  };

  // Quick helper: load from show participants (Workflow: ARTIST -> SONG -> NUMBER -> TAKE)
  const handleLoadParticipant = (p: Participant) => {
    setArtist(p.name || p.artist);
    setSong(p.song);
    setBadgeNumber(String(p.performanceNumber).padStart(2, '0'));
    setShowNumber(true);
  };

  const activeOnAirLt = onAirLayers.find(
    (l) => l.type.startsWith('lower_third') || l.type === 'announcement'
  );
  const isLtOnAir = Boolean(activeOnAirLt);

  const syncLiveUpdate = (overrideProps: Record<string, any> = {}) => {
    if (!onUpdateActiveLayerProps) return;
    const customOptions: LowerThirdCustomOptions = {
      showPerformanceNumber: showNumber,
      accent,
      fontSizeScale,
      alignment,
      artistPosition,
      ...overrideProps.customOptions,
    };

    let props: Record<string, any> = { mode, customOptions };
    if (mode === 'one_person') {
      props = {
        ...props,
        mode: 'one_person',
        title: onePersonName,
        subtitle: onePersonRole,
        name: onePersonName,
        role: onePersonRole,
        ...overrideProps,
      };
    } else if (mode === 'two_people') {
      props = {
        ...props,
        mode: 'two_people',
        person1Name,
        person1Role,
        person2Name,
        person2Role,
        ...overrideProps,
      };
    } else if (mode === 'artist_song') {
      const isNumActive =
        overrideProps.showPerformanceNumber !== undefined
          ? overrideProps.showPerformanceNumber
          : showNumber;
      const numVal =
        overrideProps.badgeNumber !== undefined
          ? overrideProps.badgeNumber
          : badgeNumber;

      props = {
        ...props,
        mode: 'artist_song',
        artist,
        song,
        showPerformanceNumber: isNumActive,
        badgeNumber: isNumActive ? numVal : undefined,
        customNumber: isNumActive ? numVal : undefined,
        descriptor,
        customOptions,
        ...overrideProps,
      };
    } else if (mode === 'info') {
      props = {
        ...props,
        mode: 'info',
        title: infoTitle,
        subtitle: infoSubtitle,
        ...overrideProps,
      };
    }
    onUpdateActiveLayerProps(props);
  };

  const handleToggleShowNumber = (enabled: boolean) => {
    setShowNumber(enabled);
    syncLiveUpdate({
      showPerformanceNumber: enabled,
      badgeNumber: enabled ? badgeNumber : undefined,
      customNumber: enabled ? badgeNumber : undefined,
      customOptions: {
        showPerformanceNumber: enabled,
        accent,
        fontSizeScale,
        alignment,
        artistPosition,
      },
    });
  };

  // Build layer for current state
  const buildLayer = (reuseId?: string): GraphicLayer => {
    const timestamp = Date.now();
    let layerName = 'Lower Third';
    const customOptions: LowerThirdCustomOptions = {
      showPerformanceNumber: showNumber,
      accent,
      fontSizeScale,
      alignment,
      artistPosition,
    };
    let props: Record<string, any> = { mode, customOptions };

    if (mode === 'one_person') {
      layerName = `LT: ${onePersonName || 'One Person'}`;
      props = {
        ...props,
        mode: 'one_person',
        title: onePersonName,
        subtitle: onePersonRole,
        name: onePersonName,
        role: onePersonRole,
      };
    } else if (mode === 'two_people') {
      layerName = `LT: ${person1Name} & ${person2Name}`;
      props = {
        ...props,
        mode: 'two_people',
        person1Name,
        person1Role,
        person2Name,
        person2Role,
      };
    } else if (mode === 'artist_song') {
      layerName = `LT: ${artist} — «${song}»`;
      props = {
        ...props,
        mode: 'artist_song',
        artist,
        song,
        showPerformanceNumber: showNumber,
        badgeNumber: showNumber ? badgeNumber : undefined,
        customNumber: showNumber ? badgeNumber : undefined,
        descriptor,
        customOptions,
      };
    } else if (mode === 'info') {
      layerName = `LT Info: ${infoTitle}`;
      props = {
        ...props,
        mode: 'info',
        title: infoTitle,
        subtitle: infoSubtitle,
      };
    }

    return {
      id: reuseId || `layer-lt-${timestamp}`,
      type: 'lower_third',
      name: layerName,
      category: 'GENERAL',
      isOnAir: false,
      inPreview: true,
      zIndex: 10,
      props,
    };
  };

  // Build layer directly from preset
  const buildLayerForPreset = (preset: LowerThirdPreset): GraphicLayer => {
    const timestamp = Date.now();
    const hasNum =
      preset.props.customOptions?.showPerformanceNumber !== false &&
      Boolean(preset.props.badgeNumber);
    return {
      id: `layer-lt-${timestamp}`,
      type: 'lower_third',
      name: `LT: ${preset.name}`,
      category: 'GENERAL',
      isOnAir: false,
      inPreview: true,
      zIndex: 10,
      props: {
        mode: preset.mode,
        showPerformanceNumber: hasNum,
        badgeNumber: hasNum ? preset.props.badgeNumber : undefined,
        customNumber: hasNum ? preset.props.badgeNumber : undefined,
        ...preset.props,
      },
    };
  };

  return (
    <div className="flex flex-col bg-[#0b0e18] border border-cyan-500/40 rounded-md p-4 shadow-2xl select-none max-w-2xl">
      
      {/* Header & Close */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="font-broadcast text-xs font-bold text-white uppercase tracking-wider">
            Rótulos de Televisión (Lower Thirds)
          </h3>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-mono px-2 py-0.5 rounded hover:bg-slate-800"
          >
            ✕
          </button>
        )}
      </div>

      {/* 4 Mode Selector Tabs */}
      <div className="grid grid-cols-4 gap-1.5 mb-3 bg-[#070a12] p-1 rounded border border-slate-800/80">
        <button
          onClick={() => setMode('artist_song')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[11px] font-broadcast font-bold uppercase tracking-wide transition-all ${
            mode === 'artist_song'
              ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Music className="w-3 h-3" />
          <span className="truncate">Artista + Tema</span>
        </button>

        <button
          onClick={() => setMode('one_person')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[11px] font-broadcast font-bold uppercase tracking-wide transition-all ${
            mode === 'one_person'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-3 h-3" />
          <span className="truncate">1 Persona</span>
        </button>

        <button
          onClick={() => setMode('two_people')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[11px] font-broadcast font-bold uppercase tracking-wide transition-all ${
            mode === 'two_people'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3 h-3" />
          <span className="truncate">2 Personas</span>
        </button>

        <button
          onClick={() => setMode('info')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[11px] font-broadcast font-bold uppercase tracking-wide transition-all ${
            mode === 'info'
              ? 'bg-slate-700 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-3 h-3" />
          <span className="truncate">Información</span>
        </button>
      </div>

      {/* Presets Management Bar */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3 bg-slate-900/50 p-2 rounded border border-slate-800/60">
        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold mr-1">
          PRESETS:
        </span>
        {currentModePresets.length === 0 && (
          <span className="text-[10px] font-mono text-slate-500 italic">
            Sin presets guardados
          </span>
        )}
        {currentModePresets.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className={`group flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-broadcast font-semibold cursor-pointer transition-all ${
                isSelected
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-sm'
                  : 'bg-[#101726] hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Clic para cargar. Doble clic para Take."
              onDoubleClick={() => handleQuickLaunchPreset(preset)}
            >
              <span>{preset.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickLaunchPreset(preset);
                }}
                className="opacity-0 group-hover:opacity-100 text-cyan-400 hover:text-cyan-200 ml-1 p-0.5"
                title="Lanzar ON AIR directamente"
              >
                <Zap className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={(e) => handleDeletePreset(preset.id, e)}
                className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 p-0.5"
                title="Eliminar preset"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}

        <div className="ml-auto flex items-center gap-1.5">
          {selectedPresetId && (
            <button
              onClick={handleUpdateCurrentPreset}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-[10px] font-mono border border-purple-700"
              title="Guardar cambios en el preset seleccionado"
            >
              <Save className="w-2.5 h-2.5" />
              <span>Actualizar</span>
            </button>
          )}

          <button
            onClick={() => setShowSavePreset(!showSavePreset)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono border border-slate-700"
          >
            <BookmarkPlus className="w-3 h-3" />
            <span>Guardar Nuevo</span>
          </button>
        </div>
      </div>

      {/* Save Preset Form Inline */}
      {showSavePreset && (
        <div className="flex items-center gap-2 mb-3 bg-[#0d1527] p-2 rounded border border-cyan-500/40">
          <input
            type="text"
            placeholder="Nombre del nuevo preset..."
            value={presetNameInput}
            onChange={(e) => setPresetNameInput(e.target.value)}
            className="flex-1 bg-black/60 border border-slate-700 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-cyan-400 font-mono"
            autoFocus
          />
          <button
            onClick={handleSavePreset}
            disabled={!presetNameInput.trim()}
            className="px-3 py-1 rounded bg-cyan-500 disabled:opacity-50 text-black font-broadcast font-bold text-xs"
          >
            Guardar
          </button>
          <button
            onClick={() => setShowSavePreset(false)}
            className="px-2 py-1 text-xs text-slate-400 hover:text-white"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* =========================================================================
          MODE: ARTIST + SONG (CUSTOM BROADCAST EDITOR)
          Quick workflow: ARTIST -> SONG -> NUMBER -> TAKE
          ========================================================================= */}
      {mode === 'artist_song' && (
        <div className="flex flex-col gap-3 mb-4">
          
          {/* Quick Participant Selector Chips */}
          <div className="flex flex-col gap-1 bg-slate-900/40 p-2 rounded border border-slate-800">
            <span className="text-[10px] font-mono text-purple-300 font-bold uppercase">
              Candidaturas en Vivo (Carga Inmediata):
            </span>
            <div className="flex flex-wrap gap-1">
              {show.participants
                .filter((p) => !p.isRemovedFromCompetition)
                .map((p) => {
                  const isCur = artist === (p.name || p.artist);
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleLoadParticipant(p)}
                      className={`px-2 py-0.5 rounded text-[10px] font-broadcast font-semibold border transition-all ${
                        isCur
                          ? 'bg-cyan-500 text-black border-cyan-400 font-bold shadow-sm'
                          : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700'
                      }`}
                    >
                      #{p.performanceNumber} {p.name || p.artist}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Primary Form Fields */}
          <div className="grid grid-cols-12 gap-2.5">
            {/* Number Toggle + Input */}
            <div className="col-span-3 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-slate-400">NÚMERO</label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNumber}
                    onChange={(e) => handleToggleShowNumber(e.target.checked)}
                    className="w-3 h-3 accent-cyan-400 rounded cursor-pointer"
                  />
                  <span className="text-[9px] font-mono text-cyan-300">ACTIVO</span>
                </label>
              </div>
              <input
                type="text"
                value={badgeNumber}
                disabled={!showNumber}
                onChange={(e) => {
                  setBadgeNumber(e.target.value);
                  if (showNumber) {
                    syncLiveUpdate({ badgeNumber: e.target.value, customNumber: e.target.value });
                  }
                }}
                placeholder="01"
                className={`w-full bg-black/70 border rounded px-3 py-1.5 text-center text-sm font-mono-num font-black ${
                  showNumber
                    ? 'border-cyan-500/60 text-cyan-300'
                    : 'border-slate-800 text-slate-600 cursor-not-allowed'
                } outline-none`}
              />
            </div>

            {/* Artist Input */}
            <div className="col-span-5 flex flex-col gap-1">
              <label className="text-[10px] font-mono text-slate-400">ARTISTA / GRUPO</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => {
                  setArtist(e.target.value);
                  syncLiveUpdate({ artist: e.target.value });
                }}
                placeholder="NEBULOSSA"
                className="w-full bg-black/70 border border-slate-700 rounded px-3 py-1.5 text-xs text-white font-heavy font-black uppercase outline-none focus:border-cyan-400"
              />
            </div>

            {/* Song Input */}
            <div className="col-span-4 flex flex-col gap-1">
              <label className="text-[10px] font-mono text-slate-400">TEMA / CANCIÓN</label>
              <input
                type="text"
                value={song}
                onChange={(e) => {
                  setSong(e.target.value);
                  syncLiveUpdate({ song: e.target.value });
                }}
                placeholder="ZORRA"
                className="w-full bg-black/70 border border-slate-700 rounded px-3 py-1.5 text-xs text-cyan-300 font-broadcast font-bold uppercase outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Secondary Descriptor Bar */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-0.5">
              TEXTO SECUNDARIO / DESCRIPTOR (OPCIONAL)
            </label>
            <input
              type="text"
              value={descriptor}
              onChange={(e) => setDescriptor(e.target.value)}
              placeholder="SEMIFINAL 1 • CANDIDATURA 08"
              className="w-full bg-black/70 border border-slate-700 rounded px-3 py-1 text-xs text-purple-300 font-mono uppercase outline-none focus:border-cyan-400"
            />
          </div>

          {/* Customization Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Ocultar Personalización' : 'Personalizar Diseño (Color, Escala, Posición)'}</span>
            </button>
            {!showNumber && (
              <span className="text-[10px] font-mono text-amber-300/90 italic">
                * El diseño se recompone automáticamente sin hueco vacío
              </span>
            )}
          </div>

          {/* Advanced Customization Options */}
          {showAdvanced && (
            <div className="grid grid-cols-3 gap-2.5 p-2.5 bg-slate-900/60 rounded border border-slate-800">
              {/* Accent Color */}
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-1">COLOR DE ACENTO</label>
                <div className="grid grid-cols-4 gap-1">
                  {(['cyan', 'purple', 'coral', 'gold'] as const).map((col) => (
                    <button
                      key={col}
                      onClick={() => setAccent(col)}
                      className={`py-1 text-[9px] font-mono uppercase rounded font-bold border transition-all ${
                        accent === col
                          ? 'border-white text-white shadow-sm'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      } ${
                        col === 'cyan'
                          ? 'bg-cyan-500/30'
                          : col === 'purple'
                          ? 'bg-purple-600/30'
                          : col === 'coral'
                          ? 'bg-rose-500/30'
                          : 'bg-amber-400/30'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Scale */}
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-1">ESCALA TIPOGRÁFICA</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['compact', 'standard', 'large'] as const).map((scale) => (
                    <button
                      key={scale}
                      onClick={() => setFontSizeScale(scale)}
                      className={`py-1 text-[9px] font-mono uppercase rounded font-bold border transition-all ${
                        fontSizeScale === scale
                          ? 'bg-cyan-500 text-black border-cyan-300'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {scale === 'compact' ? 'Compact' : scale === 'standard' ? 'Normal' : 'Grande'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Alignment */}
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-1">ALINEACIÓN</label>
                <div className="grid grid-cols-2 gap-1">
                  {(['left', 'center'] as const).map((align) => (
                    <button
                      key={align}
                      onClick={() => setAlignment(align)}
                      className={`py-1 text-[9px] font-mono uppercase rounded font-bold border transition-all ${
                        alignment === align
                          ? 'bg-purple-600 text-white border-purple-400'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {align === 'left' ? 'Izquierda' : 'Centro'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          MODE: ONE PERSON
          ========================================================================= */}
      {mode === 'one_person' && (
        <div className="flex flex-col gap-2.5 mb-4">
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-0.5">NOMBRE COMPLETO</label>
            <input
              type="text"
              value={onePersonName}
              onChange={(e) => setOnePersonName(e.target.value)}
              placeholder="MARTA GARCÍA"
              className="w-full bg-black/70 border border-slate-700 rounded px-3 py-1.5 text-xs text-white font-heavy font-black uppercase outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-0.5">ROL / DESCRIPTOR</label>
            <input
              type="text"
              value={onePersonRole}
              onChange={(e) => setOnePersonRole(e.target.value)}
              placeholder="PRESENTADORA o PORTAVOZ DEL JURADO"
              className="w-full bg-black/70 border border-slate-700 rounded px-3 py-1.5 text-xs text-cyan-300 font-broadcast font-bold uppercase outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE: TWO PEOPLE
          ========================================================================= */}
      {mode === 'two_people' && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Person 1 */}
          <div className="flex flex-col gap-2 p-2.5 bg-slate-900/60 rounded border border-purple-500/30">
            <span className="text-[10px] font-mono text-purple-300 font-bold uppercase">PERSONA 1</span>
            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-0.5">NOMBRE</label>
              <input
                type="text"
                value={person1Name}
                onChange={(e) => setPerson1Name(e.target.value)}
                placeholder="RUTH LORENZO"
                className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-heavy font-bold uppercase outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-0.5">ROL</label>
              <input
                type="text"
                value={person1Role}
                onChange={(e) => setPerson1Role(e.target.value)}
                placeholder="PRESENTADORA"
                className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1 text-xs text-cyan-300 font-broadcast font-bold uppercase outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Person 2 */}
          <div className="flex flex-col gap-2 p-2.5 bg-slate-900/60 rounded border border-cyan-500/30">
            <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">PERSONA 2</span>
            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-0.5">NOMBRE</label>
              <input
                type="text"
                value={person2Name}
                onChange={(e) => setPerson2Name(e.target.value)}
                placeholder="MARC CALDERÓ"
                className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-heavy font-bold uppercase outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-0.5">ROL</label>
              <input
                type="text"
                value={person2Role}
                onChange={(e) => setPerson2Role(e.target.value)}
                placeholder="PRESENTADOR"
                className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1 text-xs text-purple-300 font-broadcast font-bold uppercase outline-none focus:border-purple-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE: INFORMATION ONLY
          ========================================================================= */}
      {mode === 'info' && (
        <div className="flex flex-col gap-2.5 mb-4">
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-0.5">TÍTULO PRINCIPAL</label>
            <input
              type="text"
              value={infoTitle}
              onChange={(e) => setInfoTitle(e.target.value)}
              placeholder="VOTACIÓN ABIERTA o BENIDORM"
              className="w-full bg-black/70 border border-slate-700 rounded px-3 py-1.5 text-xs text-white font-heavy font-black uppercase outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-0.5">SUBTÍTULO / UBICACIÓN (OPCIONAL)</label>
            <input
              type="text"
              value={infoSubtitle}
              onChange={(e) => setInfoSubtitle(e.target.value)}
              placeholder="TELÉFONO Y SMS ACTIVOS"
              className="w-full bg-black/70 border border-slate-700 rounded px-3 py-1.5 text-xs text-cyan-300 font-broadcast font-semibold uppercase outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      )}

      {/* Action Buttons: PREVIEW, UPDATE ON AIR, and TAKE ON AIR */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <button
          onClick={() => onPreview(buildLayer())}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded chamfer-slant bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-broadcast font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
        >
          <span className="chamfer-unslant flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            PREVIEW
          </span>
        </button>

        {isLtOnAir && activeOnAirLt && (
          <button
            onClick={() => {
              const updated = buildLayer(activeOnAirLt.id);
              onTake(updated);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded chamfer-slant bg-cyan-700 hover:bg-cyan-600 text-white font-broadcast font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-lg shadow-cyan-950/50"
            title="Actualizar rótulo en emisión manteniendo el estado ON AIR sin reiniciar animación de entrada"
          >
            <span className="chamfer-unslant flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              UPDATE ON AIR
            </span>
          </button>
        )}

        <button
          onClick={() => onTake(buildLayer())}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded chamfer-slant bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-broadcast font-black text-xs uppercase tracking-widest shadow-lg shadow-red-950/50 transition-all active:scale-95 cursor-pointer"
        >
          <span className="chamfer-unslant flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-white" />
            TAKE ON AIR
          </span>
        </button>
      </div>

    </div>
  );
};
