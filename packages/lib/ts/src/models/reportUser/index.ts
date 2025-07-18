interface ReportUserPermission {
  canView: boolean;
}

interface ReportUserDB {
  id: string;
  createdAt: Date;
  createdByUserId: string | null;
  userId: string;
  reportId: string;
  companyId: string;
  permission: ReportUserPermission;
}

export { ReportUserDB as DB };
