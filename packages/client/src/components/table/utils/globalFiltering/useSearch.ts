import { useDataOperation } from "../useDataOperation";

function useSearch({
  initialValue,
  searchable,
  onShouldRequestBrowserData,
}: {
  initialValue: string | null;
  searchable: boolean;
  onShouldRequestBrowserData: (() => void) | null;
}) {
  return useDataOperation({
    // Initial Values
    initialValueFromServer: initialValue,
    serverValueDidChange: (oldValue, newValue) => oldValue !== newValue,

    // Operation enabled state
    operationIsEnabled: searchable,
    operationDisabledValue: null,
    shouldManuallySyncServerValue: false,

    // Formatting
    formatServerToDisplay: (serverValue) => serverValue,
    formatDisplayToValidated: (displayValue) => displayValue,
    formatValidatedToServer: (validatedValue) => validatedValue,

    // Pagination Syncing
    onShouldRequestBrowserData,
    onShouldRequestServerData: null,
  });
}

export { useSearch };
