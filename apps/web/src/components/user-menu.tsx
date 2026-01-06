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
import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
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

  return (
    <div className="flex items-center gap-3">
      <Link href="/projects/new">
        <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
          Request Project
        </Button>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          {session.user.name}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/");
                    },
                  },
                });
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
