import { SelectOption, Table as TTable, BaseGeneric } from "../types";
import { BaseWithInputInteraction } from "./base";
import * as Components from "../components";

export interface Text<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputText["output"]["customerReturnedValue"];
    hasOnEnterHook: boolean;
  };
}

export interface Email<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputEmail["output"]["customerReturnedValue"];
    hasOnEnterHook: boolean;
  };
}

export interface Url<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputUrl["output"]["customerReturnedValue"];
    hasOnEnterHook: boolean;
  };
}

export interface Number<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputNumber["output"]["customerReturnedValue"];
    hasOnEnterHook: boolean;
  };
}

export interface Password<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputPassword["output"]["customerReturnedValue"];
    hasOnEnterHook: boolean;
  };
}

export interface RadioGroup<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
  TOptions extends SelectOption.List,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputRadioGroup["output"]["customerReturnedValue"];
    options: TOptions;
    hasOnSelectHook: boolean;
  };
}

export interface SelectDropdown<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
  TOptions extends SelectOption.List,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputSelectDropdown["output"]["customerReturnedValue"];
    options: TOptions;
    hasOnSelectHook: boolean;
  };
}

export interface MultiSelectDropdown<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
  TOptions extends SelectOption.List,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputMultiSelectDropdown["output"]["customerReturnedValue"];
    options: TOptions;
    minSelections: number;
    maxSelections: number;
    hasOnSelectHook: boolean;
  };
}

export interface Table<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialSelectedRows: number[];
    data: TTable.DataRow[];
    columns: TTable.Column<TTable.DataRow[]>[] | null;
    actions:
      | {
          label: string;
          surface?: boolean;
        }[]
      | null;
    allowSelect: boolean;
    minSelections: number;
    maxSelections: number;
    hasOnSelectHook: boolean;
    /**
     * The table model version.
     */
    v?: 1 | 2 | 3;
    paged?: boolean;
    notSearchable?: boolean;
    totalRecords?: number;
    offset?: number;
    pageSize?: number;
    searchQuery?: string | null;
    selectMode?: TTable.SelectionReturnType;
    overflow?: TTable.OverflowBehavior;
  };
}

export interface FileDrop<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    acceptedFileTypes: string[] | null;
    minCount: number;
    maxCount: number;
    hasOnFileChangeHook: boolean;
  };
}

export interface Date<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputDate["output"]["networkTransferValue"]["value"];
    min: NonNullable<
      Components.InputDate["output"]["networkTransferValue"]["value"]
    > | null;
    max: NonNullable<
      Components.InputDate["output"]["networkTransferValue"]["value"]
    > | null;
    hasOnEnterHook: boolean;
  };
}

export interface Time<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputTime["output"]["networkTransferValue"]["value"];
    min: NonNullable<
      Components.InputTime["output"]["networkTransferValue"]["value"]
    > | null;
    max: NonNullable<
      Components.InputTime["output"]["networkTransferValue"]["value"]
    > | null;
    hasOnEnterHook: boolean;
  };
}

export interface DateTime<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputDateTime["output"]["networkTransferValue"]["value"];
    min: NonNullable<
      Components.InputDateTime["output"]["networkTransferValue"]["value"]
    > | null;
    max: NonNullable<
      Components.InputDateTime["output"]["networkTransferValue"]["value"]
    > | null;
    hasOnEnterHook: boolean;
  };
}

export interface TextArea<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputTextArea["output"]["customerReturnedValue"];
    hasOnEnterHook: boolean;
  };
}

export interface Json<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputJson["output"]["customerReturnedValue"];
    hasOnEnterHook: boolean;
  };
}

export interface Checkbox<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction<TId, TRequired> {
  properties: {
    initialValue: Components.InputCheckbox["output"]["customerReturnedValue"];
    hasOnSelectHook: boolean;
  };
}
