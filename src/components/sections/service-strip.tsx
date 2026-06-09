const services = [
  ["Delivery in Tunisia", "Reliable delivery across the country"],
  ["Easy returns", "14 days to reconsider your selection"],
  ["Secure checkout", "Payment connection coming soon"],
  ["Client support", "Thoughtful help when you need it"],
];

export function ServiceStrip() {
  return (
    <section aria-label="Store services" className="border-y border-border bg-off-white">
      <div className="page-shell grid sm:grid-cols-2 lg:grid-cols-4">
        {services.map(([title, description], index) => (
          <div
            key={title}
            className={`px-4 py-7 sm:px-6 lg:py-9 ${
              index > 0 ? "border-t border-border sm:border-l sm:border-t-0" : ""
            } ${index === 2 ? "sm:border-l-0 lg:border-l" : ""}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">{title}</p>
            <p className="mt-2 text-xs leading-5 text-charcoal/65">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
