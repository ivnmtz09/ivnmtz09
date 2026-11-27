import { Ref, useRef, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Sun, Volume2, VolumeX, X } from 'lucide-react';
import { Lang, NAV_SECTIONS, PROFILE, SectionId, UI_COPY } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  progressRef: Ref<HTMLDivElement>;
  activeSection: SectionId;
  lang: Lang;
  onToggleLang: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
}

const controls = 'glass-chip grid h-9 sm:h-10 shrink-0 place-items-center rounded-lg text-zinc-700 transition-colors hover:border-[#0066FF] hover:text-blue-700 dark:text-zinc-200 dark:hover:text-blue-300';

export function Navbar({
  progressRef,
  activeSection,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  soundOn,
  onToggleSound,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const copy = UI_COPY[lang].nav;

  return (
    <header
      className="site-header glass-band relative z-50 w-full backdrop-blur-md"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && mobileOpen) {
          setMobileOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-0.5 overflow-hidden">
        <div
          ref={progressRef}
          className="h-full w-full origin-left bg-[#0066FF] will-change-transform"
          style={{ transform: 'scaleX(var(--scroll-progress, 0))' }}
        />
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3.5 max-[359px]:gap-1.5 max-[359px]:px-3 sm:gap-4 sm:px-6">
        <a
          href="#top"
          aria-label={copy.top}
          aria-current={activeSection === 'top' ? 'location' : undefined}
          onClick={() => {
            soundEngine.playClick();
            setMobileOpen(false);
          }}
          className="group flex shrink-0 items-center gap-2.5 rounded-lg text-zinc-900 max-[359px]:gap-2 dark:text-white"
        >
          <BrandLogo size={36} framed={false} className="shrink-0 max-[359px]:size-8 sm:size-10" />
          <span className="flex flex-col leading-tight">
            <span className="text-[11px] font-bold uppercase sm:text-xs">{PROFILE.shortName}</span>
            <span className="text-[10px] text-zinc-600 group-hover:text-blue-700 dark:text-zinc-400 dark:group-hover:text-blue-300">{PROFILE.handle}</span>
          </span>
        </a>

        <nav aria-label={copy.primary} className="hidden items-center gap-1 lg:flex xl:gap-2">
          {NAV_SECTIONS.slice(1).map(({ id, marker }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={id === activeSection ? 'location' : undefined}
              onClick={() => soundEngine.playClick()}
              className="header-section-link relative rounded-md px-2 py-2.5 text-[11px] font-semibold whitespace-nowrap xl:px-2.5"
            >
              <span aria-hidden="true" className="mr-1 hidden text-zinc-500 xl:inline dark:text-zinc-400">{marker}</span>
              {copy[id]}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 max-[359px]:gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundOn ? copy.soundOn : copy.soundOff}
            title={soundOn ? copy.soundOn : copy.soundOff}
            className={`${controls} w-9 max-[359px]:w-7`}
          >
            {soundOn ? <Volume2 aria-hidden="true" className="size-4 text-blue-700 dark:text-blue-300" /> : <VolumeX aria-hidden="true" className="size-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onToggleLang();
            }}
            aria-label={copy.language}
            title={copy.language}
            className={`${controls} px-2 text-[11px] max-[359px]:px-1.5 font-semibold`}
          >
            <span aria-hidden="true">{lang === 'es' ? 'ES / EN' : 'EN / ES'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onToggleTheme();
            }}
            aria-label={copy.theme}
            title={copy.theme}
            className={`${controls} w-9 max-[359px]:w-7`}
          >
            {theme === 'dark' ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
          </button>

          <a
            href="#contact"
            onClick={() => {
              soundEngine.playClick();
              setMobileOpen(false);
            }}
            className="header-cta hidden h-10 items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold text-white sm:inline-flex"
          >
            {copy.hireMe}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>

          <button
            ref={menuButton}
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setMobileOpen((prev) => !prev);
            }}
            aria-label={copy.menu}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className={`${controls} w-9 max-[359px]:w-7 lg:hidden`}
          >
            {mobileOpen ? <X aria-hidden="true" className="size-4" /> : <Menu aria-hidden="true" className="size-4" />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        aria-label={copy.primary}
        hidden={!mobileOpen}
        className="mobile-navigation glass-band absolute inset-x-0 top-full overflow-y-auto backdrop-blur-md lg:hidden"
      >
        <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
          {NAV_SECTIONS.map(({ id, marker }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={id === activeSection ? 'location' : undefined}
              onClick={() => {
                soundEngine.playClick();
                setMobileOpen(false);
              }}
              className="header-section-link relative flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-semibold"
            >
              <span aria-hidden="true" className="w-5 text-zinc-500 dark:text-zinc-400">{marker}</span>
              {copy[id]}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
