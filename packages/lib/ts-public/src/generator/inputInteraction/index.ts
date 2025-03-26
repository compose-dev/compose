import * as UI from "../../ui";
import {
  BaseWithInputInteraction,
  MULTI_SELECTION_MIN_DEFAULT,
  MULTI_SELECTION_MAX_DEFAULT,
} from "../base";
import table from "./table";
import date from "./date";
import time from "./time";
import dateTime from "./dateTime";
import { text, email, url, number, password, textArea, json } from "./text";
import {
  radioGroup,
  selectDropdownSingle,
  selectDropdownMulti,
} from "./select";

interface FileDropProperties
  extends BaseWithInputInteraction<UI.BaseGeneric.Required> {
  validate: UI.Components.InputFileDrop["hooks"]["validate"];
  onChange: UI.Components.InputFileDrop["hooks"]["onFileChange"];
  acceptedFileTypes: UI.Components.InputFileDrop["model"]["properties"]["acceptedFileTypes"];
  minCount: UI.Components.InputFileDrop["model"]["properties"]["minCount"];
  maxCount: UI.Components.InputFileDrop["model"]["properties"]["maxCount"];
}

type RequiredFileDropFields = "id";
type OptionalFileDropProperties = Omit<
  FileDropProperties,
  RequiredFileDropFields
>;

const defaultFileDropProperties: OptionalFileDropProperties = {
  label: null,
  required: true,
  description: null,
  validate: null,
  acceptedFileTypes: null,
  minCount: MULTI_SELECTION_MIN_DEFAULT,
  maxCount: MULTI_SELECTION_MAX_DEFAULT,
  style: null,
  onChange: null,
};

/**
 * Generate a file drop component that allows users to upload files.
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.fileDrop("files", {
 *   onChange: (files) => console.log(files),
 * }));
 *
 * // Part of a form
 * page.add(() => ui.form(
 *   "new-user",
 *   [
 *     ui.textInput("name"),
 *     ui.fileDrop("files"),
 *   ],
 *   {
 *     onSubmit: (data) => {
 *       const { name, files } = data;
 *     },
 *   }
 * ));
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/file-drop documentation}.
 *
 * @param {string} id - Unique id to identify the file drop.
 * @param {Partial<OptionalFileDropProperties>} properties - Optional properties to configure the file drop component.
 * @param {UI.Components.InputFileDrop["model"]["label"]} properties.label - Label to display above the file drop.
 * @param {UI.Components.InputFileDrop["model"]["description"]} properties.description - Description to display below the label.
 * @param {UI.Components.InputFileDrop["model"]["required"]} properties.required - Whether the file drop is required (e.g. part of a form). If required, the user must upload at least one file. Defaults to `true`.
 * @param {UI.Components.InputFileDrop["model"]["properties"]["acceptedFileTypes"]} properties.acceptedFileTypes - List of accepted file types, e.g. `["application/pdf, "image/png"]`. Defaults to accepting all file types.
 * @param {UI.Components.InputFileDrop["model"]["properties"]["minCount"]} properties.minCount - Minimum number of files to accept. Defaults to `1`, or `0` if the file drop is not required.
 * @param {UI.Components.InputFileDrop["model"]["properties"]["maxCount"]} properties.maxCount - Maximum number of files to accept. Defaults to `1000000000`.
 * @param {UI.Components.InputFileDrop["hooks"]["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {UI.Components.InputFileDrop["hooks"]["onFileChange"]} properties.onChange - Function to be called when files are changed.
 * @param {UI.Components.InputFileDrop["model"]["style"]} properties.style - CSS styles object to directly style the file drop HTML element.
 * @returns The configured file drop component.
 */
function inputFileDrop<TId extends UI.BaseGeneric.Id>(
  id: TId,
  properties: Partial<OptionalFileDropProperties> = {}
): UI.OutputOmittedComponents.InputFileDrop<TId> {
  const mergedProperties = { ...defaultFileDropProperties, ...properties };

  return {
    model: {
      id,
      label: mergedProperties.label,
      description: mergedProperties.description,
      required: mergedProperties.required,
      hasValidateHook: mergedProperties.validate !== null,
      properties: {
        acceptedFileTypes: mergedProperties.acceptedFileTypes,
        minCount: mergedProperties.minCount,
        maxCount: mergedProperties.maxCount,
        hasOnFileChangeHook: mergedProperties.onChange !== null,
      },
      style: mergedProperties.style,
    },
    hooks: {
      validate: mergedProperties.validate,
      onFileChange: mergedProperties.onChange,
    },
    type: UI.TYPE.INPUT_FILE_DROP,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

interface CheckboxProperties
  extends BaseWithInputInteraction<UI.BaseGeneric.Required> {
  validate: UI.Components.InputCheckbox["hooks"]["validate"];
  onChange: UI.Components.InputCheckbox["hooks"]["onSelect"];
  initialValue: UI.Components.InputCheckbox["model"]["properties"]["initialValue"];
}

type RequiredCheckboxFields = "id";
type OptionalCheckboxProperties = Omit<
  CheckboxProperties,
  RequiredCheckboxFields
>;

const defaultCheckboxProperties: OptionalCheckboxProperties = {
  label: null,
  required: true,
  description: null,
  validate: null,
  style: null,
  onChange: null,
  initialValue: false,
};

/**
 * Generate a checkbox component.
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.checkbox("terms", {
 *   onChange: (checked) => console.log(checked),
 * }));
 *
 * // Part of a form
 * page.add(() => ui.form(
 *   "new-user",
 *   [
 *     ui.textInput("name"),
 *     ui.checkbox("isActive"),
 *   ],
 *   {
 *     onSubmit: (data) => {
 *       const { name, isActive } = data;
 *     },
 *   }
 * ));
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/checkbox documentation}.
 *
 * @param {string} id - Unique id to identify the checkbox.
 * @param {Partial<OptionalCheckboxProperties>} properties - Optional properties to configure the checkbox component.
 * @param {OptionalCheckboxProperties["label"]} properties.label - Label to display beside the checkbox.
 * @param {OptionalCheckboxProperties["description"]} properties.description - Description to display below the label.
 * @param {OptionalCheckboxProperties["required"]} properties.required - Whether the checkbox is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalCheckboxProperties["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalCheckboxProperties["onChange"]} properties.onChange - Function to be called when the checkbox selection changes.
 * @param {OptionalCheckboxProperties["initialValue"]} properties.initialValue - Whether the checkbox is selected by default. Defaults to `false`.
 * @param {OptionalCheckboxProperties["style"]} properties.style - CSS styles object to directly style the checkbox HTML element.
 * @returns The configured checkbox component.
 */
function inputCheckbox<TId extends UI.BaseGeneric.Id>(
  id: TId,
  properties: Partial<OptionalCheckboxProperties> = {}
): UI.OutputOmittedComponents.InputCheckbox<TId> {
  const mergedProperties = {
    ...defaultCheckboxProperties,
    ...properties,
  };

  return {
    model: {
      id,
      label: mergedProperties.label,
      description: mergedProperties.description,
      required: mergedProperties.required,
      hasValidateHook: mergedProperties.validate !== null,
      properties: {
        initialValue: mergedProperties.initialValue,
        hasOnSelectHook: mergedProperties.onChange !== null,
      },
      style: mergedProperties.style,
    },
    hooks: {
      validate: mergedProperties.validate,
      onSelect: mergedProperties.onChange,
    },
    type: UI.TYPE.INPUT_CHECKBOX,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

const inputGenerator = {
  checkbox: inputCheckbox,
  date,
  dateTime,
  time,
  email,
  fileDrop: inputFileDrop,
  multiSelectBox: selectDropdownMulti,
  number,
  password,
  radioGroup,
  selectBox: selectDropdownSingle,
  table,
  text,
  textArea,
  json,
  url,
};

export { inputGenerator };
