import { TYPE, type Type } from "./eventType";
import {
  StartExecution,
  OnClickHook,
  OnSubmitFormHook,
  CheckExecutionExists,
  OnEnterHook,
  OnSelectHook,
  OnFileChangeHook,
  OnTableRowActionHook,
  OnConfirmResponseHook,
  BrowserSessionEnded,
  OnCloseModal,
  OnTablePageChangeHook,
} from "./events";

type Data =
  | StartExecution.Data
  | OnClickHook.Data
  | OnSubmitFormHook.Data
  | CheckExecutionExists.Data
  | OnEnterHook.Data
  | OnSelectHook.Data
  | OnFileChangeHook.Data
  | OnTableRowActionHook.Data
  | OnConfirmResponseHook.Data
  | BrowserSessionEnded.Data
  | OnCloseModal.Data
  | OnTablePageChangeHook.Data;

export {
  TYPE,
  StartExecution,
  OnClickHook,
  OnSubmitFormHook,
  CheckExecutionExists,
  OnEnterHook,
  OnSelectHook,
  OnFileChangeHook,
  OnTableRowActionHook,
  OnConfirmResponseHook,
  BrowserSessionEnded,
  OnCloseModal,
  OnTablePageChangeHook,
  type Type,
  type Data,
};
