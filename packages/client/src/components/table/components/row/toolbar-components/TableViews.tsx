import { UI } from "@composehq/ts-public";
import Button from "~/components/button";
import Icon from "~/components/icon";
import { Popover } from "~/components/popover";
import * as Toolbar from "./Toolbar";
import { Views } from "~/components/table/utils";
import { FormattedTableRow } from "~/components/table/utils/constants";
import { classNames } from "~/utils/classNames";

function ViewRow({
  view,
  isActiveView,
  onClick,
  disabled,
  isViewDirty,
}: {
  view: UI.Table.ViewInternal<FormattedTableRow[]>;
  isActiveView: boolean;
  onClick: () => void;
  disabled: boolean;
  isViewDirty: boolean;
}) {
  return (
    <div
      className={classNames(
        "flex flex-col gap-y-2 hover:bg-brand-page-inverted-5 transition-colors duration-100 cursor-pointer rounded-brand p-2 py-4 -mx-2",
        {
          "opacity-50 cursor-not-allowed pointer-events-none": disabled,
        }
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-y-1">
        <div className="flex flex-row justify-between">
          <p>{view.label}</p>
          {isActiveView && (
            <div className="flex flex-row items-center gap-x-1">
              <Icon
                name="checkmark"
                color={isViewDirty ? "brand-warning" : "brand-primary"}
                size="0.75"
              />
              <p
                className={classNames("text-sm", {
                  "text-brand-primary": !isViewDirty,
                  "text-brand-warning": isViewDirty,
                })}
              >
                Active {isViewDirty ? " (with changes)" : ""}
              </p>
            </div>
          )}
        </div>
        {view.description && (
          <p className="text-sm text-brand-neutral-2">{view.description}</p>
        )}
      </div>
    </div>
  );
}

function TableViewsPanel({
  views,
  activeDisplayView,
  setActiveView,
  resetActiveView,
  className = "",
  loading,
  isViewDirty,
}: {
  views: UI.Table.ViewInternal<FormattedTableRow[]>[];
  activeDisplayView: Views.ViewDisplayFormat;
  setActiveView: (view: Views.ViewDisplayFormat) => void;
  resetActiveView: () => void;
  className?: string;
  loading: UI.Stale.Option;
  isViewDirty: boolean;
}) {
  return (
    <div className={classNames("flex flex-col space-y-4", className)}>
      <div className="flex justify-between items-center">
        <Toolbar.Header loading={loading}>Views</Toolbar.Header>
        <div className="flex flex-row gap-x-2">
          <Button
            variant="ghost"
            className="text-sm text-brand-neutral-2 hover:text-brand-neutral"
            onClick={resetActiveView}
            disabled={loading === UI.Stale.OPTION.UPDATE_DISABLED}
          >
            Reset to default
          </Button>
        </div>
      </div>
      <div className="flex flex-col">
        {views.map((view, idx) => (
          <div
            className="border-b border-brand-neutral last:border-0"
            key={idx}
          >
            <ViewRow
              view={view}
              isActiveView={activeDisplayView === view.key}
              isViewDirty={isViewDirty}
              onClick={() => {
                setActiveView(view.key);
              }}
              disabled={loading === UI.Stale.OPTION.UPDATE_DISABLED}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TableViewsPopover({
  views,
  activeDisplayView,
  setActiveView,
  resetActiveView,
  loading,
  isViewDirty,
}: {
  views: UI.Table.ViewInternal<FormattedTableRow[]>[];
  activeDisplayView: Views.ViewDisplayFormat;
  setActiveView: (view: Views.ViewDisplayFormat) => void;
  resetActiveView: () => void;
  loading: UI.Stale.Option;
  isViewDirty: boolean;
}) {
  function getTooltipContent() {
    return "Set a table view";
  }

  const hasActiveSettings =
    activeDisplayView !== undefined &&
    activeDisplayView !== Views.NO_VIEW_APPLIED_KEY;

  const toolbarLabel =
    activeDisplayView && activeDisplayView !== Views.NO_VIEW_APPLIED_KEY
      ? views.find((view) => view.key === activeDisplayView)?.label
      : "Views";

  return (
    <Popover.Root>
      <Popover.Trigger>
        <div
          data-tooltip-id="top-tooltip-offset4"
          data-tooltip-content={getTooltipContent()}
          data-tooltip-class-name="hidden sm:block"
          className="flex flex-row items-center space-x-2"
        >
          <p
            className={classNames("text-sm", {
              "text-brand-primary": hasActiveSettings && !isViewDirty,
              "text-brand-warning": hasActiveSettings && isViewDirty,
              "text-brand-neutral-2": !hasActiveSettings,
            })}
          >
            {toolbarLabel}
            {isViewDirty ? "*" : ""}
          </p>
          <Icon
            name="chevron-down"
            color={
              hasActiveSettings
                ? isViewDirty
                  ? "brand-warning"
                  : "brand-primary"
                : "brand-neutral-2"
            }
            size="0.75"
          />
        </div>
      </Popover.Trigger>
      <Popover.Panel>
        <TableViewsPanel
          views={views}
          activeDisplayView={activeDisplayView}
          isViewDirty={isViewDirty}
          setActiveView={setActiveView}
          resetActiveView={resetActiveView}
          className="w-96"
          loading={loading}
        />
      </Popover.Panel>
    </Popover.Root>
  );
}

export { TableViewsPopover };
