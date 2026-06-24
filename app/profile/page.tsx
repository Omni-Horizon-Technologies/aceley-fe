import { AppLayout } from "@/app/components/app-layout";
import {
  Icon,
  PageHeader,
  SecondaryButton,
  StudySummaryCard,
} from "@/app/components/ui";
import { profileStats } from "@/app/lib/data";

export default function ProfilePage() {
  return (
    <AppLayout active="profile">
      <div className="space-y-8">
        <PageHeader
          description="A simple place for study stats and account preferences."
          eyebrow="Profile"
          title="Maya Johnson"
        />

        <section className="grid gap-4 md:grid-cols-3">
          {profileStats.map((stat) => (
            <StudySummaryCard
              key={stat.label}
              label={stat.label}
              tone={stat.tone as "indigo" | "coral" | "ink"}
              value={stat.value}
            />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid h-20 w-20 place-items-center rounded-lg bg-[#312E81] text-2xl font-black text-white">
              MJ
            </div>
            <h2 className="mt-5 text-2xl font-black tracking-tight text-[#1E1B4B]">
              Student profile
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Year 12 student focused on biology, chemistry, and history.
            </p>
            <SecondaryButton className="mt-6">Edit Profile</SecondaryButton>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black tracking-tight text-[#1E1B4B]">
              Account settings
            </h2>
            <div className="mt-5 divide-y divide-slate-100">
              {[
                ["Sign-in methods", "Magic link, Google"],
                ["Daily reminder", "6:30 PM"],
                ["Study goal", "20 cards per day"],
                ["Card order", "Difficult cards first"],
                ["Notifications", "Email only"],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between gap-4 py-4" key={label}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#F8FAFC] text-[#312E81]">
                      <Icon name="profile" className="h-4 w-4" />
                    </span>
                    <span className="font-semibold text-[#1E1B4B]">{label}</span>
                  </div>
                  <span className="text-right text-sm font-semibold text-slate-500">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <SecondaryButton href="/auth" className="mt-6">
              Manage Sign In
            </SecondaryButton>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
