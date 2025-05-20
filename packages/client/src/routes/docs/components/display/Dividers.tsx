import { Statistic } from "~/components/statistic";
import { Divider } from "~/components/divider";

function Dividers() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <Statistic label="Active Users" value={1250} />
      <Divider />
      <Statistic label="Sign Ups" value={320} />
      <Divider />
      <Statistic label="Churned Users" value={12} />
    </div>
  );
}

export default Dividers;
