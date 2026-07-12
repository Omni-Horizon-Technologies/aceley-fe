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
