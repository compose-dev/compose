import {
  useHomeStore,
  type FormattedEnvironment,
} from "~/routes/home/utils/useHomeStore";
import { Page } from "../../components/page";
import { ConnectionStatusIndicator } from "~/components/connection-status-indicator";
import { toast } from "~/utils/toast";
import Button from "~/components/button";
import Icon from "~/components/icon";
import { m, u } from "@compose/ts";
import { useCallback, useMemo, useState } from "react";
import AppRow from "./AppRow";
import { InlineLink } from "~/components/inline-link";
import DropdownMenu from "~/components/dropdown-menu";
import DeleteEnvironmentModal from "./DeleteEnvironmentModal";
import RefreshApiKeyModal from "./RefreshApiKeyModal";
import { TextBubble } from "~/components/text-bubble";
import { ConnectionStatus } from "~/utils/wsContext";

function EnvironmentTypeBadge({ type }: { type: m.Environment.Type }) {
  if (type === m.Environment.TYPE.dev) {
    return (
      <div
        className="flex flex-row items-center gap-x-1 text-brand-warning text-sm"
        data-tooltip-id="top-tooltip"
        data-tooltip-content="This environment is meant for local development. It is only accessible to you."
      >
        <Icon name="code" color="brand-warning" />
        Development
      </div>
    );
  }

  if (type === m.Environment.TYPE.prod) {
    return (
      <div
        className="flex flex-row items-center gap-x-1 text-brand-primary text-sm"
        data-tooltip-id="top-tooltip"
        data-tooltip-content="This is a live environment that is accessible to everyone in your organization."
      >
        <Icon name="shield-check-filled" color="brand-primary" />
        Production
      </div>
    );
  }
}

export default function Environment({
  environment,
  refetchEnvironment,
  connectionStatus,
}: {
  environment: FormattedEnvironment;
  refetchEnvironment: (environmentId: string) => void;
  connectionStatus: Record<string, ConnectionStatus.Type>;
}) {
  const { addToast } = toast.useStore();
  const { user } = useHomeStore();
  const [showDeleteEnvironmentDialog, setShowDeleteEnvironmentDialog] =
    useState(false);
  const [showRefreshApiKeyDialog, setShowRefreshApiKeyDialog] = useState(false);

  const [showHiddenApps, setShowHiddenApps] = useState(false);

  const sortedApps = useMemo(() => {
    const apps = Object.values(environment.apps);
    const copy = [...apps];

    return copy.sort((a, b) => {
      return u.string.sortAlphabetically(a.name, b.name);
    });
  }, [environment.apps]);

  const hiddenSortedApps = useMemo(() => {
    return sortedApps.filter((app) => app.hidden === true);
  }, [sortedApps]);

  const visibleSortedApps = useMemo(() => {
    return sortedApps.filter((app) => !app.hidden);
  }, [sortedApps]);

  const copyApiKey = useCallback(() => {
    if (!environment.key) {
      addToast({
        title: "Blocked copy attempt",
        message:
          "For security reasons, you cannot copy the API key for production environments. If you've lost your API key, you can create a new one.",
        appearance: toast.APPEARANCE.error,
        duration: "long",
      });
      return;
    }

    navigator.clipboard.writeText(environment.key || "");
    addToast({
      message: "Copied API key to clipboard",
      appearance: toast.APPEARANCE.success,
    });
  }, [environment.key, addToast]);

  const actions = useMemo(() => {
    const actions: Parameters<typeof DropdownMenu>[0]["options"] = [
      {
        label: "Refresh API Key",
        left: <Icon name="refresh" color="brand-neutral" />,
        onClick: () => {
          if (
            environment.type === m.Environment.TYPE.prod &&
            !u.permission.isAllowed(
              u.permission.FEATURE.REFRESH_PRODUCTION_ENVIRONMENT_API_KEY,
              user?.permission
            )
          ) {
            addToast({
              title: "Blocked refresh attempt",
              message:
                "You do not have permission to refresh the API key for this environment. Please contact an administrator.",
              appearance: toast.APPEARANCE.error,
            });
            return;
          }
          setShowRefreshApiKeyDialog(true);
        },
      },
      {
        label: "Copy API key",
        left: <Icon name="copy" color="brand-neutral" />,
        onClick: () => copyApiKey(),
      },
    ];

    if (environment.type !== m.Environment.TYPE.dev) {
      actions.push({
        label: "Delete Environment",
        left: <Icon name="trash" color="brand-error" />,
        variant: "error",
        onClick: () => {
          if (
            !u.permission.isAllowed(
              u.permission.FEATURE.DELETE_PRODUCTION_ENVIRONMENT,
              user?.permission
            )
          ) {
            addToast({
              title: "Blocked delete attempt",
              message:
                "You do not have permission to delete this environment. Please contact an administrator.",
              appearance: toast.APPEARANCE.error,
            });
            return;
          }

          setShowDeleteEnvironmentDialog(true);
        },
      });
    }

    return actions;
  }, [environment.type, copyApiKey, user?.permission, addToast]);

  return (
    <div key={environment.id} className="flex flex-col gap-y-4 w-full">
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row items-start md:items-center justify-between gap-x-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-y-2 md:gap-x-4">
            <Page.Subtitle>{environment.name}</Page.Subtitle>
            <div className="flex flex-row items-center gap-x-2 md:gap-x-4">
              <EnvironmentTypeBadge type={environment.type} />
              <ConnectionStatusIndicator
                connectionStatus={
                  connectionStatus[environment.id] ||
                  ConnectionStatus.TYPE.BROWSER_CONNECTING
                }
              />
            </div>
          </div>
          <div className="flex flex-row items-center gap-x-2 mt-1 md:mt-0">
            <div className="hidden md:block">
              {environment.key && (
                <Button variant="outline" size="sm" onClick={copyApiKey}>
                  <Icon name="copy" color="brand-neutral" />
                  Copy API key
                </Button>
              )}
            </div>
            <DropdownMenu
              labelVariant="ghost"
              label={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {}}
                  className="flex flex-row items-center gap-x-2"
                >
                  Actions
                  <Icon name="chevron-down" color="brand-neutral" size="0.75" />
                </Button>
              }
              options={actions}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        {visibleSortedApps.map((app) => (
          <AppRow
            key={app.route}
            route={app.route}
            name={app.name}
            environmentId={environment.id}
            refetchEnvironment={() => refetchEnvironment(environment.id)}
          />
        ))}
        {hiddenSortedApps.length > 0 && (
          <div className="flex flex-col">
            <Button
              className="flex flex-row items-center justify-between hover:bg-brand-overlay cursor-pointer rounded-brand -mx-2 p-2"
              onClick={() => setShowHiddenApps(!showHiddenApps)}
              variant="ghost"
            >
              <div className="flex flex-row items-center space-x-2">
                <Icon name="eye-slash" color="brand-neutral-2" />
                <p className="text-brand-neutral-2">
                  {hiddenSortedApps.length} hidden{" "}
                  {hiddenSortedApps.length === 1 ? "app" : "apps"}
                </p>
              </div>
              <div className="mr-2">
                <Icon
                  name={showHiddenApps ? "chevron-up" : "chevron-down"}
                  color="brand-neutral-2"
                  size="0.75"
                />
              </div>
            </Button>
            {showHiddenApps &&
              hiddenSortedApps.map((app) => (
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
        {sortedApps.length === 0 && (
          <p className="text-brand-neutral-2">
            No apps found. Get going with the{" "}
            <InlineLink url="https://docs.composehq.com">
              quickstart guide
            </InlineLink>
            .
          </p>
        )}
        {showDeleteEnvironmentDialog && (
          <DeleteEnvironmentModal
            onClose={() => setShowDeleteEnvironmentDialog(false)}
            environment={environment}
          />
        )}
        {showRefreshApiKeyDialog && (
          <RefreshApiKeyModal
            onClose={() => setShowRefreshApiKeyDialog(false)}
            environment={environment}
          />
        )}
      </div>
      {user &&
        user.metadata["has-never-opened-app"] &&
        sortedApps.length > 0 && (
          <TextBubble caratDirection="up">
            💡 Click on an app to run it
          </TextBubble>
        )}
    </div>
  );
}
