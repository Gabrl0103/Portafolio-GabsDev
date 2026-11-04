"use client";

export default function ReplayIntro() {
  return (
    <button className="btn sm" type="button" onClick={() => dispatchEvent(new Event("intro:replay"))}>
      Ver intro de nuevo
    </button>
  );
}
