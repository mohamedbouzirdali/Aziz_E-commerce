"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { replaceHomepageItemImageAction } from "@/app/admin/homepage/actions";
import { InlineLoader } from "@/components/loaders";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { useDialog } from "@/lib/use-dialog";

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

async function getImageDimensions(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dimensions;
  } catch {
    return { width: null, height: null };
  }
}

type AdminStorefrontContextValue = {
  isAdmin: boolean;
  sectionIds: Record<string, string>;
};

const AdminStorefrontContext = createContext<AdminStorefrontContextValue>({
  isAdmin: false,
  sectionIds: {},
});

export function AdminStorefrontControlsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [sectionIds, setSectionIds] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;

    async function loadAdminControls() {
      if (!hasSupabaseConfig()) return;

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !active) return;

      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!role || !active) return;

      const { data: sections } = await supabase
        .from("homepage_sections")
        .select("id, section_key");

      if (!active) return;

      setIsAdmin(true);
      setSectionIds(
        Object.fromEntries(
          (sections ?? []).map((section) => [
            section.section_key,
            section.id,
          ]),
        ),
      );
    }

    void loadAdminControls();

    return () => {
      active = false;
    };
  }, []);

  const contextValue = useMemo(
    () => ({ isAdmin, sectionIds }),
    [isAdmin, sectionIds],
  );

  return (
    <AdminStorefrontContext.Provider value={contextValue}>
      {children}
      {isAdmin && (
        <Link
          href="/admin/homepage"
          className="fixed bottom-5 left-5 z-[70] border border-white/25 bg-black px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-colors hover:bg-charcoal"
        >
          Admin · Homepage
        </Link>
      )}
    </AdminStorefrontContext.Provider>
  );
}

export function AdminSectionEditLink({
  sectionKey,
  label = "Edit section",
}: {
  sectionKey: string;
  label?: string;
}) {
  const { isAdmin, sectionIds } = useContext(AdminStorefrontContext);
  const sectionId = sectionIds[sectionKey];

  if (!isAdmin || !sectionId) return null;

  return (
    <Link
      href={`/admin/homepage/${sectionId}`}
      className="absolute right-4 top-4 z-40 border border-white/20 bg-black px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition-colors hover:bg-charcoal focus-visible:outline-white sm:right-6 sm:top-6"
    >
      {label}
    </Link>
  );
}

export function AdminEditableImage({
  itemId,
  label,
  children,
  className = "",
}: {
  itemId?: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const { isAdmin } = useContext(AdminStorefrontContext);
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const close = useCallback(() => {
    if (pending) return;
    formRef.current?.reset();
    setMessage(null);
    setPreviewUrl(null);
    setOpen(false);
  }, [pending]);
  const dialog = useDialog(open, close);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  if (!isAdmin || !itemId) return children;
  const editableItemId = itemId;

  function selectPreview(file: File | undefined) {
    setPreviewUrl(file && file.size > 0 ? URL.createObjectURL(file) : null);
    setMessage(null);
  }

  async function upload(formData: FormData) {
    const file = formData.get("file");
    const altText = String(formData.get("altText") ?? "").trim();

    setMessage(null);

    if (
      !(file instanceof File) ||
      file.size === 0 ||
      !allowedMimeTypes.has(file.type) ||
      file.size > maxFileSize ||
      altText.length < 3
    ) {
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
      setMessage("Your admin session expired. Sign in again before uploading.");
      return;
    }

    const objectPath = `catalog/${user.id}/${crypto.randomUUID()}.${
      extensions[file.type]
    }`;
    const dimensions = await getImageDimensions(file);
    const { error: uploadError } = await supabase.storage
      .from("catalog-media")
      .upload(objectPath, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      setPending(false);
      setMessage("The image could not be uploaded. Check your access and retry.");
      return;
    }

    const result = await replaceHomepageItemImageAction({
      itemId: editableItemId,
      objectPath,
      altText,
      width: dimensions.width,
      height: dimensions.height,
      mimeType: file.type,
      fileSizeBytes: file.size,
    });

    if (!result.ok) {
      await supabase.storage.from("catalog-media").remove([objectPath]);
      setPending(false);
      setMessage(result.message);
      return;
    }

    formRef.current?.reset();
    setPending(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <div className={`relative ${className}`}>
      {children}
      <button
        ref={dialog.triggerRef}
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setMessage(null);
          setOpen(true);
        }}
        className="absolute left-3 top-3 z-30 flex min-h-10 items-center gap-2 border border-white/25 bg-black/95 px-3.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_10px_28px_rgba(0,0,0,0.2)] transition-colors hover:bg-charcoal focus-visible:outline-white"
      >
        <span aria-hidden>+</span>
        Edit image
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
            <motion.button
              type="button"
              aria-label="Dismiss image editor"
              className="absolute inset-0 bg-black/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              ref={dialog.dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`homepage-image-${editableItemId}`}
              className="relative z-10 max-h-[100svh] w-full max-w-2xl overflow-y-auto bg-off-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-h-[92svh] sm:p-8"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
            >
              <button
                type="button"
                onClick={close}
                disabled={pending}
                aria-label="Close image editor"
                className="absolute right-4 top-4 flex size-10 items-center justify-center border border-border bg-white text-xl disabled:opacity-40"
              >
                ×
              </button>
              <p className="eyebrow">Homepage image</p>
              <h2
                id={`homepage-image-${editableItemId}`}
                className="mt-3 pr-12 font-serif text-4xl"
              >
                Change this image
              </h2>
              <p className="mt-3 max-w-lg text-xs leading-5 text-charcoal">
                Upload a replacement for “{label}”. The placement updates
                immediately without changing the surrounding text or order.
              </p>
              <div className="mt-4">
                <Link
                  href="/admin/homepage"
                  className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/70 underline underline-offset-4"
                >
                  Open homepage manager
                </Link>
              </div>

              <form
                ref={formRef}
                action={upload}
                className="mt-7 grid gap-6 sm:grid-cols-[0.75fr_1.25fr]"
                aria-busy={pending}
              >
                <div className="aspect-[4/5] overflow-hidden border border-border bg-stone-100">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Selected upload preview"
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center p-6 text-center text-[9px] uppercase tracking-[0.16em] text-charcoal/55">
                      Select an image to preview
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor={`homepage-file-${editableItemId}`}
                    className="text-[9px] font-semibold uppercase tracking-[0.14em]"
                  >
                    Replacement image
                  </label>
                  <input
                    id={`homepage-file-${editableItemId}`}
                    name="file"
                    type="file"
                    accept="image/avif,image/jpeg,image/png,image/webp"
                    required
                    disabled={pending}
                    onChange={(event) => selectPreview(event.target.files?.[0])}
                    className="mt-2 block min-h-12 w-full border border-border bg-white px-3 py-2 text-xs file:mr-3 file:border-0 file:bg-black file:px-3 file:py-2 file:text-[8px] file:font-semibold file:uppercase file:tracking-[0.12em] file:text-white"
                  />

                  <label
                    htmlFor={`homepage-alt-${editableItemId}`}
                    className="mt-5 text-[9px] font-semibold uppercase tracking-[0.14em]"
                  >
                    Accessible alt text
                  </label>
                  <input
                    id={`homepage-alt-${editableItemId}`}
                    name="altText"
                    required
                    minLength={3}
                    disabled={pending}
                    defaultValue={label}
                    className="mt-2 min-h-12 w-full border border-border bg-white px-4 text-sm outline-none focus:border-black"
                  />

                  <div className="mt-5 min-h-6" aria-live="polite">
                    {pending ? (
                      <InlineLoader label="Publishing image" size="sm" />
                    ) : message ? (
                      <p className="text-xs leading-5 text-red-800">{message}</p>
                    ) : (
                      <p className="text-xs leading-5 text-charcoal">
                        Maximum 10 MiB. Portrait images work best for most homepage
                        placements.
                      </p>
                    )}
                  </div>

                  <div className="mt-auto flex flex-col gap-3 pt-6 min-[390px]:flex-row">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={close}
                      disabled={pending}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={pending}
                      loadingLabel="Publishing"
                      className="flex-1"
                    >
                      Publish image
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
