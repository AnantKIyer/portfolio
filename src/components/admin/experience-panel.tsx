"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useAdminToken } from "./auth";
import {
  EditorShell,
  EmptyEditor,
  FormField,
  FormGrid,
  FormInput,
  FormSection,
  FormTabs,
  FormTextarea,
  FormToggle,
  ListField,
} from "./form-ui";
import {
  AdminListCard,
  arrayToLines,
  EmptyState,
  linesToArray,
  PageHeader,
  Panel,
  SaveToast,
} from "./ui";

type ExpForm = {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string;
  isCurrent: boolean;
  order: number;
  published: boolean;
};

const emptyForm = (): ExpForm => ({
  period: "",
  role: "",
  company: "",
  location: "",
  description: "",
  achievements: "",
  isCurrent: false,
  order: 0,
  published: true,
});

const TABS = [
  { id: "role", label: "Role" },
  { id: "story", label: "Details" },
];

export function ExperiencePanel() {
  const token = useAdminToken();
  const rows = useQuery(api.admin.experiences.listAll, token ? { sessionToken: token } : "skip");
  const create = useMutation(api.admin.experiences.create);
  const update = useMutation(api.admin.experiences.update);
  const remove = useMutation(api.admin.experiences.remove);
  const togglePublished = useMutation(api.admin.experiences.togglePublished);

  const [editingId, setEditingId] = React.useState<Id<"experiences"> | null>(null);
  const [form, setForm] = React.useState<ExpForm>(emptyForm());
  const [tab, setTab] = React.useState("role");
  const [toast, setToast] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [togglingId, setTogglingId] = React.useState<Id<"experiences"> | null>(null);
  const [showEditor, setShowEditor] = React.useState(false);

  function load(id: Id<"experiences">) {
    const row = rows?.find((x) => x._id === id);
    if (!row) return;
    setEditingId(id);
    setShowEditor(true);
    setTab("role");
    setForm({
      period: row.period,
      role: row.role,
      company: row.company,
      location: row.location,
      description: row.description,
      achievements: arrayToLines(row.achievements),
      isCurrent: row.isCurrent,
      order: row.order,
      published: row.published,
    });
  }

  function reset() {
    setEditingId(null);
    setForm(emptyForm());
    setTab("role");
    setShowEditor(true);
  }

  async function save() {
    if (!token) return;
    setSaving(true);
    try {
      const payload = {
        sessionToken: token,
        period: form.period.trim(),
        role: form.role.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        achievements: linesToArray(form.achievements),
        isCurrent: form.isCurrent,
        order: form.order,
        published: form.published,
      };
      if (editingId) {
        await update({ ...payload, id: editingId });
        setToast("Experience updated");
      } else {
        await create(payload);
        setToast("Experience created");
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
    if (!token || !editingId || !confirm("Delete this entry?")) return;
    await remove({ sessionToken: token, id: editingId });
    reset();
    setShowEditor(false);
    setToast("Deleted");
    setTimeout(() => setToast(null), 2500);
  }

  async function onTogglePublished(id: Id<"experiences">, published: boolean) {
    if (!token) return;
    setTogglingId(id);
    try {
      await togglePublished({ sessionToken: token, id, published });
      if (editingId === id) {
        setForm((prev) => ({ ...prev, published }));
      }
      setToast(published ? "Role published" : "Role unpublished");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Toggle failed");
    } finally {
      setTogglingId(null);
      setTimeout(() => setToast(null), 2000);
    }
  }

  const editorVisible = showEditor || editingId !== null;

  return (
    <>
      <PageHeader
        title="Experience"
        description="Manage your work history timeline."
        action={
          <Button variant="accent" onClick={reset}>
            Add role
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Panel title="Timeline" className="xl:col-span-4">
          <div className="space-y-2">
            {(rows ?? []).map((r) => (
              <AdminListCard
                key={r._id}
                title={r.role}
                subtitle={`${r.company} · ${r.period}`}
                published={r.published}
                active={editingId === r._id}
                toggling={togglingId === r._id}
                onSelect={() => load(r._id)}
                onTogglePublished={(published) => onTogglePublished(r._id, published)}
              />
            ))}
            {rows?.length === 0 && (
              <EmptyState title="No experience" description="Add your first role." />
            )}
          </div>
        </Panel>

        <div className="xl:col-span-8">
          {!editorVisible ? (
            <EmptyEditor
              title="Select or add a role"
              description="Pick an entry from your timeline or create a new one."
              action={
                <Button variant="accent" onClick={reset}>
                  Add role
                </Button>
              }
            />
          ) : (
            <EditorShell
              title={editingId ? "Edit role" : "New role"}
              subtitle={form.company ? `${form.role} at ${form.company}` : "Fill in role details"}
              published={form.published}
              onPublishedChange={(published) => setForm({ ...form, published })}
              onSave={save}
              onDelete={editingId ? onDelete : undefined}
              saving={saving}
              isEditing={!!editingId}
              createLabel="Add to timeline"
              updateLabel="Save changes"
            >
              <FormTabs tabs={TABS} active={tab} onChange={setTab} />

              {tab === "role" && (
                <div className="space-y-6">
                  <FormSection title="Position" description="Core details shown in the timeline.">
                    <FormGrid>
                      <FormField label="Role" span={2}>
                        <FormInput
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          placeholder="Senior Engineer"
                        />
                      </FormField>
                      <FormField label="Company">
                        <FormInput
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                        />
                      </FormField>
                      <FormField label="Period">
                        <FormInput
                          value={form.period}
                          onChange={(e) => setForm({ ...form, period: e.target.value })}
                          placeholder="2022 – Present"
                        />
                      </FormField>
                      <FormField label="Location">
                        <FormInput
                          value={form.location}
                          onChange={(e) => setForm({ ...form, location: e.target.value })}
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

                  <FormGrid cols={1}>
                    <FormToggle
                      label="Current role"
                      checked={form.isCurrent}
                      onChange={(isCurrent) => setForm({ ...form, isCurrent })}
                    />
                  </FormGrid>
                </div>
              )}

              {tab === "story" && (
                <FormSection title="Role narrative" description="Description and bullet achievements.">
                  <FormGrid cols={1}>
                    <FormField label="Description">
                      <FormTextarea
                        rows={4}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="What you did in this role"
                      />
                    </FormField>
                    <FormField label="Achievements" hint="One per line">
                      <ListField
                        value={form.achievements}
                        onChange={(achievements) => setForm({ ...form, achievements })}
                        placeholder={"Shipped v2 dashboard\nReduced load time by 40%"}
                      />
                    </FormField>
                  </FormGrid>
                </FormSection>
              )}
            </EditorShell>
          )}
        </div>
      </div>
      <SaveToast message={toast} />
    </>
  );
}
