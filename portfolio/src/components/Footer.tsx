import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { Lang, NAV_SECTIONS, PROFILE, UI_COPY } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  lang: Lang;
}

export function Footer({ lang }: FooterProps) {
  const { footer: copy, hero, nav } = UI_COPY[lang];
  const directLinks = [
    { icon: Github, label: 'GitHub', href: PROFILE.github, external: true },
    { icon: Linkedin, label: 'LinkedIn', href: PROFILE.linkedin, external: true },
    { icon: Mail, label: copy.email, href: `mailto:${PROFILE.email}`, external: false },
  ];

  return (
    <footer className="site-footer glass-band relative z-10 w-full backdrop-blur-md">
      <div className="portfolio-content">
        <div className="@container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 py-4 @min-[49rem]:grid-cols-[minmax(0,1fr)_minmax(12rem,15rem)_auto] @min-[49rem]:gap-x-8">
            <div className="col-span-2 @min-[49rem]:col-span-1">
              <div className="flex items-center gap-2.5">
                <BrandLogo size={36} framed={false} className="shrink-0 sm:size-10" />
                <div>
                  <h2 className="text-xl leading-none font-bold tracking-tight uppercase sm:text-2xl">{PROFILE.shortName}</h2>
                  <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">{PROFILE.handle}</p>
                </div>
              </div>
              <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#0066FF]" />
                {hero.statusBadge}
              </p>
            </div>

            <nav aria-label={copy.navigation}>
              <p className="mb-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">{copy.navigation}</p>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                {NAV_SECTIONS.slice(2).map(({ id }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={() => soundEngine.playClick()}
                      className="text-zinc-700 underline-offset-4 hover:text-blue-700 hover:underline dark:text-zinc-300 dark:hover:text-blue-300"
                    >
                      {nav[id]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label={copy.links}>
              <p className="mb-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">{copy.links}</p>
              <ul className="flex flex-wrap gap-1.5">
                {directLinks.map(({ icon: Icon, label, href, external }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer' : undefined}
                      onClick={() => soundEngine.playClick()}
                      className="glass-chip inline-flex min-h-7 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-zinc-700 transition-colors hover:border-[#0066FF] hover:text-blue-700 dark:text-zinc-200 dark:hover:text-blue-300"
                    >
                      <Icon aria-hidden="true" className="size-3.5" />
                      {label}
                      {external && <ArrowUpRight aria-hidden="true" className="size-3 text-zinc-500 dark:text-zinc-400" />}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-900/10 py-2 dark:border-white/10">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{copy.builtWith}</p>
            <a
              href="#top"
              onClick={() => soundEngine.playClick()}
              className="glass-blue inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-800 hover:border-[#0066FF] dark:text-blue-200"
            >
              {copy.backToTop}
              <ArrowUp aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
