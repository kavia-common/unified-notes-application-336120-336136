"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DashboardImpl from "./DashboardImpl";

/**
 * PUBLIC_INTERFACE
 * Dashboard route page; reads query params (e.g. tag) and passes to implementation.
 */
export default function DashboardPage() {
  const sp = useSearchParams();
  const [initialTag, setInitialTag] = useState<string | undefined>(undefined);

  useEffect(() => {
    const t = sp.get("tag");
    setInitialTag(t || undefined);
  }, [sp]);

  return <DashboardImpl initialTag={initialTag} />;
}
