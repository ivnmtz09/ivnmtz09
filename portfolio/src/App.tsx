import { Suspense, lazy, useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ScrollGeometricShapes } from './components/BrandLogo';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { InteractiveTerminalSection } from './components/InteractiveTerminalSection';
import { Navbar } from './components/Navbar';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { TrajectorySection } from './components/TrajectorySection';
import { Lang } from './data/portfolioData';
import { useScrollCssVars } from './hooks/useScrollEffects';
import { soundEngine } from './utils/soundEngine';

const ThreeScrollStage = lazy(() => import('./components/ThreeScrollStage'));

export function App() {
  const [lang, setLang] = useState<Lang>('es');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundOn, setSoundOn] = useState(true);
  useScrollCssVars();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const handleToggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev;
      soundEngine.setEnabled(next);
      if (next) soundEngine.playClick();
      return next;
    });
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 text-zinc-900 transition-colors dark:bg-[#09090B] dark:text-zinc-100">
      <Suspense fallback={null}>
        <ThreeScrollStage />
      </Suspense>
      <ScrollGeometricShapes />
      <Navbar
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'es' ? 'en' : 'es'))}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
      />
      <main className="relative z-10">
        <Hero lang={lang} />
        <InteractiveTerminalSection lang={lang} />
        <AboutSection lang={lang} />
        <ProjectsSection lang={lang} />
        <SkillsSection lang={lang} />
        <TrajectorySection lang={lang} />
        <ContactSection lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}

export default App;
