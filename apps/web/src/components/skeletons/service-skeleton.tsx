import { Skeleton } from "@/components/ui/skeleton";

export function ServiceCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Image Skeleton */}
            <div className="relative aspect-square overflow-hidden">
                <Skeleton className="w-full h-full" />
                {/* Wishlist button placeholder */}
                <div className="absolute top-3 right-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                </div>
                {/* Category badge placeholder */}
                <div className="absolute bottom-3 left-3">
                    <Skeleton className="w-16 h-6 rounded-full" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <Skeleton className="h-5 w-3/4" />
                {/* Rating */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                </div>
                {/* Price */}
                <Skeleton className="h-6 w-1/2" />
                {/* Button */}
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
        </div>
    );
}

export function ServicesGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
            ))}
        </div>
    );
}
