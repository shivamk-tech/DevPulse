"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Globe, Trash2 } from "lucide-react";

import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import type { Monitor } from "@/types/monitor";
import { cn } from "@/lib/utils";

interface DeleteMonitorDialogProps {
  monitor: Monitor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Perform the actual delete. Reject to keep the dialog open with an error. */
  onConfirm?: (monitor: Monitor) => Promise<void>;
}

export function DeleteMonitorDialog({
  monitor,
  open,
  onOpenChange,
  onConfirm,
}: DeleteMonitorDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(() => {
      setDeleting(false);
      setError(null);
    }, 200);
    return () => window.clearTimeout(timer);
  }, [open]);

  // The parent keeps `monitor` set while the dialog animates closed, so the
  // content never blanks mid-exit.
  const target = monitor;
  if (!target) return null;

  const host = target.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

  const handleConfirm = async () => {
    setError(null);
    setDeleting(true);
    try {
      if (onConfirm) await onConfirm(target);
      onOpenChange(false);
    } catch {
      setError("Couldn't delete the monitor. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !deleting && onOpenChange(next)}>
      <DialogContent className="max-w-sm" showCloseButton={!deleting}>
        <DialogHeader className="flex flex-row items-start gap-3">
          {/* Red is reserved for destruction in this app — the tile is the only
             place it appears at rest, so it reads as a warning, not a theme. */}
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[5px] border border-destructive/30 bg-destructive/10">
            <Trash2 className="size-3.5 text-destructive" />
          </span>
          <div className="min-w-0">
            <DialogTitle className="text-base">Delete monitor</DialogTitle>
            <DialogDescription className="text-xs">
              This permanently removes the monitor and stops all checks. It
              cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogBody>
          {/* Show exactly what dies — a confirm that names its target is a
             confirm that gets read. */}
          <div className="flex items-center gap-2.5 rounded-sm border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <span className="grid size-6 shrink-0 place-items-center rounded-[5px] border border-white/10 bg-[#17171b]">
              <Globe className="size-3 text-white/75" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold tracking-tight text-white">
                {target.name}
              </p>
              <p className="truncate font-mono text-[10px] text-white/45">{host}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-[4px] px-1.5 py-[3px] font-mono text-[9px] font-medium",
                target.is_active
                  ? "bg-[#0ca30c]/12 text-[#7bd67b]"
                  : "bg-white/6 text-white/50"
              )}
            >
              {target.is_active ? "Active" : "Paused"}
            </span>
          </div>

          {error && (
            <p className="mt-3 flex items-start gap-2 rounded-sm border border-destructive/25 bg-destructive/10 px-3 py-2 text-[11px] leading-relaxed text-red-200">
              <AlertTriangle aria-hidden className="mt-0.5 size-3 shrink-0" />
              {error}
            </p>
          )}
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={deleting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            loading={deleting}
            onClick={handleConfirm}
          >
            {deleting ? "Deleting..." : "Delete monitor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
