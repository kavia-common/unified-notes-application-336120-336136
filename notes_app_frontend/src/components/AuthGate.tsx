"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

/**
 * PUBLIC_INTERFACE
 * AuthGate redirects to /login when unauthenticated and can show a loading state.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { token, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !token) {
      router.replace("/login");
    }
  }, [isReady, token, router]);

  if (!isReady) {
    return (
      <div className="container-pad">
        <div className="card p-4">
          <div className="text-sm text-gray-600">Loading…</div>
        </div>
      </div>
    );
  }

  if (!token) return null;
  return <>{children}</>;
}
