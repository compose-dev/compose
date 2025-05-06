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
function useDataOperation<TBrowserFormat, TServerFormat>({
  initialValue,
  formatServerToBrowser,
  formatBrowserToServer,
  getCurrentServerValue,
  serverValueDidChange,
  onSyncServerValue,
  onShouldRequestPageChange,
  operationIsEnabled,
  operationDisabledValue,
}: {
  // Initial value
  initialValue: TServerFormat;

  // Formatting
  formatServerToBrowser: (value: TServerFormat) => TBrowserFormat;
  formatBrowserToServer: (value: TBrowserFormat) => TServerFormat;

  // Server value change detection
  getCurrentServerValue: () => TServerFormat;
  serverValueDidChange: (
    oldValue: TServerFormat,
    newValue: TServerFormat
  ) => boolean;

  // Pagination syncing
  onSyncServerValue: (value: TServerFormat) => void | null;
  onShouldRequestPageChange: (() => void) | null;

  // Operation enabled state
  operationIsEnabled: boolean;
  operationDisabledValue: TBrowserFormat;
}) {
  const [value, setValue] = useState<TBrowserFormat>(() => {
    if (!operationIsEnabled) {
      if (onSyncServerValue) {
        onSyncServerValue(formatBrowserToServer(operationDisabledValue));
      }

      return operationDisabledValue;
    }

    const browserValue = formatServerToBrowser(initialValue);

    if (onSyncServerValue) {
      onSyncServerValue(formatBrowserToServer(browserValue));
    }

    return browserValue;
  });
  const prevInitialBrowserValue = useRef(value);

  /**
   * Store the previous `initialValue` to detect external changes that should
   * override the internal state.
   */
  const prevInitialValue = useRef(initialValue);

  /**
   * Listen for changes to the external `initialValue` and `operationIsEnabled`
   * props.
   *
   * If the operation is disabled, the internal state is set to the
   * `operationDisabledValue`.
   *
   * Otherwise, the internal state is set to the formatted `initialValue`.
   */
  useEffect(() => {
    // If the operation is disabled, set the internal state to the
    // `operationDisabledValue` and sync the value to the server.
    if (!operationIsEnabled) {
      onSyncServerValue(formatBrowserToServer(operationDisabledValue));
      setValue(operationDisabledValue);
    }

    // If the initial value has changed, set the internal ref.
    if (serverValueDidChange(prevInitialValue.current, initialValue)) {
      // Update the initial value ref if it changed, even in the case where
      // the operation is disabled, since we may have a case where the operation
      // is disabled and the initial state is changed in the same render.
      prevInitialValue.current = initialValue;

      // If the operation is enabled, also update the internal state and
      // sync the value to the server.
      if (operationIsEnabled) {
        const browserValue = formatServerToBrowser(initialValue);

        setValue(browserValue);
        prevInitialBrowserValue.current = browserValue;

        if (onSyncServerValue) {
          onSyncServerValue(formatBrowserToServer(browserValue));
        }
      }
    }
  }, [
    initialValue,
    serverValueDidChange,
    formatServerToBrowser,
    onSyncServerValue,
    formatBrowserToServer,
    operationIsEnabled,
    operationDisabledValue,
  ]);

  function resetValue() {
    setValue(prevInitialBrowserValue.current);
  }

  function handleValueChange(newValue: Updater<TBrowserFormat>) {
    if (!operationIsEnabled) {
      return;
    }

    const resolvedValue =
      // @ts-expect-error ignore the type error for now
      typeof newValue === "function" ? newValue(value) : newValue;

    setValue(resolvedValue);

    const serverValue = formatBrowserToServer(resolvedValue);

    if (onSyncServerValue || onShouldRequestPageChange) {
      if (serverValueDidChange(getCurrentServerValue(), serverValue)) {
        if (onSyncServerValue) {
          onSyncServerValue(serverValue);
        }

        if (onShouldRequestPageChange) {
          onShouldRequestPageChange();
        }
      }
    }
  }

  return { value, setValue: handleValueChange, resetValue };
}

export { useDataOperation };
