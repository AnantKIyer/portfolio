"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { FileUp, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

async function uploadToConvex(uploadUrl: string, file: File) {
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!response.ok) {
    throw new Error("Upload failed");
  }
  const json = (await response.json()) as { storageId: Id<"_storage"> };
  return json.storageId;
}

export function FileUploadZone({
  token,
  label,
  hint,
  accept,
  currentFileName,
  previewUrl,
  previewType = "none",
  onUploaded,
  onRemoved,
  uploadKind,
}: {
  token: string;
  label: string;
  hint?: string;
  accept: string;
  currentFileName?: string | null;
  previewUrl?: string | null;
  previewType?: "image" | "file" | "none";
  onUploaded?: (url: string | null) => void;
  onRemoved?: () => void;
  uploadKind: "portrait" | "resume";
}) {
  const generateUploadUrl = useMutation(api.admin.media.generateUploadUrl);
  const uploadPortrait = useMutation(api.admin.media.uploadPortrait);
  const uploadResume = useMutation(api.admin.media.uploadResume);
  const removePortrait = useMutation(api.admin.media.removePortrait);
  const removeResume = useMutation(api.admin.media.removeResume);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFile(file: File) {
    if (!token) return;
    setUploading(true);
    setError(null);
    try {
      const uploadUrl = await generateUploadUrl({ sessionToken: token });
      const storageId = await uploadToConvex(uploadUrl, file);
      let url: string | null = null;

      if (uploadKind === "portrait") {
        url = await uploadPortrait({ sessionToken: token, storageId });
      } else {
        url = await uploadResume({
          sessionToken: token,
          storageId,
          fileName: file.name,
        });
      }
      onUploaded?.(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (!token) return;
    setUploading(true);
    setError(null);
    try {
      if (uploadKind === "portrait") {
        await removePortrait({ sessionToken: token });
      } else {
        await removeResume({ sessionToken: token });
      }
      onRemoved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Remove failed");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  }

  const hasFile = Boolean(currentFileName || previewUrl);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {hint && <p className="mt-0.5 text-[11px] text-muted-foreground/80">{hint}</p>}
      </div>

      {previewType === "image" && previewUrl && (
        <div className="flex justify-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-border/70 ring-offset-2 ring-offset-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Portrait preview" className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "rounded-xl border border-dashed p-5 transition-colors",
          dragging ? "border-accent bg-accent/5" : "border-border/70 bg-background/50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <FileUp className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          {hasFile ? (
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {currentFileName ?? "File uploaded"}
              </p>
              {previewUrl && previewType === "file" && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-accent hover:underline"
                >
                  View current file
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Drag & drop or click to upload
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              variant="soft"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {hasFile ? "Replace file" : "Choose file"}
            </Button>
            {hasFile && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={uploading}
                onClick={() => void handleRemove()}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
