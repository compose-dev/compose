import {
  AGGREGATOR,
  Aggregator,
  ChartSeries,
  DEFAULT_AGGREGATOR,
  LABEL_SERIES_KEY,
  SeriesData,
  SeriesInputData,
} from "./constants";

function aggregate(values: any[], aggregator: Aggregator): number {
  if (values.length === 0) {
    return 0;
  }

  let result: number = 0;

  if (aggregator === AGGREGATOR.COUNT) {
    result = values.length;
  }

  if (aggregator === AGGREGATOR.SUM) {
    result = values.reduce((a, b) => a + b, 0);
  }

  if (aggregator === AGGREGATOR.AVERAGE) {
    result = values.reduce((a, b) => a + b, 0) / values.length;
  }

  if (aggregator === AGGREGATOR.MIN) {
    result = Math.min(...values);
  }

  if (aggregator === AGGREGATOR.MAX) {
    result = Math.max(...values);
  }

  if (isNaN(result)) {
    throw new Error(
      `Invalid aggregate value: ${result}. Expected a number. This may be due to a non-numeric value in the dataset!`
    );
  }

  return result;
}

async function formatSeriesData<TData extends SeriesInputData>(
  data: TData,
  properties: {
    group?:
      | keyof TData[number]
      | ((
          row: TData[number],
          idx: number
        ) =>
          | string
          | number
          | null
          | undefined
          | Promise<string | number | null | undefined>);
    series?: ChartSeries<TData>[];
    aggregate?: Aggregator;
  }
): Promise<SeriesData> {
  // NOTE: Keep the grouping logic inlined. Putting it in a separate function
  // led to a 70% performance drop in our benchmarks.
  const groupedData: Record<string, number[]> = {};
  let groupKey: string | number | null = "group";

  for (const [idx, row] of data.entries()) {
    let groupLabel: string | number | null | undefined;

    if (typeof properties.group === "function") {
      groupKey = null;
      groupLabel = await properties.group(row, idx);
    } else if (
      typeof properties.group === "string" ||
      typeof properties.group === "number"
    ) {
      groupKey = properties.group;
      groupLabel = row[groupKey];
    } else if ("group" in row) {
      groupLabel = row.group;
    } else {
      continue;
    }

    if (groupLabel === null || groupLabel === undefined) {
      continue;
    }

    if (!groupedData[groupLabel]) {
      groupedData[groupLabel] = [idx];
    } else {
      groupedData[groupLabel].push(idx);
    }
  }

  const series =
    properties.series ??
    (data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== groupKey)
      : []);

  const finalData: SeriesData = [];

  for (const group in groupedData) {
    const row: SeriesData[number] = {
      [LABEL_SERIES_KEY]: group,
    };

    for (const [idx, serie] of series.entries()) {
      let values: any[] = [];
      let aggregator: Aggregator = properties.aggregate ?? DEFAULT_AGGREGATOR;

      let seriesLabel: string | number | null = null;

      // Case 1: Simple Series
      if (typeof serie === "string" || typeof serie === "number") {
        seriesLabel = serie;
        values = groupedData[group]
          .map((idx) => data[idx][serie])
          .filter((value) => value !== undefined && value !== null);
      } else {
        // Case 2: Advanced Series
        const value = serie.value;

        if (typeof value === "function") {
          values = await Promise.all(
            groupedData[group].map(async (idx) => await value(data[idx], idx))
          ).then((values) =>
            values.filter((value) => value !== undefined && value !== null)
          );
        } else if (typeof value === "string" || typeof value === "number") {
          values = groupedData[group]
            .map((idx) => data[idx][value])
            .filter((value) => value !== undefined && value !== null);
          seriesLabel = value;
        } else {
          throw new Error(
            `Invalid series value: ${value}. Expected a function or a string.`
          );
        }

        if (serie.aggregate) {
          aggregator = serie.aggregate;
        }

        if (serie.label) {
          seriesLabel = serie.label;
        }
      }

      if (!seriesLabel) {
        seriesLabel = `Series ${idx + 1}`;
      }

      if (seriesLabel === LABEL_SERIES_KEY) {
        throw new Error(
          `${LABEL_SERIES_KEY} is a reserved series label. Please use a different label.`
        );
      }

      row[seriesLabel] = aggregate(values, aggregator);
    }

    finalData.push(row);
  }

  return finalData;
}

export { formatSeriesData };
