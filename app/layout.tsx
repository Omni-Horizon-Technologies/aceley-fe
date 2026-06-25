import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aceley | Become exam-ready",
  description:
    "Aceley helps students get exam-ready with tutoring, plans, focus sessions, and study packs.",
  icons: {
    icon: "/images%20/aceley_icons/web/favicon.ico",
    apple: "/images%20/aceley_icons/web/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
