import React, { useEffect, useState } from 'react';
import { GraphicLayer, Show } from '../../types/broadcast';
import { loadShow, loadOnAirLayers } from '../../utils/storage';
import { BroadcastSyncBus } from '../../utils/broadcastChannel';
import { BroadcastCanvas } from '../preview/BroadcastCanvas';

export const OBSOutputWindow: React.FC = () => {
  const [show, setShow] = useState<Show>(() => loadShow());
  const [onAirLayers, setOnAirLayers] = useState<GraphicLayer[]>(() => loadOnAirLayers());
  const [scale, setScale] = useState<number>(1);

  // Cross-window event-driven synchronization (purely reactive, zero polling churn)
  useEffect(() => {
    const bus = new BroadcastSyncBus();

    const unsubscribe = bus.subscribe((event) => {
      switch (event.type) {
        case 'SYNC_SHOW':
        case 'UPDATE_SCORES':
        case 'REVEAL_SCORE':
          setShow(event.payload);
          break;

        case 'UPDATE_ON_AIR_LAYERS':
          setOnAirLayers(event.payload);
          break;

        case 'TAKE':
          setOnAirLayers((prev) => {
            const filtered = prev.filter((l) => l.type !== event.payload.type);
            return [...filtered, event.payload];
          });
          break;

        case 'OUT':
          setOnAirLayers((prev) => prev.filter((l) => l.id !== event.payload.layerId));
          break;

        case 'CLEAR_ALL_ON_AIR':
          setOnAirLayers([]);
          break;
      }
    });

    return () => {
      bus.destroy();
      unsubscribe();
    };
  }, []);

  // Scale master 1920x1080 canvas to window viewport cleanly
  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      setScale(Math.min(scaleX, scaleY));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-transparent flex items-center justify-center select-none pointer-events-none">
      {/* Authoritative 1920x1080 Master Broadcast Canvas (Transparent, 60fps target) */}
      <div
        className="relative origin-center bg-transparent pointer-events-none"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`,
        }}
      >
        <BroadcastCanvas
          show={show}
          layers={onAirLayers}
          isOBSOutput={true}
        />
      </div>
    </div>
  );
};

