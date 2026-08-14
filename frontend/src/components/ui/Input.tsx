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
          "flex h-9 w-full items-center rounded-lg border bg-input transition-colors",
          "border-border",
          // Focus is a slightly brighter border, not a ring. A 2px ring reads
          // as a coloured halo around the field; brightening the edge says the
          // same thing in grey and doesn't change the field's footprint.
          "focus-within:border-white/35",
          error && "border-destructive focus-within:border-destructive",
          disabled && "cursor-not-allowed opacity-50",
          // The caller's classes land on the *shell*, so a passed background or
          // border colours the whole field — icon strips included. Previously
          // they only reached the inner <input>, which left the left/right
          // sections showing the default `bg-input` and reading as lighter
          // patches at each end.
          className
        )}
      >
        {leftSection && (
          <div className="flex h-full shrink-0 items-center pl-3 text-muted-foreground">
            {leftSection}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={cn(
            "min-w-0 flex-1 px-3 py-2",
            "text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "outline-none",
            leftSection && "pl-2",
            rightSection && "pr-2",
            // Still applied here so `placeholder:` and text utilities reach the
            // element they need to…
            className,
            // …but the background is forced transparent last, so the shell owns
            // it and the caller's colour isn't painted twice.
            "bg-transparent"
          )}
          {...props}
        />

        {rightSection && (
          <div className="flex h-full shrink-0 items-center pr-3 text-muted-foreground">
            {rightSection}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };