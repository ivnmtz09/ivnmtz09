import { Ref } from 'react';

function radialPoint(angle: number, radius: number) {
  const radians = angle * Math.PI / 180;
  return `${(130 + Math.cos(radians) * radius).toFixed(2)},${(130 + Math.sin(radians) * radius).toFixed(2)}`;
}

const calibration = Array.from({ length: 36 }, (_, index) => {
  const angle = index * 10;
  const inner = index % 9 === 0 ? 110 : index % 3 === 0 ? 116 : 120;
  return `M${radialPoint(angle, inner)} ${radialPoint(angle, 123)}`;
}).join(' ');

function Corner({ bottom = false }: { bottom?: boolean }) {
  return (
    <div className={`scroll-corner absolute ${bottom ? 'scroll-corner-bottom -bottom-28 -left-28 size-56 sm:size-88' : 'scroll-corner-top -top-24 -right-24 size-52 sm:size-80'}`}>
      <svg className="scroll-corner-layer scroll-corner-outer" viewBox="0 0 260 260" fill="none">
        <g transform={bottom ? 'rotate(78 130 130)' : undefined} stroke="currentColor">
          <path d={calibration} strokeWidth="0.8" />
          <circle cx="130" cy="130" r="106" pathLength="360" strokeWidth="0.8" strokeDasharray="96 10 47 48 112 47" />
          <circle cx="130" cy="130" r="112" pathLength="360" strokeWidth="2.5" strokeDasharray="28 22 13 103 41 153" />
          <path d="M130 25l-3 5h6ZM24 130h9m188 0h13M130 227v10" strokeWidth="1.5" />
        </g>
      </svg>
      <svg className="scroll-corner-layer scroll-corner-middle" viewBox="0 0 260 260" fill="none">
        <g transform={bottom ? 'rotate(147 130 130)' : undefined} stroke="currentColor">
          <circle cx="130" cy="130" r="85" pathLength="360" strokeWidth="0.8" strokeDasharray="1 4" />
          <circle cx="130" cy="130" r="79" pathLength="360" strokeWidth="1.5" strokeDasharray="41 9 27 39 94 68 31 51" />
          <circle cx="130" cy="130" r="92" pathLength="360" stroke="#0066FF" strokeWidth="2.5" strokeDasharray="16 344" />
          <path d="M62 78l13 7m84 119 7 11m37-88h13" strokeWidth="0.8" />
        </g>
      </svg>
      <svg className="scroll-corner-layer scroll-corner-inner" viewBox="0 0 260 260" fill="none">
        <g transform={bottom ? 'rotate(112 130 130)' : undefined} stroke="currentColor">
          <circle cx="130" cy="130" r="55" pathLength="360" strokeWidth="0.8" strokeDasharray="67 13 34 66" />
          <path d="M122 111h-11v11m27-11h11v11m0 16v11h-11m-16 0h-11v-11m13-8h12m-6-6v12" strokeWidth="1.5" />
          <path d="m87 164 16-10h15m47-51h16l13-14M80 105h12" strokeWidth="0.8" />
          <g className="scroll-corner-nodes" fill="#0066FF" stroke="none">
            <circle cx="87" cy="164" r="3.5" />
            <circle cx="194" cy="89" r="2.5" />
            <circle cx="80" cy="105" r="2.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function ScrollCorners({ scrollRef }: { scrollRef: Ref<HTMLDivElement> }) {
  return (
    <div ref={scrollRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <Corner />
      <Corner bottom />
    </div>
  );
}
