import { z } from "zod";

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  order: z.number().int(),
});

export type EducationFormData = z.infer<typeof educationSchema>;
