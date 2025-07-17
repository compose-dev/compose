import { useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { api } from "~/api";

import Icon from "~/components/icon";
import { Navigation } from "~/components/navigation";

import { classNames } from "~/utils/classNames";
import { useAuthContext } from "~/utils/authContext";
import { useHomeStore } from "../../utils/useHomeStore";

function NavigationItem({
  icon,
  label,
  isActive,
  appearance = "neutral",
  isExternalLink = false,
  onClick,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  isActive: boolean;
  appearance?: "neutral" | "danger";
  isExternalLink?: boolean;
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
      <div className="flex gap-1 items-start">
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
        {isExternalLink && (
          <div className="mt-1">
            <Icon name="external-link" color="brand-neutral-2" size="0.875" />
          </div>
        )}
      </div>
    </button>
  );
}

export default function HomeNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { checkAuth } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useHomeStore();

  const activeTab = location.pathname.includes("/home/activity-logs")
    ? "activity-logs"
    : location.pathname.includes("/home/settings") ||
        location.pathname.includes("/home/billing/details")
      ? "settings"
      : location.pathname.includes("/home/onboarding")
        ? "onboarding"
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
          {user && user.metadata["show-onboarding"] && (
            <NavigationItem
              icon="flag"
              label="Onboarding"
              isActive={activeTab === "onboarding"}
              onClick={() => navigate({ to: "/home/onboarding" })}
            />
          )}
          <NavigationItem
            icon="server"
            label="Environments"
            isActive={activeTab === "environments"}
            onClick={() => navigate({ to: "/home" })}
          />
          <NavigationItem
            icon="clipboard-text"
            label="Activity Logs"
            isActive={activeTab === "activity-logs"}
            onClick={() => navigate({ to: "/home/activity-logs" })}
          />
          <NavigationItem
            icon="settings"
            label="Settings"
            isActive={activeTab === "settings"}
            onClick={() => navigate({ to: "/home/settings" })}
          />
          <div className="flex flex-1" />
          <NavigationItem
            icon="book"
            label="Docs"
            isActive={false}
            appearance="neutral"
            onClick={async () => {
              window.open("https://docs.composehq.com", "_blank");
            }}
            isExternalLink
          />
          <NavigationItem
            icon="script"
            label="Changelog"
            isActive={false}
            appearance="neutral"
            onClick={async () => {
              window.open("https://composehq.com/changelog", "_blank");
            }}
            isExternalLink
          />
          <NavigationItem
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
            {user && user.metadata["show-onboarding"] && (
              <NavigationItem
                icon="flag"
                label="Onboarding"
                isActive={activeTab === "onboarding"}
                onClick={() => navigate({ to: "/home/onboarding" })}
              />
            )}
            <NavigationItem
              icon="server"
              label="Environments"
              isActive={activeTab === "environments"}
              onClick={() => {
                navigate({ to: "/home" });
                setIsSidebarOpen(false);
              }}
            />
            <NavigationItem
              icon="clipboard-text"
              label="Activity Logs"
              isActive={activeTab === "activity-logs"}
              onClick={() => {
                navigate({
                  to: "/home/activity-logs",
                });
                setIsSidebarOpen(false);
              }}
            />
            <NavigationItem
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
          <NavigationItem
            icon="book"
            label="Docs"
            isActive={false}
            appearance="neutral"
            onClick={async () => {
              window.open("https://docs.composehq.com", "_blank");
            }}
            isExternalLink
          />
          <NavigationItem
            icon="script"
            label="Changelog"
            isActive={false}
            appearance="neutral"
            onClick={async () => {
              window.open("https://composehq.com/changelog", "_blank");
            }}
            isExternalLink
          />
          <NavigationItem
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
      <Navigation.Content stableScrollbarGutter={activeTab === "activity-logs"}>
        {children}
      </Navigation.Content>
    </Navigation.Root>
  );
}
