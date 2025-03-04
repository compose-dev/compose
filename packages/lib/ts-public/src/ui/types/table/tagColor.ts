const TAG_COLOR = {
  red: "red",
  orange: "orange",
  yellow: "yellow",
  green: "green",
  blue: "blue",
  purple: "purple",
  pink: "pink",
  gray: "gray",
  brown: "brown",
} as const;

type TagColor = (typeof TAG_COLOR)[keyof typeof TAG_COLOR];

type TagValue = string | number | boolean;

// Common sense color mappings for quick O(1) lookup
const SEMANTIC_COLOR: Record<string, TagColor> = {
  // Boolean
  true: TAG_COLOR.green,
  false: TAG_COLOR.red,

  // Error
  error: TAG_COLOR.red,

  // Success / Failure
  fail: TAG_COLOR.red,
  failed: TAG_COLOR.red,
  failure: TAG_COLOR.red,
  success: TAG_COLOR.green,
  successful: TAG_COLOR.green,

  // Pending
  pending: TAG_COLOR.orange,

  // Warning
  warning: TAG_COLOR.orange,
  warn: TAG_COLOR.orange,

  // Active
  active: TAG_COLOR.green,
  inactive: TAG_COLOR.red,

  // Enable / Disable
  disabled: TAG_COLOR.gray,
  enabled: TAG_COLOR.green,

  // Churn
  churn: TAG_COLOR.red,
  churned: TAG_COLOR.red,

  // Risk
  risk: TAG_COLOR.red,

  // Null / Undefined
  null: TAG_COLOR.gray,
  undefined: TAG_COLOR.gray,

  // Archived
  archived: TAG_COLOR.gray,

  // Roles
  owner: TAG_COLOR.purple,
  superadmin: TAG_COLOR.yellow,
  admin: TAG_COLOR.blue,
  manager: TAG_COLOR.red,
  user: TAG_COLOR.green,
  member: TAG_COLOR.green,
  guest: TAG_COLOR.orange,

  // Editing
  editor: TAG_COLOR.green,
  viewer: TAG_COLOR.pink,

  // Tier
  basic: TAG_COLOR.red,
  premium: TAG_COLOR.purple,
  standard: TAG_COLOR.yellow,
  deluxe: TAG_COLOR.green,
  ultra: TAG_COLOR.brown,
  plus: TAG_COLOR.pink,
  pro: TAG_COLOR.orange,
  free: TAG_COLOR.gray,
  enterprise: TAG_COLOR.blue,

  // Task Status
  todo: TAG_COLOR.orange,
  to_do: TAG_COLOR.orange,
  in_progress: TAG_COLOR.yellow,
  inprogress: TAG_COLOR.yellow,
  done: TAG_COLOR.green,
  completed: TAG_COLOR.green,
  cancelled: TAG_COLOR.red,
  canceled: TAG_COLOR.red,
  wontdo: TAG_COLOR.red,
  "won't do": TAG_COLOR.red,
  wont_do: TAG_COLOR.red,
} as const;

export { TAG_COLOR, TagColor, TagValue, SEMANTIC_COLOR };
