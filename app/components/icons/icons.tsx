import { useId, type SVGProps } from "react";

/**
 * Official Google G brand mark — 4-colour paths, per Google's identity kit.
 * Transparent background — use inside a white button/tile.
 */
export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/**
 * Apple mark — solid (currentColor). Pairs with a dark button.
 * Path from Simple Icons.
 */
export function AppleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

/**
 * Instagram — official Instagram brand mark path (Simple Icons) rendered
 * in white on the signature purple → pink → orange gradient.
 * Self-contained: renders with its own background.
 */
export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  const gradientId = useId();
  return (
    <svg
      aria-hidden="true"
      height="44"
      viewBox="0 0 44 44"
      width="44"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <radialGradient
          cx="30%"
          cy="107%"
          fx="30%"
          fy="107%"
          id={gradientId}
          r="150%"
        >
          <stop offset="0%" stopColor="#FDF497" />
          <stop offset="5%" stopColor="#FDF497" />
          <stop offset="45%" stopColor="#FD5949" />
          <stop offset="60%" stopColor="#D6249F" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect fill={`url(#${gradientId})`} height="44" rx="12" width="44" />
      <g transform="translate(10 10)">
        <path
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
          fill="#fff"
        />
      </g>
    </svg>
  );
}

/**
 * TikTok — the official TikTok "musical note" glyph (Simple Icons) rendered
 * in white on the flagship black tile with the signature cyan + magenta
 * offset flourish behind it.
 * Self-contained.
 */
export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  const pathD =
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";
  return (
    <svg
      aria-hidden="true"
      height="44"
      viewBox="0 0 44 44"
      width="44"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="#000" height="44" rx="12" width="44" />
      <g transform="translate(10 10)">
        <path d={pathD} fill="#25F4EE" transform="translate(-1.2 1.2)" />
        <path d={pathD} fill="#FE2C55" transform="translate(1.2 -1.2)" />
        <path d={pathD} fill="#fff" />
      </g>
    </svg>
  );
}

/**
 * YouTube — the official "chip" mark: red rounded rectangle with the white
 * play triangle. Path from Simple Icons.
 * Self-contained (its own background).
 */
export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      height="44"
      viewBox="0 0 44 44"
      width="44"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="#fff" height="44" rx="12" width="44" />
      <g transform="translate(4 10)">
        <path
          d="M35.246 3.848a4.526 4.526 0 0 0-3.184-3.204C29.256 0 18 0 18 0S6.744 0 3.938.644A4.526 4.526 0 0 0 .754 3.848C.113 6.671.113 12 .113 12s0 5.329.641 8.152a4.526 4.526 0 0 0 3.184 3.204C6.744 24 18 24 18 24s11.256 0 14.062-.644a4.526 4.526 0 0 0 3.184-3.204c.641-2.823.641-8.152.641-8.152s0-5.329-.641-8.152zM14.318 17.354V6.646L23.727 12l-9.409 5.354z"
          fill="#FF0000"
        />
      </g>
    </svg>
  );
}

/**
 * Google — the same 4-colour G on a white rounded tile with a hairline
 * border, so it can sit alongside the other social icons without a wrapper.
 */
export function GoogleBrandTile(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      height="44"
      viewBox="0 0 44 44"
      width="44"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="#fff" height="42" rx="12" stroke="#E2E8F0" strokeWidth="1" width="42" x="1" y="1" />
      <g transform="translate(10 10)">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </g>
    </svg>
  );
}

/**
 * Apple — self-contained variant: white Apple on the black rounded tile
 * for the social/source list.
 */
export function AppleBrandTile(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      height="44"
      viewBox="0 0 44 44"
      width="44"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="#000" height="44" rx="12" width="44" />
      <g transform="translate(10 10)">
        <path
          d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
          fill="#fff"
        />
      </g>
    </svg>
  );
}

/**
 * "Friend or family" — soft indigo tile with the classic two-heads icon.
 */
export function FriendIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      height="44"
      viewBox="0 0 44 44"
      width="44"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="#4F46E5" height="44" rx="12" width="44" />
      <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
        <circle cx="17" cy="19" fill="#fff" r="3.4" />
        <path d="M11 32c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <circle cx="28" cy="17" fill="#fff" r="2.8" />
        <path d="M22 29c0-3 2.4-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
      </g>
    </svg>
  );
}

/**
 * "Other" — amber tile with a stroked edit / pencil glyph (Lucide-derived).
 */
export function OtherSourceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      height="44"
      viewBox="0 0 44 44"
      width="44"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="#F59E0B" height="44" rx="12" width="44" />
      <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4">
        <path d="M15 29l1.5-4.5L28.5 12.5a1.5 1.5 0 0 1 2.1 0l1 1a1.5 1.5 0 0 1 0 2.1L19.5 27.5 15 29z" />
        <path d="M25.5 15.5l3 3" />
      </g>
    </svg>
  );
}

/**
 * Aceley "A+" mark — coral hand-drawn glyph. Uses currentColor so callers
 * can tint it via `text-*` classes.
 */
export function AceleyAPlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      height="64"
      viewBox="0 0 1000 1000"
      width="64"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M963.93 319c-46.4-140.91-144.8-204.06-311.39-194.56a33.9 33.9 0 0 1-16.24-2.89c-61.2-28.36-175.13-40.75-289.95 20C86.94 278.83 3.39 525.61 26.91 657 41 735.67 79.55 795.58 141.51 835.06c53.67 34.21 123.89 51.46 205.59 51.46 59.65 0 125.42-9.2 195.33-27.71 159.7-42.27 311.58-159.39 387-298.36 46.38-85.61 58.33-169.1 34.5-241.45m-49.58 233.29c-73.24 135-220.94 248.86-376.29 290-161 42.63-298.56 35-387.36-21.64C92.94 783.83 57 727.76 43.74 654 6.59 446.51 207.12 234.58 354.34 156.68A350.14 350.14 0 0 1 518 116c34 0 64.5 5 88.93 12.64q-63.93 7.93-139.84 28.1c-19.64 5.2-41.84 13.75-66 25.41a8.55 8.55 0 1 0 7.44 15.4c23.15-11.19 44.32-19.36 62.9-24.28C529 158 580.76 148 627.16 143.21a34.88 34.88 0 0 1 24.75 6.87c5.35 4.1 9.35 8.31 11.79 12.44a8.56 8.56 0 0 0 14.73-8.71 56.4 56.4 0 0 0-11.73-13.42c150.62-5.6 238.1 53.69 281 184 22.3 67.72 10.77 146.55-33.35 227.9"
      />
      <path
        fill="currentColor"
        d="M496 646.06c-3 1.33-9.18 2.9-17.59-1.63-10.51-5.67-29.5-23.91-38.74-82.45-7.85-49.7-7.44-128.06-7.12-191 .15-28.86.28-53.79-.43-70.88-.66-15.85-10.26-18.33-13.18-18.72-17.49-2.14-30.69 27.91-38.74 53.64-20.82 66.68-48.08 163.22-70.41 244.13a22.7 22.7 0 0 1-10.45 13.5 450.3 450.3 0 0 0-68.75 50.22c-2 1.78-3.43 3.08-4.29 3.74a8.55 8.55 0 0 0 4.15 16 8.7 8.7 0 0 0 2.7-.44c2.27-.76 3.64-2 8.78-6.53a438 438 0 0 1 56.07-42.1 1.3 1.3 0 0 1 1.91 1.47c-17.86 65.21-30.68 113.33-31 114.44a8.55 8.55 0 0 0 6.09 10.46 8.4 8.4 0 0 0 2.21.29 8.57 8.57 0 0 0 8.26-6.35c.31-1.2 15.17-57 35.2-129.85a10.8 10.8 0 0 1 5.33-6.68A380.3 380.3 0 0 1 422.35 562c.13.88.25 1.82.39 2.69 9.86 62.51 31.28 86.08 47.52 94.83 10.86 5.86 22.82 6.65 32.74 2.15a8.54 8.54 0 1 0-7-15.57zm-167.89-69.15c21.93-79.33 48.2-172.18 68.38-236.81 7.41-23.71 14.45-35 18.5-39.46v.15c.7 16.69.57 41.43.42 70.08-.29 55.88-.63 123.75 4.76 174a396 396 0 0 0-92.06 32.04m352.3-201.03c-15.42 7.05-36.62 18.39-58.79 30.83-1.5-32.42-2.64-59.55-2.66-60.18a8.69 8.69 0 0 0-8.9-8.19 8.55 8.55 0 0 0-8.19 8.9c.12 2.77 1.42 33.88 3.07 68.92-45.46 26-89.91 53.35-92.63 55.16a8.55 8.55 0 0 0 9.49 14.23c2.5-1.66 40.26-24.85 81.33-48.61a1.93 1.93 0 0 1 2.89 1.58c1.75 35.39 3.67 69.62 4.94 78.76 2.82 20.3 6.16 31.46 15.76 32.24a9 9 0 0 0 .87 0c5.53 0 10.17-4.38 12.49-11.9a8.55 8.55 0 0 0-10.14-10.83c-.62-2.85-1.32-6.71-2-11.9-1.33-9.58-3.5-50.17-5.37-89.1 24.45-13.86 48.32-26.77 65-34.39a8.55 8.55 0 0 0-7.11-15.56z"
      />
    </svg>
  );
}
