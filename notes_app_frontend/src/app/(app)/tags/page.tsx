"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AuthGate } from "@/components/AuthGate";
import { Shell } from "@/components/Shell";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { listTags } from "@/lib/tagsApi";
import type { Tag } from "@/lib/types";

export default function TagsPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    async function run() {
      if (!token) return;
      try {
        const t = await listTags({ token });
        setTags(t);
      } catch (err: any) {
        push({
          type: "error",
          title: "Failed to load tags",
          message: err?.message || "Unable to load tags.",
        });
      }
    }
    run();
  }, [token, push]);

  return (
    <AuthGate>
      <Shell title="Tags">
        <div className="card p-4">
          <h1 className="text-lg font-semibold text-gray-900">Tags</h1>
          <p className="mt-1 text-sm text-gray-600">
            Browse tags and jump to filtered notes.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {tags.length === 0 ? (
              <div className="text-sm text-gray-600">No tags yet.</div>
            ) : (
              tags.map((t) => (
                <Link
                  key={t.name}
                  href={`/dashboard?tag=${encodeURIComponent(t.name)}`}
                  className="badge hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                >
                  #{t.name}
                  {t.count != null ? <span className="text-gray-400">{t.count}</span> : null}
                </Link>
              ))
            )}
          </div>
        </div>
      </Shell>
    </AuthGate>
  );
}
