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
          className="flex h-full items-center justify-center leading-none text-muted-foreground transition-colors hover:text-foreground"
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
