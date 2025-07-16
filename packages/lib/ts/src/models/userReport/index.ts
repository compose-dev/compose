interface UserReportPermission {
  canView: boolean;
}

interface UserReportDB {
  id: number;
  createdAt: Date;
  userId: string;
  reportId: number;
  companyId: string;
  permission: UserReportPermission;
}

export { UserReportDB as DB };
