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
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
}

export default function EducationPage() {
  const router = useRouter();
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/education");
    const { data } = await res.json();
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/education/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    if (res.ok) { toast.success("Deleted"); router.refresh(); load(); }
    else toast.error("Delete failed");
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title="Education" />
      <main className="flex-1 p-6 space-y-4">
        <div className="flex justify-end">
          <Link href="/admin/education/new" className={cn(buttonVariants())}>
            <Plus className="w-4 h-4 mr-2" />New Entry
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">{[1,2].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No education entries yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.institution}</p>
                  <p className="text-sm text-muted-foreground">{item.degree} in {item.field}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/admin/education/${item.id}`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <ConfirmDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} title="Delete education entry?" description="This will remove this entry from your portfolio." onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
