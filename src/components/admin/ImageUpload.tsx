"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Link } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(!value || value.startsWith("http"));
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (res.ok) onChange(json.data.url);
      else alert(json.error ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setUrlMode(!urlMode)}
          className="text-xs text-muted-foreground gap-1"
        >
          <Link className="w-3 h-3" />
          {urlMode ? "Upload file" : "Use URL"}
        </Button>
      </div>

      {urlMode ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.png"
        />
      ) : (
        <div
          className={cn(
            "border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-primary/50",
            uploading && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {uploading ? "Uploading…" : "Drop image here or click to upload"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP up to 5MB</p>
        </div>
      )}

      {value && (
        <div className="relative inline-block">
          <Image
            src={value}
            alt="Preview"
            width={120}
            height={80}
            className="rounded-md object-cover border border-border"
            unoptimized={value.startsWith("http")}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
