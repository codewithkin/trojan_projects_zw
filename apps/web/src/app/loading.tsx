const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                {/* Animated Logo/Spinner */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    {/* Outer spinning ring */}
                    <div
                        className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
                        style={{ borderColor: TROJAN_GOLD, borderTopColor: "transparent" }}
                    />
                    {/* Inner pulse */}
                    <div
                        className="absolute inset-3 rounded-full animate-pulse"
                        style={{ backgroundColor: `${TROJAN_NAVY}20` }}
                    />
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>T</span>
                    </div>
                </div>

                {/* Loading text */}
                <h2 className="text-xl font-semibold mb-2" style={{ color: TROJAN_NAVY }}>
                    Loading
                </h2>
                <p className="text-gray-500 text-sm">
                    Please wait a moment...
                </p>

                {/* Animated dots */}
                <div className="flex gap-1 justify-center mt-4">
                    <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                            backgroundColor: TROJAN_GOLD,
                            animationDelay: "0ms"
                        }}
                    />
                    <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                            backgroundColor: TROJAN_GOLD,
                            animationDelay: "150ms"
                        }}
                    />
                    <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                            backgroundColor: TROJAN_GOLD,
                            animationDelay: "300ms"
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
