"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/app/admin/lib/api";
import { useLogin } from "@/app/admin/lib/hooks";
import { Button, Card, Input, Label } from "@/app/admin/components/ui";
import { useToaster } from "@/app/admin/components/toaster";

export default function AdminLoginPage() {
  const router = useRouter();
  const toaster = useToaster();
  const login = useLogin();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (getToken()) router.replace("/");
  }, [router]);

  const disabled = !usernameOrEmail.trim() || !password || login.isPending;

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#312E81] text-white font-black">A</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#CA8A04]">Aceley</p>
            <h1 className="text-lg font-black text-[#1E1B4B]">Admin sign-in</h1>
          </div>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-500">
          Internal operator console. Credentials are env-managed — contact engineering to rotate.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (disabled) return;
            login.mutate(
              { username_or_email: usernameOrEmail.trim(), password },
              {
                onSuccess: () => {
                  toaster.success("Signed in");
                  router.replace("/");
                },
                onError: (err) => toaster.error("Sign-in failed", (err as Error).message),
              },
            );
          }}
        >
          <div>
            <Label htmlFor="user">Username or email</Label>
            <Input
              id="user"
              autoComplete="username"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="pw">Password</Label>
            <Input
              id="pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
              required
            />
          </div>
          <Button type="submit" className="w-full" loading={login.isPending} disabled={disabled}>
            Sign in
          </Button>
        </form>
      </Card>
    </main>
  );
}
