import { UI } from "@composehq/ts-public";
import { Statistic } from "~/components/statistic";

function Statistics() {
  return (
    <div className="p-4 text-brand-neutral flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Statistic
          label="Total Users"
          value={135}
          delta={14}
          description="Since last month"
        />
      </div>
      <div className="flex-1">
        <Statistic
          label="Total Revenue"
          value={39211}
          delta={-0.06}
          format={UI.NumberFormat.OPTION.CURRENCY}
          deltaFormat={UI.NumberFormat.OPTION.PERCENT}
          description="Since last month"
        />
      </div>
      <div className="flex-1">
        <Statistic
          label="At Risk Accounts"
          value={12}
          delta={-1}
          isPositiveDelta={true}
          description="Since last month"
        />
      </div>
    </div>
  );
}

export default Statistics;
