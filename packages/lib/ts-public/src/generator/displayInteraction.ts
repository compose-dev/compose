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
  none: displayNone,
};

export { displayGenerator };
