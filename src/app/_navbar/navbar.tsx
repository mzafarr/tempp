// "use client";
import React, { Suspense } from "react";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import {
  CircleUser,
  CircleUserRound,
  CircleUserRoundIcon,
  LayoutDashboard,
  Settings2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { SignOutItem } from "./signout";
import Logo from "@/components/logo";
import ThemeSwitch from "../_components/ThemeSwitch";

async function Navbar() {
  // const router = useRouter();
  const user = await getCurrentUser();
  const isSignedIn = !!user;

  return (
    <div className="flex justify-between items-center border-b dark:border-gray-600 py-2 px-8 z-10">
      {/* <Logo /> */}
      <h2 className="font-bold tracking-tighter text-2xl underline decoration-primary underline-offset-4 decoration-dashed">IBEELOGISTICS</h2>
      {isSignedIn ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Suspense
                fallback={
                  <div className="outline-none ring-0 ring-offset-0 border-none  bg-gray-800 rounded-full h-10 w-10 shrink-0 flex items-center justify-center">
                    ..
                  </div>
                }
              >
                <CircleUser className="focus:outline-none focus:ring-0 w-10 h-10" />
              </Suspense>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-2">
              <DropdownMenuItem asChild>
                <Link
                  href="/chat"
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" /> Chat Page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                {/* <Link
                  href="/dashboard/settings"
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <Settings2Icon className="w-4 h-4" /> Settings
                </Link> */}
              </DropdownMenuItem>
              <SignOutItem />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <Button
            className="border px-6"
            asChild
            variant="secondary"
          >
            <Link href="/sign-in/email">Sign In</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
