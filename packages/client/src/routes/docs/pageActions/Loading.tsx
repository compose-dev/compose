import { Page } from "@composehq/ts-public";
import { useEffect, useState } from "react";
import LoadingOverlay from "~/routes/app/LoadingOverlay";

function LoadingExample() {
  const [loading, setLoading] = useState<{
    value: boolean;
    properties?: Page.loading.Properties;
  }>({
    value: false,
  });

  useEffect(() => {
    async function expensiveOperation() {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setLoading({
        value: true,
        properties: { disableInteraction: true, text: "Step 1..." },
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setLoading({
        value: true,
        properties: { text: "Step 2...", disableInteraction: true },
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setLoading({ value: false, properties: { text: "Step 2..." } });
    }

    if (loading.value === false) {
      expensiveOperation();
    }
  }, [loading.value]);

  return (
    <div className="p-4">
      <h3>Demo app</h3>
      <LoadingOverlay loading={loading} />
    </div>
  );
}

export default LoadingExample;
