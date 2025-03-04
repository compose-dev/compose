import { Page } from "@composehq/ts-public";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "~/components/button";
import LoadingOverlay from "~/routes/app/LoadingOverlay";
import { toast } from "~/utils/toast";

function FeedbackAndLoading() {
  const [loading, setLoading] = useState<{
    value: boolean;
    properties?: Page.loading.Properties;
  }>({
    value: false,
  });

  const initialRefund = useRef(false);

  const { addToast } = toast.useStore();

  const doLoading = useCallback(async () => {
    setLoading({
      value: true,
      properties: { disableInteraction: true, text: "Processing refund..." },
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setLoading({ value: false, properties: { text: "Processing refund..." } });

    addToast({
      message: "Billing refunded successfully!",
      appearance: "success",
    });
  }, [addToast]);

  useEffect(() => {
    if (initialRefund.current === false) {
      initialRefund.current = true;
      doLoading();
    }
  }, [doLoading]);

  return (
    <div className="p-4">
      <Button onClick={doLoading} variant="primary">
        Refund billing
      </Button>
      <LoadingOverlay loading={loading} />
    </div>
  );
}

export default FeedbackAndLoading;
