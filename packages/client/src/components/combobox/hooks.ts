import { useMemo, useState } from "react";
import { SelectOption, SelectValue } from "~/components/.utils/selectUtils";

function useComboboxQuery<T extends SelectValue>(
  options: SelectOption<NonNullable<T>>[]
) {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (query === "") {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  return { query, setQuery, filteredOptions };
}

export default useComboboxQuery;
