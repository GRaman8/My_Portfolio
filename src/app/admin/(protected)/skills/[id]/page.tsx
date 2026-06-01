"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { skillSchema, type SkillFormData, SKILL_CATEGORIES } from "@/lib/validations/skill";

export default function SkillFormPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } =
    useForm<SkillFormData>({
      resolver: zodResolver(skillSchema) as unknown as import("react-hook-form").Resolver<SkillFormData>,
      defaultValues: { name: "", category: "", iconUrl: "", order: 0 },
    });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/skills/${id}`)
        .then((r) => r.json())
        .then(({ data }) => {
          if (data) reset({ ...data, iconUrl: data.iconUrl ?? "" });
        });
    }
  }, [id, isNew, reset]);

  async function onSubmit(data: SkillFormData) {
    const url = isNew ? "/api/admin/skills" : `/api/admin/skills/${id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success(isNew ? "Skill created" : "Skill saved");
      router.push("/admin/skills");
      router.refresh();
    } else {
      toast.error("Failed to save");
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title={isNew ? "New Skill" : "Edit Skill"} />
      <main className="flex-1 p-6 max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Skill Name *</Label>
            <Input id="name" {...register("name")} placeholder="TypeScript, Docker, etc." />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="iconUrl">Icon URL</Label>
            <Input id="iconUrl" {...register("iconUrl")} placeholder="https://cdn.simpleicons.org/typescript" />
            <p className="text-xs text-muted-foreground">Use Simple Icons CDN for consistent logos.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isNew ? "Create Skill" : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
