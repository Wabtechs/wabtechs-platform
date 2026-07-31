"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, File } from "lucide-react";

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
}

export function FileUpload({ value, onChange, accept = "image/*", label = "Image" }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value ?? "");

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        setPreview(data.url);
        onChange(data.url);
      }
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const isImage = preview?.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i);

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative inline-block">
          {isImage ? (
            <Image src={preview} alt="Preview" width={200} height={120} className="rounded-lg object-cover" />
          ) : preview.endsWith(".pdf") ? (
            <div className="flex h-24 w-32 items-center justify-center rounded-lg border bg-gray-50 dark:bg-muted">
              <File className="h-8 w-8 text-gray-400" />
            </div>
          ) : (
            <div className="flex h-24 w-32 items-center justify-center rounded-lg border bg-gray-50 dark:bg-muted">
              <File className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <button
            type="button"
            onClick={() => { setPreview(""); onChange(""); }}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-4 hover:border-primary hover:bg-primary/5 dark:border-gray-600 dark:bg-muted dark:hover:border-primary">
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <Upload className="h-6 w-6 text-gray-400" />
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {uploading ? "Upload en cours..." : `Cliquez pour uploader ${label}`}
            </span>
          </div>
          <input type="file" accept={accept} onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      )}
      {preview && (
        <p className="truncate text-[11px] text-gray-400">{preview}</p>
      )}
    </div>
  );
}
