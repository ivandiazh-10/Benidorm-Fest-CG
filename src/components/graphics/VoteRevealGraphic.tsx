import React from 'react';
import { ActiveRevealState, Show } from '../../types/broadcast';
import { VoteAwardGraphic } from './VoteAwardGraphic';

interface VoteRevealGraphicProps {
  show: Show;
  activeReveal?: ActiveRevealState;
  onSequenceComplete?: () => void;
}

/**
 * VoteRevealGraphic:
 * Supports presenter live reveal with clean television graphic (no theatrical sequence)
 */
export const VoteRevealGraphic: React.FC<VoteRevealGraphicProps> = ({
  show,
  activeReveal,
}) => {
  return <VoteAwardGraphic show={show} activeReveal={activeReveal} />;
};
