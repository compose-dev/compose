import { Popover } from "~/components/popover";
import { useMemo } from "react";
import { m } from "@compose/ts";
import EnvironmentTypeBadge from "~/routes/home/components/environment-type-badge/EnvironmentTypeBadge";
import { useEnvironmentsQuery } from "~/utils/queries/useEnvironmentsQuery";
import Button from "~/components/button";
import { classNames } from "~/utils/classNames";
import PopoverTrigger from "./PopoverTrigger";

function AppChip({
  app,
  selectedApps,
  onSelect,
  onDeselect,
  viewOnly = false,
}: {
  app: {
    route: string;
    environmentId: string;
    name: string;
  };
  selectedApps: { route: string; environmentId: string }[];
  onSelect: (app: { route: string; environmentId: string }) => void;
  onDeselect: (app: { route: string; environmentId: string }) => void;
  viewOnly: boolean;
}) {
  const isSelected = selectedApps.some(
    (selectedApp) =>
      selectedApp.route === app.route &&
      selectedApp.environmentId === app.environmentId
  );

  return (
    <Button
      variant="ghost"
      className={classNames(
        "border border-brand-neutral rounded-brand p-2 py-1 flex flex-row gap-2 items-center hover:bg-brand-overlay transition-colors text-sm",
        {
          "bg-brand-primary-subtle text-brand-primary-heavy border-brand-primary-light":
            isSelected,
          "bg-transparent text-brand-neutral-2": !isSelected,
        }
      )}
      onClick={() => {
        if (isSelected) {
          onDeselect(app);
        } else {
          onSelect(app);
        }
      }}
      disabled={viewOnly}
    >
      {app.name}
    </Button>
  );
}

function AppsPickerPopover({
  environments,
  selectedApps,
  setSelectedApps,
  disabled,
  includeDevLogs,
  includeProdLogs,
  viewOnly = false,
}: {
  environments: ReturnType<typeof useEnvironmentsQuery>["data"];
  selectedApps: {
    route: string;
    environmentId: string;
  }[];
  setSelectedApps: (apps: { route: string; environmentId: string }[]) => void;
  disabled: boolean;
  includeDevLogs: boolean;
  includeProdLogs: boolean;
  viewOnly: boolean;
}) {
  const allApps = useMemo(() => {
    if (!environments) {
      return [];
    }

    return environments.environments.flatMap((environment) =>
      environment.apps.map((app) => ({
        route: app.route,
        environmentId: environment.id,
        name: app.name,
        environmentName: environment.name,
      }))
    );
  }, [environments]);

  const sortedEnvironments = useMemo(() => {
    if (!environments) {
      return [];
    }

    return environments.environments
      .filter((environment) => {
        if (includeDevLogs && environment.type === m.Environment.TYPE.dev) {
          return true;
        }

        if (includeProdLogs && environment.type === m.Environment.TYPE.prod) {
          return true;
        }

        return false;
      })
      .sort((a, b) => {
        if (
          a.type === m.Environment.TYPE.prod &&
          b.type !== m.Environment.TYPE.prod
        ) {
          return -1;
        }

        if (
          a.type !== m.Environment.TYPE.prod &&
          b.type === m.Environment.TYPE.prod
        ) {
          return 1;
        }

        return a.name.localeCompare(b.name);
      });
  }, [environments, includeDevLogs, includeProdLogs]);

  const popoverTriggerLabel = useMemo(() => {
    if (selectedApps.length === allApps.length || selectedApps.length === 0) {
      return "All Apps";
    }
    if (selectedApps.length === 1) {
      const app = allApps.find(
        (app) =>
          app.route === selectedApps[0].route &&
          app.environmentId === selectedApps[0].environmentId
      );
      return app ? app.name : "Unknown App";
    }
    return `${selectedApps.length} Apps`;
  }, [allApps, selectedApps]);

  return (
    <Popover.Root>
      <PopoverTrigger
        label={popoverTriggerLabel}
        icon="bolt"
        viewOnly={viewOnly}
      />
      <Popover.Panel anchor="bottom start">
        <div className="flex flex-col gap-4 w-full min-w-32 max-w-xl">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center justify-between">
              <h5>Apps</h5>
              <Button
                variant="bare-secondary"
                size="sm"
                onClick={() => setSelectedApps([])}
                disabled={disabled || selectedApps.length === 0 || viewOnly}
              >
                Reset to all apps
              </Button>
            </div>
            <p className="text-brand-neutral-2 text-sm/6">
              Filter logs based on the apps from which they originated.
              Currently showing logs from{" "}
              {selectedApps.length === 0
                ? "all apps"
                : selectedApps.length === 1
                  ? "1 app"
                  : `${selectedApps.length} apps`}
            </p>
          </div>
          <div className="flex flex-col gap-8">
            {sortedEnvironments.map((environment) => (
              <div key={environment.id} className="flex flex-col gap-4">
                <div className="flex flex-row gap-4 items-center">
                  <h6>{environment.name}</h6>
                  <EnvironmentTypeBadge type={environment.type} />
                </div>
                <div className="flex flex-row gap-2 flex-wrap">
                  {environment.apps.map((app) => (
                    <AppChip
                      key={app.route}
                      app={{
                        route: app.route,
                        environmentId: environment.id,
                        name: app.name,
                      }}
                      selectedApps={selectedApps}
                      onSelect={(app) => {
                        setSelectedApps([...selectedApps, app]);
                      }}
                      onDeselect={(app) => {
                        setSelectedApps(
                          selectedApps.filter(
                            (selectedApp) =>
                              !(
                                selectedApp.route === app.route &&
                                selectedApp.environmentId === app.environmentId
                              )
                          )
                        );
                      }}
                      viewOnly={viewOnly}
                    />
                  ))}
                  {environment.apps.length === 0 && (
                    <p className="text-brand-neutral-2 text-sm">
                      No apps found in this environment.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Popover.Panel>
    </Popover.Root>
  );
}

export default AppsPickerPopover;
