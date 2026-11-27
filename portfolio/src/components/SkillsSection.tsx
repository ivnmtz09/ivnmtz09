import { Globe, Sparkles } from 'lucide-react';
import { Lang, SKILL_GROUPS, SOFT_SKILLS, UI_COPY } from '../data/portfolioData';
import { useScrollReveal } from '../hooks/useScrollEffects';
import { GridCellMarkers } from './BrandLogo';

interface SkillsSectionProps { lang: Lang; }

export function SkillsSection({ lang }: SkillsSectionProps) {
  const copy = UI_COPY[lang].skills;
  const { ref, visible } = useScrollReveal();

  return (
    <section
      id="skills"
      className="relative border-b border-zinc-200/60 py-18 sm:py-26 dark:border-zinc-800/60"
    >
      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-4 transition-[opacity,transform] duration-500 ease-out sm:px-6 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {/* Two-column layout: open 3D ATOM space LEFT (col-span-5), Content RIGHT (col-span-7) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="hidden lg:col-span-5 lg:block lg:min-h-[480px]" aria-hidden="true" />

          {/* Right column — skill content */}
          <div className="space-y-4 lg:col-span-7">
            <div className="glass relative p-6">
              <GridCellMarkers />
              <p className="font-mono text-xs font-semibold tracking-wider text-[#0066FF] uppercase">{copy.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">{copy.title}</h2>
              <p className="mt-3 text-sm text-zinc-700 sm:text-base dark:text-zinc-300">{copy.subtitle}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {SKILL_GROUPS.map((group) => (
                <div key={group.id} className="glass glass-hover relative p-4">
                  <GridCellMarkers />
                  <h3 className="font-mono text-xs font-semibold text-[#0066FF]">{group.label[lang]}</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {group.items.map((skill) => (
                      <span key={skill} className="glass-chip px-2 py-0.5 font-mono text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="glass relative p-4">
                <GridCellMarkers />
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#0066FF]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {copy.softSkillsTitle}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {SOFT_SKILLS[lang].map((item) => (
                    <span key={item} className="glass-blue px-2.5 py-1 font-mono text-[11px] font-medium text-zinc-900 dark:text-zinc-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="glass relative p-4">
                <GridCellMarkers />
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#0066FF]">
                  <Globe className="h-3.5 w-3.5" />
                  {copy.languagesTitle}
                </div>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {copy.languages.map((l) => (
                    <li key={l.name} className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-white">{l.name}</span>
                      <span className="glass-blue px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
