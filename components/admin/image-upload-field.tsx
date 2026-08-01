"use client";

import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadFieldProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface UploadResponse {
  url?: string;
  secure_url?: string;
  public_id?: string;
  width?: number;
  height?: number;
  error?: string;
}

async function uploadImage(file: File, folder?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as UploadResponse;

  const imageUrl = data.secure_url || data.url;

  if (!response.ok || !imageUrl) {
    throw new Error(data.error || "Görsel yüklenemedi");
  }

  return imageUrl;
}

export function ImageUploadField({
  value = "",
  onChange,
  placeholder = "https://res.cloudinary.com/.../gorsel.jpg",
  folder,
}: ImageUploadFieldProps & { folder?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Görsel yüklenemedi"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          className="shrink-0"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="h-4 w-4" />
          {isUploading ? "..." : "Yükle"}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleUpload(file);
          event.target.value = "";
        }}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {value && (
        <div className="overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Önizleme" className="h-32 w-full object-cover" />
        </div>
      )}
    </div>
  );
}
