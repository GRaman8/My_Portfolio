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
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Skill { id: string; name: string; category: string; iconUrl: string | null; }

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/skills");
    const { data } = await res.json();
    setSkills(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/skills/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    if (res.ok) { toast.success("Skill deleted"); router.refresh(); load(); }
    else toast.error("Delete failed");
  }

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] ?? []).push(s);
    return acc;
  }, {});

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title="Skills" />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-end">
          <Link href="/admin/skills/new" className={cn(buttonVariants())}>
            <Plus className="w-4 h-4 mr-2" />New Skill
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
        ) : skills.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No skills yet.</p>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{category}</p>
              <ul className="space-y-2">
                {items.map((skill) => (
                  <li key={skill.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                    <Badge variant="outline" className="text-xs">{skill.name}</Badge>
                    <div className="flex-1" />
                    <Link href={`/admin/skills/${skill.id}`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(skill.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </main>
      <ConfirmDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} title="Delete skill?" description="This will remove this skill from your portfolio." onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
