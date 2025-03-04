import { TYPE, type Type } from "./eventType";
import {
  RenderUI,
  FormValidationError,
  RerenderUI,
  AppError,
  PageConfig,
  ExecutionExistsResponse,
  InputValidationError,
  FileTransfer,
  Link,
  FormSubmissionSuccess,
  ReloadPage,
  Confirm,
  Toast,
  RerenderUIV2,
  SetInputs,
  CloseModal,
  UpdateLoading,
  TablePageChangeResponse,
  StaleStateUpdate,

  // new version where `executionId` is added to the header
  RenderUIV2,
  FormValidationErrorV2,
  AppErrorV2,
  PageConfigV2,
  ExecutionExistsResponseV2,
  InputValidationErrorV2,
  LinkV2,
  FormSubmissionSuccessV2,
  ReloadPageV2,
  ConfirmV2,
  ToastV2,
  RerenderUIV3,
  SetInputsV2,
  CloseModalV2,
  UpdateLoadingV2,
  TablePageChangeResponseV2,
  StaleStateUpdateV2,
  FileTransferV2,
} from "./events";

type Data =
  | RenderUI.Data
  | FormValidationError.Data
  | RerenderUI.Data
  | AppError.Data
  | PageConfig.Data
  | ExecutionExistsResponse.Data
  | InputValidationError.Data
  | FileTransfer.Data
  | Link.Data
  | FormSubmissionSuccess.Data
  | ReloadPage.Data
  | Confirm.Data
  | Toast.Data
  | RerenderUIV2.Data
  | SetInputs.Data
  | CloseModal.Data
  | UpdateLoading.Data
  | TablePageChangeResponse.Data
  | StaleStateUpdate.Data
  | RenderUIV2.Data
  | FormValidationErrorV2.Data
  | AppErrorV2.Data
  | PageConfigV2.Data
  | ExecutionExistsResponseV2.Data
  | InputValidationErrorV2.Data
  | LinkV2.Data
  | FormSubmissionSuccessV2.Data
  | ReloadPageV2.Data
  | ConfirmV2.Data
  | ToastV2.Data
  | RerenderUIV3.Data
  | SetInputsV2.Data
  | CloseModalV2.Data
  | UpdateLoadingV2.Data
  | TablePageChangeResponseV2.Data
  | StaleStateUpdateV2.Data
  | FileTransferV2.Data;

export {
  TYPE,
  RenderUI,
  FormValidationError,
  RerenderUI,
  AppError,
  PageConfig,
  ExecutionExistsResponse,
  InputValidationError,
  FileTransfer,
  Link,
  FormSubmissionSuccess,
  ReloadPage,
  Confirm,
  Toast,
  RerenderUIV2,
  SetInputs,
  CloseModal,
  UpdateLoading,
  TablePageChangeResponse,
  StaleStateUpdate,
  RenderUIV2,
  FormValidationErrorV2,
  AppErrorV2,
  PageConfigV2,
  ExecutionExistsResponseV2,
  InputValidationErrorV2,
  LinkV2,
  FormSubmissionSuccessV2,
  ReloadPageV2,
  ConfirmV2,
  ToastV2,
  RerenderUIV3,
  SetInputsV2,
  CloseModalV2,
  UpdateLoadingV2,
  TablePageChangeResponseV2,
  StaleStateUpdateV2,
  FileTransferV2,
  type Type,
  type Data,
};
