"use client";

import { button } from "../ui";

export default function ReplayIntro() {
  return (
    <button className={button({ size: "sm" })} type="button" onClick={() => dispatchEvent(new Event("intro:replay"))}>
      Ver intro de nuevo
    </button>
  );
}
