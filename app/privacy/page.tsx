/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/app/components/site-footer";
import { PublicPrimaryCta } from "@/app/components/public-auth-actions";

export const metadata: Metadata = {
  title: "Privacy Policy | Aceley",
  description: "How Aceley collects, uses, and protects your information.",
};

const LAST_UPDATED = "September 22, 2026";

const sections: Array<{ heading: string; body: React.ReactNode }> = [
  {
    heading: "1. Introduction",
    body: (
      <p>
        This Privacy Policy explains what information Aceley collects when you use our website, mobile apps, and
        related services (the &ldquo;Service&rdquo;), how we use it, and the choices you have. By using the Service you
        agree to the practices described here.
      </p>
    ),
  },
  {
    heading: "2. Information we collect",
    body: (
      <>
        <p>We collect the following categories of data:</p>
        <ul className="mt-3 list-disc space-y-1 pl-6">
          <li>
            <b>Account data</b> — email, nickname, and authentication identifiers when you sign in with Google, Apple,
            or email.
          </li>
          <li>
            <b>Profile data</b> — age range, country, study level, and goals you provide during onboarding.
          </li>
          <li>
            <b>Study content</b> — notes, images, and documents you upload for the AI tutor to process.
          </li>
          <li>
            <b>Usage data</b> — quizzes taken, questions answered, streaks, focus sessions, and interactions with
            features. Used to improve your experience and generate progress metrics.
          </li>
          <li>
            <b>Device data</b> — device model, OS version, app version, push tokens, and diagnostic identifiers.
          </li>
          <li>
            <b>Payment data</b> — subscription status and billing metadata. Card details are handled by Stripe, Apple,
            or Google and are never stored on Aceley servers.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "3. How we use your information",
    body: (
      <>
        <p>We use the data we collect to:</p>
        <ul className="mt-3 list-disc space-y-1 pl-6">
          <li>provide, personalize, and improve the Service,</li>
          <li>generate flashcards, quizzes, and study plans from your uploaded content,</li>
          <li>process subscriptions, credits, and billing,</li>
          <li>send push notifications you have opted into (updates, streak reminders, product news),</li>
          <li>detect abuse, secure the platform, and comply with legal obligations,</li>
          <li>measure aggregate usage and improve product quality.</li>
        </ul>
      </>
    ),
  },
  {
    heading: "4. AI processing",
    body: (
      <p>
        When you upload notes or ask the tutor a question, your content is sent to trusted large-language-model
        providers under contracts that prohibit using your data to train their models. We do not sell your content and
        we do not use it to train third-party models.
      </p>
    ),
  },
  {
    heading: "5. Sharing and third parties",
    body: (
      <>
        <p>We share personal data only with service providers that help us operate the Service, including:</p>
        <ul className="mt-3 list-disc space-y-1 pl-6">
          <li>Cloud infrastructure and databases (hosting, storage, logs)</li>
          <li>Stripe, Apple, Google, RevenueCat (payments and subscriptions)</li>
          <li>Expo (push-notification delivery)</li>
          <li>Google, Apple (authentication)</li>
          <li>LLM providers (AI features)</li>
          <li>Analytics and crash-reporting providers (aggregate usage and diagnostics)</li>
        </ul>
        <p className="mt-3">
          We do not sell personal data. We may disclose information if required by law or to protect the rights, safety,
          or property of Aceley and its users.
        </p>
      </>
    ),
  },
  {
    heading: "6. Data retention",
    body: (
      <p>
        We retain account and study data for as long as your account is active. If you delete your account, we delete
        or anonymize your personal data within 30 days, except where retention is required for legal, tax, or fraud
        prevention purposes.
      </p>
    ),
  },
  {
    heading: "7. Your rights",
    body: (
      <>
        <p>Depending on where you live, you may have the right to:</p>
        <ul className="mt-3 list-disc space-y-1 pl-6">
          <li>access, correct, or export your personal data,</li>
          <li>delete your account and associated data,</li>
          <li>withdraw consent for optional processing (e.g., marketing),</li>
          <li>object to certain uses of your data, or lodge a complaint with a data-protection authority.</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, email{" "}
          <a className="font-black text-[#312E81] hover:text-[#CA8A04]" href="mailto:privacy@tryaceley.com">
            privacy@tryaceley.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    heading: "8. Children",
    body: (
      <p>
        Aceley is not intended for children under 13. We do not knowingly collect personal information from children
        under 13. If we learn that we have, we will delete it promptly. Guardians may contact us at{" "}
        <a className="font-black text-[#312E81] hover:text-[#CA8A04]" href="mailto:privacy@tryaceley.com">
          privacy@tryaceley.com
        </a>
        .
      </p>
    ),
  },
  {
    heading: "9. Security",
    body: (
      <p>
        We use industry-standard safeguards — encryption in transit, access controls, and regular security review — to
        protect your data. No system is perfectly secure; if we learn of a breach that affects your data, we will
        notify you as required by law.
      </p>
    ),
  },
  {
    heading: "10. Cookies and analytics",
    body: (
      <p>
        We use first-party cookies and lightweight analytics to keep you signed in, remember preferences, and measure
        aggregate product usage. You can control cookies through your browser and opt out of push notifications and
        marketing email from your account settings.
      </p>
    ),
  },
  {
    heading: "11. International transfers",
    body: (
      <p>
        Aceley operates globally and your data may be processed in countries other than your own. Where required, we
        rely on standard contractual clauses or equivalent safeguards to protect your information.
      </p>
    ),
  },
  {
    heading: "12. Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy as the Service evolves. Material changes will be announced in the app or by
        email. The &ldquo;Last updated&rdquo; date at the top reflects the most recent revision.
      </p>
    ),
  },
  {
    heading: "13. Contact",
    body: (
      <p>
        Questions about this Privacy Policy? Email{" "}
        <a className="font-black text-[#312E81] hover:text-[#CA8A04]" href="mailto:privacy@tryaceley.com">
          privacy@tryaceley.com
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
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
          <h1 className="mt-2 text-4xl font-black tracking-[-0.03em] sm:text-5xl">Privacy Policy</h1>
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
            <Link className="font-black text-[#312E81] hover:text-[#CA8A04]" href="/terms">
              Terms of Service
            </Link>
            .
          </div>
        </article>
      </div>

      <SiteFooter />
    </main>
  );
}
