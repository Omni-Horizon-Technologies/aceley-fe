/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/app/components/site-footer";
import { PublicPrimaryCta } from "@/app/components/public-auth-actions";

export const metadata: Metadata = {
  title: "EULA | Aceley",
  description:
    "The End User License Agreement governing your use of the Aceley apps and software.",
};

const LAST_UPDATED = "October 1, 2026";

const sections: Array<{ heading: string; body: React.ReactNode }> = [
  {
    heading: "1. Acceptance",
    body: (
      <p>
        This End User License Agreement (&ldquo;EULA&rdquo;) is a legal contract
        between you and Aceley. By downloading, installing, or using the Aceley
        mobile or web applications (the &ldquo;Software&rdquo;), you agree to
        these terms. If you do not agree, do not install or use the Software.
      </p>
    ),
  },
  {
    heading: "2. License grant",
    body: (
      <p>
        Subject to your compliance with this EULA and our{" "}
        <Link
          className="font-black text-[#312E81] hover:text-[#CA8A04]"
          href="/terms"
        >
          Terms of Service
        </Link>
        , Aceley grants you a limited, non-exclusive, non-transferable,
        revocable license to install and use the Software on devices you own or
        control, strictly for your personal, non-commercial study use.
      </p>
    ),
  },
  {
    heading: "3. Restrictions",
    body: (
      <>
        <p>You will not, and will not permit any third party to:</p>
        <ul className="mt-3 list-disc space-y-1 pl-6">
          <li>
            copy, modify, translate, or create derivative works of the Software,
          </li>
          <li>
            reverse engineer, decompile, disassemble, or attempt to derive the
            source code, except where expressly permitted by law,
          </li>
          <li>
            rent, lease, sublicense, sell, resell, or otherwise commercially
            exploit the Software,
          </li>
          <li>
            remove, obscure, or alter any proprietary notices contained in the
            Software,
          </li>
          <li>
            use the Software to build a competing product, train a competing
            model, or scrape content at scale,
          </li>
          <li>
            use the Software in a way that violates applicable law, infringes
            another person&rsquo;s rights, or compromises security.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "4. Ownership",
    body: (
      <p>
        The Software is licensed, not sold. Aceley and its licensors retain all
        right, title, and interest in and to the Software, including all
        intellectual property rights. No rights are granted to you other than as
        expressly set forth in this EULA.
      </p>
    ),
  },
  {
    heading: "5. Updates",
    body: (
      <p>
        Aceley may release updates, upgrades, patches, bug fixes, or new
        versions of the Software from time to time. Such updates are part of
        the Software and are governed by this EULA. We may require you to
        install an update to continue using the Software.
      </p>
    ),
  },
  {
    heading: "6. Third-party stores",
    body: (
      <p>
        If you obtained the Software through the Apple App Store or Google Play
        (each a &ldquo;Store&rdquo;), you acknowledge that this EULA is between
        you and Aceley, not the Store, and that the Store is not responsible
        for the Software or its support. Your use of the Software must also
        comply with the applicable Store&rsquo;s terms of service.
      </p>
    ),
  },
  {
    heading: "7. User content",
    body: (
      <p>
        You retain ownership of the notes, images, and documents you upload
        through the Software. You grant Aceley a worldwide, royalty-free
        license to process that content solely to provide the Service to you,
        as described in our{" "}
        <Link
          className="font-black text-[#312E81] hover:text-[#CA8A04]"
          href="/privacy"
        >
          Privacy Policy
        </Link>
        .
      </p>
    ),
  },
  {
    heading: "8. Disclaimer of warranties",
    body: (
      <p>
        The Software is provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; without warranties of any kind, whether express or
        implied, including merchantability, fitness for a particular purpose,
        and non-infringement. Aceley does not warrant that the Software will be
        error-free, uninterrupted, or free of harmful components.
      </p>
    ),
  },
  {
    heading: "9. Limitation of liability",
    body: (
      <p>
        To the maximum extent permitted by law, Aceley will not be liable for
        any indirect, incidental, special, consequential, or punitive damages,
        or any loss of profits, data, or goodwill, arising out of or in
        connection with this EULA or the Software. Aceley&rsquo;s total
        aggregate liability is limited to the greater of the amount you paid
        for the Software in the twelve months preceding the claim or
        US$50.
      </p>
    ),
  },
  {
    heading: "10. Termination",
    body: (
      <p>
        This EULA remains in effect until terminated. It will terminate
        automatically if you fail to comply with any term. Upon termination,
        you must stop using and uninstall the Software. Sections 3, 4, 7, 8, 9,
        and 11 survive termination.
      </p>
    ),
  },
  {
    heading: "11. Governing law",
    body: (
      <p>
        This EULA is governed by the laws of the jurisdiction in which Aceley
        is established, without regard to its conflict-of-law principles. The
        courts located there will have exclusive jurisdiction over any
        dispute, subject to any mandatory consumer-protection law applicable
        in your country of residence.
      </p>
    ),
  },
  {
    heading: "12. Changes",
    body: (
      <p>
        We may update this EULA from time to time. Material changes will be
        announced in the app or by email. Your continued use of the Software
        after the effective date of a revision constitutes acceptance of the
        updated EULA.
      </p>
    ),
  },
  {
    heading: "13. Contact",
    body: (
      <p>
        Questions about this EULA? Email{" "}
        <a
          className="font-black text-[#312E81] hover:text-[#CA8A04]"
          href="mailto:legal@tryaceley.com"
        >
          legal@tryaceley.com
        </a>
        .
      </p>
    ),
  },
];

export default function EulaPage() {
  return (
    <main className="min-h-[100dvh] bg-white text-[#1E1B4B]">
      <div className="relative overflow-hidden px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <nav className="relative z-10 mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 py-2">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/icons/icon-192.png"
              alt=""
              className="h-[38px] w-[38px] rounded-[10px] object-cover"
            />
            <span className="text-[21px] font-black tracking-[-0.02em]">
              Aceley
            </span>
          </Link>
          <PublicPrimaryCta
            tone="light"
            label="Get started"
            loggedInLabel="Open app"
            size="sm"
            variant="dark"
          />
        </nav>

        <article className="mx-auto mt-10 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">
            Legal
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.03em] sm:text-5xl">
            End User License Agreement
          </h1>
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="mt-10 space-y-10 text-[15px] leading-[1.7] text-slate-700">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-xl font-black tracking-tight text-[#1E1B4B]">
                  {s.heading}
                </h2>
                <div className="mt-3 space-y-3">{s.body}</div>
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 text-sm font-semibold text-slate-600">
            See also our{" "}
            <Link
              className="font-black text-[#312E81] hover:text-[#CA8A04]"
              href="/privacy"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              className="font-black text-[#312E81] hover:text-[#CA8A04]"
              href="/terms"
            >
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
