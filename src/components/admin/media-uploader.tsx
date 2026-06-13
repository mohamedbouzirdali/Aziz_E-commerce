"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { registerMediaAssetAction } from "@/app/admin/media/actions";
import { InlineLoader } from "@/components/loaders/inline-loader";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const allowedMimeTypes = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const extensions: Record<string, string> = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const maxFileSize = 10 * 1024 * 1024;

async function getDimensions(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dimensions;
  } catch {
    return { width: null, height: null };
  }
}

export function MediaUploader() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function upload(formData: FormData) {
    const file = formData.get("file");
    const altText = String(formData.get("altText") ?? "").trim();

    setMessage(null);
    setIsError(false);

    if (
      !(file instanceof File) ||
      file.size === 0 ||
      !allowedMimeTypes.has(file.type) ||
      file.size > maxFileSize ||
      altText.length < 3
    ) {
      setIsError(true);
      setMessage(
        "Choose an AVIF, JPEG, PNG, or WebP under 10 MiB and add meaningful alt text.",
      );
      return;
    }

    setPending(true);
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setPending(false);
      setIsError(true);
      setMessage("Your session expired. Sign in again before uploading.");
      return;
    }

    const objectPath = `catalog/${user.id}/${crypto.randomUUID()}.${
      extensions[file.type]
    }`;
    const dimensions = await getDimensions(file);
    const { error: uploadError } = await supabase.storage
      .from("catalog-media")
      .upload(objectPath, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      setPending(false);
      setIsError(true);
      setMessage("The image could not be uploaded. Check your access and retry.");
      return;
    }

    const registration = await registerMediaAssetAction({
      objectPath,
      altText,
      width: dimensions.width,
      height: dimensions.height,
      mimeType: file.type,
      fileSizeBytes: file.size,
    });

    if (!registration.ok) {
      await supabase.storage.from("catalog-media").remove([objectPath]);
      setPending(false);
      setIsError(true);
      setMessage(registration.message);
      return;
    }

    formRef.current?.reset();
    setPending(false);
    setMessage("Image uploaded and registered.");
    router.refresh();
  }

  return (
    <form
      ref={formRef}
      action={upload}
      className="border border-border bg-white p-6 sm:p-8"
      aria-busy={pending}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr_auto] lg:items-end">
        <div>
          <label
            htmlFor="media-file"
            className="text-[9px] font-semibold uppercase tracking-[0.14em]"
          >
            Image file
          </label>
          <input
            id="media-file"
            name="file"
            type="file"
            accept="image/avif,image/jpeg,image/png,image/webp"
            required
            disabled={pending}
            className="mt-2 block min-h-12 w-full border border-border bg-off-white px-3 py-2 text-xs file:mr-4 file:border-0 file:bg-black file:px-4 file:py-2 file:text-[9px] file:font-semibold file:uppercase file:tracking-[0.14em] file:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="media-alt"
            className="text-[9px] font-semibold uppercase tracking-[0.14em]"
          >
            Accessible alt text
          </label>
          <input
            id="media-alt"
            name="altText"
            required
            minLength={3}
            disabled={pending}
            placeholder="Woman wearing a structured black blazer"
            className="mt-2 min-h-12 w-full border border-border px-4 text-sm outline-none focus:border-black"
          />
        </div>
        <Button
          type="submit"
          loading={pending}
          loadingLabel="Uploading"
          className="w-full lg:w-auto"
        >
          Upload image
        </Button>
      </div>

      <div className="mt-5 min-h-5" aria-live="polite">
        {pending ? (
          <InlineLoader label="Preparing asset" size="sm" />
        ) : message ? (
          <p className={`text-xs ${isError ? "text-red-800" : "text-charcoal"}`}>
            {message}
          </p>
        ) : (
          <p className="text-xs text-charcoal">
            Maximum 10 MiB. Alt text is required before the asset can be used.
          </p>
        )}
      </div>
    </form>
  );
}
