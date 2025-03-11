import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

import App from "~/routes/app/App";
import { Home, SettingsPage, HomeWrapper, BillingDetails } from "~/routes/home";
import { Root, RootIndexRoute } from "~/routes/root";

import { AuthProvider } from "~/utils/authContext";
import { Login } from "./routes/auth/login";
import { GoogleOauth2, GoogleOauth2Callback } from "./routes/auth/googleOauth2";
import { Suspense } from "react";

import ToastHandler from "./Toast";
import LoginToApp from "./routes/auth/loginToApp";
import { Page } from "@composehq/ts-public";
import { Docs, DocType } from "./routes/docs";
import SignUp from "./routes/auth/signup";
import { NewUserFlow, type NewUserStage } from "./routes/newUserFlow";
import {
  InteractiveOnboarding,
  type Lang as InteractiveOnboardingLang,
  type Step as InteractiveOnboardingStep,
} from "./routes/interactiveOnboarding";
import AppWrapper from "./routes/app/AppWrapper";

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

interface InteractiveOnboardingRouteSearch {
  lang: InteractiveOnboardingLang | null;
  step: InteractiveOnboardingStep;
}

const interactiveOnboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "start",
  component: InteractiveOnboarding,
  validateSearch: (
    search: Record<string, unknown>
  ): InteractiveOnboardingRouteSearch => {
    return {
      lang: (search.lang as InteractiveOnboardingRouteSearch["lang"]) || null,
      step:
        (search.step as InteractiveOnboardingRouteSearch["step"]) ||
        "lang-select",
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
  newOrganization?: boolean;
}

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "home",
  component: HomeWrapper,
});

const homeIndexRoute = createRoute({
  getParentRoute: () => homeRoute,
  path: "/",
  component: Home,
  validateSearch: (search: Record<string, unknown>): HomeRouteSearch => {
    return {
      newUser: search.newUser as boolean | undefined,
      newOrganization: search.newOrganization as boolean | undefined,
    };
  },
});

const settingsRoute = createRoute({
  getParentRoute: () => homeRoute,
  path: "settings",
  component: SettingsPage,
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
  interactiveOnboardingRoute,
  homeRoute.addChildren([homeIndexRoute, settingsRoute, billingDetailsRoute]),
  appWrapperRoute.addChildren([appRoute]),
]);

const router = createRouter({
  routeTree,
});

function RouterContainer() {
  return (
    <Suspense>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastHandler />
      </AuthProvider>
    </Suspense>
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}

export default RouterContainer;
