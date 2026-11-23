"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import type { Project, ProjectLink } from "@/types";
import { cx } from "../ui";
import Gallery from "./Gallery";
import { DemoScan, ProjectScan } from "./Track";
import { ArrowOut, PageHead, goTo, pad } from "./parts";

/** Abre el detalle de un proyecto desde cualquier parte del sitio */
export const openProject = (id: string) =>
  dispatchEvent(new CustomEvent("open-project", { detail: id }));

/** "Proyecto académico · Wear OS · En equipo" → "Wear OS" (también en inglés) */
const platform = (kind: string) =>
  kind
    .split(" · ")
    .filter(
      (x) =>
        !/^(Proyecto|Project|University|Academic|Client|Business)\b/.test(x) &&
        x !== "En equipo" &&
        x !== "Team",
    )
    .join(" · ");
const cover = (p: Project) =>
  p.image ?? p.media?.find((m) => m.type === "image")?.src;
const links = (p: Project) =>
  [p.demo, p.primary, p.secondary].filter((l): l is ProjectLink => !!l);

/** Enlace del proyecto: sin dirección se muestra apagado con su nota ("Privado", "Pronto"…) */
function LinkTag({ l }: { l: ProjectLink }) {
  const t = useT();
  if (!l.href)
    return (
      <span className="border-b border-dashed border-line pb-px text-soft">
        {l.label} · {l.note ?? t("Pronto", "Soon")}
      </span>
    );
  return (
    <a
      href={l.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="border-b-[1.5px] border-fg pb-px font-bold"
    >
      {l.label} ↗
    </a>
  );
}

/** Escritorio (constelación) o celular (fila): solo se reproduce la demo de la vista visible */
const WIDE = "(min-width: 901px)";
const useWide = () =>
  useSyncExternalStore(
    (cb) => {
      const mq = matchMedia(WIDE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => matchMedia(WIDE).matches,
    () => true,
  );
const demoMedia = (p: Project) =>
  p.preview ?? p.media?.find((m) => m.type === "video");
const demo = (p: Project) => demoMedia(p)?.src;

/**
 * Cuadros de la constelación (según el boceto). Todos en 4:3, como las portadas;
 * se miden con el alto del escenario (--sh, medido con ResizeObserver) para que nunca se crucen.
 * [centro horizontal en %, arriba en % del alto]. El centro es el elegido; #1…#6 esperan su turno.
 */
const SAT = 18.6; // alto de cada cuadro de alrededor (% del escenario)
const BIG = 40; // alto del cuadro principal (% del escenario)
const MAIN: [number, number] = [50, 21];
// En fila de izquierda a derecha, en zigzag: a la derecha esperan los próximos (#1 → #3)
// y a la izquierda van quedando los ya vistos (#6 es el más cercano al centro).
// Con → todos se corren un lugar a la izquierda; con ← a la derecha.
const SLOTS: [number, number][] = [
  [72, 3], // #1 derecha, cerca
  [75, 66], // #2 derecha, al medio
  [90, 38], // #3 derecha, lejos
  [10, 38], // #4 izquierda, lejos
  [25, 66], // #5 izquierda, al medio
  [28, 3], // #6 izquierda, cerca
];
const HABLEMOS: [number, number] = [90, 80];
const GITHUB: [number, number] = [10, 80];
/** Lado de cada lugar: 0 centro, 1 derecha, -1 izquierda */
const side = (k: number) => (k === 0 ? 0 : k <= 3 ? 1 : -1);
const box = ([x, y]: [number, number], h: number, w = (h * 4) / 3) =>
  ({
    left: `calc(${x}% - var(--sh) * ${w / 200})`,
    top: `calc(var(--sh) * ${y / 100})`,
    width: `calc(var(--sh) * ${w / 100})`,
    height: `calc(var(--sh) * ${h / 100})`,
  }) as React.CSSProperties;

/**
 * Portada de un proyecto. En el principal, mientras la sección está en pantalla, la demo
 * corre sola (en silencio y en bucle) sobre la portada desenfocada, con el marco que le
 * corresponde: teléfono para apps de celular, ventana para las de escritorio y web.
 */
function Cover({
  p,
  main,
  sizes,
  auto,
}: {
  p: Project;
  main: boolean;
  sizes: string;
  /** La sección está en pantalla: la demo del principal se reproduce */
  auto?: boolean;
}) {
  const t = useT();
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const src = demo(p);
  const ratio = demoMedia(p)?.ratio ?? 16 / 10;
  const on = main && !!auto;
  // 4:3 como el cuadro (p. ej. el reloj de Rumbo): llena el cuadro sin marco
  const frame = demoMedia(p)?.round
    ? "round"
    : Math.abs(ratio - 4 / 3) < 0.05
      ? "full"
      : ratio < 0.7
        ? "phone"
        : ratio < 1.2
          ? "card"
          : "window";
  // al dejar de ser el principal se detiene la demo
  if (!on && playing) setPlaying(false);
  useEffect(() => {
    const el = v.current;
    if (!el) return;
    if (!on || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.pause();
      return;
    }
    el.currentTime = 0;
    el.play()
      .then(() => setPlaying(true))
      .catch(() => {});
  }, [on]);
  return (
    <span className="absolute inset-0 block overflow-hidden bg-[#111]">
      {cover(p) && (
        <Image
          src={cover(p)!}
          alt=""
          fill
          sizes={sizes}
          className={cx(
            "object-cover transition-[filter,scale] duration-700",
            playing && "scale-110 blur-md brightness-[.55]",
          )}
        />
      )}
      {src && (
        <span
          className={cx(
            "absolute inset-0 grid place-items-center transition-[opacity,scale] duration-700 ease-expo",
            playing ? "scale-100 opacity-100" : "scale-[.96] opacity-0",
          )}
        >
          <span
            style={frame === "full" ? undefined : { aspectRatio: ratio }}
            className={cx(
              "relative block overflow-hidden",
              frame === "full"
                ? "h-full w-full"
                : "shadow-[0_24px_50px_-20px_rgba(0,0,0,.9)]",
              frame === "round" &&
                "h-[88%] rounded-full border-[6px] border-[#2a2a2a]",
              frame === "phone" &&
                "h-[90%] rounded-[22px] border-[6px] border-[#2a2a2a]",
              frame === "card" && "h-[90%] rounded-md",
              frame === "window" &&
                "w-[90%] rounded-md border-t-[14px] border-[#2a2a2a]",
            )}
          >
            {frame === "window" && (
              <span
                aria-hidden="true"
                className="absolute -top-[10px] left-2 flex gap-1"
              >
                {[0, 1, 2].map((d) => (
                  <i key={d} className="size-1.5 rounded-full bg-white/35" />
                ))}
              </span>
            )}
            <video
              ref={v}
              src={src}
              muted
              loop
              playsInline
              preload={main ? "auto" : "none"}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </span>
        </span>
      )}
      {!src && (
        <span
          className={cx(
            "label absolute top-2.5 right-2.5 rounded-full bg-[#e9e5dd] px-2.5 py-1 font-semibold text-[#111] transition-opacity duration-500",
            main ? "opacity-100 delay-700" : "opacity-0",
          )}
        >
          {t("Ver proyecto ↗", "View project ↗")}
        </span>
      )}
    </span>
  );
}

/**
 * Proyectos como constelación (boceto de Gabriel): el elegido al centro y a color,
 * los demás alrededor en gris. "Próximo proyecto" los hace subir uno por uno hasta el #1
 * y de ahí al centro; también se puede tocar cualquiera para elegirlo.
 * En celular: el elegido arriba y los demás en una fila que se desliza.
 */
export default function Projects() {
  const t = useT();
  const { projects, sections, site } = useContent();
  const n = projects.length;
  const [order, setOrder] = useState(() => projects.map((_, i) => i));
  const [moved, setMoved] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<() => void>(() => {});
  const close = useCallback(() => closeRef.current(), []);
  const strip = useRef<HTMLUListElement>(null);
  const sec = useRef<HTMLElement>(null);
  // la demo del principal corre solo mientras la sección está en pantalla
  const [inView, setInView] = useState(false);
  const wide = useWide();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.4,
    });
    if (sec.current) io.observe(sec.current);
    return () => io.disconnect();
  }, []);
  // alto del escenario: de él salen el tamaño y la posición de los cuadros
  const stage = useRef<HTMLDivElement>(null);
  const [sh, setSh] = useState(680);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setSh(Math.round(e.contentRect.height)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // El detalle se abre creciendo desde el cuadro del proyecto
  const [from, setFrom] = useState<string | null>(null);
  /** Recorte con la forma del cuadro principal visible (escritorio o celular) */
  const rectOf = (el?: HTMLElement) => {
    const card =
      [
        ...(sec.current?.querySelectorAll<HTMLElement>("[data-cover]") ?? []),
      ].find((c) => c.offsetParent) ?? el;
    if (!card) return null;
    const r = card.getBoundingClientRect();
    return `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 6px)`;
  };
  // Al cerrar, el panel vuelve a encogerse hacia el cuadro principal tal como está ahora
  useEffect(() => {
    closeRef.current = () => {
      setFrom(rectOf());
      setOpen(null);
    };
  });
  // Si dentro del detalle se pasa a otro proyecto, la constelación lo deja al centro
  const show = (i: number) => {
    setOrder((o) => {
      const k = o.indexOf(i);
      return k > 0 ? [...o.slice(k), ...o.slice(0, k)] : o;
    });
    setMoved(false);
    setOpen(i);
  };
  const openAt = (i: number, el: HTMLElement) => {
    setFrom(rectOf(el));
    // un cuadro después, para que el panel parta desde ahí
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(i)));
  };
  const [back, setBack] = useState(false);
  const [prevOrder, setPrevOrder] = useState(order);
  const [step, setStep] = useState(0);
  // k: lugar del proyecto que pasa al centro. Los de la derecha llegan corriéndose
  // hacia la izquierda; los de la izquierda, hacia la derecha.
  const go = (k: number, prev = k > 3) => {
    if (k <= 0) return;
    setBack(prev);
    setMoved(true);
    setStep((x) => x + 1);
    setPrevOrder(order);
    setOrder((o) => [...o.slice(k), ...o.slice(0, k)]);
  };

  // ← y → cambian de proyecto cuando la sección ocupa la pantalla
  useEffect(() => {
    let seen = false;
    const io = new IntersectionObserver(
      ([e]) => (seen = e.intersectionRatio > 0.55),
      {
        threshold: [0, 0.55, 1],
      },
    );
    if (sec.current) io.observe(sec.current);
    const onKey = (e: KeyboardEvent) => {
      if (!seen || open !== null || e.altKey || e.metaKey || e.ctrlKey) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(n - 1, true);
      }
    };
    addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      removeEventListener("keydown", onKey);
    };
  });

  // en celular la fila vuelve al inicio al cambiar de proyecto
  useEffect(() => {
    strip.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [order]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const k = projects.findIndex(
        (p) => p.id === (e as CustomEvent<string>).detail,
      );
      if (k >= 0) setOpen(k);
    };
    addEventListener("open-project", onOpen);
    return () => removeEventListener("open-project", onOpen);
  }, [projects]);

  const cur = order[0];
  const p = projects[cur];
  const caption = (
    <div key={p.id}>
      <div className="flex items-start justify-between gap-4">
        <div
          className="rise min-w-0"
          style={{ animationDelay: moved ? "450ms" : "0ms" }}
        >
          <p className="label text-soft">
            {pad(cur + 1)} / {pad(n)} · {platform(p.kind)}
          </p>
          <h3 className="mt-1 text-[clamp(24px,2.2vw,34px)] leading-none font-extrabold tracking-[-.04em]">
            {p.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-snug text-soft">
            {p.summary}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => openAt(cur, e.currentTarget)}
          className="pill pill-fill rise shrink-0 px-4! py-2.5!"
          style={{ animationDelay: moved ? "600ms" : "0ms" }}
        >
          {t("Ver proyecto ↗", "View project ↗")}
        </button>
      </div>
      <div
        className="rise mt-2.5 space-y-1.5"
        style={{ animationDelay: moved ? "550ms" : "0ms" }}
      >
        <p className="label text-soft">{p.tags.slice(0, 3).join(" · ")}</p>
        <p className="label flex flex-wrap gap-x-3 gap-y-1">
          {links(p).map((l) => (
            <LinkTag key={l.label} l={l} />
          ))}
        </p>
      </div>
    </div>
  );

  const nextBtn = (
    <button
      type="button"
      onClick={() => go(1)}
      className="group flex w-full items-end justify-between gap-3 text-left"
    >
      <span className="text-[clamp(17px,1.5vw,22px)] leading-[1.05] font-extrabold tracking-[-.04em]">
        {t("Próximo", "Next")}
        <br />
        {t("proyecto", "project")}
      </span>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-fg text-bg transition-transform duration-500 ease-expo group-hover:translate-x-1">
        →
      </span>
    </button>
  );

  return (
    <section
      id="proyectos"
      ref={sec}
      className="relative flex min-h-svh flex-col px-8 pt-[74px] pb-8 max-[700px]:px-[18px] max-[700px]:pt-[70px]"
    >
      <PageHead n={2} label={sections[1].label} />

      {/* Escritorio: la constelación del boceto */}
      <div
        ref={stage}
        style={{ "--sh": `${sh}px` } as React.CSSProperties}
        className="relative -mt-6 min-h-[560px] flex-1 max-[900px]:hidden"
      >
        <ProjectScan stage={stage} active={inView && wide && open === null} />
        <div className="rv absolute top-0 left-0">
          <h2 className="display text-[clamp(52px,4.6vw,72px)]">
            {t("Proyec-", "Pro-")}
            <br />
            {t("tos", "jects")}
          </h2>
          <p className="label mt-3 text-soft">
            {t("Toca un cuadro o usa ← →", "Tap a box or use ← →")}
          </p>
        </div>

        {projects.map((q, i) => {
          const k = order.indexOf(i);
          const main = k === 0;
          // al avanzar, primero llega el del centro y después cada cuadro en orden
          // el que da la vuelta (sale por un lado y entra por el otro) se desvanece y reaparece
          const was = prevOrder.indexOf(i);
          const wrap =
            moved &&
            (back
              ? side(was) === 1 && side(k) === -1
              : side(was) === -1 && side(k) === 1);
          // todos se mueven casi juntos, como un tren: arranca primero el que va adelante
          const x = k === 0 ? 50 : SLOTS[k - 1][0];
          const delay = moved ? (back ? 100 - x : x) * 2.5 : 0;
          return (
            <button
              key={q.id}
              type="button"
              onClick={(e) => (main ? openAt(i, e.currentTarget) : go(k))}
              aria-label={
                main
                  ? t(`Ver ${q.title}`, `View ${q.title}`)
                  : t(`Elegir ${q.title}`, `Choose ${q.title}`)
              }
              aria-current={main || undefined}
              data-cover={main || undefined}
              data-sat={main ? undefined : q.title}
              style={{
                ...(main ? box(MAIN, BIG) : box(SLOTS[k - 1], SAT)),
                transitionDelay: wrap
                  ? "450ms, 450ms, 450ms, 450ms, 0ms, 0ms"
                  : `${delay}ms`,
                transitionDuration: wrap
                  ? "0ms, 0ms, 0ms, 0ms, 1000ms, 1000ms"
                  : undefined,
                animation: wrap
                  ? `${step % 2 ? "wrap-a" : "wrap-b"} .95s ease both`
                  : undefined,
              }}
              className={cx(
                "group absolute block text-left transition-[left,top,width,height,filter,opacity] duration-1000 ease-expo",
                wrap && "z-[1]",
                main
                  ? "z-[3] cursor-default"
                  : "z-[2] opacity-60 grayscale hover:opacity-100",
              )}
            >
              <Cover
                p={q}
                main={main}
                auto={inView && wide}
                sizes={main ? "34vw" : "20vw"}
              />
              {main && <DemoScan name={q.title} active={inView && wide} />}
              <span className="label absolute top-2 left-2.5 text-white mix-blend-difference">
                {pad(i + 1)}
              </span>
              <span
                className={cx(
                  "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 pt-5 pb-2 text-[13px] font-bold tracking-[-.02em] text-white transition-opacity duration-500",
                  main ? "opacity-0" : "opacity-100",
                )}
              >
                {q.title}
              </span>
            </button>
          );
        })}

        <div
          style={{ ...box([MAIN[0], MAIN[1] + BIG + 2], 18, (BIG * 4) / 3) }}
          className="absolute"
          aria-live="polite"
        >
          {caption}
        </div>

        <div
          style={box(GITHUB, SAT, 26)}
          className="absolute flex flex-col justify-between border border-fg p-3.5"
        >
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="label hover:underline"
          >
            {t("Más en GitHub ↗", "More on GitHub ↗")}
          </a>
          {nextBtn}
        </div>

        <a
          href="#contacto"
          onClick={(e) => {
            e.preventDefault();
            goTo("contacto");
          }}
          style={box(HABLEMOS, SAT, 24)}
          className="group absolute flex flex-col justify-between border border-dashed border-line p-3.5 transition-colors hover:border-fg"
        >
          <span className="label text-soft">
            {t("¿Tienes un proyecto?", "Got a project?")}
          </span>
          <b className="text-[clamp(18px,1.6vw,24px)] font-extrabold tracking-[-.04em]">
            {t("Hablemos", "Let's talk")}{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </b>
        </a>
      </div>

      {/* Celular: el elegido arriba, los demás en una fila */}
      <div className="flex flex-1 flex-col justify-center gap-5 min-[901px]:hidden">
        <h2 className="display rv text-[56px]">{t("Proyectos", "Projects")}</h2>
        <button
          type="button"
          onClick={(e) => openAt(cur, e.currentTarget)}
          data-cover
          className="relative block aspect-[4/3] w-full overflow-hidden"
          aria-label={t(`Ver ${p.title}`, `View ${p.title}`)}
        >
          <span key={p.id} className="unveil absolute inset-0 block">
            <Cover p={p} main auto={inView && !wide} sizes="100vw" />
          </span>
        </button>
        {caption}
        <ul
          ref={strip}
          className="-mx-[18px] flex snap-x scroll-px-[18px] gap-2.5 overflow-x-auto px-[18px] pb-1"
        >
          {order.slice(1).map((i, k) => (
            <li key={projects[i].id} className="shrink-0 snap-start">
              <button
                type="button"
                onClick={() => go(k + 1)}
                className="relative block h-[84px] w-[128px] overflow-hidden opacity-70 grayscale"
                aria-label={t(
                  `Elegir ${projects[i].title}`,
                  `Choose ${projects[i].title}`,
                )}
              >
                <Cover p={projects[i]} main={false} sizes="130px" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pt-4 pb-1.5 text-[11px] font-bold text-white">
                  {projects[i].title}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="label"
          >
            {t("Más en GitHub ↗", "More on GitHub ↗")}
          </a>
          <div className="w-[170px]">{nextBtn}</div>
        </div>
      </div>

      <Detail k={open} from={from} onClose={close} onGo={show} />
    </section>
  );
}

/** Detalle del proyecto a pantalla completa, en papel */
function Detail({
  k,
  from,
  onClose,
  onGo,
}: {
  k: number | null;
  /** Recorte inicial (el cuadro desde donde se abre) */
  from: string | null;
  onClose: () => void;
  onGo: (i: number) => void;
}) {
  const t = useT();
  const { projects } = useContent();
  const [mounted, setMounted] = useState(false);
  const [last, setLast] = useState(0);
  if (k !== null && k !== last) setLast(k);
  const p = projects[k ?? last];
  const isOpen = k !== null;
  // Cuenta cada apertura, así las animaciones de entrada se repiten
  const [seq, setSeq] = useState(0);
  const [wasOpen, setWasOpen] = useState(false);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setSeq((x) => x + 1);
  }
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    if (panel.current) panel.current.scrollTop = 0;
    // (también al pasar al siguiente proyecto: ver efecto de abajo)
    const id = setTimeout(
      () => closeBtn.current?.focus({ preventScroll: true }),
      400,
    );
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (k !== null && panel.current)
      panel.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [k]);

  if (!mounted) return null;
  const i = k ?? last;
  const next = (i + 1) % projects.length;
  const d = (ms: number) => ({ animationDelay: `${ms}ms` });
  const rows: [keyof Project["detail"], string, string][] = [
    ["problema", "Problema", "Problem"],
    ["solucion", "Solución", "Solution"],
    ["rol", "Mi rol", "My role"],
    ["resultado", "Resultado", "Outcome"],
  ];
  return createPortal(
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      inert={!isOpen}
      className={cx(
        "fixed inset-0 z-[70] overflow-auto bg-bg px-8 pt-6 pb-16 text-fg max-[700px]:px-[18px]",
        isOpen ? "visible" : "invisible",
      )}
      style={{
        clipPath: isOpen
          ? "inset(0px 0px 0px 0px round 0px)"
          : (from ?? "inset(100% 0px 0px 0px round 0px)"),
        opacity: isOpen ? 1 : 0,
        // Abrir: crece rápido y frena. Cerrar: el contenido se va primero, el panel
        // se encoge con suavidad hacia el cuadro y al final se desvanece sobre él.
        transition: isOpen
          ? "clip-path 1000ms cubic-bezier(.16,1,.3,1), opacity 0ms, visibility 0ms"
          : "clip-path 850ms cubic-bezier(.65,0,.35,1) 120ms, opacity 380ms ease 620ms, visibility 0ms 1000ms",
      }}
    >
      <div
        key={`${seq}-${i}`}
        className={cx(
          "transition-[opacity,translate] ease-out",
          isOpen
            ? "translate-y-0 opacity-100 duration-0"
            : "-translate-y-3 opacity-0 duration-300",
        )}
      >
        <div
          className="label rise flex items-center justify-between border-b border-line pb-3"
          style={d(250)}
        >
          <span>
            {t("Proyecto", "Project")} {pad(i + 1)} / {pad(projects.length)} —{" "}
            {platform(p.kind)}
          </span>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            className="pill px-3.5! py-2!"
          >
            {t("Cerrar", "Close")} ✕
          </button>
        </div>
        <div className="mt-10 grid grid-cols-[1.1fr_1fr] gap-14 max-[900px]:grid-cols-1">
          <div>
            <h2 className="display text-[clamp(56px,8vw,128px)]">
              {p.title.split(" ").map((w, j) => (
                <span
                  key={j}
                  className="inline-block overflow-hidden pb-[.08em] align-top"
                >
                  <span className="word-in mr-[.18em]" style={d(380 + j * 90)}>
                    {w}
                  </span>
                </span>
              ))}
            </h2>
            <div className="unveil mt-8" style={d(550)}>
              {p.media?.length ? (
                <Gallery key={p.id} media={p.media} />
              ) : cover(p) ? (
                <div className="relative aspect-[4/3]">
                  <Image
                    src={cover(p)!}
                    alt=""
                    fill
                    sizes="55vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <p
              className="rise text-[clamp(18px,1.6vw,23px)] leading-[1.4] font-medium tracking-[-.01em]"
              style={d(600)}
            >
              {p.description}
            </p>
            <p className="label rise mt-5 text-soft" style={d(680)}>
              {p.tags.join(" · ")}
            </p>
            <dl className="mt-8 border-t border-fg">
              {rows.map(([key, es, en], j) => (
                <div
                  key={key}
                  className="rise grid grid-cols-[120px_1fr] gap-4 border-b border-line py-4 max-[700px]:grid-cols-1 max-[700px]:gap-1"
                  style={d(740 + j * 90)}
                >
                  <dt className="label text-soft">{t(es, en)}</dt>
                  <dd className="text-[15px]">{p.detail[key]}</dd>
                </div>
              ))}
            </dl>
            <div
              className="label rise mt-7 flex flex-wrap gap-5"
              style={d(1100)}
            >
              {links(p).map((l) => (
                <LinkTag key={l.label} l={l} />
              ))}
            </div>
          </div>
        </div>

        {/* Pasar al siguiente proyecto */}
        <button
          type="button"
          onClick={() => onGo(next)}
          className="group mt-20 flex w-full items-end justify-between border-t border-fg pt-5 text-left"
        >
          <span>
            <span className="label block text-soft">
              {t("Siguiente proyecto", "Next project")} · {pad(next + 1)}
            </span>
            <span className="display mt-2 block text-[clamp(44px,6vw,96px)] transition-transform duration-700 ease-expo group-hover:translate-x-3">
              {projects[next].title}
            </span>
          </span>
          <ArrowOut
            size={56}
            className="shrink-0 transition-transform duration-700 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </button>
      </div>
    </div>,
    document.body,
  );
}
