"use client";

import { useState } from "react";
import { Plus, Radio } from "lucide-react";

import { CreateMonitorDialog } from "@/components/monitors/Create-monitor-dialog";
import { Panel } from "@/components/dashboard/ui/Panel";
import { Button } from "@/components/ui";

/**
 * Host page for the Create Monitor dialog.
 *
 * Intentionally minimal — no monitor list, no data fetching, no API calls. Its
 * only job is to own the dialog's open state and give it a trigger, so the
 * form can be reviewed in place. The existing dashboard's "Create monitor"
 * buttons are untouched and still do nothing.
 */
export default function MonitorsPage() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Monitors</h1>
          <p className="mt-1 text-sm text-white/45">
            Endpoints Beacon checks on a schedule.
          </p>
        </div>

        <Button
          variant="white"
          size="sm"
          leftSection={<Plus className="size-4" />}
          onClick={() => setCreateOpen(true)}
          className="h-9"
        >
          Create monitor
        </Button>
      </header>

      <Panel className="relative overflow-hidden px-6 py-14 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.07),transparent_70%)]"
        />

        <div className="relative flex flex-col items-center">
          <span className="flex size-9 items-center justify-center rounded-lg bg-white/8 ring-1 ring-inset ring-white/20">
            <Radio className="size-4 text-white/80" />
          </span>

          <h2 className="mt-5 text-base font-medium text-white">No monitors yet</h2>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/45">
            Add an endpoint to see its status, response time, and incident history here.
          </p>

          <Button
            variant="white"
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="mt-6 h-9"
          >
            Create your first monitor
          </Button>
        </div>
      </Panel>

      <CreateMonitorDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
