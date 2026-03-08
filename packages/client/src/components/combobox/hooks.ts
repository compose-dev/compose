import { useEffect, useMemo, useRef, useState } from "react";
import { SelectOption, SelectValue } from "~/components/.utils/selectUtils";
import { SEARCH_DEBOUNCE_MS } from "./constants";

function useComboboxQuery<T extends SelectValue>(
  options: SelectOption<NonNullable<T>>[],
  serverControlled: boolean = false,
) {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (serverControlled || query === "") {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [options, query, serverControlled]);

  return { query, setQuery, filteredOptions };
}

/**
 * Debounces calls to `onSearch` as the user types. Only fires after the user
 * has actually typed something — skips the initial mount and the query reset
 * that happens when the dropdown closes.
 */
function useDebouncedSearch(
  query: string,
  onSearch: ((value: string | null) => void) | null | undefined,
) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasUserTyped = useRef(false);

  useEffect(() => {
    if (onSearch == null) return;

    // Skip initial mount and the empty-string reset fired by onClose.
    if (query === "" && !hasUserTyped.current) return;

    if (query !== "") {
      hasUserTyped.current = true;
    } else {
      // User cleared the input or dropdown closed — reset the flag so the
      // next open doesn't fire immediately.
      hasUserTyped.current = false;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearch(query === "" ? null : query);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, onSearch]);
}

export default useComboboxQuery;
export { useDebouncedSearch };
