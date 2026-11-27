import { useState } from 'react';
import { ExternalLink, Layers, Server, Smartphone, Database, Cloud, X, CheckCircle2 } from 'lucide-react';
import { Lang, PROJECTS, ProjectItem, UI_COPY } from '../data/portfolioData';
import { useScrollReveal } from '../hooks/useScrollEffects';
import { soundEngine } from '../utils/soundEngine';
import { GridCellMarkers } from './BrandLogo';

interface ProjectsSectionProps { lang: Lang; }

export function ProjectsSection({ lang }: ProjectsSectionProps) {
  const copy = UI_COPY[lang].projects;
  const [filter, setFilter] = useState<'all' | 'fullstack' | 'backend' | 'ecosystem'>('all');
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const { ref, visible } = useScrollReveal();

  const visibleProjects = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section
      id="projects"
      className="relative border-b border-zinc-200/60 py-18 sm:py-26 dark:border-zinc-800/60"
    >
      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-4 transition-[opacity,transform] duration-500 ease-out sm:px-6 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {/* Two-column layout: Projects LEFT (col-span-8), open 3D BRACKETS space RIGHT (col-span-4) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left column — project content */}
          <div className="lg:col-span-8">
            <div className="glass relative mb-6 p-6">
              <GridCellMarkers />
              <p className="font-mono text-xs font-semibold tracking-wider text-[#0066FF] uppercase">
                {copy.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
                {copy.title}
              </h2>
              <p className="mt-3 text-sm text-zinc-700 sm:text-base dark:text-zinc-300">{copy.subtitle}</p>
            </div>

            {/* Filters */}
            <div className="mb-5 flex flex-wrap gap-2">
              {copy.filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setFilter(item.id);
                  }}
                  className={`px-3.5 py-1.5 font-mono text-xs font-semibold transition ${
                    filter === item.id
                      ? 'glass-blue text-[#0066FF]'
                      : 'glass-chip glass-hover text-zinc-700 hover:text-[#0066FF] dark:text-zinc-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Project cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {visibleProjects.map((project) => (
                <article
                  key={project.id}
                  className="glass glass-hover group relative flex flex-col justify-between p-5"
                >
                  <GridCellMarkers />
                  <div>
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="glass-blue px-2 py-0.5 font-mono text-[11px] font-bold text-[#0066FF]">
                        {project.year}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                        {project.role[lang]}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-zinc-900 dark:text-white">{project.title}</h3>
                    <p className="font-mono text-xs font-medium text-[#0066FF]">{project.subtitle[lang]}</p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {project.description[lang]}
                    </p>
                    <ul className="mt-2.5 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                      {project.highlights[lang].slice(0, 2).map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0066FF]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 5).map((tech) => (
                        <span key={tech} className="glass-chip px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-800 dark:text-zinc-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-200/50 pt-3 dark:border-zinc-700/40">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setSelected(project);
                      }}
                      className="glass-blue inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-semibold text-[#0066FF] transition hover:bg-[#0066FF] hover:text-white"
                    >
                      <Layers className="h-3.5 w-3.5" />
                      {copy.viewArchitecture}
                    </button>
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => soundEngine.playClick()}
                      className="glass-chip inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-semibold text-zinc-700 transition hover:border-[#0066FF] hover:text-[#0066FF] dark:text-zinc-300"
                    >
                      {copy.viewRepo}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    {project.secondaryRepoUrl && project.secondaryRepoLabel && (
                      <a
                        href={project.secondaryRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => soundEngine.playClick()}
                        className="glass-chip inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-semibold text-zinc-700 transition hover:border-[#0066FF] hover:text-[#0066FF] dark:text-zinc-300"
                      >
                        {project.secondaryRepoLabel[lang]}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right column — unobstructed open space for 3D Code Brackets < / > */}
          <div className="hidden lg:col-span-4 lg:block lg:min-h-[500px]" aria-hidden="true" />
        </div>
      </div>

      {/* Architecture Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="glass relative max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <GridCellMarkers />
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-semibold text-[#0066FF]">
                  {copy.modal.architectureTitle} · {selected.year}
                </span>
                <h3 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{selected.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{selected.subtitle[lang]}</p>
              </div>
              <button
                type="button"
                aria-label={copy.modal.close}
                onClick={() => {
                  soundEngine.playClick();
                  setSelected(null);
                }}
                className="glass-chip p-2 text-zinc-600 transition hover:text-[#0066FF] dark:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { icon: Server,     label: copy.modal.backend,    val: selected.architecture[lang].backend },
                { icon: Smartphone, label: copy.modal.frontend,   val: selected.architecture[lang].frontend },
                { icon: Database,   label: copy.modal.database,   val: selected.architecture[lang].database },
                { icon: Cloud,      label: copy.modal.deployment, val: selected.architecture[lang].deployment },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="glass-blue p-4">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#0066FF]">
                    <Icon className="h-4 w-4" />{label}
                  </div>
                  <p className="mt-1.5 text-sm text-zinc-800 dark:text-zinc-200">{val}</p>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <h4 className="font-mono text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                {copy.modal.highlights}
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                {selected.highlights[lang].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0066FF]" />{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-zinc-200/50 pt-4 dark:border-zinc-700/40">
              <a
                href={selected.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#0066FF] px-4 py-2 font-mono text-xs font-semibold text-white transition hover:bg-[#0052CC]"
              >
                {copy.viewRepo}<ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="glass-chip px-4 py-2 font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                {copy.modal.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
