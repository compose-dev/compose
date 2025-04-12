import { Generator } from "@composehq/ts-public";

interface UIHandler {
  textInput: typeof Generator.input.text;
  numberInput: typeof Generator.input.number;
  emailInput: typeof Generator.input.email;
  urlInput: typeof Generator.input.url;
  passwordInput: typeof Generator.input.password;
  radioGroup: typeof Generator.input.radioGroup;
  selectBox: typeof Generator.input.selectBox;
  multiSelectBox: typeof Generator.input.multiSelectBox;
  table: typeof Generator.input.table;
  fileDrop: typeof Generator.input.fileDrop;
  dateInput: typeof Generator.input.date;
  timeInput: typeof Generator.input.time;
  dateTimeInput: typeof Generator.input.dateTime;
  textArea: typeof Generator.input.textArea;
  jsonInput: typeof Generator.input.json;
  checkbox: typeof Generator.input.checkbox;
  text: typeof Generator.display.text;
  header: typeof Generator.display.header;
  json: typeof Generator.display.json;
  spinner: typeof Generator.display.spinner;
  code: typeof Generator.display.code;
  image: typeof Generator.display.image;
  markdown: typeof Generator.display.markdown;
  pdf: typeof Generator.display.pdf;
  divider: typeof Generator.display.divider;
  button: typeof Generator.button.default;
  submitButton: typeof Generator.button.formSubmit;
  stack: typeof Generator.layout.stack;
  row: typeof Generator.layout.row;
  distributedRow: typeof Generator.layout.distributedRow;
  card: typeof Generator.layout.card;
  form: typeof Generator.layout.form;
  cond: typeof Generator.dynamic.cond;
  barChart: typeof Generator.button.barChart;
  forEach: typeof Generator.dynamic.forEach;
}

const ui: UIHandler = {
  // Inputs
  textInput: Generator.input.text,
  numberInput: Generator.input.number,
  emailInput: Generator.input.email,
  urlInput: Generator.input.url,
  passwordInput: Generator.input.password,
  radioGroup: Generator.input.radioGroup,
  selectBox: Generator.input.selectBox,
  multiSelectBox: Generator.input.multiSelectBox,
  table: Generator.input.table,
  fileDrop: Generator.input.fileDrop,
  dateInput: Generator.input.date,
  timeInput: Generator.input.time,
  dateTimeInput: Generator.input.dateTime,
  textArea: Generator.input.textArea,
  jsonInput: Generator.input.json,
  checkbox: Generator.input.checkbox,

  // Display
  text: Generator.display.text,
  header: Generator.display.header,
  json: Generator.display.json,
  spinner: Generator.display.spinner,
  code: Generator.display.code,
  image: Generator.display.image,
  markdown: Generator.display.markdown,
  pdf: Generator.display.pdf,
  divider: Generator.display.divider,

  // Button
  button: Generator.button.default,
  submitButton: Generator.button.formSubmit,
  barChart: Generator.button.barChart,

  // Layout
  stack: Generator.layout.stack,
  row: Generator.layout.row,
  distributedRow: Generator.layout.distributedRow,
  card: Generator.layout.card,
  form: Generator.layout.form,

  // Dynamic
  cond: Generator.dynamic.cond,
  forEach: Generator.dynamic.forEach,
};

export { ui };
