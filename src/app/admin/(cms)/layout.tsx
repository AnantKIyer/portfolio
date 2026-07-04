import { AdminGate } from "@/components/admin/auth";
import { AdminShell } from "@/components/admin/shell";

export default function AdminCmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <AdminShell>{children}</AdminShell>
    </AdminGate>
  );
}
