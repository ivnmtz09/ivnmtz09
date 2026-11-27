import { useEffect, useRef, useState } from 'react';

/**
 * Syncs scroll progress and scrollY directly to CSS custom properties
 * (`--scroll-progress`, `--scroll-y`) inside a single passive rAF loop
 * without triggering React re-renders on scroll.
 */
export function useScrollCssVars() {
  useEffect(() => {
    let rafId = 0;
    const rootStyle = document.documentElement.style;

    const update = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? Math.min(1, Math.max(0, currentY / docHeight)) : 0;
      rootStyle.setProperty('--scroll-y', `${currentY}`);
      rootStyle.setProperty('--scroll-progress', `${ratio.toFixed(4)}`);
      rafId = 0;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);
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
