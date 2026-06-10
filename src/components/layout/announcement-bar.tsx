import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="bg-black text-white">
      <div className="mx-auto flex min-h-9 max-w-[1600px] items-center justify-center gap-4 px-3 py-2 text-center text-[8px] font-medium uppercase leading-4 tracking-[0.12em] min-[390px]:px-4 min-[390px]:text-[9px] min-[390px]:tracking-[0.16em] sm:justify-between sm:px-8 sm:text-left lg:px-12">
        <Link href="/shipping" className="group flex items-center justify-center gap-2 min-[390px]:gap-3">
          <span className="hidden size-1 shrink-0 bg-white min-[390px]:block" aria-hidden />
          Complimentary delivery and easy returns on orders over 250 TND
          <span className="hidden transition-transform group-hover:translate-x-1 sm:inline" aria-hidden>→</span>
        </Link>
        <Link href="/contact" className="hidden border-b border-white/45 pb-px transition-colors hover:border-white sm:block">
          Client support
        </Link>
      </div>
    </div>
  );
}
