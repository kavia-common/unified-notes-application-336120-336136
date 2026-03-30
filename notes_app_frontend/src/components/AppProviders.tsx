"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/lib/toast";

/**
 * PUBLIC_INTERFACE
 * AppProviders mounts application-wide client providers (auth, toasts).
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
