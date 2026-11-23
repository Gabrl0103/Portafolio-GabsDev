"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "../ui";

/**
 * Efecto de rastreo, como el de las cámaras que analizan personas:
 * recuadros punteados con esquinas marcadas, un punto al centro y sus coordenadas.
 */

const reduce = () =>
  typeof window !== "undefined" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Un recuadro: esquinas, contorno punteado y punto central */
export function TrackBox({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  const c = Math.round(size * 0.3);
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      aria-hidden="true"
      className={cx("overflow-visible", className)}
    >
      <path
        d={`M.5 ${c}V.5H${c} M${s - c} .5H${s - 0.5}V${c} M${s - 0.5} ${s - c}V${s - 0.5}H${s - c} M${c} ${s - 0.5}H.5V${s - c}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x=".5"
        y=".5"
        width={s - 1}
        height={s - 1}
        fill="none"
        stroke="currentColor"
        strokeWidth=".6"
        strokeDasharray="1.5 2.5"
        opacity=".55"
      />
      <circle cx={s / 2} cy={s / 2} r="1.3" fill="currentColor" />
    </svg>
  );
}

/** Coordenadas que tiemblan un poco, como si se recalcularan */
function useJitter(on: boolean, ms = 420) {
  const [j, setJ] = useState(0);
  useEffect(() => {
    if (!on || reduce()) return;
    const id = setInterval(() => setJ((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [on, ms]);
  return j;
}
const wobble = (seed: number, j: number, amp = 2) =>
  Math.round(Math.sin(seed * 12.9898 + j * 1.7) * amp);

/**
 * Rastreo sobre la foto: solo dos puntos (ojo y boca) unidos por una línea punteada.
 * Aparecen al entrar la foto en pantalla.
 */
export function FaceTrack({
  points,
  w,
  h,
}: {
  /** [x %, y %, tamaño px] sobre la foto */
  points: [number, number, number][];
  /** Tamaño real de la imagen, para que las coordenadas sean de píxeles reales */
  w: number;
  h: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const j = useJitter(on, 520);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), {
      threshold: 0.4,
    });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const [a, b] = points;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 font-mono text-[8.5px] leading-none text-white"
    >
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <line
          x1={`${a[0]}%`}
          y1={`${a[1]}%`}
          x2={`${b[0]}%`}
          y2={`${b[1]}%`}
          stroke="currentColor"
          strokeWidth=".8"
          strokeDasharray="2 3"
          pathLength={1}
          className={cx(
            "transition-[opacity] duration-700",
            on ? "opacity-70 delay-700" : "opacity-0",
          )}
        />
      </svg>
      {points.map(([x, y, s], i) => (
        <div
          key={i}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(calc(-50% + ${wobble(i + 1, j, 1)}px), calc(-50% + ${wobble(i + 7, j, 1)}px))`,
            transitionDelay: on ? `${300 + i * 350}ms` : "0ms",
          }}
          className={cx(
            "absolute transition-[opacity,scale] duration-500",
            on ? "scale-100 opacity-100" : "scale-125 opacity-0",
          )}
        >
          <TrackBox size={s} />
          <span
            className="absolute top-0 whitespace-nowrap opacity-90"
            style={{ left: s + 5 }}
          >
            x: {Math.round((x / 100) * w) + wobble(i + 3, j)} y:{" "}
            {Math.round((y / 100) * h) + wobble(i + 5, j)}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Cursor de rastreo: en las secciones oscuras, un recuadro sigue al mouse con sus
 * coordenadas y una línea punteada hasta donde estuvo un momento antes.
 * Solo con mouse (no en pantallas táctiles) y sin "reducir movimiento".
 */
export function CursorTrack() {
  const box = useRef<HTMLDivElement>(null);
  const tail = useRef<HTMLDivElement>(null);
  const line = useRef<SVGLineElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const tLabel = useRef<HTMLSpanElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || reduce()) return;
    let x = -100,
      y = -100,
      tx = -100,
      ty = -100,
      raf = 0,
      visible = false;
    const tick = () => {
      // el punto de atrás persigue al cursor con retraso
      tx += (x - tx) * 0.07;
      ty += (y - ty) * 0.07;
      if (box.current)
        box.current.style.transform = `translate(${x}px, ${y}px)`;
      if (tail.current)
        tail.current.style.transform = `translate(${tx}px, ${ty}px)`;
      if (line.current) {
        line.current.setAttribute("x1", String(x));
        line.current.setAttribute("y1", String(y));
        line.current.setAttribute("x2", String(tx));
        line.current.setAttribute("y2", String(ty));
      }
      if (label.current)
        label.current.textContent = `x: ${Math.round(x)}  y: ${Math.round(y + scrollY)}`;
      if (tLabel.current)
        tLabel.current.textContent = `x: ${Math.round(tx)}  y: ${Math.round(ty + scrollY)}`;
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      // solo sobre las secciones oscuras, y no encima de botones ni campos
      const el = e.target as HTMLElement;
      const on =
        !!el.closest?.(".tinta") &&
        !el.closest?.("a, button, input, textarea, label, [role=dialog]");
      if (on && !visible) {
        tx = x - 60;
        ty = y - 40;
      }
      if (on !== visible) {
        visible = on;
        setShow(on);
      }
    };
    const onLeave = () => {
      visible = false;
      setShow(false);
    };
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cx(
        "pointer-events-none fixed inset-0 z-[45] font-mono text-[9px] leading-none text-white mix-blend-difference transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0",
      )}
    >
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <line
          ref={line}
          stroke="currentColor"
          strokeWidth=".8"
          strokeDasharray="2 3"
          opacity=".55"
        />
      </svg>
      <div ref={tail} className="absolute top-0 left-0">
        <div className="-translate-x-1/2 -translate-y-1/2">
          <TrackBox size={12} className="opacity-80" />
        </div>
        <span
          ref={tLabel}
          className="absolute top-[-16px] left-[10px] whitespace-nowrap opacity-60"
        />
      </div>
      <div ref={box} className="absolute top-0 left-0">
        <div className="-translate-x-1/2 -translate-y-1/2">
          <TrackBox size={44} />
        </div>
        <span
          ref={label}
          className="absolute top-[-24px] left-[28px] whitespace-nowrap"
        />
      </div>
    </div>
  );
}

/** Esquinas marcadas alrededor de un área (marco del escáner) */
function Corners() {
  const c = "absolute size-2.5 border-current";
  return (
    <>
      <i className={`${c} -top-px -left-px border-t border-l`} />
      <i className={`${c} -top-px -right-px border-t border-r`} />
      <i className={`${c} -right-px -bottom-px border-r border-b`} />
      <i className={`${c} -bottom-px -left-px border-b border-l`} />
    </>
  );
}

/**
 * Escáner de Proyectos: un marco punteado que recorre, uno por uno, los proyectos
 * que esperan alrededor, con su nombre y coordenadas. Va sobre el escenario.
 */
export function ProjectScan({
  stage,
  active,
}: {
  stage: React.RefObject<HTMLDivElement | null>;
  active: boolean;
}) {
  const [box, setBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    name: string;
  } | null>(null);
  const k = useRef(0);
  useEffect(() => {
    if (!active || reduce()) return;
    const step = () => {
      const st = stage.current;
      if (!st) return;
      const cards = [...st.querySelectorAll<HTMLElement>("button[data-sat]")];
      if (!cards.length) return;
      const el = cards[k.current++ % cards.length];
      const r = el.getBoundingClientRect();
      const s = st.getBoundingClientRect();
      setBox({
        x: r.left - s.left - 6,
        y: r.top - s.top - 6,
        w: r.width + 12,
        h: r.height + 12,
        name: el.dataset.sat ?? "",
      });
    };
    step();
    const id = setInterval(step, 2200);
    return () => clearInterval(id);
  }, [active, stage]);
  if (!box) return null;
  return (
    <div
      aria-hidden="true"
      style={{
        transform: `translate(${box.x}px, ${box.y}px)`,
        width: box.w,
        height: box.h,
      }}
      className={cx(
        "pointer-events-none absolute top-0 left-0 z-[4] text-fg transition-[transform,width,height,opacity] duration-1000 ease-expo",
        active ? "opacity-60" : "opacity-0",
      )}
    >
      <div className="absolute inset-0 border border-dashed border-current opacity-50" />
      <Corners />
      <span className="absolute -top-4 left-0 font-mono text-[8.5px] leading-none whitespace-nowrap">
        {box.name} · x: {Math.round(box.x + box.w / 2)} y:{" "}
        {Math.round(box.y + box.h / 2)}
      </span>
    </div>
  );
}

/**
 * Sobre la demo del proyecto elegido: una etiqueta pequeña y un solo recuadro que
 * salta entre los bordes, para no tapar lo que pasa en el video.
 */
export function DemoScan({ name, active }: { name: string; active: boolean }) {
  const spots: [number, number][] = [
    [12, 18],
    [86, 24],
    [82, 80],
    [16, 76],
  ];
  const j = useJitter(active, 1600);
  const [x, y] = spots[j % spots.length];
  return (
    <span
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute inset-0 z-[2] font-mono text-[8.5px] leading-none text-white mix-blend-difference transition-opacity duration-700",
        active ? "opacity-90" : "opacity-0",
      )}
    >
      <span className="absolute bottom-2.5 left-2.5 border border-dashed border-current px-1.5 py-1 tracking-[.06em] uppercase">
        Analizando · {name}
      </span>
      <span
        style={{ left: `${x}%`, top: `${y}%` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-1000 ease-expo"
      >
        <TrackBox size={22} />
        <span className="absolute top-0 left-[27px] whitespace-nowrap">
          x: {Math.round(x * 14.4)} y: {Math.round(y * 9)}
        </span>
      </span>
    </span>
  );
}
