"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, FilePlus2, Loader2, Save, Send, Trash2 } from "lucide-react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import type { BlogPost, BlogStatus } from "@/lib/blog";
import { getExcerptFromHtml, slugifyTitle } from "@/lib/blog";

type EditorState = {
  id?: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  status: BlogStatus;
};

const emptyState: EditorState = {
  title: "",
  slug: "",
  content: "",
  coverImage: "",
  status: "draft",
};

export function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [editorState, setEditorState] = useState<EditorState>(emptyState);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") || "" : "";

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load posts");
      setPosts(data.posts || []);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadCoverImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "portfolio/blog");

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Image upload failed");
    }

    return data.secure_url as string;
  };

  const handleCreate = () => {
    setEditorState(emptyState);
    setPreviewMode(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditorState({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      coverImage: post.coverImage,
      status: post.status,
    });
    setPreviewMode(false);
  };

  const handleSave = async (status: BlogStatus) => {
    if (!editorState.title.trim()) return alert("Title is required");
    if (!editorState.content.trim()) return alert("Content is required");

    setSaving(true);
    try {
      const payload = {
        ...editorState,
        slug: slugifyTitle(editorState.slug || editorState.title),
        status,
      };

      const endpoint = editorState.id ? `/api/blog/${editorState.id}` : "/api/blog";
      const method = editorState.id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to save post");

      const savedPost = data.post as BlogPost;
      setEditorState({
        id: savedPost.id,
        title: savedPost.title,
        slug: savedPost.slug,
        content: savedPost.content,
        coverImage: savedPost.coverImage,
        status: savedPost.status,
      });

      await loadPosts();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete post");

      if (editorState.id === id) setEditorState(emptyState);
      await loadPosts();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete post");
    }
  };

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [posts],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-serif">Dashboard → Blog</h3>
          <p className="text-sm text-muted-foreground">Create, edit, preview, save drafts, and publish articles.</p>
        </div>
        <button onClick={handleCreate} className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 font-medium text-primary hover:bg-primary hover:text-primary-foreground">
          <FilePlus2 className="h-4 w-4" /> Create article
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-4">
          <h4 className="mb-3 font-semibold">Articles</h4>
          {loading ? <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div> : null}
          <div className="space-y-3">
            {sortedPosts.map((post) => (
              <div key={post.id} className="rounded-lg border border-border p-3">
                <button className="text-left" onClick={() => handleEdit(post)}>
                  <p className="line-clamp-2 font-medium">{post.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{post.status}</p>
                </button>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{getExcerptFromHtml(post.content, 80)}</p>
                <button onClick={() => handleDelete(post.id)} className="mt-2 inline-flex items-center gap-1 text-xs text-destructive">
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            ))}
            {!loading && sortedPosts.length === 0 ? <p className="text-sm text-muted-foreground">No articles yet.</p> : null}
          </div>
        </aside>

        <section className="space-y-4">
          <input
            placeholder="Article title"
            value={editorState.title}
            onChange={(event) =>
              setEditorState((prev) => ({ ...prev, title: event.target.value, slug: slugifyTitle(event.target.value) }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-lg font-serif"
          />
          <input
            placeholder="slug"
            value={editorState.slug}
            onChange={(event) => setEditorState((prev) => ({ ...prev, slug: slugifyTitle(event.target.value) }))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <div>
            <label className="mb-2 block text-sm font-medium">Cover image</label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer rounded-lg border border-dashed border-border px-4 py-2 text-sm">
                Upload cover
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadCoverImage(file);
                      setEditorState((prev) => ({ ...prev, coverImage: url }));
                    } catch (error) {
                      alert(error instanceof Error ? error.message : "Upload failed");
                    } finally {
                      event.target.value = "";
                    }
                  }}
                />
              </label>
              {editorState.coverImage ? <span className="text-xs text-muted-foreground">Image uploaded</span> : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setPreviewMode((prev) => !prev)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
              <Eye className="h-4 w-4" /> {previewMode ? "Back to editor" : "Preview"}
            </button>
            <button onClick={() => handleSave("draft")} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save draft
            </button>
            <button onClick={() => handleSave("published")} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Publish article
            </button>
          </div>

          {previewMode ? (
            <article className="rounded-xl border border-border bg-card p-6">
              <h1 className="font-serif text-3xl">{editorState.title || "Untitled article"}</h1>
              <div className="editorial-content mt-6" dangerouslySetInnerHTML={{ __html: editorState.content }} />
            </article>
          ) : (
            <RichTextEditor value={editorState.content} onChange={(content) => setEditorState((prev) => ({ ...prev, content }))} onUploadImage={uploadCoverImage} />
          )}
        </section>
      </div>
    </div>
  );
}
