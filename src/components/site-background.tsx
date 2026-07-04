"use client";

import { usePathname } from "next/navigation";

export function SiteBackground() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-background" />

      {/* fine matrix grid */}
      <div className="texture-grid absolute inset-0" />

      {/* soft checker overlay */}
      <div className="texture-checker absolute inset-0" />

      {/* scattered accent nodes */}
      <div className="texture-nodes absolute inset-0" />

      {/* edge vignette — keeps center readable */}
      <div className="texture-vignette absolute inset-0" />

      {/* ambient color washes */}
      <div className="absolute -left-[18%] top-[8%] h-[42rem] w-[42rem] rounded-full bg-accent/[0.07] blur-[130px]" />
      <div className="absolute -right-[12%] top-[32%] h-[36rem] w-[36rem] rounded-full bg-violet/[0.05] blur-[130px]" />
      <div className="absolute bottom-[5%] left-[30%] h-[28rem] w-[28rem] rounded-full bg-sky/[0.04] blur-[120px]" />
    </div>
  );
}
