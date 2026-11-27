import { Lang, UI_COPY } from '../data/portfolioData';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  lang: Lang;
}

export function Footer({ lang }: FooterProps) {
  const copy = UI_COPY[lang].footer;

  return (
    <footer className="relative z-10 border-t border-zinc-200/70 bg-white/80 py-8 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
        <div className="flex items-center gap-3">
          <BrandLogo size={26} className="text-zinc-900 dark:text-white" />
          <p className="font-mono text-xs text-[#0066FF]">
            {copy.status}
          </p>
        </div>
        <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
          {copy.builtWith}
        </p>
      </div>
    </footer>
  );
}
