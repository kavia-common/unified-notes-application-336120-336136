import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <section className="card w-full max-w-lg p-6" role="alert" aria-live="assertive">
        <header>
          <h1 className="text-xl font-semibold text-gray-900">404 – Page Not Found</h1>
          <p className="mt-1 text-sm text-gray-600">
            The page you’re looking for doesn’t exist.
          </p>
        </header>

        <div className="mt-6">
          <Link className="btn btn-primary inline-block" href="/dashboard">
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
