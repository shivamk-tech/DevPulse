import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      error = false,
      leftSection,
      rightSection,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "flex h-10 w-full items-center rounded-lg border bg-input transition-colors",
          "border-border",
          "focus-within:ring-2 focus-within:ring-ring",
          error && "border-destructive focus-within:ring-destructive",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {leftSection && (
          <div className="flex items-center pl-3 text-muted-foreground">
            {leftSection}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={cn(
            "flex-1 bg-transparent px-3 py-2",
            "text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "outline-none",
            leftSection && "pl-2",
            rightSection && "pr-2",
            className
          )}
          {...props}
        />

        {rightSection && (
          <div className="flex items-center pr-3 text-muted-foreground">
            {rightSection}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };