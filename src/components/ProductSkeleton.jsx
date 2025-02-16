export function ProductSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded w-2/3" />
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-muted rounded w-24" />
          <div className="h-8 bg-muted rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export function ProductSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
} 