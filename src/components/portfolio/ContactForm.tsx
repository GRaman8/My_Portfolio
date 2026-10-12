"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";
import { Send } from "lucide-react";

export default function ContactForm() {
  const t = useTranslations("contact");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactFormData) {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success(t("success"));
      reset();
    } else if (res.status === 429) {
      toast.error(t("rateLimit"));
    } else {
      toast.error(t("error"));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name">{t("name")}</Label>
          <Input
            id="contact-name"
            {...register("name")}
            placeholder={t("namePlaceholder")}
            className="bg-card"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-email">{t("email")}</Label>
          <Input
            id="contact-email"
            type="email"
            {...register("email")}
            placeholder={t("emailPlaceholder")}
            className="bg-card"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-message">{t("message")}</Label>
        <Textarea
          id="contact-message"
          {...register("message")}
          rows={5}
          placeholder={t("messagePlaceholder")}
          className="bg-card resize-none"
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="gap-2">
        <Send className="w-4 h-4" />
        {isSubmitting ? t("sending") : t("send")}
      </Button>
    </form>
  );
}
