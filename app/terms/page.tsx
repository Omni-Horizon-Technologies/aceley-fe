/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/app/components/site-footer";
import { PublicPrimaryCta } from "@/app/components/public-auth-actions";

export const metadata: Metadata = {
  title: "Terms of Service | Aceley",
  description: "The terms that govern your use of Aceley.",
};

const LAST_UPDATED = "September 22, 2026";

const sections: Array<{ heading: string; body: React.ReactNode }> = [
  {
    heading: "1. Acceptance of terms",
    body: (
      <p>
        By creating an account, downloading the app, or using any part of the Aceley service (the &ldquo;Service&rdquo;),
        you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
      </p>
    ),
  },
  {
    heading: "2. Eligibility",
    body: (
      <p>
        You must be at least 13 years old to use Aceley. If you are under the age of majority in your jurisdiction, you
        represent that your parent or legal guardian has reviewed and agreed to these Terms on your behalf.
      </p>
    ),
  },
  {
    heading: "3. Your account",
    body: (
      <p>
        You are responsible for maintaining the confidentiality of your login credentials and for all activity that
        occurs under your account. Notify us immediately at{" "}
        <a className="font-black text-[#312E81] hover:text-[#CA8A04]" href="mailto:support@tryaceley.com">
          support@tryaceley.com
        </a>{" "}
        if you suspect unauthorized use.
      </p>
    ),
  },
  {
    heading: "4. Subscriptions, billing, and refunds",
    body: (
      <p>
        Paid plans renew automatically at the interval selected at checkout until you cancel. You can cancel at any time
        from your account settings; access continues through the end of the current billing period. Except where
        required by law, payments are non-refundable. Billing is processed by Stripe (web) and Apple / Google (mobile),
        whose terms also apply.
      </p>
    ),
  },
  {
    heading: "5. Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul className="mt-3 list-disc space-y-1 pl-6">
          <li>upload content that infringes intellectual property or privacy rights,</li>
          <li>use the Service to cheat on exams or violate any academic-integrity policy,</li>
          <li>attempt to reverse-engineer, scrape, or resell the Service,</li>
          <li>abuse rate limits or attempt to bypass usage caps,</li>
          <li>upload malware or attempt to disrupt the Service or other users.</li>
        </ul>
      </>
    ),
  },
  {
    heading: "6. Your content and AI outputs",
    body: (
      <p>
        You retain ownership of the notes, images, and materials you upload (&ldquo;Your Content&rdquo;). You grant
        Aceley a limited licence to process Your Content solely to provide the Service to you — for example, generating
        flashcards, quizzes, and study plans. AI-generated outputs are provided for study support and may contain
        errors; you are responsible for verifying them before relying on them for coursework or exams.
      </p>
    ),
  },
  {
    heading: "7. Intellectual property",
    body: (
      <p>
        The Aceley name, logo, application, and all associated software are owned by Aceley and its licensors and are
        protected by copyright and trademark law. Nothing in these Terms transfers ownership to you.
      </p>
    ),
  },
  {
    heading: "8. Third-party services",
    body: (
      <p>
        The Service integrates with third parties including Apple, Google, Stripe, RevenueCat, and Expo. Your use of
        those integrations is subject to their respective terms. We are not responsible for the availability or content
        of third-party services.
      </p>
    ),
  },
  {
    heading: "9. Termination",
    body: (
      <p>
        You may delete your account at any time. We may suspend or terminate access if you violate these Terms or if we
        are required to do so by law. Sections that by their nature should survive termination will do so, including
        ownership, disclaimers, and limitation of liability.
      </p>
    ),
  },
  {
    heading: "10. Disclaimers",
    body: (
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; To the fullest extent permitted by
        law, Aceley disclaims all warranties, express or implied, including merchantability, fitness for a particular
        purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or that
        AI-generated outputs will be accurate.
      </p>
    ),
  },
  {
    heading: "11. Limitation of liability",
    body: (
      <p>
        To the fullest extent permitted by law, Aceley&apos;s total liability for any claim arising out of or relating
        to the Service is limited to the greater of the amount you paid to Aceley in the twelve months preceding the
        claim, or USD $100. Aceley is not liable for indirect, incidental, or consequential damages.
      </p>
    ),
  },
  {
    heading: "12. Changes to these terms",
    body: (
      <p>
        We may update these Terms from time to time. Material changes will be announced in the app or by email. Your
        continued use of the Service after the changes take effect constitutes acceptance of the updated Terms.
      </p>
    ),
  },
  {
    heading: "13. Governing law",
    body: (
      <p>
        These Terms are governed by the laws of the jurisdiction in which Aceley is incorporated, without regard to
        conflict-of-laws principles. Disputes will be resolved in the courts of that jurisdiction unless a mandatory
        consumer-protection law provides otherwise.
      </p>
    ),
  },
  {
    heading: "14. Contact",
    body: (
      <p>
        Questions about these Terms? Email{" "}
        <a className="font-black text-[#312E81] hover:text-[#CA8A04]" href="mailto:legal@tryaceley.com">
          legal@tryaceley.com
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-[100dvh] bg-white text-[#1E1B4B]">
      <div className="relative overflow-hidden px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <nav className="relative z-10 mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 py-2">
          <Link href="/" className="flex items-center gap-3">
            <img src="/icons/icon-192.png" alt="" className="h-[38px] w-[38px] rounded-[10px] object-cover" />
            <span className="text-[21px] font-black tracking-[-0.02em]">Aceley</span>
          </Link>
          <PublicPrimaryCta tone="light" label="Get started" loggedInLabel="Open app" size="sm" variant="dark" />
        </nav>

        <article className="mx-auto mt-10 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">Legal</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.03em] sm:text-5xl">Terms of Service</h1>
          <p className="mt-3 text-sm font-semibold text-slate-500">Last updated: {LAST_UPDATED}</p>

          <div className="mt-10 space-y-10 text-[15px] leading-[1.7] text-slate-700">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-xl font-black tracking-tight text-[#1E1B4B]">{s.heading}</h2>
                <div className="mt-3 space-y-3">{s.body}</div>
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 text-sm font-semibold text-slate-600">
            See also our{" "}
            <Link className="font-black text-[#312E81] hover:text-[#CA8A04]" href="/privacy">
              Privacy Policy
            </Link>
            .
          </div>
        </article>
      </div>

      <SiteFooter />
    </main>
  );
}
