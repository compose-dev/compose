import {
  TRACKED_EVENT_OPERATORS,
  TRACKED_EVENT_LOGIC_OPERATORS,
  TrackedEventOperator,
  TrackedEventLogicOperator,
  TrackedEventRule,
  TrackedEventGroup,
  TrackedEventModel,
} from "./trackedEvents";

const TIMEFRAMES = {
  LAST_24_HOURS: "LAST_24_HOURS",
  LAST_7_DAYS: "LAST_7_DAYS",
  LAST_30_DAYS: "LAST_30_DAYS",
  LAST_WEEK: "LAST_WEEK",
  TWO_WEEKS_AGO: "TWO_WEEKS_AGO",
  LAST_MONTH: "LAST_MONTH",
  TWO_MONTHS_AGO: "TWO_MONTHS_AGO",
  CUSTOM: "CUSTOM",
} as const;

type Timeframe = (typeof TIMEFRAMES)[keyof typeof TIMEFRAMES];

interface SelectedApp {
  route: string;
  environmentId: string;
}

interface ReportData {
  /**
   * The events that will be included in the report.
   *
   * The data structure allows for nested groups of events with AND/OR logic,
   * but for now we only support a list of events with AND logic.
   */
  trackedEventModel: TrackedEventModel;

  /**
   * Whether to include production logs in the report.
   */
  includeProductionLogs: boolean;

  /**
   * Whether including production logs can be toggled while viewing the report.
   */
  includeProductionLogsIsEditable: boolean;

  /**
   * Whether to include development logs in the report.
   */
  includeDevelopmentLogs: boolean;

  /**
   * Whether including development logs can be toggled while viewing the report.
   */
  includeDevelopmentLogsIsEditable: boolean;

  /**
   * The timeframe of the report.
   */
  timeFrame: Timeframe;

  /**
   * Whether the timeframe can be toggled while viewing the report.
   */
  timeFrameIsEditable: boolean;

  /**
   * The date range of the report. Start and End are
   * null if the timeframe is not CUSTOM.
   */
  dateRange: {
    start: Date | null;
    end: Date | null;
  };

  /**
   * The apps that will be included in the report. If
   * empty, all apps will be included.
   */
  selectedApps: SelectedApp[];

  /**
   * Whether the selected apps can be toggled while viewing the report.
   */
  selectedAppsIsEditable: boolean;

  /**
   * The user emails that will be included in the report.
   */
  selectedUserEmails: string[];

  /**
   * Whether to include anonymous users in the report.
   */
  includeAnonymousUsers: boolean;

  /**
   * Whether the selected user emails can be toggled while viewing the report.
   */
  selectedUserEmailsIsEditable: boolean;
}

interface ReportDB {
  id: string;
  createdAt: Date;
  companyId: string;
  createdByUserId: string;
  updatedByUserId: string;
  title: string;
  data: ReportData;
}

export {
  ReportDB as DB,
  TIMEFRAMES,
  TRACKED_EVENT_OPERATORS,
  TRACKED_EVENT_LOGIC_OPERATORS,
  Timeframe,
  TrackedEventOperator,
  TrackedEventLogicOperator,
  TrackedEventRule,
  TrackedEventGroup,
  TrackedEventModel,
  SelectedApp,
};
