import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionLoading() {
  return (
    <>
      <div className="border-b bg-muted/50">
        <div className="container-page py-12">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-4 h-4 w-96 max-w-full" />
        </div>
      </div>
      <div className="container-page grid grid-cols-2 gap-x-4 gap-y-8 py-10 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    </>
  );
}
