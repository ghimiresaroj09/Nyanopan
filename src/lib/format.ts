/**
 * Formatting helpers. All prices are rendered in Rupees (Rs.)
 * formatted with Nepalese/South Asian comma groupings or standard decimals.
 */

const nprFormatter = new Intl.NumberFormat("en-NP", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return `Rs. ${nprFormatter.format(value)}`;
}

export function formatOrderNumber(n: number): string {
  return `NY-${String(n).padStart(6, "0")}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
