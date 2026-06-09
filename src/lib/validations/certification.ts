import { z } from "zod";

const optionalUrl = z.union([z.string().url("Must be a valid URL"), z.literal("")]).optional();

export const certificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  provider: z.string().min(1, "Provider is required"),
  issuedDate: z.string().optional(),
  expiresDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: optionalUrl,
  imageUrl: optionalUrl,
  order: z.number().int(),
});

export type CertificationFormData = z.infer<typeof certificationSchema>;
