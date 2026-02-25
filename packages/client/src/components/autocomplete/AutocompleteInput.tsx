import {
  Combobox as HeadlessCombobox,
  ComboboxButton,
  ComboboxInput as HeadlessComboboxInput,
  ComboboxOption as HeadlessComboboxOption,
  ComboboxOptions as HeadlessComboboxOptions,
  Field,
} from "@headlessui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ServerToBrowserEvent } from "@composehq/ts-public";
import { BrowserToServerEvent } from "@compose/ts";
import { IOComponent } from "~/components/io-component";
import { classNames } from "~/utils/classNames";
import Icon from "~/components/icon";
import { useWSContext } from "~/utils/wsContext";

type SuggestionValue = string | number | boolean;

interface Suggestion {
  value: SuggestionValue;
  label: string;
  description?: string;
}

interface AutocompleteInputProps {
  id: string;
  componentId: string;
  renderId: string;
  executionId: string | null;
  environmentId: string | null;
  label: string | null;
  description?: string | null;
  placeholder?: string | null;
  disabled: boolean;
  hasError?: boolean;
  errorMessage?: string | null;
  value: string | null;
  setValue: (value: string | null) => void;
  initialSuggestions: Suggestion[];
  initialDisplayValue: string | null;
  freeForm: boolean;
  hasOnChangeHook: boolean;
  hasOnEnterHook: boolean;
  onEnter: () => void;
}

const DEBOUNCE_MS = 400;

function AutocompleteInput({
  id,
  componentId,
  renderId,
  executionId,
  environmentId,
  label,
  description,
  placeholder,
  disabled,
  hasError = false,
  errorMessage = null,
  value,
  setValue,
  initialSuggestions,
  initialDisplayValue,
  freeForm,
  hasOnChangeHook,
  hasOnEnterHook,
  onEnter,
}: AutocompleteInputProps) {
  const { sendWSJsonMessage, addWSListener } = useWSContext();

  // Server-driven suggestions — updated whenever ON_TEXT_CHANGE_SUGGESTIONS arrives
  const [suggestions, setSuggestions] =
    useState<Suggestion[]>(initialSuggestions);

  // Internal text query — what the user has typed.
  // Initialise from initialDisplayValue (human-readable) not value (opaque key).
  const [query, setQuery] = useState<string>(initialDisplayValue ?? "");

  // Debounce timer ref
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Listen for suggestion updates from the server
  useEffect(() => {
    const removeListener = addWSListener((data) => {
      if (
        data.type === ServerToBrowserEvent.TYPE.ON_TEXT_CHANGE_SUGGESTIONS &&
        (data as ServerToBrowserEvent.OnTextChangeSuggestions.Data)
          .componentId === componentId &&
        (data as ServerToBrowserEvent.OnTextChangeSuggestions.Data).renderId ===
          renderId
      ) {
        const typedData =
          data as ServerToBrowserEvent.OnTextChangeSuggestions.Data;
        // Normalize: accept both plain strings and {label, value} objects
        const normalized: Suggestion[] = (typedData.suggestions as any[]).map(
          (s) => {
            if (
              typeof s === "object" &&
              s !== null &&
              "value" in s &&
              "label" in s
            ) {
              return s as Suggestion;
            }
            // Primitive — use as both label and value
            return { value: String(s), label: String(s) };
          },
        );
        setSuggestions(normalized);
      }
    });

    return removeListener;
  }, [addWSListener, componentId, renderId]);

  // Fire ON_TEXT_CHANGE_HOOK debounced when query changes
  useEffect(() => {
    if (!hasOnChangeHook || !executionId || !environmentId) {
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      sendWSJsonMessage(
        {
          type: BrowserToServerEvent.WS.TYPE.ON_TEXT_CHANGE_HOOK,
          componentId,
          renderId,
          executionId,
          value: query === "" ? null : query,
        },
        environmentId,
      );
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [
    query,
    hasOnChangeHook,
    executionId,
    environmentId,
    componentId,
    renderId,
    sendWSJsonMessage,
  ]);

  const handleChange = useCallback(
    (option: Suggestion | null) => {
      if (option === null) {
        setValue(null);
        setQuery("");
      } else {
        const strValue = String(option.value);
        // Display the human-readable label in the input box, not the raw value
        setQuery(option.label);
        setValue(strValue);

        // Clicking a suggestion should behave identically to pressing Enter —
        // fire ON_ENTER_HOOK immediately so the parent can react without
        // requiring a second keypress.
        if (hasOnEnterHook && executionId && environmentId) {
          sendWSJsonMessage(
            {
              type: BrowserToServerEvent.WS.TYPE.ON_ENTER_HOOK,
              componentId,
              renderId,
              executionId,
              value:
                strValue as BrowserToServerEvent.WS.OnEnterHook.Data["value"],
            },
            environmentId,
          );
          onEnter();
        }
      }
    },
    [
      setValue,
      hasOnEnterHook,
      executionId,
      environmentId,
      sendWSJsonMessage,
      componentId,
      renderId,
      onEnter,
    ],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);

      if (freeForm) {
        // In free-form mode, typed text is also the submitted value
        setValue(newQuery === "" ? null : newQuery);
      }
    },
    [freeForm, setValue],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        (e.key === "Enter" || e.code === "NumpadEnter") &&
        hasOnEnterHook &&
        executionId &&
        environmentId
      ) {
        sendWSJsonMessage(
          {
            type: BrowserToServerEvent.WS.TYPE.ON_ENTER_HOOK,
            componentId,
            renderId,
            executionId,
            value: value as BrowserToServerEvent.WS.OnEnterHook.Data["value"],
          },
          environmentId,
        );

        onEnter();
      }
    },
    [
      hasOnEnterHook,
      executionId,
      environmentId,
      sendWSJsonMessage,
      componentId,
      renderId,
      value,
      onEnter,
    ],
  );

  // The "selected" option — used only to drive displayValue; value state is
  // managed via `query` / `setValue` directly.
  const selectedOption =
    suggestions.find((s) => String(s.value) === value) ?? null;

  return (
    <Field className="flex flex-col">
      {label !== null && label !== undefined && (
        <IOComponent.Label as="HeadlessUILabel">{label}</IOComponent.Label>
      )}
      {description != null && (
        <IOComponent.Description>{description}</IOComponent.Description>
      )}
      <HeadlessCombobox
        value={selectedOption}
        onChange={handleChange}
        disabled={disabled}
        nullable
      >
        {/* Input box */}
        <div className="relative">
          <div
            className={classNames(
              "border-brand rounded-brand py-1 text-base/6 sm:text-sm/6 text-brand-neutral w-full focus:outline-none data-[focus]:outline-none data-[focus]:ring-brand-primary-heavy data-[focus]:ring-2 data-[focus]:ring-offset-0 bg-brand-io",
              {
                "border-brand-error": hasError,
                "border-brand-neutral": !hasError,
                "bg-brand-io-disabled": disabled,
              },
            )}
            id={`${id}-inputRoot`}
          >
            <HeadlessComboboxInput
              aria-label={label ?? undefined}
              displayValue={(option: Suggestion | null) =>
                option ? option.label : query
              }
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder ?? undefined}
              className="px-2 pr-8 border-none p-0 focus:outline-none w-full bg-transparent"
              id={id}
              onFocus={() => {
                const inputRoot = document.getElementById(`${id}-inputRoot`);
                if (inputRoot) {
                  inputRoot.setAttribute("data-focus", "true");
                }
              }}
              onBlur={() => {
                const inputRoot = document.getElementById(`${id}-inputRoot`);
                if (inputRoot) {
                  inputRoot.removeAttribute("data-focus");
                }
              }}
            />
          </div>
          {suggestions.length > 0 && (
            <ComboboxButton className="group absolute bottom-3.5 right-0 px-2.5">
              <Icon name="chevron-down" color="brand-neutral-2" size="0.75" />
            </ComboboxButton>
          )}
        </div>

        {/* Dropdown */}
        {suggestions.length > 0 && (
          <HeadlessComboboxOptions
            anchor="bottom start"
            className="w-[var(--input-width)] bg-brand-io border-brand border-brand-neutral rounded-brand shadow-sm [--anchor-gap:4px] text-sm/6 text-brand-neutral py-2 mt-2 z-30"
          >
            {suggestions.map((suggestion) => (
              <HeadlessComboboxOption
                key={String(suggestion.value)}
                value={suggestion}
                className="data-[focus]:bg-brand-overlay px-2 py-2 w-full"
              >
                <div className="flex items-center justify-between">
                  <p className="text-brand-neutral text-base/6">
                    {suggestion.label}
                  </p>
                  {String(suggestion.value) === value && (
                    <Icon
                      name="checkmark"
                      size="0.75"
                      color="brand-neutral-2"
                    />
                  )}
                </div>
                {suggestion.description && (
                  <p className="text-brand-neutral-2 text-sm/6 mt-0.5">
                    {suggestion.description}
                  </p>
                )}
              </HeadlessComboboxOption>
            ))}
          </HeadlessComboboxOptions>
        )}
      </HeadlessCombobox>

      {hasError && errorMessage !== null && (
        <IOComponent.Error>{errorMessage}</IOComponent.Error>
      )}
    </Field>
  );
}

export default AutocompleteInput;
