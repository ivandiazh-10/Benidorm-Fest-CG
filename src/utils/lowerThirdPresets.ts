import { LowerThirdPreset } from '../types/broadcast';

const STORAGE_KEY = 'livefest_lower_third_presets_v1';

export const DEFAULT_LOWER_THIRD_PRESETS: LowerThirdPreset[] = [
  {
    id: 'preset-presenter-1',
    name: 'Ruth Lorenzo (Presentadora)',
    mode: 'one_person',
    props: {
      title: 'RUTH LORENZO',
      subtitle: 'PRESENTADORA',
    },
  },
  {
    id: 'preset-presenter-2',
    name: 'Marc Calderó (Presentador)',
    mode: 'one_person',
    props: {
      title: 'MARC CALDERÓ',
      subtitle: 'PRESENTADOR',
    },
  },
  {
    id: 'preset-duo-presenters',
    name: 'Ruth Lorenzo + Marc Calderó (Dúo)',
    mode: 'two_people',
    props: {
      person1Name: 'RUTH LORENZO',
      person1Role: 'PRESENTADORA',
      person2Name: 'MARC CALDERÓ',
      person2Role: 'PRESENTADOR',
    },
  },
  {
    id: 'preset-jury-spokesperson',
    name: 'Beatriz Luengo (Jurado)',
    mode: 'one_person',
    props: {
      title: 'BEATRIZ LUENGO',
      subtitle: 'PORTAVOZ DEL JURADO',
    },
  },
  {
    id: 'preset-artist-nebulossa',
    name: 'Nebulossa — Zorra',
    mode: 'artist_song',
    props: {
      artist: 'NEBULOSSA',
      song: 'ZORRA',
      badgeNumber: '08',
      descriptor: 'ACTUACIÓN INVITADA',
    },
  },
  {
    id: 'preset-info-location',
    name: 'Benidorm / Palau d\'Esports',
    mode: 'info',
    props: {
      title: 'BENIDORM',
      subtitle: 'PALAU D\'ESPORTS L\'ILLA DE BENIDORM',
    },
  },
  {
    id: 'preset-info-voting-open',
    name: 'Votación Abierta (Info)',
    mode: 'info',
    props: {
      title: 'LÍNEAS ABIERTAS',
      subtitle: 'TELÉFONO Y SMS ACTIVOS',
    },
  },
];

export function loadLowerThirdPresets(): LowerThirdPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveLowerThirdPresets(DEFAULT_LOWER_THIRD_PRESETS);
      return DEFAULT_LOWER_THIRD_PRESETS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_LOWER_THIRD_PRESETS;
  } catch (err) {
    console.error('Error loading lower third presets', err);
    return DEFAULT_LOWER_THIRD_PRESETS;
  }
}

export function saveLowerThirdPresets(presets: LowerThirdPreset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (err) {
    console.error('Error saving lower third presets', err);
  }
}

export function addLowerThirdPreset(preset: Omit<LowerThirdPreset, 'id'>): LowerThirdPreset {
  const presets = loadLowerThirdPresets();
  const newPreset: LowerThirdPreset = {
    ...preset,
    id: `preset-${Date.now()}`,
  };
  const updated = [newPreset, ...presets];
  saveLowerThirdPresets(updated);
  return newPreset;
}

export function updateLowerThirdPreset(preset: LowerThirdPreset): void {
  const presets = loadLowerThirdPresets();
  const index = presets.findIndex((p) => p.id === preset.id);
  if (index >= 0) {
    presets[index] = preset;
    saveLowerThirdPresets(presets);
  }
}

export function deleteLowerThirdPreset(presetId: string): void {
  const presets = loadLowerThirdPresets();
  const filtered = presets.filter((p) => p.id !== presetId);
  saveLowerThirdPresets(filtered);
}
