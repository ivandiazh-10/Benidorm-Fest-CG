/**
 * BENIDORM FEST 2025 CENTRALIZED BROADCAST ANIMATION SCHEDULER
 * 
 * Manages frame-based sequences, registered animation stages, easing curves,
 * and staged transitions across all 2025 broadcast graphics.
 * 
 * Eliminates layout thrashing by leveraging GPU-accelerated transforms,
 * clip-paths, and coordinated timer/requestAnimationFrame batching.
 */

export type GraphicAnimationState =
  | 'IDLE'
  | 'PREPARING'
  | 'BUILDING_BLUE'
  | 'BUILDING_LILAC'
  | 'BUILDING_DARK_LAYER'
  | 'BUILDING_PINK'
  | 'REVEALING_INFORMATION'
  | 'SETTLING'
  | 'ON_AIR'
  | 'UPDATING'
  | 'EXITING';

export type LayerAnimationType =
  | 'directionalWipe'
  | 'maskedReveal'
  | 'geometricSlide'
  | 'panelBuild'
  | 'textReveal'
  | 'scoreBlockBuild'
  | 'accentTravel'
  | 'opticalSweep';

export interface AnimationStageDefinition {
  id: string;
  delay: number;
  duration: number;
  type: LayerAnimationType;
  easing?: readonly [number, number, number, number] | string;
  dependencies?: string[];
  onStart?: () => void;
  onComplete?: () => void;
}

/**
 * Standardized Broadcast Easing Curves
 * Strict television rule: NO bounce, NO spring physics, NO elastic overshoot, NO random jumps.
 */
export const BROADCAST_EASINGS = {
  // Primary broadcast cubic bezier (smooth acceleration & long broadcast settle)
  primary: [0.16, 1, 0.3, 1] as const,
  // Smooth deceleration curve for physical ranking and row displacement
  deceleration: [0.22, 1, 0.36, 1] as const,
  // Structured geometric deconstruction exit
  exit: [0.4, 0, 1, 1] as const,
  // Snappy accent movement
  accent: [0.25, 1, 0.5, 1] as const,
  // Linear sweep for television optical flares
  sweep: [0.4, 0, 0.2, 1] as const,
} as const;

/**
 * Broadcast Sequential Construction Timing (in milliseconds)
 */
export const CONSTRUCTION_TIMINGS = {
  PREPARATION: 60,
  BLUE_START: 80,
  BLUE_DURATION: 320,
  LILAC_START: 280,
  LILAC_DURATION: 300,
  DARK_START: 500,
  DARK_DURATION: 320,
  PINK_START: 720,
  PINK_DURATION: 360,
  INFO_START: 1020,
  INFO_DURATION: 400,
  SETTLE_START: 1380,
  SETTLE_DURATION: 420,
  TOTAL_ENTRANCE: 1800,
  TOTAL_EXIT: 900,
  CONTAINER_STAGGER: 110, // 110ms delay between consecutive ranking containers
  RANKING_REORGANIZATION_DURATION: 2200,
  COMPLEX_REORGANIZATION_DURATION: 3000,
} as const;

/**
 * Centralized AnimationScheduler Engine
 */
export class AnimationScheduler {
  private stages: Map<string, AnimationStageDefinition> = new Map();
  private activeTimers: number[] = [];
  private activeFrameRequests: number[] = [];
  private isDestroyed = false;

  constructor(initialStages?: AnimationStageDefinition[]) {
    if (initialStages) {
      this.registerStages(initialStages);
    }
  }

  /**
   * Register an individual animation stage
   */
  public registerStage(stage: AnimationStageDefinition): this {
    this.stages.set(stage.id, stage);
    return this;
  }

  /**
   * Register multiple animation stages
   */
  public registerStages(stages: AnimationStageDefinition[]): this {
    stages.forEach((stage) => this.stages.set(stage.id, stage));
    return this;
  }

  /**
   * Get registered stage by ID
   */
  public getStage(id: string): AnimationStageDefinition | undefined {
    return this.stages.get(id);
  }

  /**
   * Manage and resolve standardized broadcast easing curves
   */
  public getEasing(name: keyof typeof BROADCAST_EASINGS = 'primary'): readonly [number, number, number, number] {
    return BROADCAST_EASINGS[name] || BROADCAST_EASINGS.primary;
  }

  /**
   * Calculate cumulative completion time for registered stages
   */
  public getTotalSequenceDuration(): number {
    let maxEndTime = 0;
    this.stages.forEach((stage) => {
      const endTime = stage.delay + stage.duration;
      if (endTime > maxEndTime) {
        maxEndTime = endTime;
      }
    });
    return maxEndTime;
  }

  /**
   * Execute staged transition sequence with dependency and callback resolution
   */
  public executeSequence(options?: {
    onStageStart?: (stageId: string) => void;
    onStageComplete?: (stageId: string) => void;
    onAllComplete?: () => void;
  }): { cancel: () => void } {
    this.clearAll();
    const completedStages = new Set<string>();

    this.stages.forEach((stage) => {
      const startTimer = window.setTimeout(() => {
        if (this.isDestroyed) return;
        stage.onStart?.();
        options?.onStageStart?.(stage.id);

        const endTimer = window.setTimeout(() => {
          if (this.isDestroyed) return;
          stage.onComplete?.();
          completedStages.add(stage.id);
          options?.onStageComplete?.(stage.id);

          if (completedStages.size === this.stages.size) {
            options?.onAllComplete?.();
          }
        }, stage.duration);

        this.activeTimers.push(endTimer);
      }, stage.delay);

      this.activeTimers.push(startTimer);
    });

    return { cancel: () => this.clearAll() };
  }

  /**
   * Clean up all active scheduled tasks and timers
   */
  public clearAll(): void {
    this.activeTimers.forEach((id) => window.clearTimeout(id));
    this.activeTimers = [];
    this.activeFrameRequests.forEach((id) => window.cancelAnimationFrame(id));
    this.activeFrameRequests = [];
  }

  /**
   * Destroy the scheduler instance
   */
  public destroy(): void {
    this.isDestroyed = true;
    this.clearAll();
    this.stages.clear();
  }
}

/**
 * React Hook for 40+ Layer Graphic Construction Sequences
 */
import { useEffect, useRef, useState, useCallback } from 'react';

export interface SchedulerHookOptions {
  onAirOnComplete?: boolean;
  totalDurationMs?: number;
  skipEntrance?: boolean;
  onStateChange?: (state: GraphicAnimationState) => void;
  onSettle?: () => void;
}

export function useAnimationScheduler(options: SchedulerHookOptions = {}) {
  const {
    onAirOnComplete = true,
    totalDurationMs = CONSTRUCTION_TIMINGS.TOTAL_ENTRANCE,
    skipEntrance = false,
    onStateChange,
    onSettle,
  } = options;

  const [animState, setAnimState] = useState<GraphicAnimationState>(
    skipEntrance ? 'ON_AIR' : 'PREPARING'
  );
  const [currentStage, setCurrentStage] = useState<number>(skipEntrance ? 48 : 0);

  const timersRef = useRef<number[]>([]);
  const isMountedRef = useRef<boolean>(true);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const updateState = useCallback(
    (newState: GraphicAnimationState, stage: number) => {
      if (!isMountedRef.current) return;
      setAnimState(newState);
      setCurrentStage(stage);
      onStateChange?.(newState);
    },
    [onStateChange]
  );

  useEffect(() => {
    isMountedRef.current = true;
    if (skipEntrance) {
      updateState('ON_AIR', 48);
      return;
    }

    clearAllTimers();

    // Stage 1-8: Preparation (0 - 80ms)
    updateState('PREPARING', 4);

    // Stage 9-14: Blue Structural Slide (80ms - 280ms)
    const tBlue = window.setTimeout(() => {
      updateState('BUILDING_BLUE', 12);
    }, CONSTRUCTION_TIMINGS.BLUE_START);
    timersRef.current.push(tBlue);

    // Stage 15-20: Lilac Secondary Geometry (280ms - 500ms)
    const tLilac = window.setTimeout(() => {
      updateState('BUILDING_LILAC', 18);
    }, CONSTRUCTION_TIMINGS.LILAC_START);
    timersRef.current.push(tLilac);

    // Stage 21-26: Black Contrast Layer & Dividers (500ms - 720ms)
    const tDark = window.setTimeout(() => {
      updateState('BUILDING_DARK_LAYER', 24);
    }, CONSTRUCTION_TIMINGS.DARK_START);
    timersRef.current.push(tDark);

    // Stage 27-32: Pink / Magenta Information Surface (720ms - 1020ms)
    const tPink = window.setTimeout(() => {
      updateState('BUILDING_PINK', 30);
    }, CONSTRUCTION_TIMINGS.PINK_START);
    timersRef.current.push(tPink);

    // Stage 33-40: Information Reveal (Scores, Typography, Numbers) (1020ms - 1380ms)
    const tInfo = window.setTimeout(() => {
      updateState('REVEALING_INFORMATION', 38);
    }, CONSTRUCTION_TIMINGS.INFO_START);
    timersRef.current.push(tInfo);

    // Stage 41-47: Settling & Accent Travel (1380ms - 1800ms)
    const tSettle = window.setTimeout(() => {
      updateState('SETTLING', 45);
    }, CONSTRUCTION_TIMINGS.SETTLE_START);
    timersRef.current.push(tSettle);

    // Stage 48: Stable ON_AIR Lock
    const tOnAir = window.setTimeout(() => {
      if (onAirOnComplete) {
        updateState('ON_AIR', 48);
        onSettle?.();
      }
    }, totalDurationMs);
    timersRef.current.push(tOnAir);

    return () => {
      isMountedRef.current = false;
      clearAllTimers();
    };
  }, [skipEntrance, onAirOnComplete, totalDurationMs, updateState, clearAllTimers, onSettle]);

  const triggerUpdate = useCallback(
    (durationMs = 1200) => {
      if (!isMountedRef.current) return;
      updateState('UPDATING', 40);
      const timer = window.setTimeout(() => {
        updateState('ON_AIR', 48);
      }, durationMs);
      timersRef.current.push(timer);
    },
    [updateState]
  );

  const triggerExit = useCallback(() => {
    if (!isMountedRef.current) return;
    clearAllTimers();
    updateState('EXITING', 0);
  }, [clearAllTimers, updateState]);

  const isStageActive = useCallback(
    (stageNumber: number) => {
      return currentStage >= stageNumber;
    },
    [currentStage]
  );

  return {
    animState,
    currentStage,
    isStageActive,
    triggerUpdate,
    triggerExit,
    isSettled: animState === 'ON_AIR',
  };
}

/**
 * 40-Stage Multi-Layer Variants Factory
 */
export const SCHEDULER_VARIANTS = {
  blueBase: {
    initial: { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 0, x: -30 },
    animate: {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      opacity: 1,
      x: 0,
      transition: { duration: 0.45, delay: 0.08, ease: BROADCAST_EASINGS.primary },
    },
    exit: {
      clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
      opacity: 0,
      transition: { duration: 0.35, ease: BROADCAST_EASINGS.exit },
    },
  },

  lilacGeometry: {
    initial: { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', opacity: 0 },
    animate: {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      opacity: 1,
      transition: { duration: 0.42, delay: 0.28, ease: BROADCAST_EASINGS.primary },
    },
    exit: {
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
      opacity: 0,
      transition: { duration: 0.3, ease: BROADCAST_EASINGS.exit },
    },
  },

  blackContrast: {
    initial: { opacity: 0, scaleY: 0.8 },
    animate: {
      opacity: 1,
      scaleY: 1,
      transition: { duration: 0.4, delay: 0.5, ease: BROADCAST_EASINGS.primary },
    },
    exit: {
      opacity: 0,
      scaleY: 0.85,
      transition: { duration: 0.28, ease: BROADCAST_EASINGS.exit },
    },
  },

  magentaSurface: {
    initial: { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 0, x: -18 },
    animate: {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      opacity: 1,
      x: 0,
      transition: { duration: 0.45, delay: 0.72, ease: BROADCAST_EASINGS.primary },
    },
    exit: {
      clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
      opacity: 0,
      transition: { duration: 0.32, ease: BROADCAST_EASINGS.exit },
    },
  },

  typographyReveal: {
    initial: { y: '115%', opacity: 0 },
    animate: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.48, delay: 1.02, ease: BROADCAST_EASINGS.primary },
    },
    exit: {
      y: '-105%',
      opacity: 0,
      transition: { duration: 0.26, ease: BROADCAST_EASINGS.exit },
    },
  },

  scoreReveal: {
    initial: { scale: 0.85, clipPath: 'inset(0% 50% 0% 50%)', opacity: 0 },
    animate: {
      scale: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      transition: { duration: 0.45, delay: 1.15, ease: BROADCAST_EASINGS.primary },
    },
    exit: {
      scale: 0.9,
      clipPath: 'inset(0% 50% 0% 50%)',
      opacity: 0,
      transition: { duration: 0.25, ease: BROADCAST_EASINGS.exit },
    },
  },

  accentSettle: {
    initial: { scaleX: 0, opacity: 0 },
    animate: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 0.4, delay: 1.38, ease: BROADCAST_EASINGS.accent },
    },
    exit: {
      scaleX: 0,
      opacity: 0,
      transition: { duration: 0.22, ease: BROADCAST_EASINGS.exit },
    },
  },
} as const;
