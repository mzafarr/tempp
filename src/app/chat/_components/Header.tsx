import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  CircleUser,
  CreditCardIcon,
  HomeIcon,
  MessageSquare,
} from "lucide-react";
import ThemeSwitch from "@/app/_components/ThemeSwitch";
import { SignOutItem } from "@/app/_navbar/signout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 p-4 flex justify-between items-center border-b dark:border-gray-700">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onToggleSidebar}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
    </header>
  );
}
