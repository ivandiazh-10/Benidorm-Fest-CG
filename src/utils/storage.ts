import { GraphicLayer, Show } from '../types/broadcast';
import { createDemoShow } from './sampleData';
import { createBenidormFest2025Show } from './sampleData2025';
import { createBenidormFest2024Show } from './sampleData2024';

const SHOWS_STORAGE_KEY = 'livefest_shows_store_bf_multi_v3';
const ACTIVE_SHOW_ID_KEY = 'livefest_active_show_id_multi_v3';
const ON_AIR_LAYERS_KEY = 'livefest_on_air_layers';
const PREVIEW_LAYER_KEY = 'livefest_preview_layer';

export function loadAllShows(): Show[] {
  try {
    const raw = localStorage.getItem(SHOWS_STORAGE_KEY);
    let shows: Show[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        shows = parsed;
      }
    }

    if (shows.length === 0) {
      const show2026 = createDemoShow();
      const show2025 = createBenidormFest2025Show('blank');
      const show2024 = createBenidormFest2024Show('blank');
      shows = [show2026, show2025, show2024];
      saveAllShows(shows);
      localStorage.setItem(ACTIVE_SHOW_ID_KEY, show2026.id);
      return shows;
    }

    // Ensure Benidorm Fest 2025 show exists in storage
    const has2025 = shows.some(
      (s) => s.visualProfileId === 'benidorm_fest_2025' || s.id === 'show-benidorm-fest-2025-final'
    );
    if (!has2025) {
      const show2025 = createBenidormFest2025Show('blank');
      shows = [...shows, show2025];
      saveAllShows(shows);
    }

    // Ensure Benidorm Fest 2024 show exists in storage
    const has2024 = shows.some(
      (s) => s.visualProfileId === 'benidorm_fest_2024' || s.id === 'benidorm-fest-2024'
    );
    if (!has2024) {
      const show2024 = createBenidormFest2024Show('blank');
      shows = [...shows, show2024];
      saveAllShows(shows);
    }

    return shows;
  } catch (err) {
    console.error('Error loading shows from localStorage', err);
    const show2026 = createDemoShow();
    const show2025 = createBenidormFest2025Show('blank');
    const show2024 = createBenidormFest2024Show('blank');
    return [show2026, show2025, show2024];
  }
}

export function loadShow(): Show {
  const shows = loadAllShows();
  const activeId = getActiveShowId();
  const found = shows.find((s) => s.id === activeId);
  return found || shows[0];
}

export function saveAllShows(shows: Show[]): void {
  try {
    localStorage.setItem(SHOWS_STORAGE_KEY, JSON.stringify(shows));
  } catch (err) {
    console.error('Error saving shows to localStorage', err);
  }
}

export function getActiveShowId(): string {
  return localStorage.getItem(ACTIVE_SHOW_ID_KEY) || '';
}

export function setActiveShowId(id: string): void {
  localStorage.setItem(ACTIVE_SHOW_ID_KEY, id);
}

export function saveShow(updatedShow: Show): Show[] {
  const shows = loadAllShows();
  const index = shows.findIndex((s) => s.id === updatedShow.id);
  let nextShows: Show[];
  if (index >= 0) {
    nextShows = [...shows];
    nextShows[index] = { ...updatedShow, updatedAt: Date.now() };
  } else {
    nextShows = [...shows, { ...updatedShow, updatedAt: Date.now() }];
  }
  saveAllShows(nextShows);
  return nextShows;
}

export function deleteShow(id: string): { shows: Show[]; nextActiveId: string } {
  const shows = loadAllShows();
  const filtered = shows.filter((s) => s.id !== id);
  if (filtered.length === 0) {
    const demo = createDemoShow();
    saveAllShows([demo]);
    setActiveShowId(demo.id);
    return { shows: [demo], nextActiveId: demo.id };
  }
  saveAllShows(filtered);
  const nextId = filtered[0].id;
  setActiveShowId(nextId);
  return { shows: filtered, nextActiveId: nextId };
}

export function duplicateShow(show: Show): Show {
  const now = Date.now();
  const duplicated: Show = {
    ...JSON.parse(JSON.stringify(show)),
    id: `show-${now}`,
    name: `${show.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };
  saveShow(duplicated);
  setActiveShowId(duplicated.id);
  return duplicated;
}

export function exportShowToFile(show: Show): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(show, null, 2));
  const downloadAnchor = document.createElement('a');
  const filename = `${show.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}_broadcast_data.json`;
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function loadOnAirLayers(): GraphicLayer[] {
  try {
    const raw = localStorage.getItem(ON_AIR_LAYERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOnAirLayers(layers: GraphicLayer[]): void {
  try {
    localStorage.setItem(ON_AIR_LAYERS_KEY, JSON.stringify(layers));
  } catch (err) {
    console.error('Error saving on air layers', err);
  }
}

export function loadPreviewLayer(): GraphicLayer | null {
  try {
    const raw = localStorage.getItem(PREVIEW_LAYER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePreviewLayer(layer: GraphicLayer | null): void {
  try {
    if (!layer) {
      localStorage.removeItem(PREVIEW_LAYER_KEY);
    } else {
      localStorage.setItem(PREVIEW_LAYER_KEY, JSON.stringify(layer));
    }
  } catch (err) {
    console.error('Error saving preview layer', err);
  }
}
