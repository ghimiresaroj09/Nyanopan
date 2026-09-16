import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="container-page py-6">
      <Skeleton className="h-4 w-56" />
      <div className="mt-6 grid gap-10 pb-16 lg:grid-cols-2 lg:gap-14">
        <Skeleton className="aspect-square w-full rounded-md" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-24" />
          <div className="flex gap-2 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-14 rounded-md" />
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 pt-2 sm:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}
