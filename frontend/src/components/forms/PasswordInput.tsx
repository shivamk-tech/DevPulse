"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input, type InputProps } from "@/components/ui";

export function PasswordInput(props: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      type={showPassword ? "text" : "password"}
      rightSection={
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          // `text-muted-foreground` resolves to a fairly bright grey, which put
          // the toggle brighter than the placeholder beside it and made it the
          // loudest thing in a resting field. Matched to the placeholder at
          // rest, lifting to near-white on hover so it's clearly interactive.
          className="flex h-full items-center justify-center leading-none text-white/30 transition-colors hover:text-white/80"
        >
          {showPassword ? (
            <EyeOff className="size-4 shrink-0" />
          ) : (
            <Eye className="size-4 shrink-0" />
          )}
        </button>
      }
    />
  );
}
