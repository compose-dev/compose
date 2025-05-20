import {
  generateBoolean,
  generateCompanyName,
  generateNumber,
  generatePersonName,
  generateTier,
  generateEmail,
  generateDate,
} from "./data";

const DATA_TYPES = {
  companyName: "companyName",
  tier: "tier",
  number: "number",
  boolean: "boolean",
  personName: "personName",
  email: "email",
  date: "date",
} as const;

type DataType = keyof typeof DATA_TYPES;

interface BaseDataInput {
  type: DataType;
  key: string;
}

interface CompanyNameDataInput extends BaseDataInput {
  type: "companyName";
}

interface TierDataInput extends BaseDataInput {
  type: "tier";
}

interface NumberDataInput extends BaseDataInput {
  type: "number";
  min: number;
  max: number;
}

interface BooleanDataInput extends BaseDataInput {
  type: "boolean";
}

interface PersonNameDataInput extends BaseDataInput {
  type: "personName";
}

interface EmailDataInput extends BaseDataInput {
  type: "email";
}

interface DateDataInput extends BaseDataInput {
  type: "date";
  min: Date;
  max: Date;
}

type DataInput =
  | CompanyNameDataInput
  | TierDataInput
  | NumberDataInput
  | BooleanDataInput
  | PersonNameDataInput
  | EmailDataInput
  | DateDataInput;

function generateRow<T extends DataInput>(dataInputs: T[]) {
  const row: Record<string, string | number | boolean | Date> = {};

  const name = generatePersonName();

  for (const dataInput of dataInputs) {
    switch (dataInput.type) {
      case "companyName":
        row[dataInput.key] = generateCompanyName();
        break;
      case "tier":
        row[dataInput.key] = generateTier();
        break;
      case "number":
        row[dataInput.key] = generateNumber(dataInput.min, dataInput.max);
        break;
      case "boolean":
        row[dataInput.key] = generateBoolean();
        break;
      case "personName":
        row[dataInput.key] = name.full;
        break;
      case "email":
        row[dataInput.key] = generateEmail(name);
        break;
      case "date":
        row[dataInput.key] = generateDate(dataInput.min, dataInput.max);
        break;
      default:
        throw new Error(`Unknown data input: ${JSON.stringify(dataInput)}`);
    }
  }
  return row;
}

function generateRows<T extends DataInput>(dataInputs: T[], numRows: number) {
  return Array.from({ length: numRows }, () => generateRow(dataInputs));
}

export { generateRow, generateRows };
