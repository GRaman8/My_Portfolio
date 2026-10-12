import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export { buttonVariants } from "@/components/ui/button"

export function formatDateRange(
  startDate: Date,
  endDate: Date | null,
  current: boolean,
  locale: string = "en-US",
  presentLabel: string = "Present"
): string {
  const start = startDate.toLocaleDateString(locale, {
    month: "short",
    year: "numeric",
  })
  if (current) return `${start} — ${presentLabel}`
  if (!endDate) return start
  const end = endDate.toLocaleDateString(locale, {
    month: "short",
    year: "numeric",
  })
  return `${start} — ${end}`
}

export function formatDate(date: Date, locale: string = "en-US"): string {
  return date.toLocaleDateString(locale, { month: "short", year: "numeric" })
}
