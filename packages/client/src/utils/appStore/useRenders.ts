import { useCallback, useRef } from "react";
import { appStore } from "~/utils/appStore";

/**
 * This hook is used to ensure page fragments always render in the correct order.
 *
 * Out-of-order rendering can happen for a variety of reasons due to the async nature
 * of Compose.
 *
 * One example: when messages are received by the client, longer messages will take longer to
 * deserialize back to JSON. Hence, a longer message that is supposed to render first may actually
 * end up rendering after a much shorter message.
 *
 * Another example: Some messages have side effects that are handled on Compose servers while being
 * proxied between SDK and client. Earlier messages with side effects may arrive after later messages
 * that don't have side effects.
 *
 * This hook maintains an ordered list of render IDs. It relies on the SDK sending a render IDX alongside
 * each render request.
 */
function useRenders() {
  const renders = useRef<Array<string | null>>([]);

  const dispatch = appStore.use((state) => state.dispatch);

  const addRender = useCallback(
    (renderId: string, idx?: number) => {
      // Case 1: No idx
      if (idx === undefined) {
        renders.current.push(renderId);
        return;
      }

      // Case 2: index is greater than current length,
      // so we need to add temp nulls in between
      if (idx > renders.current.length) {
        let itr = 0;

        while (renders.current.length < idx) {
          // Prevent infinite loops
          if (itr > 10000) {
            dispatch({
              type: appStore.EVENT_TYPE.ADD_APP_ERROR,
              properties: {
                severity: "error",
                message: "Could not add render, idx is too large",
              },
            });
            return;
          }

          renders.current.push(null);
          itr++;
        }

        renders.current.push(renderId);
        return;
      }

      // Case 3: index is less than current length.
      // There should be a temp null at this spot, so we can overwrite it.
      if (idx < renders.current.length) {
        if (renders.current[idx] !== null) {
          dispatch({
            type: appStore.EVENT_TYPE.ADD_APP_ERROR,
            properties: {
              severity: "error",
              message: "Could not add render, idx is already taken",
            },
          });
          return;
        }

        renders.current[idx] = renderId;
        return;
      }

      // Case 4: index is equal to current length. Normal case.
      // Just add to the end of the list.
      renders.current.push(renderId);
    },
    [dispatch]
  );

  const resetRenders = useCallback(() => {
    renders.current = [];
  }, []);

  return { rendersRef: renders, addRender, resetRenders };
}

export { useRenders };
