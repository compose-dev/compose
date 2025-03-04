import { BarCanvas } from "@nivo/bar";
import ChartContainer from "../ChartContainer";
import { theme } from "~/utils/theme";
import { useMemo, useRef } from "react";

import { COLORS } from "../constants";
import { useSeriesChart } from "../useSeriesChart";
import { UI } from "@composehq/ts-public";
import { v4 as uuid } from "uuid";

const TICK_SIZE = 4;
const TICK_PADDING = 4;

export default function BarChart({
  data = [],
  keys = [],
  indexBy = "id",
  padding = 0.15,
  labelSkipWidth = 16,
  labelSkipHeight = 16,
  groupMode = UI.Chart.DEFAULT_BAR_GROUP_MODE,
  orientation = UI.Chart.DEFAULT_BAR_ORIENTATION,
  scale = UI.Chart.DEFAULT_SCALE,
  label,
  description,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  keys: string[];
  indexBy: string;
  padding?: number;
  labelSkipWidth?: number;
  labelSkipHeight?: number;
  groupMode?: UI.Chart.BarGroupMode;
  orientation?: UI.Chart.BarOrientation;
  scale?: UI.Chart.Scale;
  label?: string;
  description?: string;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const {
    margin,
    formatBottomAxisTick,
    formatLeftAxisTick,
    chartWidthPx,
    chartHeightPx,
    bottomAxisTilt,
  } = useSeriesChart(chartRef, data, indexBy, orientation, groupMode);

  const isDarkMode = theme.useIsDarkMode();

  const innerPadding = useMemo(() => {
    if (groupMode === UI.Chart.BAR_GROUP_MODE.GROUPED) {
      const chartLength =
        orientation === UI.Chart.BAR_ORIENTATION.HORIZONTAL
          ? chartHeightPx - margin.top - margin.bottom
          : chartWidthPx - margin.left - margin.right;

      if (chartLength / data.length < 56) {
        return 0;
      }

      return 2;
    }

    return 0;
  }, [
    groupMode,
    chartWidthPx,
    chartHeightPx,
    data.length,
    orientation,
    margin,
  ]);

  // Force the chart to completely re-render anytime the data or keys change.
  // This ensures that the legend colors and bar chart colors stay in sync. Before,
  // nivo would reserve already-used colors when the chart data changed and use new
  // colors for new bar groups. The legend colors would always cycle from the start
  // of the color palette regardless of old renders, which could lead to the
  // legend and bar chart having different colors.
  const uniqueKey = useMemo(() => {
    return uuid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, keys]);

  return (
    <ChartContainer label={label} description={description} legend={keys}>
      <div className="flex-1" ref={chartRef}>
        <BarCanvas
          key={uniqueKey}
          height={chartHeightPx}
          width={chartWidthPx}
          data={data}
          keys={keys}
          indexBy={indexBy}
          margin={margin}
          padding={padding}
          groupMode={groupMode}
          innerPadding={innerPadding}
          valueScale={{ type: scale }}
          indexScale={{ type: "band", round: true }}
          colors={COLORS}
          theme={{
            background: "transparent",
            text: {
              fill: isDarkMode ? "#9ca3af" : "#6b7280", // x/y axis label color. brand-neutral-text
            },
            labels: {
              text: {
                fill: "#ffffff", // labels within the bars
              },
            },
            axis: {
              ticks: {
                text: {
                  fontSize: 14, // x/y axis label font size
                },
                line: {
                  stroke: isDarkMode ? "#4d4d4d" : "#d1d5db", // x/y axis label tiny tick line color. brand-bg-overlay-3
                },
              },
            },
            grid: {
              line: {
                stroke: isDarkMode ? "#4d4d4d" : "#d1d5db", // grid line colors. brand-bg-overlay-3
                strokeWidth: 1,
              },
            },
            legends: {
              text: {
                fontSize: 14,
              },
            },
            tooltip: {
              container: {
                background: isDarkMode ? "#353535" : "#f3f4f6", // tooltip background color. brand-bg-overlay
                fontSize: 14,
                borderWidth: 1,
                borderColor: isDarkMode ? "#4d4d4d" : "#d1d5db", // tooltip border color. brand-neutral-border
                color: isDarkMode ? "#e5e7eb" : "#111827", // tooltip text color. brand-neutral-text
              },
            },
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: TICK_SIZE,
            tickPadding: TICK_PADDING,
            tickRotation: bottomAxisTilt,
            format: formatBottomAxisTick,
          }}
          axisLeft={{
            tickSize: TICK_SIZE,
            tickPadding: TICK_PADDING,
            tickRotation: 0,
            format: formatLeftAxisTick,
          }}
          labelSkipWidth={labelSkipWidth}
          labelSkipHeight={labelSkipHeight}
          layout={orientation}
          // layers={[
          //   "grid",
          //   "axes",
          //   "bars",
          //   "totals",
          //   "legends",
          //   "annotations",
          //   (props) => {
          //     console.log(props);
          //     return (
          //       <line
          //         x1={TICK_SIZE * -1}
          //         x2={chartWidthPx - margin.left - margin.right}
          //         y1={100}
          //         y2={100}
          //         stroke="#ffffff"
          //         stroke-width="2"
          //         strokeDasharray="10 5"
          //       ></line>
          //     );
          //   },
          // ]}
        />
      </div>
    </ChartContainer>
  );
}
