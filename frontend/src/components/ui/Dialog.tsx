"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Beacon's modal surface, built on Base UI's Dialog (same library as the
 * existing dropdown-menu, so focus trapping, scroll locking, and Escape
 * handling behave identically across the app).
 *
 * The dashboard is a single flat black surface, so depth here comes from the
 * border and shadow rather than from a lighter fill — plus a hairline along the
 * top edge to catch the eye where the panel begins.
 */
function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & { showCloseButton?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        className={cn(
          "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm",
          // Backdrop fades slightly slower than the panel moves, so the panel
          // reads as arriving rather than the screen simply dimming.
          "ease-[cubic-bezier(0.22,1,0.36,1)] data-open:duration-200 data-closed:duration-150",
          "data-open:animate-in data-open:fade-in-0",
          "data-closed:animate-out data-closed:fade-out-0"
        )}
      />

      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          // Responsive: full width minus a gutter on phones, capped on desktop.
          // dvh (not vh) so mobile browser chrome doesn't clip the footer.
          "w-[calc(100vw-2rem)] max-w-lg max-h-[calc(100dvh-4rem)]",
          "flex flex-col overflow-hidden rounded-2xl",
          "border border-white/10 bg-black shadow-2xl shadow-black/60 outline-none",
          "ease-[cubic-bezier(0.22,1,0.36,1)] data-open:duration-200 data-closed:duration-150",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-96 data-open:slide-in-from-bottom-2",
          "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-96",
          className
        )}
        {...props}
      >
        {/* Hairline along the top edge. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        {children}

        {showCloseButton && (
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shrink-0 border-b border-white/7 px-6 py-5 pr-14", className)}
      {...props}
    />
  );
}

/**
 * Scrollable middle section. `data-lenis-prevent` is required: Lenis owns the
 * window's wheel events, and without it this body cannot scroll on a short
 * viewport — the same failure the dashboard's <main> hits.
 */
function DialogBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-lenis-prevent
      className={cn("min-h-0 flex-1 overflow-y-auto px-6 py-5", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Actions stack full-width on phones so neither button gets cramped.
        "flex shrink-0 flex-col-reverse gap-2 border-t border-white/7 px-6 py-4 sm:flex-row sm:justify-end sm:gap-3",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      className={cn("text-base font-semibold tracking-tight text-white", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      className={cn("mt-1 text-xs leading-relaxed text-white/45", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
