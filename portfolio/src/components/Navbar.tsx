import { useState } from 'react';
import { Menu, Moon, Sun, Volume2, VolumeX, X } from 'lucide-react';
import { Lang, PROFILE, UI_COPY } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  lang: Lang;
  onToggleLang: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
}

export function Navbar({
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  soundOn,
  onToggleSound,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const copy = UI_COPY[lang].nav;

  const links = [
    { href: '#about', label: copy.about },
    { href: '#projects', label: copy.projects },
    { href: '#skills', label: copy.skills },
    { href: '#trajectory', label: copy.trajectory },
    { href: '#contact', label: copy.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/80">
      <div
        className="h-[2px] w-full origin-left bg-[#0066FF] will-change-transform"
        style={{ transform: 'scaleX(var(--scroll-progress, 0))' }}
      />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="#top"
          onClick={() => soundEngine.playClick()}
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-zinc-900 dark:text-white"
        >
          <BrandLogo size={32} className="text-zinc-900 transition group-hover:scale-105 dark:text-white" />
          <div className="flex flex-col leading-none">
            <span className="font-mono text-xs font-bold tracking-wider uppercase">
              IVAN MARTINEZ
            </span>
            <span className="font-mono text-[10px] text-[#0066FF]">{PROFILE.handle}</span>
          </div>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => soundEngine.playClick()}
              className="font-mono text-xs font-medium tracking-wide text-zinc-600 uppercase transition hover:text-[#0066FF] dark:text-zinc-400 dark:hover:text-[#0066FF]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onToggleSound();
            }}
            aria-label={soundOn ? 'Mute UI sounds' : 'Enable UI sounds'}
            title={soundOn ? 'Sonido activado' : 'Sonido silenciado'}
            className="flex h-8 w-8 items-center justify-center border border-zinc-300 bg-zinc-100 text-zinc-800 transition hover:border-[#0066FF] hover:text-[#0066FF] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-[#0066FF] dark:hover:text-[#0066FF]"
          >
            {soundOn ? <Volume2 className="h-4 w-4 text-[#0066FF]" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onToggleLang();
            }}
            aria-label="Toggle language"
            className="border border-zinc-300 bg-zinc-100 px-2.5 py-1.5 font-mono text-xs font-semibold text-zinc-800 transition hover:border-[#0066FF] hover:text-[#0066FF] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-[#0066FF] dark:hover:text-[#0066FF]"
          >
            {lang === 'es' ? 'ES / EN' : 'EN / ES'}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onToggleTheme();
            }}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center border border-zinc-300 bg-zinc-100 text-zinc-800 transition hover:border-[#0066FF] hover:text-[#0066FF] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-[#0066FF] dark:hover:text-[#0066FF]"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href="#contact"
            onClick={() => soundEngine.playClick()}
            className="hidden bg-[#0066FF] px-3.5 py-1.5 font-mono text-xs font-semibold text-white transition hover:bg-[#0052CC] sm:inline-flex"
          >
            {copy.hireMe}
          </a>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setMobileOpen((prev) => !prev);
            }}
            aria-label="Toggle menu"
            className="flex h-8 w-8 items-center justify-center border border-zinc-300 text-zinc-800 md:hidden dark:border-zinc-700 dark:text-zinc-300"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  soundEngine.playClick();
                  setMobileOpen(false);
                }}
                className="px-3 py-2 font-mono text-xs font-medium text-zinc-700 uppercase transition hover:bg-zinc-100 hover:text-[#0066FF] dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
