import { z } from "zod";

const optionalUrl = z.union([z.string().url("Must be a valid URL"), z.literal("")]).optional();

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: optionalUrl,
  techStack: z.array(z.string()),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  featured: z.boolean(),
  order: z.number().int(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
