import Image from "next/image";
import type { Project } from "@/types";
import ProjectArt from "./ProjectArt";
import { cx } from "./ui";

/**
 * Vista previa de un proyecto en su formato: ventana de navegador (web), celular (mobile)
 * o reloj (watch). Si el proyecto tiene `image` se muestra la captura; si no, una maqueta
 * con la ilustración. Todo escala con el ancho del recuadro (unidades cqw).
 */
export default function ProjectScreen({ project: p, className }: { project: Project; className?: string }) {
  return (
    <div className={cx("@container relative h-full w-full overflow-hidden text-left", className)}>
      {(p.format === "web" || p.format === "desktop") && <WebScreen p={p} />}
      {p.format === "mobile" && <DeviceScreen p={p} kind="mobile" />}
      {p.format === "watch" && <DeviceScreen p={p} kind="watch" />}
    </div>
  );
}

/** Lo que se ve en la barra: el dominio de la demo si existe; si no, el nombre del proyecto. */
const host = (p: Project) => {
  const slug = p.title.toLowerCase();
  if (p.format === "desktop" || !p.secondary.href) return p.format === "desktop" ? p.title : slug;
  try {
    const h = new URL(p.secondary.href).host;
    return /github\.com|instagram\.com/.test(h) ? slug : h;
  } catch {
    return slug;
  }
};

function WebScreen({ p }: { p: Project }) {
  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Barra del navegador */}
      <div className="flex h-[5.5cqw] max-h-9 min-h-5 flex-none items-center gap-[1.4cqw] border-b border-line bg-bg2 px-[2cqw]">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <i key={c} className="block size-[1.3cqw] max-h-2.5 min-h-1.5 max-w-2.5 min-w-1.5 rounded-full opacity-80" style={{ background: c }} />
        ))}
        <span className="mx-auto truncate rounded-md bg-glass2 px-[3cqw] py-[.5cqw] font-cine text-[max(9px,1.5cqw)] text-mut">{host(p)}</span>
      </div>

      {/* Página */}
      <div className="relative min-h-0 flex-1">
        {p.image ? (
          <Image src={p.image} alt={`Captura de ${p.title}`} fill sizes="(max-width: 768px) 90vw, 900px" className="object-cover object-top" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_72%_55%,color-mix(in_srgb,var(--acc)_22%,transparent),transparent_70%)] text-fg">
            <div className="flex items-center justify-between px-[5cqw] pt-[3cqw] text-[max(8px,1.4cqw)]">
              <span className="font-semibold">{p.title}</span>
              <span className="flex gap-[2.4cqw] text-mut">
                <span>Inicio</span>
                <span>Funciones</span>
                <span>Contacto</span>
              </span>
            </div>
            <div className="absolute top-[20%] left-[5cqw] flex w-[42%] flex-col gap-[1.6cqw]">
              <p className="m-0 text-[max(15px,5.4cqw)] leading-[1.02] font-semibold tracking-[-.04em]">{p.title}</p>
              <p className="m-0 text-[max(8px,1.5cqw)] text-mut">{p.kind}</p>
              <span className="mt-[1.5cqw] block h-[.9cqw] w-[70%] rounded-full bg-glass2" />
              <span className="block h-[.9cqw] w-[52%] rounded-full bg-glass2" />
              <span className="mt-[2cqw] block h-[3.6cqw] w-[30%] rounded-full bg-acc" />
            </div>
            <ProjectArt art={p.art} className="absolute top-1/2 right-[3%] h-auto w-[52%] -translate-y-1/2" />
          </div>
        )}
      </div>
    </div>
  );
}

function DeviceScreen({ p, kind }: { p: Project; kind: "mobile" | "watch" }) {
  return (
    <div className="flex h-full items-center justify-center bg-[radial-gradient(55%_75%_at_50%_50%,color-mix(in_srgb,var(--acc)_24%,transparent),transparent_72%),var(--bg)]">
      {p.image ? (
        <div
          className={cx(
            "relative overflow-hidden border-[#1d1e19] bg-black shadow-[0_30px_60px_-20px_rgba(0,0,0,.7)]",
            kind === "mobile" ? "aspect-[9/19] h-[88%] rounded-[12%/6%] border-[1.2cqw]" : "aspect-square h-[62%] rounded-[30%] border-[1.6cqw]",
          )}
        >
          <Image src={p.image} alt={`Captura de ${p.title}`} fill sizes="400px" className="object-cover" />
        </div>
      ) : kind === "mobile" ? (
        // Maqueta de celular con la ilustración en pantalla
        <div className="relative flex aspect-[9/19] h-[88%] items-center justify-center overflow-hidden rounded-[14%/7%] border-[1.2cqw] border-[#1d1e19] bg-bg2 shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]">
          <span className="absolute top-[2.5%] left-1/2 h-[2.6%] w-[30%] -translate-x-1/2 rounded-full bg-[#1d1e19]" />
          <div className="absolute inset-x-[8%] top-[9%] flex flex-col gap-[1cqw]">
            <p className="m-0 font-card text-[max(9px,2cqw)] leading-tight font-bold text-fg">{p.title}</p>
            <span className="block h-[.7cqw] w-[70%] rounded-full bg-glass2" />
          </div>
          <ProjectArt art={p.art} className="h-auto w-[175%] max-w-none" />
          <span className="absolute inset-x-[8%] bottom-[6%] block h-[4cqw] rounded-[1.2cqw] bg-acc" />
        </div>
      ) : (
        <ProjectArt art={p.art} className="h-[92%] w-auto" />
      )}
    </div>
  );
}
