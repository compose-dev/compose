import { m } from "@compose/ts";
import { useNavigate } from "@tanstack/react-router";
import Icon from "~/components/icon";

import { useHomeStore, type HomeStore } from "~/routes/home/utils/useHomeStore";
import ShareAppModal from "./ShareAppModal";
import { useState } from "react";
import { classNames } from "~/utils/classNames";
import Button from "~/components/button";

function isPublic(
  environment: HomeStore["environments"][string],
  appRoute: string
) {
  return environment.externalAppUsers.some(
    (permission) =>
      permission.appRoute === appRoute &&
      permission.email === m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP
  );
}

function isInheritingFrom(
  environment: HomeStore["environments"][string],
  appRoute: string
) {
  return environment.externalAppUsers.some(
    (permission) =>
      permission.appRoute === appRoute &&
      permission.email.startsWith(
        m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX
      )
  );
}

function isSharedViaEmail(
  environment: HomeStore["environments"][string],
  appRoute: string
) {
  return environment.externalAppUsers.some(
    (permission) =>
      permission.appRoute === appRoute &&
      permission.email !== m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP &&
      !permission.email.startsWith(
        m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX
      )
  );
}

function AppRow({
  route,
  name,
  environmentId,
  refetchEnvironment,
  hidden = false,
}: {
  route: string;
  name: string;
  environmentId: string;
  refetchEnvironment: (environmentId: string) => void;
  hidden?: boolean;
}) {
  const navigate = useNavigate();
  const { environment } = useHomeStore((state) => ({
    environment: state.environments[environmentId],
  }));

  const [shareModalOpen, setShareModalOpen] = useState(false);

  const externalUsersForApp = environment.externalAppUsers.filter(
    (externalUser) => externalUser.appRoute === route
  );

  function onNavigate(environmentId: string, appRoute: string) {
    navigate({
      to: "/app/$environmentId/$appRoute",
      params: { environmentId, appRoute },
    });
  }

  return (
    <>
      <div
        onClick={() => onNavigate(environmentId, route)}
        role="button"
        tabIndex={0}
        className="px-2 hover:bg-brand-overlay -mx-2 transition-all duration-50 rounded-brand"
      >
        <div
          className={classNames(
            "flex flex-row justify-between items-center w-full py-2",
            {
              "text-brand-neutral-2": hidden,
              "text-brand-neutral": !hidden,
            }
          )}
        >
          <div className="flex items-center">
            <div className="mr-2 flex w-4">
              <Icon
                name="bolt"
                color={hidden ? "brand-neutral-2" : "brand-neutral"}
              />
            </div>
            {name}
          </div>
          <div className="flex flex-row items-center space-x-2">
            {isPublic(environment, route) && (
              <div
                data-tooltip-id="top-tooltip"
                data-tooltip-content="This app is public and accessible to anyone with the link."
              >
                <Icon
                  name="world"
                  color={hidden ? "brand-neutral-2" : "brand-neutral-2"}
                />
              </div>
            )}
            {isInheritingFrom(environment, route) && (
              <div
                data-tooltip-id="top-tooltip"
                data-tooltip-content="This app is inheriting permissions from another app."
              >
                <Icon
                  name="stack"
                  color={hidden ? "brand-neutral-2" : "brand-neutral-2"}
                />
              </div>
            )}
            {isSharedViaEmail(environment, route) && (
              <div
                data-tooltip-id="top-tooltip"
                data-tooltip-content="This app is shared with external users via email."
              >
                <Icon
                  name="users"
                  color={hidden ? "brand-neutral-2" : "brand-neutral-2"}
                />
              </div>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setShareModalOpen(true);
              }}
            >
              <div className="text-sm text-brand-neutral-2 hover:text-brand-neutral">
                Share
              </div>
            </Button>
          </div>
        </div>
      </div>
      <ShareAppModal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
        }}
        refetchExternalUsers={() => {
          refetchEnvironment(environmentId);
        }}
        environmentId={environmentId}
        appRoute={route}
        environmentApps={environment.apps}
        externalUsers={externalUsersForApp}
      />
    </>
  );
}

export default AppRow;
