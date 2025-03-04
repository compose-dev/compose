interface SessionDB {
  id: string;
  userId: string | null;
  companyId: string | null;
  email: string;
  isExternal: boolean;
  expiresAt: Date;
}

export { SessionDB as DB };
