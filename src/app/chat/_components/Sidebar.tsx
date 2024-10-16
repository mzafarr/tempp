import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trash2,
  MessageSquare,
  PanelRightClose,
  Settings,
  CircleUser,
  CreditCard as CreditCardIcon,
  Home as HomeIcon,
  Plus,
} from "lucide-react";
import { SignOutItem } from "@/app/_navbar/signout";
import ThemeSwitch from "@/app/_components/ThemeSwitch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Chat } from "@/db/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  isOpen: boolean;
  chats: Chat[];
  currentChatId: number | null;
  onToggle: () => void;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
  onNewChat: () => void;
}

export default function Sidebar({
  isOpen,
  chats,
  currentChatId,
  onToggle,
  onDelete,
  onSelect,
  onNewChat,
}: SidebarProps) {
  return (
    <TooltipProvider>
      <aside
        className={`max-h-screen bg-gray-800 text-white flex-shrink-0 flex flex-col ${
          isOpen ? "w-64" : "w-16"
        } border-r border-gray-600 transition-all duration-300`}
      >
        <div
          className={`p-4 flex items-center justify-between ${
            !isOpen && "flex-col"
          }`}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="text-white"
              >
                <PanelRightClose
                  className={`h-6 w-6 transform transition-transform ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isOpen ? "Collapse sidebar" : "Expand sidebar"}
            </TooltipContent>
          </Tooltip>
          {isOpen ? (
            <Button>
              <Plus className={`h-4 w-4`} />
              <span className={`ml-1`}>New Chat</span>
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNewChat}
                  className="text-black hover:text-black bg-primary hover:bg-primary/90 my-4"
                >
                  <Plus className={`h-6 w-6`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Chat</TooltipContent>
            </Tooltip>
          )}
        </div>
        <ScrollArea className="flex-grow">
          <nav className="mt-2">
            {chats?.map((conv: Chat) => (
              <Tooltip key={conv.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`border border-gray-600 group flex items-center px-4 pr-1 ${isOpen ? "py-1" : "py-3"} my-2 text-sm hover:bg-gray-700 rounded-lg mx-2 cursor-pointer ${
                      currentChatId === conv.id ? "bg-gray-700" : ""
                    }`}
                    onClick={() => onSelect(conv.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                    {isOpen && (
                      <span className="flex-grow truncate">{conv.title}</span>
                    )}
                    {isOpen && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{isOpen ? "" : conv.title}</TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </ScrollArea>
        <UserSettings isOpen={isOpen} />
      </aside>
    </TooltipProvider>
  );
}

const UserSettings = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`flex items-center px-4 py-4 gap-2 border-t border-gray-600 ${
        !isOpen && "flex-col"
      }`}
    >
      <ThemeSwitch />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`flex items-center font-semibold gap-2 px-4 py-2.5 rounded-lg ${
              isOpen ? "pr-5 border border-gray-400" : "p-2"
            }`}
          >
            <Settings className={`${isOpen ? "w-5 h-5" : "w-6 h-6"} `} />
            {isOpen && <span className="mr-1 text-[15px]">Settings</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="space-y-2">
          <DropdownMenuItem asChild>
            <Link href="/" className="flex gap-2 items-center cursor-pointer">
              <HomeIcon className="w-4 h-4" /> Home Page
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/" className="flex gap-2 items-center cursor-pointer">
              <CreditCardIcon className="w-4 h-4" /> Pricing
            </Link>
          </DropdownMenuItem>
          <SignOutItem />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
