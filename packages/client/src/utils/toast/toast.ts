import { create } from "zustand";
import { Page } from "@composehq/ts-public";

/**
 * Generates a unique ID for a toast. Uses the current time in milliseconds
 * and a random number between 1 and 100,000. Good enough for our purposes +
 * should be more performant than generating a uuid.
 *
 * @returns A unique ID for a toast.
 */
function generateToastId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}

function generateValidToast(toast: Page.toast.Base): Page.toast.Type {
  const appearance = toast.appearance || Page.toast.DEFAULTS.appearance;
  const title = toast.title || Page.toast.DEFAULTS.title;
  const durationMs =
    Page.toast.DURATION_TO_MS[toast.duration || Page.toast.DEFAULTS.duration];

  return {
    id: generateToastId(),
    message: toast.message,
    appearance,
    title,
    durationMs,
  };
}

type ToastListener = (newToast: Page.toast.Type) => void;

interface ToastStore {
  toasts: Page.toast.Type[];
  listeners: Record<string, ToastListener>;
  addToast: (newToast: Page.toast.Base) => string;
  removeToast: (id: string) => void;
  addListener: (id: string, listener: ToastListener) => void;
  removeListener: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  listeners: {},
  addToast: (newToast: Page.toast.Base) => {
    const toast = generateValidToast(newToast);

    set((state) => {
      const updatedToasts = [...state.toasts, toast];

      Object.values(state.listeners).forEach((listener) => listener(toast));

      return { toasts: updatedToasts };
    });

    return toast.id;
  },
  removeToast: (id: string) => {
    set((state) => {
      const updatedToasts = state.toasts.filter((toast) => toast.id !== id);
      return { toasts: updatedToasts };
    });
  },
  addListener: (id: string, listener: ToastListener) => {
    set((state) => ({
      listeners: { ...state.listeners, [id]: listener },
    }));
  },
  removeListener: (id: string) => {
    set((state) => {
      const updatedListeners = { ...state.listeners };
      delete updatedListeners[id];
      return { listeners: updatedListeners };
    });
  },
}));

const APPEARANCE = Page.toast.APPEARANCE;
const DURATION = Page.toast.DURATION;
type Base = Page.toast.Base;
type Type = Page.toast.Type;

export {
  APPEARANCE,
  DURATION,
  type Base as Base,
  type Type as Type,
  useToastStore as useStore,
  type ToastStore as Store,
};
