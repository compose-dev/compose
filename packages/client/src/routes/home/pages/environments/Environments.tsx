import { u } from "@compose/ts";
import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import Icon from "~/components/icon";
import { InlineLink } from "~/components/inline-link";

import { CenteredSpinner } from "~/components/spinner";
import { useWSContext } from "~/utils/wsContext";

import Button from "~/components/button";

import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import NewUserGuide from "./NewUserGuide";
import NewEnvironmentModal from "./NewEnvironmentModal";
import { Page } from "~/routes/home/components/page";
import { Tooltip } from "react-tooltip";
import Environment from "./Environment";
import { Divider } from "~/components/divider";
import { useRefetchEnvironment } from "../../utils/useRefetchEnvironment";

export default function Environments() {
  const { connectionStatus } = useWSContext();

  const navigate = useNavigate({ from: "/home/" });
  const isNewUser = useSearch({ from: "/home/" }).newUser;

  const { developmentApiKey, environments, user } = useHomeStore();

  const [newEnvironmentModalOpen, setNewEnvironmentModalOpen] = useState(false);

  const hasProductionEnvironment = Object.values(environments).some(
    (environment) => environment.type === "production"
  );
  const isDeveloperRole = developmentApiKey !== null;
  const hasAtLeastOneDevelopmentApp = Object.values(environments).some(
    (environment) =>
      environment.type === "development" &&
      Object.keys(environment.apps).length > 0
  );

  const { refetchEnvironment } = useRefetchEnvironment();

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
      {isNewUser && !user.developmentEnvironmentId && (
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
            connectionStatus={connectionStatus}
          />
          {index !== sortedEnvironments.length - 1 && (
            <Divider key={`divider-${environment.id}`} />
          )}
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
