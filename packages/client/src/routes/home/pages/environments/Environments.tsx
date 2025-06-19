import { ServerToBrowserEvent, u } from "@compose/ts";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { api } from "~/api";

import Icon from "~/components/icon";
import { InlineLink } from "~/components/inline-link";

import { CenteredSpinner } from "~/components/spinner";
import { useWSContext, WSProvider } from "~/utils/wsContext";

import Button from "~/components/button";

import { useHomeStore, type HomeStore } from "~/routes/home/utils/useHomeStore";
import NewUserGuide from "./NewUserGuide";
import NewEnvironmentModal from "./NewEnvironmentModal";
import { Page } from "~/routes/home/components/page";
import { Tooltip } from "react-tooltip";
import Environment from "./Environment";
import { Divider } from "~/components/divider";

function EnvironmentsWrapper() {
  return (
    <WSProvider>
      <Environments />
    </WSProvider>
  );
}

function Environments() {
  const { addWSListener, setEnvironmentOnline, setEnvironmentsOnline } =
    useWSContext();

  const navigate = useNavigate({ from: "/home/" });
  const isNewUser = useSearch({ from: "/home/" }).newUser;
  const isNewOrganization = useSearch({ from: "/home/" }).newOrganization;

  const { developmentApiKey, environments, user, setEnvironments } =
    useHomeStore();

  const [newEnvironmentModalOpen, setNewEnvironmentModalOpen] = useState(false);

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

  return (
    <Page.Root>
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
      {isNewUser && !isNewOrganization && !user.developmentEnvironmentId && (
        <div className="space-y-4 p-4 rounded-brand bg-brand-overlay">
          <h3>Welcome to Compose!</h3>
          <p>
            You've been invited to join an organization. Apps that are published
            by your organization will appear below. Don't see any apps?
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
      {sortedEnvironments.map((environment, index) => (
        <>
          <Environment
            key={environment.id}
            environment={environment}
            refetchEnvironment={refetchEnvironment}
          />
          {index !== sortedEnvironments.length - 1 && <Divider />}
        </>
      ))}
      {isDeveloperRole &&
        hasAtLeastOneDevelopmentApp &&
        u.permission.isAllowed(
          u.permission.FEATURE.CREATE_PRODUCTION_ENVIRONMENT,
          user.permission
        ) && (
          <>
            <Divider />
            {!hasProductionEnvironment && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Page.Subtitle color="primary">
                    Ready to Deploy?
                  </Page.Subtitle>
                  <p className="text-brand-neutral-2">
                    Provision a production environment to share apps with your
                    whole organization. Learn more by reading the{" "}
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
      <NewEnvironmentModal
        isOpen={newEnvironmentModalOpen}
        onClose={() => setNewEnvironmentModalOpen(false)}
        onSuccess={() => {
          setNewEnvironmentModalOpen(false);
          window.location.reload();
        }}
      />
      <Tooltip id="top-tooltip" className="tooltip" noArrow={true} />
    </Page.Root>
  );
}

export default EnvironmentsWrapper;
