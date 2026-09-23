import { JuryMember, Participant, ParticipantScore, Show, VotingConfig } from '../types/broadcast';
import { calculateRankings } from './scoringEngine';

export const BENIDORM_2025_FINALISTS: Participant[] = [
  {
    id: 'bf25-p1',
    performanceNumber: 1,
    name: 'Daniela Blasco',
    artist: 'Daniela Blasco',
    song: 'UH NANA',
    composers: 'Daniela Blasco, Felix E. Branden, Felix Back',
    arrangers: 'Felix Back, Felix E. Branden',
    smsKeyword: 'VOTA DANIELA',
    phone: '905 810 001',
    category: 'competition',
  },
  {
    id: 'bf25-p2',
    performanceNumber: 2,
    name: 'KUVE',
    artist: 'KUVE',
    song: 'LOCA XTI',
    composers: 'Maryan Frutos, Juan Sueiro',
    arrangers: 'Juan Sueiro',
    smsKeyword: 'VOTA KUVE',
    phone: '905 810 002',
    category: 'competition',
  },
  {
    id: 'bf25-p3',
    performanceNumber: 3,
    name: 'Mawot',
    artist: 'Mawot',
    song: 'Raggio Di Sole',
    composers: 'Roberto Comins',
    arrangers: 'Mawot Studio',
    smsKeyword: 'VOTA MAWOT',
    phone: '905 810 003',
    category: 'competition',
  },
  {
    id: 'bf25-p4',
    performanceNumber: 4,
    name: 'Lachispa',
    artist: 'Lachispa',
    song: 'Hartita de llorar',
    composers: 'Claudia Gómez, Juan Diego, Eduardo Figueroa',
    arrangers: 'Eduardo Figueroa',
    smsKeyword: 'VOTA LACHISPA',
    phone: '905 810 004',
    category: 'competition',
  },
  {
    id: 'bf25-p5',
    performanceNumber: 5,
    name: 'Mel Ömana',
    artist: 'Mel Ömana',
    song: "I'M A QUEEN",
    composers: 'Mel Ömana, Álex Pérez, Gabriel Alonso',
    arrangers: 'Gabriel Alonso',
    smsKeyword: 'VOTA MEL',
    phone: '905 810 005',
    category: 'competition',
  },
  {
    id: 'bf25-p6',
    performanceNumber: 6,
    name: 'J Kbello',
    artist: 'J Kbello',
    song: 'V.I.P.',
    composers: 'Jesús Cabello, María Peláe, Alba Reig',
    arrangers: 'Alba Reig, Jesús Cabello',
    smsKeyword: 'VOTA JBELLO',
    phone: '905 810 006',
    category: 'competition',
  },
  {
    id: 'bf25-p7',
    performanceNumber: 7,
    name: 'Lucas Bun',
    artist: 'Lucas Bun',
    song: 'Te escribo en el cielo',
    composers: 'Lucas Bun, Pau Riutort',
    arrangers: 'Pau Riutort',
    smsKeyword: 'VOTA LUCAS',
    phone: '905 810 007',
    category: 'competition',
  },
  {
    id: 'bf25-p8',
    performanceNumber: 8,
    name: 'Melody',
    artist: 'Melody',
    song: 'ESA DIVA',
    composers: 'Melody, Alberto Fuentes, Joy Deb',
    arrangers: 'Joy Deb, Alberto Fuentes',
    smsKeyword: 'VOTA MELODY',
    phone: '905 810 008',
    category: 'competition',
  },
];

export const BENIDORM_2025_JURIES: JuryMember[] = [
  { id: 'bf25-j1', name: 'Roberto Santamaría', title: 'Presidente Jurado RTVE', votes: {}, isCompleted: true },
  { id: 'bf25-j2', name: 'Beatriz Luengo', title: 'Cantante, Compositora & Actriz', votes: {}, isCompleted: true },
  { id: 'bf25-j3', name: 'Guille Milkyway', title: 'Productor & Líder La Casa Azul', votes: {}, isCompleted: true },
  { id: 'bf25-j4', name: 'Ángela Carrasco', title: 'Vocal Coach & Artista', votes: {}, isCompleted: true },
  { id: 'bf25-j5', name: 'Lee Smithhurst', title: 'Jefe Delegación BBC Eurovision', votes: {}, isCompleted: true },
  { id: 'bf25-j6', name: 'David Tserunyan', title: 'Jefe Delegación AMPTV Armenia', votes: {}, isCompleted: true },
  { id: 'bf25-j7', name: 'Marta Piekarska', title: 'Productora TVP Polonia', votes: {}, isCompleted: true },
  { id: 'bf25-j8', name: 'Nicoline Refsing', title: 'Directora Creativa Internacional', votes: {}, isCompleted: true },
];

/**
 * Historical Final Results Data for Benidorm Fest 2025 Gran Final
 * Preserving separate Professional Jury and Public televote scores.
 * (No demoscopic voting in 2025 final: 50% jury, 50% public)
 */
export const BENIDORM_2025_HISTORICAL_RESULTS = [
  {
    participantId: 'bf25-p8', // Melody - ESA DIVA
    artist: 'Melody',
    song: 'ESA DIVA',
    professionalJuryPhaseScore: 70,
    publicPhaseScore: 80,
    totalScore: 150,
    finalPosition: 1,
  },
  {
    participantId: 'bf25-p1', // Daniela Blasco - UH NANA
    artist: 'Daniela Blasco',
    song: 'UH NANA',
    professionalJuryPhaseScore: 71,
    publicPhaseScore: 70,
    totalScore: 141,
    finalPosition: 2,
  },
  {
    participantId: 'bf25-p6', // J Kbello - V.I.P.
    artist: 'J Kbello',
    song: 'V.I.P.',
    professionalJuryPhaseScore: 74,
    publicPhaseScore: 60,
    totalScore: 134,
    finalPosition: 3,
  },
  {
    participantId: 'bf25-p5', // Mel Ömana - I'M A QUEEN
    artist: 'Mel Ömana',
    song: "I'M A QUEEN",
    professionalJuryPhaseScore: 61,
    publicPhaseScore: 56,
    totalScore: 117,
    finalPosition: 4,
  },
  {
    participantId: 'bf25-p4', // Lachispa - Hartita de llorar
    artist: 'Lachispa',
    song: 'Hartita de llorar',
    professionalJuryPhaseScore: 48,
    publicPhaseScore: 50,
    totalScore: 98,
    finalPosition: 5,
  },
  {
    participantId: 'bf25-p2', // KUVE - LOCA XTI
    artist: 'KUVE',
    song: 'LOCA XTI',
    professionalJuryPhaseScore: 52,
    publicPhaseScore: 44,
    totalScore: 96,
    finalPosition: 6,
  },
  {
    participantId: 'bf25-p7', // Lucas Bun - Te escribo en el cielo
    artist: 'Lucas Bun',
    song: 'Te escribo en el cielo',
    professionalJuryPhaseScore: 38,
    publicPhaseScore: 32,
    totalScore: 70,
    finalPosition: 7,
  },
  {
    participantId: 'bf25-p3', // Mawot - Raggio Di Sole
    artist: 'Mawot',
    song: 'Raggio Di Sole',
    professionalJuryPhaseScore: 18,
    publicPhaseScore: 40,
    totalScore: 58,
    finalPosition: 8,
  },
];

export function createBenidormFest2025VotingConfig(): VotingConfig {
  return {
    juryWeight: 50,
    demoscopicWeight: 0,
    publicWeight: 50,
    pointSequence: [12, 10, 8, 7, 6, 5, 4, 2],
    flipAnimationDurationMs: 2500,
    highScoreThreshold: 12,
  };
}

/**
 * Creates the BENIDORM FEST 2025 show.
 * If mode === 'blank' (default), initializes all scores to 0 for interactive simulation.
 * If mode === 'historical', loads the official final scores (Melody 150 pts winner).
 */
export function createBenidormFest2025Show(mode: 'historical' | 'blank' = 'blank'): Show {
  const now = Date.now();
  const votingConfig = createBenidormFest2025VotingConfig();
  const participants = [...BENIDORM_2025_FINALISTS];
  const juries = [...BENIDORM_2025_JURIES];

  const initialScores: Record<string, ParticipantScore> = {};

  if (mode === 'historical') {
    BENIDORM_2025_HISTORICAL_RESULTS.forEach((res) => {
      initialScores[res.participantId] = {
        participantId: res.participantId,
        juryScore: res.professionalJuryPhaseScore,
        demoscopicScore: 0,
        publicScore: res.publicPhaseScore,
        totalScore: res.totalScore,
        professionalJuryPhaseScore: res.professionalJuryPhaseScore,
        demoscopicPhaseScore: 0,
        publicPhaseScore: res.publicPhaseScore,
        position: res.finalPosition,
        previousPosition: res.finalPosition,
        juryVotes: {},
        votePhaseScores: {
          professionalJury: res.professionalJuryPhaseScore,
          demoscopic: 0,
          public: res.publicPhaseScore,
        },
      };
    });
  } else {
    participants.forEach((p, idx) => {
      initialScores[p.id] = {
        participantId: p.id,
        juryScore: 0,
        demoscopicScore: 0,
        publicScore: 0,
        totalScore: 0,
        professionalJuryPhaseScore: 0,
        demoscopicPhaseScore: 0,
        publicPhaseScore: 0,
        position: idx + 1,
        previousPosition: idx + 1,
        juryVotes: {},
        votePhaseScores: {
          professionalJury: 0,
          demoscopic: 0,
          public: 0,
        },
      };
    });
  }

  const { updatedScores } = calculateRankings(participants, initialScores);

  return {
    id: 'show-benidorm-fest-2025-final',
    name: 'Benidorm Fest 2025 - Gran Final',
    title: 'Benidorm Fest 2025 - Gran Final',
    visualProfileId: 'benidorm_fest_2025',
    showType: 'final',
    stageTitle: 'Gran Final 2025',
    subtitle: 'Identidad Geométrica Modular • Cuadrada',
    votingStage: mode === 'historical' ? 'results' : 'jury',
    activeVotingPhase: 'professionalJury',
    currentJuryId: juries[0].id,
    votingConfig,
    participants,
    juries,
    scores: updatedScores,
    videoSourceUrl: '',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Loads historical 2025 final scores into a 2025 show without taking any graphics on air.
 */
export function load2025HistoricalScores(show: Show): Show {
  const scores: Record<string, ParticipantScore> = {};

  BENIDORM_2025_HISTORICAL_RESULTS.forEach((res) => {
    scores[res.participantId] = {
      participantId: res.participantId,
      juryScore: res.professionalJuryPhaseScore,
      demoscopicScore: 0,
      publicScore: res.publicPhaseScore,
      totalScore: res.totalScore,
      professionalJuryPhaseScore: res.professionalJuryPhaseScore,
      demoscopicPhaseScore: 0,
      publicPhaseScore: res.publicPhaseScore,
      position: res.finalPosition,
      previousPosition: res.finalPosition,
      juryVotes: {},
      votePhaseScores: {
        professionalJury: res.professionalJuryPhaseScore,
        demoscopic: 0,
        public: res.publicPhaseScore,
      },
    };
  });

  const { updatedScores } = calculateRankings(show.participants, scores);

  return {
    ...show,
    votingStage: 'results',
    scores: updatedScores,
    currentLeaderId: 'bf25-p8', // Melody
    updatedAt: Date.now(),
  };
}

/**
 * Resets 2025 show scores to 0 (Simulation mode) without taking any graphics on air.
 */
export function reset2025ScoresToBlank(show: Show): Show {
  const scores: Record<string, ParticipantScore> = {};

  show.participants.forEach((p, idx) => {
    scores[p.id] = {
      participantId: p.id,
      juryScore: 0,
      demoscopicScore: 0,
      publicScore: 0,
      totalScore: 0,
      professionalJuryPhaseScore: 0,
      demoscopicPhaseScore: 0,
      publicPhaseScore: 0,
      position: idx + 1,
      previousPosition: idx + 1,
      juryVotes: {},
      votePhaseScores: {
        professionalJury: 0,
        demoscopic: 0,
        public: 0,
      },
    };
  });

  const { updatedScores } = calculateRankings(show.participants, scores);

  return {
    ...show,
    votingStage: 'jury',
    activeVotingPhase: 'professionalJury',
    scores: updatedScores,
    currentLeaderId: undefined,
    previousLeaderId: undefined,
    activeReveal: undefined,
    updatedAt: Date.now(),
  };
}
