import React, { useCallback, useEffect, useRef } from "react";

export const useClickAwayListener = (onClickAway: () => void) => {
  const ref = useRef(null);

  const escapeListener = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClickAway();
      }
    },
    [onClickAway]
  );

  const clickListener = useCallback(
    (e: MouseEvent) => {
      if (!(ref.current! as any)?.contains(e.target)) {
        onClickAway?.();
      }
    },
    [onClickAway]
  );

  useEffect(() => {
    document.addEventListener("click", clickListener);
    document.addEventListener("keyup", escapeListener);
    return () => {
      document.removeEventListener("click", clickListener);
      document.removeEventListener("keyup", escapeListener);
    };
  }, [escapeListener, clickListener]);

  return { ref };
};
