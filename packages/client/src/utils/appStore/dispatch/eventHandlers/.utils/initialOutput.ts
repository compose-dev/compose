import { u } from "@compose/ts";
import { UI } from "@composehq/ts-public";

function getInputInteractionNullOutput(initialValue: any) {
  return {
    networkTransferValue: initialValue === undefined ? null : initialValue,
    customerReturnedValue: initialValue === undefined ? null : initialValue,
    internalValue: initialValue === undefined ? null : initialValue,
  };
}

function getInputTableDefaultOutput(
  data: UI.ComponentGenerators.InputTable["model"]["properties"]["data"],
  initialSelectedRows:
    | UI.ComponentGenerators.InputTable["model"]["properties"]["initialSelectedRows"]
    | undefined,
  version: UI.ComponentGenerators.InputTable["model"]["properties"]["v"]
): UI.Components.InputTable["output"] {
  let networkTransferValue: UI.Components.InputTable["output"]["networkTransferValue"] =
    [];

  const tableVersion = version || 1;

  if (initialSelectedRows) {
    if (tableVersion > 1) {
      networkTransferValue = {
        value: initialSelectedRows,
        type: UI.TYPE.INPUT_TABLE,
      };
    } else {
      try {
        networkTransferValue = initialSelectedRows.map(
          (row) => data[row as number]
        );
      } catch (e) {
        // ignore any errors as this is a fallback
      }
    }
  }

  return {
    networkTransferValue,
    // don't worry about storing this client side as it's hydrated on the SDK side
    customerReturnedValue: [],
    internalValue: initialSelectedRows
      ? Object.fromEntries(initialSelectedRows.map((row) => [row, true]))
      : {},
  };
}

function getInputSelectDropdownMultiDefaultOutput(
  initialValue:
    | UI.ComponentGenerators.InputMultiSelectDropdown["model"]["properties"]["initialValue"]
    | undefined
): UI.Components.InputMultiSelectDropdown["output"] {
  return {
    networkTransferValue: initialValue || [],
    customerReturnedValue: initialValue || [],
    internalValue: initialValue || [],
  };
}

function getInputDateDefaultOutput(
  initialValue:
    | UI.ComponentGenerators.InputDate["model"]["properties"]["initialValue"]
    | string
    | undefined
): UI.Components.InputDate["output"] {
  // There's a bug in the older version of the SDK where we don't
  // convert the date to our internal model before sending to client
  // for the page.setInput() function. So, we correct that here.
  const corrected = u.date.isValidISODateString(initialValue)
    ? u.date.toDateOnlyModel(u.date.fromISOString(initialValue as string))
    : (initialValue as
        | undefined
        | UI.ComponentGenerators.InputDate["model"]["properties"]["initialValue"]);

  return {
    networkTransferValue: {
      value: corrected || null,
      type: UI.TYPE.INPUT_DATE,
    },
    customerReturnedValue: corrected
      ? {
          year: corrected.year,
          month: corrected.month,
          day: corrected.day,
          jsDate: u.date.fromDateOnlyModel(corrected),
        }
      : null,
    internalValue: corrected || null,
  };
}

function getInputTimeDefaultOutput(
  initialValue:
    | UI.ComponentGenerators.InputTime["model"]["properties"]["initialValue"]
    | string
    | undefined
): UI.Components.InputTime["output"] {
  // There's a bug in the older version of the SDK where we don't
  // convert the date to our internal model before sending to client
  // for the page.setInput() function. So, we correct that here.
  const corrected = u.date.isValidISODateString(initialValue)
    ? u.date.toTimeOnlyModel(u.date.fromISOString(initialValue as string))
    : (initialValue as
        | undefined
        | UI.ComponentGenerators.InputTime["model"]["properties"]["initialValue"]);

  return {
    networkTransferValue: {
      value: corrected || null,
      type: UI.TYPE.INPUT_TIME,
    },
    customerReturnedValue: corrected
      ? {
          hour: corrected.hour,
          minute: corrected.minute,
        }
      : null,
    internalValue: corrected || null,
  };
}

function getInputDateTimeDefaultOutput(
  initialValue:
    | UI.ComponentGenerators.InputDateTime["model"]["properties"]["initialValue"]
    | string
    | undefined
): UI.Components.InputDateTime["output"] {
  // There's a bug in the older version of the SDK where we don't
  // convert the date to our internal model before sending to client
  // for the page.setInput() function. So, we correct that here.
  const corrected = u.date.isValidISODateString(initialValue)
    ? u.date.toDateTimeModel(u.date.fromISOString(initialValue as string))
    : (initialValue as
        | undefined
        | UI.ComponentGenerators.InputDateTime["model"]["properties"]["initialValue"]);

  return {
    networkTransferValue: {
      value: corrected || null,
      type: UI.TYPE.INPUT_DATE_TIME,
    },
    customerReturnedValue: corrected
      ? {
          year: corrected.year,
          month: corrected.month,
          day: corrected.day,
          hour: corrected.hour,
          minute: corrected.minute,
          jsDate: u.date.fromDateTimeModel(corrected),
        }
      : null,
    internalValue: corrected || null,
  };
}

function getInputFileDropDefaultOutput() {
  return {
    networkTransferValue: [],
    customerReturnedValue: [],
    internalValue: [],
  };
}

function getInputJsonDefaultOutput(
  initialValue: UI.ComponentGenerators.InputJson["model"]["properties"]["initialValue"]
) {
  const corrected =
    initialValue === null ? null : JSON.stringify(initialValue, undefined, 2);

  return {
    networkTransferValue: {
      value: corrected,
      type: UI.TYPE.INPUT_JSON,
    },
    customerReturnedValue: null,
    internalValue: corrected,
  };
}

export {
  getInputTableDefaultOutput as table,
  getInputSelectDropdownMultiDefaultOutput as selectDropdownMulti,
  getInputFileDropDefaultOutput as fileDrop,
  getInputDateDefaultOutput as date,
  getInputTimeDefaultOutput as time,
  getInputDateTimeDefaultOutput as dateTime,
  getInputInteractionNullOutput as nullOutput,
  getInputJsonDefaultOutput as json,
};
