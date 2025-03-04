import { BaseWithDisplayInteraction } from "./base";
import { DisplayText } from "../componentGenerators";
import {
  CodeLanguage,
  Annotation,
  Appearance,
  Size,
  BaseGeneric,
} from "../types";

export interface Text<TId extends BaseGeneric.Id>
  extends BaseWithDisplayInteraction<TId> {
  properties: {
    text: string | number | DisplayText | Array<string | number | DisplayText>;
    color?: Appearance.Text;
    size?: Size.Text;
  };
}

export interface None<TId extends BaseGeneric.Id>
  extends BaseWithDisplayInteraction<TId> {
  properties: {};
}

export interface Header<TId extends BaseGeneric.Id>
  extends BaseWithDisplayInteraction<TId> {
  properties: {
    text: string;
    color?: Appearance.Text;
    size?: Size.Header;
  };
}

interface JsonObject {
  [key: string | number | symbol]:
    | string
    | number
    | boolean
    | Date
    | RegExp
    | null
    | undefined
    | Set<any>
    | Map<any, any>
    | JsonObject
    | JsonArray;
}

type JsonArray = Array<
  | string
  | number
  | boolean
  | Date
  | RegExp
  | null
  | undefined
  | Set<any>
  | Map<any, any>
  | JsonObject
  | JsonArray
>;

export interface Json<TId extends BaseGeneric.Id>
  extends BaseWithDisplayInteraction<TId> {
  properties: {
    label: string | null;
    description: string | null;
    json: JsonObject | JsonArray | any;
  };
}

export interface Spinner<TId extends BaseGeneric.Id>
  extends BaseWithDisplayInteraction<TId> {
  properties: {
    text: string | null;
  };
}

export interface Code<TId extends BaseGeneric.Id>
  extends BaseWithDisplayInteraction<TId> {
  properties: {
    code: string;
    label?: string;
    description?: string;
    lang?: CodeLanguage.LanguageName;
  };
}

export interface Image<TId extends BaseGeneric.Id>
  extends BaseWithDisplayInteraction<TId> {
  properties: {
    src: string;
  };
}

export interface Markdown<TId extends BaseGeneric.Id>
  extends BaseWithDisplayInteraction<TId> {
  properties: {
    markdown: string;
  };
}

export interface Pdf<TId extends BaseGeneric.Id>
  extends BaseWithDisplayInteraction<TId> {
  properties: {
    base64: string;
    annotations?: Annotation[];
    label?: string;
    description?: string;
    scroll?: "vertical" | "horizontal";
  };
}
