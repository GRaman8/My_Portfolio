"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { profileSchema, type ProfileFormData } from "@/lib/validations/profile";

export default function ProfilePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as unknown as import("react-hook-form").Resolver<ProfileFormData>,
  });

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          reset({
            name: data.name ?? "",
            headline: data.headline ?? "",
            bio: data.bio ?? "",
            avatarUrl: data.avatarUrl ?? "",
            resumeUrl: data.resumeUrl ?? "",
            location: data.location ?? "",
            email: data.email ?? "",
            githubUrl: data.githubUrl ?? "",
            linkedinUrl: data.linkedinUrl ?? "",
            twitterUrl: data.twitterUrl ?? "",
            websiteUrl: data.websiteUrl ?? "",
          });
        }
      });
  }, [reset]);

  async function onSubmit(data: ProfileFormData) {
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success("Profile saved");
      router.refresh();
    } else {
      toast.error("Failed to save profile");
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title="Profile" />
      <main className="flex-1 p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} placeholder="City, Country" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="headline">Headline *</Label>
            <Input id="headline" {...register("headline")} placeholder="Full-Stack Developer" />
            {errors.headline && <p className="text-xs text-destructive">{errors.headline.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea id="bio" {...register("bio")} rows={5} placeholder="Tell your story…" />
            {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
          </div>

          <ImageUpload
            label="Avatar"
            value={watch("avatarUrl") ?? ""}
            onChange={(url) => setValue("avatarUrl", url)}
          />

          <div className="space-y-1.5">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input id="resumeUrl" {...register("resumeUrl")} placeholder="https://…/resume.pdf" />
          </div>

          <Separator />
          <p className="text-sm font-medium text-muted-foreground">Social Links</p>

          <div className="grid grid-cols-2 gap-4">
            {(["email", "githubUrl", "linkedinUrl", "twitterUrl", "websiteUrl"] as const).map(
              (field) => (
                <div key={field} className="space-y-1.5">
                  <Label htmlFor={field}>
                    {field.replace("Url", "").replace(/^\w/, (c) => c.toUpperCase())}
                  </Label>
                  <Input
                    id={field}
                    {...register(field)}
                    placeholder={field === "email" ? "you@example.com" : "https://…"}
                  />
                  {errors[field] && (
                    <p className="text-xs text-destructive">{errors[field]?.message}</p>
                  )}
                </div>
              )
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save Profile"}
          </Button>
        </form>
      </main>
    </div>
  );
}
