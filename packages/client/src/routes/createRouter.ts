import { Page } from "@composehq/ts-public";
import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

import { Root, RootIndexRoute } from "~/routes/root";

import App from "~/routes/app/App";

import {
  Home,
  Settings,
  Environments,
  BillingDetails,
  Onboarding,
  type OnboardingStep,
  type OnboardingFramework,
  ONBOARDING_DEFAULT_STEP,
} from "./home";

import {
  ActivityLogs,
  AllEvents,
  AppRuns,
  EditCustomReport,
  ViewCustomReport,
  type EditCustomReportStep,
} from "./home/pages/activity-logs";

import { Login } from "./auth/login";
import { GoogleOauth2, GoogleOauth2Callback } from "./auth/googleOauth2";

import LoginToApp from "./auth/loginToApp";
import { Docs, DocType } from "./docs";
import SignUp from "./auth/signup";
import { NewUserFlow, type NewUserStage } from "./newUserFlow";
import AppWrapper from "./app/AppWrapper";

interface Redirect {
  redirect: string | null;
}

interface NewUserInvite {
  inviteCode?: string;
  inviteExpiresAt?: number;
}

interface DirectAppLogin {
  environmentId?: string;
  appRoute?: string;
}

const rootRoute = createRootRoute({
  component: Root,
});

const rootIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: RootIndexRoute,
  beforeLoad: async () => {
    throw redirect({
      to: "/home",
    });
  },
});

interface LoginRouteSearch extends Redirect, DirectAppLogin {}

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "auth/login",
  component: Login,
  validateSearch: (search: Record<string, unknown>): LoginRouteSearch => {
    return {
      redirect: (search.redirect as string) || null,
      environmentId: search.environmentId as LoginRouteSearch["environmentId"],
      appRoute: search.appRoute as LoginRouteSearch["appRoute"],
    };
  },
});

interface SignupRouteSearch extends NewUserInvite {
  redirect?: string | null;
}

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "auth/signup",
  component: SignUp,
  validateSearch: (search: Record<string, unknown>): SignupRouteSearch => {
    return {
      inviteCode: search.inviteCode as NewUserInvite["inviteCode"],
      inviteExpiresAt:
        search.inviteExpiresAt as NewUserInvite["inviteExpiresAt"],
      redirect: search.redirect as SignupRouteSearch["redirect"],
    };
  },
});

interface GoogleOauthRouteSearch
  extends Redirect,
    NewUserInvite,
    DirectAppLogin {
  newAccount: boolean;
}

const googleOuathRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "auth/google-oauth",
  component: GoogleOauth2,
  validateSearch: (search: Record<string, unknown>): GoogleOauthRouteSearch => {
    return {
      redirect: (search.redirect as string) || null,
      newAccount: search.newAccount as boolean,
      inviteCode: search.inviteCode as NewUserInvite["inviteCode"],
      inviteExpiresAt:
        search.inviteExpiresAt as NewUserInvite["inviteExpiresAt"],
    };
  },
});

const googleOauthCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "auth/google-oauth/redirect",
  component: GoogleOauth2Callback,
});

interface LoginToAppRouteSearch {
  environmentId: string;
  appRoute: string;
  paramsString?: string;
}

const loginToAppRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "auth/login-to-app",
  component: LoginToApp,
  validateSearch: (search: Record<string, unknown>): LoginToAppRouteSearch => {
    return {
      environmentId: search.environmentId as string,
      appRoute: search.appRoute as string,
      paramsString: search.paramsString as string,
    };
  },
});

interface NewUserFlowSearch extends NewUserInvite {
  accessToken: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  stage: NewUserStage;
}

const newUserFlowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "new-user-flow",
  component: NewUserFlow,
  validateSearch: (search: Record<string, unknown>): NewUserFlowSearch => {
    return {
      accessToken: search.accessToken as string,
      email: search.email as string,
      firstName: search.firstName as string | null,
      lastName: search.lastName as string | null,
      stage: search.stage as NewUserStage,
      inviteCode: search.inviteCode as NewUserInvite["inviteCode"],
      inviteExpiresAt:
        search.inviteExpiresAt as NewUserInvite["inviteExpiresAt"],
    };
  },
});

interface DocsRouteSearch {
  type: DocType;
  isDark: "TRUE" | "FALSE";
}

const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "docs",
  component: Docs,
  validateSearch: (search: Record<string, unknown>): DocsRouteSearch => {
    return {
      type: search.type as DocsRouteSearch["type"],
      isDark: search.isDark as DocsRouteSearch["isDark"],
    };
  },
});

interface HomeRouteSearch {
  newUser?: boolean;
}

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "home",
  component: Home,
});

const homeIndexRoute = createRoute({
  getParentRoute: () => homeRoute,
  path: "/",
  component: Environments,
  validateSearch: (search: Record<string, unknown>): HomeRouteSearch => {
    return {
      newUser: search.newUser as boolean | undefined,
    };
  },
});

const settingsRoute = createRoute({
  getParentRoute: () => homeRoute,
  path: "settings",
  component: Settings,
});

const activityLogsRoute = createRoute({
  getParentRoute: () => homeRoute,
  path: "activity-logs",
  component: ActivityLogs,
});

const auditLogsRoute = createRoute({
  getParentRoute: () => homeRoute,
  path: "audit-log",
  beforeLoad: () => {
    throw redirect({
      to: "/home/activity-logs",
    });
  },
});

const activityLogsIndexRoute = createRoute({
  getParentRoute: () => activityLogsRoute,
  path: "/",
  component: AppRuns,
});

const activityLogsAllEventsRoute = createRoute({
  getParentRoute: () => activityLogsRoute,
  path: "all-events",
  component: AllEvents,
});

interface ActivityLogsEditCustomReportRouteSearch {
  step?: EditCustomReportStep;
  reportId?: string;
}

const activityLogsEditCustomReportRoute = createRoute({
  getParentRoute: () => activityLogsRoute,
  path: "edit-custom-report",
  component: EditCustomReport,
  validateSearch: (
    search: Record<string, unknown>
  ): ActivityLogsEditCustomReportRouteSearch => {
    return {
      step: search.step as ActivityLogsEditCustomReportRouteSearch["step"],
      reportId:
        search.reportId as ActivityLogsEditCustomReportRouteSearch["reportId"],
    };
  },
});

const activityLogsViewCustomReportRoute = createRoute({
  getParentRoute: () => activityLogsRoute,
  path: "view-custom-report/$reportId",
  component: ViewCustomReport,
});

interface OnboardingRouteSearch {
  step?: OnboardingStep;
  framework?: OnboardingFramework;
}

const onboardingRoute = createRoute({
  getParentRoute: () => homeRoute,
  path: "onboarding",
  component: Onboarding,
  validateSearch: (search: Record<string, unknown>): OnboardingRouteSearch => {
    return {
      step: (search.step as OnboardingStep) || ONBOARDING_DEFAULT_STEP,
      framework: search.framework as OnboardingFramework,
    };
  },
});

interface BillingDetailsRouteSearch {
  checkoutResult?: "SUCCESS" | "ERROR";
}

const billingDetailsRoute = createRoute({
  getParentRoute: () => homeRoute,
  path: "billing/details",
  component: BillingDetails,
  validateSearch: (
    search: Record<string, unknown>
  ): BillingDetailsRouteSearch => {
    return {
      checkoutResult:
        search.checkoutResult as BillingDetailsRouteSearch["checkoutResult"],
    };
  },
});

const appWrapperRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "app",
  component: AppWrapper,
});

const appRoute = createRoute({
  getParentRoute: () => appWrapperRoute,
  path: "$environmentId/$appRoute",
  component: App,
  validateSearch: (search: Record<string, unknown>): Page.Params => {
    return search as Page.Params;
  },
});

const routeTree = rootRoute.addChildren([
  rootIndexRoute,
  loginRoute,
  signupRoute,
  googleOuathRoute,
  googleOauthCallbackRoute,
  loginToAppRoute,
  newUserFlowRoute,
  docsRoute,
  homeRoute.addChildren([
    homeIndexRoute,
    settingsRoute,
    billingDetailsRoute,
    auditLogsRoute,
    activityLogsRoute.addChildren([
      activityLogsIndexRoute,
      activityLogsAllEventsRoute,
      activityLogsEditCustomReportRoute,
      activityLogsViewCustomReportRoute,
    ]),
    onboardingRoute,
  ]),
  appWrapperRoute.addChildren([appRoute]),
]);

const router = createRouter({
  routeTree,
});

export { router };
