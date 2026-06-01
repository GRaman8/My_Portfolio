"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface BulletListEditorProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export default function BulletListEditor({
  value,
  onChange,
  placeholder = "Add a bullet point…",
}: BulletListEditorProps) {
  const [draft, setDraft] = useState("");

  function add() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <ul className="space-y-1">
        {value.map((bullet, i) => (
          <li key={i} className="flex items-start gap-2 group">
            <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="flex-1 text-sm text-foreground">{bullet}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive mt-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
