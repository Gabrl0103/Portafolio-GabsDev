"use client";

import { useSyncExternalStore } from "react";
import { currentDesign, type Design } from "./theme";

const subscribe = (cb: () => void) => {
  addEventListener("design-change", cb);
  return () => removeEventListener("design-change", cb);
};

/** Diseño activo ("original" o "atardecer"); se actualiza al cambiarlo desde el menú. */
export default function useDesign(): Design {
  return useSyncExternalStore(subscribe, currentDesign, () => "original");
}
