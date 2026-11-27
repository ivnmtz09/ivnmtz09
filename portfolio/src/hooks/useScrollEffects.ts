import { useEffect, useRef, useState } from 'react';
import { NAV_SECTIONS, SectionId } from '../data/portfolioData';

/** Updates the progress bar and corner transforms in the same passive scroll frame. */
export function useScrollCssVars() {
  const [activeSection, setActiveSection] = useState<SectionId>('top');
  const progressRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progressBar = progressRef.current;
    const corners = cornersRef.current;
    if (!progressBar) return;

    const sections = NAV_SECTIONS.map(({ id }) => ({ id, element: document.getElementById(id) }));
    let active: SectionId = 'top';
    let sectionStarts: { id: SectionId; top: number }[] = [];
    let activationOffset = 0;
    let rafId = 0;
    let scrollRange = 0;

    const update = () => {
      const scrollY = Math.max(0, window.scrollY);
      const ratio = scrollRange > 0 ? Math.min(1, scrollY / scrollRange) : 0;
      progressBar.style.setProperty('--scroll-progress', ratio.toFixed(4));
      corners?.style.setProperty('--scroll-y', String(scrollY));
      const readingLine = scrollY + activationOffset;
      let nextSection: SectionId = 'top';
      if (scrollY > 0) {
        for (const section of sectionStarts) {
          if (readingLine < section.top) break;
          nextSection = section.id;
        }
        if (scrollRange > 0 && scrollRange - scrollY <= 2) {
          nextSection = sectionStarts.at(-1)?.id ?? nextSection;
        }
      }
      if (nextSection !== active) {
        active = nextSection;
        setActiveSection(active);
      }
      rafId = 0;
    };

    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(update);
    };

    const measure = () => {
      const { scrollY, innerHeight } = window;
      scrollRange = document.documentElement.scrollHeight - innerHeight;
      activationOffset = Math.min(160, innerHeight * 0.22);
      sectionStarts = sections.flatMap(({ id, element }) =>
        element ? [{ id, top: element.getBoundingClientRect().top + scrollY }] : [],
      );
      onScroll();
    };

    const layoutObserver = new ResizeObserver(measure);
    layoutObserver.observe(document.body);
    for (const { element } of sections) {
      if (element) layoutObserver.observe(element);
    }
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });

    return () => {
      layoutObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return { progressRef, cornersRef, activeSection };
}

/**
 * Triggers reveal animation once when an element enters the viewport.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.08) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: '0px 0px -24px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
