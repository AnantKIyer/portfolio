"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useAdminToken } from "./auth";
import {
  AdminSelectCard,
  EditorShell,
  EmptyEditor,
  FormField,
  FormGrid,
  FormInput,
  FormSection,
  TagPreview,
} from "./form-ui";
import {
  arrayToCsv,
  csvToArray,
  EmptyState,
  PageHeader,
  Panel,
  SaveToast,
} from "./ui";

type SkillForm = { title: string; skills: string; order: number };

const emptyForm = (): SkillForm => ({ title: "", skills: "", order: 0 });

export function SkillsPanel() {
  const token = useAdminToken();
  const rows = useQuery(api.admin.skills.listAll, token ? { sessionToken: token } : "skip");
  const create = useMutation(api.admin.skills.create);
  const update = useMutation(api.admin.skills.update);
  const remove = useMutation(api.admin.skills.remove);

  const [editingId, setEditingId] = React.useState<Id<"skillCategories"> | null>(null);
  const [form, setForm] = React.useState<SkillForm>(emptyForm());
  const [toast, setToast] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [showEditor, setShowEditor] = React.useState(false);

  function load(id: Id<"skillCategories">) {
    const row = rows?.find((x) => x._id === id);
    if (!row) return;
    setEditingId(id);
    setShowEditor(true);
    setForm({ title: row.title, skills: arrayToCsv(row.skills), order: row.order });
  }

  function reset() {
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
        skills: csvToArray(form.skills),
        order: form.order,
      };
      if (editingId) {
        await update({ ...payload, id: editingId });
        setToast("Category updated");
      } else {
        await create(payload);
        setToast("Category created");
        reset();
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
    if (!token || !editingId || !confirm("Delete this category?")) return;
    await remove({ sessionToken: token, id: editingId });
    reset();
    setShowEditor(false);
    setToast("Deleted");
    setTimeout(() => setToast(null), 2500);
  }

  const editorVisible = showEditor || editingId !== null;
  const skillCount = csvToArray(form.skills).length;

  return (
    <>
      <PageHeader
        title="Skills"
        description="Organize skill categories shown on your site."
        action={
          <Button variant="accent" onClick={reset}>
            Add category
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Panel title="Categories" className="xl:col-span-4">
          <div className="space-y-2">
            {(rows ?? []).map((r) => (
              <AdminSelectCard
                key={r._id}
                title={r.title}
                subtitle={`${r.skills.length} skill${r.skills.length === 1 ? "" : "s"}`}
                active={editingId === r._id}
                onSelect={() => load(r._id)}
              />
            ))}
            {rows?.length === 0 && (
              <EmptyState title="No categories" description="Add your first skill group." />
            )}
          </div>
        </Panel>

        <div className="xl:col-span-8">
          {!editorVisible ? (
            <EmptyEditor
              title="Select or add a category"
              description="Group related skills under a heading like Frontend or Tools."
              action={
                <Button variant="accent" onClick={reset}>
                  Add category
                </Button>
              }
            />
          ) : (
            <EditorShell
              title={editingId ? "Edit category" : "New category"}
              subtitle={form.title || "Untitled category"}
              showPublish={false}
              onSave={save}
              onDelete={editingId ? onDelete : undefined}
              saving={saving}
              isEditing={!!editingId}
              createLabel="Create category"
              updateLabel="Save changes"
            >
              <div className="space-y-6">
                <FormSection title="Category" description="Heading shown above each skill group.">
                  <FormGrid>
                    <FormField label="Title" span={2}>
                      <FormInput
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Frontend"
                      />
                    </FormField>
                    <FormField label="Display order">
                      <FormInput
                        type="number"
                        value={form.order}
                        onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                      />
                    </FormField>
                  </FormGrid>
                </FormSection>

                <FormSection
                  title="Skills"
                  description="Comma-separated list — previewed as chips below."
                >
                  <FormField label="Skill list" hint={`${skillCount} skill${skillCount === 1 ? "" : "s"} added`}>
                    <FormInput
                      value={form.skills}
                      onChange={(e) => setForm({ ...form, skills: e.target.value })}
                      placeholder="React, TypeScript, Next.js, Tailwind"
                    />
                    <TagPreview tags={form.skills} />
                  </FormField>
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
