// components/dashboard/top-navbar.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Bell, Sun, Moon, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";

interface TopNavbarProps {
  userName?: string;
  userAvatarUrl?: string;
}

export function TopNavbar({
  userName = "Shivam",
  userAvatarUrl,
}: TopNavbarProps) {
  const [isDark, setIsDark] = useState(true);

  return (
    <header className="flex h-[68px] items-center justify-between border-b border-white/10 bg-[#0B0B0F] px-6">
      {/* Search */}
      <div className="flex max-w-md flex-1 items-center">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search monitors, incidents, docs..."
            className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 pr-14 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none transition-colors focus:border-white/20 focus:bg-white/[0.05]"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] font-medium text-zinc-500">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="text-zinc-400 hover:text-zinc-200"
        >
          <Bell className="h-[18px] w-[18px]" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setIsDark((prev) => !prev)}
          className="text-zinc-400 hover:text-zinc-200"
        >
          {isDark ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-white/5"
            >
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-zinc-700">
                {userAvatarUrl ? (
                  <Image
                    src={userAvatarUrl}
                    alt={userName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-300">
                    {userName.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-zinc-200">
                {userName}
              </span>
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Workspace settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}