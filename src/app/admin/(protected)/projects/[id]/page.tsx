"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import TechStackInput from "@/components/admin/TechStackInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { projectSchema, type ProjectFormData } from "@/lib/validations/project";

export default function ProjectFormPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as unknown as import("react-hook-form").Resolver<ProjectFormData>,
    defaultValues: { title: "", description: "", imageUrl: "", techStack: [], githubUrl: "", liveUrl: "", featured: false, order: 0 },
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/projects/${id}`)
        .then((r) => r.json())
        .then(({ data }) => {
          if (data) reset({
            ...data,
            imageUrl: data.imageUrl ?? "",
            githubUrl: data.githubUrl ?? "",
            liveUrl: data.liveUrl ?? "",
          });
        });
    }
  }, [id, isNew, reset]);

  async function onSubmit(data: ProjectFormData) {
    const url = isNew ? "/api/admin/projects" : `/api/admin/projects/${id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success(isNew ? "Project created" : "Project saved");
      router.push("/admin/projects");
      router.refresh();
    } else {
      toast.error("Failed to save project");
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title={isNew ? "New Project" : "Edit Project"} />
      <main className="flex-1 p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register("title")} placeholder="Project name" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register("description")} rows={4} placeholder="What does this project do?" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <Controller
            name="imageUrl"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ImageUpload label="Project Image" value={field.value ?? ""} onChange={field.onChange} />
            )}
          />

          <Controller
            name="techStack"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label>Tech Stack</Label>
                <TechStackInput value={field.value} onChange={field.onChange} />
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input id="githubUrl" {...register("githubUrl")} placeholder="https://github.com/…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input id="liveUrl" {...register("liveUrl")} placeholder="https://…" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch
                id="featured"
                checked={watch("featured")}
                onCheckedChange={(v) => setValue("featured", v)}
              />
              <Label htmlFor="featured">Featured on homepage</Label>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="order" className="text-sm">Order</Label>
              <Input
                id="order"
                type="number"
                {...register("order", { valueAsNumber: true })}
                className="w-20"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isNew ? "Create Project" : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
