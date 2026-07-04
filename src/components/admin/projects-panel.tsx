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
  FormSelect,
  FormTabs,
  FormTextarea,
  ListField,
} from "./form-ui";
import {
  AdminListCard,
  arrayToCsv,
  arrayToLines,
  csvToArray,
  EmptyState,
  linesToArray,
  PageHeader,
  Panel,
  SaveToast,
} from "./ui";

type ProjectForm = {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string;
  status: "Completed" | "In Progress" | "On Hold";
  category: "Full Stack" | "Frontend" | "Backend" | "Mobile";
  year: number;
  duration: string;
  teamSize: number;
  role: string;
  challenges: string;
  solutions: string;
  keyFeatures: string;
  results: string;
  lessonsLearned: string;
  githubUrl: string;
  liveUrl: string;
  order: number;
  published: boolean;
};

const emptyForm = (): ProjectForm => ({
  slug: "",
  title: "",
  description: "",
  longDescription: "",
  technologies: "",
  status: "Completed",
  category: "Full Stack",
  year: new Date().getFullYear(),
  duration: "",
  teamSize: 1,
  role: "",
  challenges: "",
  solutions: "",
  keyFeatures: "",
  results: "",
  lessonsLearned: "",
  githubUrl: "",
  liveUrl: "",
  order: 0,
  published: true,
});

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "details", label: "Details" },
  { id: "story", label: "Case study" },
];

export function ProjectsPanel() {
  const token = useAdminToken();
  const projects = useQuery(api.admin.projects.listAll, token ? { sessionToken: token } : "skip");
  const create = useMutation(api.admin.projects.create);
  const update = useMutation(api.admin.projects.update);
  const remove = useMutation(api.admin.projects.remove);
  const togglePublished = useMutation(api.admin.projects.togglePublished);

  const [editingId, setEditingId] = React.useState<Id<"projects"> | null>(null);
  const [form, setForm] = React.useState<ProjectForm>(emptyForm());
  const [tab, setTab] = React.useState("overview");
  const [toast, setToast] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [togglingId, setTogglingId] = React.useState<Id<"projects"> | null>(null);
  const [showEditor, setShowEditor] = React.useState(false);

  function loadProject(id: Id<"projects">) {
    const p = projects?.find((x) => x._id === id);
    if (!p) return;
    setEditingId(id);
    setShowEditor(true);
    setTab("overview");
    setForm({
      slug: p.slug,
      title: p.title,
      description: p.description,
      longDescription: p.longDescription,
      technologies: arrayToCsv(p.technologies),
      status: p.status,
      category: p.category,
      year: p.year,
      duration: p.duration,
      teamSize: p.teamSize,
      role: p.role,
      challenges: arrayToLines(p.challenges),
      solutions: arrayToLines(p.solutions),
      keyFeatures: arrayToLines(p.keyFeatures),
      results: arrayToLines(p.results),
      lessonsLearned: arrayToLines(p.lessonsLearned),
      githubUrl: p.githubUrl ?? "",
      liveUrl: p.liveUrl ?? "",
      order: p.order,
      published: p.published,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm());
    setTab("overview");
    setShowEditor(true);
  }

  async function save() {
    if (!token) return;
    setSaving(true);
    try {
      const payload = {
        sessionToken: token,
        slug: form.slug.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        longDescription: form.longDescription.trim(),
        technologies: csvToArray(form.technologies),
        status: form.status,
        category: form.category,
        year: form.year,
        duration: form.duration.trim(),
        teamSize: form.teamSize,
        role: form.role.trim(),
        challenges: linesToArray(form.challenges),
        solutions: linesToArray(form.solutions),
        keyFeatures: linesToArray(form.keyFeatures),
        results: linesToArray(form.results),
        lessonsLearned: linesToArray(form.lessonsLearned),
        githubUrl: form.githubUrl.trim() || undefined,
        liveUrl: form.liveUrl.trim() || undefined,
        order: form.order,
        published: form.published,
      };
      if (editingId) {
        await update({ ...payload, id: editingId });
        setToast("Project updated");
      } else {
        await create(payload);
        setToast("Project created");
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
    if (!token || !editingId || !confirm("Delete this project?")) return;
    await remove({ sessionToken: token, id: editingId });
    resetForm();
    setShowEditor(false);
    setToast("Project deleted");
    setTimeout(() => setToast(null), 2500);
  }

  async function onTogglePublished(id: Id<"projects">, published: boolean) {
    if (!token) return;
    setTogglingId(id);
    try {
      await togglePublished({ sessionToken: token, id, published });
      if (editingId === id) {
        setForm((prev) => ({ ...prev, published }));
      }
      setToast(published ? "Project published" : "Project unpublished");
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
        title="Projects"
        description="Create, edit, and publish portfolio case studies."
        action={
          <Button variant="accent" onClick={resetForm}>
            New project
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Panel title="All projects" className="xl:col-span-4">
          <div className="space-y-2">
            {(projects ?? []).map((p) => (
              <AdminListCard
                key={p._id}
                title={p.title}
                subtitle={p.slug}
                published={p.published}
                active={editingId === p._id}
                toggling={togglingId === p._id}
                onSelect={() => loadProject(p._id)}
                onTogglePublished={(published) => onTogglePublished(p._id, published)}
              />
            ))}
            {projects?.length === 0 && (
              <EmptyState title="No projects yet" description="Create your first project." />
            )}
          </div>
        </Panel>

        <div className="xl:col-span-8">
          {!editorVisible ? (
            <EmptyEditor
              title="Select or create a project"
              description="Pick a project from the list to edit, or start a new case study."
              action={
                <Button variant="accent" onClick={resetForm}>
                  New project
                </Button>
              }
            />
          ) : (
            <EditorShell
              title={editingId ? "Edit project" : "New project"}
              subtitle={form.title || form.slug || "Add project details below"}
              published={form.published}
              onPublishedChange={(published) => setForm({ ...form, published })}
              onSave={save}
              onDelete={editingId ? onDelete : undefined}
              saving={saving}
              isEditing={!!editingId}
              createLabel="Create project"
              updateLabel="Save changes"
            >
              <FormTabs tabs={TABS} active={tab} onChange={setTab} />

              {tab === "overview" && (
                <div className="space-y-6">
                  <FormSection title="Identity" description="How this project appears in listings.">
                    <FormGrid>
                      <FormField label="Title" span={2}>
                        <FormInput
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="Project name"
                        />
                      </FormField>
                      <FormField label="URL slug">
                        <FormInput
                          value={form.slug}
                          onChange={(e) => setForm({ ...form, slug: e.target.value })}
                          placeholder="my-project"
                        />
                      </FormField>
                      <FormField label="Display order">
                        <FormInput
                          type="number"
                          value={form.order}
                          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                        />
                      </FormField>
                      <FormField label="Short description" span={2}>
                        <FormTextarea
                          rows={2}
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          placeholder="One-liner for cards and previews"
                        />
                      </FormField>
                      <FormField label="Full description" span={2}>
                        <FormTextarea
                          rows={5}
                          value={form.longDescription}
                          onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                          placeholder="Detailed overview shown on the project page"
                        />
                      </FormField>
                    </FormGrid>
                  </FormSection>

                  <FormSection title="Classification">
                    <FormGrid cols={3}>
                      <FormField label="Category">
                        <FormSelect
                          value={form.category}
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value as ProjectForm["category"] })
                          }
                        >
                          <option>Full Stack</option>
                          <option>Frontend</option>
                          <option>Backend</option>
                          <option>Mobile</option>
                        </FormSelect>
                      </FormField>
                      <FormField label="Status">
                        <FormSelect
                          value={form.status}
                          onChange={(e) =>
                            setForm({ ...form, status: e.target.value as ProjectForm["status"] })
                          }
                        >
                          <option>Completed</option>
                          <option>In Progress</option>
                          <option>On Hold</option>
                        </FormSelect>
                      </FormField>
                      <FormField label="Technologies" hint="Comma-separated">
                        <FormInput
                          value={form.technologies}
                          onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                          placeholder="React, TypeScript, Convex"
                        />
                      </FormField>
                    </FormGrid>
                  </FormSection>
                </div>
              )}

              {tab === "details" && (
                <FormSection title="Project metadata" description="Timeline, role, and external links.">
                  <FormGrid>
                    <FormField label="Your role">
                      <FormInput
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        placeholder="Lead engineer"
                      />
                    </FormField>
                    <FormField label="Team size">
                      <FormInput
                        type="number"
                        min={1}
                        value={form.teamSize}
                        onChange={(e) => setForm({ ...form, teamSize: Number(e.target.value) })}
                      />
                    </FormField>
                    <FormField label="Year">
                      <FormInput
                        type="number"
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                      />
                    </FormField>
                    <FormField label="Duration">
                      <FormInput
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        placeholder="3 months"
                      />
                    </FormField>
                    <FormField label="GitHub URL" span={2}>
                      <FormInput
                        type="url"
                        value={form.githubUrl}
                        onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </FormField>
                    <FormField label="Live demo URL" span={2}>
                      <FormInput
                        type="url"
                        value={form.liveUrl}
                        onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </FormField>
                  </FormGrid>
                </FormSection>
              )}

              {tab === "story" && (
                <div className="space-y-6">
                  <FormSection title="Narrative" description="One point per line — shown as bullet lists on the site.">
                    <FormGrid cols={1}>
                      <FormField label="Challenges">
                        <ListField
                          value={form.challenges}
                          onChange={(challenges) => setForm({ ...form, challenges })}
                          placeholder={"Scaling real-time updates\nLegacy API constraints"}
                        />
                      </FormField>
                      <FormField label="Solutions">
                        <ListField
                          value={form.solutions}
                          onChange={(solutions) => setForm({ ...form, solutions })}
                        />
                      </FormField>
                      <FormField label="Key features">
                        <ListField
                          value={form.keyFeatures}
                          onChange={(keyFeatures) => setForm({ ...form, keyFeatures })}
                        />
                      </FormField>
                      <FormField label="Results">
                        <ListField
                          value={form.results}
                          onChange={(results) => setForm({ ...form, results })}
                        />
                      </FormField>
                      <FormField label="Lessons learned">
                        <ListField
                          value={form.lessonsLearned}
                          onChange={(lessonsLearned) => setForm({ ...form, lessonsLearned })}
                        />
                      </FormField>
                    </FormGrid>
                  </FormSection>
                </div>
              )}
            </EditorShell>
          )}
        </div>
      </div>
      <SaveToast message={toast} />
    </>
  );
}
