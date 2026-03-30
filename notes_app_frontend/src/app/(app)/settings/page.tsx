"use client";

import React, { useEffect, useState } from "react";
import { AuthGate } from "@/components/AuthGate";
import { Shell } from "@/components/Shell";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import type { Settings } from "@/lib/types";
import { getSettings, updateSettings } from "@/lib/settingsApi";

export default function SettingsPage() {
  const { token } = useAuth();
  const { push } = useToast();

  const [busy, setBusy] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    displayName: "",
    defaultSort: "updated",
  });

  useEffect(() => {
    async function run() {
      if (!token) return;
      try {
        const s = await getSettings({ token });
        setSettings({
          displayName: s.displayName ?? "",
          defaultSort: s.defaultSort ?? "updated",
        });
      } catch (err: any) {
        // Backend may not implement yet; keep defaults but inform user.
        push({
          type: "info",
          title: "Settings unavailable",
          message: "Backend settings endpoint may not be implemented yet.",
        });
      }
    }
    run();
  }, [token, push]);

  return (
    <AuthGate>
      <Shell title="Settings">
        <div className="card p-4">
          <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Customize your notes experience.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-sm text-gray-700">
              Display name
              <input
                className="input mt-1"
                value={settings.displayName ?? ""}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, displayName: e.target.value }))
                }
                placeholder="e.g. Alex"
              />
            </label>

            <label className="text-sm text-gray-700">
              Default sort
              <select
                className="input mt-1"
                value={settings.defaultSort ?? "updated"}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    defaultSort: e.target.value as Settings["defaultSort"],
                  }))
                }
              >
                <option value="updated">Recently updated</option>
                <option value="created">Recently created</option>
                <option value="title">Title</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <button
              className="btn btn-primary"
              disabled={busy}
              onClick={async () => {
                if (!token) return;
                setBusy(true);
                try {
                  await updateSettings({ token, settings });
                  push({ type: "success", title: "Settings saved" });
                } catch (err: any) {
                  push({
                    type: "error",
                    title: "Save failed",
                    message: err?.message || "Unable to save settings.",
                  });
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Saving…" : "Save settings"}
            </button>

            <div className="text-xs text-gray-500">
              Uses <span className="font-mono">/settings</span> endpoint.
            </div>
          </div>
        </div>
      </Shell>
    </AuthGate>
  );
}
