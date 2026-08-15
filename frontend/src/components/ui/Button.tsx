import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Spinner } from "./Spinner";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    [
        "inline-flex",
        "items-center",
        "font-mono",
        "justify-center",
        "gap-2",
        "rounded-lg",
        "font-medium",
        "transition-all",
        "duration-200",
        "ease-[cubic-bezier(0.22,1,0.36,1)]",
        "cursor-pointer",
        "select-none",
        "whitespace-nowrap",
        "active:scale-[0.98]",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "disabled:pointer-events-none",
        "disabled:opacity-50",
        "motion-reduce:transition-none",
        "motion-reduce:active:scale-100",
    ],
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:opacity-90",

                // Shiny indigo→violet gradient (matches auth + landing).
                // Two stacked backgrounds: a white top sheen over the brand
                // gradient — gives the glossy highlight without an overlay
                // element, so it never covers the label. Paired with an inset
                // ring for a bright edge and a soft glow shadow.
                gradient:
                    "text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_45%),linear-gradient(180deg,#6366f1,#4f46e5)] ring-1 ring-inset ring-white/15 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:brightness-110",

                // Primary action in the monochrome theme. On a near-black UI
                // white *is* the loudest colour available, so it needs no glow
                // or gradient to read as primary — flat white on black already
                // has more contrast than any accent could.
                white:
                    "bg-white text-black hover:bg-white/90 disabled:hover:bg-white",

                secondary:
                    "bg-muted text-foreground hover:bg-muted/80",

                outline:
                    "border border-border bg-background hover:bg-muted",

                ghost:
                    "hover:bg-muted",

                destructive:
                    "bg-destructive text-white hover:opacity-90",

                link:
                    "text-primary underline-offset-4 hover:underline",
            },

            size: {
                sm: "h-8 px-3 text-[11px]",

                md: "h-9 px-3.5 text-xs",

                lg: "h-10 px-6 text-[13px]",

                icon: "h-9 w-9 p-0",
            },
        },

        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    loading?: boolean;

    fullWidth?: boolean;

    leftSection?: React.ReactNode;

    rightSection?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,

            variant,

            size,

            loading = false,

            fullWidth = false,

            leftSection,

            rightSection,

            children,

            disabled,

            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                className={cn(
                    buttonVariants({ variant, size }),
                    fullWidth && "w-full",
                    className
                )}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <Spinner size="sm" />
                ) : (
                    leftSection
                )}

                {children}

                {!loading && rightSection}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };