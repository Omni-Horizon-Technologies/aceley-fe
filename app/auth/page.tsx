import Image from "next/image";
import { AuthForm } from "@/app/components/auth-form";
import { BrandMark, Icon, MockDashboardPreview } from "@/app/components/ui";

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#1E1B4B]">
      <div className="grid lg:min-h-screen lg:grid-cols-[1fr_0.92fr]">
        <section className="bg-gradient-to-br from-[#312E81] to-[#1E1B4B] px-4 py-5 text-white sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col lg:h-full">
            <BrandMark tone="dark" />
            <div className="flex flex-col py-8 lg:flex-1 lg:justify-center lg:py-12">
              <p className="inline-flex w-fit rounded-lg bg-white/10 px-3 py-2 text-sm font-bold text-[#FB7185] ring-1 ring-white/15">
                Sign in and start studying
              </p>
              <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight lg:text-5xl">
                Get into Aceley in seconds
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/78">
                Use a magic link or Google to reach your decks without adding
                another password.
              </p>

              <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-3">
                {["No password", "Fast access", "Student ready"].map((item) => (
                  <div
                    className="rounded-lg border border-white/15 bg-white/10 p-4"
                    key={item}
                  >
                    <Icon name="check" className="text-[#FB7185]" />
                    <p className="mt-3 text-sm font-bold">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 hidden xl:block">
                <MockDashboardPreview />
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-6 lg:min-h-screen lg:px-8 lg:py-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center">
              <Image
                alt="Aceley"
                className="h-14 w-auto"
                height={56}
                priority
                src="/files/aceley_horizontal.svg"
                width={156}
              />
            </div>
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-black tracking-tight text-[#1E1B4B]">
                Welcome back
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Sign in to save decks, track progress, and keep studying across
                devices.
              </p>
            </div>
            <AuthForm />
            <p className="mt-5 text-center text-xs leading-5 text-slate-500">
              By continuing, you agree to use Aceley for your own learning
              workspace.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
