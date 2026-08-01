"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryUploadFieldProps {
  value?: string[];
  onChange: (value: string[]) => void;
  folder?: string;
}

interface UploadResponse {
  url?: string;
  secure_url?: string;
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

export function GalleryUploadField({
  value = [],
  onChange,
  folder = "abscimustafa/products",
}: GalleryUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    setError(null);

    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadImage(file, folder));
      }
      onChange([...value, ...uploaded]);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Görsel yüklenemedi"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="w-full"
      >
        <ImagePlus className="h-4 w-4" />
        {isUploading ? "Yükleniyor..." : "Galeri Görseli Ekle"}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(event) => {
          const files = event.target.files;
          if (files?.length) void handleUpload(files);
          event.target.value = "";
        }}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative overflow-hidden rounded-lg border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Galeri ${index + 1}`}
                className="h-24 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                aria-label="Görseli kaldır"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
