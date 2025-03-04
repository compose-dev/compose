import { type AppStore } from "../types";

import * as AppError from "../error";

import { RestartAppEvent, restartApp } from "./eventHandlers/restartApp";
import {
  AddRenderEvent,
  addRender,
  UpdateRendersEvent,
  updateRenders,
  UpdateRendersV2Event,
  updateRendersV2,
  CloseModalEvent,
  closeModal,
  tablePageChangeResponse,
  TablePageChangeResponseEvent,
  updateComponentStaleState,
  UpdateComponentStaleStateEvent,
} from "./eventHandlers/render";
import {
  UpdateFileUploadInputValueEvent,
  UpdateNumberInputValueEvent,
  UpdateSelectMultiInputValueEvent,
  UpdateSelectSingleInputValueEvent,
  updateTableInputValueEvent,
  UpdateTextInputValueEvent,
  UpdateDateInputValueEvent,
  UpdateTimeInputValueEvent,
  UpdateDateTimeInputValueEvent,
  UpdateCheckboxValueEvent,
  updateFileUploadInputValue,
  updateNumberInputValue,
  updateSelectMultiInputValue,
  updateSelectSingleInputValue,
  updateTableInputValue,
  updateTextInputValue,
  updateDateInputValue,
  updateTimeInputValue,
  updateDateTimeInputValue,
  updateCheckboxValue,
} from "./eventHandlers/updateInputValue";
import {
  ShowFormLocalErrorsEvent,
  showFormLocalErrors,
  ShowInputLocalErrorsEvent,
  showInputLocalErrors,
  RemoveInputRemoteErrorsEvent,
  removeInputRemoteErrors,
  RemoveFormRemoteErrorsEvent,
  removeFormRemoteErrors,
  AddRemoteFormValidationErrorsEvent,
  addRemoteFormValidationErrors,
  AddRemoteInputValidationErrorsEvent,
  addRemoteInputValidationErrors,
  FormSubmissionSuccessEvent,
  formSubmissionSuccess,
  SetInputsEvent,
  setInputs,
} from "./eventHandlers/formSubmission";
import {
  addPageConfirm,
  removePageConfirm,
  type AddPageConfirmEvent,
  type RemovePageConfirmEvent,
} from "./eventHandlers/pageConfirm";
import {
  AddAppErrorEvent,
  addAppError,
  RemoveAppErrorEvent,
  removeAppError,
} from "./eventHandlers/appError";
import {
  SetPageConfigEvent,
  setPageConfig,
} from "./eventHandlers/setPageConfig";
import {
  wentOffline,
  type WentOfflineEvent,
} from "./eventHandlers/wentOffline";
import {
  updateLoading,
  type UpdateLoadingEvent,
} from "./eventHandlers/updateLoading";

import { APP_RUNNER_EVENT_TYPE } from "./types";

type AppRunnerEvent =
  | RestartAppEvent
  | AddRenderEvent
  | UpdateRendersEvent
  | UpdateTextInputValueEvent
  | UpdateNumberInputValueEvent
  | UpdateDateInputValueEvent
  | UpdateTimeInputValueEvent
  | UpdateDateTimeInputValueEvent
  | UpdateSelectSingleInputValueEvent
  | UpdateSelectMultiInputValueEvent
  | updateTableInputValueEvent
  | UpdateFileUploadInputValueEvent
  | UpdateCheckboxValueEvent
  | ShowFormLocalErrorsEvent
  | ShowInputLocalErrorsEvent
  | RemoveFormRemoteErrorsEvent
  | RemoveInputRemoteErrorsEvent
  | AddRemoteFormValidationErrorsEvent
  | AddRemoteInputValidationErrorsEvent
  | AddAppErrorEvent
  | RemoveAppErrorEvent
  | SetPageConfigEvent
  | WentOfflineEvent
  | FormSubmissionSuccessEvent
  | SetInputsEvent
  | AddPageConfirmEvent
  | RemovePageConfirmEvent
  | UpdateRendersV2Event
  | CloseModalEvent
  | UpdateLoadingEvent
  | TablePageChangeResponseEvent
  | UpdateComponentStaleStateEvent;

function appRunnerReducer(
  appState: AppStore,
  event: AppRunnerEvent
): Partial<AppStore> {
  try {
    switch (event.type) {
      case APP_RUNNER_EVENT_TYPE.RESTART_APP: {
        return restartApp(event);
      }
      case APP_RUNNER_EVENT_TYPE.ADD_RENDER: {
        return addRender(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_RENDERS_V2: {
        return updateRendersV2(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.CLOSE_MODAL: {
        return closeModal(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_TEXT_INPUT_VALUE: {
        return updateTextInputValue(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_NUMBER_INPUT_VALUE: {
        return updateNumberInputValue(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_DATE_INPUT_VALUE: {
        return updateDateInputValue(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_TIME_INPUT_VALUE: {
        return updateTimeInputValue(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_DATE_TIME_INPUT_VALUE: {
        return updateDateTimeInputValue(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_SELECT_SINGLE_INPUT_VALUE: {
        return updateSelectSingleInputValue(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_SELECT_MULTI_INPUT_VALUE: {
        return updateSelectMultiInputValue(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_TABLE_INPUT_VALUE: {
        return updateTableInputValue(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_FILE_UPLOAD_INPUT_VALUE: {
        return updateFileUploadInputValue(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_CHECKBOX_INPUT_VALUE: {
        return updateCheckboxValue(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.SHOW_FORM_LOCAL_ERRORS: {
        return showFormLocalErrors(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.SHOW_INPUT_LOCAL_ERRORS: {
        return showInputLocalErrors(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.REMOVE_FORM_REMOTE_ERRORS: {
        return removeFormRemoteErrors(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.REMOVE_INPUT_REMOTE_ERRORS: {
        return removeInputRemoteErrors(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.ADD_REMOTE_FORM_VALIDATION_ERRORS: {
        return addRemoteFormValidationErrors(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.ADD_REMOTE_INPUT_VALIDATION_ERRORS: {
        return addRemoteInputValidationErrors(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.FORM_SUBMISSION_SUCCESS: {
        return formSubmissionSuccess(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_COMPONENT_STALE_STATE: {
        return updateComponentStaleState(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.TABLE_PAGE_CHANGE_RESPONSE: {
        return tablePageChangeResponse(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.SET_INPUTS: {
        return setInputs(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.ADD_APP_ERROR: {
        return addAppError(event);
      }
      case APP_RUNNER_EVENT_TYPE.REMOVE_APP_ERROR: {
        return removeAppError();
      }
      case APP_RUNNER_EVENT_TYPE.SET_PAGE_CONFIG: {
        return setPageConfig(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.WENT_OFFLINE: {
        return wentOffline();
      }
      case APP_RUNNER_EVENT_TYPE.ADD_PAGE_CONFIRM: {
        return addPageConfirm(event);
      }
      case APP_RUNNER_EVENT_TYPE.REMOVE_PAGE_CONFIRM: {
        return removePageConfirm();
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_LOADING: {
        return updateLoading(appState, event);
      }
      case APP_RUNNER_EVENT_TYPE.UPDATE_RENDERS: {
        return updateRenders(appState, event);
      }
    }
  } catch (error) {
    if (error instanceof AppError.AppError) {
      return {
        error: {
          severity: error.severity,
          message: error.message,
        },
      };
    }
  }

  return {};
}

export { appRunnerReducer, APP_RUNNER_EVENT_TYPE, type AppRunnerEvent };
