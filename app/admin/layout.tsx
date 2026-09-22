import type { Metadata } from "next";
import { ToasterProvider } from "@/app/admin/components/toaster";

export const metadata: Metadata = {
  title: "Aceley Admin",
  description: "Internal admin console for Aceley.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-slate-50 text-[#1E1B4B] antialiased">
      <ToasterProvider>{children}</ToasterProvider>
    </div>
  );
}
