import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="bg-[#1e1e1e] text-[#f8f5ef]">
      <div className="mx-auto flex min-h-9 max-w-[1600px] items-center justify-center px-3 py-2 text-center text-[8px] font-medium uppercase leading-4 tracking-[0.18em] min-[390px]:px-4 min-[390px]:text-[9px] sm:px-8 lg:px-12">
        <Link href="/shipping" className="transition-opacity hover:opacity-75">
          FREE SHIPPING ON ORDERS $150+ <span className="px-2 text-white/45">|</span> FREE RETURNS
        </Link>
      </div>
    </div>
  );
}
