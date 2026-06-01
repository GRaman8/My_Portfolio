import { z } from "zod";

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
  bullets: z.array(z.string()),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  order: z.number().int(),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;
