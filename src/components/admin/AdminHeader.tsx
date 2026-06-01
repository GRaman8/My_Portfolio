"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <h1 className="font-semibold text-foreground">{title}</h1>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="text-muted-foreground hover:text-foreground gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </header>
  );
}
