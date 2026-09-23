import React from 'react';
import { AnimatePresence } from 'motion/react';
import { GraphicLayer, Show, PreviewSettings } from '../../types/broadcast';
import { BackgroundStage } from '../graphics/BackgroundStage';
import { ScoreboardGraphic } from '../graphics/ScoreboardGraphic';
import { LowerThirdGraphic } from '../graphics/LowerThirdGraphic';
import { PerformanceIntroGraphic } from '../graphics/PerformanceIntroGraphic';
import { StageReadyGraphic } from '../graphicsLibrary/StageReady';
import { PerformanceIdGraphic } from '../graphics/PerformanceIdGraphic';
import { VotingBannerGraphic } from '../graphics/VotingBannerGraphic';
import { VotingCountdownGraphic } from '../graphics/VotingCountdownGraphic';
import { TopRankingGraphic } from '../graphics/TopRankingGraphic';
import { ClassificationGraphic } from '../graphics/ClassificationGraphic';
import { WinnerPackageGraphic } from '../graphics/WinnerPackageGraphic';
import { LeaderChangeGraphic } from '../graphics/LeaderChangeGraphic';
import { LiveBugGraphic } from '../graphics/LiveBugGraphic';
import { VoteRevealGraphic } from '../graphics/VoteRevealGraphic';
import { FullscreenInfoGraphic } from '../graphics/FullscreenInfoGraphic';
import { VenueInfoGraphic } from '../graphics/VenueInfoGraphic';
import { CurrentScoreGraphic } from '../graphics/CurrentScoreGraphic';
import { Top3PodiumGraphic } from '../graphics/Top3PodiumGraphic';
import { QualificationResultGraphic } from '../graphics/QualificationResultGraphic';
import { BreakComingUpGraphic } from '../graphics/BreakComingUpGraphic';
import { BroadcastLiveGraphics } from '../graphics/BroadcastLiveGraphics';
import { isBenidormFest2025, isBenidormFest2024 } from '../../utils/visualProfiles';

// Benidorm Fest 2024 Dedicated Broadcast Package Graphics
import {
  LiveBug2024,
  PerformanceId2024,
  LowerThird2024,
  Scoreboard2024,
  Classification2024,
  VotingBanner2024,
  StageReady2024,
  VoteReveal2024,
  Top5Provisional2024,
} from '../graphics/benidorm2024';

// Benidorm Fest 2025 Isolated Square Broadcast Package Graphics
import { LiveBug2025 } from '../graphics/benidorm2025/LiveBug2025';
import { PerformanceId2025 } from '../graphics/benidorm2025/PerformanceId2025';
import { LowerThird2025 } from '../graphics/benidorm2025/LowerThird2025';
import { Scoreboard2025 } from '../graphics/benidorm2025/Scoreboard2025';
import { Classification2025 } from '../graphics/benidorm2025/Classification2025';
import { VotingBanner2025 } from '../graphics/benidorm2025/VotingBanner2025';
import { PerformanceIntro2025 } from '../graphics/benidorm2025/PerformanceIntro2025';
import { StageReady2025 } from '../graphics/benidorm2025/StageReady2025';
import { LeaderChange2025 } from '../graphics/benidorm2025/LeaderChange2025';
import { VoteReveal2025 } from '../graphics/benidorm2025/VoteReveal2025';
import { WinnerPackage2025 } from '../graphics/benidorm2025/WinnerPackage2025';
import { Top3Podium2025 } from '../graphics/benidorm2025/Top3Podium2025';
import { VotingCountdown2025 } from '../graphics/benidorm2025/VotingCountdown2025';
import { CurrentScore2025 } from '../graphics/benidorm2025/CurrentScore2025';
import { VenueInfo2025 } from '../graphics/benidorm2025/VenueInfo2025';
import { BreakComingUp2025 } from '../graphics/benidorm2025/BreakComingUp2025';
import { FullscreenInfo2025 } from '../graphics/benidorm2025/FullscreenInfo2025';
import { QualificationResult2025 } from '../graphics/benidorm2025/QualificationResult2025';
import { Top5Provisional2025 } from '../graphics/benidorm2025/Top5Provisional2025';

// Broadcast rendering priority hierarchy:
// BACKGROUND (0) -> FULLSCREEN (10) -> MAIN (20) -> LOWER (30) -> INFO (40) -> LIVE BUG / PERFORMANCE ID (50)
const LAYER_PRIORITY: Record<string, number> = {
  fullscreen_info: 10,
  qualification_result: 10,
  winner: 10,
  winner_reveal: 10,
  winner_celebration: 10,
  top_3_podium: 10,
  stage_ready: 10,

  scoreboard: 20,
  classification: 20,
  classification_fullscreen: 20,
  full_classification: 20,
  final_classification: 20,
  vote_award: 20,
  vote_reveal: 20,
  score_update: 20,
  new_leader: 20,
  current_leader: 20,
  leader_change: 20,
  rank_change: 20,
  top_ranking: 20,
  top_5: 20,
  top_10: 20,

  lower_third: 30,
  current_score: 30,
  voting_banner: 30,
  performance_intro: 30,

  venue_info: 40,
  break_coming_up: 40,
  voting_countdown: 40,

  live_bug: 50,
  performance_id: 50,
};

interface BroadcastCanvasProps {
  show: Show;
  layers: GraphicLayer[];
  previewSettings?: PreviewSettings;
  isOBSOutput?: boolean; // When true: strictly transparent background, no guides
  scale?: number; // visual scale factor if provided
}

export const BroadcastCanvas: React.FC<BroadcastCanvasProps> = ({
  show,
  layers,
  previewSettings,
  isOBSOutput = false,
}) => {
  const showGuides = !isOBSOutput && previewSettings;

  // Authoritative rendering order: guarantees Live Bug and Performance Identifier are NEVER covered by other graphics
  const sortedLayers = React.useMemo(() => {
    return [...layers].sort((a, b) => {
      const prioA = LAYER_PRIORITY[a.type] ?? 25;
      const prioB = LAYER_PRIORITY[b.type] ?? 25;
      return prioA - prioB;
    });
  }, [layers]);
  const showBackground =
    !isOBSOutput &&
    (previewSettings ? previewSettings.showStageBackground : true);

  // Check if Performance Identifier is active on air, transforming Live Bug to minimal white
  const isPerformanceIdActive = layers.some(
    (l) => l.type === 'performance_id' || l.type === 'performance_identifier'
  );
  const isLiveBugActive = layers.some((l) => l.type === 'live_bug');

  const is2025 = isBenidormFest2025(show);
  const is2024 = isBenidormFest2024(show);

  // Render a specific graphic layer based on its type
  const renderLayer = (layer: GraphicLayer) => {
    const props = layer.props || {};
    const participant =
      props.participantId
        ? show.participants.find((p) => p.id === props.participantId)
        : show.participants[0];

    // ISOLATED SHOW PACKAGE: BENIDORM FEST 2024
    if (is2024) {
      switch (layer.type) {
        case 'scoreboard':
        case 'scoreboard_split':
          return (
            <Scoreboard2024
              key={layer.id}
              show={show}
              isSplitScreen={true}
              maxDisplayCount={props.maxDisplayCount}
              stageLabel={props.stageLabel}
            />
          );

        case 'scoreboard_fullscreen':
          return (
            <Scoreboard2024
              key={layer.id}
              show={show}
              isSplitScreen={false}
              maxDisplayCount={props.maxDisplayCount}
              stageLabel={props.stageLabel}
            />
          );

        case 'lower_third':
        case 'lower_third_one_person':
        case 'lower_third_two_people':
        case 'lower_third_artist_song':
        case 'lower_third_info':
        case 'announcement':
          return (
            <LowerThird2024
              key={layer.id}
              mode={
                layer.type === 'lower_third_two_people'
                  ? 'two_people'
                  : layer.type === 'lower_third_artist_song'
                  ? 'artist_song'
                  : layer.type === 'lower_third_info'
                  ? 'info'
                  : props.mode || 'one_person'
              }
              participant={participant}
              person1Name={props.person1Name}
              person1Role={props.person1Role}
              person2Name={props.person2Name}
              person2Role={props.person2Role}
              artist={props.artist}
              song={props.song}
              name={props.name || props.title}
              role={props.role || props.subtitle}
              title={props.title}
              subtitle={props.subtitle}
              showBug={isLiveBugActive}
            />
          );

        case 'stage_ready':
        case 'performance_intro':
        case 'artist_intro':
        case 'song_intro':
        case 'next_performance':
        case 'performance_number':
          return (
            <StageReady2024
              key={layer.id}
              participant={participant}
              customNumber={props.customNumber ?? props.badgeNumber}
              customArtist={props.customArtist}
              customSong={props.customSong}
              customComposers={props.customComposers}
              customArrangers={props.customArrangers}
            />
          );

        case 'performance_id':
        case 'performance_identifier':
          return (
            <PerformanceId2024
              key={layer.id}
              participant={participant}
              customNumber={props.customNumber ?? props.badgeNumber}
              customArtist={props.customArtist}
              hasLiveBugLayer={isLiveBugActive}
            />
          );

        case 'voting_banner':
          return (
            <VotingBanner2024
              key={layer.id}
              participant={participant}
              customKeyword={props.customKeyword}
              customPhone={props.customPhone}
              customArtist={props.customArtist}
              customSong={props.customSong}
            />
          );

        case 'top_5':
          return (
            <Top5Provisional2024
              key={layer.id}
              show={show}
              title={props.title}
            />
          );

        case 'classification_fullscreen':
        case 'full_classification':
        case 'final_classification':
          return (
            <Classification2024
              key={layer.id}
              show={show}
              title={props.title}
              subtitle={props.subtitle}
            />
          );

        case 'live_bug':
          return (
            <LiveBug2024
              key={layer.id}
              size={props.size}
            />
          );

        case 'vote_award':
        case 'vote_reveal':
        case 'score_update': {
          const revealData = layer.props?.participantId
            ? {
                participantId: layer.props.participantId,
                pointsAwarded: layer.props.pointsAwarded ?? 0,
                phase: layer.props.phase || 'public',
                isRevealed: true,
                recipientName: layer.props.recipientName,
              }
            : show.activeReveal;
          return (
            <VoteReveal2024
              key={layer.id}
              show={show}
              activeReveal={revealData}
            />
          );
        }

        default:
          break;
      }
    }

    // ISOLATED SHOW PACKAGE: BENIDORM FEST 2025
    if (is2025) {
      switch (layer.type) {
        case 'scoreboard':
        case 'scoreboard_split':
          return (
            <Scoreboard2025
              key={layer.id}
              show={show}
              isSplitScreen={true}
              maxDisplayCount={props.maxDisplayCount}
              stageLabel={props.stageLabel}
            />
          );

        case 'scoreboard_fullscreen':
          return (
            <Scoreboard2025
              key={layer.id}
              show={show}
              isSplitScreen={false}
              maxDisplayCount={props.maxDisplayCount}
              stageLabel={props.stageLabel}
            />
          );

        case 'lower_third':
        case 'lower_third_one_person':
        case 'lower_third_two_people':
        case 'lower_third_artist_song':
        case 'lower_third_info':
        case 'announcement':
          return (
            <LowerThird2025
              key={layer.id}
              mode={
                layer.type === 'lower_third_two_people'
                  ? 'two_people'
                  : layer.type === 'lower_third_artist_song'
                  ? 'artist_song'
                  : layer.type === 'lower_third_info'
                  ? 'info'
                  : props.mode || 'one_person'
              }
              participant={participant}
              person1Name={props.person1Name}
              person1Role={props.person1Role}
              person2Name={props.person2Name}
              person2Role={props.person2Role}
              artist={props.artist}
              song={props.song}
              name={props.name || props.title}
              role={props.role || props.subtitle}
              title={props.title}
              subtitle={props.subtitle}
              showPerformanceNumber={props.showPerformanceNumber}
              badgeNumber={props.badgeNumber}
              descriptor={props.descriptor}
              customOptions={props.customOptions}
            />
          );

        case 'stage_ready':
          return (
            <StageReady2025
              key={layer.id}
              participant={participant}
              showPerformanceNumber={props.showPerformanceNumber}
              customNumber={props.customNumber ?? props.badgeNumber}
              customArtist={props.customArtist}
              customSong={props.customSong}
              customComposers={props.customComposers}
              customArrangers={props.customArrangers}
            />
          );

        case 'performance_intro':
        case 'artist_intro':
        case 'song_intro':
        case 'next_performance':
        case 'performance_number':
          return (
            <PerformanceIntro2025
              key={layer.id}
              participant={participant}
              showPerformanceNumber={props.showPerformanceNumber}
              customNumber={props.customNumber ?? props.badgeNumber}
              customArtist={props.customArtist}
              customSong={props.customSong}
              customComposers={props.customComposers}
              customArrangers={props.customArrangers}
            />
          );

        case 'performance_id':
        case 'performance_identifier':
          return (
            <PerformanceId2025
              key={layer.id}
              participant={participant}
              showPerformanceNumber={props.showPerformanceNumber}
              customNumber={props.customNumber ?? props.badgeNumber}
              position={props.position}
              hasLiveBugLayer={isLiveBugActive}
            />
          );

        case 'voting_banner':
          return (
            <VotingBanner2025
              key={layer.id}
              participant={participant}
              showPerformanceNumber={props.showPerformanceNumber}
              customNumber={props.customNumber ?? props.badgeNumber}
              customSmsKeyword={props.customSmsKeyword}
              customPhone={props.customPhone}
              smsShortcode={props.smsShortcode}
            />
          );

        case 'voting_countdown':
          return (
            <VotingCountdown2025
              key={layer.id}
              initialSeconds={props.initialSeconds || 10}
            />
          );

        case 'top_5':
          return (
            <Top5Provisional2025
              key={layer.id}
              show={show}
              title={props.title}
            />
          );

        case 'top_ranking':
        case 'top_10':
          return (
            <Classification2025
              key={layer.id}
              show={show}
              count={layer.type === 'top_10' ? 10 : (props.count || 5)}
              title={props.title}
            />
          );

        case 'classification_fullscreen':
        case 'full_classification':
        case 'final_classification':
          return (
            <Classification2025
              key={layer.id}
              show={show}
              count={props.count}
              title={props.title}
            />
          );

        case 'winner':
        case 'winner_reveal':
        case 'winner_celebration':
          return (
            <WinnerPackage2025
              key={layer.id}
              show={show}
              winnerParticipant={participant}
            />
          );

        case 'new_leader':
        case 'current_leader':
        case 'leader_change':
        case 'rank_change':
          return (
            <LeaderChange2025
              key={layer.id}
              show={show}
              leaderId={props.leaderId}
              isNewLeader={layer.type === 'new_leader' || layer.type === 'leader_change'}
            />
          );

        case 'live_bug':
          return (
            <LiveBug2025
              key={layer.id}
              festivalName={props.festivalName}
              isHold={props.isHold}
              isTransformedIntoIdentifier={isPerformanceIdActive}
            />
          );

        case 'vote_award':
        case 'vote_reveal':
        case 'score_update': {
          const revealData = layer.props?.participantId
            ? {
                participantId: layer.props.participantId,
                pointsAwarded: layer.props.pointsAwarded ?? 0,
                phase: layer.props.phase || 'public',
                isRevealed: true,
                totalScoreAfter: layer.props.totalScoreAfter ?? (show.scores[layer.props.participantId]?.totalScore || 0),
                positionAfter: layer.props.positionAfter ?? (show.scores[layer.props.participantId]?.position || 1),
              }
            : show.activeReveal;
          return (
            <VoteReveal2025
              key={layer.id}
              show={show}
              activeReveal={revealData}
            />
          );
        }

        case 'fullscreen_info':
          return (
            <FullscreenInfo2025
              key={layer.id}
              show={show}
              title={props.title}
              subtitle={props.subtitle}
              items={props.items}
            />
          );

        case 'venue_info':
          return (
            <VenueInfo2025
              key={layer.id}
              venueName={props.venueName}
              city={props.city}
              capacity={props.capacity}
              note={props.note}
            />
          );

        case 'current_score':
          return (
            <CurrentScore2025
              key={layer.id}
              show={show}
              participant={participant}
              participantId={props.participantId}
            />
          );

        case 'top_3_podium':
          return (
            <Top3Podium2025
              key={layer.id}
              show={show}
            />
          );

        case 'qualified':
        case 'not_qualified':
        case 'qualification_result':
          return (
            <QualificationResult2025
              key={layer.id}
              participant={participant}
              isQualified={layer.type === 'qualified' || props.isQualified !== false}
            />
          );

        case 'break':
        case 'back_in':
        case 'coming_up':
        case 'next':
        case 'break_coming_up':
          return (
            <BreakComingUp2025
              key={layer.id}
              title={props.title || props.message}
              subtitle={props.subtitle || props.subMessage}
              nextSegment={props.nextSegment || props.tag}
            />
          );

        default:
          break;
      }
    }

    switch (layer.type) {
      case 'scoreboard_split':
        return (
          <ScoreboardGraphic
            key={layer.id}
            show={show}
            isSplitScreen={true}
            maxDisplayCount={props.maxDisplayCount}
            stageLabel={props.stageLabel}
          />
        );

      case 'scoreboard_fullscreen':
        return (
          <ScoreboardGraphic
            key={layer.id}
            show={show}
            isSplitScreen={false}
            maxDisplayCount={props.maxDisplayCount}
            stageLabel={props.stageLabel}
          />
        );

      case 'lower_third':
      case 'lower_third_one_person':
      case 'lower_third_two_people':
      case 'lower_third_artist_song':
      case 'lower_third_info':
      case 'announcement':
        return (
          <LowerThirdGraphic
            key={layer.id}
            mode={
              layer.type === 'lower_third_two_people'
                ? 'two_people'
                : layer.type === 'lower_third_artist_song'
                ? 'artist_song'
                : layer.type === 'lower_third_info'
                ? 'info'
                : props.mode || 'one_person'
            }
            participant={participant}
            person1Name={props.person1Name}
            person1Role={props.person1Role}
            person2Name={props.person2Name}
            person2Role={props.person2Role}
            artist={props.artist}
            song={props.song}
            name={props.name || props.title}
            role={props.role || props.subtitle}
            title={props.title}
            subtitle={props.subtitle}
            showPerformanceNumber={props.showPerformanceNumber}
            badgeNumber={props.badgeNumber}
            descriptor={props.descriptor}
            customOptions={props.customOptions}
          />
        );

      case 'stage_ready':
        return (
          <StageReadyGraphic
            key={layer.id}
            participant={participant}
            showPerformanceNumber={props.showPerformanceNumber}
            customNumber={props.customNumber ?? props.badgeNumber}
            customArtist={props.customArtist}
            customSong={props.customSong}
            customComposers={props.customComposers}
            customArrangers={props.customArrangers}
          />
        );

      case 'performance_intro':
      case 'artist_intro':
      case 'song_intro':
      case 'next_performance':
      case 'performance_number':
        return (
          <PerformanceIntroGraphic
            key={layer.id}
            participant={participant}
            showPerformanceNumber={props.showPerformanceNumber}
            customNumber={props.customNumber ?? props.badgeNumber}
            customArtist={props.customArtist}
            customSong={props.customSong}
            customComposers={props.customComposers}
            customArrangers={props.customArrangers}
          />
        );

      case 'performance_id':
      case 'performance_identifier':
        return (
          <PerformanceIdGraphic
            key={layer.id}
            participant={participant}
            showPerformanceNumber={props.showPerformanceNumber}
            customNumber={props.customNumber ?? props.badgeNumber}
            position={props.position}
          />
        );

      case 'voting_banner':
        return (
          <VotingBannerGraphic
            key={layer.id}
            participant={participant}
            showPerformanceNumber={props.showPerformanceNumber}
            customNumber={props.customNumber ?? props.badgeNumber}
            customSmsKeyword={props.customSmsKeyword}
            customPhone={props.customPhone}
            smsShortcode={props.smsShortcode}
          />
        );

      case 'voting_countdown':
        return (
          <VotingCountdownGraphic
            key={layer.id}
            initialSeconds={props.initialSeconds || 10}
          />
        );

      case 'top_ranking':
      case 'top_5':
      case 'top_10':
        return (
          <TopRankingGraphic
            key={layer.id}
            show={show}
            count={layer.type === 'top_10' ? 10 : (props.count || 5)}
            title={props.title}
          />
        );

      case 'classification_fullscreen':
      case 'full_classification':
      case 'final_classification':
        return (
          <ClassificationGraphic
            key={layer.id}
            show={show}
            count={props.count}
            title={props.title}
          />
        );

      case 'winner':
      case 'winner_reveal':
      case 'winner_celebration':
        return (
          <WinnerPackageGraphic
            key={layer.id}
            show={show}
            winnerParticipant={participant}
          />
        );

      case 'new_leader':
      case 'current_leader':
      case 'leader_change':
      case 'rank_change':
        return (
          <LeaderChangeGraphic
            key={layer.id}
            show={show}
            leaderId={props.leaderId}
            isNewLeader={layer.type === 'new_leader' || layer.type === 'leader_change'}
          />
        );

      case 'live_bug':
        return (
          <LiveBugGraphic
            key={layer.id}
            festivalName={props.festivalName || 'BENIDORM FEST'}
            showLiveTag={props.showLiveTag !== false}
            liveTagText={props.liveTagText || 'DIRECTO'}
            isHold={props.isHold}
            isMinimalWhite={isPerformanceIdActive}
          />
        );

      case 'vote_award':
      case 'vote_reveal':
      case 'score_update': {
        const revealData = layer.props?.participantId
          ? {
              participantId: layer.props.participantId,
              pointsAwarded: layer.props.pointsAwarded ?? 0,
              phase: layer.props.phase || 'demoscopic',
              isRevealed: true,
              totalScoreAfter: layer.props.totalScoreAfter ?? (show.scores[layer.props.participantId]?.totalScore || 0),
              positionAfter: layer.props.positionAfter ?? (show.scores[layer.props.participantId]?.position || 1),
            }
          : show.activeReveal;
        return (
          <VoteRevealGraphic
            key={layer.id}
            show={show}
            activeReveal={revealData}
          />
        );
      }

      case 'fullscreen_info':
        return (
          <FullscreenInfoGraphic
            key={layer.id}
            show={show}
            title={props.title}
            subtitle={props.subtitle}
            items={props.items}
          />
        );

      case 'venue_info':
        return (
          <VenueInfoGraphic
            key={layer.id}
            show={show}
            venueName={props.venueName}
            city={props.city}
            capacity={props.capacity}
            note={props.note}
          />
        );

      case 'current_score':
        return (
          <CurrentScoreGraphic
            key={layer.id}
            show={show}
            participant={participant}
            participantId={props.participantId}
          />
        );

      case 'top_3_podium':
        return (
          <Top3PodiumGraphic
            key={layer.id}
            show={show}
            title={props.title}
          />
        );

      case 'qualified':
      case 'not_qualified':
      case 'qualification_result':
        return (
          <QualificationResultGraphic
            key={layer.id}
            show={show}
            mode={layer.type === 'not_qualified' ? 'not_qualified' : props.mode || 'qualified'}
            title={props.title}
            subtitle={props.subtitle}
          />
        );

      case 'break':
      case 'back_in':
      case 'coming_up':
      case 'next':
      case 'break_coming_up':
        return (
          <BreakComingUpGraphic
            key={layer.id}
            show={show}
            mode={layer.type === 'break_coming_up' ? props.mode || 'break' : (layer.type as any)}
            message={props.message}
            subMessage={props.subMessage}
            tag={props.tag}
          />
        );

      // LIVE BROADCAST GRAPHICS (Replay, Cameras, Rooms, Clocks, Status, Transitions, etc.)
      case 'replay':
      case 'slow_motion':
      case 'live_replay':
      case 'split_screen':
      case 'picture_in_picture':
      case 'camera_identifier':
      case 'shot_identifier':
      case 'live_location':
      case 'backstage':
      case 'green_room':
      case 'jury_room':
      case 'voting_room':
      case 'programme_clock':
      case 'segment_clock':
      case 'show_countdown':
      case 'performance_countdown':
      case 'act_identifier':
      case 'round_identifier':
      case 'semifinal_identifier':
      case 'final_identifier':
      case 'break_in':
      case 'break_out':
      case 'coming_back':
      case 'next_segment':
      case 'tease':
      case 'highlight':
      case 'special_moment':
      case 'audience_vote':
      case 'live_poll':
      case 'social_moment':
      case 'hashtag_moment':
      case 'official_result':
      case 'results_pending':
      case 'verified_result':
      case 'record':
      case 'new_record':
      case 'host_identifier':
      case 'presenter_identifier':
      case 'location_identifier':
      case 'show_open':
      case 'show_close':
      case 'section_open':
      case 'section_close':
      case 'bumper_in':
      case 'bumper_out':
      case 'sting':
      case 'transition':
        return (
          <BroadcastLiveGraphics
            key={layer.id}
            type={layer.type}
            props={props}
            show={show}
            participant={participant}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      id="broadcast-canvas-root"
      className="relative w-[1920px] h-[1080px] overflow-hidden select-none"
      style={{
        backgroundColor: isOBSOutput
          ? 'transparent'
          : showBackground
          ? is2024
            ? '#101044'
            : is2025
            ? '#070B1F'
            : '#100524'
          : 'transparent',
      }}
    >
      {/* 1. Stage Backdrop (Only for non-OBS if enabled) */}
      {showBackground && (
        <BackgroundStage
          is2025={is2025}
          is2024={is2024}
          stageTitle={show.stageTitle}
          intensity={previewSettings?.backgroundIntensity}
        />
      )}

      {/* 2. Transparent Checkerboard Guide if stage background is turned off in Preview */}
      {!isOBSOutput && !showBackground && (
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(45deg, #222 25%, transparent 25%),
                              linear-gradient(-45deg, #222 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, #222 75%),
                              linear-gradient(-45deg, transparent 75%, #222 75%)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
          }}
        />
      )}

      {/* 3. Render Stacked Graphics Layers (ONLY explicit operator layers, sorted by broadcast priority) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <AnimatePresence>
          {sortedLayers.map((layer) => (
            <React.Fragment key={layer.id}>{renderLayer(layer)}</React.Fragment>
          ))}
        </AnimatePresence>
      </div>

      {/* 4. Preview-Only Broadcast Safe Guides (Action Safe 90%, Title Safe 80%) */}
      {showGuides && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {/* Action Safe (90% boundary: 192px margins, 108px vertical) */}
          {previewSettings?.showActionSafe && (
            <div className="absolute inset-[5%] border border-cyan-400/40 pointer-events-none">
              <span className="absolute top-1 left-2 font-mono text-[11px] text-cyan-400/70 font-semibold tracking-wider">
                ACTION SAFE 90% (1728×972)
              </span>
            </div>
          )}

          {/* Title Safe (80% boundary: 10% margins) */}
          {previewSettings?.showTitleSafe && (
            <div className="absolute inset-[10%] border border-amber-400/40 pointer-events-none">
              <span className="absolute top-1 left-2 font-mono text-[11px] text-amber-400/70 font-semibold tracking-wider">
                TITLE SAFE 80% (1536×864)
              </span>
            </div>
          )}

          {/* Center Crosshair Grid */}
          {previewSettings?.showCenterGrid && (
            <>
              <div className="absolute top-1/2 inset-x-0 h-px bg-white/20" />
              <div className="absolute left-1/2 inset-y-0 w-px bg-white/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/30" />
            </>
          )}
        </div>
      )}
    </div>
  );
};
