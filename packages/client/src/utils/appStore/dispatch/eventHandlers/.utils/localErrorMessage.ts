import { u } from "@compose/ts";
import { UI } from "@composehq/ts-public";

function getComponentLocalErrorMessage(
  component: UI.ComponentGenerators.All,
  value: UI.Components.AllWithInputInteraction["output"]["internalValue"]
): string | null {
  function makeError(message: string) {
    return message;
  }

  const emptyValueIsNull =
    component.type === UI.TYPE.INPUT_TEXT ||
    component.type === UI.TYPE.INPUT_EMAIL ||
    component.type === UI.TYPE.INPUT_URL ||
    component.type === UI.TYPE.INPUT_NUMBER ||
    component.type === UI.TYPE.INPUT_PASSWORD ||
    component.type === UI.TYPE.INPUT_RADIO_GROUP ||
    component.type === UI.TYPE.INPUT_SELECT_DROPDOWN_SINGLE ||
    component.type === UI.TYPE.INPUT_DATE ||
    component.type === UI.TYPE.INPUT_TIME ||
    component.type === UI.TYPE.INPUT_DATE_TIME ||
    component.type === UI.TYPE.INPUT_TEXT_AREA ||
    component.type === UI.TYPE.INPUT_JSON;

  if (emptyValueIsNull && component.model.required === true && value === null) {
    return makeError("This field is required.");
  }

  if (component.type === UI.TYPE.INPUT_EMAIL) {
    const isValidlyEmpty = component.model.required === false && value === null;

    if (
      isValidlyEmpty === false &&
      u.string.isValidEmail(value as string) === false
    ) {
      return makeError("Invalid email address.");
    }
  }

  if (component.type === UI.TYPE.INPUT_NUMBER) {
    const isValidlyEmpty = component.model.required === false && value === null;

    if (
      isValidlyEmpty === false &&
      value !== null &&
      Number.isNaN(Number.parseFloat(value as string))
    ) {
      return makeError("Invalid number.");
    }
  }

  if (component.type === UI.TYPE.INPUT_URL) {
    const isValidlyEmpty = component.model.required === false && value === null;

    if (
      isValidlyEmpty === false &&
      u.string.isValidUrl(value as string) === false
    ) {
      return makeError("Invalid URL.");
    }
  }

  if (component.type === UI.TYPE.INPUT_DATE) {
    const isValidlyEmpty = component.model.required === false && value === null;

    if (
      isValidlyEmpty === false &&
      component.model.properties.min !== null &&
      u.date.isEarlierThan(
        value as NonNullable<
          UI.Components.InputDate["output"]["internalValue"]
        >,
        component.model.properties.min
      ) === true
    ) {
      return makeError(
        `Date must be later than or equal to ${u.date.toString(
          u.date.fromDateOnlyModel(component.model.properties.min),
          u.date.SerializedFormat["LLL d, yyyy"],
          true
        )}.`
      );
    }

    if (
      isValidlyEmpty === false &&
      component.model.properties.max !== null &&
      u.date.isLaterThan(
        value as NonNullable<
          UI.Components.InputDate["output"]["internalValue"]
        >,
        component.model.properties.max
      ) === true
    ) {
      return makeError(
        `Date must be earlier than or equal to ${u.date.toString(
          u.date.fromDateOnlyModel(component.model.properties.max),
          u.date.SerializedFormat["LLL d, yyyy"],
          true
        )}.`
      );
    }
  }

  if (component.type === UI.TYPE.INPUT_TIME) {
    const isValidlyEmpty = component.model.required === false && value === null;

    if (
      isValidlyEmpty === false &&
      component.model.properties.min !== null &&
      u.date.isEarlierThan(
        value as NonNullable<
          UI.Components.InputTime["output"]["internalValue"]
        >,
        component.model.properties.min
      ) === true
    ) {
      return makeError(
        `Time must be later than or equal to ${u.date.toString(
          u.date.fromTimeOnlyModel(component.model.properties.min),
          u.date.SerializedFormat["h:mm a"],
          true
        )}.`
      );
    }

    if (
      isValidlyEmpty === false &&
      component.model.properties.max !== null &&
      u.date.isLaterThan(
        value as NonNullable<
          UI.Components.InputTime["output"]["internalValue"]
        >,
        component.model.properties.max
      ) === true
    ) {
      return makeError(
        `Time must be earlier than or equal to ${u.date.toString(
          u.date.fromTimeOnlyModel(component.model.properties.max),
          u.date.SerializedFormat["h:mm a"],
          true
        )}.`
      );
    }
  }

  if (component.type === UI.TYPE.INPUT_DATE_TIME) {
    const isValidlyEmpty = component.model.required === false && value === null;

    if (
      isValidlyEmpty === false &&
      component.model.properties.min !== null &&
      u.date.isEarlierThan(
        value as NonNullable<
          UI.Components.InputDateTime["output"]["internalValue"]
        >,
        component.model.properties.min
      ) === true
    ) {
      return makeError(
        `Date must be later than or equal to ${u.date.toString(
          u.date.fromDateTimeModel(component.model.properties.min),
          u.date.SerializedFormat["LLL d, yyyy h:mm a"],
          true
        )}.`
      );
    }

    if (
      isValidlyEmpty === false &&
      component.model.properties.max !== null &&
      u.date.isLaterThan(
        value as NonNullable<
          UI.Components.InputDateTime["output"]["internalValue"]
        >,
        component.model.properties.max
      ) === true
    ) {
      return makeError(
        `Date must be earlier than or equal to ${u.date.toString(
          u.date.fromDateTimeModel(component.model.properties.max),
          u.date.SerializedFormat["LLL d, yyyy h:mm a"],
          true
        )}.`
      );
    }
  }

  if (component.type === UI.TYPE.INPUT_SELECT_DROPDOWN_MULTI) {
    if (Array.isArray(value) === false) {
      return makeError(
        "Something went wrong. Please reload the page or reach out to atul@composehq.com if the issue persists."
      );
    }

    if (component.model.required === true && value.length === 0) {
      return makeError("This field is required.");
    }

    const isValidlyEmpty =
      component.model.required === false && value.length === 0;

    if (
      isValidlyEmpty === false &&
      value.length < component.model.properties.minSelections
    ) {
      return makeError(
        `You must select at least ${component.model.properties.minSelections} items.`
      );
    }

    if (
      isValidlyEmpty === false &&
      value.length > component.model.properties.maxSelections
    ) {
      return makeError(
        `You must select at most ${component.model.properties.maxSelections} items.`
      );
    }
  }

  if (component.type === UI.TYPE.INPUT_TABLE) {
    if (typeof value !== "object" || value === null) {
      return makeError(
        "Something went wrong. Please reload the page or reach out to atul@composehq.com if the issue persists."
      );
    }

    if (component.model.required === true && Object.keys(value).length === 0) {
      return makeError("This field is required.");
    }

    const isValidlyEmpty =
      component.model.required === false && Object.keys(value).length === 0;

    if (
      isValidlyEmpty === false &&
      Object.keys(value).length < component.model.properties.minSelections
    ) {
      return makeError(
        `You must select at least ${component.model.properties.minSelections} items.`
      );
    }

    if (
      isValidlyEmpty === false &&
      Object.keys(value).length > component.model.properties.maxSelections
    ) {
      return makeError(
        `You must select at most ${component.model.properties.maxSelections} items.`
      );
    }
  }

  if (component.type === UI.TYPE.INPUT_JSON) {
    const isValidlyEmpty = component.model.required === false && value === null;

    if (!isValidlyEmpty) {
      try {
        JSON.parse(value as string);
      } catch (error) {
        return makeError(
          `Invalid JSON: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }
  }

  if (component.type === UI.TYPE.INPUT_FILE_DROP) {
    if (Array.isArray(value) === false) {
      return makeError(
        "Something went wrong. Please reload the page or reach out to atul@composehq.com if the issue persists."
      );
    }

    if (component.model.required === true && value.length === 0) {
      return makeError("This field is required.");
    }

    const isValidlyEmpty =
      component.model.required === false && value.length === 0;

    if (
      isValidlyEmpty === false &&
      value.length < component.model.properties.minCount
    ) {
      return makeError(
        `You must upload at least ${component.model.properties.minCount} ${component.model.properties.minCount === 1 ? "file" : "files"}.`
      );
    }

    if (
      isValidlyEmpty === false &&
      value.length > component.model.properties.maxCount
    ) {
      return makeError(
        `You must upload at most ${component.model.properties.maxCount} ${component.model.properties.maxCount === 1 ? "file" : "files"}.`
      );
    }

    const acceptedFileTypes = component.model.properties.acceptedFileTypes;

    if (acceptedFileTypes !== null) {
      const invalidFiles = value.filter(
        (file) =>
          !acceptedFileTypes.some(
            (type) =>
              (file as File).type === type ||
              (file as File).name.endsWith(`.${type.split("/")[1]}`)
          )
      );

      if (invalidFiles.length > 0) {
        if (acceptedFileTypes.length === 0) {
          return makeError(
            "This component is misconfigured with an empty list of accepted file types. Either remove the property to accept all file types, or add at least one accepted file type."
          );
        }

        return makeError(
          `Some files have invalid types. Accepted types are: ${acceptedFileTypes.join(", ")}`
        );
      }
    }
  }

  return null;
}

export { getComponentLocalErrorMessage };
