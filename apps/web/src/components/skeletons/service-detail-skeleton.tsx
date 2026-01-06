import { Skeleton } from "@/components/ui/skeleton";

export function ServiceDetailSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb Skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="aspect-square w-full rounded-2xl" />
                        <div className="flex gap-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                            ))}
                        </div>
                    </div>

                    {/* Product Info Skeleton */}
                    <div className="space-y-6">
                        {/* Category Badge */}
                        <Skeleton className="h-6 w-20 rounded-full" />

                        {/* Title */}
                        <Skeleton className="h-10 w-3/4" />

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-5 w-5" />
                                ))}
                            </div>
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-32" />
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-1/3" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>

                        {/* Specifications */}
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-32" />
                            <div className="grid grid-cols-2 gap-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Skeleton className="h-12 flex-1 rounded-lg" />
                            <Skeleton className="h-12 w-12 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
