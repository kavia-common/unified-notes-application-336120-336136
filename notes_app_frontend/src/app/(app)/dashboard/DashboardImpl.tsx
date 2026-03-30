"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AuthGate } from "@/components/AuthGate";
import { Shell } from "@/components/Shell";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import type { Note } from "@/lib/types";
import { createNote, deleteNote, listNotes, updateNote } from "@/lib/notesApi";
import { listTags } from "@/lib/tagsApi";

function normalizeTags(s: string): string[] {
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

/**
 * PUBLIC_INTERFACE
 * DashboardImpl renders the main notes list + editor experience.
 */
export default function DashboardImpl({ initialTag }: { initialTag?: string }) {
  const { token } = useAuth();
  const { push } = useToast();

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | undefined>(undefined);

  const appliedInitialTag = useRef(false);

  const [busy, setBusy] = useState(false);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editorTags, setEditorTags] = useState("");

  const [tags, setTags] = useState<{ name: string; count?: number }[]>([]);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId],
  );

  async function refresh() {
    if (!token) return;
    try {
      const [ns, ts] = await Promise.all([
        listNotes({ token, q: q || undefined, tag }),
        listTags({ token }).catch(() => []),
      ]);
      setNotes(ns);
      setTags(ts);
      if (selectedId && !ns.some((n) => n.id === selectedId)) {
        setSelectedId(ns[0]?.id ?? null);
      }
      if (!selectedId && ns[0]?.id) setSelectedId(ns[0].id);
    } catch (err: any) {
      push({
        type: "error",
        title: "Failed to load notes",
        message:
          err?.message ||
          "Check that NEXT_PUBLIC_API_BASE_URL points to the backend.",
      });
    }
  }

  useEffect(() => {
    if (!appliedInitialTag.current && initialTag) {
      appliedInitialTag.current = true;
      setTag(initialTag);
    }
  }, [initialTag]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tag]);

  useEffect(() => {
    if (selectedNote) {
      setEditorTitle(selectedNote.title || "");
      setEditorContent(selectedNote.content || "");
      setEditorTags((selectedNote.tags || []).join(", "));
    } else {
      setEditorTitle("");
      setEditorContent("");
      setEditorTags("");
    }
  }, [selectedNote]);

  return (
    <AuthGate>
      <Shell
        title="Dashboard"
        sidebar={
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Filter by tag
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  className={`badge ${!tag ? "border-blue-200 text-blue-700 bg-blue-50" : ""}`}
                  onClick={() => setTag(undefined)}
                >
                  All
                </button>
                {tags.slice(0, 20).map((t) => (
                  <button
                    key={t.name}
                    className={`badge ${tag === t.name ? "border-blue-200 text-blue-700 bg-blue-50" : ""}`}
                    onClick={() => setTag(t.name)}
                    title={t.count != null ? `${t.count} notes` : undefined}
                  >
                    #{t.name}
                    {t.count != null ? <span className="text-gray-400">{t.count}</span> : null}
                  </button>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
          {/* List */}
          <section className="card p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <input
                  className="input"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search notes…"
                />
                <button className="btn" onClick={() => refresh()} aria-label="Search">
                  Search
                </button>
              </div>

              <button
                className="btn btn-primary"
                onClick={async () => {
                  if (!token) return;
                  setBusy(true);
                  try {
                    const n = await createNote({
                      token,
                      title: "Untitled",
                      content: "",
                      tags: [],
                    });
                    push({ type: "success", title: "Note created" });
                    setNotes((prev) => [n, ...prev]);
                    setSelectedId(n.id);
                  } catch (err: any) {
                    push({
                      type: "error",
                      title: "Create failed",
                      message: err?.message || "Unable to create note.",
                    });
                  } finally {
                    setBusy(false);
                  }
                }}
                disabled={busy}
              >
                New note
              </button>

              <div className="border-t border-gray-200 pt-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Notes
                </div>
                <div className="mt-2 flex flex-col gap-1">
                  {notes.length === 0 ? (
                    <div className="text-sm text-gray-600">No notes found.</div>
                  ) : (
                    notes.map((n) => (
                      <button
                        key={n.id}
                        className={`w-full rounded-lg border px-3 py-2 text-left ${
                          selectedId === n.id
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedId(n.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="truncate text-sm font-semibold text-gray-900">
                            {n.title || "Untitled"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {n.updated_at ? new Date(n.updated_at).toLocaleDateString() : ""}
                          </div>
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-gray-600">
                          {n.content || "No content"}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {(n.tags || []).slice(0, 4).map((t) => (
                            <span key={t} className="badge">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Editor */}
          <section className="card p-4">
            {!selectedNote ? (
              <div className="text-sm text-gray-600">Select a note to edit.</div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-gray-500">
                    Note ID:{" "}
                    <span className="font-mono text-gray-700">{selectedNote.id}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-danger"
                      onClick={async () => {
                        if (!token || !selectedNote) return;
                        if (!confirm("Delete this note?")) return;
                        setBusy(true);
                        try {
                          await deleteNote({ token, id: selectedNote.id });
                          push({ type: "success", title: "Deleted" });
                          setNotes((prev) => prev.filter((x) => x.id !== selectedNote.id));
                          setSelectedId(null);
                        } catch (err: any) {
                          push({
                            type: "error",
                            title: "Delete failed",
                            message: err?.message || "Unable to delete note.",
                          });
                        } finally {
                          setBusy(false);
                        }
                      }}
                      disabled={busy}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={async () => {
                        if (!token || !selectedNote) return;
                        setBusy(true);
                        try {
                          const updated = await updateNote({
                            token,
                            id: selectedNote.id,
                            title: editorTitle,
                            content: editorContent,
                            tags: normalizeTags(editorTags),
                          });
                          push({ type: "success", title: "Saved" });
                          setNotes((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
                        } catch (err: any) {
                          push({
                            type: "error",
                            title: "Save failed",
                            message: err?.message || "Unable to save note.",
                          });
                        } finally {
                          setBusy(false);
                        }
                      }}
                      disabled={busy}
                    >
                      {busy ? "Saving…" : "Save"}
                    </button>
                  </div>
                </div>

                <label className="text-sm text-gray-700">
                  Title
                  <input
                    className="input mt-1"
                    value={editorTitle}
                    onChange={(e) => setEditorTitle(e.target.value)}
                    placeholder="Note title"
                  />
                </label>

                <label className="text-sm text-gray-700">
                  Tags (comma separated)
                  <input
                    className="input mt-1"
                    value={editorTags}
                    onChange={(e) => setEditorTags(e.target.value)}
                    placeholder="e.g. work, idea, todo"
                  />
                </label>

                <label className="text-sm text-gray-700">
                  Content
                  <textarea
                    className="input mt-1 min-h-[260px] resize-y"
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Write your note…"
                  />
                </label>

                <div className="text-xs text-gray-500">
                  Tip: Use tags to stay organized. Search filters server-side via <span className="font-mono">/notes?q=</span>.
                </div>
              </div>
            )}
          </section>
        </div>
      </Shell>
    </AuthGate>
  );
}
