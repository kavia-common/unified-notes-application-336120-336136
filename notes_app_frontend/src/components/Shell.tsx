"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

function NavItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 text-sm ${
        active
          ? "bg-blue-50 text-blue-700 border border-blue-100"
          : "text-gray-700 hover:bg-gray-50 border border-transparent"
      }`}
    >
      {label}
    </Link>
  );
}

/**
 * PUBLIC_INTERFACE
 * Shell provides the main responsive app layout (sidebar + topbar + main).
 */
export function Shell({
  title,
  sidebar,
  children,
}: {
  title: string;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();

  const sidebarContent = useMemo(() => {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">Notes</div>
          <button
            className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            Close
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <NavItem href="/dashboard" label="All notes" />
          <NavItem href="/tags" label="Tags" />
          <NavItem href="/settings" label="Settings" />
        </div>

        {sidebar ? <div className="pt-2">{sidebar}</div> : null}

        <div className="mt-auto pt-4">
          <button className="btn w-full" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
    );
  }, [logout, sidebar]);

  return (
    <div className="min-h-screen">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <div className="text-base font-semibold text-gray-900">
              {title}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Synced notes • light theme
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <div className="card p-4">{sidebarContent}</div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute left-0 top-0 h-full w-[min(320px,85vw)] bg-white p-4 shadow-xl">
              {sidebarContent}
            </div>
          </div>
        ) : null}

        {/* Main */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
