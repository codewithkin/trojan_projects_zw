import { Skeleton } from "@/components/ui/skeleton";

export function ServiceCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* Image Skeleton */}
            <Skeleton className="h-64 w-full rounded-none" />

            {/* Content */}
            <div className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                </div>

                {/* Title */}
                <Skeleton className="h-6 w-3/4 mb-2" />

                {/* Description */}
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-4" />

                {/* Brands */}
                <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-12" />
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-6 w-24 mb-1" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-10 w-24 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function ServiceCardSkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
            ))}
        </>
    );
}
