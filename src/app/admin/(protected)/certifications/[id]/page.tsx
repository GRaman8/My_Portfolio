"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { certificationSchema, type CertificationFormData } from "@/lib/validations/certification";

export default function CertificationFormPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } =
    useForm<CertificationFormData>({
      resolver: zodResolver(certificationSchema) as unknown as import("react-hook-form").Resolver<CertificationFormData>,
      defaultValues: {
        title: "",
        provider: "",
        issuedDate: "",
        expiresDate: "",
        credentialId: "",
        credentialUrl: "",
        imageUrl: "",
        order: 0,
      },
    });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/certifications/${id}`)
        .then((r) => r.json())
        .then(({ data }) => {
          if (data) {
            reset({
              ...data,
              issuedDate: data.issuedDate ? new Date(data.issuedDate).toISOString().slice(0, 10) : "",
              expiresDate: data.expiresDate ? new Date(data.expiresDate).toISOString().slice(0, 10) : "",
              credentialId: data.credentialId ?? "",
              credentialUrl: data.credentialUrl ?? "",
              imageUrl: data.imageUrl ?? "",
            });
          }
        });
    }
  }, [id, isNew, reset]);

  async function onSubmit(data: CertificationFormData) {
    const url = isNew ? "/api/admin/certifications" : `/api/admin/certifications/${id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success(isNew ? "Certification created" : "Certification saved");
      router.push("/admin/certifications");
      router.refresh();
    } else {
      toast.error("Failed to save");
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title={isNew ? "New Certification" : "Edit Certification"} />
      <main className="flex-1 p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Certification Name *</Label>
              <Input id="title" {...register("title")} placeholder="AWS Certified Developer" />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="provider">Provider *</Label>
              <Input id="provider" {...register("provider")} placeholder="Amazon Web Services" />
              {errors.provider && <p className="text-xs text-destructive">{errors.provider.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="issuedDate">Issued Date</Label>
              <Input id="issuedDate" type="date" {...register("issuedDate")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expiresDate">Expiry Date</Label>
              <Input id="expiresDate" type="date" {...register("expiresDate")} />
              <p className="text-xs text-muted-foreground">Leave blank if it does not expire.</p>
            </div>
          </div>

          <Separator />
          <p className="text-sm font-medium text-muted-foreground">Credential Details</p>

          <div className="space-y-1.5">
            <Label htmlFor="credentialId">Credential ID</Label>
            <Input id="credentialId" {...register("credentialId")} placeholder="ABC-123456" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="credentialUrl">Credential URL</Label>
            <Input
              id="credentialUrl"
              {...register("credentialUrl")}
              placeholder="https://credly.com/badges/… or PDF link"
            />
            <p className="text-xs text-muted-foreground">Credly, LinkedIn, or any PDF/verification link.</p>
            {errors.credentialUrl && <p className="text-xs text-destructive">{errors.credentialUrl.message}</p>}
          </div>

          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <ImageUpload label="Badge / Certificate Image" value={field.value ?? ""} onChange={field.onChange} />
            )}
          />

          <div className="space-y-1.5">
            <Label htmlFor="order">Display Order</Label>
            <Input id="order" type="number" {...register("order", { valueAsNumber: true })} className="w-24" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isNew ? "Create Certification" : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
