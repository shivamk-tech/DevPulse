// components/dashboard/top-navbar.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, Search } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authService } from "@/services/auth/auth.service";

interface TopNavbarProps {
  userName?: string;
  userAvatarUrl?: string;
}

export function TopNavbar({ userName = "Shivam", userAvatarUrl }: TopNavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();

      router.replace("/login");
    } catch (error) {
      console.log("Logout failed : ", error);
    }
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/7 bg-[#0B0B0F] px-5">
      {/* Search — wider than the old 320px cap so the placeholder isn't clipped */}
      <div className="max-w-md flex-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search monitors, incidents, docs…"
            className="h-9 w-full rounded-lg border border-white/7 bg-white/3 pl-9 pr-14 text-[13px] text-white/90 outline-none transition-colors placeholder:text-white/25 focus:border-white/15 focus:bg-white/5"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/35">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Bell className="size-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-white/5"
            >
              <div className="relative size-7 shrink-0 overflow-hidden rounded-full bg-linear-to-b from-[#6366f1] to-[#4f46e5] ring-1 ring-inset ring-white/15">
                {userAvatarUrl ? (
                  <Image src={userAvatarUrl} alt={userName} fill className="object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center text-[11px] font-semibold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-[13px] font-medium text-white/80">{userName}</span>
              <ChevronDown className="size-3.5 text-white/30" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Workspace settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
