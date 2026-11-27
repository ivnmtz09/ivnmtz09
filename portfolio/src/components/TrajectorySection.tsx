import { Award, Briefcase, GraduationCap } from 'lucide-react';
import { CERTIFICATIONS, EDUCATION, EXPERIENCE, Lang, UI_COPY } from '../data/portfolioData';
import { useScrollReveal } from '../hooks/useScrollEffects';

interface TrajectorySectionProps { lang: Lang; }

export function TrajectorySection({ lang }: TrajectorySectionProps) {
  const copy = UI_COPY[lang].trajectory;
  const { ref, visible } = useScrollReveal();

  return (
    <section
      id="trajectory"
      tabIndex={-1}
      className="relative py-18 sm:py-26"
    >
      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-4 transition-[opacity,transform] duration-500 ease-out sm:px-6 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {/* Two-column layout: Timeline LEFT (col-span-8), open 3D PYRAMID space RIGHT (col-span-4) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left column — trajectory content */}
          <div className="lg:col-span-8">
            <div className="glass relative mb-6 p-6">
              <p className="font-mono text-xs font-semibold tracking-wider text-[color:var(--glass-accent)] uppercase">{copy.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">{copy.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-[0.9375rem] dark:text-zinc-300">{copy.subtitle}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-900 uppercase dark:text-white">
                  <Briefcase className="h-4 w-4 text-[#0066FF]" />
                  {copy.experienceTitle}
                </div>
                {EXPERIENCE.map((exp) => (
                  <div key={exp.org} className="glass glass-hover relative p-5">
                    <div className="absolute top-4 left-0 h-8 w-0.5 bg-[#0066FF]" />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-[color:var(--glass-accent)]">{exp.period}</span>
                      {exp.location && <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">{exp.location}</span>}
                    </div>
                    <h4 className="mt-1.5 text-sm font-bold text-zinc-900 dark:text-white">{exp.title[lang]}</h4>
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{exp.org}</p>
                    <ul className="mt-2.5 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      {exp.bullets[lang].map((b) => (
                        <li key={b} className="flex items-start gap-1.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0066FF]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-2 font-mono text-xs font-bold text-zinc-900 uppercase dark:text-white">
                  <GraduationCap className="h-4 w-4 text-[#0066FF]" />
                  {copy.educationTitle}
                </div>
                <div className="space-y-2.5">
                  {EDUCATION.map((edu) => (
                    <div key={edu.org} className="glass relative p-4">
                      <div className="absolute top-3 left-0 h-6 w-0.5 bg-[#0066FF] opacity-60" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{edu.title[lang]}</h4>
                        <span className="font-mono text-xs font-semibold text-[color:var(--glass-accent)]">{edu.period}</span>
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">{edu.org}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold text-zinc-900 uppercase dark:text-white">
                  <Award className="h-4 w-4 text-[#0066FF]" />
                  {copy.certificationsTitle}
                </div>
                <div className="space-y-2.5">
                  {CERTIFICATIONS.map((cert) => (
                    <div key={cert.title} className="glass glass-hover relative p-4">
                      <span className="glass-blue inline-block px-2 py-0.5 font-mono text-[11px] font-semibold text-[color:var(--glass-accent)]">
                        {cert.tag[lang]}
                      </span>
                      <h4 className="mt-1.5 text-sm font-bold text-zinc-900 dark:text-white">{cert.title}</h4>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">{cert.issuer}</p>
                        <span className="shrink-0 font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400">{cert.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">* {copy.certNote}</p>
              </div>
            </div>
          </div>

          {/* Right column — unobstructed open space for 3D Stepped Pyramid */}
          <div data-stage-anchor className="h-44 sm:h-52 lg:h-auto lg:col-span-4 lg:min-h-[500px] order-first lg:order-none" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
