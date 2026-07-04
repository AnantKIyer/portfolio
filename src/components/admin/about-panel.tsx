"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import {
  DocumentBody,
  DocumentTitleInput,
  EditorShell,
  FormField,
  FormGrid,
  FormInput,
  FormSection,
  FormTabs,
  FormTextarea,
  FunFactsEditor,
} from "./form-ui";
import { FileUploadZone } from "./file-upload";
import { useAdminToken } from "./auth";
import { PageHeader, SaveToast } from "./ui";

type FunFact = { emoji: string; label: string };

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "page", label: "About page" },
  { id: "media", label: "Media" },
  { id: "contact", label: "Contact" },
];

export function AboutPanel() {
  const token = useAdminToken();
  const profile = useQuery(api.admin.profile.get, token ? { sessionToken: token } : "skip");
  const media = useQuery(api.admin.media.getMedia, token ? { sessionToken: token } : "skip");
  const update = useMutation(api.admin.profile.update);
  const [tab, setTab] = React.useState("profile");
  const [toast, setToast] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const [form, setForm] = React.useState({
    name: "",
    title: "",
    tagline: "",
    footerBio: "",
    email: "",
    phone: "",
    location: "",
    resumeUrl: "",
    github: "",
    linkedin: "",
    statsExperience: "",
    statsCompanies: "",
    statsTechnologies: "",
    educationSchool: "",
    educationDegree: "",
    educationLocation: "",
    educationPeriod: "",
    aboutHeadlineMuted: "",
    aboutHeadlineBold: "",
    funFacts: [] as FunFact[],
  });

  React.useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name,
      title: profile.title,
      tagline: profile.tagline,
      footerBio: profile.footerBio,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      resumeUrl: profile.resumeUrl ?? "",
      github: profile.github,
      linkedin: profile.linkedin,
      statsExperience: profile.statsExperience,
      statsCompanies: profile.statsCompanies,
      statsTechnologies: profile.statsTechnologies,
      educationSchool: profile.educationSchool,
      educationDegree: profile.educationDegree,
      educationLocation: profile.educationLocation,
      educationPeriod: profile.educationPeriod,
      aboutHeadlineMuted: profile.aboutHeadlineMuted ?? "Engineer with a",
      aboutHeadlineBold: profile.aboutHeadlineBold ?? "designer's eye.",
      funFacts: profile.funFacts ?? [],
    });
  }, [profile]);

  function updateFunFact(index: number, key: keyof FunFact, value: string) {
    setForm((prev) => ({
      ...prev,
      funFacts: prev.funFacts.map((f, i) => (i === index ? { ...f, [key]: value } : f)),
    }));
  }

  async function save() {
    if (!token) return;
    setSaving(true);
    try {
      await update({
        sessionToken: token,
        ...form,
        resumeUrl: form.resumeUrl.trim() || undefined,
      });
      setToast("Profile saved");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 2500);
    }
  }

  if (profile === undefined) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="About"
        description="Your bio, about page content, contact details, and site-wide profile."
      />

      <EditorShell
        title="Site profile"
        subtitle={form.name ? `${form.name} · ${form.title}` : "Loading profile…"}
        showPublish={false}
        onSave={save}
        saving={saving}
        isEditing
        updateLabel="Save profile"
      >
        <FormTabs tabs={TABS} active={tab} onChange={setTab} />

        {tab === "profile" && (
          <div className="space-y-6">
            <DocumentBody>
              <DocumentTitleInput
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
              <FormField label="Professional title" className="mt-4">
                <FormInput
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Full Stack Engineer"
                />
              </FormField>
              <FormField label="Tagline" className="mt-4">
                <FormTextarea
                  rows={2}
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="Short bio used across the site"
                  className="border-0 bg-transparent px-0 focus:ring-0"
                />
              </FormField>
            </DocumentBody>

            <FormSection title="Footer bio" description="Shown in the site footer.">
              <FormField label="Bio">
                <FormTextarea
                  rows={2}
                  value={form.footerBio}
                  onChange={(e) => setForm({ ...form, footerBio: e.target.value })}
                />
              </FormField>
            </FormSection>

            <FormSection title="Hero stats" description="Numbers displayed on the homepage.">
              <FormGrid cols={3}>
                <FormField label="Experience">
                  <FormInput
                    value={form.statsExperience}
                    onChange={(e) => setForm({ ...form, statsExperience: e.target.value })}
                    placeholder="5+ years"
                  />
                </FormField>
                <FormField label="Companies">
                  <FormInput
                    value={form.statsCompanies}
                    onChange={(e) => setForm({ ...form, statsCompanies: e.target.value })}
                    placeholder="10+"
                  />
                </FormField>
                <FormField label="Technologies">
                  <FormInput
                    value={form.statsTechnologies}
                    onChange={(e) => setForm({ ...form, statsTechnologies: e.target.value })}
                    placeholder="20+"
                  />
                </FormField>
              </FormGrid>
            </FormSection>
          </div>
        )}

        {tab === "page" && (
          <div className="space-y-6">
            <FormSection title="About page headline" description="Large display text on /about.">
              <FormGrid>
                <FormField label="First line">
                  <FormInput
                    value={form.aboutHeadlineMuted}
                    onChange={(e) => setForm({ ...form, aboutHeadlineMuted: e.target.value })}
                    placeholder="Engineer with a"
                  />
                </FormField>
                <FormField label="Accent line">
                  <FormInput
                    value={form.aboutHeadlineBold}
                    onChange={(e) => setForm({ ...form, aboutHeadlineBold: e.target.value })}
                    placeholder="designer's eye."
                  />
                </FormField>
              </FormGrid>
              <div className="mt-4 rounded-xl border border-border/40 bg-background/60 p-4">
                <p className="font-display text-2xl font-semibold leading-tight">
                  {form.aboutHeadlineMuted || "Engineer with a"}
                  <br />
                  <span className="text-accent">{form.aboutHeadlineBold || "designer's eye."}</span>
                </p>
              </div>
            </FormSection>

            <FormSection title="Education">
              <FormGrid>
                <FormField label="School">
                  <FormInput
                    value={form.educationSchool}
                    onChange={(e) => setForm({ ...form, educationSchool: e.target.value })}
                  />
                </FormField>
                <FormField label="Degree">
                  <FormInput
                    value={form.educationDegree}
                    onChange={(e) => setForm({ ...form, educationDegree: e.target.value })}
                  />
                </FormField>
                <FormField label="Location">
                  <FormInput
                    value={form.educationLocation}
                    onChange={(e) => setForm({ ...form, educationLocation: e.target.value })}
                  />
                </FormField>
                <FormField label="Period">
                  <FormInput
                    value={form.educationPeriod}
                    onChange={(e) => setForm({ ...form, educationPeriod: e.target.value })}
                    placeholder="2018 – 2022"
                  />
                </FormField>
              </FormGrid>
            </FormSection>

            <FormSection title="Fun facts" description="Small cards shown on the about page sidebar.">
              <FunFactsEditor
                facts={form.funFacts}
                onChange={updateFunFact}
                onAdd={() =>
                  setForm((prev) => ({
                    ...prev,
                    funFacts: [...prev.funFacts, { emoji: "✨", label: "New fact" }],
                  }))
                }
                onRemove={(index) =>
                  setForm((prev) => ({
                    ...prev,
                    funFacts: prev.funFacts.filter((_, i) => i !== index),
                  }))
                }
              />
            </FormSection>
          </div>
        )}

        {tab === "media" && (
          <div className="space-y-6">
            <FormSection
              title="Profile photo"
              description="Shown on the homepage hero and about page. JPG, PNG, or WebP."
            >
              <FileUploadZone
                token={token}
                label="Portrait image"
                hint="Recommended: square photo, at least 400×400px"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                previewType="image"
                previewUrl={media?.portraitUrl}
                currentFileName={media?.portraitStorageId ? "Uploaded portrait" : null}
                uploadKind="portrait"
                onUploaded={() => {
                  setToast("Portrait updated");
                  setTimeout(() => setToast(null), 2500);
                }}
                onRemoved={() => {
                  setToast("Portrait removed");
                  setTimeout(() => setToast(null), 2500);
                }}
              />
            </FormSection>

            <FormSection
              title="Résumé"
              description="PDF file used for download buttons across the site."
            >
              <FileUploadZone
                token={token}
                label="Résumé PDF"
                hint="Only PDF files are supported"
                accept="application/pdf,.pdf"
                previewType="file"
                previewUrl={media?.resumeUrl}
                currentFileName={media?.resumeFileName}
                uploadKind="resume"
                onUploaded={() => {
                  setToast("Résumé uploaded");
                  setTimeout(() => setToast(null), 2500);
                }}
                onRemoved={() => {
                  setToast("Résumé removed");
                  setTimeout(() => setToast(null), 2500);
                }}
              />
            </FormSection>
          </div>
        )}

        {tab === "contact" && (
          <FormSection title="Contact & links" description="Used on contact page, footer, and CTAs.">
            <FormGrid>
              <FormField label="Email">
                <FormInput
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </FormField>
              <FormField label="Phone">
                <FormInput
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </FormField>
              <FormField label="Location">
                <FormInput
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </FormField>
              <FormField label="Fallback résumé URL" hint="Used only if no PDF is uploaded in Media tab.">
                <FormInput
                  value={form.resumeUrl}
                  onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                  placeholder="/resume.pdf"
                />
              </FormField>
              <FormField label="GitHub" span={2}>
                <FormInput
                  type="url"
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                />
              </FormField>
              <FormField label="LinkedIn" span={2}>
                <FormInput
                  type="url"
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                />
              </FormField>
            </FormGrid>
          </FormSection>
        )}
      </EditorShell>
      <SaveToast message={toast} />
    </>
  );
}
