"use client";

import { AppLayout } from "@/app/components/app-layout";
import { Icon, PrimaryButton, SecondaryButton, cn } from "@/app/components/ui";
import { useAuth } from "@/services/hooks/useAuth";
import type { Profile } from "@/services/dtos/auth";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "A";
}

function displayName(profile: Profile): string {
  if (profile.nickname && profile.nickname.trim()) return profile.nickname;
  const local = profile.email.split("@")[0];
  return local || "Aceley Student";
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ProfileDetails({ profile }: { profile: Profile }) {
  const rows: Array<{ label: string; value: string | null }> = [
    { label: "Email", value: profile.email },
    { label: "Nickname", value: profile.nickname },
    { label: "Role", value: profile.role },
    { label: "School", value: profile.school_name },
    { label: "School country", value: profile.school_country },
    { label: "Major", value: profile.major },
    { label: "Grade", value: profile.grade },
    { label: "Country", value: profile.country },
    { label: "Age", value: profile.age !== null ? String(profile.age) : null },
    {
      label: "Referral source",
      value:
        profile.referral_source === "other" && profile.referral_other_text
          ? `Other · ${profile.referral_other_text}`
          : profile.referral_source,
    },
    { label: "Member since", value: formatDate(profile.created_at) },
    { label: "Onboarded", value: formatDate(profile.onboarded_at) },
  ];

  const visible = rows.filter((row) => row.value);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-lg font-black text-[#1E1B4B]">Profile details</h2>
      <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {visible.map((row) => (
          <div key={row.label}>
            <dt className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
              {row.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[#1E1B4B]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ProfilePageContent() {
  const { profile, user, hasHydrated, signOut } = useAuth();

  if (!hasHydrated) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
      </div>
    );
  }

  if (!profile) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#312E81]/10 text-[#312E81]">
          <Icon name="profile" />
        </span>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-[#1E1B4B]">
          You&rsquo;re not signed in
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Log in to see your Aceley profile.
        </p>
        <PrimaryButton className="mt-6 w-full sm:w-auto" href="/auth">
          Log in
        </PrimaryButton>
      </section>
    );
  }

  const name = displayName(profile);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {profile.avatar_url || user?.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                className="h-20 w-20 rounded-lg object-cover"
                src={profile.avatar_url ?? user?.picture ?? undefined}
              />
            ) : (
              <span className="grid h-20 w-20 place-items-center rounded-lg bg-[#312E81] text-2xl font-black text-white">
                {initials(name)}
              </span>
            )}
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#1E1B4B]">
                {name}
              </h1>
              <p className="mt-0.5 text-sm font-semibold text-[#312E81]">
                {profile.email}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-lg px-3 py-1 text-xs font-black uppercase tracking-[0.12em]",
                    profile.is_premium
                      ? "bg-[#FACC15] text-[#1E1B4B]"
                      : "bg-slate-100 text-slate-600",
                  )}
                >
                  {profile.is_premium ? "Aceley Pro" : "Free plan"}
                </span>
                {user?.provider ? (
                  <span className="inline-flex items-center rounded-lg bg-[#312E81]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#312E81]">
                    {user.provider} sign-in
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <SecondaryButton href="/onboarding/name">Edit profile</SecondaryButton>
        </div>
      </section>

      <ProfileDetails profile={profile} />

      <section className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
        <button
          className="flex min-h-12 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-black text-[#1E1B4B]"
          onClick={() => {
            void signOut();
          }}
          type="button"
        >
          <span className="flex items-center gap-3">
            <Icon name="arrowLeft" className="h-4 w-4" />
            Sign out
          </span>
          <Icon name="chevronRight" className="h-4 w-4 text-slate-300" />
        </button>
        <button
          className="flex min-h-12 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-black text-red-600"
          onClick={() => {
            void signOut({ allDevices: true });
          }}
          type="button"
        >
          <span className="flex items-center gap-3">
            <Icon name="delete" className="h-4 w-4" />
            Sign out of all devices
          </span>
          <Icon name="chevronRight" className="h-4 w-4 text-slate-300" />
        </button>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <AppLayout>
      <ProfilePageContent />
    </AppLayout>
  );
}
