"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { cart } from "@/hooks/use-cart";
import { recentlyViewed } from "@/hooks/use-recently-viewed";
import { hydrateOrders } from "@/lib/orders";
import { wishlist } from "@/hooks/use-wishlist";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    cart.hydrate();
    recentlyViewed.hydrate();
    hydrateOrders();
    wishlist.hydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="bottom-right" closeButton />
    </QueryClientProvider>
  );
}
