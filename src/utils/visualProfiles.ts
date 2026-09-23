import { Show, ShowVisualProfileId } from '../types/broadcast';

export interface VisualProfileColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  highlight: string;
  pink: string;
  blue: string;
  yellow: string;
  darkNavy: string;
  lightBlue: string;
  white: string;
  nearBlack: string;
}

export interface ShowVisualProfile {
  id: ShowVisualProfileId;
  name: string;
  edition: string;
  year: number;
  geometry: 'angled_chamfer' | 'square_geometric' | 'rounded_capsule';
  bugType: 'chamfer_shield' | 'circular_loop' | 'concentric_target';
  colors: VisualProfileColors;
  tagline: string;
}

export const BENIDORM_FEST_2024_PROFILE: ShowVisualProfile = {
  id: 'benidorm_fest_2024',
  name: 'Benidorm Fest 2024',
  edition: '3ª Edición',
  year: 2024,
  geometry: 'rounded_capsule',
  bugType: 'concentric_target',
  tagline: 'El festival que quieres',
  colors: {
    primary: '#2927F5', // Electric Blue
    secondary: '#D90069', // Magenta
    accent: '#FFD900', // Yellow
    background: '#101044', // Dark Navy
    surface: '#151A75', // Deep Blue
    text: '#FFFFFF', // Pure White
    textMuted: '#4B9DFF', // Light Blue
    highlight: '#FFD900', // Yellow
    pink: '#F00065', // Hot Pink
    blue: '#2927F5', // Electric Blue
    yellow: '#FFD900',
    darkNavy: '#101044',
    lightBlue: '#4B9DFF',
    white: '#FFFFFF',
    nearBlack: '#0A0E2A',
  },
};

export const BENIDORM_FEST_2026_PROFILE: ShowVisualProfile = {
  id: 'benidorm_fest_2026',
  name: 'Benidorm Fest 2026',
  edition: '5ª Edición',
  year: 2026,
  geometry: 'angled_chamfer',
  bugType: 'chamfer_shield',
  tagline: 'El festival que tú quieres',
  colors: {
    primary: '#8b5cf6', // Electric Purple
    secondary: '#00e5ff', // Neon Cyan
    accent: '#fbbf24', // Amber gold
    background: '#060915',
    surface: '#0d1326',
    text: '#ffffff',
    textMuted: '#94a3b8',
    highlight: '#00e5ff',
    pink: '#ec4899',
    blue: '#3b82f6',
    yellow: '#facc15',
    darkNavy: '#0a0f24',
    lightBlue: '#38bdf8',
    white: '#ffffff',
    nearBlack: '#04060c',
  },
};

export const BENIDORM_FEST_2025_PROFILE: ShowVisualProfile = {
  id: 'benidorm_fest_2025',
  name: 'Benidorm Fest 2025',
  edition: '4ª Edición',
  year: 2025,
  geometry: 'square_geometric',
  bugType: 'circular_loop',
  tagline: 'Identidad Geométrica Modular',
  colors: {
    primary: '#F21878', // Vibrant Pink
    secondary: '#246BFF', // Bright Blue
    accent: '#FFD900', // Yellow
    background: '#070B1F', // Near-black navy
    surface: '#101B55', // Dark Navy Blue
    text: '#FFFFFF', // Pure White
    textMuted: '#8EDCFF', // Light Blue
    highlight: '#FFD900', // Yellow
    pink: '#F21878',
    blue: '#246BFF',
    yellow: '#FFD900',
    darkNavy: '#101B55',
    lightBlue: '#8EDCFF',
    white: '#FFFFFF',
    nearBlack: '#070B1F',
  },
};

export const SHOW_VISUAL_PROFILES: Record<ShowVisualProfileId, ShowVisualProfile> = {
  benidorm_fest_2026: BENIDORM_FEST_2026_PROFILE,
  benidorm_fest_2025: BENIDORM_FEST_2025_PROFILE,
  benidorm_fest_2024: BENIDORM_FEST_2024_PROFILE,
};

export function getShowVisualProfileId(show?: Show | null): ShowVisualProfileId {
  if (!show) return 'benidorm_fest_2026';
  if (show.visualProfileId === 'benidorm_fest_2024') return 'benidorm_fest_2024';
  if (show.visualProfileId === 'benidorm_fest_2025') return 'benidorm_fest_2025';
  if (show.visualProfileId === 'benidorm_fest_2026') return 'benidorm_fest_2026';
  // Fallback heuristic based on show title or name or id
  const text = `${show.id || ''} ${show.name || ''} ${show.title || ''}`.toLowerCase();
  if (text.includes('2024')) {
    return 'benidorm_fest_2024';
  }
  if (text.includes('2025')) {
    return 'benidorm_fest_2025';
  }
  return 'benidorm_fest_2026';
}

export function getShowVisualProfile(show?: Show | null): ShowVisualProfile {
  const profileId = getShowVisualProfileId(show);
  return SHOW_VISUAL_PROFILES[profileId] || BENIDORM_FEST_2026_PROFILE;
}

export function isBenidormFest2025(show?: Show | null): boolean {
  return getShowVisualProfileId(show) === 'benidorm_fest_2025';
}

export function isBenidormFest2024(show?: Show | null): boolean {
  return getShowVisualProfileId(show) === 'benidorm_fest_2024';
}
