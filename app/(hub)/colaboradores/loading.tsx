import { Skeleton } from "@/components/ui/skeleton";

export default function ColaboradoresLoading() {
  return (
    <div className="hub-page space-y-6">
      <Skeleton className="h-20 w-full max-w-xl" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-[var(--radius-card)] sm:h-[120px]" />
        ))}
      </div>
      <Skeleton className="h-96 w-full rounded-[var(--radius-card)]" />
    </div>
  );
}
