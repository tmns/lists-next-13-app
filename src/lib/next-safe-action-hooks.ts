// Taken from here: https://github.com/TheEdoRan/next-safe-action/blob/main/src/hook.ts
// Just with a small edit to get the optimistic state to not be momentarily overridden when `res` is updated.

import { experimental_useOptimistic, useCallback, useEffect, useRef, useState } from "react";
import type { HookRes, HookCallbacks } from "next-safe-action/hook";
import type { z } from "zod";

// ********************* TYPES *********************

type ClientCaller<IV extends z.ZodTypeAny, AO> = (input: z.input<IV>) => Promise<{
  data?: AO;
  serverError?: true;
  validationError?: Partial<Record<keyof z.input<IV>, string[]>>;
}>;

// ********************* FUNCTIONS *********************

const getActionStatus = <IV extends z.ZodTypeAny, AO>(res: HookRes<IV, AO>) => {
  const hasSucceded = typeof res.data !== "undefined";
  const hasErrored =
    typeof res.validationError !== "undefined" ||
    typeof res.serverError !== "undefined" ||
    typeof res.fetchError !== "undefined";

  const hasExecuted = hasSucceded || hasErrored;

  return { hasExecuted, hasSucceded, hasErrored };
};

const useActionCallbacks = <const IV extends z.ZodTypeAny, const AO>(
  res: HookRes<IV, AO>,
  hasSucceded: boolean,
  hasErrored: boolean,
  reset: () => void,
  cb?: HookCallbacks<IV, AO>
) => {
  const onSuccessRef = useRef(cb?.onSuccess);
  const onErrorRef = useRef(cb?.onError);

  // Execute the callback on success or error, if provided.
  useEffect(() => {
    const onSuccess = onSuccessRef.current;
    const onError = onErrorRef.current;

    if (onSuccess && hasSucceded) {
      onSuccess(res.data!, reset);
    } else if (onError && hasErrored) {
      onError(res, reset);
    }
  }, [hasErrored, hasSucceded, res, reset]);
};

/**
 * Use the action from a Client Component via hook, with optimistic state update.
 *
 * **NOTE: This hook uses an experimental React feature.**
 * @param clientCaller Caller function with typesafe input data for the Server Action.
 * @param defaultOptState Default (initial) optimistic state.
 * @param cb Optional callbacks executed when the action succeeds or fails.
 *
 * {@link https://github.com/theedoran/next-safe-action#optimistic-update--experimental See an example}
 */
export const useOptimisticAction = <const IV extends z.ZodTypeAny, const AO, State extends object>(
  clientCaller: ClientCaller<IV, AO>,
  defaultOptState: State,
  cb?: HookCallbacks<IV, AO>
) => {
  const [res, setRes] = useState<HookRes<IV, AO>>({});

  const [optState, syncState] = experimental_useOptimistic<
    State & { __isExecuting__: boolean },
    Partial<State>
    // Merge `res.data` as well so when it gets set in state and this hook re-runs, the "optimistic"
    // state will get set to the updated state rather than reverted back to the default / prev state.
  >({ ...defaultOptState, ...res.data, __isExecuting__: false }, (state, newState) => ({
    ...state,
    ...(newState ?? {}),
    __isExecuting__: true,
  }));

  const executor = useRef(clientCaller);

  const { hasExecuted, hasSucceded, hasErrored } = getActionStatus<IV, AO>(res);

  const execute = useCallback(
    (input: z.input<IV>, newServerState: Partial<State>) => {
      syncState(newServerState);

      executor
        .current(input)
        .then((res) => setRes(res))
        .catch((e) => {
          setRes({ fetchError: e });
        });
    },
    [syncState]
  );

  const reset = useCallback(() => {
    setRes({});
  }, []);

  useActionCallbacks(res, hasSucceded, hasErrored, reset, cb);

  const { __isExecuting__, ...optimisticState } = optState;

  return {
    execute,
    isExecuting: __isExecuting__,
    res,
    optimisticState,
    reset,
    hasExecuted,
    hasSucceded,
    hasErrored,
  };
};
