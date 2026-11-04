import { navLinks, site } from "@/data/site";
import Hid from "./fx/Hid";
import ReplayIntro from "./fx/ReplayIntro";
import { ArrowUpIcon, GithubIcon, InstagramIcon, LinkedinIcon, MailIcon } from "./Icons";

const socials = [
  { label: "GitHub", href: site.github, Icon: GithubIcon },
  { label: "LinkedIn", href: site.linkedin, Icon: LinkedinIcon },
  { label: "Instagram de Neveo", href: site.instagram, Icon: InstagramIcon },
  { label: "Correo", href: `mailto:${site.email}`, Icon: MailIcon },
];

/** Pie de página con créditos de cine. */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="footer" className="wrap credits">
      <p>Un portafolio de</p>
      <div className="big">{site.name}</div>
      <p>Dirección, diseño y desarrollo · {site.name}</p>
      <p>Hecho con Next.js, TypeScript y Tailwind CSS</p>

      <ul className="m-0 mt-6 flex list-none gap-3 p-0" aria-label="Redes">
        {socials.map(({ label, href, Icon }) => (
          <li key={label}>
            <a
              className="btn icon"
              href={href}
              aria-label={label}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Icon size={18} />
            </a>
          </li>
        ))}
      </ul>

      <nav aria-label="Enlaces rápidos" className="mt-4">
        <ul className="m-0 flex max-w-xl list-none flex-wrap justify-center gap-x-5 gap-y-2 p-0 text-sm text-mut">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-fg">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-6">
        {site.city} · © {year} {site.name}
      </p>
      <p>Hasta aquí, todo bien.</p>
      <p>Fin</p>

      <div className="flex flex-wrap justify-center gap-3">
        <a className="btn sm" href="#inicio">
          <ArrowUpIcon size={14} /> Volver arriba
        </a>
        <ReplayIntro />
      </div>

      <Hid x="8%" y="30%">22:22</Hid>
    </footer>
  );
}
