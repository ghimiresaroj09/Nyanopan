import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/config/site";

interface FreeShippingProgressProps {
  subtotal: number;
  className?: string;
}

/**
 * Shows how far the cart is from the free shipping threshold.
 * Based on the real cart subtotal, nothing else.
 */
export function FreeShippingProgress({ subtotal, className }: FreeShippingProgressProps) {
  const threshold = siteConfig.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const percent = Math.min(100, (subtotal / threshold) * 100);

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-xs">
        {remaining > 0 ? (
          <p className="font-medium text-foreground">
            Add <span className="text-terracotta font-semibold">{formatPrice(remaining)}</span> for complimentary shipping
          </p>
        ) : (
          <p className="font-semibold text-primary">
            ✓ Your order qualifies for free EU shipping
          </p>
        )}
        <span className="text-[11px] font-mono text-muted-foreground">{Math.round(percent)}%</span>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border/80"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress towards free shipping"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-ochre to-terracotta transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
