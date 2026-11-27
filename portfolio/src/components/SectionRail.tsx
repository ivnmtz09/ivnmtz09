import { MouseEvent } from 'react';
import { Lang, NAV_SECTIONS, SectionId, UI_COPY } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';

interface SectionRailProps {
  lang: Lang;
  activeSection: SectionId;
}

function navigate(event: MouseEvent<HTMLAnchorElement>, id: SectionId) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const section = document.getElementById(id);
  if (!section) return;

  event.preventDefault();
  soundEngine.playClick();
  const hash = `#${id}`;
  if (location.hash !== hash) history.pushState(null, '', hash);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  section.focus({ preventScroll: true });
  section.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
}

export function SectionRail({ lang, activeSection }: SectionRailProps) {
  const copy = UI_COPY[lang].nav;
  const activeIndex = NAV_SECTIONS.findIndex(({ id }) => id === activeSection);

  return (
    <nav aria-label={copy.sectionProgress} className="section-rail fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 md:flex">
      <ol className="relative">
        {NAV_SECTIONS.map(({ id, marker }, index) => (
          <li key={id} className="relative">
            <a
              href={`#${id}`}
              aria-label={copy[id]}
              aria-current={index === activeIndex ? 'location' : undefined}
              data-state={index < activeIndex ? 'passed' : index === activeIndex ? 'current' : 'pending'}
              className="section-rail-link relative grid size-9 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0066FF]"
              onClick={(event) => navigate(event, id)}
            >
              <span aria-hidden="true" className="section-rail-dot" />
              <span aria-hidden="true" className="section-rail-label glass-chip">
                <span className="section-rail-marker">{marker}</span>
                <span>{copy[id]}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
      <div aria-hidden="true" className="section-rail-track">
        <div className="section-rail-fill" style={{ transform: `scaleY(${activeIndex / (NAV_SECTIONS.length - 1)})` }} />
      </div>
    </nav>
  );
}
