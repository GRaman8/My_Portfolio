"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-sidebar flex flex-col">
      <div className="p-6 border-b border-border">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Portfolio
        </span>
        <p className="text-xs text-muted-foreground mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          View Site
        </Link>
      </div>
    </aside>
  );
}
