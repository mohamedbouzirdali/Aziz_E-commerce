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
import {
  replaceHomepageItemImageAction,
  updateHomepageProductSelectionInlineAction,
  updateHomepageSectionInlineAction,
} from "@/app/admin/homepage/actions";
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
  sections: Record<string, InlineHomepageSection>;
  productChoices: InlineHomepageProductChoice[];
};

type InlineHomepageProductChoice = {
  id: string;
  slug: string;
  name: string;
  status: string;
};

type InlineHomepageSection = {
  id: string;
  sectionKey: string;
  type: string;
  eyebrow: string;
  heading: string;
  body: string;
  imageItemId: string | null;
  selectedProductIds: string[];
};

const AdminStorefrontContext = createContext<AdminStorefrontContextValue>({
  isAdmin: false,
  sectionIds: {},
  sections: {},
  productChoices: [],
});

export function AdminStorefrontControlsProvider({
  children,
  initialIsAdmin = false,
  initialSectionIds = {},
  initialSections = {},
  productChoices: initialProductChoices = [],
}: {
  children: ReactNode;
  initialIsAdmin?: boolean;
  initialSectionIds?: Record<string, string>;
  initialSections?: Record<string, InlineHomepageSection>;
  productChoices?: InlineHomepageProductChoice[];
}) {
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [sectionIds, setSectionIds] =
    useState<Record<string, string>>(initialSectionIds);
  const [sections, setSections] =
    useState<Record<string, InlineHomepageSection>>(initialSections);
  const [productChoices, setProductChoices] =
    useState<InlineHomepageProductChoice[]>(initialProductChoices);

  useEffect(() => {
    if (initialIsAdmin && Object.keys(initialSectionIds).length > 0) return;

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
        .select("id, section_key, section_type, eyebrow, heading, body");
      const { data: items } = await supabase
        .from("homepage_section_items")
        .select("id, section_id, product_id, box_id")
        .eq("is_visible", true)
        .order("position");
      const { data: products } = await supabase
        .from("products")
        .select("id, slug, name, status")
        .neq("status", "archived")
        .order("name");

      if (!active) return;
      const itemsBySection = new Map<string, NonNullable<typeof items>>();

      (items ?? []).forEach((item) => {
        itemsBySection.set(item.section_id, [
          ...(itemsBySection.get(item.section_id) ?? []),
          item,
        ]);
      });

      setIsAdmin(true);
      setSectionIds(
        Object.fromEntries(
          (sections ?? []).map((section) => [
            section.section_key,
            section.id,
          ]),
        ),
      );
      setSections(
        Object.fromEntries(
          (sections ?? []).map((section) => {
            const sectionItems = itemsBySection.get(section.id) ?? [];

            return [
              section.section_key,
              {
                id: section.id,
                sectionKey: section.section_key,
                type: section.section_type,
                eyebrow: section.eyebrow ?? "",
                heading: section.heading ?? "",
                body: section.body ?? "",
                imageItemId:
                  sectionItems.find((item) => !item.product_id && !item.box_id)
                    ?.id ?? null,
                selectedProductIds: sectionItems
                  .map((item) => item.product_id)
                  .filter((id): id is string => Boolean(id)),
              },
            ];
          }),
        ),
      );
      setProductChoices(
        (products ?? []).map((product) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          status: product.status,
        })),
      );
    }

    void loadAdminControls();

    return () => {
      active = false;
    };
  }, [initialIsAdmin, initialSectionIds]);

  const contextValue = useMemo(
    () => ({ isAdmin, sectionIds, sections, productChoices }),
    [isAdmin, sectionIds, sections, productChoices],
  );

  return (
    <AdminStorefrontContext.Provider value={contextValue}>
      {children}
      {isAdmin && (
        <Link
          href="/admin/homepage"
          className="fixed bottom-5 left-5 z-[70] border border-white/25 bg-black px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-colors hover:bg-charcoal"
        >
          Admin · Accueil
        </Link>
      )}
    </AdminStorefrontContext.Provider>
  );
}

export function AdminSectionEditLink({
  sectionKey,
  label = "Modifier cette section",
}: {
  sectionKey: string;
  label?: string;
}) {
  const { isAdmin, sections, productChoices } = useContext(AdminStorefrontContext);
  const section = sections[sectionKey];
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

  if (!isAdmin || !section) return null;

  function selectPreview(file: File | undefined) {
    setPreviewUrl(file && file.size > 0 ? URL.createObjectURL(file) : null);
    setMessage(null);
  }

  async function save(formData: FormData) {
    if (!section) return;
    setPending(true);
    setMessage(null);

    const result = await updateHomepageSectionInlineAction({
      id: section.id,
      eyebrow: String(formData.get("eyebrow") ?? "").trim(),
      heading: String(formData.get("heading") ?? "").trim(),
      body: String(formData.get("body") ?? "").trim(),
    });

    if (!result.ok) {
      setPending(false);
      setMessage(result.message);
      return;
    }

    if (section.type === "product_grid") {
      const productIds = formData
        .getAll("productIds")
        .filter((value): value is string => typeof value === "string");
      const productsResult = await updateHomepageProductSelectionInlineAction({
        sectionId: section.id,
        productIds,
      });

      if (!productsResult.ok) {
        setPending(false);
        setMessage(productsResult.message);
        return;
      }
    }

    const file = formData.get("file");

    if (section.imageItemId && file instanceof File && file.size > 0) {
      const altText = String(formData.get("altText") ?? "").trim();

      if (
        !allowedMimeTypes.has(file.type) ||
        file.size > maxFileSize ||
        altText.length < 3
      ) {
        setPending(false);
        setMessage(
          "Choisissez une image AVIF, JPEG, PNG ou WebP de moins de 10 Mio avec un texte alternatif clair.",
        );
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setPending(false);
        setMessage("Votre session admin a expiré. Reconnectez-vous avant l’import.");
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
        setMessage("L’image n’a pas pu être importée. Vérifiez vos droits puis réessayez.");
        return;
      }

      const imageResult = await replaceHomepageItemImageAction({
        itemId: section.imageItemId,
        objectPath,
        altText,
        width: dimensions.width,
        height: dimensions.height,
        mimeType: file.type,
        fileSizeBytes: file.size,
      });

      if (!imageResult.ok) {
        await supabase.storage.from("catalog-media").remove([objectPath]);
        setPending(false);
        setMessage(imageResult.message);
        return;
      }
    }

    setPending(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        ref={dialog.triggerRef}
        type="button"
        onClick={() => {
          setMessage(null);
          setOpen(true);
        }}
        className="absolute right-4 top-4 z-40 border border-white/20 bg-black px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition-colors hover:bg-charcoal focus-visible:outline-white sm:right-6 sm:top-6"
      >
        {label}
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
            <motion.button
              type="button"
              aria-label="Fermer l’éditeur de section"
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
              aria-labelledby={`homepage-section-${section.id}`}
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
                aria-label="Fermer l’éditeur de section"
                className="absolute right-4 top-4 flex size-10 items-center justify-center border border-border bg-white text-xl disabled:opacity-40"
              >
                ×
              </button>
              <p className="eyebrow">Section accueil</p>
              <h2
                id={`homepage-section-${section.id}`}
                className="mt-3 pr-12 font-serif text-4xl"
              >
                Modifier cette section
              </h2>
              <p className="mt-3 max-w-lg text-xs leading-5 text-charcoal">
                Modifiez le texte, l’image ou les produits directement depuis l’accueil.
              </p>

              <form ref={formRef} action={save} className="mt-7 grid gap-5" aria-busy={pending}>
                <div>
                  <label
                    htmlFor={`${section.id}-eyebrow`}
                    className="text-[9px] font-semibold uppercase tracking-[0.14em]"
                  >
                    Petit libellé
                  </label>
                  <input
                    id={`${section.id}-eyebrow`}
                    name="eyebrow"
                    defaultValue={section.eyebrow}
                    disabled={pending}
                    maxLength={120}
                    className="mt-2 min-h-12 w-full border border-border bg-white px-4 text-sm outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${section.id}-heading`}
                    className="text-[9px] font-semibold uppercase tracking-[0.14em]"
                  >
                    Titre
                  </label>
                  <input
                    id={`${section.id}-heading`}
                    name="heading"
                    defaultValue={section.heading}
                    disabled={pending}
                    maxLength={180}
                    className="mt-2 min-h-12 w-full border border-border bg-white px-4 text-sm outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${section.id}-body`}
                    className="text-[9px] font-semibold uppercase tracking-[0.14em]"
                  >
                    Texte
                  </label>
                  <textarea
                    id={`${section.id}-body`}
                    name="body"
                    defaultValue={section.body}
                    disabled={pending}
                    maxLength={700}
                    className="mt-2 min-h-32 w-full border border-border bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-black"
                  />
                </div>

                {section.imageItemId && (
                  <div className="border border-border bg-white p-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em]">
                      Image de section
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-[0.7fr_1.3fr]">
                      <div className="aspect-[4/5] overflow-hidden border border-border bg-off-white">
                        {previewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={previewUrl}
                            alt="Aperçu de l’image sélectionnée"
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center p-5 text-center text-[9px] uppercase tracking-[0.14em] text-charcoal/55">
                            Remplacement optionnel
                          </div>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor={`${section.id}-file`}
                          className="text-[9px] font-semibold uppercase tracking-[0.14em]"
                        >
                          Changer l’image
                        </label>
                        <input
                          id={`${section.id}-file`}
                          name="file"
                          type="file"
                          accept="image/avif,image/jpeg,image/png,image/webp"
                          disabled={pending}
                          onChange={(event) => selectPreview(event.target.files?.[0])}
                          className="mt-2 block min-h-12 w-full border border-border bg-off-white px-3 py-2 text-xs file:mr-3 file:border-0 file:bg-black file:px-3 file:py-2 file:text-[8px] file:font-semibold file:uppercase file:tracking-[0.12em] file:text-white"
                        />
                        <label
                          htmlFor={`${section.id}-alt`}
                          className="mt-4 block text-[9px] font-semibold uppercase tracking-[0.14em]"
                        >
                          Texte alternatif
                        </label>
                        <input
                          id={`${section.id}-alt`}
                          name="altText"
                          disabled={pending}
                          defaultValue={section.heading || section.sectionKey}
                          className="mt-2 min-h-12 w-full border border-border bg-off-white px-4 text-sm outline-none focus:border-black"
                        />
                        <p className="mt-3 text-xs leading-5 text-charcoal/70">
                          Laissez vide pour garder l’image actuelle. Maximum 10 Mio.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {section.type === "product_grid" && (
                  <div className="border border-border bg-white p-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em]">
                      Produits affichés dans cette section
                    </p>
                    <p className="mt-2 text-xs leading-5 text-charcoal/70">
                      Cochez les produits à mettre en avant. Les premiers
                      produits sélectionnés apparaissent sur l’accueil.
                    </p>
                    <div className="mt-4 grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                      {productChoices.map((product) => (
                        <label
                          key={product.id}
                          className="flex min-h-12 cursor-pointer items-center gap-3 border border-border bg-off-white px-3 py-2 text-xs transition-colors hover:border-black"
                        >
                          <input
                            type="checkbox"
                            name="productIds"
                            value={product.id}
                            defaultChecked={section.selectedProductIds.includes(product.id)}
                            disabled={pending}
                            className="size-4 accent-black"
                          />
                          <span className="min-w-0">
                            <span className="block truncate font-medium">
                              {product.name}
                            </span>
                            <span className="block truncate text-[10px] uppercase tracking-[0.12em] text-charcoal/55">
                              {product.status}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="min-h-6" aria-live="polite">
                  {pending ? (
                    <InlineLoader label="Enregistrement" size="sm" />
                  ) : message ? (
                    <p className="text-xs leading-5 text-red-800">{message}</p>
                  ) : (
                    <p className="text-xs leading-5 text-charcoal">
                      L’enregistrement applique le texte, l’image et les produits de cette section.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 min-[390px]:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={close}
                    disabled={pending}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    loading={pending}
                    loadingLabel="Enregistrement"
                    className="flex-1"
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
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
        "Choisissez une image AVIF, JPEG, PNG ou WebP de moins de 10 Mio avec un texte alternatif clair.",
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
      setMessage("Votre session admin a expiré. Reconnectez-vous avant l’import.");
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
      setMessage("L’image n’a pas pu être importée. Vérifiez vos droits puis réessayez.");
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
        Changer l’image
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
            <motion.button
              type="button"
              aria-label="Fermer l’éditeur d’image"
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
                aria-label="Fermer l’éditeur d’image"
                className="absolute right-4 top-4 flex size-10 items-center justify-center border border-border bg-white text-xl disabled:opacity-40"
              >
                ×
              </button>
              <p className="eyebrow">Image accueil</p>
              <h2
                id={`homepage-image-${editableItemId}`}
                className="mt-3 pr-12 font-serif text-4xl"
              >
                Changer cette image
              </h2>
              <p className="mt-3 max-w-lg text-xs leading-5 text-charcoal">
                Importez une image de remplacement pour “{label}”. L’emplacement
                se met à jour sans changer le texte ni l’ordre.
              </p>
              <div className="mt-4">
                <Link
                  href="/admin/homepage"
                  className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/70 underline underline-offset-4"
                >
                  Ouvrir le gestionnaire d’accueil
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
                      alt="Aperçu de l’image sélectionnée"
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center p-6 text-center text-[9px] uppercase tracking-[0.16em] text-charcoal/55">
                      Sélectionnez une image pour l’aperçu
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor={`homepage-file-${editableItemId}`}
                    className="text-[9px] font-semibold uppercase tracking-[0.14em]"
                  >
                    Image de remplacement
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
                    Texte alternatif
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
                      <InlineLoader label="Publication de l’image" size="sm" />
                    ) : message ? (
                      <p className="text-xs leading-5 text-red-800">{message}</p>
                    ) : (
                      <p className="text-xs leading-5 text-charcoal">
                        Maximum 10 Mio. Les images portrait fonctionnent mieux
                        sur la plupart des emplacements.
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
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      loading={pending}
                      loadingLabel="Publication"
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
