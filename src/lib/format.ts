export function formatTnd(value: number) {
  return new Intl.NumberFormat("en-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 3,
  }).format(value);
}
