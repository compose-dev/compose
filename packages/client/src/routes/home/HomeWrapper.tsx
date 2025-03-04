import { Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CenteredSpinner } from "~/components/spinner";
import { useAuthContext } from "~/utils/authContext";
import { useHomeStore, type HomeStore } from "./useHomeStore";
import { api } from "~/api";
import { theme } from "~/utils/theme";

function HomeWrapper() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { setEnvironments, setUser, setDevelopmentApiKey, resetStore, user } =
    useHomeStore();

  const isInitialized = useRef(false);
  const [homeRoute] = useState(location.href);

  theme.use();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate({ to: "/auth/login", search: { redirect: homeRoute } });
    }
  }, [isAuthenticated, navigate, authLoading, homeRoute]);

  useEffect(() => {
    async function fetchInitialize() {
      resetStore();

      const response = await api.routes.initialize();

      if (response.didError) {
        if (response.statusCode === 401) {
          navigate({ to: "/auth/login", search: { redirect: homeRoute } });
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
    navigate,
    resetStore,
    homeRoute,
  ]);

  if (authLoading || !user) {
    return <CenteredSpinner />;
  }

  return <Outlet />;
}

export default HomeWrapper;
