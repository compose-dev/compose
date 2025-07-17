interface ReportUserPermission {
  canView: boolean;
}

interface ReportUserDB {
  id: string;
  createdAt: Date;
  createdByUserId: string;
  userId: string;
  reportId: string;
  companyId: string;
  permission: ReportUserPermission;
}

export { ReportUserDB as DB };
