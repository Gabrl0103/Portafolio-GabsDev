"use client";

import { useState } from "react";
import { setSound, startCrackle, tick } from "@/lib/fx/sound";
import { cx } from "./ui";

/** Activa el sonido sintetizado del sitio (apagado por defecto). Vive dentro del menú. */
export default function SoundToggle() {
  const [on, setOn] = useState(false);

  const toggle = () => {
    const next = !on;
    setOn(next);
    setSound(next);
    if (next) {
      tick(880, 0.12, 0.07);
      const intro = document.getElementById("intro");
      if (intro && !/out|gone/.test(intro.className)) startCrackle();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-[14px] border-0 bg-transparent px-4 py-3.5 text-left text-sm/[1.5] font-medium tracking-normal text-soft hover:bg-glass2"
    >
      <span className="flex items-center gap-2.5">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 9v6h4l5 4V5L8 9H4z" />
          <path className={cx("transition-opacity duration-300", on ? "opacity-100" : "opacity-25")} d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
        </svg>
        Sonido
      </span>
      <span aria-hidden="true" className={cx("relative h-5 w-9 flex-none rounded-full transition-colors duration-300", on ? "bg-acc" : "bg-line2")}>
        <span
          className={cx(
            "absolute top-0.5 left-0.5 size-4 rounded-full bg-fg transition-transform duration-300 ease-out-soft",
            on && "translate-x-4 bg-acc-ink",
          )}
        />
      </span>
    </button>
  );
}
