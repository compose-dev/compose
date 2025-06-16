import { Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CenteredSpinner } from "~/components/spinner";
import { useAuthContext } from "~/utils/authContext";
import { useHomeStore, type HomeStore } from "./useHomeStore";
import { api } from "~/api";
import { theme } from "~/utils/theme";
import { Navigation } from "~/components/navigation";
import Icon from "~/components/icon";
import { classNames } from "~/utils/classNames";
import { Tooltip } from "react-tooltip";

function SidebarItem({
  icon,
  label,
  isActive,
  appearance = "neutral",
  onClick,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  isActive: boolean;
  appearance?: "neutral" | "danger";
  onClick?: () => void;
}) {
  return (
    <button
      className={classNames(
        "flex items-center gap-4 hover:bg-brand-overlay-2 p-2 rounded-brand",
        {
          "bg-brand-overlay-2 text-brand-neutral": isActive,
        }
      )}
      onClick={onClick}
    >
      <Icon
        name={icon}
        color={
          appearance === "neutral"
            ? isActive
              ? "brand-neutral"
              : "brand-neutral-2"
            : isActive
              ? "brand-error"
              : "brand-error-heavy"
        }
        size="1.25"
      />
      <p
        className={classNames({
          "text-brand-neutral": isActive && appearance === "neutral",
          "text-brand-neutral-2": !isActive && appearance === "neutral",
          "text-brand-error": isActive && appearance === "danger",
          "text-brand-error-heavy": !isActive && appearance === "danger",
        })}
      >
        {label}
      </p>
    </button>
  );
}

function HomeWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isAuthenticated,
    loading: authLoading,
    checkAuth,
    navigateToLogin,
  } = useAuthContext();
  const { setEnvironments, setUser, setDevelopmentApiKey, resetStore, user } =
    useHomeStore();

  const isInitialized = useRef(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  theme.use();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigateToLogin();
    }
  }, [isAuthenticated, navigate, authLoading, navigateToLogin]);

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

  const activeTab = location.pathname.includes("/home/audit-log")
    ? "activity-logs"
    : location.pathname.includes("/home/settings")
      ? "settings"
      : "environments";

  return (
    <Navigation.Root>
      <Navigation.DesktopSidebar>
        <div className="p-2 mb-4">
          <img
            src="/light-logo-with-text.svg"
            className="w-32 hidden dark:block"
            alt="Logo"
          />
          <img
            src="/dark-logo-with-text.svg"
            className="w-32 block dark:hidden"
            alt="Logo"
          />
        </div>
        <div className="flex flex-col flex-1 gap-y-2">
          <SidebarItem
            icon="server"
            label="Environments"
            isActive={activeTab === "environments"}
            onClick={() => navigate({ to: "/home" })}
          />
          <SidebarItem
            icon="clipboard-text"
            label="Activity Logs"
            isActive={activeTab === "activity-logs"}
            onClick={() => navigate({ to: "/home/audit-log" })}
          />
          <SidebarItem
            icon="settings"
            label="Settings"
            isActive={activeTab === "settings"}
            onClick={() => navigate({ to: "/home/settings" })}
          />
          <div className="flex flex-1" />
          <SidebarItem
            icon="logout"
            label="Log out"
            isActive={false}
            appearance="danger"
            onClick={async () => {
              await api.routes.logout();
              checkAuth();
            }}
          />
        </div>
      </Navigation.DesktopSidebar>
      <Navigation.MobileTopBar
        logo={
          <div>
            <img
              src="/light-logo-with-text.svg"
              className="w-32 hidden dark:block"
              alt="Logo"
            />
            <img
              src="/dark-logo-with-text.svg"
              className="w-32 block dark:hidden"
              alt="Logo"
            />
          </div>
        }
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      >
        <div className="flex flex-col flex-1 gap-y-2 h-full">
          <div className="mb-4">
            <img
              src="/light-logo-with-text.svg"
              className="w-32 hidden dark:block"
              alt="Logo"
            />
            <img
              src="/dark-logo-with-text.svg"
              className="w-32 block dark:hidden"
              alt="Logo"
            />
          </div>
          <div className="flex flex-col gap-y-2 -mx-2">
            <SidebarItem
              icon="server"
              label="Environments"
              isActive={activeTab === "environments"}
              onClick={() => {
                navigate({ to: "/home" });
                setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon="clipboard-text"
              label="Activity Logs"
              isActive={activeTab === "activity-logs"}
              onClick={() => {
                navigate({ to: "/home/audit-log" });
                setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon="settings"
              label="Settings"
              isActive={activeTab === "settings"}
              onClick={() => {
                navigate({ to: "/home/settings" });
                setIsSidebarOpen(false);
              }}
            />
          </div>
          <div className="flex flex-1" />
          <SidebarItem
            icon="logout"
            label="Log out"
            isActive={false}
            appearance="danger"
            onClick={async () => {
              await api.routes.logout();
              checkAuth();
              setIsSidebarOpen(false);
            }}
          />
        </div>
      </Navigation.MobileTopBar>
      <Navigation.Content>
        <Outlet />
      </Navigation.Content>
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
    </Navigation.Root>
  );
}

export default HomeWrapper;
