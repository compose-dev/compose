import { BrowserToServerEvent, m } from "@compose/ts";
import { create } from "zustand";

type GlobalStoreEnvironment = Omit<
  BrowserToServerEvent.Initialize.Response["environments"][number],
  "apps"
> & {
  apps: Record<string, m.Environment.DB["apps"][number]>;
};

interface GlobalStore {
  // All Environments
  environments: Record<string, GlobalStoreEnvironment>;
  setEnvironments: (
    environments: Record<string, GlobalStoreEnvironment>
  ) => void;

  // Online environments
  onlineEnvironmentIds: Set<string>;
  setOnlineEnvironmentIds: (onlineEnvironmentIds: string[]) => void;
  setEnvironmentIsOnline: (environmentId: string, isOnline: boolean) => void;

  // User
  user: BrowserToServerEvent.Initialize.Response["user"] | null;
  setUser: (
    user: BrowserToServerEvent.Initialize.Response["user"] | null
  ) => void;
}

const useGlobalStore = create<GlobalStore>((set) => ({
  // Environments
  environments: {},
  setEnvironments: (environments) => set({ environments }),

  onlineEnvironmentIds: new Set(),
  setOnlineEnvironmentIds: (onlineEnvironmentIds) =>
    set({ onlineEnvironmentIds: new Set(onlineEnvironmentIds) }),

  setEnvironmentIsOnline: (environmentId, isOnline) =>
    set((state) => {
      if (isOnline) {
        return {
          onlineEnvironmentIds: new Set([
            ...state.onlineEnvironmentIds,
            environmentId,
          ]),
        };
      }
      return {
        onlineEnvironmentIds: new Set(
          [...state.onlineEnvironmentIds].filter((id) => id !== environmentId)
        ),
      };
    }),

  // User
  user: null,
  setUser: (user) => set({ user }),
}));

export default useGlobalStore;
export type { GlobalStore };
