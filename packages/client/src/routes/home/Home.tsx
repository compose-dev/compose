import { Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { CenteredSpinner } from "~/components/spinner";
import { useAuthContext } from "~/utils/authContext";
import { useHomeStore, type HomeStore } from "./utils/useHomeStore";
import { api } from "~/api";
import { theme } from "~/utils/theme";
import { Tooltip } from "react-tooltip";
import HomeNavigation from "./components/home-navigation";

const queryClient = new QueryClient();

export default function HomeWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}

function Home() {
  const {
    isAuthenticated,
    loading: authLoading,
    navigateToLogin,
  } = useAuthContext();

  const { setEnvironments, setUser, setDevelopmentApiKey, resetStore, user } =
    useHomeStore();

  const isInitialized = useRef(false);

  theme.use();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigateToLogin();
    }
  }, [isAuthenticated, authLoading, navigateToLogin]);

  useEffect(() => {});

  useEffect(() => {
    async function fetchInitialize() {
      resetStore();

      const response = await api.routes.initialize();

      if (response.didError) {
        if (response.statusCode === 401) {
          navigateToLogin();
        }
        return;
      }

      const formattedEnvironments: HomeStore["environments"] = {};

      for (const environment of response.data.environments) {
        const apps: HomeStore["environments"][string]["apps"] = {};

        for (const app of environment.apps) {
          apps[app.route] = app;
        }

        formattedEnvironments[environment.id] = { ...environment, apps };

        if (environment.key !== null) {
          setDevelopmentApiKey(environment.key);
        }
      }

      setEnvironments(formattedEnvironments);
      setUser(response.data.user);
    }

    if (!isInitialized.current) {
      fetchInitialize();
      isInitialized.current = true;
    }
  }, [
    setEnvironments,
    setUser,
    setDevelopmentApiKey,
    resetStore,
    navigateToLogin,
  ]);

  if (authLoading || !user) {
    return <CenteredSpinner />;
  }

  return (
    <>
      <HomeNavigation>
        <Outlet />
      </HomeNavigation>
      <Tooltip
        id="table-tooltip"
        className="tooltip tooltip-contrast tooltip-sm z-40 hidden sm:block max-w-md"
        place="right"
        offset={4}
        noArrow={true}
        clickable={true}
        anchorSelect=".table-row-cell"
        delayShow={300}
      />
    </>
  );
}
