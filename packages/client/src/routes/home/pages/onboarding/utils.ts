const STEP = {
  welcome: "welcome",

  // Non-developer path
  "invite-developers": "invite-developers",

  // Developer path
  "installation-method": "installation-method",
  "framework-instructions": "framework-instructions",
} as const;

type Step = (typeof STEP)[keyof typeof STEP];

const STEP_TO_ORDER = {
  [STEP.welcome]: 0,
  [STEP["invite-developers"]]: 1,
  [STEP["installation-method"]]: 1,
  [STEP["framework-instructions"]]: 2,
} as const;

const STEP_TO_PERCENT_COMPLETE: Record<Step, number> = {
  [STEP.welcome]: 0,
  [STEP["invite-developers"]]: 50,
  [STEP["installation-method"]]: 33,
  [STEP["framework-instructions"]]: 67,
} as const;

const STEP_TO_PREVIOUS_STEP: Record<Step, Step> = {
  [STEP.welcome]: STEP.welcome,
  [STEP["invite-developers"]]: STEP.welcome,
  [STEP["installation-method"]]: STEP.welcome,
  [STEP["framework-instructions"]]: STEP["installation-method"],
};

const DEFAULT_STEP = STEP.welcome;

const FRAMEWORK = {
  "nodejs-existing": "nodejs-existing",
  "nodejs-new": "nodejs-new",
  "python-existing": "python-existing",
  "python-new": "python-new",
  express: "express",
  fastify: "fastify",
  koa: "koa",
  django: "django",
  flask: "flask",
  fastapi: "fastapi",
  nextjs: "nextjs",
  hono: "hono",
} as const;

type Framework = (typeof FRAMEWORK)[keyof typeof FRAMEWORK];

const DEFAULT_FRAMEWORK = FRAMEWORK["nodejs-new"];

export {
  STEP,
  STEP_TO_ORDER,
  DEFAULT_STEP,
  STEP_TO_PERCENT_COMPLETE,
  STEP_TO_PREVIOUS_STEP,
  FRAMEWORK,
  DEFAULT_FRAMEWORK,
};
export type { Step, Framework };
