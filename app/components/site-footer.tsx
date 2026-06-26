import Link from "next/link";
import { PublicAuthFooterLinks } from "@/app/components/public-auth-actions";
import { BrandMark, Icon } from "@/app/components/ui";

const footerGroups = [
  {
    title: "Product",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/create", label: "Create Deck" },
      { href: "/study", label: "Study Demo" },
    ],
  },
  {
    title: "Plans",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/paywall", label: "Aceley Pro" },
    ],
  },
];

const footerTrust = [
  "No hidden fees",
  "Cancel anytime",
  "Student-friendly pricing",
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
              Turn your notes into flashcards and start learning faster with a
              simple study workspace built for students.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {footerTrust.map((item) => (
                <span
                  className="inline-flex items-center gap-2 rounded-lg bg-[#F8FAFC] px-3 py-2 text-xs font-bold text-[#1E1B4B]"
                  key={item}
                >
                  <Icon name="check" className="h-3.5 w-3.5 text-[#312E81]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid gap-8 sm:grid-cols-3"
          >
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-black text-[#1E1B4B]">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.label}`}>
                      <Link
                        className="text-sm font-semibold text-slate-600 transition hover:text-[#CA8A04]"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="text-sm font-black text-[#1E1B4B]">Account</h2>
              <ul className="mt-4 space-y-3">
                <PublicAuthFooterLinks linkClassName="text-sm font-semibold text-slate-600 transition hover:text-[#CA8A04]" />
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Aceley. All rights reserved.</p>
          <p>Simple flashcard learning for serious students.</p>
        </div>
      </div>
    </footer>
  );
}
