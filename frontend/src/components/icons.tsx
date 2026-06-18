import type { SVGProps } from "react";

/** Monoline icon set — 1.6px stroke, 24px grid. No emoji anywhere. */
const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

export const Fingerprint = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 10a2 2 0 0 0-2 2c0 1.5 0 4-.5 5.5" />
    <path d="M12 6a6 6 0 0 0-6 6c0 .8 0 2.2-.4 3.4" />
    <path d="M16 6.7A6 6 0 0 1 18 12c0 2 0 4-.5 5.7" />
    <path d="M12 14c0 2-.3 3.7-.8 5.2" />
    <path d="M14 12a2 2 0 0 0-2-2" />
    <path d="M8.5 19.3c.4-1.2.5-2.5.5-3.8" />
  </svg>
);

export const Lock = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    <circle cx="12" cy="15" r="1.2" />
  </svg>
);

export const Coins = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <ellipse cx="9" cy="7" rx="5.5" ry="2.6" />
    <path d="M3.5 7v4c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6V7" />
    <path d="M9 13.6V18c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-7" />
    <ellipse cx="14.5" cy="11" rx="5.5" ry="2.6" />
  </svg>
);

export const Check = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 12.5l4.2 4.2L19 7" />
  </svg>
);

export const X = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ShieldCheck = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const Cpu = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <rect x="10" y="10" width="4" height="4" rx="0.6" />
    <path d="M10 4v2M14 4v2M10 18v2M14 18v2M4 10h2M4 14h2M18 10h2M18 14h2" />
  </svg>
);

export const ScanLine = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
    <path d="M4 12h16" />
  </svg>
);

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ExternalLink = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M14 5h5v5M19 5l-8 8M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </svg>
);

export const Github = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M9 19c-4 1.3-4-2-5.5-2.5M15 21v-3.3c0-.9.2-1.6-.4-2.2 2.6-.3 5.4-1.3 5.4-5.8a4.5 4.5 0 0 0-1.3-3.1 4.2 4.2 0 0 0-.1-3.1s-1-.3-3.4 1.2a11.6 11.6 0 0 0-6 0C6.3 2.9 5.3 3.2 5.3 3.2a4.2 4.2 0 0 0-.1 3.1A4.5 4.5 0 0 0 3.9 9.4c0 4.5 2.8 5.5 5.4 5.8-.4.4-.5 1-.5 1.7V21" />
  </svg>
);

export const Key = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="7.5" cy="15.5" r="3.5" />
    <path d="M10 13l8.5-8.5M16 6l2 2M14 8l2 2" />
  </svg>
);

export const Stamp = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3a3 3 0 0 0-3 3c0 1.2.6 2 .6 3.2 0 1-.6 1.8-2 1.8H5v3h14v-3h-2.6c-1.4 0-2-.8-2-1.8 0-1.2.6-2 .6-3.2a3 3 0 0 0-3-3Z" />
    <path d="M4 19h16" />
  </svg>
);
