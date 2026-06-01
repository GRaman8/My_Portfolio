"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, buttonVariants } from "@/lib/utils";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  featured: boolean;
  order: number;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/projects");
    const { data } = await res.json();
    setProjects(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/projects/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    if (res.ok) { toast.success("Project deleted"); router.refresh(); load(); }
    else toast.error("Delete failed");
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title="Projects" />
      <main className="flex-1 p-6 space-y-4">
        <div className="flex justify-end">
          <Link href="/admin/projects/new" className={cn(buttonVariants())}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
        ) : projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No projects yet. Create your first one.</p>
        ) : (
          <ul className="space-y-3">
            {projects.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{p.title}</p>
                    {p.featured && <Star className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {p.techStack.slice(0, 4).map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                    {p.techStack.length > 4 && (
                      <span className="text-xs text-muted-foreground">+{p.techStack.length - 4}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/admin/projects/${p.id}`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(p.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete project?"
        description="This will permanently delete this project from your portfolio."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
