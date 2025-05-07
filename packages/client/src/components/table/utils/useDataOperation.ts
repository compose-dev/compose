import { useEffect, useRef, useState } from "react";

type Updater<T> = T | ((oldValue: T) => T);

/**
 * A custom hook for the table component that syncs state for data operations.
 *
 * - Guarantees up to date browser and server state.
 * - Includes hook to request a page change, that is only triggered when the
 *   server value actually changes.
 * - Includes hook to reset the value to the initial value.
 * - Is responsive to changes in whether the data operation is enabled and
 *   when the initial value changes.
 */
function useDataOperation<TDisplayFormat, TValidatedFormat, TServerFormat>({
  initialValueFromServer,
  formatServerToDisplay,
  formatDisplayToValidated,
  formatValidatedToServer,
  serverValueDidChange,
  operationIsEnabled,
  operationDisabledValue,
  onShouldRequestServerData,
  onShouldRequestBrowserData,
  shouldManuallySyncServerValue,
}: {
  // Initial value
  initialValueFromServer: TServerFormat;

  // Formatting
  formatServerToDisplay: (value: TServerFormat) => TDisplayFormat;
  formatDisplayToValidated: (value: TDisplayFormat) => TValidatedFormat;
  formatValidatedToServer: (value: TValidatedFormat) => TServerFormat;

  // Server value change detection
  serverValueDidChange: (
    oldValue: TServerFormat,
    newValue: TServerFormat
  ) => boolean;
  shouldManuallySyncServerValue: boolean;

  // Operation enabled state
  operationIsEnabled: boolean;
  operationDisabledValue: TDisplayFormat;

  // Syncing
  onShouldRequestServerData: (() => void) | null;
  onShouldRequestBrowserData: (() => void) | null;
}) {
  const [displayValue, setDisplayValue] = useState<TDisplayFormat>(() =>
    operationIsEnabled
      ? formatServerToDisplay(initialValueFromServer)
      : operationDisabledValue
  );
  const validatedValueRef = useRef<TValidatedFormat>(
    formatDisplayToValidated(displayValue)
  );
  const [serverValueIsSynced, setServerValueIsSynced] = useState(false);

  const prevInitialValueFromServer = useRef(initialValueFromServer);
  const currentServerValueRef = useRef(prevInitialValueFromServer.current);

  useEffect(() => {
    if (!operationIsEnabled) {
      setDisplayValue(operationDisabledValue);
      validatedValueRef.current = formatDisplayToValidated(
        operationDisabledValue
      );
      currentServerValueRef.current = initialValueFromServer;
      setServerValueIsSynced(true);

      if (onShouldRequestBrowserData) {
        onShouldRequestBrowserData();
      }

      return;
    }

    if (
      serverValueDidChange(
        prevInitialValueFromServer.current,
        initialValueFromServer
      )
    ) {
      prevInitialValueFromServer.current = initialValueFromServer;
      currentServerValueRef.current = initialValueFromServer;
      setServerValueIsSynced(true);

      const newDisplayValue = formatServerToDisplay(initialValueFromServer);
      const newValidatedValue = formatDisplayToValidated(newDisplayValue);

      setDisplayValue(newDisplayValue);
      validatedValueRef.current = newValidatedValue;

      if (onShouldRequestBrowserData) {
        onShouldRequestBrowserData();
      }
    }
  }, [
    initialValueFromServer,
    serverValueDidChange,
    formatServerToDisplay,
    formatDisplayToValidated,
    operationIsEnabled,
    operationDisabledValue,
    onShouldRequestBrowserData,
  ]);

  function syncServerValue() {
    if (!operationIsEnabled) {
      return;
    }

    const newServerValue = formatValidatedToServer(validatedValueRef.current);

    if (
      onShouldRequestServerData &&
      serverValueDidChange(currentServerValueRef.current, newServerValue)
    ) {
      // update ref prior to calling listener since there may be side effects
      // that depend on the ref value
      currentServerValueRef.current = newServerValue;
      onShouldRequestServerData();
    } else {
      currentServerValueRef.current = newServerValue;
    }

    setServerValueIsSynced(true);
  }

  function handleDisplayValueChange(newValue: Updater<TDisplayFormat>) {
    if (!operationIsEnabled) {
      return;
    }

    const newDisplayValue: TDisplayFormat =
      // @ts-expect-error ignore the type error for now
      typeof newValue === "function" ? newValue(displayValue) : newValue;

    const newValidatedValue = formatDisplayToValidated(newDisplayValue);

    setDisplayValue(newDisplayValue);
    validatedValueRef.current = newValidatedValue;

    if (!shouldManuallySyncServerValue) {
      syncServerValue();
    } else {
      setServerValueIsSynced(false);
    }

    if (onShouldRequestBrowserData) {
      onShouldRequestBrowserData();
    }
  }

  function resetValue() {
    if (!operationIsEnabled) {
      return;
    }

    const newServerValue = prevInitialValueFromServer.current;
    const newDisplayValue = formatServerToDisplay(newServerValue);
    const newValidatedValue = formatDisplayToValidated(newDisplayValue);

    setDisplayValue(newDisplayValue);
    validatedValueRef.current = newValidatedValue;
    currentServerValueRef.current = newServerValue;
    setServerValueIsSynced(true);

    if (
      onShouldRequestServerData &&
      serverValueDidChange(currentServerValueRef.current, newServerValue)
    ) {
      onShouldRequestServerData();
    }

    if (onShouldRequestBrowserData) {
      onShouldRequestBrowserData();
    }
  }

  return {
    displayValue,
    validatedValueRef,
    serverValueRef: currentServerValueRef,
    setDisplayValue: handleDisplayValueChange,
    resetValue,
    manuallySyncServerValue: syncServerValue,
    serverValueIsSynced,
  };
}

export { useDataOperation };
