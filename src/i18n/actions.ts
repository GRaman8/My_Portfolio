"use server";

import { cookies } from "next/headers";
import { locales, defaultLocale, type Locale } from "./config";

export async function setLocale(locale: string) {
  const valid: Locale = (locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : defaultLocale;
  const store = await cookies();
  store.set("NEXT_LOCALE", valid, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}
