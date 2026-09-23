import { useMemo, useRef } from 'react';
import { Participant, ParticipantScore, Show, VotePhaseScores } from '../../types/broadcast';
import {
  AuthoritativeRankedParticipant,
  ensureVotePhaseScores,
  validateClassificationRanking,
} from '../scoringEngine';

export interface UseRankingOptions {
  excludeRemoved?: boolean;
  excludeSpecialInterval?: boolean;
  previousPositions?: Record<string, number>;
}

export interface UseRankingResult {
  /** Sequential, descending ranking array (Rank 1 with highest score at index 0) */
  ranking: AuthoritativeRankedParticipant[];
  /** Map of participant ID to AuthoritativeRankedParticipant */
  rankingMap: Map<string, AuthoritativeRankedParticipant>;
  /** The current first-place leader */
  leader: AuthoritativeRankedParticipant | null;
  /** True if the leader changed compared to the previous evaluation */
  leaderChanged: boolean;
  /** Previous leader ID before this evaluation */
  previousLeaderId?: string;
  /** Count of active competitors */
  totalCompetitors: number;
  /** Quick lookup for position (1-based index) */
  getParticipantRank: (id: string) => number;
  /** Quick lookup for complete score details */
  getParticipantScore: (id: string) => AuthoritativeRankedParticipant | undefined;
}

/**
 * calculateRanking:
 * Pure, centralized, authoritative ranking calculator.
 * - Always sorts descending: Highest total score first (Rank 1 at top), lowest at bottom.
 * - Strict exclusion of removed participants (`isRemovedFromCompetition`).
 * - Deterministic tie-breaking (Public televote -> Jury -> Demoscopic -> Performance number -> Stable ID).
 * - Guaranteed sequential 1..N ranks with stable participant IDs.
 */
export function calculateRanking(
  participants: Participant[],
  scores?: Record<string, ParticipantScore>,
  options?: UseRankingOptions
): AuthoritativeRankedParticipant[] {
  if (!participants || !Array.isArray(participants)) {
    return [];
  }

  const currentScores = scores || {};
  const prevPositions = options?.previousPositions || {};
  const excludeRemoved = options?.excludeRemoved !== false;
  const excludeSpecial = options?.excludeSpecialInterval !== false;

  // 1. Separate active competitors from removed/guest acts
  const activeParticipants = participants.filter((p) => {
    if (excludeRemoved && p.isRemovedFromCompetition) return false;
    if (excludeSpecial && (p.isSpecialInterval || p.category === 'special_interval')) return false;
    return true;
  });

  // 2. Build evaluated list with authoritative total scores
  const evaluated = activeParticipants.map((p) => {
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

    const phaseScores: VotePhaseScores = ensureVotePhaseScores(existing);
    let totalScore =
      (phaseScores.professionalJury || 0) +
      (phaseScores.demoscopic || 0) +
      (phaseScores.public || 0);

    // If sum of phases is 0, fall back to stored totalScore if positive
    if (totalScore === 0 && (existing.totalScore ?? 0) > 0) {
      totalScore = existing.totalScore;
    }

    return {
      participant: p,
      participantId: p.id,
      juryScore: phaseScores.professionalJury || 0,
      demoscopicScore: phaseScores.demoscopic || 0,
      publicScore: phaseScores.public || 0,
      votePhaseScores: phaseScores,
      totalScore,
      performanceNumber: p.performanceNumber ?? 999,
      existingPos: existing.position,
    };
  });

  // 3. Strict Descending Sort: Highest score first, lowest score last
  // Deterministic tie-breaker rules:
  // (a) Total score descending
  // (b) Public televote descending
  // (c) Professional jury descending
  // (d) Demoscopic score descending
  // (e) Performance running order ascending
  // (f) Stable participant ID ascending
  evaluated.sort((a, b) => {
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
    if (a.performanceNumber !== b.performanceNumber) {
      return a.performanceNumber - b.performanceNumber;
    }
    return a.participantId.localeCompare(b.participantId);
  });

  // 4. Map sequential 1..N ranks with stable participant IDs
  const result: AuthoritativeRankedParticipant[] = evaluated.map((item, index) => {
    const currentPos = index + 1;
    const prevPos = prevPositions[item.participantId] ?? item.existingPos ?? currentPos;

    return {
      ...item.participant,
      position: currentPos,
      previousPosition: prevPos,
      totalScore: item.totalScore,
      juryScore: item.juryScore,
      demoscopicScore: item.demoscopicScore,
      publicScore: item.publicScore,
      votePhaseScores: item.votePhaseScores,
    };
  });

  // Development validation
  validateClassificationRanking(result);

  return result;
}

/**
 * useRanking:
 * Centralized hook for authoritative ranking across Scoreboard, Classification,
 * ParticipantManager, and Podium graphics.
 */
export function useRanking(
  showOrParticipants: Show | Participant[],
  scores?: Record<string, ParticipantScore>,
  options?: UseRankingOptions
): UseRankingResult {
  const prevLeaderRef = useRef<string | undefined>(undefined);
  const prevPositionsRef = useRef<Record<string, number>>({});

  const participants = useMemo(() => {
    return Array.isArray(showOrParticipants)
      ? showOrParticipants
      : showOrParticipants.participants;
  }, [showOrParticipants]);

  const currentScores = useMemo(() => {
    if (scores) return scores;
    return Array.isArray(showOrParticipants) ? {} : showOrParticipants.scores || {};
  }, [showOrParticipants, scores]);

  const ranking = useMemo(() => {
    const calculated = calculateRanking(participants, currentScores, {
      ...options,
      previousPositions: prevPositionsRef.current,
    });

    // Update previous positions cache for future transitions
    const newPositions: Record<string, number> = {};
    calculated.forEach((p) => {
      newPositions[p.id] = p.position;
    });
    prevPositionsRef.current = newPositions;

    return calculated;
  }, [participants, currentScores, options]);

  const rankingMap = useMemo(() => {
    const map = new Map<string, AuthoritativeRankedParticipant>();
    ranking.forEach((p) => map.set(p.id, p));
    return map;
  }, [ranking]);

  const leader = ranking[0] || null;
  const currentLeaderId = leader?.id;
  const previousLeaderId = prevLeaderRef.current;
  const leaderChanged = Boolean(
    previousLeaderId && currentLeaderId && previousLeaderId !== currentLeaderId
  );

  // Update previous leader ref after comparison
  if (currentLeaderId !== prevLeaderRef.current) {
    prevLeaderRef.current = currentLeaderId;
  }

  const getParticipantRank = (id: string): number => {
    return rankingMap.get(id)?.position ?? 0;
  };

  const getParticipantScore = (id: string): AuthoritativeRankedParticipant | undefined => {
    return rankingMap.get(id);
  };

  return {
    ranking,
    rankingMap,
    leader,
    leaderChanged,
    previousLeaderId,
    totalCompetitors: ranking.length,
    getParticipantRank,
    getParticipantScore,
  };
}
