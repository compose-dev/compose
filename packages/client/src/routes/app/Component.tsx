import { UI } from "@composehq/ts-public";

import Button from "~/components/button";

import { classNames } from "~/utils/classNames";
import { appStore } from "~/utils/appStore";

import { IOComponent } from "~/components/io-component";
import { useErrorMessage, useTransferFiles } from "./utils";
import InputInteractionComponent from "./InputInteractionComponent";
import DisplayInteractionComponent from "./DisplayInteractionComponent";
import { BrowserToServerEvent } from "@compose/ts";
import { useWSContext } from "~/utils/wsContext";
import { BarChart } from "~/components/chart/bar-chart";
import { useShallow } from "zustand/react/shallow";

const DEFAULT_SPACING = "16px";
const NEGATIVE_DEFAULT_SPACING = `-${DEFAULT_SPACING}`;

function Component({
  renderId,
  componentId,
  environmentId,
}: {
  renderId: string;
  componentId: string;
  environmentId: string | null;
}) {
  const { sendWSJsonMessage } = useWSContext();

  const executionId = appStore.use((state) => state.executionId);
  const component = appStore.use(
    (state) => state.flattenedModel[renderId][componentId]
  );
  const componentOutput = appStore.use(
    (state) => state.flattenedOutput[renderId][componentId]
  );
  const dispatch = appStore.use((state) => state.dispatch);
  const getFormData = appStore.use((state) => state.getFormData);

  const { transferFiles } = useTransferFiles(environmentId, executionId);

  const componentWidthStyles = appStore.use(
    useShallow((state) => {
      const style = state.flattenedModel[renderId][componentId].model.style;

      if (!style) {
        return {};
      } else {
        return {
          width: style.width || "auto",
          minWidth: style.minWidth || "auto",
          maxWidth: style.maxWidth || "auto",
        };
      }
    })
  );

  const componentNonWidthStyles = appStore.use(
    useShallow((state) => {
      const style = state.flattenedModel[renderId][componentId].model.style;

      if (!style) {
        return {};
      } else {
        return {
          ...style,
          width: undefined,
          minWidth: undefined,
          maxWidth: undefined,
        };
      }
    })
  );

  const componentStyles = component.model.style ?? undefined;
  const useDefaultWidth =
    componentStyles === undefined || "width" in componentStyles === false;
  const useDefaultHeight =
    componentStyles === undefined || "height" in componentStyles === false;
  const useDefaultMarginTop =
    componentStyles === undefined || "marginTop" in componentStyles === false;

  const errorMessage = useErrorMessage(componentOutput);

  function onClickHook(componentId: string) {
    if (!executionId || !environmentId) {
      return;
    }

    sendWSJsonMessage(
      {
        type: BrowserToServerEvent.WS.TYPE.ON_CLICK_HOOK,
        componentId,
        executionId,
        renderId,
      },
      environmentId
    );
  }

  async function onSubmitFormHook() {
    if (!executionId || !environmentId) {
      return;
    }

    if (component.type !== UI.TYPE.LAYOUT_FORM || component.formId === null) {
      return;
    }

    dispatch({
      type: appStore.EVENT_TYPE.SHOW_FORM_LOCAL_ERRORS,
      properties: { formId: component.formId, renderId },
    });

    // Check that the form actually has an onSubmit hook
    // before we try to submit the form
    if (component.model.properties.hasOnSubmitHook === false) {
      return;
    }

    const form = getFormData(component.formId, renderId);

    if (form.hasLocalErrors) {
      return;
    }

    dispatch({
      type: appStore.EVENT_TYPE.REMOVE_FORM_REMOTE_ERRORS,
      properties: { formId: component.formId, renderId },
    });

    for (const input of form.components) {
      if (
        input.output.type === UI.TYPE.INPUT_FILE_DROP &&
        input.output.output.networkTransferValue.length > 0
      ) {
        await transferFiles(input.output);
      }
    }

    sendWSJsonMessage(
      {
        type: BrowserToServerEvent.WS.TYPE.ON_SUBMIT_FORM_HOOK,
        formComponentId: component.formId,
        executionId,
        renderId,
        formData: form.networkTransferValuesById,
      },
      environmentId
    );
  }

  if (component.type === UI.TYPE.DISPLAY_NONE) {
    return null;
  }

  if (component.interactionType === UI.INTERACTION_TYPE.LAYOUT) {
    const children = Array.isArray(component.model.children)
      ? component.model.children
      : [component.model.children];

    const direction = component.model.direction || "vertical";
    const justify = component.model.justify || "start";
    const align = component.model.align || "start";

    // The component is not responsive only if the responsive property is
    // explicitly set to false. All other cases (undefined, null, true) are
    // assumed to be responsive.
    const responsive = !(component.model.responsive === false);
    const isResponsiveForwardRow = direction === "horizontal" && responsive;
    const isResponsiveReverseRow =
      direction === "horizontal-reverse" && responsive;
    const isResponsiveRow = isResponsiveForwardRow || isResponsiveReverseRow;

    const className = classNames("flex c-container max-w-full w-full", {
      /*********************
       * BASE CLASSES
       *********************/
      "c-manual-width": !useDefaultWidth,
      "c-manual-height": !useDefaultHeight,
      card: component.model.appearance === UI.LayoutAppearance.TYPE.CARD,

      /*********************
       * DIRECTION CLASSES
       *********************/
      // Non-responsive rows are always horizontal
      "flex-row c-row": direction === "horizontal" && !responsive,
      "flex-row-reverse c-row":
        direction === "horizontal-reverse" && !responsive,
      // Stacks are always vertical. Responsive rows are vertical on mobile.
      "flex-col c-stack": direction === "vertical" || isResponsiveForwardRow,
      "flex-col-reverse c-stack":
        direction === "vertical-reverse" || isResponsiveReverseRow,
      // Responsive rows are horizontal on tablet and desktop.
      "sm:flex-row sm:c-row": isResponsiveForwardRow,
      "sm:flex-row-reverse sm:c-row": isResponsiveReverseRow,

      /*********************
       * JUSTIFY CLASSES
       *********************/
      "justify-center": justify === "center",
      "justify-start": justify === "start",
      "justify-end": justify === "end",
      "justify-between": justify === "between",
      "justify-around": justify === "around",
      "justify-evenly": justify === "evenly",

      /*********************
       * ALIGN CLASSES
       *********************/
      // Responsive row layout switch to start alignment on mobile.
      "items-start": align === "start" || isResponsiveRow,
      // Switch back to normal alignment on tablet and desktop for responsive row layouts.
      "sm:items-center": align === "center" && isResponsiveRow,
      "sm:items-end": align === "end" && isResponsiveRow,
      "sm:items-baseline": align === "baseline" && isResponsiveRow,
      "sm:items-stretch": align === "stretch" && isResponsiveRow,
      // Horizontal layouts that are non-responsive should always respect the alignment.
      "items-center": align === "center" && !isResponsiveRow,
      "items-end": align === "end" && !isResponsiveRow,
      "items-baseline": align === "baseline" && !isResponsiveRow,
      "items-stretch": align === "stretch" && !isResponsiveRow,
    });

    const getChildren = (
      <>
        {children.map((child, idx) => (
          <Component
            key={`${child.type}-${idx}`}
            renderId={renderId}
            componentId={child.model.id}
            environmentId={environmentId}
          />
        ))}
        {errorMessage !== null && (
          <div
            // Correct for the spacing that's applied by the layout component.
            // That spacing is meant to be between child components, but not
            // the final error message.
            style={{
              marginTop:
                component.model.direction === "vertical"
                  ? `-${component.model.spacing}` || NEGATIVE_DEFAULT_SPACING
                  : undefined,
              marginBottom:
                component.model.direction === "vertical-reverse"
                  ? `-${component.model.spacing}` || NEGATIVE_DEFAULT_SPACING
                  : undefined,
              paddingBottom:
                component.model.direction === "vertical-reverse"
                  ? "0.25rem"
                  : undefined,
              marginLeft:
                component.model.direction === "horizontal"
                  ? `-${component.model.spacing}` || NEGATIVE_DEFAULT_SPACING
                  : undefined,
              paddingLeft:
                component.model.direction === "horizontal"
                  ? DEFAULT_SPACING
                  : undefined,
              marginRight:
                component.model.direction === "horizontal-reverse"
                  ? `-${component.model.spacing}` || undefined
                  : undefined,
              paddingRight:
                component.model.direction === "horizontal-reverse"
                  ? DEFAULT_SPACING
                  : undefined,
            }}
          >
            <IOComponent.Error>{errorMessage}</IOComponent.Error>
          </div>
        )}
      </>
    );

    if (component.type === UI.TYPE.LAYOUT_FORM) {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitFormHook();
          }}
          className={className}
          style={{
            gap: component.model.spacing || DEFAULT_SPACING,
            ...componentStyles,
          }}
        >
          {getChildren}
        </form>
      );
    }

    return (
      <div
        className={className}
        style={{
          gap: component.model.spacing || DEFAULT_SPACING,
          ...componentStyles,
        }}
      >
        {getChildren}
      </div>
    );
  }

  if (component.interactionType === UI.INTERACTION_TYPE.INPUT) {
    const inputBoxComponent = UI.InputComponentTypes.isBoxComponent(
      component.type
    );

    const overflowComponent = component.type === UI.TYPE.INPUT_TABLE;

    return (
      <div
        className={classNames("animate-slide-fade-in", {
          "max-w-md c-input-box": inputBoxComponent && useDefaultWidth,
          "max-w-full c-full-width": !inputBoxComponent && useDefaultWidth,
          "flex-shrink-0": !useDefaultWidth,
          "c-manual-width": !useDefaultWidth,
          "c-manual-height": !useDefaultHeight,
          "overflow-x-auto": overflowComponent,
        })}
        style={{
          ...componentStyles,
          height:
            // - Table directly controls it's height since rows are scrollable.
            // - Text area directly controls it's height since it's resizable.
            // Hence, we set height auto here and handle the height deeper in
            // the tree.
            component.type === UI.TYPE.INPUT_TABLE ||
            component.type === UI.TYPE.INPUT_TEXT_AREA ||
            component.type === UI.TYPE.INPUT_JSON
              ? "auto"
              : componentStyles?.height || "auto",
          // text area also sets the min and max height properties directly.
          minHeight:
            component.type === UI.TYPE.INPUT_TEXT_AREA ||
            component.type === UI.TYPE.INPUT_JSON
              ? "auto"
              : componentStyles?.minHeight || "auto",
          maxHeight:
            component.type === UI.TYPE.INPUT_TEXT_AREA ||
            component.type === UI.TYPE.INPUT_JSON
              ? "auto"
              : componentStyles?.maxHeight || "auto",
        }}
      >
        <InputInteractionComponent
          componentId={componentId}
          renderId={renderId}
          environmentId={environmentId}
          errorMessage={errorMessage}
        />
      </div>
    );
  }

  if (component.interactionType === UI.INTERACTION_TYPE.DISPLAY) {
    const fullWidthComponent =
      component.type === UI.TYPE.DISPLAY_CODE ||
      component.type === UI.TYPE.DISPLAY_JSON ||
      component.type === UI.TYPE.DISPLAY_MARKDOWN ||
      component.type === UI.TYPE.DISPLAY_PDF ||
      component.type === UI.TYPE.DISPLAY_STATISTIC ||
      (component.type === UI.TYPE.DISPLAY_DIVIDER &&
        component.model.properties.orientation !== "vertical");

    const overflowComponent =
      component.type === UI.TYPE.DISPLAY_CODE ||
      component.type === UI.TYPE.DISPLAY_JSON;

    return (
      <div
        className={classNames("animate-slide-fade-in", {
          "mt-4":
            component.type === UI.TYPE.DISPLAY_HEADER && !useDefaultMarginTop,
          "c-full-width self-stretch": useDefaultWidth && fullWidthComponent,
          "flex-shrink-0": !useDefaultWidth,
          "c-manual-height": !useDefaultHeight,
          "c-manual-width": !useDefaultWidth,
          "overflow-x-auto": overflowComponent,
          "self-stretch":
            component.type === UI.TYPE.DISPLAY_DIVIDER &&
            component.model.properties.orientation === "vertical",
        })}
        style={
          // Eventually we'll want to transition to the new "componentWidthStyles"
          // format for all components.
          component.type === UI.TYPE.DISPLAY_STATISTIC
            ? componentWidthStyles
            : componentStyles
        }
      >
        <DisplayInteractionComponent
          componentId={componentId}
          renderId={renderId}
        />
      </div>
    );
  }

  if (component.type === UI.TYPE.BUTTON_BAR_CHART) {
    const isEmpty = component.model.properties.data.length === 0;
    return (
      <div
        className={classNames("animate-slide-fade-in c-full-width", {
          "self-stretch": useDefaultWidth,
          "flex-shrink-0": !useDefaultWidth,
          "c-manual-height": !useDefaultHeight,
          "c-manual-width": !useDefaultWidth,
        })}
        style={{
          ...componentStyles,
          minHeight:
            componentStyles?.minHeight || componentStyles?.height || "28rem",
          height: componentStyles?.height || "28rem",
        }}
      >
        <BarChart
          data={component.model.properties.data}
          keys={
            isEmpty
              ? []
              : Object.keys(component.model.properties.data[0]).filter(
                  (key) => key !== UI.Chart.LABEL_SERIES_KEY
                )
          }
          indexBy={UI.Chart.LABEL_SERIES_KEY}
          label={component.model.properties.label}
          description={component.model.properties.description}
          orientation={component.model.properties.orientation}
          groupMode={component.model.properties.groupMode}
          scale={component.model.properties.scale}
        />
      </div>
    );
  }

  if (component.interactionType === UI.INTERACTION_TYPE.BUTTON) {
    if (component.type === UI.TYPE.BUTTON_LINE_CHART) {
      return null;
    }

    return (
      <div
        className="animate-slide-fade-in min-w-fit"
        style={componentWidthStyles}
      >
        <Button
          onClick={() => {
            if (component.model.properties.hasOnClickHook) {
              onClickHook(componentId);
            }
          }}
          variant={component.model.properties.appearance || "primary"}
          type={
            component.type === UI.TYPE.BUTTON_FORM_SUBMIT ? "submit" : "button"
          }
          style={componentNonWidthStyles}
          className={classNames({
            "w-full": !useDefaultWidth,
          })}
        >
          {component.model.properties.label || "\u00A0"}
        </Button>
      </div>
    );
  }

  return null;
}

export default Component;
