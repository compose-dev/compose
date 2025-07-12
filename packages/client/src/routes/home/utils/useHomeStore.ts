import { create } from "zustand";
import { BrowserToServerEvent, m } from "@compose/ts";

type FormattedEnvironment = Omit<
  BrowserToServerEvent.Initialize.SuccessResponseBody["environments"][number],
  "apps"
> & {
  apps: Record<string, m.Environment.DB["apps"][number]>;
};

type HomeStore = {
  // USER STATE
  company: m.Company.DB | null;
  environments: Record<string, FormattedEnvironment>;
  user: BrowserToServerEvent.Initialize.SuccessResponseBody["user"] | null;
  developmentApiKey: string | null;

  // SET USER STATE
  setCompany: (company: m.Company.DB | null) => void;
  setEnvironments: (environments: Record<string, FormattedEnvironment>) => void;
  setUser: (
    user: BrowserToServerEvent.Initialize.SuccessResponseBody["user"] | null
  ) => void;
  setDevelopmentApiKey: (apiKey: string | null) => void;

  // RESET ALL STATE
  resetStore: () => void;
};

const useHomeStore = create<HomeStore>((set) => ({
  // USER STATE
  company: null,
  environments: {},
  user: null,
  developmentApiKey: null,

  // SET USER STATE
  setCompany: (company) => set({ company }),
  setEnvironments: (environments) => set({ environments }),
  setUser: (user) => set({ user }),
  setDevelopmentApiKey: (apiKey) => set({ developmentApiKey: apiKey }),

  // RESET ALL STATE
  resetStore: () =>
    set({ environments: {}, user: null, developmentApiKey: null }),
}));

export { useHomeStore, type HomeStore, type FormattedEnvironment };
