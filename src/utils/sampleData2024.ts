import { JuryMember, Participant, ParticipantScore, Show, VotingConfig } from '../types/broadcast';
import { calculateRankings } from './scoringEngine';

export interface Benidorm2024HistoricalResult {
  participantId: string;
  artist: string;
  song: string;
  professionalJuryScore: number;
  demoscopicScore: number;
  televoteScore: number;
  totalScore: number;
  finalPosition: number;
}

export const BENIDORM_2024_ALL_PARTICIPANTS: Participant[] = [
  // Semifinal 1
  {
    id: 'bf24-p1',
    performanceNumber: 1,
    name: 'Lérica',
    artist: 'Lérica',
    song: 'Astronauta',
    composers: 'Tony Sánchez Ohlsson, Juan Carlos Arauzo',
    arrangers: 'Tony Sánchez Ohlsson',
    smsKeyword: 'VOTA LERICA',
    phone: '905 810 001',
    category: 'competition',
  },
  {
    id: 'bf24-p2',
    performanceNumber: 2,
    name: 'Noan',
    artist: 'Noan',
    song: 'Te echo de -',
    composers: 'Íñigo Pérez, Juan Ewan, Paula Mattheus',
    arrangers: 'Juan Ewan',
    smsKeyword: 'VOTA NOAN',
    phone: '905 810 002',
    category: 'competition',
  },
  {
    id: 'bf24-p3',
    performanceNumber: 3,
    name: 'Sofía Coll',
    artist: 'Sofía Coll',
    song: 'Here to Stay',
    composers: 'Sofía Coll, Nacho Canut, Mauro Canut',
    arrangers: 'Mauro Canut',
    smsKeyword: 'VOTA SOFIA',
    phone: '905 810 003',
    category: 'competition',
  },
  {
    id: 'bf24-p4',
    performanceNumber: 4,
    name: 'Mantra',
    artist: 'Mantra',
    song: 'Me vas a ver',
    composers: 'Carlos Marco, Paula Pérez, Charly Maldona',
    arrangers: 'Carlos Marco',
    smsKeyword: 'VOTA MANTRA',
    phone: '905 810 004',
    category: 'competition',
  },
  {
    id: 'bf24-p5',
    performanceNumber: 5,
    name: 'Miss Caffeina',
    artist: 'Miss Caffeina',
    song: 'Bla bla bla',
    composers: 'Alberto Jiménez, Sergio Sastre, Antonio Poza',
    arrangers: 'Max Dingel',
    smsKeyword: 'VOTA CAFFEINA',
    phone: '905 810 005',
    category: 'competition',
  },
  {
    id: 'bf24-p6',
    performanceNumber: 6,
    name: 'Quique Niza',
    artist: 'Quique Niza',
    song: 'Prisionero',
    composers: 'Kenji Domínguez, Jose Otero, Juan Sueiro',
    arrangers: 'Juan Sueiro',
    smsKeyword: 'VOTA QUIQUE',
    phone: '905 810 006',
    category: 'competition',
  },
  {
    id: 'bf24-p7',
    performanceNumber: 7,
    name: 'Angy Fernández',
    artist: 'Angy Fernández',
    song: 'Sé quién soy',
    composers: 'Angy Fernández, Thomas G:son, Dino Medanhodzic',
    arrangers: 'Dino Medanhodzic',
    smsKeyword: 'VOTA ANGY',
    phone: '905 810 007',
    category: 'competition',
  },
  {
    id: 'bf24-p8',
    performanceNumber: 8,
    name: 'Nebulossa',
    artist: 'Nebulossa',
    song: 'Zorra',
    composers: 'María Bas, Mark Dasousa',
    arrangers: 'Mark Dasousa',
    smsKeyword: 'VOTA NEBULOSSA',
    phone: '905 810 008',
    category: 'competition',
  },

  // Semifinal 2
  {
    id: 'bf24-p9',
    performanceNumber: 9,
    name: 'María Peláe',
    artist: 'María Peláe',
    song: 'Remitente',
    composers: 'María Peláe, Alba Reig',
    arrangers: 'Alba Reig',
    smsKeyword: 'VOTA MARIAPELAE',
    phone: '905 810 009',
    category: 'competition',
  },
  {
    id: 'bf24-p10',
    performanceNumber: 10,
    name: 'Dellacruz',
    artist: 'Dellacruz',
    song: 'Beso en la mañana',
    composers: 'Jorge de la Cruz, Carlos Almazán',
    arrangers: 'Carlos Almazán',
    smsKeyword: 'VOTA DELLACRUZ',
    phone: '905 810 010',
    category: 'competition',
  },
  {
    id: 'bf24-p11',
    performanceNumber: 11,
    name: 'Marlena',
    artist: 'Marlena',
    song: 'Amor de verano',
    composers: 'Ana Legazpi, Carolina Moyano, Joan Valls',
    arrangers: 'Joan Valls',
    smsKeyword: 'VOTA MARLENA',
    phone: '905 810 011',
    category: 'competition',
  },
  {
    id: 'bf24-p12',
    performanceNumber: 12,
    name: 'St. Pedro',
    artist: 'St. Pedro',
    song: 'Dos extraños (Cuarteto de cuerda)',
    composers: 'Pedro Hernández, Ioné de la Cruz, Nelson Hernández',
    arrangers: 'Nelson Hernández',
    smsKeyword: 'VOTA STPEDRO',
    phone: '905 810 012',
    category: 'competition',
  },
  {
    id: 'bf24-p13',
    performanceNumber: 13,
    name: 'Jorge González',
    artist: 'Jorge González',
    song: 'Caliente',
    composers: 'Jorge González, David Parejo, Manuel Serrano',
    arrangers: 'David Parejo',
    smsKeyword: 'VOTA JORGE',
    phone: '905 810 013',
    category: 'competition',
  },
  {
    id: 'bf24-p14',
    performanceNumber: 14,
    name: 'Yoly Saa',
    artist: 'Yoly Saa',
    song: 'No se me olvida',
    composers: 'Yoly Saa, Emilio Mercader',
    arrangers: 'Emilio Mercader',
    smsKeyword: 'VOTA YOLY',
    phone: '905 810 014',
    category: 'competition',
  },
  {
    id: 'bf24-p15',
    performanceNumber: 15,
    name: 'Roger Padrós',
    artist: 'Roger Padrós',
    song: 'El temps',
    composers: 'Roger Padrós',
    arrangers: 'Roger Padrós',
    smsKeyword: 'VOTA ROGER',
    phone: '905 810 015',
    category: 'competition',
  },
  {
    id: 'bf24-p16',
    performanceNumber: 16,
    name: 'Almácor',
    artist: 'Almácor',
    song: 'Brillos platino',
    composers: 'Arturo Almarcha Corella, Alejandro Capdevila',
    arrangers: 'Alejandro Capdevila',
    smsKeyword: 'VOTA ALMACOR',
    phone: '905 810 016',
    category: 'competition',
  },

  // Special / Interval Guest
  {
    id: 'bf24-guest-1',
    performanceNumber: 0,
    name: 'Ruth Lorenzo',
    artist: 'Ruth Lorenzo',
    song: 'Dancing in the rain',
    composers: 'Ruth Lorenzo, Jim Irvin, Julian Emery',
    arrangers: 'Julian Emery',
    category: 'special_interval',
    isSpecialInterval: true,
  },
];

// The 8 Gran Final 2024 Finalists in broadcast running order
export const BENIDORM_2024_FINALISTS: Participant[] = [
  {
    id: 'bf24-p9',
    performanceNumber: 1,
    name: 'María Peláe',
    artist: 'María Peláe',
    song: 'Remitente',
    composers: 'María Peláe, Alba Reig',
    arrangers: 'Alba Reig',
    smsKeyword: 'VOTA MARIAPELAE',
    phone: '905 810 001',
    category: 'competition',
  },
  {
    id: 'bf24-p12',
    performanceNumber: 2,
    name: 'St. Pedro',
    artist: 'St. Pedro',
    song: 'Dos extraños (Cuarteto de cuerda)',
    composers: 'Pedro Hernández, Ioné de la Cruz, Nelson Hernández',
    arrangers: 'Nelson Hernández',
    smsKeyword: 'VOTA STPEDRO',
    phone: '905 810 002',
    category: 'competition',
  },
  {
    id: 'bf24-p7',
    performanceNumber: 3,
    name: 'Angy Fernández',
    artist: 'Angy Fernández',
    song: 'Sé quién soy',
    composers: 'Angy Fernández, Thomas G:son, Dino Medanhodzic',
    arrangers: 'Dino Medanhodzic',
    smsKeyword: 'VOTA ANGY',
    phone: '905 810 003',
    category: 'competition',
  },
  {
    id: 'bf24-p13',
    performanceNumber: 4,
    name: 'Jorge González',
    artist: 'Jorge González',
    song: 'Caliente',
    composers: 'Jorge González, David Parejo, Manuel Serrano',
    arrangers: 'David Parejo',
    smsKeyword: 'VOTA JORGE',
    phone: '905 810 004',
    category: 'competition',
  },
  {
    id: 'bf24-p8',
    performanceNumber: 5,
    name: 'Nebulossa',
    artist: 'Nebulossa',
    song: 'Zorra',
    composers: 'María Bas, Mark Dasousa',
    arrangers: 'Mark Dasousa',
    smsKeyword: 'VOTA NEBULOSSA',
    phone: '905 810 005',
    category: 'competition',
  },
  {
    id: 'bf24-p3',
    performanceNumber: 6,
    name: 'Sofía Coll',
    artist: 'Sofía Coll',
    song: 'Here to Stay',
    composers: 'Sofía Coll, Nacho Canut, Mauro Canut',
    arrangers: 'Mauro Canut',
    smsKeyword: 'VOTA SOFIA',
    phone: '905 810 006',
    category: 'competition',
  },
  {
    id: 'bf24-p5',
    performanceNumber: 7,
    name: 'Miss Caffeina',
    artist: 'Miss Caffeina',
    song: 'Bla bla bla',
    composers: 'Alberto Jiménez, Sergio Sastre, Antonio Poza',
    arrangers: 'Max Dingel',
    smsKeyword: 'VOTA CAFFEINA',
    phone: '905 810 007',
    category: 'competition',
  },
  {
    id: 'bf24-p16',
    performanceNumber: 8,
    name: 'Almácor',
    artist: 'Almácor',
    song: 'Brillos platino',
    composers: 'Arturo Almarcha Corella, Alejandro Capdevila',
    arrangers: 'Alejandro Capdevila',
    smsKeyword: 'VOTA ALMACOR',
    phone: '905 810 008',
    category: 'competition',
  },
];

// Official Historical Final Results (Final Position descending order)
export const BENIDORM_2024_HISTORICAL_RESULTS: Benidorm2024HistoricalResult[] = [
  {
    participantId: 'bf24-p8',
    artist: 'Nebulossa',
    song: 'Zorra',
    professionalJuryScore: 86,
    demoscopicScore: 30,
    televoteScore: 40,
    totalScore: 156,
    finalPosition: 1,
  },
  {
    participantId: 'bf24-p12',
    artist: 'St. Pedro',
    song: 'Dos extraños (Cuarteto de cuerda)',
    professionalJuryScore: 86,
    demoscopicScore: 28,
    televoteScore: 25,
    totalScore: 139,
    finalPosition: 2,
  },
  {
    participantId: 'bf24-p7',
    artist: 'Angy Fernández',
    song: 'Sé quién soy',
    professionalJuryScore: 63,
    demoscopicScore: 35,
    televoteScore: 30,
    totalScore: 128,
    finalPosition: 3,
  },
  {
    participantId: 'bf24-p13',
    artist: 'Jorge González',
    song: 'Caliente',
    professionalJuryScore: 49,
    demoscopicScore: 40,
    televoteScore: 35,
    totalScore: 124,
    finalPosition: 4,
  },
  {
    participantId: 'bf24-p16',
    artist: 'Almácor',
    song: 'Brillos platino',
    professionalJuryScore: 51,
    demoscopicScore: 20,
    televoteScore: 28,
    totalScore: 99,
    finalPosition: 5,
  },
  {
    participantId: 'bf24-p9',
    artist: 'María Peláe',
    song: 'Remitente',
    professionalJuryScore: 41,
    demoscopicScore: 25,
    televoteScore: 20,
    totalScore: 86,
    finalPosition: 6,
  },
  {
    participantId: 'bf24-p3',
    artist: 'Sofía Coll',
    song: 'Here to Stay',
    professionalJuryScore: 29,
    demoscopicScore: 22,
    televoteScore: 22,
    totalScore: 73,
    finalPosition: 7,
  },
  {
    participantId: 'bf24-p5',
    artist: 'Miss Caffeina',
    song: 'Bla bla bla',
    professionalJuryScore: 27,
    demoscopicScore: 16,
    televoteScore: 16,
    totalScore: 59,
    finalPosition: 8,
  },
];

export const BENIDORM_2024_JURIES: JuryMember[] = [
  {
    id: 'jury-2024-1',
    name: 'Beatriz Luengo (Portavoz)',
    title: 'Presidenta del Jurado 2024',
    votes: {},
    isCompleted: false,
  },
  {
    id: 'jury-2024-2',
    name: 'Carlos Baute',
    title: 'Cantautor',
    votes: {},
    isCompleted: false,
  },
  {
    id: 'jury-2024-3',
    name: 'Guille Milkway',
    title: 'Productor musical',
    votes: {},
    isCompleted: false,
  },
  {
    id: 'jury-2024-4',
    name: 'Ángela Carrasco',
    title: 'Cantante y actriz',
    votes: {},
    isCompleted: false,
  },
  {
    id: 'jury-2024-5',
    name: 'Lee Smithhurst',
    title: 'Jefe de delegación Reino Unido',
    votes: {},
    isCompleted: false,
  },
  {
    id: 'jury-2024-6',
    name: 'David Tserunyan',
    title: 'Jefe de delegación Armenia',
    votes: {},
    isCompleted: false,
  },
  {
    id: 'jury-2024-7',
    name: 'Twan van de Nieuwenhuijzen',
    title: 'Productor ESC 2021',
    votes: {},
    isCompleted: false,
  },
  {
    id: 'jury-2024-8',
    name: 'Nicoline Refsing',
    title: 'Directora artística',
    votes: {},
    isCompleted: false,
  },
];

export const BENIDORM_2024_VOTING_CONFIG: VotingConfig = {
  juryWeight: 0.5,
  demoscopicWeight: 0.25,
  publicWeight: 0.25,
  pointSequence: [12, 10, 8, 7, 6, 5, 4, 2],
  flipAnimationDurationMs: 2500,
  highScoreThreshold: 12,
};

/**
 * Creates the official dedicated Benidorm Fest 2024 Show.
 * Default is simulation mode (all scores zero).
 * Historical results can be optionally loaded.
 */
export function createBenidormFest2024Show(mode: 'blank' | 'historical' = 'blank'): Show {
  const participants = [...BENIDORM_2024_FINALISTS];
  const juries = [...BENIDORM_2024_JURIES];
  const votingConfig = { ...BENIDORM_2024_VOTING_CONFIG };
  const now = Date.now();

  const initialScores: Record<string, ParticipantScore> = {};

  if (mode === 'historical') {
    BENIDORM_2024_HISTORICAL_RESULTS.forEach((res) => {
      initialScores[res.participantId] = {
        participantId: res.participantId,
        juryScore: res.professionalJuryScore,
        demoscopicScore: res.demoscopicScore,
        publicScore: res.televoteScore,
        totalScore: res.totalScore,
        professionalJuryPhaseScore: res.professionalJuryScore,
        demoscopicPhaseScore: res.demoscopicScore,
        publicPhaseScore: res.televoteScore,
        position: res.finalPosition,
        previousPosition: res.finalPosition,
        juryVotes: {},
        votePhaseScores: {
          professionalJury: res.professionalJuryScore,
          demoscopic: res.demoscopicScore,
          public: res.televoteScore,
        },
      };
    });
  } else {
    // Default live simulation mode: All scores strictly 0
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
    id: 'benidorm-fest-2024',
    name: 'Benidorm Fest 2024',
    title: 'Benidorm Fest 2024 - Gran Final',
    visualProfileId: 'benidorm_fest_2024',
    showType: 'final',
    stageTitle: 'Gran Final',
    subtitle: 'El festival que quieres • 3ª Edición',
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
 * Loads historical 2024 final scores into a 2024 show without taking any graphics on air.
 */
export function load2024HistoricalScores(show: Show): Show {
  const scores: Record<string, ParticipantScore> = {};

  BENIDORM_2024_HISTORICAL_RESULTS.forEach((res) => {
    scores[res.participantId] = {
      participantId: res.participantId,
      juryScore: res.professionalJuryScore,
      demoscopicScore: res.demoscopicScore,
      publicScore: res.televoteScore,
      totalScore: res.totalScore,
      professionalJuryPhaseScore: res.professionalJuryScore,
      demoscopicPhaseScore: res.demoscopicScore,
      publicPhaseScore: res.televoteScore,
      position: res.finalPosition,
      previousPosition: res.finalPosition,
      juryVotes: {},
      votePhaseScores: {
        professionalJury: res.professionalJuryScore,
        demoscopic: res.demoscopicScore,
        public: res.televoteScore,
      },
    };
  });

  const { updatedScores } = calculateRankings(show.participants, scores);

  return {
    ...show,
    votingStage: 'results',
    scores: updatedScores,
    currentLeaderId: 'bf24-p8', // Nebulossa
    updatedAt: Date.now(),
  };
}

/**
 * Resets 2024 show scores to 0 (Simulation mode) without taking any graphics on air.
 */
export function reset2024ScoresToBlank(show: Show): Show {
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
