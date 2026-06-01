"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { educationSchema, type EducationFormData } from "@/lib/validations/education";

export default function EducationFormPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<EducationFormData>({
      resolver: zodResolver(educationSchema) as never,
      defaultValues: { institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "", order: 0 },
    });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/education/${id}`)
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

  async function onSubmit(data: EducationFormData) {
    const url = isNew ? "/api/admin/education" : `/api/admin/education/${id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success(isNew ? "Entry created" : "Entry saved");
      router.push("/admin/education");
      router.refresh();
    } else {
      toast.error("Failed to save");
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title={isNew ? "New Education" : "Edit Education"} />
      <main className="flex-1 p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="institution">Institution *</Label>
            <Input id="institution" {...register("institution")} />
            {errors.institution && <p className="text-xs text-destructive">{errors.institution.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="degree">Degree *</Label>
              <Input id="degree" {...register("degree")} placeholder="B.S., M.S., etc." />
              {errors.degree && <p className="text-xs text-destructive">{errors.degree.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="field">Field of Study *</Label>
              <Input id="field" {...register("field")} placeholder="Computer Science" />
              {errors.field && <p className="text-xs text-destructive">{errors.field.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gpa">GPA</Label>
              <Input id="gpa" {...register("gpa")} placeholder="3.9/4.0" />
            </div>
          </div>
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
