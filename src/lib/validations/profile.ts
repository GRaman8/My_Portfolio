import { z } from "zod";

const optionalUrl = z.union([z.string().url("Must be a valid URL"), z.literal("")]).optional();
const optionalEmail = z.union([z.string().email("Must be a valid email"), z.literal("")]).optional();

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  headline: z.string().min(1, "Headline is required"),
  bio: z.string().min(1, "Bio is required"),
  avatarUrl: optionalUrl,
  resumeUrl: optionalUrl,
  location: z.string().optional(),
  email: optionalEmail,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  leetcodeUrl: optionalUrl,
  websiteUrl: optionalUrl,
});

export type ProfileFormData = z.infer<typeof profileSchema>;
