// Taken from https://github.com/denoland/tic-tac-toe

import { useEffect } from "react";

/**
 * The same as useEffect, but also cleans up when the page is hidden and re-runs
 * the effect when the page is shown again.
 */
export function useDataSubscription(cb: () => () => void, arr: unknown[]) {
  useEffect(() => {
    let cleanup: (() => void) | undefined = cb();
    function pageHideHandler() {
      cleanup?.();
      cleanup = undefined;
    }
    self.addEventListener("pagehide", pageHideHandler);
    function pageShowHandler() {
      cleanup?.();
      cleanup = cb();
    }
    self.addEventListener("pageshow", pageShowHandler);
    return () => {
      cleanup?.();
      cleanup = undefined;
      self.removeEventListener("pagehide", pageHideHandler);
      self.removeEventListener("pageshow", pageShowHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, arr);
}
