import { Button } from "@/components/ui/button";
import { Download, Apple, PlayCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TROJAN_GOLD = "#FFC107";
const TROJAN_NAVY = "#0F1B4D";

interface DownloadAppButtonProps {
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    showIcon?: boolean;
    className?: string;
}

export function DownloadAppButton({
    variant = "default",
    size = "default",
    showIcon = true,
    className,
}: DownloadAppButtonProps) {
    const handleDownload = (platform: "ios" | "android") => {
        // In real app, these would be actual App Store/Play Store links
        if (platform === "ios") {
            window.open("https://apps.apple.com/app/trojan-projects", "_blank");
        } else {
            window.open("https://play.google.com/store/apps/details?id=com.trojanprojects", "_blank");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    className={className}
                    style={
                        variant === "default"
                            ? { backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }
                            : undefined
                    }
                >
                    {showIcon && <Download className="mr-2 h-4 w-4" />}
                    Download App
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleDownload("ios")}>
                    <Apple className="mr-2 h-4 w-4" />
                    Download for iOS
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload("android")}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Download for Android
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
