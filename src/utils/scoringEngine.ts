import {
  ActiveVotingPhase,
  Participant,
  ParticipantScore,
  RevealType,
  Show,
  VotePhaseScores,
} from '../types/broadcast';

/**
 * Ensures consistent VotePhaseScores object for any participant
 */
export function ensureVotePhaseScores(existing?: Partial<ParticipantScore>): VotePhaseScores {
  const vps = existing?.votePhaseScores;
  return {
    professionalJury: vps?.professionalJury ?? existing?.professionalJuryPhaseScore ?? existing?.juryScore ?? 0,
    demoscopic: vps?.demoscopic ?? existing?.demoscopicPhaseScore ?? existing?.demoscopicScore ?? 0,
    public: vps?.public ?? existing?.publicPhaseScore ?? existing?.publicScore ?? 0,
  };
}

/**
 * Authoritative Ranked Participant structure
 */
export interface AuthoritativeRankedParticipant extends Participant {
  position: number;
  previousPosition: number;
  totalScore: number;
  juryScore: number;
  demoscopicScore: number;
  publicScore: number;
  votePhaseScores: VotePhaseScores;
}

/**
 * Validates classification ranking data integrity.
 * Checks sequential positions 1..N, descending score order, and unique stable IDs.
 */
export function validateClassificationRanking(
  ranking: Array<{ id?: string; participantId?: string; position: number; totalScore: number }>
): {
  isValid: boolean;
  isSequential: boolean;
  isSorted: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const expectedPositions = ranking.map((_, index) => index + 1);
  const actualPositions = ranking.map((p) => p.position);

  const isSequential = JSON.stringify(actualPositions) === JSON.stringify(expectedPositions);
  if (!isSequential) {
    errors.push(`Positions are not sequential 1..N: expected [${expectedPositions.join(', ')}], got [${actualPositions.join(', ')}]`);
  }

  let isSorted = true;
  for (let i = 1; i < ranking.length; i++) {
    if (ranking[i - 1].totalScore < ranking[i].totalScore) {
      isSorted = false;
      errors.push(
        `Ranking not descending at rank ${ranking[i].position}: previous score (${ranking[i - 1].totalScore}) < current score (${ranking[i].totalScore})`
      );
      break;
    }
  }

  const seenIds = new Set<string>();
  for (const p of ranking) {
    const id = p.id || p.participantId;
    if (!id) {
      errors.push('Participant missing stable ID');
    } else if (seenIds.has(id)) {
      errors.push(`Duplicate participant ID: ${id}`);
    } else {
      seenIds.add(id);
    }
  }

  const isValid = errors.length === 0;
  if (!isValid && process.env.NODE_ENV !== 'production') {
    console.warn('[Broadcast Validation] Classification ranking anomaly detected:', errors);
  }

  return {
    isValid,
    isSequential,
    isSorted,
    errors,
  };
}

/**
 * Helper to get only active participants competing in the show
 */
export function getActiveParticipants(showOrParticipants: Show | Participant[]): Participant[] {
  const list = Array.isArray(showOrParticipants) ? showOrParticipants : showOrParticipants.participants;
  return list.filter((p) => !p.isRemovedFromCompetition && !p.isSpecialInterval && p.category !== 'special_interval');
}

/**
 * Calculates updated participant scores and rankings.
 * Excludes removed participants from the active competition ranking (1..N).
 * Preserves previousPosition for smooth FLIP ranking transitions without gaps.
 */
export function calculateRankings(
  participants: Participant[],
  currentScores: Record<string, ParticipantScore>,
  options?: { previousPositions?: Record<string, number> }
): {
  updatedScores: Record<string, ParticipantScore>;
  leaderChanged: boolean;
  previousLeaderId?: string;
  newLeaderId?: string;
  rankedParticipants: AuthoritativeRankedParticipant[];
} {
  const prevPositions = options?.previousPositions || {};

  // Split into active competitors, special interval acts, and removed participants
  const activeParticipants = participants.filter(
    (p) => !p.isRemovedFromCompetition && !p.isSpecialInterval && p.category !== 'special_interval'
  );
  const removedOrSpecialParticipants = participants.filter(
    (p) => !!p.isRemovedFromCompetition || !!p.isSpecialInterval || p.category === 'special_interval'
  );

  // Build list of active participants for sorting
  const evaluatedActive = activeParticipants.map((p) => {
    const existing = currentScores[p.id] || {
      participantId: p.id,
      juryScore: 0,
      demoscopicScore: 0,
      publicScore: 0,
      totalScore: 0,
      position: 1,
      previousPosition: 1,
      juryVotes: {},
      votePhaseScores: { professionalJury: 0, demoscopic: 0, public: 0 },
    };

    const phaseScores = ensureVotePhaseScores(existing);
    let totalScore = phaseScores.professionalJury + phaseScores.demoscopic + phaseScores.public;
    if (totalScore === 0 && (existing?.totalScore ?? 0) > 0) {
      totalScore = existing.totalScore;
    }

    return {
      ...existing,
      juryScore: phaseScores.professionalJury,
      demoscopicScore: phaseScores.demoscopic,
      publicScore: phaseScores.public,
      votePhaseScores: phaseScores,
      totalScore,
      performanceNumber: p.performanceNumber,
      participant: p,
    };
  });

  // Sort active participants: highest total score first (descending).
  // Deterministic tie-breaker: public televote score -> jury score -> demoscopic score -> performance number -> stable ID
  evaluatedActive.sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    if (b.publicScore !== a.publicScore) {
      return b.publicScore - a.publicScore;
    }
    if (b.juryScore !== a.juryScore) {
      return b.juryScore - a.juryScore;
    }
    if (b.demoscopicScore !== a.demoscopicScore) {
      return b.demoscopicScore - a.demoscopicScore;
    }
    const perfA = a.performanceNumber ?? 999;
    const perfB = b.performanceNumber ?? 999;
    if (perfA !== perfB) {
      return perfA - perfB;
    }
    return a.participantId.localeCompare(b.participantId);
  });

  const updatedScores: Record<string, ParticipantScore> = {};
  const rankedParticipants: AuthoritativeRankedParticipant[] = [];

  // Assign clean sequential positions 1..N with NO gaps to active participants
  evaluatedActive.forEach((item, index) => {
    const currentPos = index + 1;
    const prevPos = prevPositions[item.participantId] ?? item.position ?? currentPos;

    const scoreEntry: ParticipantScore = {
      participantId: item.participantId,
      juryScore: item.juryScore,
      demoscopicScore: item.demoscopicScore,
      publicScore: item.publicScore,
      totalScore: item.totalScore,
      position: currentPos,
      previousPosition: prevPos,
      juryVotes: { ...item.juryVotes },
      votePhaseScores: { ...item.votePhaseScores },
    };

    updatedScores[item.participantId] = scoreEntry;

    rankedParticipants.push({
      ...item.participant,
      position: currentPos,
      previousPosition: prevPos,
      totalScore: item.totalScore,
      juryScore: item.juryScore,
      demoscopicScore: item.demoscopicScore,
      publicScore: item.publicScore,
      votePhaseScores: { ...item.votePhaseScores },
    });
  });

  // Preserve scores of removed or special interval participants, assigning position 0 (not in active ranking)
  removedOrSpecialParticipants.forEach((p) => {
    const existing = currentScores[p.id] || {
      participantId: p.id,
      juryScore: 0,
      demoscopicScore: 0,
      publicScore: 0,
      totalScore: 0,
      position: 0,
      previousPosition: 0,
      juryVotes: {},
      votePhaseScores: { professionalJury: 0, demoscopic: 0, public: 0 },
    };
    const phaseScores = ensureVotePhaseScores(existing);
    let totalScore = phaseScores.professionalJury + phaseScores.demoscopic + phaseScores.public;
    if (totalScore === 0 && (existing?.totalScore ?? 0) > 0) {
      totalScore = existing.totalScore;
    }

    updatedScores[p.id] = {
      participantId: p.id,
      juryScore: phaseScores.professionalJury,
      demoscopicScore: phaseScores.demoscopic,
      publicScore: phaseScores.public,
      totalScore,
      position: 0, // 0 = removed from active competition ranking
      previousPosition: existing.previousPosition || 0,
      juryVotes: { ...existing.juryVotes },
      votePhaseScores: phaseScores,
    };
  });

  // Validate ranking integrity in development
  validateClassificationRanking(rankedParticipants);

  // Find previous and new leader
  const prevLeaderId = Object.values(currentScores).find((s) => s.position === 1)?.participantId;
  const newLeaderId = rankedParticipants[0]?.id;
  const leaderChanged = !!(prevLeaderId && newLeaderId && prevLeaderId !== newLeaderId);

  return {
    updatedScores,
    leaderChanged,
    previousLeaderId: prevLeaderId,
    newLeaderId,
    rankedParticipants,
  };
}

/**
 * Authoritative Single-Source-of-Truth Ranking Function
 * Always returns participants sorted strictly from position 1 (top/highest score)
 * to position N (bottom/lowest score).
 */
export function getAuthoritativeRanking(
  showOrParticipants: Show | Participant[],
  scores?: Record<string, ParticipantScore>
): AuthoritativeRankedParticipant[] {
  const participants = Array.isArray(showOrParticipants)
    ? showOrParticipants
    : showOrParticipants.participants;
  const currentScores = scores || (Array.isArray(showOrParticipants) ? {} : showOrParticipants.scores) || {};

  const { rankedParticipants } = calculateRankings(participants, currentScores);
  return rankedParticipants;
}

/**
 * Recalculate jury total for a participant given all juries' recorded votes
 */
export function recalculateJuryScores(
  show: Show,
  juryId: string,
  participantId: string,
  points: number
): Show {
  const updatedJuries = show.juries.map((j) => {
    if (j.id === juryId) {
      return {
        ...j,
        votes: {
          ...j.votes,
          [participantId]: points,
        },
      };
    }
    return j;
  });

  // Re-sum jury scores for all participants
  const newScores = { ...show.scores };

  show.participants.forEach((p) => {
    let sumJury = 0;
    const votesReceived: Record<string, number> = {};

    updatedJuries.forEach((j) => {
      const vote = j.votes[p.id] || 0;
      if (vote > 0) {
        sumJury += vote;
        votesReceived[j.id] = vote;
      }
    });

    const current = newScores[p.id] || {
      participantId: p.id,
      juryScore: 0,
      demoscopicScore: 0,
      publicScore: 0,
      totalScore: 0,
      position: 1,
      previousPosition: 1,
      juryVotes: {},
      votePhaseScores: { professionalJury: 0, demoscopic: 0, public: 0 },
    };

    const phaseScores = ensureVotePhaseScores(current);
    phaseScores.professionalJury = sumJury;

    newScores[p.id] = {
      ...current,
      juryScore: sumJury,
      juryVotes: votesReceived,
      votePhaseScores: phaseScores,
    };
  });

  // Remember previous positions for FLIP animation
  const prevPositions: Record<string, number> = {};
  Object.values(show.scores).forEach((s) => {
    prevPositions[s.participantId] = s.position;
  });

  const { updatedScores, leaderChanged, previousLeaderId, newLeaderId } = calculateRankings(
    show.participants,
    newScores,
    { previousPositions: prevPositions }
  );

  return {
    ...show,
    juries: updatedJuries,
    scores: updatedScores,
    previousLeaderId: leaderChanged ? previousLeaderId : show.previousLeaderId,
    currentLeaderId: newLeaderId,
    updatedAt: Date.now(),
  };
}

/**
 * Adds professional jury points directly to participant's professionalJury phase score
 * and accumulates into totalScore, recalculating rankings smoothly.
 */
export function applyJuryPoints(
  show: Show,
  participantId: string,
  pointsAwarded: number
): Show {
  const currentScores = { ...show.scores };
  const current = currentScores[participantId] || {
    participantId,
    juryScore: 0,
    demoscopicScore: 0,
    publicScore: 0,
    totalScore: 0,
    position: 1,
    previousPosition: 1,
    juryVotes: {},
    votePhaseScores: { professionalJury: 0, demoscopic: 0, public: 0 },
  };

  const phaseScores = ensureVotePhaseScores(current);
  const newJuryScore = Math.max(0, phaseScores.professionalJury + pointsAwarded);
  phaseScores.professionalJury = newJuryScore;

  currentScores[participantId] = {
    ...current,
    juryScore: newJuryScore,
    votePhaseScores: phaseScores,
  };

  const prevPositions: Record<string, number> = {};
  Object.values(show.scores).forEach((s) => {
    prevPositions[s.participantId] = s.position;
  });

  const { updatedScores, leaderChanged, previousLeaderId, newLeaderId } = calculateRankings(
    show.participants,
    currentScores,
    { previousPositions: prevPositions }
  );

  return {
    ...show,
    scores: updatedScores,
    activeVotingPhase: 'professionalJury',
    votingStage: 'jury',
    previousLeaderId: leaderChanged ? previousLeaderId : show.previousLeaderId,
    currentLeaderId: newLeaderId,
    updatedAt: Date.now(),
  };
}

/**
 * Updates direct total jury score for a participant
 */
export function updateJuryScore(
  show: Show,
  participantId: string,
  juryScore: number
): Show {
  const currentScores = { ...show.scores };
  const current = currentScores[participantId] || {
    participantId,
    juryScore: 0,
    demoscopicScore: 0,
    publicScore: 0,
    totalScore: 0,
    position: 1,
    previousPosition: 1,
    juryVotes: {},
    votePhaseScores: { professionalJury: 0, demoscopic: 0, public: 0 },
  };

  const phaseScores = ensureVotePhaseScores(current);
  phaseScores.professionalJury = juryScore;

  currentScores[participantId] = {
    ...current,
    juryScore,
    votePhaseScores: phaseScores,
  };

  const prevPositions: Record<string, number> = {};
  Object.values(show.scores).forEach((s) => {
    prevPositions[s.participantId] = s.position;
  });

  const { updatedScores, leaderChanged, previousLeaderId, newLeaderId } = calculateRankings(
    show.participants,
    currentScores,
    { previousPositions: prevPositions }
  );

  return {
    ...show,
    scores: updatedScores,
    activeVotingPhase: 'professionalJury',
    votingStage: 'jury',
    previousLeaderId: leaderChanged ? previousLeaderId : show.previousLeaderId,
    currentLeaderId: newLeaderId,
    updatedAt: Date.now(),
  };
}

/**
 * Updates Demoscopic score while strictly preserving Jury and Public phase scores
 */
export function updateDemoscopicScore(
  show: Show,
  participantId: string,
  demoscopicScore: number
): Show {
  const currentScores = { ...show.scores };
  const current = currentScores[participantId] || {
    participantId,
    juryScore: 0,
    demoscopicScore: 0,
    publicScore: 0,
    totalScore: 0,
    position: 1,
    previousPosition: 1,
    juryVotes: {},
    votePhaseScores: { professionalJury: 0, demoscopic: 0, public: 0 },
  };

  const phaseScores = ensureVotePhaseScores(current);
  phaseScores.demoscopic = demoscopicScore;

  currentScores[participantId] = {
    ...current,
    demoscopicScore,
    votePhaseScores: phaseScores,
  };

  const prevPositions: Record<string, number> = {};
  Object.values(show.scores).forEach((s) => {
    prevPositions[s.participantId] = s.position;
  });

  const { updatedScores, leaderChanged, previousLeaderId, newLeaderId } = calculateRankings(
    show.participants,
    currentScores,
    { previousPositions: prevPositions }
  );

  return {
    ...show,
    scores: updatedScores,
    activeVotingPhase: 'demoscopic',
    previousLeaderId: leaderChanged ? previousLeaderId : show.previousLeaderId,
    currentLeaderId: newLeaderId,
    updatedAt: Date.now(),
  };
}

/**
 * Updates Public Televote score while strictly preserving Jury and Demoscopic phase scores
 */
export function updatePublicScore(
  show: Show,
  participantId: string,
  publicScore: number
): Show {
  const currentScores = { ...show.scores };
  const current = currentScores[participantId] || {
    participantId,
    juryScore: 0,
    demoscopicScore: 0,
    publicScore: 0,
    totalScore: 0,
    position: 1,
    previousPosition: 1,
    juryVotes: {},
    votePhaseScores: { professionalJury: 0, demoscopic: 0, public: 0 },
  };

  const phaseScores = ensureVotePhaseScores(current);
  phaseScores.public = publicScore;

  currentScores[participantId] = {
    ...current,
    publicScore,
    votePhaseScores: phaseScores,
  };

  const prevPositions: Record<string, number> = {};
  Object.values(show.scores).forEach((s) => {
    prevPositions[s.participantId] = s.position;
  });

  const { updatedScores, leaderChanged, previousLeaderId, newLeaderId } = calculateRankings(
    show.participants,
    currentScores,
    { previousPositions: prevPositions }
  );

  return {
    ...show,
    scores: updatedScores,
    activeVotingPhase: 'public',
    previousLeaderId: leaderChanged ? previousLeaderId : show.previousLeaderId,
    currentLeaderId: newLeaderId,
    updatedAt: Date.now(),
  };
}

/**
 * Generic phase score recorder for any active phase
 */
export function recordPhaseScore(
  show: Show,
  phase: ActiveVotingPhase,
  participantId: string,
  points: number
): Show {
  if (phase === 'demoscopic') {
    return updateDemoscopicScore(show, participantId, points);
  } else if (phase === 'public') {
    return updatePublicScore(show, participantId, points);
  } else {
    // Professional jury direct update
    const currentScores = { ...show.scores };
    const current = currentScores[participantId] || {
      participantId,
      juryScore: 0,
      demoscopicScore: 0,
      publicScore: 0,
      totalScore: 0,
      position: 1,
      previousPosition: 1,
      juryVotes: {},
      votePhaseScores: { professionalJury: 0, demoscopic: 0, public: 0 },
    };

    const phaseScores = ensureVotePhaseScores(current);
    phaseScores.professionalJury = points;

    currentScores[participantId] = {
      ...current,
      juryScore: points,
      votePhaseScores: phaseScores,
    };

    const prevPositions: Record<string, number> = {};
    Object.values(show.scores).forEach((s) => {
      prevPositions[s.participantId] = s.position;
    });

    const { updatedScores, leaderChanged, previousLeaderId, newLeaderId } = calculateRankings(
      show.participants,
      currentScores,
      { previousPositions: prevPositions }
    );

    return {
      ...show,
      scores: updatedScores,
      activeVotingPhase: 'professionalJury',
      previousLeaderId: leaderChanged ? previousLeaderId : show.previousLeaderId,
      currentLeaderId: newLeaderId,
      updatedAt: Date.now(),
    };
  }
}

/**
 * Returns the current phase score for a participant
 */
export function getParticipantPhaseScore(
  score: ParticipantScore | undefined,
  phase: ActiveVotingPhase | undefined
): number {
  if (!score) return 0;
  const phaseScores = ensureVotePhaseScores(score);
  switch (phase) {
    case 'demoscopic':
      return phaseScores.demoscopic;
    case 'public':
      return phaseScores.public;
    case 'professionalJury':
    default:
      return phaseScores.professionalJury;
  }
}

/**
 * Determines the broadcast reveal type according to Benidorm Fest animation rules
 */
export function determineRevealType(
  phase: ActiveVotingPhase,
  points: number
): RevealType {
  if (phase === 'professionalJury') {
    // ONLY 12 points gets the special yellow/gold animation
    return points === 12 ? 'jurySpecial12' : 'juryStandard';
  }
  if (phase === 'demoscopic') {
    // EVERY point value in demoscopic gets the special reveal
    return 'demoscopicReveal';
  }
  if (phase === 'public') {
    // EVERY point value in public televote gets the special reveal
    return 'publicReveal';
  }
  return 'juryStandard';
}

/**
 * RESET ALL SCORES: Permanently clears all voting scores for the active show.
 * Preserves participants, show configuration, presets, and lower thirds.
 */
export function resetAllScores(show: Show): Show {
  // 1. Reset all jury vote ballots and completion status
  const resetJuries = show.juries.map((j) => ({
    ...j,
    votes: {},
    isCompleted: false,
  }));

  // 2. Reset scores for all participants to absolute zero
  const resetScores: Record<string, ParticipantScore> = {};

  // Sort active participants by performance number for clean initial ranking
  const activeParticipants = show.participants.filter(
    (p) => !p.isRemovedFromCompetition && !p.isSpecialInterval && p.category !== 'special_interval'
  );
  const sortedActive = [...activeParticipants].sort(
    (a, b) => a.performanceNumber - b.performanceNumber
  );

  sortedActive.forEach((p, index) => {
    resetScores[p.id] = {
      participantId: p.id,
      juryScore: 0,
      demoscopicScore: 0,
      publicScore: 0,
      totalScore: 0,
      position: index + 1,
      previousPosition: index + 1,
      juryVotes: {},
      votePhaseScores: {
        professionalJury: 0,
        demoscopic: 0,
        public: 0,
      },
    };
  });

  // Preserve removed and special interval participants at 0 score and position 0
  show.participants
    .filter((p) => !!p.isRemovedFromCompetition || !!p.isSpecialInterval || p.category === 'special_interval')
    .forEach((p) => {
      resetScores[p.id] = {
        participantId: p.id,
        juryScore: 0,
        demoscopicScore: 0,
        publicScore: 0,
        totalScore: 0,
        position: 0,
        previousPosition: 0,
        juryVotes: {},
        votePhaseScores: {
          professionalJury: 0,
          demoscopic: 0,
          public: 0,
        },
      };
    });

  return {
    ...show,
    juries: resetJuries,
    scores: resetScores,
    activeReveal: undefined,
    currentLeaderId: undefined,
    previousLeaderId: undefined,
    updatedAt: Date.now(),
  };
}

/**
 * RESET SELECTED PARTICIPANT: Resets all scores for a single participant to 0
 */
export function resetParticipantScore(show: Show, participantId: string): Show {
  // Remove votes for this participant across all juries
  const updatedJuries = show.juries.map((j) => {
    if (j.votes && j.votes[participantId]) {
      const nextVotes = { ...j.votes };
      delete nextVotes[participantId];
      return { ...j, votes: nextVotes };
    }
    return j;
  });

  // Reset participant scores to 0
  const currentScores = { ...show.scores };
  const prevScore = currentScores[participantId];

  currentScores[participantId] = {
    participantId,
    juryScore: 0,
    demoscopicScore: 0,
    publicScore: 0,
    totalScore: 0,
    position: prevScore?.position || 1,
    previousPosition: prevScore?.position || 1,
    juryVotes: {},
    votePhaseScores: {
      professionalJury: 0,
      demoscopic: 0,
      public: 0,
    },
  };

  // Recalculate rankings
  const prevPositions: Record<string, number> = {};
  Object.values(show.scores).forEach((s) => {
    prevPositions[s.participantId] = s.position;
  });

  const { updatedScores, leaderChanged, previousLeaderId, newLeaderId } = calculateRankings(
    show.participants,
    currentScores,
    { previousPositions: prevPositions }
  );

  return {
    ...show,
    juries: updatedJuries,
    scores: updatedScores,
    activeReveal:
      show.activeReveal?.participantId === participantId ? undefined : show.activeReveal,
    previousLeaderId: leaderChanged ? previousLeaderId : show.previousLeaderId,
    currentLeaderId: newLeaderId,
    updatedAt: Date.now(),
  };
}

/**
 * REMOVE FROM COMPETITION: Excludes a participant from active ranking and voting.
 * Keeps existing score records recoverable without deleting the participant.
 */
export function removeParticipantFromCompetition(show: Show, participantId: string): Show {
  const updatedParticipants = show.participants.map((p) =>
    p.id === participantId ? { ...p, isRemovedFromCompetition: true } : p
  );

  // Store previous positions for smooth FLIP transition
  const prevPositions: Record<string, number> = {};
  Object.values(show.scores).forEach((s) => {
    prevPositions[s.participantId] = s.position;
  });

  const { updatedScores, leaderChanged, previousLeaderId, newLeaderId } = calculateRankings(
    updatedParticipants,
    show.scores,
    { previousPositions: prevPositions }
  );

  return {
    ...show,
    participants: updatedParticipants,
    scores: updatedScores,
    activeReveal:
      show.activeReveal?.participantId === participantId ? undefined : show.activeReveal,
    previousLeaderId: leaderChanged ? previousLeaderId : show.previousLeaderId,
    currentLeaderId: newLeaderId,
    updatedAt: Date.now(),
  };
}

/**
 * RESTORE TO COMPETITION: Reintegrates a removed participant into active competition
 */
export function restoreParticipantToCompetition(show: Show, participantId: string): Show {
  const updatedParticipants = show.participants.map((p) =>
    p.id === participantId ? { ...p, isRemovedFromCompetition: false } : p
  );

  const prevPositions: Record<string, number> = {};
  Object.values(show.scores).forEach((s) => {
    prevPositions[s.participantId] = s.position;
  });

  const { updatedScores, leaderChanged, previousLeaderId, newLeaderId } = calculateRankings(
    updatedParticipants,
    show.scores,
    { previousPositions: prevPositions }
  );

  return {
    ...show,
    participants: updatedParticipants,
    scores: updatedScores,
    previousLeaderId: leaderChanged ? previousLeaderId : show.previousLeaderId,
    currentLeaderId: newLeaderId,
    updatedAt: Date.now(),
  };
}

/**
 * DELETE PARTICIPANT PERMANENTLY: Fully erases the participant from the show.
 */
export function deleteParticipantPermanently(show: Show, participantId: string): Show {
  const updatedParticipants = show.participants.filter((p) => p.id !== participantId);
  const updatedScores = { ...show.scores };
  delete updatedScores[participantId];

  // Remove from jury ballots
  const updatedJuries = show.juries.map((j) => {
    if (j.votes && j.votes[participantId]) {
      const nextVotes = { ...j.votes };
      delete nextVotes[participantId];
      return { ...j, votes: nextVotes };
    }
    return j;
  });

  // Re-index performance numbers
  const reindexed = updatedParticipants.map((p, idx) => ({
    ...p,
    performanceNumber: idx + 1,
  }));

  const prevPositions: Record<string, number> = {};
  Object.values(updatedScores).forEach((s) => {
    prevPositions[s.participantId] = s.position;
  });

  const { updatedScores: recalculated, leaderChanged, previousLeaderId, newLeaderId } =
    calculateRankings(reindexed, updatedScores, { previousPositions: prevPositions });

  return {
    ...show,
    participants: reindexed,
    juries: updatedJuries,
    scores: recalculated,
    activeReveal:
      show.activeReveal?.participantId === participantId ? undefined : show.activeReveal,
    previousLeaderId: leaderChanged ? previousLeaderId : show.previousLeaderId,
    currentLeaderId: newLeaderId,
    updatedAt: Date.now(),
  };
}
