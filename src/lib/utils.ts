import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export { buttonVariants } from "@/components/ui/button"

export function formatDateRange(
  startDate: Date,
  endDate: Date | null,
  current: boolean
): string {
  const start = startDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
  if (current) return `${start} — Present`
  if (!endDate) return start
  const end = endDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
  return `${start} — ${end}`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}
