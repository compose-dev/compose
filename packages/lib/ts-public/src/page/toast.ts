const TOAST_APPEARANCE = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
} as const;

type ToastAppearance = (typeof TOAST_APPEARANCE)[keyof typeof TOAST_APPEARANCE];

const DURATION = {
  shortest: "shortest",
  short: "short",
  medium: "medium",
  long: "long",
  longest: "longest",
  infinite: "infinite",
} as const;

type Duration = (typeof DURATION)[keyof typeof DURATION];

const DURATION_TO_MS: Record<Duration, number> = {
  shortest: 1500,
  short: 3000,
  medium: 5000,
  long: 10000,
  longest: 20000,
  infinite: 1000000,
};

type ToastInput = {
  message: string;
  title?: string;
  appearance?: ToastAppearance;
  duration?: Duration;
};

type Toast = Omit<ToastInput, "duration"> & {
  appearance: ToastAppearance;
  title: string | undefined;
  id: string;
  durationMs: number;
};

const DEFAULTS = {
  appearance: TOAST_APPEARANCE.info,
  title: undefined,
  duration: DURATION.medium,
} as const;

export {
  TOAST_APPEARANCE as APPEARANCE,
  DURATION,
  DURATION_TO_MS,
  DEFAULTS,
  type ToastInput as Base,
  type Toast as Type,
};
