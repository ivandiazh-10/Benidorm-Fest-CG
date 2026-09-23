/**
 * Broadcast Graphics & Scoring Engine Types
 */

export interface Participant {
  id: string;
  name: string; // e.g. "MAYO", "KITAI", "ASHA", "THE QUINQUIS"
  artist: string; // e.g. "Álvaro Mayo"
  song: string; // e.g. "Tócame"
  performanceNumber: number; // 1, 2, 3...
  image?: string;
  flag?: string;
  shortName?: string;
  composers?: string;
  arrangers?: string;
  smsKeyword?: string;
  phone?: string;
  isRemovedFromCompetition?: boolean; // When true: excluded from active ranking & voting, data preserved
  category?: 'competition' | 'special_interval'; // special interval performances never enter competition ranking
  isSpecialInterval?: boolean; // Convenience flag
}

export interface VotePhaseScores {
  professionalJury: number;
  demoscopic: number;
  public: number;
}

export interface ParticipantScore {
  participantId: string;
  juryScore: number;
  demoscopicScore: number;
  publicScore: number;
  totalScore: number;
  position: number;
  previousPosition: number;
  juryVotes: Record<string, number>; // juryId -> points
  votePhaseScores?: VotePhaseScores; // Persistent independent phase scores
  professionalJuryPhaseScore?: number;
  demoscopicPhaseScore?: number;
  publicPhaseScore?: number;
}

export interface JuryMember {
  id: string;
  name: string;
  title?: string;
  image?: string;
  description?: string;
  votes: Record<string, number>; // participantId -> points
  isCompleted: boolean;
}

export interface VotingConfig {
  juryWeight: number; // e.g. 50%
  demoscopicWeight: number; // e.g. 25%
  publicWeight: number; // e.g. 25%
  pointSequence: number[]; // e.g. [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1] or [12, 10, 8, 7, 6, 5, 4, 3, 2]
  flipAnimationDurationMs: number; // default 2500ms
  highScoreThreshold: number; // default 12
}

export type GraphicType =
  // GENERAL
  | 'live_bug'
  | 'announcement'
  | 'lower_third'
  | 'lower_third_one_person'
  | 'lower_third_two_people'
  | 'lower_third_artist_song'
  | 'lower_third_info'
  | 'coming_up'
  | 'next'
  | 'break'
  | 'back_in'
  | 'fullscreen_info'
  | 'venue_info'
  | 'custom_fullscreen'
  // PERFORMANCE
  | 'performance_intro'
  | 'stage_ready'
  | 'performance_identifier'
  | 'performance_id'
  | 'artist_intro'
  | 'song_intro'
  | 'next_performance'
  | 'performance_number'
  | 'interval_guest'
  // VOTING
  | 'voting_open'
  | 'voting_closed'
  | 'voting_countdown'
  | 'voting_banner'
  | 'jury_voting'
  | 'demoscopic_voting'
  | 'public_voting'
  | 'vote_award'
  | 'vote_reveal'
  | 'score_reveal'
  | 'score_update'
  // SCORES
  | 'scoreboard'
  | 'scoreboard_split'
  | 'scoreboard_fullscreen'
  | 'current_score'
  // RANKING
  | 'top_ranking'
  | 'top_3_podium'
  | 'top_5'
  | 'top_10'
  | 'classification_fullscreen'
  | 'full_classification'
  | 'current_leader'
  | 'new_leader'
  | 'leader_change'
  | 'rank_change'
  // RESULTS
  | 'winner'
  | 'winner_reveal'
  | 'winner_celebration'
  | 'final_result'
  | 'final_classification'
  | 'qualified'
  | 'not_qualified'
  | 'qualification_result'
  | 'break_coming_up'
  // SPECIAL
  | 'special_guest'
  | 'interval_performance'
  | 'returning_artist'
  // BROADCAST / LIVE
  | 'replay'
  | 'slow_motion'
  | 'live_replay'
  | 'split_screen'
  | 'picture_in_picture'
  | 'camera_identifier'
  | 'shot_identifier'
  | 'live_location'
  | 'backstage'
  | 'green_room'
  | 'jury_room'
  | 'voting_room'
  | 'programme_clock'
  | 'segment_clock'
  | 'show_countdown'
  | 'performance_countdown'
  | 'act_identifier'
  | 'round_identifier'
  | 'semifinal_identifier'
  | 'final_identifier'
  | 'break_in'
  | 'break_out'
  | 'coming_back'
  | 'next_segment'
  | 'tease'
  | 'highlight'
  | 'special_moment'
  | 'audience_vote'
  | 'live_poll'
  | 'social_moment'
  | 'hashtag_moment'
  | 'official_result'
  | 'results_pending'
  | 'verified_result'
  | 'record'
  | 'new_record'
  | 'host_identifier'
  | 'presenter_identifier'
  | 'location_identifier'
  | 'show_open'
  | 'show_close'
  | 'section_open'
  | 'section_close'
  | 'bumper_in'
  | 'bumper_out'
  | 'sting'
  | 'transition';

export interface LowerThirdPreset {
  id: string;
  name: string;
  mode: 'one_person' | 'two_people' | 'artist_song' | 'info';
  props: {
    // One person
    title?: string;
    subtitle?: string;
    name?: string;
    role?: string;
    // Two people
    person1Name?: string;
    person1Role?: string;
    person2Name?: string;
    person2Role?: string;
    // Artist + Song
    artist?: string;
    song?: string;
    badgeNumber?: string | number;
    descriptor?: string;
    customOptions?: any;
    [key: string]: any;
  };
}

export type GraphicCategory =
  | 'GENERAL'
  | 'PERFORMANCE'
  | 'VOTING'
  | 'SCORES'
  | 'RANKING'
  | 'RESULTS'
  | 'LOWER THIRDS'
  | 'BROADCAST'
  | 'SPECIAL';

export interface GraphicLayer {
  id: string;
  type: GraphicType;
  name: string;
  category: GraphicCategory;
  isOnAir: boolean;
  inPreview: boolean;
  zIndex: number;
  props: Record<string, any>;
  takenAt?: number;
}

export type VotingStage = 'idle' | 'jury' | 'demoscopic' | 'public' | 'results' | 'winner' | 'completed';

export type ActiveVotingPhase = 'professionalJury' | 'demoscopic' | 'public';

export type RevealType =
  | 'juryStandard'
  | 'jurySpecial12'
  | 'demoscopicReveal'
  | 'publicReveal'
  | 'winner';

export type ShowVisualProfileId = 'benidorm_fest_2026' | 'benidorm_fest_2025' | 'benidorm_fest_2024';

export interface Show {
  id: string;
  name: string;
  title?: string;
  visualProfileId?: ShowVisualProfileId;
  showType: 'semifinal' | 'final' | 'custom';
  stageTitle: string; // e.g. "Gran Final", "Semifinal 1"
  subtitle?: string;
  votingStage: VotingStage;
  activeVotingPhase?: ActiveVotingPhase;
  currentJuryId?: string;
  votingConfig: VotingConfig;
  participants: Participant[];
  juries: JuryMember[];
  scores: Record<string, ParticipantScore>;
  videoSourceUrl?: string;
  activeReveal?: ActiveRevealState;
  previousLeaderId?: string;
  currentLeaderId?: string;
  countdownSecondsRemaining?: number;
  isCountdownRunning?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ActiveRevealState {
  participantId: string;
  phase?: ActiveVotingPhase;
  type?: 'jury' | 'demoscopic' | 'public' | 'winner';
  revealType?: RevealType;
  pointsAwarded: number;
  isHighScore: boolean;
  revealedAt: number;
  durationMs: number;
  recipientName?: string;
  recipientSong?: string;
}

export interface PreviewSettings {
  zoomMode: 'fit' | '50%' | '100%' | 'zoom';
  showActionSafe: boolean; // 90%
  showTitleSafe: boolean; // 80%
  showCenterGrid: boolean;
  showStageBackground: boolean; // true = simulated stage background, false = transparent/checkerboard
  activeAudioCue: boolean;
}
