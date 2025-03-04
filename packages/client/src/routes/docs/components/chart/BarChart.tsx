import { DOC_TYPE, DocType } from "../../type";
import { UI } from "@composehq/ts-public";
import { useEffect, useRef, useState } from "react";
import { BarChart as BarChartComponent } from "~/components/chart/bar-chart";

const BAR_CHART_DATA = {
  REGIONAL: [
    { month: "Jan", California: 95, Texas: 120, "New York": 310 },
    { month: "Feb", California: 105, Texas: 135, "New York": 290 },
    { month: "Mar", California: 120, Texas: 155, "New York": 340 },
    { month: "Apr", California: 145, Texas: 165, "New York": 320 },
    { month: "May", California: 160, Texas: 190, "New York": 380 },
    { month: "Jun", California: 155, Texas: 210, "New York": 410 },
    { month: "Jul", California: 180, Texas: 200, "New York": 390 },
    { month: "Aug", California: 210, Texas: 230, "New York": 450 },
    { month: "Sep", California: 200, Texas: 245, "New York": 430 },
    { month: "Oct", California: 230, Texas: 260, "New York": 470 },
    { month: "Nov", California: 220, Texas: 280, "New York": 490 },
    { month: "Dec", California: 250, Texas: 300, "New York": 520 },
  ],
  BY_SALE: [
    { date: "2023-01-15", product: "Laptop", revenue: 2500 },
    { date: "2023-02-22", product: "Monitor", revenue: 800 },
    { date: "2023-02-05", product: "Laptop", revenue: 2200 },
    { date: "2023-02-18", product: "Monitor", revenue: 900 },
    { date: "2023-03-10", product: "Laptop", revenue: 2800 },
    { date: "2023-03-25", product: "Monitor", revenue: 750 },
  ],
  PRODUCT_TO_COST: {
    Laptop: 1000,
    Monitor: 500,
    Keyboard: 100,
  },
  KITCHEN_SINK: [
    { date: "2023-01-03", product: "Laptop" },
    { date: "2023-01-07", product: "Monitor" },
    { date: "2023-01-12", product: "Laptop" },
    { date: "2023-01-15", product: "Keyboard" },
    { date: "2023-01-22", product: "Monitor" },
    { date: "2023-01-28", product: "Laptop" },
    { date: "2023-01-31", product: "Monitor" },
    { date: "2023-02-02", product: "Keyboard" },
    { date: "2023-02-05", product: "Laptop" },
    { date: "2023-02-08", product: "Monitor" },
    { date: "2023-02-15", product: "Laptop" },
    { date: "2023-02-19", product: "Monitor" },
    { date: "2023-02-24", product: "Laptop" },
    { date: "2023-02-27", product: "Keyboard" },
    { date: "2023-03-01", product: "Monitor" },
    { date: "2023-03-03", product: "Laptop" },
    { date: "2023-03-08", product: "Monitor" },
    { date: "2023-03-12", product: "Laptop" },
    { date: "2023-03-18", product: "Monitor" },
    { date: "2023-03-25", product: "Laptop" },
    { date: "2023-03-29", product: "Monitor" },
    { date: "2023-04-02", product: "Laptop" },
    { date: "2023-04-05", product: "Monitor" },
    { date: "2023-04-09", product: "Keyboard" },
    { date: "2023-04-15", product: "Laptop" },
    { date: "2023-04-18", product: "Monitor" },
    { date: "2023-04-22", product: "Laptop" },
    { date: "2023-04-27", product: "Monitor" },
    { date: "2023-05-01", product: "Laptop" },
    { date: "2023-05-04", product: "Monitor" },
    { date: "2023-05-08", product: "Laptop" },
    { date: "2023-05-12", product: "Keyboard" },
    { date: "2023-05-15", product: "Monitor" },
    { date: "2023-05-19", product: "Laptop" },
    { date: "2023-05-23", product: "Monitor" },
    { date: "2023-05-28", product: "Laptop" },
    { date: "2023-06-02", product: "Monitor" },
    { date: "2023-06-05", product: "Laptop" },
    { date: "2023-06-09", product: "Keyboard" },
    { date: "2023-06-13", product: "Monitor" },
    { date: "2023-06-17", product: "Laptop" },
    { date: "2023-06-22", product: "Monitor" },
    { date: "2023-06-26", product: "Laptop" },
    { date: "2023-06-30", product: "Monitor" },
    { date: "2023-07-03", product: "Laptop" },
    { date: "2023-07-07", product: "Monitor" },
    { date: "2023-07-11", product: "Keyboard" },
    { date: "2023-07-15", product: "Laptop" },
    { date: "2023-07-19", product: "Monitor" },
    { date: "2023-07-24", product: "Laptop" },
    { date: "2023-07-28", product: "Monitor" },
    { date: "2023-08-02", product: "Laptop" },
    { date: "2023-08-06", product: "Monitor" },
    { date: "2023-08-10", product: "Keyboard" },
    { date: "2023-08-14", product: "Laptop" },
    { date: "2023-08-18", product: "Monitor" },
    { date: "2023-08-22", product: "Laptop" },
    { date: "2023-08-26", product: "Monitor" },
    { date: "2023-08-30", product: "Laptop" },
    { date: "2023-09-03", product: "Monitor" },
    { date: "2023-09-07", product: "Laptop" },
    { date: "2023-09-11", product: "Keyboard" },
    { date: "2023-09-15", product: "Monitor" },
    { date: "2023-09-19", product: "Laptop" },
    { date: "2023-09-23", product: "Monitor" },
    { date: "2023-09-27", product: "Laptop" },
    { date: "2023-10-01", product: "Monitor" },
    { date: "2023-10-05", product: "Laptop" },
    { date: "2023-10-09", product: "Keyboard" },
    { date: "2023-10-13", product: "Monitor" },
    { date: "2023-10-17", product: "Laptop" },
    { date: "2023-10-21", product: "Monitor" },
    { date: "2023-10-25", product: "Laptop" },
    { date: "2023-10-29", product: "Monitor" },
    { date: "2023-11-02", product: "Laptop" },
    { date: "2023-11-06", product: "Monitor" },
    { date: "2023-11-10", product: "Keyboard" },
    { date: "2023-11-14", product: "Monitor" },
    { date: "2023-11-18", product: "Laptop" },
    { date: "2023-11-22", product: "Monitor" },
    { date: "2023-11-26", product: "Laptop" },
    { date: "2023-11-30", product: "Monitor" },
    { date: "2023-12-01", product: "Laptop" },
    { date: "2023-12-03", product: "Monitor" },
    { date: "2023-12-05", product: "Laptop" },
    { date: "2023-12-07", product: "Monitor" },
    { date: "2023-12-09", product: "Keyboard" },
    { date: "2023-12-11", product: "Monitor" },
    { date: "2023-12-13", product: "Laptop" },
    { date: "2023-12-15", product: "Monitor" },
    { date: "2023-12-17", product: "Laptop" },
    { date: "2023-12-19", product: "Monitor" },
    { date: "2023-12-21", product: "Laptop" },
    { date: "2023-12-23", product: "Monitor" },
    { date: "2023-12-25", product: "Keyboard" },
    { date: "2023-12-27", product: "Monitor" },
    { date: "2023-12-29", product: "Laptop" },
    { date: "2023-12-31", product: "Monitor" },
  ],
};

function getMonth(row: { date: string }) {
  return new Date(row.date).toLocaleString("default", {
    month: "short",
    year: "2-digit",
  });
}

function ChartContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[28rem] h-[28rem] p-4 overflow-clip">{children}</div>
  );
}

export default function BarChart({ type }: { type: DocType }) {
  const [data, setData] = useState<UI.Chart.SeriesData | null>(null);
  const didFormat = useRef(false);

  useEffect(() => {
    async function formatData() {
      if (type === DOC_TYPE["bar-chart-component"]) {
        const formatted = await UI.Chart.formatSeriesData(
          BAR_CHART_DATA.REGIONAL,
          {
            group: "month",
            series: ["California", "Texas", "New York"],
          }
        );
        setData(formatted);
      }

      if (type === DOC_TYPE["bar-chart-group-data"]) {
        const formatted = await UI.Chart.formatSeriesData(
          BAR_CHART_DATA.BY_SALE,
          {
            group: (row) =>
              new Date(row.date).toLocaleString("default", { month: "long" }),
            series: ["revenue"],
          }
        );
        setData(formatted);
      }

      if (type === DOC_TYPE["bar-chart-aggregate-data"]) {
        const formatted = await UI.Chart.formatSeriesData(
          BAR_CHART_DATA.BY_SALE,
          {
            group: (row) =>
              new Date(row.date).toLocaleString("default", { month: "long" }),
            series: ["product"],
            aggregate: "count",
          }
        );
        setData(formatted);
      }

      if (type === DOC_TYPE["bar-chart-simple-series"]) {
        const formatted = await UI.Chart.formatSeriesData(
          BAR_CHART_DATA.REGIONAL,
          {
            group: "month",
            series: ["California", "Texas"],
          }
        );
        setData(formatted);
      }

      if (type === DOC_TYPE["bar-chart-advanced-series"]) {
        const formatted = await UI.Chart.formatSeriesData(
          BAR_CHART_DATA.REGIONAL,
          {
            group: "month",
            series: [
              { label: "Midwest", value: (row) => row.California + row.Texas },
            ],
          }
        );
        setData(formatted);
      }

      if (type === DOC_TYPE["bar-chart-kitchen-sink"]) {
        const formatted = await UI.Chart.formatSeriesData(
          BAR_CHART_DATA.KITCHEN_SINK,
          {
            group: getMonth,
            series: Object.keys(BAR_CHART_DATA.PRODUCT_TO_COST).map(
              (product) => ({
                label: product,
                value: (row) => {
                  if (row.product === product) {
                    return BAR_CHART_DATA.PRODUCT_TO_COST[
                      product as keyof typeof BAR_CHART_DATA.PRODUCT_TO_COST
                    ];
                  }
                  return 0;
                },
              })
            ),
          }
        );
        setData(formatted);
      }
    }

    if (!didFormat.current) {
      formatData();
      didFormat.current = true;
    }
  }, [data, type]);

  if (data === null) {
    return null;
  }

  if (type === DOC_TYPE["bar-chart-component"]) {
    return (
      <ChartContainer>
        <BarChartComponent
          data={data}
          keys={Object.keys(data[0]).filter(
            (key) => key !== UI.Chart.LABEL_SERIES_KEY
          )}
          indexBy={UI.Chart.LABEL_SERIES_KEY}
          groupMode="grouped"
          label="Monthly Sales by Region"
        />
      </ChartContainer>
    );
  }

  if (type === DOC_TYPE["bar-chart-group-data"]) {
    return (
      <ChartContainer>
        <BarChartComponent
          data={data}
          keys={Object.keys(data[0]).filter(
            (key) => key !== UI.Chart.LABEL_SERIES_KEY
          )}
          indexBy={UI.Chart.LABEL_SERIES_KEY}
          label="Monthly Revenue"
        />
      </ChartContainer>
    );
  }

  if (type === DOC_TYPE["bar-chart-aggregate-data"]) {
    return (
      <ChartContainer>
        <BarChartComponent
          data={data}
          keys={Object.keys(data[0]).filter(
            (key) => key !== UI.Chart.LABEL_SERIES_KEY
          )}
          indexBy={UI.Chart.LABEL_SERIES_KEY}
          label="Products Sold by Month"
          groupMode="grouped"
        />
      </ChartContainer>
    );
  }

  if (type === DOC_TYPE["bar-chart-simple-series"]) {
    return (
      <ChartContainer>
        <BarChartComponent
          data={data}
          keys={Object.keys(data[0]).filter(
            (key) => key !== UI.Chart.LABEL_SERIES_KEY
          )}
          indexBy={UI.Chart.LABEL_SERIES_KEY}
          label="Monthly Sales by Region (CA & TX)"
          groupMode="grouped"
        />
      </ChartContainer>
    );
  }

  if (type === DOC_TYPE["bar-chart-advanced-series"]) {
    return (
      <ChartContainer>
        <BarChartComponent
          data={data}
          keys={Object.keys(data[0]).filter(
            (key) => key !== UI.Chart.LABEL_SERIES_KEY
          )}
          indexBy={UI.Chart.LABEL_SERIES_KEY}
          label="Monthly Sales for Midwest"
        />
      </ChartContainer>
    );
  }

  if (type === DOC_TYPE["bar-chart-kitchen-sink"]) {
    return (
      <ChartContainer>
        <BarChartComponent
          data={data}
          keys={Object.keys(data[0]).filter(
            (key) => key !== UI.Chart.LABEL_SERIES_KEY
          )}
          indexBy={UI.Chart.LABEL_SERIES_KEY}
          label="Monthly Revenue by Product"
        />
      </ChartContainer>
    );
  }

  return null;
}
