"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import BulletListEditor from "@/components/admin/BulletListEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { experienceSchema, type ExperienceFormData } from "@/lib/validations/experience";

export default function ExperienceFormPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors, isSubmitting } } =
    useForm<ExperienceFormData>({
      resolver: zodResolver(experienceSchema) as never,
      defaultValues: { company: "", role: "", startDate: "", endDate: "", current: false, description: "", bullets: [], logoUrl: "", order: 0 },
    });

  const current = watch("current");

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/experience/${id}`)
        .then((r) => r.json())
        .then(({ data }) => {
          if (data) {
            reset({
              ...data,
              startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 10) : "",
              endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 10) : "",
            });
          }
        });
    }
  }, [id, isNew, reset]);

  async function onSubmit(data: ExperienceFormData) {
    const url = isNew ? "/api/admin/experience" : `/api/admin/experience/${id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, endDate: data.current ? undefined : data.endDate }),
    });
    if (res.ok) {
      toast.success(isNew ? "Entry created" : "Entry saved");
      router.push("/admin/experience");
      router.refresh();
    } else {
      toast.error("Failed to save");
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title={isNew ? "New Experience" : "Edit Experience"} />
      <main className="flex-1 p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="company">Company *</Label>
              <Input id="company" {...register("company")} />
              {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Role *</Label>
              <Input id="role" {...register("role")} />
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...register("endDate")} disabled={current} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="current"
              checked={current}
              onCheckedChange={(v) => {
                setValue("current", v);
                if (v) setValue("endDate", "");
              }}
            />
            <Label htmlFor="current">Currently working here</Label>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>

          <div className="space-y-1.5">
            <Label>Bullet Points</Label>
            <Controller
              name="bullets"
              control={control}
              render={({ field }) => (
                <BulletListEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <Controller
            name="logoUrl"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ImageUpload label="Company Logo" value={field.value ?? ""} onChange={field.onChange} />
            )}
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isNew ? "Create Entry" : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
