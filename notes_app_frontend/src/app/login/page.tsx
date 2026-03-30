"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";

export default function LoginPage() {
  const { login } = useAuth();
  const { push } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card p-6">
          <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-600">
            Log in to access your notes across devices.
          </p>

          <form
            className="mt-6 flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await login(email, password);
                router.replace("/dashboard");
              } catch (err: any) {
                push({
                  type: "error",
                  title: "Login failed",
                  message:
                    err?.message ||
                    "Unable to login. Check backend URL and credentials.",
                });
              } finally {
                setBusy(false);
              }
            }}
          >
            <label className="text-sm text-gray-700">
              Email
              <input
                className="input mt-1"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="text-sm text-gray-700">
              Password
              <input
                className="input mt-1"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>

            <button className="btn btn-primary mt-2" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            New here?{" "}
            <Link className="text-blue-700 hover:underline" href="/signup">
              Create an account
            </Link>
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
            Backend URL:{" "}
            <span className="font-mono">
              {process.env.NEXT_PUBLIC_API_BASE_URL || "(not set)"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
