"use client";

import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Download } from "lucide-react";

export function ResumeDownloadButton({
  href,
  className,
  label = "Résumé",
}: {
  href: string;
  className?: string;
  label?: string;
}) {
  const track = useMutation(api.analytics.track);

  async function handleClick() {
    try {
      await track({ type: "resume_download", path: "/resume" });
    } catch {
      /* analytics optional */
    }
  }

  return (
    <a href={href} download onClick={handleClick} className={className}>
      {label}
      <Download className="h-4 w-4" />
    </a>
  );
}
