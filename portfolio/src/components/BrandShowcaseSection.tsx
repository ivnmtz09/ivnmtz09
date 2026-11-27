import { BrandMaximalistMark, GridCellMarkers } from './BrandLogo';
import { ThreeBrandSculpture } from './ThreeBrandSculpture';
import { useScrollReveal } from '../hooks/useScrollEffects';
import { Lang } from '../data/portfolioData';

interface BrandShowcaseSectionProps {
  lang: Lang;
  scrollProgress: number;
}

export function BrandShowcaseSection({ lang, scrollProgress }: BrandShowcaseSectionProps) {
  const { ref, visible } = useScrollReveal();

  const copy =
    lang === 'es'
      ? {
          eyebrow: '// 00. Marca Personal & Isotipo',
          title: 'IM · Iván Martínez',
          subtitle:
            'Identidad maximalista orientada hacia arriba: isotipo geométrico IM, nombre completo, retículas arquitectónicas y escultura 3D en Three.js.',
          figLabel: 'FIG. 01 // IDENTIDAD_IVAN_MARTINEZ.JPG',
          logoLabel: 'FIG. 02 // ISOTIPO_MAXIMALISTA.SVG',
          threeLabel: 'FIG. 03 // ESCULTURA_WEBGL.THREEJS',
        }
      : {
          eyebrow: '// 00. Personal Brand & Isotype',
          title: 'IM · Iván Martínez',
          subtitle:
            'Upward-oriented maximalist identity: geometric IM isotype, full name lockup, architectural grids, and interactive Three.js 3D sculpture.',
          figLabel: 'FIG. 01 // IVAN_MARTINEZ_IDENTITY.JPG',
          logoLabel: 'FIG. 02 // MAXIMALIST_ISOTYPE.SVG',
          threeLabel: 'FIG. 03 // WEBGL_SCULPTURE.THREEJS',
        };

  return (
    <section className="relative border-b border-zinc-200 bg-white py-16 sm:py-20 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Continuous scrolling architectural marquee */}
      <div className="mb-12 overflow-hidden border-y border-zinc-200 bg-zinc-50 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="animate-marquee font-mono text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
          {Array.from({ length: 6 }).map((_, idx) => (
            <span key={idx} className="mx-6 flex items-center gap-6">
              <span className="text-[#0066FF]">▲</span>
              <span>IM · IVAN MARTINEZ</span>
              <span className="text-zinc-400 dark:text-zinc-600">//</span>
              <span>@IVNMTZ09</span>
              <span className="text-zinc-400 dark:text-zinc-600">//</span>
              <span>FULL STACK ARCHITECT</span>
              <span className="text-[#0066FF]">+</span>
              <span>RIOHACHA · COLOMBIA</span>
            </span>
          ))}
        </div>
      </div>

      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-4 transition-all duration-700 sm:px-6 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="mb-10">
          <p className="font-mono text-xs font-semibold tracking-wider text-[#0066FF] uppercase">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            {copy.title}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
            {copy.subtitle}
          </p>
        </div>

        {/* Architectural Swiss Grid Showcase */}
        <div className="grid gap-px border border-zinc-200 bg-zinc-200 lg:grid-cols-12 dark:border-zinc-800 dark:bg-zinc-800">
          {/* Left: Maximalist Vertical/Upward SVG Isotype + Full Name */}
          <div className="bg-dot-matrix relative flex flex-col items-center justify-center bg-white p-6 text-zinc-900 lg:col-span-5 dark:bg-zinc-950 dark:text-white">
            <GridCellMarkers />
            <div className="mb-4 flex w-full items-center justify-between font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              <span>{copy.logoLabel}</span>
              <span className="text-[#0066FF]">IM · VECTOR</span>
            </div>
            <BrandMaximalistMark />
          </div>

          {/* Right Column: Generated Brand Image + Interactive Three.js Sculpture */}
          <div className="grid gap-px bg-zinc-200 lg:col-span-7 dark:bg-zinc-800">
            <div className="relative bg-zinc-950 p-4 sm:p-6">
              <GridCellMarkers />
              <div className="mb-3 flex items-center justify-between font-mono text-[11px] text-zinc-400">
                <span>{copy.figLabel}</span>
                <span className="text-[#0066FF]">BRAND ARTWORK</span>
              </div>
              <div className="overflow-hidden border border-zinc-800 bg-zinc-950">
                <img
                  src="./ivan-martinez-brand.jpg"
                  alt="Ivan Martinez Personal Brand Visual"
                  className="h-auto w-full object-cover transition duration-700 hover:scale-[1.02]"
                />
              </div>
            </div>

            <div className="bg-swiss-grid relative bg-white p-6 dark:bg-zinc-950">
              <GridCellMarkers />
              <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                <span>{copy.threeLabel}</span>
                <span className="text-[#0066FF]">INTERACTIVE 3D</span>
              </div>
              <ThreeBrandSculpture scrollProgress={scrollProgress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
