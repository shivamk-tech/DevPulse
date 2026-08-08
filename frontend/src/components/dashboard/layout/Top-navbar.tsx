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
import { authService } from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";

interface TopNavbarProps {
  userName?: string;
  userAvatarUrl?: string;
}

export function TopNavbar({
  userName = "Shivam",
  userAvatarUrl,
}: TopNavbarProps) {
  const [isDark, setIsDark] = useState(true);

  const router = useRouter()

  const handleLogout = async () => {
    try {
        await authService.logout();

        router.replace("/login");
    }catch(error){
        console.log("Logout failed : ",error);
    }
  }

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 bg-[#0B0B0F] px-4">
      <div className="flex max-w-xs flex-1 items-center">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search monitors, incidents, docs..."
            className="h-[30px] w-full rounded-md border border-white/10 bg-white/[0.03] pl-8 pr-11 text-[12.5px] font-light text-zinc-200 placeholder:text-zinc-500 outline-none transition-colors focus:border-white/20 focus:bg-white/[0.05]"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[10px] font-light text-zinc-500">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="h-[30px] w-[30px] text-zinc-400 hover:text-zinc-200"
        >
          <Bell className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setIsDark((prev) => !prev)}
          className="h-[30px] w-[30px] text-zinc-400 hover:text-zinc-200"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md py-1 pl-1 pr-1.5 transition-colors hover:bg-white/5"
            >
              <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-zinc-700">
                {userAvatarUrl ? (
                  <Image
                    src={userAvatarUrl}
                    alt={userName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] font-normal text-zinc-300">
                    {userName.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-[12.5px] font-light text-zinc-200">
                {userName}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem className="font-light">Profile</DropdownMenuItem>
            <DropdownMenuItem className="font-light">
              Workspace settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="font-light text-destructive" onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}