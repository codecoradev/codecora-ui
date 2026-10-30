import type { Tone } from './types.js';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: Tone;
  /** Milliseconds before it dismisses itself; 0 keeps it until dismissed. Errors default to 0. */
  duration?: number;
}

export interface ToastItem extends ToastOptions {
  id: number;
  tone: Tone;
}

let next = 1;

export type PauseReason = 'hover' | 'focus';

interface Timer {
  handle?: ReturnType<typeof setTimeout>;
  remaining: number;
  startedAt: number;
  /** Why the countdown is stopped; it restarts only when none is left. */
  holds: Set<PauseReason>;
}
const timers: Record<number, Timer> = {};

/** A toast that was paused still stays up this long after the pointer or focus leaves. */
const MIN_AFTER_RESUME = 1500;

/** Queue shared by `toast.show` and `<Toaster />`. Client-side only: nothing is queued during SSR. */
export const toasts = $state<{ items: ToastItem[] }>({ items: [] });

function arm(id: number) {
  const timer = timers[id];
  if (!timer) return;
  timer.startedAt = Date.now();
  timer.handle = setTimeout(() => dismiss(id), timer.remaining);
}

function dismiss(id: number) {
  clearTimeout(timers[id]?.handle);
  delete timers[id];
  toasts.items = toasts.items.filter((item) => item.id !== id);
}

/**
 * Stop the countdown while a toast is hovered or focused, so it cannot vanish
 * while being read. Hover and focus hold it separately: it resumes only when
 * neither is left.
 */
function pause(id: number, reason: PauseReason = 'hover') {
  const timer = timers[id];
  if (!timer) return;
  timer.holds.add(reason);
  if (timer.handle === undefined) return;
  clearTimeout(timer.handle);
  timer.handle = undefined;
  timer.remaining = Math.max(MIN_AFTER_RESUME, timer.remaining - (Date.now() - timer.startedAt));
}

function resume(id: number, reason: PauseReason = 'hover') {
  const timer = timers[id];
  if (!timer) return;
  timer.holds.delete(reason);
  if (timer.holds.size === 0 && timer.handle === undefined) arm(id);
}

function show(options: ToastOptions): number {
  const id = next++;
  const tone = options.tone ?? 'neutral';
  toasts.items = [...toasts.items, { ...options, id, tone }];
  const duration = options.duration ?? (tone === 'danger' ? 0 : 5000);
  if (duration > 0) {
    timers[id] = { remaining: duration, startedAt: 0, holds: new Set() };
    arm(id);
  }
  return id;
}

export const toast = {
  show,
  dismiss,
  pause,
  resume,
  success: (title: string, description?: string) => show({ title, description, tone: 'success' }),
  error: (title: string, description?: string) => show({ title, description, tone: 'danger' }),
};
