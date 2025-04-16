import { v4 as uuid } from "uuid";

import * as UI from "../ui";
import { BaseWithDisplayInteraction } from "./base";

interface DisplayTextProperties extends BaseWithDisplayInteraction {
  text: UI.Components.DisplayText["model"]["properties"]["text"];
  color: UI.Components.DisplayText["model"]["properties"]["color"];
  size: UI.Components.DisplayText["model"]["properties"]["size"];
}

type RequiredTextFields = "text" | "id";
type OptionalTextProperties = Omit<DisplayTextProperties, RequiredTextFields>;

function displayText(
  text: DisplayTextProperties["text"],
  properties: Partial<OptionalTextProperties> = {}
): UI.OutputOmittedComponents.DisplayText {
  const id = uuid();

  return {
    model: {
      id,
      style: properties.style || null,
      properties: {
        text,
        ...{ color: properties.color, size: properties.size },
      },
    },
    hooks: null,
    type: UI.TYPE.DISPLAY_TEXT,
    interactionType: UI.INTERACTION_TYPE.DISPLAY,
  };
}

interface DisplayHeaderProperties extends BaseWithDisplayInteraction {
  text: UI.Components.DisplayHeader["model"]["properties"]["text"];
  color: UI.Components.DisplayHeader["model"]["properties"]["color"];
  size: UI.Components.DisplayHeader["model"]["properties"]["size"];
}

type RequiredHeaderFields = "text" | "id";
type OptionalHeaderProperties = Omit<
  DisplayHeaderProperties,
  RequiredHeaderFields
>;

function displayHeader(
  text: DisplayHeaderProperties["text"],
  properties: Partial<OptionalHeaderProperties> = {}
): UI.OutputOmittedComponents.DisplayHeader {
  const id = uuid();

  return {
    model: {
      id,
      style: properties.style || null,
      properties: {
        text,
        ...{
          color: properties.color,
          size: properties.size,
        },
      },
    },
    hooks: null,
    type: UI.TYPE.DISPLAY_HEADER,
    interactionType: UI.INTERACTION_TYPE.DISPLAY,
  };
}

interface DisplayJsonProperties extends BaseWithDisplayInteraction {
  json: UI.Components.DisplayJson["model"]["properties"]["json"];
  label: UI.Components.DisplayJson["model"]["properties"]["label"];
  description: UI.Components.DisplayJson["model"]["properties"]["description"];
}

type RequiredDisplayJsonFields = "json" | "id";
type OptionalDisplayJsonProperties = Omit<
  DisplayJsonProperties,
  RequiredDisplayJsonFields
>;

const defaultJsonProperties: OptionalDisplayJsonProperties = {
  label: null,
  description: null,
  style: null,
};

function displayJson(
  json: DisplayJsonProperties["json"],
  properties: Partial<OptionalDisplayJsonProperties> = {}
): UI.OutputOmittedComponents.DisplayJson {
  const id = uuid();

  const mergedProperties = { json, ...defaultJsonProperties, ...properties };

  return {
    model: {
      id,
      style: mergedProperties.style,
      properties: {
        label: mergedProperties.label,
        description: mergedProperties.description,
        json: mergedProperties.json,
      },
    },
    hooks: null,
    type: UI.TYPE.DISPLAY_JSON,
    interactionType: UI.INTERACTION_TYPE.DISPLAY,
  };
}

interface DisplaySpinnerProperties extends BaseWithDisplayInteraction {
  text: UI.Components.DisplaySpinner["model"]["properties"]["text"];
}

type RequiredDisplaySpinnerFields = "id";
type OptionalDisplaySpinnerProperties = Omit<
  DisplaySpinnerProperties,
  RequiredDisplaySpinnerFields
>;

const defaultSpinnerProperties: OptionalDisplaySpinnerProperties = {
  text: null,
  style: null,
};

function displaySpinner(
  properties: Partial<OptionalDisplaySpinnerProperties> = {}
): UI.OutputOmittedComponents.DisplaySpinner {
  const id = uuid();

  const mergedProperties = { ...defaultSpinnerProperties, ...properties };

  return {
    model: {
      id,
      style: mergedProperties.style,
      properties: {
        text: mergedProperties.text,
      },
    },
    hooks: null,
    type: UI.TYPE.DISPLAY_SPINNER,
    interactionType: UI.INTERACTION_TYPE.DISPLAY,
  };
}

interface DisplayCodeProperties extends BaseWithDisplayInteraction {
  code: UI.Components.DisplayCode["model"]["properties"]["code"];
  label: UI.Components.DisplayCode["model"]["properties"]["label"];
  description: UI.Components.DisplayCode["model"]["properties"]["description"];
  lang: UI.Components.DisplayCode["model"]["properties"]["lang"];
}

type RequiredDisplayCodeFields = "code" | "id";
type OptionalDisplayCodeProperties = Omit<
  DisplayCodeProperties,
  RequiredDisplayCodeFields
>;

function displayCode(
  code: DisplayCodeProperties["code"],
  properties: Partial<OptionalDisplayCodeProperties> = {}
): UI.OutputOmittedComponents.DisplayCode {
  const id = uuid();

  return {
    model: {
      id,
      style: properties.style || null,
      properties: {
        code,
        ...{
          label: properties.label,
          description: properties.description,
          lang: properties.lang,
        },
      },
    },
    hooks: null,
    type: UI.TYPE.DISPLAY_CODE,
    interactionType: UI.INTERACTION_TYPE.DISPLAY,
  };
}

interface DisplayImageProperties extends BaseWithDisplayInteraction {
  src: UI.Components.DisplayImage["model"]["properties"]["src"];
}

type RequiredDisplayImageFields = "src" | "id";
type OptionalDisplayImageProperties = Omit<
  DisplayImageProperties,
  RequiredDisplayImageFields
>;

const defaultImageProperties: OptionalDisplayImageProperties = {
  style: null,
};

function displayImage(
  src: DisplayImageProperties["src"],
  properties: Partial<OptionalDisplayImageProperties> = {}
): UI.OutputOmittedComponents.DisplayImage {
  const id = uuid();

  const mergedProperties = { ...defaultImageProperties, ...properties };

  return {
    model: {
      id,
      style: mergedProperties.style,
      properties: {
        src,
      },
    },
    hooks: null,
    type: UI.TYPE.DISPLAY_IMAGE,
    interactionType: UI.INTERACTION_TYPE.DISPLAY,
  };
}

interface DisplayMarkdownProperties extends BaseWithDisplayInteraction {
  markdown: UI.Components.DisplayMarkdown["model"]["properties"]["markdown"];
}

type RequiredDisplayMarkdownFields = "markdown" | "id";
type OptionalDisplayMarkdownProperties = Omit<
  DisplayMarkdownProperties,
  RequiredDisplayMarkdownFields
>;

const defaultMarkdownProperties: OptionalDisplayMarkdownProperties = {
  style: null,
};

function displayMarkdown(
  markdown: DisplayMarkdownProperties["markdown"],
  properties: Partial<OptionalDisplayMarkdownProperties> = {}
): UI.OutputOmittedComponents.DisplayMarkdown {
  const id = uuid();

  const mergedProperties = { ...defaultMarkdownProperties, ...properties };

  return {
    model: {
      id,
      style: mergedProperties.style,
      properties: {
        markdown,
      },
    },
    hooks: null,
    type: UI.TYPE.DISPLAY_MARKDOWN,
    interactionType: UI.INTERACTION_TYPE.DISPLAY,
  };
}

interface DisplayPdfProperties extends BaseWithDisplayInteraction {
  file: Buffer;
  label: UI.Components.DisplayPdf["model"]["properties"]["label"];
  description: UI.Components.DisplayPdf["model"]["properties"]["description"];
  annotations: UI.Components.DisplayPdf["model"]["properties"]["annotations"];
  scroll: UI.Components.DisplayPdf["model"]["properties"]["scroll"];
}

type RequiredDisplayPdfFields = "file" | "id";
type OptionalDisplayPdfProperties = Omit<
  DisplayPdfProperties,
  RequiredDisplayPdfFields
>;

function displayPdf(
  file: DisplayPdfProperties["file"],
  properties: Partial<OptionalDisplayPdfProperties> = {}
): UI.OutputOmittedComponents.DisplayPdf {
  const id = uuid();

  if (!(file instanceof Buffer)) {
    throw new Error("File must be a Buffer");
  }

  const base64File = `data:application/pdf;base64,${file.toString("base64")}`;

  return {
    model: {
      id,
      style: properties.style || null,
      properties: {
        base64: base64File,
        ...{
          label: properties.label,
          description: properties.description,
          annotations: properties.annotations,
          scroll: properties.scroll,
        },
      },
    },
    hooks: null,
    type: UI.TYPE.DISPLAY_PDF,
    interactionType: UI.INTERACTION_TYPE.DISPLAY,
  };
}

interface DisplayDividerProperties extends BaseWithDisplayInteraction {
  /**
   * The orientation of the divider. Options:
   * - `horizontal`
   * - `vertical`
   *
   * @default "horizontal"
   */
  orientation: UI.Components.DisplayDivider["model"]["properties"]["orientation"];
  /**
   * The thickness of the divider. Options:
   * - `thin` (1px)
   * - `medium` (2px)
   * - `thick` (4px)
   *
   * @default "thin"
   */
  thickness: UI.Components.DisplayDivider["model"]["properties"]["thickness"];
}

type RequiredDisplayDividerFields = "id";
type OptionalDisplayDividerProperties = Omit<
  DisplayDividerProperties,
  RequiredDisplayDividerFields
>;

/**
 * Displays a divider line to visually separate content.
 *
 * @example
 * ```ts
 * page.add(() => ui.stack([
 *   ui.text("First item"),
 *   ui.divider(),
 *   ui.text("Second item"),
 * ]))
 * ```
 *
 * @link Read the full {@link https://docs.composehq.com/components/display/divider documentation}
 *
 * @param {Partial<OptionalDisplayDividerProperties>} properties - Optional properties to configure the divider.
 * @param {Partial<OptionalDisplayDividerProperties>["orientation"]} properties.orientation - The orientation of the divider. Options: `"horizontal"` or `"vertical"`. Defaults to `"horizontal"`.
 * @param {Partial<OptionalDisplayDividerProperties>["thickness"]} properties.thickness - The thickness of the divider. Options: `"thin"` (1px), `"medium"` (2px), or `"thick"` (4px). Defaults to `"thin"`.
 * @param {Partial<OptionalDisplayDividerProperties>["style"]} properties.style - CSS styles object to directly style the divider HTML element.
 */
function displayDivider(
  properties: Partial<OptionalDisplayDividerProperties> = {}
): UI.OutputOmittedComponents.DisplayDivider {
  const id = uuid();

  return {
    model: {
      id,
      style: properties.style || null,
      properties: {
        ...{
          orientation: properties.orientation,
          thickness: properties.thickness,
        },
      },
    },
    hooks: null,
    type: UI.TYPE.DISPLAY_DIVIDER,
    interactionType: UI.INTERACTION_TYPE.DISPLAY,
  };
}

interface DisplayStatisticProperties extends BaseWithDisplayInteraction {
  /**
   * The label for the statistic.
   */
  label: UI.Components.DisplayStatistic["model"]["properties"]["label"];
  /**
   * The value for the statistic.
   */
  value: UI.Components.DisplayStatistic["model"]["properties"]["value"];
  /**
   * Additional text description displayed below the value.
   */
  description: UI.Components.DisplayStatistic["model"]["properties"]["description"];
  /**
   * Number formatting to apply to the value. Options:
   * - `standard`
   * - `currency`
   * - `percent`
   *
   * @default "standard"
   */
  format: UI.Components.DisplayStatistic["model"]["properties"]["format"];
  /**
   * A numeric value representing change (will display with up/down indicators).
   */
  delta: UI.Components.DisplayStatistic["model"]["properties"]["delta"];
  /**
   * Round the value to a specific number of decimal places. By default, the value is not rounded.
   */
  decimals: UI.Components.DisplayStatistic["model"]["properties"]["decimals"];
  /**
   * Text to display before the value, e.g. a symbol. Will display the USD currency symbol if `format` is `currency`.
   */
  prefix: UI.Components.DisplayStatistic["model"]["properties"]["prefix"];
  /**
   * Text to display after the value, e.g. a unit of measurement.
   */
  suffix: UI.Components.DisplayStatistic["model"]["properties"]["suffix"];
  /**
   * Number formatting to apply to the delta value. Options:
   * - `standard`
   * - `currency`
   * - `percent`
   *
   * @default "standard"
   */
  deltaFormat: UI.Components.DisplayStatistic["model"]["properties"]["deltaFormat"];
  /**
   * Round the delta value to a specific number of decimal places. By default, the delta value is not rounded.
   */
  deltaDecimals: UI.Components.DisplayStatistic["model"]["properties"]["deltaDecimals"];
  /**
   * Override the automatic determination of whether the delta is positive. Either:
   * - a boolean
   * - a function that returns a boolean
   */
  isPositiveDelta:
    | UI.Components.DisplayStatistic["model"]["properties"]["isPositiveDelta"]
    | ((delta: number) => boolean);
  /**
   * Color for the label text. Options:
   * - `text`
   * - `text-secondary`
   * - `primary`
   * - `background`
   * - `warning`
   * - `danger`
   * - `success`
   *
   * @default "text"
   */
  labelColor: UI.Components.DisplayStatistic["model"]["properties"]["labelColor"];
  /**
   * Color for the main value text. Options:
   * - `text`
   * - `text-secondary`
   * - `primary`
   * - `background`
   * - `warning`
   * - `danger`
   * - `success`
   *
   * @default "text"
   */
  valueColor: UI.Components.DisplayStatistic["model"]["properties"]["valueColor"];
  /**
   * Color for the description text. Options:
   * - `text`
   * - `text-secondary`
   * - `primary`
   * - `background`
   * - `warning`
   * - `danger`
   * - `success`
   *
   * @default "text-secondary"
   */
  descriptionColor: UI.Components.DisplayStatistic["model"]["properties"]["descriptionColor"];
}

type RequiredDisplayStatisticFields = "label" | "value" | "id";
type OptionalDisplayStatisticProperties = Omit<
  DisplayStatisticProperties,
  RequiredDisplayStatisticFields
>;

/**
 * Display a well-formatted, highly-customizable statistic with configurable delta indicators, formatting, and colors.
 *
 * @example
 * ```typescript
 * // Basic usage
 * page.add(() => ui.statistic("Total Users", 1571))
 *
 * // With delta indictor
 * page.add(() => ui.statistic(
 *   "Total Revenue",
 *   11251.7,
 *   {
 *     delta: 0.54,
 *     description: "Compared to last month",
 *     format: "currency",
 *     deltaFormat: "percent"
 *   }
 * ))
 * ```
 *
 * @link Read the full {@link https://docs.composehq.com/components/display/statistic documentation}
 *
 * @param {DisplayStatisticProperties["label"]} label - The title for the statistic.
 * @param {DisplayStatisticProperties["value"]} value - The numeric value to display.
 * @param {Partial<OptionalDisplayStatisticProperties>} properties - Optional properties to configure the statistic.
 * @param {OptionalDisplayStatisticProperties["description"]} properties.description - Additional text description displayed below the value.
 * @param {OptionalDisplayStatisticProperties["format"]} properties.format - Number formatting to apply to the value. Options: `standard`, `currency`, `percent`. Defaults to `standard`.
 * @param {OptionalDisplayStatisticProperties["delta"]} properties.delta - A numeric value representing change (will display with up/down indicators).
 * @param {OptionalDisplayStatisticProperties["decimals"]} properties.decimals - Round the value to a specific number of decimal places. By default, the value is not rounded.
 * @param {OptionalDisplayStatisticProperties["prefix"]} properties.prefix - Text to display before the value, e.g. a symbol. Will display the USD currency symbol if `format` is `currency`.
 * @param {OptionalDisplayStatisticProperties["suffix"]} properties.suffix - Text to display after the value, e.g. a unit of measurement.
 * @param {OptionalDisplayStatisticProperties["deltaFormat"]} properties.deltaFormat - Number formatting to apply to the delta value. Options: `standard`, `currency`, `percent`. Defaults to `standard`.
 * @param {OptionalDisplayStatisticProperties["deltaDecimals"]} properties.deltaDecimals - Round the delta value to a specific number of decimal places. By default, the delta value is not rounded.
 * @param {OptionalDisplayStatisticProperties["isPositiveDelta"]} properties.isPositiveDelta - Override the automatic determination of whether the delta is positive. Either a boolean or function that returns a boolean.
 * @param {OptionalDisplayStatisticProperties["labelColor"]} properties.labelColor - Color for the label text. Options: `text`, `text-secondary`, `primary`, `background`, `warning`, `danger`, `success`. Defaults to `text`.
 * @param {OptionalDisplayStatisticProperties["valueColor"]} properties.valueColor - Color for the main value text. Options: `text`, `text-secondary`, `primary`, `background`, `warning`, `danger`, `success`. Defaults to `text`.
 * @param {OptionalDisplayStatisticProperties["descriptionColor"]} properties.descriptionColor - Color for the description text. Options: `text`, `text-secondary`, `primary`, `background`, `warning`, `danger`, `success`. Defaults to `text-secondary`.
 * @param {OptionalDisplayStatisticProperties["style"]} properties.style - CSS styles object applied directly to the outermost statistic HTML element.
 * @returns The configured statistic component.
 */
function displayStatistic(
  label: DisplayStatisticProperties["label"],
  value: DisplayStatisticProperties["value"],
  properties: Partial<OptionalDisplayStatisticProperties> = {}
): UI.OutputOmittedComponents.DisplayStatistic {
  const id = uuid();

  const modelProperties: UI.OutputOmittedComponents.DisplayStatistic["model"]["properties"] =
    { label, value };

  if (properties.description) {
    modelProperties.description = properties.description;
  }

  if (properties.format) {
    modelProperties.format = properties.format;
  }

  if (properties.delta !== undefined) {
    modelProperties.delta = properties.delta;
  }

  if (properties.decimals !== undefined) {
    modelProperties.decimals = properties.decimals;
  }

  if (properties.prefix !== undefined) {
    modelProperties.prefix = properties.prefix;
  }

  if (properties.suffix !== undefined) {
    modelProperties.suffix = properties.suffix;
  }

  if (properties.deltaFormat) {
    modelProperties.deltaFormat = properties.deltaFormat;
  }

  if (properties.deltaDecimals !== undefined) {
    modelProperties.deltaDecimals = properties.deltaDecimals;
  }

  if (properties.isPositiveDelta !== undefined) {
    if (typeof properties.isPositiveDelta === "function") {
      if (properties.delta === undefined) {
        throw new Error(
          `Failed to render ui.statistic with label "${label}": cannot supply isPositiveDelta property without delta property`
        );
      }

      modelProperties.isPositiveDelta = properties.isPositiveDelta(
        properties.delta
      );
    } else {
      modelProperties.isPositiveDelta = properties.isPositiveDelta;
    }
  }

  if (properties.labelColor) {
    modelProperties.labelColor = properties.labelColor;
  }

  if (properties.valueColor) {
    modelProperties.valueColor = properties.valueColor;
  }

  if (properties.descriptionColor) {
    modelProperties.descriptionColor = properties.descriptionColor;
  }

  return {
    model: {
      id,
      style: properties.style || null,
      properties: modelProperties,
    },
    hooks: null,
    type: UI.TYPE.DISPLAY_STATISTIC,
    interactionType: UI.INTERACTION_TYPE.DISPLAY,
  };
}

function displayNone(): UI.OutputOmittedComponents.DisplayNone {
  const id = uuid();

  return {
    model: {
      id,
      style: null,
      properties: {},
    },
    hooks: null,
    type: UI.TYPE.DISPLAY_NONE,
    interactionType: UI.INTERACTION_TYPE.DISPLAY,
  };
}

const displayGenerator = {
  text: displayText,
  header: displayHeader,
  json: displayJson,
  spinner: displaySpinner,
  code: displayCode,
  image: displayImage,
  markdown: displayMarkdown,
  pdf: displayPdf,
  divider: displayDivider,
  statistic: displayStatistic,
  none: displayNone,
};

export { displayGenerator };
