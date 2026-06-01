"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TechStackInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function TechStackInput({ value, onChange }: TechStackInputProps) {
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const items = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const deduped = [...new Set([...value, ...items])];
    onChange(deduped);
    setDraft("");
  }

  function remove(item: string) {
    onChange(value.filter((v) => v !== item));
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-8">
        {value.map((tech) => (
          <Badge key={tech} variant="secondary" className="gap-1 pr-1">
            {tech}
            <button
              type="button"
              onClick={() => remove(tech)}
              className="hover:text-destructive transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Type a tech name and press Enter or comma…"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add(draft);
          }
        }}
        onBlur={() => draft.trim() && add(draft)}
      />
      <p className="text-xs text-muted-foreground">Press Enter or comma to add. Click × to remove.</p>
    </div>
  );
}
