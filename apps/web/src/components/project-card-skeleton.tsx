import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex gap-4">
                {/* Image Skeleton */}
                <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />

                {/* Content */}
                <div className="flex-1">
                    {/* Status Badge */}
                    <Skeleton className="h-6 w-24 rounded-full mb-2" />

                    {/* Title */}
                    <Skeleton className="h-5 w-3/4 mb-1" />

                    {/* Order ID */}
                    <Skeleton className="h-3 w-32 mb-3" />

                    {/* Meta Info */}
                    <div className="flex gap-4 mb-3">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>

                    {/* ETA */}
                    <Skeleton className="h-3 w-28" />
                </div>
            </div>

            {/* Technician */}
            <div className="mt-4 flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1">
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="w-9 h-9 rounded-full" />
            </div>

            {/* Notes */}
            <Skeleton className="h-12 w-full rounded-xl mt-3" />

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-10 w-32 rounded-full" />
            </div>
        </div>
    );
}

export function ProjectCardSkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
            ))}
        </div>
    );
}
