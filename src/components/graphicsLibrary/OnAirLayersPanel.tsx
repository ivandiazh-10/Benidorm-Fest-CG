import React from 'react';
import { GraphicLayer } from '../../types/broadcast';
import { Radio, X, ArrowUp, ArrowDown, EyeOff, Layers, Trash2 } from 'lucide-react';

interface OnAirLayersPanelProps {
  onAirLayers: GraphicLayer[];
  onRemoveLayer: (layerId: string) => void;
  onClearAll: () => void;
  onMoveLayer: (index: number, direction: 'up' | 'down') => void;
}

export const OnAirLayersPanel: React.FC<OnAirLayersPanelProps> = ({
  onAirLayers,
  onRemoveLayer,
  onClearAll,
  onMoveLayer,
}) => {
  return (
    <div className="flex flex-col bg-[#0b0e16] border-t border-slate-800 p-3 select-none">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
          </div>
          <h3 className="font-broadcast text-xs font-bold uppercase tracking-wider text-rose-300">
            Active On-Air Layers ({onAirLayers.length})
          </h3>
        </div>

        {onAirLayers.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-[11px] font-mono text-rose-400 hover:text-rose-200 transition-colors px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/60"
          >
            <Trash2 className="w-3 h-3" />
            TAKE ALL OUT
          </button>
        )}
      </div>

      {/* Layers List */}
      <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
        {onAirLayers.length === 0 ? (
          <div className="py-4 text-center border border-dashed border-slate-800 rounded bg-slate-900/30">
            <span className="text-xs font-mono text-slate-500">
              No graphics currently on air.
            </span>
          </div>
        ) : (
          onAirLayers.map((layer, index) => (
            <div
              key={layer.id}
              className="flex items-center justify-between p-2 rounded bg-slate-900 border border-rose-500/30 hover:border-rose-400/50 shadow-sm"
            >
              {/* Layer Title & Category */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded bg-rose-950 text-rose-300 border border-rose-700/60 flex items-center justify-center font-mono text-[10px] font-bold">
                  {index + 1}
                </span>
                <div className="truncate">
                  <span className="font-broadcast text-xs font-bold text-white uppercase truncate block">
                    {layer.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {layer.category}
                  </span>
                </div>
              </div>

              {/* Controls: Reorder & OUT */}
              <div className="flex items-center gap-1">
                <button
                  disabled={index === 0}
                  onClick={() => onMoveLayer(index, 'up')}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                  title="Move Layer Up"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  disabled={index === onAirLayers.length - 1}
                  onClick={() => onMoveLayer(index, 'down')}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                  title="Move Layer Down"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onRemoveLayer(layer.id)}
                  className="px-2 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[11px] font-broadcast font-bold uppercase transition-colors ml-1 border border-rose-700/50"
                  title="Take Out Graphic"
                >
                  OUT
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
