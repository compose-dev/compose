import { BrowserToServerEvent } from "@compose/ts";
import { useMemo, useState } from "react";
import { api } from "~/api";

import { toast } from "~/utils/toast";

enum ACTIVE_MODAL {
  DOWNGRADE_HOBBY,
  PROVISION_PRO,
  NONE,
}

export function useBilling(
  billingData: BrowserToServerEvent.BillingDetails.Response | undefined
) {
  const { addToast } = toast.useStore();

  const [activeModal, setActiveModal] = useState<ACTIVE_MODAL>(
    ACTIVE_MODAL.NONE
  );

  const defaultStandardSeats = useMemo(() => {
    if (billingData) {
      return Math.max(billingData.standardSeatsUsed, 2);
    }

    return 2;
  }, [billingData]);

  const defaultExternalSeats = useMemo(() => {
    if (billingData) {
      return Math.max(billingData.externalSeatsUsed, 0);
    }

    return 0;
  }, [billingData]);

  const [standardSeats, setStandardSeats] = useState<string | null>(
    defaultStandardSeats.toString()
  );
  const [externalSeats, setExternalSeats] = useState<string | null>(
    defaultExternalSeats.toString()
  );

  const [loadingCheckoutSession, setLoadingCheckoutSession] = useState(false);

  const standardSeatsCost = parseInt(standardSeats ?? "0") * 12;
  const externalSeatsCost = parseInt(externalSeats ?? "0") * 7;
  const totalCost = standardSeatsCost + externalSeatsCost;

  function clearForm() {
    setStandardSeats(defaultStandardSeats.toString());
    setExternalSeats(defaultExternalSeats.toString());
    setLoadingCheckoutSession(false);
  }

  async function continueToCheckout() {
    const numStandardSeats = parseInt(standardSeats ?? "0");
    const numExternalSeats = parseInt(externalSeats ?? "0");

    if (numStandardSeats < 1) {
      addToast({
        message:
          "You must have configured at least one standard seat to continue",
        appearance: "error",
      });
      return;
    }

    if (numExternalSeats < 0) {
      addToast({
        message: "You cannot configure a negative number of external seats",
        appearance: "error",
      });
      return;
    }

    setLoadingCheckoutSession(true);

    const response = await api.routes.createCheckoutSession({
      standardSeats: numStandardSeats,
      externalSeats: numExternalSeats,
      cancelUrl: `${window.location.origin}/home/billing/details?checkoutResult=ERROR`,
      successUrl: `${window.location.origin}/home/billing/details?checkoutResult=SUCCESS`,
    });

    if (response.didError) {
      addToast({
        message: `Failed to create checkout session. Received the following error: ${response.data.message}. Please contact support at atul@composehq.com`,
      });
    } else {
      window.location.href = response.data.checkoutUrl;
    }

    setLoadingCheckoutSession(false);
  }

  return {
    ACTIVE_MODAL,
    activeModal,
    setActiveModal,
    standardSeats,
    setStandardSeats,
    externalSeats,
    setExternalSeats,
    standardSeatsCost,
    externalSeatsCost,
    totalCost,
    clearForm,
    continueToCheckout,
    loadingCheckoutSession,
  };
}
