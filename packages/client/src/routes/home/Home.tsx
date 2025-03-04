import { ServerToBrowserEvent, u } from "@compose/ts";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { api } from "~/api";

import Icon from "~/components/icon";
import { ConnectionStatusIndicator } from "~/components/connection-status-indicator";
import { InlineLink } from "~/components/inline-link";

import DropdownMenu from "~/components/dropdown-menu";
import { useAuthContext } from "~/utils/authContext";
import { CenteredSpinner } from "~/components/spinner";
import { useWSContext, WSProvider } from "~/utils/wsContext";

import Button from "~/components/button";
import { toast } from "~/utils/toast";

import AppRow from "./AppRow";
import { useHomeStore, type HomeStore } from "./useHomeStore";
import NewUserGuide from "./NewUserGuide";
import NewEnvironmentModal from "./NewEnvironmentModal";

function HomeWrapper() {
  return (
    <WSProvider>
      <Home />
    </WSProvider>
  );
}

function Home() {
  const { addToast } = toast.useStore();
  const { checkAuth } = useAuthContext();
  const {
    connectionStatus,
    addWSListener,
    setEnvironmentOnline,
    setEnvironmentsOnline,
  } = useWSContext();

  const navigate = useNavigate({ from: "/home/" });
  const isNewUser = useSearch({ from: "/home/" }).newUser;
  const isNewOrganization = useSearch({ from: "/home/" }).newOrganization;

  const { developmentApiKey, environments, user, setEnvironments } =
    useHomeStore();

  const [newEnvironmentModalOpen, setNewEnvironmentModalOpen] = useState(false);

  // Whether to show hidden apps for an environment. Keyed by environment ID.
  const [showHiddenApps, setShowHiddenApps] = useState<Record<string, boolean>>(
    {}
  );

  const refetchEnvironment = useCallback(
    async (environmentId: string) => {
      const response =
        await api.routes.fetchEnvironmentWithDetails(environmentId);

      const newEnvironments: HomeStore["environments"] = {
        ...environments,
      };

      if (!response.didError) {
        const apps: HomeStore["environments"][string]["apps"] = {};

        for (const app of response.data.environment.apps) {
          apps[app.route] = app;
        }

        newEnvironments[response.data.environment.id] = {
          ...newEnvironments[response.data.environment.id],
          ...response.data.environment,
          apps,
        };
      }

      setEnvironments(newEnvironments);
    },
    [environments, setEnvironments]
  );

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

  const hasProductionEnvironment = Object.values(environments).some(
    (environment) => environment.type === "production"
  );
  const isDeveloperRole = developmentApiKey !== null;
  const hasAtLeastOneDevelopmentApp = Object.values(environments).some(
    (environment) =>
      environment.type === "development" &&
      Object.keys(environment.apps).length > 0
  );

  if (!user) {
    return <CenteredSpinner />;
  }

  const sortedEnvironments = Object.values(environments).sort((a, b) => {
    // Always show development environments first
    if (a.type !== b.type) {
      return a.type === "development" ? -1 : 1;
    }

    // Then sort alphabetically by name
    return a.name.localeCompare(b.name);
  });

  function closeNewUserGuide() {
    navigate({
      search: (prev) => ({
        ...prev,
        newUser: false,
      }),
    });
  }

  function sortedApps(environmentId: string) {
    const apps = Object.values(environments[environmentId].apps);
    const copy = [...apps];

    return copy.sort((a, b) => {
      return u.string.sortAlphabetically(a.name, b.name);
    });
  }

  function hiddenSortedApps(environmentId: string) {
    return sortedApps(environmentId).filter((app) => app.hidden === true);
  }

  function visibleSortedApps(environmentId: string) {
    return sortedApps(environmentId).filter((app) => !app.hidden);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b-brand border-brand-neutral w-full shadow flex items-center justify-between p-4">
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

        <DropdownMenu
          label={
            <div className="flex flex-row items-center space-x-1.5 -m-1 p-1 rounded-brand hover:bg-brand-overlay">
              <div className="bg-brand-overlay-2 rounded-brand w-6 h-6 relative">
                <div className="absolute w-full h-full flex items-center justify-center text-xs text-brand-neutral-2">
                  {`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
                </div>
              </div>
              <p className="text-brand-neutral font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <Icon name="chevron-down" size="sm" color="brand-neutral-2" />
            </div>
          }
          options={[
            {
              label: "Settings",
              left: <Icon name="settings" color="brand-neutral" />,
              onClick: async () => {
                navigate({ to: "/home/settings" });
              },
            },
            {
              label: "Log out",
              left: <Icon name="logout" color="brand-error" />,
              onClick: async () => {
                await api.routes.logout();
                checkAuth();
              },
              variant: "error",
            },
          ]}
          dropdownAnchor="bottom end"
          labelVariant="ghost"
        />
      </div>
      <div className="flex flex-row items-center justify-center w-full bg-brand-page">
        <div className="flex flex-col w-full max-w-5xl items-start justify-start mt-16 gap-8 px-4 pb-8">
          {isNewUser && user.developmentEnvironmentId && (
            <NewUserGuide
              developmentApiKey={developmentApiKey}
              onClose={closeNewUserGuide}
            />
          )}
          {isNewUser && isNewOrganization && !user.developmentEnvironmentId && (
            <div className="space-y-4 p-4 rounded-brand bg-brand-overlay max-w-3xl self-center">
              <h3>Welcome to Compose!</h3>
              <p>
                Compose is the developer-centric platform for building great
                internal software{" "}
                <span className="text-brand-warning italic">simply</span> and{" "}
                <span className="text-brand-warning italic">fast</span>.
              </p>
              <p>
                It looks like you're not a developer. That's okay! You can get
                started by{" "}
                <InlineLink url="/home/settings" newTab={false}>
                  inviting developers to join your organization
                </InlineLink>
                , and have them start building you some apps!
              </p>
              <Button onClick={closeNewUserGuide} variant="primary">
                Dismiss
              </Button>
            </div>
          )}
          {isNewUser &&
            !isNewOrganization &&
            !user.developmentEnvironmentId && (
              <div className="space-y-4 p-4 rounded-brand bg-brand-overlay">
                <h3>Welcome to Compose!</h3>
                <p>
                  You've been invited to join an organization. Apps that are
                  published by your organization will appear below. Don't see
                  any apps?
                </p>
                <p>
                  <InlineLink url="/home/settings" newTab={false}>
                    Invite developers to join your organization
                  </InlineLink>{" "}
                  and have them build some!
                </p>
                <Button onClick={closeNewUserGuide} variant="primary">
                  Dismiss
                </Button>
              </div>
            )}
          {sortedEnvironments.map((environment) => (
            <div key={environment.id} className="space-y-4 w-full">
              <div className="flex flex-col space-y-2">
                <div className="flex flex-row items-center space-x-4">
                  <h3>{environment.name}</h3>
                  <ConnectionStatusIndicator
                    connectionStatus={connectionStatus[environment.id]}
                  />
                </div>
                {environment.key && (
                  <div className="flex flex-row items-center space-x-2 text-brand-neutral-2">
                    <p>API key: {environment.key.substring(0, 12)}...</p>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(environment.key || "");
                        addToast({
                          message: "Copied API key to clipboard",
                          appearance: toast.APPEARANCE.success,
                        });
                      }}
                      variant="ghost"
                    >
                      <Icon name="copy" color="brand-neutral-2" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-col w-full">
                {visibleSortedApps(environment.id).map((app) => (
                  <AppRow
                    key={app.route}
                    route={app.route}
                    name={app.name}
                    environmentId={environment.id}
                    refetchEnvironment={refetchEnvironment}
                  />
                ))}
                {hiddenSortedApps(environment.id).length > 0 && (
                  <div className="flex flex-col">
                    <Button
                      className="flex flex-row items-center justify-between hover:bg-brand-overlay cursor-pointer rounded-brand -mx-2 p-2"
                      onClick={() => {
                        setShowHiddenApps((prev) => ({
                          ...prev,
                          [environment.id]:
                            prev[environment.id] === true ? false : true,
                        }));
                      }}
                      variant="ghost"
                    >
                      <div className="flex flex-row items-center space-x-2">
                        <Icon name="eye-slash" color="brand-neutral-2" />
                        <p className="text-brand-neutral-2">
                          {hiddenSortedApps(environment.id).length} hidden{" "}
                          {hiddenSortedApps(environment.id).length === 1
                            ? "app"
                            : "apps"}
                        </p>
                      </div>
                      <div className="mr-2">
                        <Icon
                          name={
                            showHiddenApps[environment.id]
                              ? "chevron-up"
                              : "chevron-down"
                          }
                          color="brand-neutral-2"
                          size="sm"
                        />
                      </div>
                    </Button>
                    {showHiddenApps[environment.id] &&
                      hiddenSortedApps(environment.id).map((app) => (
                        <AppRow
                          key={app.route}
                          route={app.route}
                          name={app.name}
                          environmentId={environment.id}
                          refetchEnvironment={refetchEnvironment}
                          hidden={true}
                        />
                      ))}
                  </div>
                )}
                {Object.values(environments[environment.id].apps).length ===
                  0 && (
                  <p className="text-brand-neutral-2">
                    No apps found. Get going with the{" "}
                    <InlineLink url="https://docs.composehq.com/get-started/quickstart">
                      quickstart guide
                    </InlineLink>
                    .
                  </p>
                )}
              </div>
            </div>
          ))}
          {isDeveloperRole &&
            hasAtLeastOneDevelopmentApp &&
            u.permission.isAllowed(
              u.permission.FEATURE.CREATE_PRODUCTION_ENVIRONMENT,
              user.permission
            ) && (
              <>
                {!hasProductionEnvironment && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-brand-primary">Ready to Deploy?</h3>
                      <p className="text-brand-neutral-2">
                        Provision a production environment to share apps with
                        your whole organization. Learn more by reading the{" "}
                        <InlineLink url="https://docs.composehq.com/guides/deployment">
                          deployment guide.
                        </InlineLink>
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setNewEnvironmentModalOpen(true);
                      }}
                      variant="outline"
                    >
                      Generate API key
                    </Button>
                  </div>
                )}
                {hasProductionEnvironment && (
                  <Button
                    onClick={() => {
                      setNewEnvironmentModalOpen(true);
                    }}
                    variant="subtle-secondary"
                    className="!px-2 -mx-2"
                  >
                    <Icon name="plus" color="brand-neutral-2" />
                    Create another production environment
                  </Button>
                )}
              </>
            )}
        </div>
      </div>
      <NewEnvironmentModal
        isOpen={newEnvironmentModalOpen}
        onClose={() => setNewEnvironmentModalOpen(false)}
        onSuccess={() => {
          setNewEnvironmentModalOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
}

export default HomeWrapper;
