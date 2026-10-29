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
const timers: Record<number, ReturnType<typeof setTimeout>> = {};

/** Queue shared by `toast.show` and `<Toaster />`. Client-side only: nothing is queued during SSR. */
export const toasts = $state<{ items: ToastItem[] }>({ items: [] });

function dismiss(id: number) {
  clearTimeout(timers[id]);
  delete timers[id];
  toasts.items = toasts.items.filter((item) => item.id !== id);
}

function show(options: ToastOptions): number {
  const id = next++;
  const tone = options.tone ?? 'neutral';
  toasts.items = [...toasts.items, { ...options, id, tone }];
  const duration = options.duration ?? (tone === 'danger' ? 0 : 5000);
  if (duration > 0) timers[id] = setTimeout(() => dismiss(id), duration);
  return id;
}

export const toast = {
  show,
  dismiss,
  success: (title: string, description?: string) => show({ title, description, tone: 'success' }),
  error: (title: string, description?: string) => show({ title, description, tone: 'danger' }),
};
