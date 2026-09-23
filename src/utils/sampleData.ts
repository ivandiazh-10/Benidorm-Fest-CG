import { JuryMember, Participant, ParticipantScore, Show, VotingConfig } from '../types/broadcast';
import { calculateRankings } from './scoringEngine';

export const DEFAULT_FINAL_POINT_SEQUENCE = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
export const DEFAULT_SEMIFINAL_POINT_SEQUENCE = [12, 10, 8, 7, 6, 5, 4, 3, 2];

export function createDefaultVotingConfig(isFinal = true): VotingConfig {
  return {
    juryWeight: 50,
    demoscopicWeight: 25,
    publicWeight: 25,
    pointSequence: isFinal ? [...DEFAULT_FINAL_POINT_SEQUENCE] : [...DEFAULT_SEMIFINAL_POINT_SEQUENCE],
    flipAnimationDurationMs: 2500,
    highScoreThreshold: 12,
  };
}

export function createEmptyShow(name = 'New Live Broadcast', type: 'semifinal' | 'final' = 'final'): Show {
  const votingConfig = createDefaultVotingConfig(type === 'final');
  const now = Date.now();

  // Create 8 default professional jurors
  const juries: JuryMember[] = Array.from({ length: 8 }, (_, i) => ({
    id: `jury-${i + 1}`,
    name: `Juror ${i + 1}`,
    title: i === 0 ? 'Jury President' : `Juror Member ${i + 1}`,
    votes: {},
    isCompleted: false,
  }));

  return {
    id: `show-${now}`,
    name,
    visualProfileId: 'benidorm_fest_2026',
    showType: type,
    stageTitle: type === 'final' ? 'Gran Final' : 'Semifinal',
    subtitle: 'Music Competition Broadcast',
    votingStage: 'idle',
    activeVotingPhase: 'professionalJury',
    currentJuryId: juries[0].id,
    votingConfig,
    participants: [],
    juries,
    scores: {},
    videoSourceUrl: '',
    createdAt: now,
    updatedAt: now,
  };
}

export function createDemoShow(): Show {
  const now = Date.now();
  const votingConfig = createDefaultVotingConfig(true);

  // 12 participants based on official Benidorm Fest 2026 Final running order
  const demoParticipants: Participant[] = [
    {
      id: 'p-1',
      performanceNumber: 1,
      name: 'MAYO',
      artist: 'Álvaro Mayo',
      song: 'Tócame',
      composers: 'Álvaro Mayo, Rose Molina, Raúl Gómez',
      arrangers: 'Mike Wit, Álvaro Mayo',
      smsKeyword: 'VOTA MAYO',
      phone: '905 810 001',
      category: 'competition',
    },
    {
      id: 'p-2',
      performanceNumber: 2,
      name: 'KITAI',
      artist: 'Kitai',
      song: 'El Amor Te Da Miedo',
      composers: 'Kitai',
      arrangers: 'Kitai Studio',
      smsKeyword: 'VOTA KITAI',
      phone: '905 810 002',
      category: 'competition',
    },
    {
      id: 'p-3',
      performanceNumber: 3,
      name: 'ASHA',
      artist: 'Asha',
      song: 'Turista',
      composers: 'Asha, Nicole Blair',
      arrangers: 'Red Triangle',
      smsKeyword: 'VOTA ASHA',
      phone: '905 810 003',
      category: 'competition',
    },
    {
      id: 'p-4',
      performanceNumber: 4,
      name: 'DANI J',
      artist: 'Dani J',
      song: 'Bailándote',
      composers: 'Dani J, David Augustave',
      arrangers: 'Dani J',
      smsKeyword: 'VOTA DANI',
      phone: '905 810 004',
      category: 'competition',
    },
    {
      id: 'p-5',
      performanceNumber: 5,
      name: 'THE QUINQUIS',
      artist: 'The Quinquis',
      song: 'Tú No Me Quieres',
      composers: 'The Quinquis Band',
      arrangers: 'The Quinquis',
      smsKeyword: 'VOTA QUINQUIS',
      phone: '905 810 005',
      category: 'competition',
    },
    {
      id: 'p-6',
      performanceNumber: 6,
      name: 'IZAN LLUNAS',
      artist: 'Izan Llunas',
      song: '¿Qué vas a hacer?',
      composers: 'Izan Llunas, Marcos Llunas',
      arrangers: 'Sound Lab',
      smsKeyword: 'VOTA IZAN',
      phone: '905 810 006',
      category: 'competition',
    },
    {
      id: 'p-7',
      performanceNumber: 7,
      name: 'MIKEL HERZOG JR.',
      artist: 'Mikel Herzog Jr.',
      song: 'Mi Mitad',
      composers: 'Mikel Herzog',
      arrangers: 'Herzog Production',
      smsKeyword: 'VOTA MIKEL',
      phone: '905 810 007',
      category: 'competition',
    },
    {
      id: 'p-8',
      performanceNumber: 8,
      name: 'MARÍA LEÓN FT. JULIA MEDINA',
      artist: 'María León ft. Julia Medina',
      song: 'Las Damas y el Vagabundo',
      composers: 'Julia Medina, María León',
      arrangers: 'Acoustic Soul',
      smsKeyword: 'VOTA MARÍA',
      phone: '905 810 008',
      category: 'competition',
    },
    {
      id: 'p-9',
      performanceNumber: 9,
      name: 'ROSALINDA GALÁN',
      artist: 'Rosalinda Galán',
      song: 'Mataora',
      composers: 'Rosalinda Galán',
      arrangers: 'Galán Music',
      smsKeyword: 'VOTA ROSA',
      phone: '905 810 009',
      category: 'competition',
    },
    {
      id: 'p-10',
      performanceNumber: 10,
      name: 'KENNETH',
      artist: 'Kenneth',
      song: 'Los Ojos No Mienten',
      composers: 'Kenneth White',
      arrangers: 'Synthetix',
      smsKeyword: 'VOTA KENNETH',
      phone: '905 810 010',
      category: 'competition',
    },
    {
      id: 'p-11',
      performanceNumber: 11,
      name: 'MIRANDA! & BAILAMAMÁ',
      artist: 'Miranda! & bailamamá',
      song: 'Despierto Amándote',
      composers: 'Ale Sergi, Juliana Gattas',
      arrangers: 'Miranda Lab',
      smsKeyword: 'VOTA MIRANDA',
      phone: '905 810 011',
      category: 'competition',
    },
    {
      id: 'p-12',
      performanceNumber: 12,
      name: 'TONY GROX & LUCYCALYS',
      artist: 'Tony Grox & LUCYCALYS',
      song: 'T AMARÉ',
      composers: 'Tony Grox, LUCYCALYS',
      arrangers: 'Groove House',
      smsKeyword: 'VOTA TONY',
      phone: '905 810 012',
      category: 'competition',
    },
    // Special Interval / Guest Acts (Never enter competition ranking)
    {
      id: 'sp-1',
      performanceNumber: 90,
      name: 'CHANEL',
      artist: 'Chanel',
      song: 'SloMo / Medley',
      composers: 'Leroy Sanchez',
      category: 'special_interval',
      isSpecialInterval: true,
    },
    {
      id: 'sp-2',
      performanceNumber: 91,
      name: 'BLANCA PALOMA',
      artist: 'Blanca Paloma',
      song: 'Eaea',
      composers: 'Blanca Paloma, José Pablo Polo',
      category: 'special_interval',
      isSpecialInterval: true,
    },
    {
      id: 'sp-3',
      performanceNumber: 92,
      name: 'NEBULOSSA',
      artist: 'Nebulossa',
      song: 'ZORRA',
      composers: 'Mark Dasousa, Mery Bas',
      category: 'special_interval',
      isSpecialInterval: true,
    },
    {
      id: 'sp-4',
      performanceNumber: 93,
      name: 'MELODY',
      artist: 'Melody',
      song: 'Bandida',
      composers: 'Melody',
      category: 'special_interval',
      isSpecialInterval: true,
    },
  ];

  // 8 Professional Jurors
  const demoJuries: JuryMember[] = [
    { id: 'j-1', name: 'Ignacio Meyer', title: 'Pte. Univisión Networks Group', votes: {}, isCompleted: false },
    { id: 'j-2', name: 'Melanie Parejo', title: 'Dir. Música Sur y Este Europa Spotify', votes: {}, isCompleted: false },
    { id: 'j-3', name: 'Carlos Baute', title: 'Cantautor & Productor Musical', votes: {}, isCompleted: false },
    { id: 'j-4', name: 'Beatriz Luengo', title: 'Compositora & Artista Internacional', votes: {}, isCompleted: false },
    { id: 'j-5', name: 'Guille Milkway', title: 'Compositor & Productor', votes: {}, isCompleted: false },
    { id: 'j-6', name: 'Ángela Carrasco', title: 'Vocal Coach & Cantante', votes: {}, isCompleted: false },
    { id: 'j-7', name: 'Lee Smithhurst', title: 'Jefe Delegación BBC', votes: {}, isCompleted: false },
    { id: 'j-8', name: 'Marta Piekarska', title: 'Productora TV Internacional', votes: {}, isCompleted: false },
  ];

  // Initialize initial starting scores
  const initialScores: Record<string, ParticipantScore> = {};
  demoParticipants.forEach((p, idx) => {
    initialScores[p.id] = {
      participantId: p.id,
      juryScore: 0,
      demoscopicScore: 0,
      publicScore: 0,
      totalScore: 0,
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

  const { updatedScores } = calculateRankings(demoParticipants, initialScores);

  return {
    id: `show-${now}`,
    name: 'Benidorm Fest 2026 - Gran Final',
    title: 'Benidorm Fest 2026 - Gran Final',
    visualProfileId: 'benidorm_fest_2026',
    showType: 'final',
    stageTitle: 'Gran Final',
    subtitle: 'Live TV Broadcast Graphics Control',
    votingStage: 'jury',
    activeVotingPhase: 'professionalJury',
    currentJuryId: demoJuries[0].id,
    votingConfig,
    participants: demoParticipants,
    juries: demoJuries,
    scores: updatedScores,
    videoSourceUrl: '',
    createdAt: now,
    updatedAt: now,
  };
}

export function generateBenidormFestShow(): Show {
  return createDemoShow();
}

export function generateDefaultParticipants(): Participant[] {
  return createDemoShow().participants;
}
