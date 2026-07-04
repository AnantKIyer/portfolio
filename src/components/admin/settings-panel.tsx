"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useAdminToken } from "./auth";
import {
  FormField,
  FormGrid,
  FormInput,
  FormSection,
  FormSelect,
  FormTextarea,
  FormToggle,
} from "./form-ui";
import { PageHeader, Panel, SaveToast } from "./ui";

export function SettingsPanel() {
  const token = useAdminToken();
  const session = useQuery(
    api.adminAuth.validateSession,
    token ? { sessionToken: token } : "skip",
  );
  const status = useQuery(api.siteStatus.get);
  const projects = useQuery(api.admin.projects.listAll, token ? { sessionToken: token } : "skip");
  const updateStatus = useMutation(api.siteStatus.update);
  const changePassword = useMutation(api.adminAuth.changePassword);

  const [available, setAvailable] = React.useState(true);
  const [buildingNote, setBuildingNote] = React.useState("");
  const [featuredProjectSlug, setFeaturedProjectSlug] = React.useState("");
  const [featuredNote, setFeaturedNote] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [changingPassword, setChangingPassword] = React.useState(false);

  React.useEffect(() => {
    if (status) {
      setAvailable(status.availableForWork);
      setBuildingNote(status.buildingNote);
      setFeaturedProjectSlug(status.featuredProjectSlug ?? "");
      setFeaturedNote(status.featuredNote ?? "");
    }
  }, [status]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  async function save() {
    if (!token) return;
    setSaving(true);
    try {
      await updateStatus({
        sessionToken: token,
        availableForWork: available,
        buildingNote: buildingNote.trim(),
        featuredProjectSlug: featuredProjectSlug || undefined,
        featuredNote: featuredNote.trim() || undefined,
      });
      showToast("Settings saved");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!token) return;
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword({
        sessionToken: token,
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password updated");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Password change failed");
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Site availability, featured content, and account security."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Live status">
          <div className="space-y-4">
            <FormToggle
              label="Available for work"
              checked={available}
              onChange={setAvailable}
            />
            <FormField label="Building note" hint="Shown in navigation and hero">
              <FormTextarea
                rows={3}
                value={buildingNote}
                onChange={(e) => setBuildingNote(e.target.value)}
              />
            </FormField>
            <FormField label="Featured project">
              <FormSelect
                value={featuredProjectSlug}
                onChange={(e) => setFeaturedProjectSlug(e.target.value)}
              >
                <option value="">None</option>
                {(projects ?? []).map((p) => (
                  <option key={p._id} value={p.slug}>
                    {p.title}
                  </option>
                ))}
              </FormSelect>
            </FormField>
            <FormField label="Featured project note">
              <FormInput
                value={featuredNote}
                onChange={(e) => setFeaturedNote(e.target.value)}
              />
            </FormField>
            <Button variant="accent" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save settings"}
            </Button>
          </div>
        </Panel>

        <Panel title="Account security">
          <FormSection
            title="Change password"
            description={
              session?.username
                ? `Signed in as ${session.username}. Enter your current password to set a new one.`
                : "Enter your current password to set a new one."
            }
          >
            <FormGrid cols={1}>
              <FormField label="Current password">
                <FormInput
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </FormField>
              <FormField label="New password" hint="Minimum 8 characters">
                <FormInput
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </FormField>
              <FormField label="Confirm new password">
                <FormInput
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </FormField>
            </FormGrid>
            <Button
              variant="accent"
              className="mt-4"
              onClick={handleChangePassword}
              disabled={
                changingPassword ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
            >
              {changingPassword ? "Updating…" : "Update password"}
            </Button>
          </FormSection>
        </Panel>
      </div>
      <SaveToast message={toast} />
    </>
  );
}
