"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useAdminToken } from "./auth";
import {
  CoverPreview,
  DocumentBody,
  DocumentTitleInput,
  EditorShell,
  EmptyEditor,
  FormField,
  FormGrid,
  FormInput,
  FormSection,
  FormTextarea,
  TagPreview,
} from "./form-ui";
import {
  AdminListCard,
  arrayToCsv,
  csvToArray,
  EmptyState,
  PageHeader,
  Panel,
  SaveToast,
} from "./ui";

type BlogForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  coverImageUrl: string;
  published: boolean;
};

const emptyForm = (): BlogForm => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  tags: "",
  coverImageUrl: "",
  published: false,
});

export function BlogPanel() {
  const token = useAdminToken();
  const posts = useQuery(api.admin.blog.listAll, token ? { sessionToken: token } : "skip");
  const create = useMutation(api.admin.blog.create);
  const update = useMutation(api.admin.blog.update);
  const remove = useMutation(api.admin.blog.remove);
  const togglePublished = useMutation(api.admin.blog.togglePublished);

  const [editingId, setEditingId] = React.useState<Id<"blogPosts"> | null>(null);
  const [form, setForm] = React.useState<BlogForm>(emptyForm());
  const [toast, setToast] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [togglingId, setTogglingId] = React.useState<Id<"blogPosts"> | null>(null);
  const [showEditor, setShowEditor] = React.useState(false);

  function loadPost(id: Id<"blogPosts">) {
    const p = posts?.find((x) => x._id === id);
    if (!p) return;
    setEditingId(id);
    setShowEditor(true);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      tags: arrayToCsv(p.tags),
      coverImageUrl: p.coverImageUrl ?? "",
      published: p.published,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm());
    setShowEditor(true);
  }

  async function save() {
    if (!token) return;
    setSaving(true);
    try {
      const payload = {
        sessionToken: token,
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        tags: csvToArray(form.tags),
        coverImageUrl: form.coverImageUrl.trim() || undefined,
        published: form.published,
      };
      if (editingId) {
        await update({ ...payload, id: editingId, slug: form.slug.trim() });
        setToast("Post updated");
      } else {
        await create(payload);
        setToast("Post created");
        resetForm();
        setShowEditor(false);
      }
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 2500);
    }
  }

  async function onDelete() {
    if (!token || !editingId || !confirm("Delete this post?")) return;
    await remove({ sessionToken: token, id: editingId });
    resetForm();
    setShowEditor(false);
    setToast("Post deleted");
    setTimeout(() => setToast(null), 2500);
  }

  async function onTogglePublished(id: Id<"blogPosts">, published: boolean) {
    if (!token) return;
    setTogglingId(id);
    try {
      await togglePublished({ sessionToken: token, id, published });
      if (editingId === id) {
        setForm((prev) => ({ ...prev, published }));
      }
      setToast(published ? "Post published" : "Post unpublished");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Toggle failed");
    } finally {
      setTogglingId(null);
      setTimeout(() => setToast(null), 2000);
    }
  }

  const editorVisible = showEditor || editingId !== null;
  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <>
      <PageHeader
        title="Blog"
        description="Write articles and publish them to your site."
        action={
          <Button variant="accent" onClick={resetForm}>
            New post
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Panel title="All posts" className="xl:col-span-4">
          <div className="space-y-2">
            {(posts ?? []).map((p) => (
              <AdminListCard
                key={p._id}
                title={p.title}
                subtitle={
                  p.publishedAt
                    ? new Date(p.publishedAt).toLocaleDateString()
                    : "Draft"
                }
                published={p.published}
                active={editingId === p._id}
                toggling={togglingId === p._id}
                onSelect={() => loadPost(p._id)}
                onTogglePublished={(published) => onTogglePublished(p._id, published)}
              />
            ))}
            {posts?.length === 0 && (
              <EmptyState title="No posts yet" description="Start writing your first article." />
            )}
          </div>
        </Panel>

        <div className="xl:col-span-8">
          {!editorVisible ? (
            <EmptyEditor
              title="Select or write a post"
              description="Choose a draft from the list or compose something new."
              action={
                <Button variant="accent" onClick={resetForm}>
                  New post
                </Button>
              }
            />
          ) : (
            <EditorShell
              title={editingId ? "Edit post" : "New post"}
              subtitle={form.slug ? `/blog/${form.slug}` : "Draft"}
              published={form.published}
              onPublishedChange={(published) => setForm({ ...form, published })}
              onSave={save}
              onDelete={editingId ? onDelete : undefined}
              saving={saving}
              isEditing={!!editingId}
              createLabel="Publish draft"
              updateLabel="Save post"
            >
              <div className="space-y-6">
                <FormSection title="Cover" description="Optional hero image for the blog listing and post header.">
                  <div className="grid gap-4 md:grid-cols-2">
                    <CoverPreview url={form.coverImageUrl} />
                    <FormField label="Image URL" hint="Paste a direct link to an image file.">
                      <FormInput
                        type="url"
                        value={form.coverImageUrl}
                        onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </FormField>
                  </div>
                </FormSection>

                <DocumentBody>
                  <DocumentTitleInput
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Post title"
                  />
                  <FormField label="Excerpt" className="mt-4">
                    <FormTextarea
                      rows={2}
                      value={form.excerpt}
                      onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                      placeholder="A short summary shown in listings and under the title"
                      className="border-0 bg-transparent px-0 text-base text-muted-foreground focus:ring-0"
                    />
                  </FormField>
                  <div className="my-6 h-px bg-border/60" />
                  <FormField
                    label="Body"
                    hint="Separate paragraphs with a blank line. Use ## for headings and - for lists."
                  >
                    <FormTextarea
                      rows={16}
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      placeholder="Start writing..."
                      className="min-h-[320px] resize-y border-0 bg-transparent px-0 font-mono text-[14px] leading-7 focus:ring-0"
                    />
                  </FormField>
                  <p className="text-right text-[11px] text-muted-foreground/70">
                    {wordCount} word{wordCount === 1 ? "" : "s"}
                  </p>
                </DocumentBody>

                <FormSection title="Publishing">
                  <FormGrid>
                    <FormField label="URL slug" hint="Leave blank to auto-generate from title.">
                      <FormInput
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        placeholder="my-post-slug"
                      />
                    </FormField>
                    <FormField label="Tags" hint="Comma-separated — shown as chips on the post.">
                      <FormInput
                        value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                        placeholder="engineering, design, product"
                      />
                      <TagPreview tags={form.tags} />
                    </FormField>
                  </FormGrid>
                </FormSection>
              </div>
            </EditorShell>
          )}
        </div>
      </div>
      <SaveToast message={toast} />
    </>
  );
}
