"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";

export default function SignupPage() {
  const { signup, token } = useAuth();
  const { push } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card p-6">
          <h1 className="text-xl font-semibold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-gray-600">
            Sign up with email and password.
          </p>

          <form
            className="mt-6 flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await signup(email, password);
                if (token) {
                  router.replace("/dashboard");
                } else {
                  push({
                    type: "success",
                    title: "Account created",
                    message: "Please log in to continue.",
                  });
                  router.replace("/login");
                }
              } catch (err: any) {
                push({
                  type: "error",
                  title: "Signup failed",
                  message: err?.message || "Unable to create account.",
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
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
            </label>

            <button className="btn btn-primary mt-2" disabled={busy}>
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link className="text-blue-700 hover:underline" href="/login">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
