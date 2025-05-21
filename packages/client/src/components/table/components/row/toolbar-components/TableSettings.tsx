import Button from "~/components/button";
import Icon from "~/components/icon";
import { classNames } from "~/utils/classNames";
import { Popover } from "~/components/popover";
import { UI } from "@composehq/ts-public";
import RadioGroup from "~/components/radio-group";
import { Divider } from "~/components/divider";

function TableSettingsPanel({
  className = "",
  tableOverflow,
  setTableOverflow,
  resetTableOverflow,
  tableDensity,
  setTableDensity,
  resetTableDensity,
}: {
  className?: string;
  tableOverflow: UI.Table.OverflowBehavior;
  setTableOverflow: (overflow: UI.Table.OverflowBehavior) => void;
  resetTableOverflow: () => void;
  tableDensity: UI.Table.Density;
  setTableDensity: (density: UI.Table.Density) => void;
  resetTableDensity: () => void;
}) {
  const resetAllSettings = () => {
    resetTableOverflow();
    resetTableDensity();
  };

  return (
    <div
      className={classNames("flex flex-col space-y-4 max-w-full", className)}
    >
      <div className="flex flex-row items-center justify-between">
        <h5>Table settings</h5>
        <Button
          variant="ghost"
          className="text-sm text-brand-neutral-2 hover:text-brand-neutral"
          onClick={resetAllSettings}
        >
          Reset to default
        </Button>
      </div>

      <div className="flex flex-col gap-4 pb-2">
        <p className="text-sm text-brand-neutral-2 font-medium">
          Cell overflow
        </p>
        <RadioGroup
          options={[
            {
              label: "Ellipsis",
              value: UI.Table.OVERFLOW_BEHAVIOR.ELLIPSIS,
              description:
                "Truncate text that overflows the cell with an ellipsis",
            },
            {
              label: "Clip",
              value: UI.Table.OVERFLOW_BEHAVIOR.CLIP,
              description: "Clip any text that overflows the cell",
            },
            {
              label: "Dynamic",
              value: UI.Table.OVERFLOW_BEHAVIOR.DYNAMIC,
              description: "Expand the cell height to fit the content",
            },
          ]}
          value={tableOverflow}
          setValue={(value) =>
            setTableOverflow(value || UI.Table.OVERFLOW_BEHAVIOR.ELLIPSIS)
          }
          disabled={false}
          label={null}
        />
      </div>

      <Divider />

      <div className="flex flex-col gap-4">
        <p className="text-sm text-brand-neutral-2 font-medium">Density</p>
        <RadioGroup
          options={[
            {
              label: "Compact",
              value: UI.Table.DENSITY.COMPACT,
              description: "32px row height. Best for dense data.",
            },
            {
              label: "Standard",
              value: UI.Table.DENSITY.STANDARD,
              description: "40px row height. Best for most data.",
            },
            {
              label: "Comfortable",
              value: UI.Table.DENSITY.COMFORTABLE,
              description: "48px row height. Best for sparse data.",
            },
          ]}
          value={tableDensity}
          setValue={(value) =>
            setTableDensity(value || UI.Table.DENSITY.STANDARD)
          }
          disabled={false}
          label={null}
        />
      </div>
    </div>
  );
}

function TableSettingsPopover({
  tableOverflow,
  setTableOverflow,
  resetTableOverflow,
  tableDensity,
  setTableDensity,
  resetTableDensity,
}: {
  tableOverflow: UI.Table.OverflowBehavior;
  setTableOverflow: (overflow: UI.Table.OverflowBehavior) => void;
  resetTableOverflow: () => void;
  tableDensity: UI.Table.Density;
  setTableDensity: (density: UI.Table.Density) => void;
  resetTableDensity: () => void;
}) {
  const hasActiveSettings =
    tableOverflow !== UI.Table.OVERFLOW_BEHAVIOR.ELLIPSIS ||
    tableDensity !== UI.Table.DENSITY.STANDARD;

  return (
    <Popover.Root>
      <Popover.Trigger>
        <div
          data-tooltip-id="top-tooltip-offset4"
          data-tooltip-content="Table settings"
          data-tooltip-class-name="hidden sm:block"
        >
          <Icon
            name="settings"
            color={hasActiveSettings ? "brand-primary" : "brand-neutral-2"}
          />
        </div>
      </Popover.Trigger>
      <Popover.Panel>
        <TableSettingsPanel
          className="w-96"
          tableOverflow={tableOverflow}
          setTableOverflow={setTableOverflow}
          resetTableOverflow={resetTableOverflow}
          tableDensity={tableDensity}
          setTableDensity={setTableDensity}
          resetTableDensity={resetTableDensity}
        />
      </Popover.Panel>
    </Popover.Root>
  );
}

export { TableSettingsPopover };
