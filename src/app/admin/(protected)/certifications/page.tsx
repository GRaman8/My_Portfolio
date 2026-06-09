"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, buttonVariants } from "@/lib/utils";
import { Plus, Pencil, Trash2, Award, ExternalLink } from "lucide-react";

interface Certification {
  id: string;
  title: string;
  provider: string;
  issuedDate: string | null;
  credentialUrl: string | null;
}

export default function CertificationsPage() {
  const router = useRouter();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/certifications");
    const { data } = await res.json();
    setCertifications(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/certifications/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    if (res.ok) { toast.success("Certification deleted"); router.refresh(); load(); }
    else toast.error("Delete failed");
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title="Certifications" />
      <main className="flex-1 p-6 space-y-4">
        <div className="flex justify-end">
          <Link href="/admin/certifications/new" className={cn(buttonVariants())}>
            <Plus className="w-4 h-4 mr-2" />New Certification
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
        ) : certifications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No certifications yet.</p>
        ) : (
          <ul className="space-y-2">
            {certifications.map((cert) => (
              <li key={cert.id} className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                <Award className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{cert.title}</p>
                  <p className="text-xs text-muted-foreground">{cert.provider}</p>
                </div>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <Link href={`/admin/certifications/${cert.id}`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                  <Pencil className="w-4 h-4" />
                </Link>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(cert.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </main>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete certification?"
        description="This will remove this certification from your portfolio."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
