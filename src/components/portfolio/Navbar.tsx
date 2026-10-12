"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn, buttonVariants } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const navLinks = [
  { href: "#about", key: "about" },
  { href: "#skills", key: "skills" },
  { href: "#education", key: "education" },
  { href: "#certifications", key: "certifications" },
  { href: "#experience", key: "experience" },
  { href: "#projects", key: "projects" },
  { href: "#contact", key: "contact" },
] as const;

interface NavbarProps {
  resumeUrl?: string | null;
}

export default function Navbar({ resumeUrl }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
      )}
    >
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="text-sm font-semibold text-foreground tracking-tight">
          Ganapathi
        </a>

        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, key }) => (
            <li key={href}>
              <a href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t(key)}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              {t("resume")}
            </a>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-6 pb-4">
          <ul className="flex flex-col gap-3">
            {navLinks.map(({ href, key }) => (
              <li key={href}>
                <a href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
                  {t(key)}
                </a>
              </li>
            ))}
            {resumeUrl && (
              <li>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary">
                  {t("resume")} ↗
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
