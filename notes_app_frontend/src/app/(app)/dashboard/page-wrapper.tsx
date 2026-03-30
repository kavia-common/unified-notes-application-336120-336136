"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardPage from "./page";

/**
 * PUBLIC_INTERFACE
 * DashboardPageWrapper handles query params (e.g., ?tag=foo) and renders the dashboard.
 * This file exists to keep the main dashboard page focused on UI state.
 */
export default function DashboardPageWrapper() {
  const sp = useSearchParams();
  const router = useRouter();

  // If query params exist, keep them; the main page currently reads from internal state.
  // We normalize by leaving the URL intact; future enhancement can pass it down.
  useEffect(() => {
    const tag = sp.get("tag");
    if (tag) {
      // no-op for now; URL is the source of truth for sharing
      // (dashboard page has its own tag filter UI in sidebar)
    }
  }, [sp, router]);

  return <DashboardPage />;
}
