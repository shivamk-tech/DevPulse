"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Moon, Search, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  userName?: string;
  userAvatarUrl?: string;
}

const MENU_ITEMS = [
  { label: "Profile", value: "profile" },
  { label: "Workspace settings", value: "workspace-settings" },
  { label: "Log out", value: "logout", destructive: true },
];

function UserMenu({ userName, userAvatarUrl }: TopNavbarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left transition-colors duration-200 hover:border-white/20 hover:bg-white/10"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-800">
          {userAvatarUrl ? (
            <Image src={userAvatarUrl} alt={userName ?? "User avatar"} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-zinc-200">
              {userName?.charAt(0) ?? "U"}
            </div>
          )}
        </div>

        <div className="hidden min-w-0 flex-col sm:flex">
          <span className="truncate text-sm font-medium text-white">{userName}</span>
          <span className="text-xs text-zinc-500">Admin</span>
        </div>

        <ChevronDown className="h-4 w-4 text-zinc-400" />
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0F] shadow-2xl shadow-black/25">
          <div className="flex flex-col p-2">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={cn(
                  "w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors duration-150 hover:bg-white/5",
                  item.destructive ? "text-destructive hover:bg-destructive/10" : "text-zinc-200"
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function TopNavbar({ userName = "Shivam", userAvatarUrl }: TopNavbarProps) {
  const [isDark, setIsDark] = useState(true);

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-white/10 bg-[#0B0B0F] px-6">
      <div className="flex flex-1">
        <Input
          type="search"
          placeholder="Search monitors, incidents, docs..."
          leftSection={<Search className="h-4 w-4 text-zinc-500" />}
          rightSection={
            <span className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-zinc-500">⌘K</span>
          }
          className="max-w-[540px]"
        />
      </div>

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
          onClick={() => setIsDark((current) => !current)}
          className="text-zinc-400 hover:text-zinc-200"
        >
          {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </Button>

        <UserMenu userName={userName} userAvatarUrl={userAvatarUrl} />
      </div>
    </header>
  );
}
