import {
  EmailInput,
  NumberInput,
  TextInput,
  UrlInput,
  PasswordInput,
  DateInput,
  TextAreaInput,
  TimeInput,
  DateTimeInput,
} from "~/components/input";

import { UI } from "@composehq/ts-public";
import { ComboboxMulti, ComboboxSingle } from "~/components/combobox";
import RadioGroup from "~/components/radio-group";
import TableComponent from "./TableComponent";
import FileUpload from "~/components/file-upload";
import { useCallback, useEffect, useRef } from "react";
import { appStore } from "~/utils/appStore";
import { useWSContext } from "~/utils/wsContext";
import { useTransferFiles } from "./utils";
import { BrowserToServerEvent } from "@compose/ts";
import { Checkbox } from "~/components/checkbox";
import { JsonEditor } from "~/components/code-editor";

function textAreaInputStyle(
  style: UI.Components.InputTextArea["model"]["style"]
) {
  if (!style) {
    return undefined;
  }

  const styleObj: React.CSSProperties = {};

  if (style.minHeight) {
    styleObj.minHeight = style.minHeight;
  }

  if (style.height) {
    styleObj.height = style.height;
  }

  if (style.maxHeight) {
    styleObj.maxHeight = style.maxHeight;
  }

  return Object.keys(styleObj).length > 0 ? styleObj : undefined;
}

function InputInteractionComponent({
  componentId,
  renderId,
  environmentId,
  errorMessage,
}: {
  componentId: string;
  renderId: string;
  environmentId: string | null;
  errorMessage: string | null;
}) {
  const executionId = appStore.use((state) => state.executionId);
  const dispatch = appStore.use((state) => state.dispatch);
  const component = appStore.use(
    (state) =>
      state.flattenedModel[renderId][
        componentId
      ] as appStore.FrontendComponentModel.WithInputInteraction
  );
  const componentOutput = appStore.use(
    (state) =>
      state.flattenedOutput[renderId][
        componentId
      ] as appStore.FrontendComponentOutput.WithInputInteraction
  );

  const { transferFiles } = useTransferFiles(environmentId, executionId);

  const { sendWSJsonMessage } = useWSContext();

  const onInputHook = useCallback(async () => {
    if (!executionId || !environmentId) {
      return;
    }

    const isEnterHook = UI.InputComponentTypes.isEnterType(component);
    const isSelectHook = UI.InputComponentTypes.isSelectType(component);
    const isFileChangeHook = UI.InputComponentTypes.isFileChangeType(component);

    if (!isEnterHook && !isSelectHook && !isFileChangeHook) {
      return;
    }

    // Ignore enter hooks if the input is in a form, since pressing enter
    // will submit the form.
    if (component.formId !== null && isEnterHook) {
      return;
    }

    if (
      (isEnterHook && component.model.properties.hasOnEnterHook === false) ||
      (isSelectHook && component.model.properties.hasOnSelectHook === false) ||
      (isFileChangeHook &&
        component.model.properties.hasOnFileChangeHook === false)
    ) {
      return;
    }

    dispatch({
      type: appStore.EVENT_TYPE.SHOW_INPUT_LOCAL_ERRORS,
      properties: { componentId, renderId },
    });

    const hasError = componentOutput.validation.localErrorMessage !== null;
    if (hasError) {
      return;
    }

    const value = componentOutput.output.networkTransferValue;

    dispatch({
      type: appStore.EVENT_TYPE.REMOVE_INPUT_REMOTE_ERRORS,
      properties: { componentId, renderId },
    });

    if (isEnterHook) {
      sendWSJsonMessage(
        {
          type: BrowserToServerEvent.WS.TYPE.ON_ENTER_HOOK,
          componentId,
          renderId,
          executionId,
          value: value as BrowserToServerEvent.WS.OnEnterHook.Data["value"],
        },
        environmentId
      );
    } else if (isSelectHook) {
      sendWSJsonMessage(
        {
          type: BrowserToServerEvent.WS.TYPE.ON_SELECT_HOOK,
          componentId,
          renderId,
          executionId,
          value: value as BrowserToServerEvent.WS.OnSelectHook.Data["value"],
        },
        environmentId
      );
    } else if (isFileChangeHook) {
      if (
        componentOutput.type === UI.TYPE.INPUT_FILE_DROP &&
        componentOutput.output.networkTransferValue.length > 0
      ) {
        await transferFiles(componentOutput);
      }

      sendWSJsonMessage(
        {
          type: BrowserToServerEvent.WS.TYPE.ON_FILE_CHANGE_HOOK,
          componentId,
          renderId,
          executionId,
          value:
            value as BrowserToServerEvent.WS.OnFileChangeHook.Data["value"],
        },
        environmentId
      );
    }
  }, [
    component,
    componentOutput,
    dispatch,
    environmentId,
    executionId,
    componentId,
    renderId,
    sendWSJsonMessage,
    transferFiles,
  ]);

  const networkTransferValue = useRef<
    UI.Components.AllWithInputInteraction["output"]["networkTransferValue"]
  >(componentOutput.output.networkTransferValue);

  // For onSelect and onFileChange events, we check if the networkTransferValue
  // has changed to trigger the onInputHook event. We want this to run after
  // the dispatch event completes, so that the `onInputHook` fn runs with the
  // most recent values.
  useEffect(() => {
    if (
      (UI.InputComponentTypes.isSelectType(component) &&
        component.model.properties.hasOnSelectHook) ||
      (UI.InputComponentTypes.isFileChangeType(component) &&
        component.model.properties.hasOnFileChangeHook)
    ) {
      if (
        networkTransferValue.current !==
        componentOutput.output.networkTransferValue
      ) {
        networkTransferValue.current =
          componentOutput.output.networkTransferValue;
        onInputHook();
      }
    }
  }, [component, componentOutput, onInputHook]);

  if (
    component.type === UI.TYPE.INPUT_CHECKBOX &&
    componentOutput.type === UI.TYPE.INPUT_CHECKBOX
  ) {
    return (
      <Checkbox
        checked={componentOutput.output.internalValue}
        setChecked={(newValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_CHECKBOX_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue: newValue,
              renderId,
            },
          })
        }
        label={component.model.label}
        description={component.model.description}
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_NUMBER &&
    componentOutput.type === UI.TYPE.INPUT_NUMBER
  ) {
    return (
      <NumberInput
        label={component.model.label}
        description={component.model.description}
        value={componentOutput.output.internalValue}
        setValue={(internalValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_NUMBER_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue,
              renderId,
            },
          })
        }
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
        onEnter={
          component.model.properties.hasOnEnterHook ? onInputHook : undefined
        }
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_DATE &&
    componentOutput.type === UI.TYPE.INPUT_DATE
  ) {
    return (
      <DateInput
        label={component.model.label}
        description={component.model.description}
        value={componentOutput.output.internalValue}
        setValue={(internalValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_DATE_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue,
              renderId,
            },
          })
        }
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
        onEnter={
          component.model.properties.hasOnEnterHook ? onInputHook : undefined
        }
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_TIME &&
    componentOutput.type === UI.TYPE.INPUT_TIME
  ) {
    return (
      <TimeInput
        label={component.model.label}
        description={component.model.description}
        value={componentOutput.output.internalValue}
        setValue={(internalValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_TIME_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue,
              renderId,
            },
          })
        }
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
        onEnter={
          component.model.properties.hasOnEnterHook ? onInputHook : undefined
        }
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_DATE_TIME &&
    componentOutput.type === UI.TYPE.INPUT_DATE_TIME
  ) {
    return (
      <DateTimeInput
        label={component.model.label}
        description={component.model.description}
        value={componentOutput.output.internalValue}
        setValue={(internalValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_DATE_TIME_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue,
              renderId,
            },
          })
        }
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
        onEnter={
          component.model.properties.hasOnEnterHook ? onInputHook : undefined
        }
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_EMAIL &&
    componentOutput.type === UI.TYPE.INPUT_EMAIL
  ) {
    return (
      <EmailInput
        label={component.model.label}
        description={component.model.description}
        value={componentOutput.output.internalValue}
        setValue={(internalValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_TEXT_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue,
              renderId,
            },
          })
        }
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
        onEnter={
          component.model.properties.hasOnEnterHook ? onInputHook : undefined
        }
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_URL &&
    componentOutput.type === UI.TYPE.INPUT_URL
  ) {
    return (
      <UrlInput
        label={component.model.label}
        description={component.model.description}
        value={componentOutput.output.internalValue}
        setValue={(internalValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_TEXT_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue,
              renderId,
            },
          })
        }
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
        onEnter={
          component.model.properties.hasOnEnterHook ? onInputHook : undefined
        }
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_TEXT &&
    componentOutput.type === UI.TYPE.INPUT_TEXT
  ) {
    return (
      <TextInput
        label={component.model.label}
        description={component.model.description}
        value={componentOutput.output.internalValue}
        setValue={(internalValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_TEXT_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue,
              renderId,
            },
          })
        }
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
        onEnter={
          component.model.properties.hasOnEnterHook ? onInputHook : undefined
        }
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_JSON &&
    componentOutput.type === UI.TYPE.INPUT_JSON
  ) {
    return (
      <JsonEditor
        id={component.model.id}
        label={component.model.label}
        description={component.model.description}
        errorMessage={errorMessage}
        hasError={errorMessage !== null}
        value={componentOutput.output.internalValue}
        onChange={(newValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_JSON_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue: newValue,
              renderId,
            },
          })
        }
        inputStyle={textAreaInputStyle(component.model.style)}
        onEnter={
          component.model.properties.hasOnEnterHook ? onInputHook : undefined
        }
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_TEXT_AREA &&
    componentOutput.type === UI.TYPE.INPUT_TEXT_AREA
  ) {
    return (
      <TextAreaInput
        label={component.model.label}
        description={component.model.description}
        value={componentOutput.output.internalValue}
        setValue={(internalValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_TEXT_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue,
              renderId,
            },
          })
        }
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
        onEnter={
          component.model.properties.hasOnEnterHook ? onInputHook : undefined
        }
        inputStyle={textAreaInputStyle(component.model.style)}
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_PASSWORD &&
    componentOutput.type === UI.TYPE.INPUT_PASSWORD
  ) {
    return (
      <PasswordInput
        label={component.model.label}
        description={component.model.description}
        value={componentOutput.output.internalValue}
        setValue={(internalValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_TEXT_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue,
              renderId,
            },
          })
        }
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
        onEnter={
          component.model.properties.hasOnEnterHook ? onInputHook : undefined
        }
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_RADIO_GROUP &&
    componentOutput.type === UI.TYPE.INPUT_RADIO_GROUP
  ) {
    return (
      <RadioGroup
        label={component.model.label}
        description={component.model.description}
        value={componentOutput.output.internalValue}
        setValue={(internalValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_SELECT_SINGLE_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue,
              renderId,
            },
          })
        }
        options={component.model.properties.options}
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
        disabled={false}
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_SELECT_DROPDOWN_SINGLE &&
    componentOutput.type === UI.TYPE.INPUT_SELECT_DROPDOWN_SINGLE
  ) {
    return (
      <ComboboxSingle
        label={component.model.label}
        description={component.model.description}
        value={componentOutput.output.internalValue}
        setValue={(internalValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_SELECT_SINGLE_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue,
              renderId,
            },
          })
        }
        options={component.model.properties.options}
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
        disabled={false}
        id={component.model.id}
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_SELECT_DROPDOWN_MULTI &&
    componentOutput.type === UI.TYPE.INPUT_SELECT_DROPDOWN_MULTI
  ) {
    return (
      <ComboboxMulti
        label={component.model.label}
        description={component.model.description}
        value={componentOutput.output.internalValue}
        setValue={(internalValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_SELECT_MULTI_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue,
              renderId,
            },
          })
        }
        options={component.model.properties.options}
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
        disabled={false}
        id={component.model.id}
      />
    );
  }

  if (component.type === UI.TYPE.INPUT_TABLE) {
    return (
      <TableComponent
        componentId={componentId}
        renderId={renderId}
        environmentId={environmentId}
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
      />
    );
  }

  if (
    component.type === UI.TYPE.INPUT_FILE_DROP &&
    componentOutput.type === UI.TYPE.INPUT_FILE_DROP
  ) {
    return (
      <FileUpload
        value={componentOutput.output.internalValue}
        setValue={(internalValue) =>
          dispatch({
            type: appStore.EVENT_TYPE.UPDATE_FILE_UPLOAD_INPUT_VALUE,
            properties: {
              componentId: component.model.id,
              internalValue,
              renderId,
            },
          })
        }
        acceptedFileTypes={component.model.properties.acceptedFileTypes}
        label={component.model.label}
        description={component.model.description}
        hasError={errorMessage !== null}
        errorMessage={errorMessage}
      />
    );
  }
}

export default InputInteractionComponent;
