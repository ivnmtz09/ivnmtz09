import { Lang, UI_COPY } from '../data/portfolioData';
import { useScrollReveal } from '../hooks/useScrollEffects';
import { GridCellMarkers } from './BrandLogo';

interface AboutSectionProps {
  lang: Lang;
}

export function AboutSection({ lang }: AboutSectionProps) {
  const copy = UI_COPY[lang].about;
  const { ref, visible } = useScrollReveal();

  return (
    <section
      id="about"
      className="relative border-b border-zinc-200/60 py-18 sm:py-26 dark:border-zinc-800/60"
    >
      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-4 transition-[opacity,transform] duration-500 ease-out sm:px-6 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {/* Two-column layout: open 3D PROFILE space LEFT (col-span-5), Content RIGHT (col-span-7) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="hidden lg:col-span-5 lg:block lg:min-h-[440px]" aria-hidden="true" />

          {/* Right column — readable frosted glass panels + metrics */}
          <div className="space-y-6 lg:col-span-7">
            <div className="glass relative p-6 sm:p-8">
              <GridCellMarkers />
              <p className="font-mono text-xs font-semibold tracking-wider text-[#0066FF] uppercase">
                {copy.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
                {copy.title}
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-zinc-700 sm:text-base dark:text-zinc-300">
                {copy.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>

            {/* Glassmorphism metric cards */}
            <div className="grid grid-cols-2 gap-3">
              {copy.metrics.map((metric) => (
                <div key={metric.label} className="glass glass-hover relative p-4 sm:p-5">
                  <GridCellMarkers />
                  <p className="font-mono text-xl font-bold text-[#0066FF] sm:text-2xl">{metric.value}</p>
                  <h3 className="mt-2 text-xs font-semibold text-zinc-900 sm:text-sm dark:text-white">{metric.label}</h3>
                  <p className="mt-1 text-[11px] text-zinc-600 sm:text-xs dark:text-zinc-400">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
