import { useEffect, useState } from 'react';
import { ArrowRight, Check, Copy, Github, Linkedin, MapPin } from 'lucide-react';
import { Lang, PROFILE, UI_COPY } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';

interface HeroProps {
  lang: Lang;
}

export function Hero({ lang }: HeroProps) {
  const copy = UI_COPY[lang].hero;
  const roles = PROFILE.typingRoles[lang];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDeleting(false);
    setRoleIndex(0);
  }, [lang]);

  useEffect(() => {
    const current = roles[roleIndex % roles.length];
    const speed = deleting ? 32 : 55;

    const timer = window.setTimeout(() => {
      if (!deleting && displayed.length < current.length) {
        setDisplayed(current.slice(0, displayed.length + 1));
      } else if (!deleting && displayed.length === current.length) {
        window.setTimeout(() => setDeleting(true), 1500);
      } else if (deleting && displayed.length > 0) {
        setDisplayed(current.slice(0, displayed.length - 1));
      } else {
        setDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }, speed);

    return () => window.clearTimeout(timer);
  }, [displayed, deleting, roleIndex, roles]);

  const handleCopyEmail = async () => {
    soundEngine.playClick();
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section
      id="top"
      tabIndex={-1}
      className="relative min-h-[560px] overflow-hidden"
    >
      <div className="relative z-10 mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-20 lg:grid-cols-12 lg:items-center lg:gap-10">
        {/* Left column — frosted glass card container */}
        <div className="glass rounded-sm p-6 sm:p-8 lg:col-span-7">
          <div className="glass-blue mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-[11px] font-medium text-zinc-900 dark:text-zinc-100 sm:text-xs">
            <span className="h-2 w-2 shrink-0 animate-pulse bg-[#0066FF]" />
            <span>{copy.statusBadge}</span>
          </div>

          <p className="mb-1.5 font-mono text-sm font-semibold text-[color:var(--glass-accent)]">
            {copy.greeting}
          </p>

          <h1 className="text-[clamp(2.35rem,1rem_+_6vw,4.65rem)] leading-[0.98] font-bold tracking-[-0.055em] text-balance text-zinc-900 dark:text-white">
            {PROFILE.name}
          </h1>

          <div className="mt-4 flex min-h-[3.2rem] items-start font-mono text-sm font-semibold text-zinc-800 sm:min-h-[2rem] sm:items-center sm:text-lg dark:text-zinc-100">
            <span className="mr-2 shrink-0 text-[color:var(--glass-accent)]">&gt;</span>
            <span>
              {displayed}
              <span className="animate-cursor ml-1 inline-block h-4 w-2 align-middle bg-[#0066FF] sm:h-5" />
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed whitespace-pre-line text-zinc-700 sm:text-[0.9375rem] dark:text-zinc-300">
            {copy.summary}
          </p>

          <div className="mt-5 flex items-center gap-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">
            <MapPin className="h-4 w-4 shrink-0 text-[#0066FF]" />
            <span>{PROFILE.location} · {PROFILE.university}</span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              onClick={() => soundEngine.playClick()}
              className="inline-flex items-center gap-2 bg-[#0066FF] px-5 py-3 font-mono text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-[#0052CC]"
            >
              <span>{copy.ctaProjects}</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="glass-chip glass-hover inline-flex items-center gap-2 px-4 py-3 font-mono text-xs font-semibold tracking-wider text-zinc-900 uppercase hover:text-[color:var(--glass-accent)] dark:text-zinc-100"
            >
              {copiedEmail ? (
                <>
                  <Check className="h-4 w-4 text-[#0066FF]" />
                  <span>{copy.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>{copy.ctaCopyEmail}</span>
                </>
              )}
            </button>

            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundEngine.playClick()}
              aria-label="GitHub"
              className="glass-chip glass-hover inline-flex h-11 w-11 items-center justify-center text-zinc-800 hover:text-[color:var(--glass-accent)] dark:text-zinc-200"
            >
              <Github className="h-5 w-5" />
            </a>

            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundEngine.playClick()}
              aria-label="LinkedIn"
              className="glass-chip glass-hover inline-flex h-11 w-11 items-center justify-center text-zinc-800 hover:text-[color:var(--glass-accent)] dark:text-zinc-200"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Right column — completely open unobstructed space for 3D Rocket Arrow ▲ */}
        <div data-stage-anchor className="h-44 sm:h-52 lg:h-auto lg:col-span-5 lg:min-h-[440px] order-first lg:order-none" aria-hidden="true" />
      </div>
    </section>
  );
}
