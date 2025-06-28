import { Outlet, useLocation } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { CenteredSpinner } from "~/components/spinner";
import { useAuthContext } from "~/utils/authContext";
import { useHomeStore, type HomeStore } from "./utils/useHomeStore";
import { api } from "~/api";
import { theme } from "~/utils/theme";
import { Tooltip } from "react-tooltip";
import HomeNavigation from "./components/home-navigation";
import { useWSContext, WSProvider } from "~/utils/wsContext";
import { ServerToBrowserEvent } from "@compose/ts";
import { useRefetchEnvironment } from "./utils/useRefetchEnvironment";

const queryClient = new QueryClient();

export default function HomeWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <WSProvider>
        <Home />
      </WSProvider>
    </QueryClientProvider>
  );
}

function Home() {
  const {
    isAuthenticated,
    loading: authLoading,
    navigateToLogin,
  } = useAuthContext();

  const prevHref = useRef("");
  const location = useLocation();

  const { addWSListener, setEnvironmentsOnline, setEnvironmentOnline } =
    useWSContext();

  const { setEnvironments, setUser, setDevelopmentApiKey, resetStore, user } =
    useHomeStore();

  const isInitialized = useRef(false);

  theme.use();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigateToLogin();
    }
  }, [isAuthenticated, authLoading, navigateToLogin]);

  const { refetchEnvironment } = useRefetchEnvironment();

  useEffect(() => {
    function listener(data: ServerToBrowserEvent.Data) {
      if (
        data.type ===
        ServerToBrowserEvent.TYPE.REPORT_ACTIVE_COMPANY_CONNECTIONS
      ) {
        setEnvironmentsOnline(data.connections);
      }
      if (
        data.type === ServerToBrowserEvent.TYPE.SDK_CONNECTION_STATUS_CHANGED
      ) {
        setEnvironmentOnline(data.environmentId, data.isOnline);
      }
      if (data.type === ServerToBrowserEvent.TYPE.ENVIRONMENT_INITIALIZED) {
        refetchEnvironment(data.environmentId);
      }
    }

    const destroy = addWSListener(listener);

    return destroy;
  }, [
    addWSListener,
    setEnvironmentsOnline,
    setEnvironmentOnline,
    refetchEnvironment,
  ]);

  // Log page views as people navigate around the dashboard
  useEffect(() => {
    if (prevHref.current !== location.href) {
      prevHref.current = location.href;

      // Don't log when the user navigates away from the dashboard
      if (!location.href.startsWith("/home")) {
        return;
      }

      api.routes.logEvent({
        event: "DASHBOARD_PAGE_VIEW",
        data: {
          ...location.search,
          pathname: location.pathname,
        },
      });
    }
  }, [location.href, location.pathname, location.search]);

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
