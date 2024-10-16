"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOutAction } from "./actions";

export function SignOutItem() {
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onSelect={async () => {
        signOutAction().then(() => {});
      }}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </DropdownMenuItem>
  );
}
