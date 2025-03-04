import { BaseWithButtonInteraction } from "./base";
import { ButtonAppearance, Chart, BaseGeneric } from "../types";

export interface Default<TId extends BaseGeneric.Id>
  extends BaseWithButtonInteraction<TId> {
  properties: {
    label: string | null;
    hasOnClickHook: boolean;
    appearance?: ButtonAppearance.Type;
  };
}

export interface FormSubmit<TId extends BaseGeneric.Id>
  extends BaseWithButtonInteraction<TId> {
  properties: {
    label: string | null;
    hasOnClickHook: boolean;
    appearance?: ButtonAppearance.Type;
  };
}

export interface BarChart<TId extends BaseGeneric.Id>
  extends BaseWithButtonInteraction<TId> {
  properties: {
    data: Chart.SeriesData;
    label?: string;
    description?: string;
    orientation?: Chart.BarOrientation;
    groupMode?: Chart.BarGroupMode;
    scale?: Chart.Scale;
  };
}

export interface LineChart<TId extends BaseGeneric.Id>
  extends BaseWithButtonInteraction<TId> {
  properties: {
    data: Chart.SeriesData;
    label?: string;
    description?: string;
  };
}
