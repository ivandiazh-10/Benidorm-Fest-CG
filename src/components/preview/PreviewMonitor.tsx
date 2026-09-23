import React, { useEffect, useRef, useState } from 'react';
import { GraphicLayer, Show, PreviewSettings } from '../../types/broadcast';
import { BroadcastCanvas } from './BroadcastCanvas';
import { Maximize2, Shield, Grid, Eye, Radio, Sparkles, Layers } from 'lucide-react';

interface PreviewMonitorProps {
  show: Show;
  previewLayer: GraphicLayer | null;
  onAirLayers: GraphicLayer[];
  previewSettings: PreviewSettings;
  onUpdateSettings: (newSettings: Partial<PreviewSettings>) => void;
  onTake: () => void;
  onClearPreview: () => void;
  viewMode: 'preview' | 'on_air'; // toggle between inspecting Preview layer vs Program On-Air composite
  onChangeViewMode: (mode: 'preview' | 'on_air') => void;
}

export const PreviewMonitor: React.FC<PreviewMonitorProps> = ({
  show,
  previewLayer,
  onAirLayers,
  previewSettings,
  onUpdateSettings,
  onTake,
  onClearPreview,
  viewMode,
  onChangeViewMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.5);

  // ResizeObserver to calculate optimal FIT scale
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      // Reserve space for top and bottom toolbar (~80px)
      const availableW = clientWidth - 24;
      const availableH = clientHeight - 88;

      if (previewSettings.zoomMode === 'fit') {
        const scaleW = availableW / 1920;
        const scaleH = availableH / 1080;
        const fitScale = Math.min(scaleW, scaleH);
        setScale(Math.max(0.2, fitScale));
      } else if (previewSettings.zoomMode === '50%') {
        setScale(0.5);
      } else if (previewSettings.zoomMode === '100%') {
        setScale(1.0);
      } else if (previewSettings.zoomMode === 'zoom') {
        setScale(0.75);
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [previewSettings.zoomMode]);

  // Which layers are we rendering in this monitor viewport?
  const layersToRender = viewMode === 'preview' ? (previewLayer ? [previewLayer] : []) : onAirLayers;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 h-full flex flex-col bg-[#07090e] border border-slate-800 rounded overflow-hidden select-none"
    >
      {/* Top Monitor Bar: Tally Status, Mode Switcher, Zoom & Safe Area Toggles */}
      <div className="h-10 bg-[#0d1117] border-b border-slate-800/80 px-4 flex items-center justify-between z-20">
        
        {/* Tally / Source Selector */}
        <div className="flex items-center gap-2">
          {/* PREVIEW Tally (Green) */}
          <button
            id="btn-monitor-preview-mode"
            onClick={() => onChangeViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
              viewMode === 'preview'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${viewMode === 'preview' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            PREVIEW {previewLayer ? `(${previewLayer.name})` : '(EMPTY)'}
          </button>

          {/* PROGRAM ON-AIR Tally (Red) */}
          <button
            id="btn-monitor-program-mode"
            onClick={() => onChangeViewMode('on_air')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
              viewMode === 'on_air'
                ? 'bg-rose-950 text-rose-300 border border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${viewMode === 'on_air' ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
            PROGRAM LIVE ({onAirLayers.length} LAYERS)
          </button>
        </div>

        {/* Zoom & Guide Overlays */}
        <div className="flex items-center gap-2 text-xs">
          {/* Zoom modes */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 font-mono">
            {(['fit', '50%', 'zoom', '100%'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onUpdateSettings({ zoomMode: mode })}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                  previewSettings.zoomMode === mode ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Safe Areas / Stage BG toggles */}
          <div className="flex items-center gap-1">
            <button
              title="Toggle Action Safe (90%)"
              onClick={() => onUpdateSettings({ showActionSafe: !previewSettings.showActionSafe })}
              className={`p-1.5 rounded border transition-colors ${
                previewSettings.showActionSafe
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
            </button>

            <button
              title="Toggle Title Safe (80%)"
              onClick={() => onUpdateSettings({ showTitleSafe: !previewSettings.showTitleSafe })}
              className={`p-1.5 rounded border transition-colors ${
                previewSettings.showTitleSafe
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
            </button>

            <button
              title="Toggle Crosshair Grid"
              onClick={() => onUpdateSettings({ showCenterGrid: !previewSettings.showCenterGrid })}
              className={`p-1.5 rounded border transition-colors ${
                previewSettings.showCenterGrid
                  ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>

            <button
              title="Toggle TV Stage Backdrop vs Transparent Alpha"
              onClick={() => onUpdateSettings({ showStageBackground: !previewSettings.showStageBackground })}
              className={`p-1.5 rounded border transition-colors ${
                previewSettings.showStageBackground
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Scaled Viewport Canvas Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-3 bg-[#030407]">
        <div
          className="relative shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-slate-800/80 bg-black flex-shrink-0"
          style={{
            width: `${1920 * scale}px`,
            height: `${1080 * scale}px`,
          }}
        >
          <div
            className="absolute top-0 left-0 origin-top-left pointer-events-none"
            style={{
              width: '1920px',
              height: '1080px',
              transform: `scale(${scale})`,
            }}
          >
            <BroadcastCanvas
              show={show}
              layers={layersToRender}
              previewSettings={previewSettings}
              isOBSOutput={false}
            />
          </div>
        </div>
      </div>

      {/* Monitor Bottom Control Bar: TAKE, OUT, and Layer Info */}
      <div className="h-12 bg-[#0a0d14] border-t border-slate-800 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400">
            {viewMode === 'preview' ? (
              previewLayer ? (
                <span className="text-emerald-400 font-bold">READY TO TAKE: {previewLayer.name}</span>
              ) : (
                <span className="text-slate-500">Preview empty. Select a graphic from Library.</span>
              )
            ) : (
              <span className="text-rose-400 font-bold">ON AIR: {onAirLayers.length} active layer(s)</span>
            )}
          </span>
        </div>

        {/* Tactile TAKE & CLEAR Buttons */}
        <div className="flex items-center gap-2">
          {previewLayer && (
            <button
              id="btn-preview-clear"
              onClick={onClearPreview}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-colors"
            >
              CLEAR PREVIEW
            </button>
          )}

          <button
            id="btn-monitor-take"
            disabled={!previewLayer}
            onClick={onTake}
            className={`px-6 py-2 rounded text-xs font-broadcast font-bold tracking-wider uppercase transition-all shadow-md ${
              previewLayer
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white ring-2 ring-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer active:scale-95'
                : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            TAKE → ON AIR
          </button>
        </div>
      </div>

    </div>
  );
};
