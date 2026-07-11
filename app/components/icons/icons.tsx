import type { SVGProps } from "react";

/**
 * Official Google G brand mark — 4-colour, per Google's branding guidelines.
 * Use for sign-in / auth buttons.
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
      <path d="M17.05 12.03c-.03-2.94 2.4-4.35 2.51-4.42-1.37-2-3.5-2.27-4.26-2.3-1.82-.18-3.55 1.07-4.47 1.07-.94 0-2.35-1.04-3.87-1.02-1.99.03-3.83 1.16-4.86 2.94-2.07 3.6-.53 8.93 1.5 11.85 1 1.43 2.19 3.04 3.75 2.98 1.51-.06 2.08-.98 3.9-.98 1.83 0 2.34.98 3.95.95 1.63-.03 2.66-1.45 3.65-2.89 1.15-1.66 1.62-3.27 1.64-3.35-.04-.02-3.15-1.21-3.18-4.83zM14.5 3.57c.85-1.02 1.42-2.44 1.26-3.85-1.22.05-2.68.81-3.55 1.83-.79.9-1.47 2.34-1.29 3.72 1.35.11 2.73-.68 3.58-1.7z" />
    </svg>
  );
}
