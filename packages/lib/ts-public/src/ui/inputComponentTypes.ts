/**
 * @IMPORTANT Are you upading this file? You should also check if
 * you need to update our generator to frontend component function,
 * as it has a separate switch statement to handle many of our
 * individual components. See:
 * client/src/utils/appStore/utils/generatorToFrontendComponent.ts
 */

import { TYPE } from "./types";
import * as Components from "./components";

type InputEnterType =
  | typeof TYPE.INPUT_TEXT
  | typeof TYPE.INPUT_NUMBER
  | typeof TYPE.INPUT_EMAIL
  | typeof TYPE.INPUT_URL
  | typeof TYPE.INPUT_PASSWORD
  | typeof TYPE.INPUT_DATE
  | typeof TYPE.INPUT_TIME
  | typeof TYPE.INPUT_DATE_TIME
  | typeof TYPE.INPUT_TEXT_AREA;

type InputSelectType =
  | typeof TYPE.INPUT_RADIO_GROUP
  | typeof TYPE.INPUT_SELECT_DROPDOWN_SINGLE
  | typeof TYPE.INPUT_SELECT_DROPDOWN_MULTI
  | typeof TYPE.INPUT_TABLE
  | typeof TYPE.INPUT_CHECKBOX;

type InputMultiSelectType =
  | typeof TYPE.INPUT_SELECT_DROPDOWN_MULTI
  | typeof TYPE.INPUT_TABLE;

/**
 * @IMPORTANT Are you updating this? Also update:
 * client/src/utils/appStore/types/frontendComponentModel/inputSelectFrontendComponent.ts
 *
 * A sub-type of the input select type that has an
 * options dropdown.
 *
 * This is mainly because we have a "simple" and
 * "advanced" options format and we apply some
 * transformations on the frontend to make everything
 * the "advanced" format
 */
type InputSelectTypeWithOptionsList =
  | typeof TYPE.INPUT_RADIO_GROUP
  | typeof TYPE.INPUT_SELECT_DROPDOWN_SINGLE
  | typeof TYPE.INPUT_SELECT_DROPDOWN_MULTI;

type InputFileChangeType = typeof TYPE.INPUT_FILE_DROP;

function isInputEnterType<T extends { type: Components.All["type"] }>(
  component: T
): component is T & { type: InputEnterType } {
  return (
    component.type === TYPE.INPUT_TEXT ||
    component.type === TYPE.INPUT_NUMBER ||
    component.type === TYPE.INPUT_EMAIL ||
    component.type === TYPE.INPUT_URL ||
    component.type === TYPE.INPUT_PASSWORD ||
    component.type === TYPE.INPUT_DATE ||
    component.type === TYPE.INPUT_TIME ||
    component.type === TYPE.INPUT_DATE_TIME ||
    component.type === TYPE.INPUT_TEXT_AREA
  );
}

function isInputSelectType<T extends { type: Components.All["type"] }>(
  component: T
): component is T & { type: InputSelectType } {
  return (
    component.type === TYPE.INPUT_RADIO_GROUP ||
    component.type === TYPE.INPUT_SELECT_DROPDOWN_SINGLE ||
    component.type === TYPE.INPUT_SELECT_DROPDOWN_MULTI ||
    component.type === TYPE.INPUT_TABLE ||
    component.type === TYPE.INPUT_CHECKBOX
  );
}

function isInputFileChangeType<T extends { type: Components.All["type"] }>(
  component: T
): component is T & { type: InputFileChangeType } {
  return component.type === TYPE.INPUT_FILE_DROP;
}

/**
 * Whether the component should be rendered as a generic box
 * component with similar styling to other input box components.
 */
function isInputBoxComponent(type: Components.All["type"]) {
  return (
    type === TYPE.INPUT_TEXT ||
    type === TYPE.INPUT_NUMBER ||
    type === TYPE.INPUT_EMAIL ||
    type === TYPE.INPUT_URL ||
    type === TYPE.INPUT_PASSWORD ||
    type === TYPE.INPUT_RADIO_GROUP ||
    type === TYPE.INPUT_SELECT_DROPDOWN_SINGLE ||
    type === TYPE.INPUT_SELECT_DROPDOWN_MULTI ||
    type === TYPE.INPUT_DATE ||
    type === TYPE.INPUT_TIME ||
    type === TYPE.INPUT_DATE_TIME
  );
}

/**
 * The input value can be set using the `page.setInput` method.
 */
function isSettableInputType(type: Components.All["type"]) {
  return type !== TYPE.INPUT_FILE_DROP;
}

export {
  InputEnterType as EnterType,
  InputSelectType as SelectType,
  InputMultiSelectType as MultiSelectType,
  InputSelectTypeWithOptionsList as SelectTypeWithOptionsList,
  InputFileChangeType as FileChangeType,
  isInputEnterType as isEnterType,
  isInputSelectType as isSelectType,
  isInputFileChangeType as isFileChangeType,
  isSettableInputType,
  isInputBoxComponent as isBoxComponent,
};
