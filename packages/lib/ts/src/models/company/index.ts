const PLANS = {
  HOBBY: "hobby",
  PRO: "pro",
} as const;

type Plan = (typeof PLANS)[keyof typeof PLANS];

const PLAN_TO_LABEL = {
  [PLANS.HOBBY]: "Hobby",
  [PLANS.PRO]: "Pro",
} as const;

const FLAG_KEYS = {
  FRIENDS_AND_FAMILY_FREE: "FRIENDS_AND_FAMILY_FREE",
  AFFILIATE_CODE: "AFFILIATE_CODE",
} as const;

type FlagKey = (typeof FLAG_KEYS)[keyof typeof FLAG_KEYS];

const DEFAULT_FLAGS: Record<FlagKey, string | boolean | number | undefined> = {
  FRIENDS_AND_FAMILY_FREE: false,
  AFFILIATE_CODE: undefined,
};

interface CompanyDB {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  plan: Plan;
  billingId: string;
  flags: Record<FlagKey, string | boolean | number | undefined>;
}

const FAKE_COMPANY_ID = "00000000-0000-0000-0000-000000000000";

export {
  CompanyDB as DB,
  FAKE_COMPANY_ID as FAKE_ID,
  PLANS,
  FLAG_KEYS,
  PLAN_TO_LABEL,
  DEFAULT_FLAGS,
  FlagKey,
};
