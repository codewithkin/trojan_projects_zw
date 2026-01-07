import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { useSession } from "@/hooks/use-session";
import { hasAdminAccess } from "@/config/admins";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function UserMenu() {
  const router = useRouter();
  const { user, isPending } = useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="outline">Sign In</Button>
        </Link>
        <Link href="/signup">
          <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
            Create Account
          </Button>
        </Link>
      </div>
    );
  }

  const isAdmin = hasAdminAccess(user);

  return (
    <div className="flex items-center gap-3">
      {isAdmin && (
        <Link href="/dashboard">
          <Button style={{ backgroundColor: TROJAN_NAVY, color: "white" }}>
            Dashboard
          </Button>
        </Link>
      )}
      {!isAdmin && (
        <Link href="/catalog/new">
          <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
            Request Project
          </Button>
        </Link>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          {user.name}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{user.email}</DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
