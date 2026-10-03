import Link from "next/link";
import { BrandMark, Icon } from "@/app/components/ui";

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

const sectionsLinks: FooterLink[] = [
  { href: "/#tools", label: "How it works" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#faq", label: "FAQ" },
  { href: "/download", label: "Download" },
];

const socialsLinks: FooterLink[] = [
  { href: "https://instagram.com/", label: "Instagram", external: true },
  { href: "https://discord.com/", label: "Discord", external: true },
  { href: "https://tiktok.com/", label: "TikTok", external: true },
  { href: "/articles", label: "Articles" },
];

const legalLinks: FooterLink[] = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
];

const footerGroups: Array<{ title: string; links: FooterLink[] }> = [
  { title: "Sections", links: sectionsLinks },
  { title: "Our socials", links: socialsLinks },
  { title: "Legal", links: legalLinks },
];

const footerTrust = [
  "No hidden fees",
  "Cancel anytime",
  "Student-friendly pricing",
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className =
    "text-sm font-semibold text-slate-600 transition hover:text-[#CA8A04]";

  if (link.external) {
    return (
      <a
        className={className}
        href={link.href}
        rel="noreferrer noopener"
        target="_blank"
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link className={className} href={link.href}>
      {link.label}
    </Link>
  );
}

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
                      <FooterLinkItem link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
