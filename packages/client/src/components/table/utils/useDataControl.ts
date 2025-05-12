import { Updater } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function getIsServerValueStale<TServer>(
  paginated: boolean,
  nextServer: TServer,
  getCurrentServerValue: () => TServer,
  serverValuesAreEqual: (a: TServer, b: TServer) => boolean
) {
  if (!paginated) {
    return false;
  }

  return !serverValuesAreEqual(nextServer, getCurrentServerValue());
}

/**
 * A hook that manages different versions of state for a data control.
 *
 * - Guarantees that all versions of state are kept in sync.
 * - All changes to state must be triggered manually. No side effects!
 */
function useDataControl<TDraft, TApplied, TServer>({
  getCurrentServerValue,
  getResetValue,
  draftToApplied,
  appliedToServer,
  serverToDraft,
  serverValuesAreEqual,
  isEnabled,
  disabledValue,
  paginated,
}: {
  getCurrentServerValue: () => TServer;
  getResetValue: () => TServer;
  draftToApplied: (draft: TDraft) => TApplied;
  appliedToServer: (applied: TApplied) => TServer;
  serverToDraft: (server: TServer) => TDraft;
  serverValuesAreEqual: (a: TServer, b: TServer) => boolean;
  isEnabled: boolean;
  disabledValue: TServer;
  paginated: boolean;
}) {
  const isEnabledRef = useRef(isEnabled);
  const currentServerValueRef = useRef(getCurrentServerValue());

  /**
   * The draft is the value that the user sees and interacts with. This may
   * contain invalid states while the user is editing a data operation value
   * (e.g. applying new filters).
   */
  const [draft, setDraft] = useState<TDraft>(
    isEnabledRef.current
      ? serverToDraft(currentServerValueRef.current)
      : serverToDraft(disabledValue)
  );
  const draftRef = useRef<TDraft>(draft);

  /**
   * The applied value is the validated draft value. This is the value that is
   * used by internally by the table component to control the data.
   */
  const [applied, setApplied] = useState<TApplied>(draftToApplied(draft));
  const appliedRef = useRef<TApplied>(applied);

  /**
   * The applied value, but formatted for the server since the
   * server may expected a different format than what the table uses
   * internally.
   */
  const [nextServer, setNextServer] = useState<TServer>(
    appliedToServer(applied)
  );
  const nextServerRef = useRef<TServer>(nextServer);

  const isServerValueStale = useMemo(
    () =>
      getIsServerValueStale(
        paginated,
        nextServer,
        getCurrentServerValue,
        serverValuesAreEqual
      ),
    [paginated, getCurrentServerValue, serverValuesAreEqual, nextServer]
  );

  const set = useCallback(
    (newDraft: Updater<TDraft>) => {
      if (!isEnabledRef.current) {
        return;
      }

      const resolvedDraft: TDraft =
        typeof newDraft === "function"
          ? (newDraft as (old: TDraft) => TDraft)(draftRef.current)
          : newDraft;
      setDraft(resolvedDraft);
      draftRef.current = resolvedDraft;

      const newApplied = draftToApplied(resolvedDraft);
      const newServer = appliedToServer(newApplied);

      setApplied(newApplied);
      appliedRef.current = newApplied;

      setNextServer(newServer);
      nextServerRef.current = newServer;
    },
    [draftToApplied, setDraft, appliedToServer]
  );

  const reset = useCallback(() => {
    const newDraft = isEnabledRef.current
      ? serverToDraft(getResetValue())
      : serverToDraft(disabledValue);
    const newApplied = draftToApplied(newDraft);
    const newServer = appliedToServer(newApplied);

    setDraft(newDraft);
    draftRef.current = newDraft;

    setApplied(newApplied);
    appliedRef.current = newApplied;

    setNextServer(newServer);
    nextServerRef.current = newServer;
  }, [
    draftToApplied,
    setDraft,
    serverToDraft,
    getResetValue,
    appliedToServer,
    disabledValue,
  ]);

  const setIsEnabled = useCallback(
    (isEnabled: boolean) => {
      const didChange = isEnabledRef.current !== isEnabled;
      isEnabledRef.current = isEnabled;

      if (didChange) {
        if (isEnabledRef.current) {
          set(serverToDraft(getCurrentServerValue()));
        } else {
          reset();
        }
      }
    },
    [reset, set, getCurrentServerValue, serverToDraft]
  );

  useEffect(() => {
    if (!paginated) {
      return;
    }

    const newServerValue = getCurrentServerValue();
    if (!serverValuesAreEqual(currentServerValueRef.current, newServerValue)) {
      currentServerValueRef.current = newServerValue;
      set(serverToDraft(newServerValue));
    }
  }, [
    getCurrentServerValue,
    serverValuesAreEqual,
    set,
    paginated,
    serverToDraft,
  ]);

  return {
    // State
    draft,
    applied,
    appliedRef,
    nextServer,
    nextServerRef,

    // Actions
    set,
    reset,
    setIsEnabled,

    // Pass through
    serverToDraft,

    // Derived
    isServerValueStale,
  };
}

export { useDataControl };
