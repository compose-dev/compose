import * as User from "../user";
import * as Company from "../company";

const PURPOSE = {
  SIGN_IN: "SIGN_IN",
  SIGN_UP: "SIGN_UP",
  JOIN_COMPANY: "JOIN_COMPANY",
} as const;

type Purpose = (typeof PURPOSE)[keyof typeof PURPOSE];

interface JoinCompanyMetadata {
  purpose: typeof PURPOSE.JOIN_COMPANY;
  accountType: User.AccountType;
  /**
   * The permission level of the user being added to the company.
   * This will be set for all new invite codes, but we have to
   * make it an optional field since the field won't exist on
   * codes that have already been created.
   */
  permission?: User.Permission;
}

interface SignUpMetadata {
  purpose: typeof PURPOSE.SIGN_UP;
}

interface SignInMetadata {
  purpose: typeof PURPOSE.SIGN_IN;
}

type Metadata = JoinCompanyMetadata | SignUpMetadata | SignInMetadata;

interface EmailCodeDB {
  id: string;
  companyId: string | null;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  metadata: Metadata;
}

interface WithCompany extends EmailCodeDB {
  company: Company.DB | null;
}

export { Purpose, PURPOSE, EmailCodeDB as DB, WithCompany };
