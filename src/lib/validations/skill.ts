import { z } from "zod";

export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Language",
  "Cloud",
  "Tools",
  "Other",
] as const;

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().min(1, "Category is required"),
  iconUrl: z.union([z.string().url("Must be a valid URL"), z.literal("")]).optional(),
  order: z.number().int(),
});

export type SkillFormData = z.infer<typeof skillSchema>;
