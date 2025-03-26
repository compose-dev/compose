/**
 * This file represents the base types for all input values, before
 * applying any modifiers like required.
 */

import * as DateTime from "./datetime";
import * as SelectOption from "./selectOption";
import * as TTable from "./table";
import * as ComposeFile from "./composeFile";

/**
 * Represents any valid JSON value in TypeScript.
 * This includes primitives (string, number, boolean, null),
 * arrays of JSON values, and objects with string keys and JSON values.
 */
type BaseJson =
  | string
  | number
  | boolean
  | null
  | BaseJson[]
  | { [key: string]: BaseJson };

type Text = string;
type Email = string;
type Url = string;
type Number = number;
type Password = string;
type RadioGroup = SelectOption.Value;
type SelectDropdown = SelectOption.Value;
type MultiSelectDropdown = SelectOption.Value[];
type Table = TTable.DataRow[];
type FileDrop = ComposeFile.Type[];
type DateInput = DateTime.DateRepresentationWithJsDate;
type TimeInput = DateTime.TimeRepresentation;
type DateTimeInput = DateTime.DateTimeRepresentationWithJsDate;
type TextArea = string;
type Checkbox = boolean;
type Json = BaseJson;

export {
  Text,
  Email,
  Url,
  Number,
  Password,
  RadioGroup,
  SelectDropdown,
  MultiSelectDropdown,
  Table,
  FileDrop,
  Json,
  DateInput as Date,
  TimeInput as Time,
  DateTimeInput as DateTime,
  TextArea,
  Checkbox,
};
