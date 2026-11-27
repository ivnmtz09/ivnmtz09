interface BrandLogoProps {
  size?: number;
  framed?: boolean;
  className?: string;
}

/**
 * Compact geometric SVG monogram isotype (IM) for Navbar, Footer, and Favicon.
 * Strictly uses monochromatic grays + electric blue (#0066FF).
 */
export function BrandLogo({ size = 36, framed = true, className = '' }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={framed ? '0 0 64 64' : '8 6 48 48'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ivan Martinez Brand Monogram"
    >
      {framed && (
        <g>
          <polygon
            points="12,4 52,4 60,12 60,52 52,60 12,60 4,52 4,12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.35"
            fill="none"
          />
          <line x1="32" y1="4" x2="32" y2="60" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="2 3" />
          <line x1="4" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="2 3" />
        </g>
      )}

      <rect x="16" y="18" width="5" height="28" fill="currentColor" />
      <rect x="14" y="18" width="9" height="3" fill="#0066FF" />
      <rect x="14" y="43" width="9" height="3" fill="currentColor" />

      <path
        d="M27 46V18H32L39 31L46 18H50V46H45V27L39 38L32 27V46H27Z"
        fill="currentColor"
      />

      <circle cx="52" cy="12" r="3" fill="#0066FF" />
      {framed && <circle cx="52" cy="12" r="5.5" stroke="#0066FF" strokeWidth="1" strokeOpacity="0.45" />}
    </svg>
  );
}

/**
 * Maximalist vertical/upward SVG brand lockup with IM isotype and full name "IVAN MARTINEZ".
 */
export function BrandMaximalistMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[340px] ${className}`}
      aria-label="IM - Ivan Martinez Maximalist Brand"
    >
      <rect x="8" y="8" width="344" height="424" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
      <line x1="8" y1="88" x2="352" y2="88" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="3 4" />
      <line x1="8" y1="320" x2="352" y2="320" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="3 4" />
      <line x1="180" y1="8" x2="180" y2="432" stroke="currentColor" strokeOpacity="0.12" strokeDasharray="2 4" />

      <path d="M180 26L224 62H196L180 48L164 62H136L180 26Z" fill="#0066FF" />
      <path d="M180 50L248 106H230L180 64L130 106H112L180 50Z" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" />

      <circle cx="180" cy="200" r="102" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="180" cy="200" r="84" stroke="#0066FF" strokeOpacity="0.55" strokeWidth="1.2" />
      <polygon
        points="180,82 282,141 282,259 180,318 78,259 78,141"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />

      <rect x="116" y="152" width="16" height="96" fill="currentColor" />
      <rect x="108" y="152" width="32" height="10" fill="#0066FF" />
      <rect x="108" y="238" width="32" height="10" fill="currentColor" />

      <path
        d="M154 248V152H172L198 202L224 152H242V248H224V185L198 232L172 185V248H154Z"
        fill="currentColor"
      />

      <circle cx="180" cy="82" r="4.5" fill="#0066FF" />
      <circle cx="282" cy="141" r="3.5" fill="currentColor" />
      <circle cx="282" cy="259" r="4.5" fill="#0066FF" />
      <circle cx="78" cy="141" r="3.5" fill="currentColor" />
      <circle cx="78" cy="259" r="3.5" fill="currentColor" />

      <text
        x="180"
        y="362"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="var(--font-mono)"
        fontSize="26"
        fontWeight="800"
        letterSpacing="4"
      >
        IVAN MARTINEZ
      </text>
      <rect x="86" y="376" width="188" height="2" fill="#0066FF" />
      <text
        x="180"
        y="402"
        textAnchor="middle"
        fill="#71717A"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="11"
        fontWeight="600"
        letterSpacing="3"
      >
        @IVNMTZ09 // SYSTEMS &amp; CODE
      </text>
    </svg>
  );
}
