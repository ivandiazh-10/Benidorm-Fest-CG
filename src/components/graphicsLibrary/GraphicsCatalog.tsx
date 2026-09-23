import React, { useState, useEffect } from 'react';
import { GraphicCategory, GraphicLayer, GraphicType, Participant, Show } from '../../types/broadcast';
import { LowerThirdQuickEditor } from './LowerThirdQuickEditor';
import {
  Layers,
  Eye,
  Radio,
  Sparkles,
  Tv,
  BarChart3,
  Trophy,
  Flame,
  User,
  Users,
  Music,
  Info,
  Edit3,
  Search,
  Star,
  Pin,
  Clock,
  XCircle,
  Zap,
} from 'lucide-react';

interface GraphicsCatalogProps {
  show: Show;
  previewLayer: GraphicLayer | null;
  onAirLayers: GraphicLayer[];
  onSelectPreview: (layer: GraphicLayer) => void;
  onDirectTake: (layer: GraphicLayer) => void;
  onTakeOutGraphic?: (layerId: string) => void;
  onUpdateActiveLayerProps?: (updatedProps: Record<string, any>) => void;
  initialQuickEditorMode?: 'one_person' | 'two_people' | 'artist_song' | 'info' | null;
  onCloseQuickEditor?: () => void;
}

interface CatalogItem {
  type: GraphicType;
  name: string;
  category: GraphicCategory;
  description: string;
  defaultProps?: Record<string, any>;
  isLowerThird?: boolean;
  ltMode?: 'one_person' | 'two_people' | 'artist_song' | 'info';
  icon: React.ReactNode;
}

const STORAGE_KEY_FAVORITES = 'benidorm_graphics_favorites_v1';
const STORAGE_KEY_PINNED = 'benidorm_graphics_pinned_v1';
const STORAGE_KEY_RECENTS = 'benidorm_graphics_recents_v1';

export const GraphicsCatalog: React.FC<GraphicsCatalogProps> = ({
  show,
  previewLayer,
  onAirLayers,
  onSelectPreview,
  onDirectTake,
  onTakeOutGraphic,
  onUpdateActiveLayerProps,
  initialQuickEditorMode,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'quick_lt'>(
    initialQuickEditorMode ? 'quick_lt' : 'catalog'
  );
  const [quickLtMode, setQuickLtMode] = useState<'one_person' | 'two_people' | 'artist_song' | 'info'>(
    initialQuickEditorMode || 'one_person'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<GraphicCategory | 'ALL'>('ALL');
  const [filterView, setFilterView] = useState<'ALL' | 'FAVORITES' | 'PINNED' | 'RECENTS'>('ALL');

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return saved ? JSON.parse(saved) : ['live_bug', 'lower_third_one_person', 'scoreboard_split'];
    } catch {
      return ['live_bug', 'lower_third_one_person', 'scoreboard_split'];
    }
  });

  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PINNED);
      return saved ? JSON.parse(saved) : ['live_bug', 'scoreboard_split'];
    } catch {
      return ['live_bug', 'scoreboard_split'];
    }
  });

  const [recents, setRecents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedParticipantId, setSelectedParticipantId] = useState<string>(
    show.participants[0]?.id || ''
  );

  const selectedParticipant =
    show.participants.find((p) => p.id === selectedParticipantId) || show.participants[0];

  const toggleFavorite = (type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type];
      try {
        localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const togglePinned = (type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinned((prev) => {
      const next = prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type];
      try {
        localStorage.setItem(STORAGE_KEY_PINNED, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const recordRecent = (type: string) => {
    setRecents((prev) => {
      const next = [type, ...prev.filter((t) => t !== type)].slice(0, 10);
      try {
        localStorage.setItem(STORAGE_KEY_RECENTS, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const CATALOG_ITEMS: CatalogItem[] = [
    // LOWER THIRDS (GENERAL)
    {
      type: 'lower_third_one_person',
      name: 'Lower Third — 1 Persona',
      category: 'GENERAL',
      description: 'Nombre y Rol/Descriptor (Marta García / Presentadora)',
      isLowerThird: true,
      ltMode: 'one_person',
      icon: <User className="w-3.5 h-3.5 text-cyan-400" />,
      defaultProps: {
        mode: 'one_person',
        title: 'MARTA GARCÍA',
        subtitle: 'PRESENTADORA',
      },
    },
    {
      type: 'lower_third_two_people',
      name: 'Lower Third — 2 Personas',
      category: 'GENERAL',
      description: 'Dos identidades en contenedor compartido (Ruth Lorenzo + Marc Calderó)',
      isLowerThird: true,
      ltMode: 'two_people',
      icon: <Users className="w-3.5 h-3.5 text-purple-400" />,
      defaultProps: {
        mode: 'two_people',
        person1Name: 'RUTH LORENZO',
        person1Role: 'PRESENTADORA',
        person2Name: 'MARC CALDERÓ',
        person2Role: 'PRESENTADOR',
      },
    },
    {
      type: 'lower_third_artist_song',
      name: 'Lower Third — Artista / Tema',
      category: 'GENERAL',
      description: 'Artista principal en bloque Cyan + Canción secundaria en bloque Púrpura',
      isLowerThird: true,
      ltMode: 'artist_song',
      icon: <Music className="w-3.5 h-3.5 text-cyan-400" />,
      defaultProps: {
        mode: 'artist_song',
        artist: selectedParticipant?.name || selectedParticipant?.artist || 'NEBULOSSA',
        song: selectedParticipant?.song || 'ZORRA',
        badgeNumber: selectedParticipant?.performanceNumber ? String(selectedParticipant.performanceNumber).padStart(2, '0') : '08',
      },
    },
    {
      type: 'lower_third_info',
      name: 'Lower Third — Información',
      category: 'GENERAL',
      description: 'Rótulo informativo sin persona: Benidorm / Alicante, En Directo',
      isLowerThird: true,
      ltMode: 'info',
      icon: <Info className="w-3.5 h-3.5 text-amber-400" />,
      defaultProps: {
        mode: 'info',
        title: 'BENIDORM',
        subtitle: 'PALAU D\'ESPORTS L\'ILLA DE BENIDORM',
      },
    },
    {
      type: 'live_bug',
      name: 'Benidorm Fest Live Bug',
      category: 'GENERAL',
      description: 'Mosca oficial Benidorm Fest en esquina segura con Directo',
      icon: <Tv className="w-3.5 h-3.5 text-cyan-300" />,
      defaultProps: {
        festivalName: 'BENIDORM FEST',
        stageName: show.stageTitle || 'Gran Final',
        showLiveTag: true,
        liveTagText: 'DIRECTO',
      },
    },
    {
      type: 'fullscreen_info',
      name: 'Pantalla Informativa / Votación',
      category: 'GENERAL',
      description: 'Pesos porcentuales (50% Jurado / 25% Demoscópico / 25% Televoto)',
      icon: <Info className="w-3.5 h-3.5 text-purple-300" />,
    },
    {
      type: 'venue_info',
      name: 'Rótulo Sede Oficial (Palau)',
      category: 'GENERAL',
      description: 'Palau d\'Esports l\'Illa de Benidorm, aforo y emisión',
      icon: <Info className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      type: 'break_coming_up',
      name: 'Pausa Técnica / Volvemos',
      category: 'GENERAL',
      description: 'Rótulo de intermedio con mosca oficial de Benidorm Fest',
      icon: <Clock className="w-3.5 h-3.5 text-rose-400" />,
    },
    // SCORES
    {
      type: 'scoreboard_split',
      name: 'Scoreboard (Split-Screen + Vídeo)',
      category: 'SCORES',
      description: 'Ranking Benidorm Fest izquierda 45% + cámara directo derecha',
      icon: <BarChart3 className="w-3.5 h-3.5 text-purple-400" />,
    },
    {
      type: 'scoreboard_fullscreen',
      name: 'Scoreboard (Pantalla Completa)',
      category: 'SCORES',
      description: 'Tabla completa con franjas biseladas y puntos acumulados',
      icon: <BarChart3 className="w-3.5 h-3.5 text-purple-300" />,
    },
    {
      type: 'current_score',
      name: 'Desglose Puntuación Participante',
      category: 'SCORES',
      description: 'Puntos de Jurado, Demoscópico, Público y Total acumulado',
      icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />,
    },
    // RANKING
    {
      type: 'top_ranking',
      name: 'Widget Top 5 Provisional',
      category: 'RANKING',
      description: 'Módulo compacto inferior con los 5 primeros clasificados',
      icon: <Trophy className="w-3.5 h-3.5 text-amber-300" />,
      defaultProps: { count: 5 },
    },
    {
      type: 'top_3_podium',
      name: 'Podio Top 3 Provisional',
      category: 'RANKING',
      description: 'Presentación virtual de los 3 mejores clasificados',
      icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      type: 'classification_fullscreen',
      name: 'Clasificación General TV',
      category: 'RANKING',
      description: 'Pantalla de clasificación completa con columnas y badges',
      icon: <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      type: 'current_leader',
      name: 'Píldora Líder Provisional',
      category: 'RANKING',
      description: 'Rótulo con el participante en 1ª posición y puntuación',
      icon: <Flame className="w-3.5 h-3.5 text-amber-400" />,
    },
    // PERFORMANCE
    {
      type: 'performance_intro',
      name: 'Stage Ready / Intro Gigante',
      category: 'PERFORMANCE',
      description: 'Tipografía monumental con chevrons y créditos de composición',
      icon: <Zap className="w-3.5 h-3.5 text-rose-400" />,
    },
    {
      type: 'performance_identifier',
      name: 'Identificador de Actuación (Sobre Mosca)',
      category: 'PERFORMANCE',
      description: 'Capa transparente sobre la mosca: número y artista (03 — ASHA), control manual independiente',
      icon: <Music className="w-3.5 h-3.5 text-cyan-300" />,
    },
    // VOTING
    {
      type: 'vote_award',
      name: 'Gráfico Apoyo Voto TV (Clean)',
      category: 'VOTING',
      description: 'Acompaña la voz del presentador sin secuencias artificiales',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
      defaultProps: {
        pointsAwarded: 16,
        phase: show.votingStage || 'demoscopic',
      },
    },
    {
      type: 'voting_banner',
      name: 'Faldón Teléfono y SMS Votación',
      category: 'VOTING',
      description: 'Faldón inferior continuo con líneas telefónicas y SMS',
      icon: <Tv className="w-3.5 h-3.5 text-purple-300" />,
    },
    {
      type: 'voting_countdown',
      name: 'Cuenta Atrás Votación (10s)',
      category: 'VOTING',
      description: 'Animación de cierre de líneas de 10 a 0 segundos',
      icon: <Clock className="w-3.5 h-3.5 text-rose-400" />,
      defaultProps: { initialSeconds: 10 },
    },
    // RESULTS
    {
      type: 'qualification_result',
      name: 'Clasificados a la Gran Final (Top 4)',
      category: 'RESULTS',
      description: 'Semifinalistas clasificados para la Gran Final de Benidorm Fest',
      icon: <Trophy className="w-3.5 h-3.5 text-amber-300" />,
    },
    {
      type: 'winner_reveal',
      name: 'Ganador Benidorm Fest',
      category: 'RESULTS',
      description: 'Celebración triunfal del ganador con Micrófono de Bronce',
      icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />,
    },
    // BROADCAST / LIVE
    {
      type: 'stage_ready',
      name: 'Stage Ready 2026 (Symmetrical)',
      category: 'PERFORMANCE',
      description: 'Construcción geométrica 28 capas, wipes direccionales, safe 1920x1080',
      icon: <Zap className="w-3.5 h-3.5 text-cyan-300" />,
      defaultProps: {
        showPerformanceNumber: true,
      },
    },
    {
      type: 'replay',
      name: 'Repetición Oficial / Replay',
      category: 'BROADCAST',
      description: 'Identificador superior izquierdo de repetición con indicador REC',
      icon: <Tv className="w-3.5 h-3.5 text-rose-400" />,
      defaultProps: { speed: '1.0x' },
    },
    {
      type: 'slow_motion',
      name: 'Cámara Lenta / Slow Motion',
      category: 'BROADCAST',
      description: 'Rótulo de cámara lenta a 0.5x para momentos estelares',
      icon: <Clock className="w-3.5 h-3.5 text-purple-400" />,
      defaultProps: { speed: '0.5x' },
    },
    {
      type: 'camera_identifier',
      name: 'Identificador de Cámara / Enlace',
      category: 'BROADCAST',
      description: 'Cámara 01, Grúa, Cabeza Caliente o Steadicam',
      icon: <Tv className="w-3.5 h-3.5 text-cyan-400" />,
      defaultProps: { cameraName: 'CÁMARA 01 — GRÚA PRINCIPAL', operator: 'SEÑAL ENLACE HD' },
    },
    {
      type: 'green_room',
      name: 'Green Room — Sala de Artistas',
      category: 'BROADCAST',
      description: 'Cápsula simétrica superior identificando la zona de artistas',
      icon: <Users className="w-3.5 h-3.5 text-cyan-300" />,
    },
    {
      type: 'backstage',
      name: 'Backstage — Zona Técnica',
      category: 'BROADCAST',
      description: 'Identificador superior central de zona técnica y pasillos',
      icon: <Info className="w-3.5 h-3.5 text-purple-400" />,
    },
    {
      type: 'jury_room',
      name: 'Sala de Jurado Profesional',
      category: 'BROADCAST',
      description: 'Deliberación y control de jurado nacional e internacional',
      icon: <Trophy className="w-3.5 h-3.5 text-amber-300" />,
    },
    {
      type: 'programme_clock',
      name: 'Reloj Oficial de Emisión',
      category: 'BROADCAST',
      description: 'Hora real sincronizada en esquina superior derecha',
      icon: <Clock className="w-3.5 h-3.5 text-purple-300" />,
    },
    {
      type: 'show_countdown',
      name: 'Cuenta Atrás Inicio de Gala',
      category: 'BROADCAST',
      description: 'Contador decreciente hacia el comienzo de la emisión',
      icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
      defaultProps: { countdown: 60 },
    },
    {
      type: 'final_identifier',
      name: 'Identificador Gran Final',
      category: 'BROADCAST',
      description: 'Rótulo monumental superior de la Gran Final de Benidorm Fest',
      icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      type: 'semifinal_identifier',
      name: 'Identificador Semifinal',
      category: 'BROADCAST',
      description: 'Rótulo superior de Primera / Segunda Semifinal',
      icon: <Zap className="w-3.5 h-3.5 text-purple-300" />,
    },
    {
      type: 'coming_back',
      name: 'Volvemos en Breve (Tease)',
      category: 'BROADCAST',
      description: 'Rótulo inferior central antes de pausa publicitaria',
      icon: <Clock className="w-3.5 h-3.5 text-cyan-300" />,
    },
    {
      type: 'audience_vote',
      name: 'Momento Redes / Hashtag Oficial',
      category: 'BROADCAST',
      description: 'Hashtag oficial en directo con consulta a la audiencia',
      icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
      defaultProps: { hashtag: '#BenidormFest2026', prompt: '¿QUIÉN MERECE EL MICRÓFONO DE BRONCE?' },
    },
    {
      type: 'official_result',
      name: 'Resultado Oficial Auditado',
      category: 'BROADCAST',
      description: 'Indicador notarial de resultados definitivos y auditados',
      icon: <Trophy className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      type: 'host_identifier',
      name: 'Presentadores Oficiales',
      category: 'BROADCAST',
      description: 'Rótulo de presentadores con doble bloque biselado',
      icon: <Users className="w-3.5 h-3.5 text-purple-300" />,
      defaultProps: { name: 'RUTH LORENZO & MARC CALDERÓ', role: 'PRESENTADORES OFICIALES • RTVE' },
    },
    {
      type: 'transition',
      name: 'Cortinilla de Transición Benidorm Fest',
      category: 'BROADCAST',
      description: 'Bisel simétrico y haces direccionales de alta energía',
      icon: <Zap className="w-3.5 h-3.5 text-amber-300" />,
    },
    // SPECIAL
    {
      type: 'special_guest',
      name: 'Artista Invitado / Acto de Intervalo',
      category: 'SPECIAL',
      description: 'Presentación especial fuera de concurso',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
      defaultProps: { title: 'ARTISTA INVITADO', subtitle: 'ACTUACIÓN DE INTERVALO' },
    },
  ];

  const categories: GraphicCategory[] = [
    'GENERAL',
    'SCORES',
    'RANKING',
    'PERFORMANCE',
    'VOTING',
    'RESULTS',
    'BROADCAST',
    'SPECIAL',
  ];

  // Quick Launch Items (Section 26)
  const QUICK_LAUNCH_ITEMS: { label: string; type: GraphicType; ltMode?: 'one_person' | 'two_people' | 'artist_song' | 'info' }[] = [
    { label: 'LT 1 PERSONA', type: 'lower_third_one_person', ltMode: 'one_person' },
    { label: 'LT 2 PERSONAS', type: 'lower_third_two_people', ltMode: 'two_people' },
    { label: 'LT ARTISTA', type: 'lower_third_artist_song', ltMode: 'artist_song' },
    { label: 'LT INFO', type: 'lower_third_info', ltMode: 'info' },
    { label: 'LIVE BUG', type: 'live_bug' },
    { label: 'SCOREBOARD', type: 'scoreboard_split' },
    { label: 'TOP 5', type: 'top_ranking' },
    { label: 'STAGE READY', type: 'performance_intro' },
    { label: 'LÍDER', type: 'current_leader' },
  ];

  // Filtering
  const filteredItems = CATALOG_ITEMS.filter((item) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchDesc) return false;
    }

    // View filter
    if (filterView === 'FAVORITES' && !favorites.includes(item.type)) return false;
    if (filterView === 'PINNED' && !pinned.includes(item.type)) return false;
    if (filterView === 'RECENTS' && !recents.includes(item.type)) return false;

    // Category filter
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;

    return true;
  }).sort((a, b) => {
    // Pinned items bubble up
    const aPin = pinned.includes(a.type) ? 1 : 0;
    const bPin = pinned.includes(b.type) ? 1 : 0;
    return bPin - aPin;
  });

  const handleSelect = (item: CatalogItem, directTake = false) => {
    recordRecent(item.type);
    const layer: GraphicLayer = {
      id: `layer-${item.type}-${Date.now()}`,
      type: item.type,
      name: item.name,
      category: item.category,
      isOnAir: directTake,
      inPreview: !directTake,
      zIndex: onAirLayers.length + 1,
      props: {
        ...item.defaultProps,
        participantId: selectedParticipant?.id,
      },
      takenAt: directTake ? Date.now() : undefined,
    };

    if (directTake) {
      onDirectTake(layer);
    } else {
      onSelectPreview(layer);
    }
  };

  const handleOpenEditLowerThird = (item: CatalogItem) => {
    if (item.ltMode) {
      setQuickLtMode(item.ltMode);
      setActiveTab('quick_lt');
    }
  };

  const handleTakeOut = (itemType: GraphicType) => {
    const onAirMatch = onAirLayers.find((l) => l.type === itemType);
    if (onAirMatch && onTakeOutGraphic) {
      onTakeOutGraphic(onAirMatch.id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] border-l border-slate-800 select-none">
      
      {/* Top Main Tab Navigation */}
      <div className="grid grid-cols-2 bg-[#0c101a] border-b border-slate-800 p-1">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded font-broadcast text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'catalog'
              ? 'bg-purple-900/60 text-purple-200 border border-purple-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Catálogo</span>
        </button>

        <button
          onClick={() => setActiveTab('quick_lt')}
          className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded font-broadcast text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'quick_lt'
              ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Editor Rótulos</span>
        </button>
      </div>

      {/* QUICK LOWER THIRD EDITOR TAB */}
      {activeTab === 'quick_lt' ? (
        <div className="flex-1 overflow-y-auto p-3">
          <LowerThirdQuickEditor
            show={show}
            initialMode={quickLtMode}
            previewLayer={previewLayer}
            onAirLayers={onAirLayers}
            onUpdateActiveLayerProps={onUpdateActiveLayerProps}
            onPreview={(layer) => onSelectPreview(layer)}
            onTake={(layer) => onDirectTake(layer)}
            onClose={() => setActiveTab('catalog')}
          />
        </div>
      ) : (
        /* CATALOG VIEW */
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* QUICK LAUNCH BAR (Section 26) */}
          <div className="p-2 border-b border-slate-800/80 bg-[#080b11]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-purple-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                QUICK LAUNCH
              </span>
              <span className="text-[10px] font-mono text-slate-400">1-click direct take</span>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-0.5 no-scrollbar">
              {QUICK_LAUNCH_ITEMS.map((ql) => {
                const item = CATALOG_ITEMS.find((c) => c.type === ql.type);
                const isOnAir = onAirLayers.some((l) => l.type === ql.type);
                return (
                  <button
                    key={ql.label}
                    onClick={() => {
                      if (item) handleSelect(item, true);
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-all border flex items-center gap-1 ${
                      isOnAir
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 animate-pulse'
                        : 'bg-slate-900 hover:bg-purple-950/60 border-slate-800 hover:border-purple-500/60 text-slate-300 hover:text-white'
                    }`}
                    title={`Take ${ql.label} live`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    {ql.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Context Participant Selector */}
          <div className="px-2.5 py-1.5 border-b border-slate-800/80 bg-[#0d111a] flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">Contexto participante:</span>
            <select
              value={selectedParticipantId}
              onChange={(e) => setSelectedParticipantId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-cyan-300 rounded px-2 py-0.5 font-mono focus:outline-none focus:border-cyan-400 max-w-[190px]"
            >
              {show.participants.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.performanceNumber} {p.name || p.artist}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar (Section 25) */}
          <div className="p-2 border-b border-slate-800/70 bg-[#090d16] flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar gráfico (nombre, tipo, cat)..."
                className="w-full bg-slate-950 border border-slate-800 rounded pl-7 pr-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Views: ALL / FAVORITES / PINNED / RECENTS */}
          <div className="grid grid-cols-4 p-1 gap-1 border-b border-slate-800/60 bg-[#0a0d14] text-[10px] font-mono font-bold">
            <button
              onClick={() => setFilterView('ALL')}
              className={`py-1 rounded text-center transition-all ${
                filterView === 'ALL'
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              TODOS
            </button>
            <button
              onClick={() => setFilterView('FAVORITES')}
              className={`py-1 rounded text-center flex items-center justify-center gap-1 transition-all ${
                filterView === 'FAVORITES'
                  ? 'bg-amber-950/70 text-amber-200 border border-amber-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              FAV
            </button>
            <button
              onClick={() => setFilterView('PINNED')}
              className={`py-1 rounded text-center flex items-center justify-center gap-1 transition-all ${
                filterView === 'PINNED'
                  ? 'bg-cyan-950/70 text-cyan-200 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Pin className="w-2.5 h-2.5 text-cyan-400" />
              FIJADOS
            </button>
            <button
              onClick={() => setFilterView('RECENTS')}
              className={`py-1 rounded text-center flex items-center justify-center gap-1 transition-all ${
                filterView === 'RECENTS'
                  ? 'bg-purple-950/70 text-purple-200 border border-purple-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-2.5 h-2.5 text-purple-400" />
              RECIENTES
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex overflow-x-auto p-1.5 gap-1 border-b border-slate-800/60 bg-[#080b11] no-scrollbar">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-all ${
                activeCategory === 'ALL'
                  ? 'bg-purple-950 text-purple-300 border border-purple-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              TODAS
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-purple-950/90 text-purple-300 border border-purple-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Graphic Cards List */}
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
            {filteredItems.length === 0 ? (
              <div className="p-6 text-center text-slate-500 font-mono text-xs">
                No hay gráficos para el filtro seleccionado.
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const isCurrentlyOnAir = onAirLayers.some((l) => l.type === item.type);
                const isCurrentlyInPreview = previewLayer?.type === item.type;
                const isFav = favorites.includes(item.type);
                const isPin = pinned.includes(item.type);

                return (
                  <div
                    key={`${item.type}-${idx}`}
                    className={`p-2 rounded border transition-all ${
                      isCurrentlyOnAir
                        ? 'bg-rose-950/20 border-rose-500/50 ring-1 ring-rose-500/40'
                        : isCurrentlyInPreview
                        ? 'bg-emerald-950/20 border-emerald-500/50 ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5 mb-1">
                      <div className="flex items-start gap-1.5 min-w-0 flex-1">
                        <div className="p-1 rounded bg-slate-800/70 border border-slate-700/60 flex-shrink-0 mt-0.5">
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-broadcast text-xs font-bold text-white uppercase tracking-wide truncate">
                              {item.name}
                            </span>
                            {isCurrentlyOnAir && (
                              <span className="px-1 py-0.2 rounded bg-rose-600 text-white font-mono text-[8px] font-extrabold uppercase animate-pulse">
                                ON AIR
                              </span>
                            )}
                            {isCurrentlyInPreview && (
                              <span className="px-1 py-0.2 rounded bg-emerald-600 text-white font-mono text-[8px] font-extrabold uppercase">
                                PREV
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Favorite & Pin buttons */}
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => togglePinned(item.type, e)}
                          className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                            isPin ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-300'
                          }`}
                          title={isPin ? 'Desfijar' : 'Fijar gráfico'}
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(item.type, e)}
                          className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                            isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'
                          }`}
                          title={isFav ? 'Quitar favorito' : 'Marcar favorito'}
                        >
                          <Star className={`w-3 h-3 ${isFav ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons: PREVIEW, EDIT, TAKE, OUT */}
                    <div className="flex items-center justify-end gap-1 mt-1.5 pt-1.5 border-t border-slate-800/40">
                      {item.isLowerThird && (
                        <button
                          onClick={() => handleOpenEditLowerThird(item)}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#162035] hover:bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800/60 mr-auto"
                          title="Editar textos y presets de este rótulo"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>EDIT</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleSelect(item, false)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono font-bold transition-colors cursor-pointer"
                        title="Enviar a Previo"
                      >
                        <Eye className="w-2.5 h-2.5 text-emerald-400" />
                        PREV
                      </button>

                      <button
                        onClick={() => handleSelect(item, true)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-900/90 hover:bg-rose-800 text-rose-100 text-[10px] font-broadcast font-bold tracking-wider uppercase transition-colors border border-rose-600/50 cursor-pointer active:scale-95"
                        title="Sacar directamente a emisión (ON AIR)"
                      >
                        <Radio className="w-2.5 h-2.5 text-rose-300" />
                        TAKE
                      </button>

                      {isCurrentlyOnAir && onTakeOutGraphic && (
                        <button
                          onClick={() => handleTakeOut(item.type)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 text-[10px] font-mono font-bold transition-colors border border-slate-700 hover:border-rose-600/60"
                          title="Quitar este gráfico de emisión (OUT)"
                        >
                          <XCircle className="w-2.5 h-2.5 text-rose-400" />
                          OUT
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

    </div>
  );
};
