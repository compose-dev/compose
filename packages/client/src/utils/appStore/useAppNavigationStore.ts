import { create } from "zustand";
import { BrowserToServerEvent } from "@compose/ts";
import { u as uPub } from "@composehq/ts-public";

type AppList =
  BrowserToServerEvent.InitializeEnvironmentAndAuthorizeApp.SuccessResponseBody["environment"]["apps"];

interface AppNavigationStore {
  navs: uPub.navigation.FormattedInterface[];
  companyName: string;
  setNavs: (
    navs: uPub.navigation.FormattedInterface[],
    apps: AppList,
    environmentId: string,
    companyName: string
  ) => void;
  appRouteToNavId: Record<string, string>;
  environmentId: string;
}

function formatAppList(apps: AppList): Record<string, string> {
  return apps.reduce(
    (acc, app) => {
      if (app.navId) {
        acc[app.route] = app.navId;
      }
      return acc;
    },
    {} as Record<string, string>
  );
}

const useAppNavigationStore = create<AppNavigationStore>()((set) => ({
  appRouteToNavId: {},
  navs: [],
  environmentId: "",
  companyName: "",
  setNavs: (navs, apps, environmentId, companyName) => {
    const appRouteToNavId = formatAppList(apps);
    set({ navs, appRouteToNavId, environmentId, companyName });
  },
}));

export { useAppNavigationStore };
