import { classNames } from "~/utils/classNames";
import Button from "~/components/button";
import DropdownMenu from "~/components/dropdown-menu";
import Icon from "~/components/icon";
import { UI } from "@composehq/ts-public";

function TableActionCell({
  actions,
  hidden = false,
  onClick,
  density,
}: {
  actions: NonNullable<
    UI.Components.InputTable["model"]["properties"]["actions"]
  >;
  hidden?: boolean;
  onClick: (actionIdx: number) => void;
  density: UI.Table.Density;
}) {
  const buttons = [];
  const menuItems = [];

  // If there's only one action, we default to a button, unless they
  // explicitly set the surface prop to false
  if (actions.length === 1) {
    if (actions[0].surface !== false) {
      buttons.push(0);
    } else {
      menuItems.push(0);
    }
  }

  // If there's more than one action, we default to a dropdown menu, unless
  // they explicitly set the surface prop to true
  if (actions.length > 1) {
    for (const [idx, action] of actions.entries()) {
      if (action.surface === true) {
        buttons.push(idx);
      } else {
        menuItems.push(idx);
      }
    }
  }

  return (
    <div
      className={classNames("flex items-start gap-2", {
        "h-[22px]": density === "compact",
        "h-[26px]": density !== "compact",
        // Essentially a hack to make the header row have the same width as the data rows.
        // We render the actions in the header too but just make it invisible, so that the
        // header row has the same width as the data rows.
        "pointer-events-none !h-1 invisible": hidden,
      })}
    >
      {buttons.map((button, idx) => (
        <Button
          key={idx}
          onClick={() => onClick(button)}
          variant={actions[button].appearance || "outline"}
          size={density === "compact" ? "xs" : "sm"}
          className={classNames("whitespace-nowrap max-h-fit", {
            // Need to set font-normal to override the font-medium set in the header column.
            "!bg-brand-io hover:!bg-brand-page-inverted-5 !font-normal":
              actions[button].appearance === "outline" ||
              !actions[button].appearance,
            "border-transparent border":
              !!actions[button].appearance &&
              actions[button].appearance !== "outline",
          })}
        >
          {actions[button].label}
        </Button>
      ))}
      {menuItems.length > 0 && (
        <DropdownMenu
          label={
            <Icon
              name="dots-vertical"
              color="brand-neutral-2"
              size={density === "compact" ? "1" : "1.25"}
            />
          }
          labelVariant="ghost"
          options={menuItems.map((item) => ({
            label: actions[item].label,
            onClick: () => onClick(item),
            variant: actions[item].appearance
              ? actions[item].appearance === "outline"
                ? "neutral"
                : actions[item].appearance === "danger"
                  ? "error"
                  : actions[item].appearance
              : "neutral",
          }))}
          className="h-full items-center"
        />
      )}
    </div>
  );
}

export default TableActionCell;
