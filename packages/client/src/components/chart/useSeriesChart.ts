import { u } from "@compose/ts";
import { UI } from "@composehq/ts-public";
import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_MARGIN = 16;
const TEXT_HEIGHT = 16; // hand calculated for nivo bar chart 14px font
const GROUP_LABEL_SPACING = 8;

const useElementDimensions = (ref: React.RefObject<HTMLDivElement>) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    let timeoutId: NodeJS.Timeout;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setWidth(entries[0].contentRect.width);
          setHeight(entries[0].contentRect.height);
        }, 50);
      }
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [ref]);

  return { width, height };
};

function calculateLabelLength(str: string) {
  const chars = str.split("");

  const width = chars.reduce((acc, char) => {
    return (
      acc +
      (u.string.SANS_SERIF_14_CHAR_WIDTH[
        char as keyof typeof u.string.SANS_SERIF_14_CHAR_WIDTH
      ] || 8.5)
    );
  }, 0);

  return width;
}

export function useSeriesChart(
  chartRef: React.RefObject<HTMLDivElement>,
  data: UI.Chart.SeriesData,
  indexBy: string,
  orientation: UI.Chart.BarOrientation,
  groupMode: UI.Chart.BarGroupMode
) {
  const { width: chartWidthPx, height: chartHeightPx } =
    useElementDimensions(chartRef);

  const labelToIndex: Record<string | number, number> = useMemo(() => {
    return data.reduce<Record<string | number, number>>((acc, row, idx) => {
      acc[row[indexBy]] = idx;
      return acc;
    }, {});
  }, [data, indexBy]);

  const maxDigitLength = useMemo(() => {
    const { max, min } = data.reduce<{ max: number; min: number }>(
      ({ max, min }, row) => {
        const values = Object.values(row).filter(
          (value) => typeof value === "number"
        );
        return {
          max:
            groupMode === UI.Chart.BAR_GROUP_MODE.GROUPED
              ? Math.max(max, ...values)
              : Math.max(
                  max,
                  values.reduce((a, b) => a + b, 0)
                ),
          min:
            groupMode === UI.Chart.BAR_GROUP_MODE.GROUPED
              ? Math.min(min, ...values)
              : Math.min(
                  min,
                  values.reduce((a, b) => a + b, 0)
                ),
        };
      },
      { max: 0, min: 0 }
    );

    const mightIncludeDecimals =
      (max <= 8 && min >= 0) ||
      (min >= -8 && max <= 0) ||
      (max - min < 8 && max >= 0 && min <= 0);

    return Math.max(
      calculateLabelLength(Math.round(max).toString()),
      calculateLabelLength(Math.round(min).toString()),
      mightIncludeDecimals ? calculateLabelLength("0.5") : 0
    );
  }, [data, groupMode]);

  const maxLabelLength = useMemo(() => {
    return data.reduce((max, row) => {
      const label = row[indexBy];
      return Math.max(max, calculateLabelLength(label.toString()));
    }, 0);
  }, [data, indexBy]);

  const maxTiltLabelLength = useMemo(() => {
    return u.math.getRotatedDimensions(maxLabelLength, TEXT_HEIGHT, 45)
      .newWidth;
  }, [maxLabelLength]);

  const shouldTiltLabels = useMemo(() => {
    const correctedWidth =
      chartWidthPx - (DEFAULT_MARGIN + maxDigitLength) - DEFAULT_MARGIN;
    return (
      correctedWidth / (maxLabelLength + GROUP_LABEL_SPACING) < data.length
    );
  }, [chartWidthPx, maxLabelLength, data.length, maxDigitLength]);

  const margin = useMemo(() => {
    if (orientation === UI.Chart.BAR_ORIENTATION.HORIZONTAL) {
      return {
        top: DEFAULT_MARGIN,
        right: DEFAULT_MARGIN,
        bottom: DEFAULT_MARGIN + TEXT_HEIGHT,
        left: maxLabelLength + DEFAULT_MARGIN,
      };
    }

    const leftMarginFromDigits = DEFAULT_MARGIN + maxDigitLength;

    const correctedWidth = chartWidthPx - leftMarginFromDigits - DEFAULT_MARGIN;
    const groupWidth = correctedWidth / data.length;

    const leftMarginFromTiltedLabels = maxTiltLabelLength - groupWidth;

    if (shouldTiltLabels) {
      return {
        top: DEFAULT_MARGIN,
        right: DEFAULT_MARGIN,
        bottom: maxTiltLabelLength + DEFAULT_MARGIN,
        left: Math.max(leftMarginFromDigits, leftMarginFromTiltedLabels),
      };
    }

    return {
      top: DEFAULT_MARGIN,
      right: DEFAULT_MARGIN,
      bottom: DEFAULT_MARGIN + TEXT_HEIGHT,
      left: leftMarginFromDigits,
    };
  }, [
    orientation,
    maxLabelLength,
    shouldTiltLabels,
    maxDigitLength,
    maxTiltLabelLength,
    chartWidthPx,
    data.length,
  ]);

  const maxNumOfLabels = useMemo(() => {
    const chartLength =
      orientation === UI.Chart.BAR_ORIENTATION.HORIZONTAL
        ? chartHeightPx - margin.top - margin.bottom
        : chartWidthPx - margin.left - margin.right;

    if (orientation === UI.Chart.BAR_ORIENTATION.HORIZONTAL) {
      return Math.floor(chartLength / (TEXT_HEIGHT + GROUP_LABEL_SPACING));
    }

    if (shouldTiltLabels) {
      return Math.floor(chartLength / (TEXT_HEIGHT + GROUP_LABEL_SPACING));
    }

    return Math.floor(chartLength / (maxLabelLength + GROUP_LABEL_SPACING));
  }, [
    orientation,
    chartWidthPx,
    chartHeightPx,
    maxLabelLength,
    shouldTiltLabels,
    margin,
  ]);

  const formatBottomAxisTick = useCallback(
    (value: string) => {
      {
        if (orientation === "horizontal") {
          return value;
        }

        if (data.length < maxNumOfLabels) {
          return value;
        }

        const skipCount = Math.ceil(data.length / maxNumOfLabels);

        return labelToIndex[value] % skipCount === 0 ? value : "";
      }
    },
    [orientation, data.length, maxNumOfLabels, labelToIndex]
  );

  const formatLeftAxisTick = useCallback(
    (value: string) => {
      if (orientation === "vertical") {
        return value;
      }

      if (data.length < maxNumOfLabels) {
        return value;
      }

      const skipCount = Math.ceil(data.length / maxNumOfLabels);

      return labelToIndex[value] % skipCount === 0 ? value : "";
    },
    [orientation, data.length, maxNumOfLabels, labelToIndex]
  );

  const bottomAxisTilt = useMemo(() => {
    return orientation === "vertical" && shouldTiltLabels ? -45 : 0;
  }, [orientation, shouldTiltLabels]);

  return {
    margin,
    maxNumOfLabels,
    formatBottomAxisTick,
    formatLeftAxisTick,
    chartWidthPx,
    chartHeightPx,
    bottomAxisTilt,
  };
}
