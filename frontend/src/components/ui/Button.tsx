import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Spinner } from "./Spinner";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    [
        "inline-flex",
        "items-center",
        "justify-center",
        "gap-2",
        "rounded-lg",
        "font-medium",
        "transition-colors",
        "duration-200",
        "cursor-pointer",
        "select-none",
        "whitespace-nowrap",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "disabled:pointer-events-none",
        "disabled:opacity-50",
    ],
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:opacity-90",

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
                sm: "h-9 px-3 text-sm",

                md: "h-10 px-4",

                lg: "h-11 px-8",

                icon: "h-10 w-10 p-0",
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