import { GraphicLayer, Show } from '../types/broadcast';

const CHANNEL_NAME = 'livefest_broadcast_sync_channel';

export type BroadcastSyncEvent =
  | { type: 'SYNC_SHOW'; payload: Show; senderId?: string }
  | { type: 'UPDATE_SCORES'; payload: Show; senderId?: string }
  | { type: 'REVEAL_SCORE'; payload: Show; senderId?: string }
  | { type: 'UPDATE_ON_AIR_LAYERS'; payload: GraphicLayer[]; senderId?: string }
  | { type: 'TAKE'; payload: GraphicLayer; senderId?: string }
  | { type: 'OUT'; payload: { layerId: string }; senderId?: string }
  | { type: 'CLEAR_ALL_ON_AIR'; senderId?: string }
  | { type: 'SYNC_STATE'; show: Show; onAirLayers: GraphicLayer[]; senderId?: string };

export class BroadcastSyncBus {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(event: BroadcastSyncEvent) => void> = new Set();
  private storageHandler: ((e: StorageEvent) => void) | null = null;
  public readonly senderId: string;

  constructor() {
    this.senderId = 'tab_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          const data = event.data as BroadcastSyncEvent;
          if (data && data.senderId !== this.senderId) {
            this.notifyListeners(data);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported', err);
      }
    }

    // Only use localStorage storageEvent fallback if BroadcastChannel is unavailable
    if (typeof window !== 'undefined' && !this.channel) {
      this.storageHandler = (e: StorageEvent) => {
        if (e.key === 'livefest_bus_event' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            if (data && data.senderId !== this.senderId) {
              this.notifyListeners(data);
            }
          } catch {
            // ignore
          }
        }
      };
      window.addEventListener('storage', this.storageHandler);
    }
  }

  public subscribe(callback: (event: BroadcastSyncEvent) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(event: BroadcastSyncEvent) {
    this.listeners.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.error('Error in broadcast listener', err);
      }
    });
  }

  public publish(event: BroadcastSyncEvent): void {
    const stampedEvent = { ...event, senderId: this.senderId };

    if (this.channel) {
      try {
        this.channel.postMessage(stampedEvent);
      } catch (err) {
        console.warn('Broadcast channel postMessage failed', err);
      }
    } else {
      try {
        localStorage.setItem('livefest_bus_event', JSON.stringify({ ...stampedEvent, _t: Date.now() }));
      } catch {
        // ignore
      }
    }
  }

  public syncShow(show: Show) {
    this.publish({ type: 'SYNC_SHOW', payload: show });
  }

  public updateOnAirLayers(layers: GraphicLayer[]) {
    this.publish({ type: 'UPDATE_ON_AIR_LAYERS', payload: layers });
  }

  public take(layer: GraphicLayer) {
    this.publish({ type: 'TAKE', payload: layer });
  }

  public out(layerId: string) {
    this.publish({ type: 'OUT', payload: { layerId } });
  }

  public clearAllOnAir() {
    this.publish({ type: 'CLEAR_ALL_ON_AIR' });
  }

  public destroy() {
    if (this.channel) {
      try {
        this.channel.close();
      } catch {
        // ignore
      }
    }
    if (this.storageHandler && typeof window !== 'undefined') {
      window.removeEventListener('storage', this.storageHandler);
    }
    this.listeners.clear();
  }
}

export const broadcastBus = new BroadcastSyncBus();

