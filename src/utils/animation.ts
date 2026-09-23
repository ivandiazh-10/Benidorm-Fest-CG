/**
 * BENIDORM FEST 2025 — BROADCAST ANIMATION CONTROLLER
 * 
 * Unified 60fps centralized animation controller, timing manager,
 * easing functions, and event bus for broadcast graphics synchronization.
 */

export type EasingFunction = (t: number) => number;

export interface AnimationTask {
  id: string;
  durationMs: number;
  delayMs?: number;
  easing?: EasingFunction;
  onUpdate: (progress: number, elapsedMs: number) => void;
  onComplete?: () => void;
  startTime?: number;
  isPaused?: boolean;
}

export interface PointsAwardedPayload {
  eventId: string;
  participantId: string;
  artistName: string;
  pointsAwarded: number;
  previousTotalScore: number;
  newTotalScore: number;
  previousPosition?: number;
  newPosition?: number;
  phase?: string;
  timestamp: number;
}

/* =========================================================================
   BROADCAST EASING FUNCTIONS (Cubic, zero spring, zero bounce, zero overshoot)
   ========================================================================= */

/** Professional broadcast cubic deceleration: [0.22, 1, 0.36, 1] */
export function easeBroadcast(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  // Accurate polynomial approximation of cubic-bezier(0.22, 1, 0.36, 1)
  return 1 - Math.pow(1 - clamped, 3.2);
}

/** Professional broadcast smooth ease-in-out */
export function easeInOutBroadcast(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

/** Linear interpolation */
export function easeLinear(t: number): number {
  return Math.max(0, Math.min(1, t));
}

/** Exit cubic curve: [0.4, 0, 0.7, 0.2] */
export function easeExit(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return Math.pow(clamped, 2.5);
}

/* =========================================================================
   CENTRALIZED BROADCAST ANIMATION CONTROLLER (Singleton)
   ========================================================================= */

class BroadcastAnimationControllerService {
  private tasks: Map<string, AnimationTask> = new Map();
  private rafId: number | null = null;
  private isRunning: boolean = false;
  private pointsListeners: Set<(payload: PointsAwardedPayload) => void> = new Set();
  private processedEvents: Set<string> = new Set();

  constructor() {
    // Lazy RAF loop startup on first task registration
  }

  private startLoopIfNeeded() {
    if (this.isRunning) return;
    this.isRunning = true;
    const loop = (now: number) => {
      if (this.tasks.size === 0) {
        this.isRunning = false;
        this.rafId = null;
        return;
      }

      this.tasks.forEach((task, id) => {
        if (task.isPaused) return;

        if (task.startTime === undefined) {
          task.startTime = now + (task.delayMs || 0);
        }

        if (now < task.startTime) {
          // Still in delay window
          task.onUpdate(0, 0);
          return;
        }

        const elapsed = now - task.startTime;
        const rawProgress = Math.min(1, elapsed / task.durationMs);
        const easing = task.easing || easeBroadcast;
        const easedProgress = easing(rawProgress);

        task.onUpdate(easedProgress, elapsed);

        if (rawProgress >= 1) {
          if (task.onComplete) {
            try {
              task.onComplete();
            } catch (err) {
              console.error(`Error in onComplete for animation task ${id}:`, err);
            }
          }
          this.tasks.delete(id);
        }
      });

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  /** Register an animation task in the unified 60fps loop */
  public register(task: AnimationTask): () => void {
    this.tasks.set(task.id, task);
    this.startLoopIfNeeded();
    return () => this.cancel(task.id);
  }

  /** Cancel a specific task */
  public cancel(id: string): void {
    this.tasks.delete(id);
    if (this.tasks.size === 0 && this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.isRunning = false;
    }
  }

  /** Cancel all running animations immediately (OUT or CLEAR ALL) */
  public cancelAll(): void {
    this.tasks.clear();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.isRunning = false;
    }
  }

  /* =========================================================================
     POINTS AWARDED EVENT BUS (Deduplicated, Reliable)
     ========================================================================= */

  public emitPointsAwarded(payload: PointsAwardedPayload): void {
    if (this.processedEvents.has(payload.eventId)) {
      return; // Deduplicate
    }
    this.processedEvents.add(payload.eventId);

    // Keep memory clean
    if (this.processedEvents.size > 200) {
      const arr = Array.from(this.processedEvents);
      arr.slice(0, 100).forEach((id) => this.processedEvents.delete(id));
    }

    this.pointsListeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (err) {
        console.error('Error in points listener:', err);
      }
    });
  }

  public onPointsAwarded(listener: (payload: PointsAwardedPayload) => void): () => void {
    this.pointsListeners.add(listener);
    return () => {
      this.pointsListeners.delete(listener);
    };
  }
}

export const BroadcastAnimationController = new BroadcastAnimationControllerService();

/* =========================================================================
   REACT HOOK: useBroadcastTimeline
   ========================================================================= */
import { useEffect, useState, useRef } from 'react';

export interface UseBroadcastTimelineOptions {
  durationMs: number;
  delayMs?: number;
  easing?: EasingFunction;
  autoStart?: boolean;
  onComplete?: () => void;
}

export function useBroadcastTimeline({
  durationMs,
  delayMs = 0,
  easing = easeBroadcast,
  autoStart = true,
  onComplete,
}: UseBroadcastTimelineOptions) {
  const [progress, setProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const taskIdRef = useRef<string>(`timeline_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!autoStart) return;

    setIsCompleted(false);
    setProgress(0);
    setElapsedMs(0);

    const unregister = BroadcastAnimationController.register({
      id: taskIdRef.current,
      durationMs,
      delayMs,
      easing,
      onUpdate: (p, el) => {
        setProgress(p);
        setElapsedMs(el);
      },
      onComplete: () => {
        setIsCompleted(true);
        if (onComplete) onComplete();
      },
    });

    return () => {
      unregister();
    };
  }, [durationMs, delayMs, autoStart]);

  return { progress, elapsedMs, isCompleted };
}
