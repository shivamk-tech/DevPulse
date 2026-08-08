// Save this file at: app/forgot-password/page.tsx (a sibling of app/login/
// and app/signup/, inside the same route group so it picks up layout.tsx).
//
// This file renders ONLY the form — no logo, heading, card, or background.
// AuthLayout already supplies all of that (the dark glass card, the
// AuthShowcase image panel, and the "Forgot your password?" heading), so
// this component just fills the `children` slot with content styled to sit
// inside that dark card.

"use client";

import * as React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
    const [email, setEmail] = React.useState("");
    const [status, setStatus] = React.useState<"idle" | "loading" | "sent" | "error">("idle");
    const [isResending, setIsResending] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    async function requestReset(mode: "submit" | "resend") {
        if (mode === "submit") {
            setStatus("loading");
        } else {
            setIsResending(true);
        }
        setErrorMessage(null);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            // Deliberately don't branch on whether the account exists —
            // the response copy stays the same either way to avoid leaking
            // which emails are registered.
            if (!res.ok) throw new Error("Something went wrong. Please try again.");

            setStatus("sent");
        } catch (err) {
            setStatus("error");
            setErrorMessage(
                err instanceof Error ? err.message : "Something went wrong. Please try again."
            );
        } finally {
            if (mode === "resend") setIsResending(false);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        requestReset("submit");
    }

    if (status === "sent") {
        return (
            <SentState email={email} onResend={() => requestReset("resend")} resending={isResending} />
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/80">
                    Email
                </label>

                <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                        id="email"
                        type="email"
                        required
                        autoFocus
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn(
                            "h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3.5 text-[14.5px] text-white",
                            "placeholder:text-white/30",
                            "transition-all duration-200",
                            "focus:border-indigo-400/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        )}
                    />
                </div>

                {status === "error" && errorMessage && (
                    <p className="mt-2 text-[13px] text-red-400">{errorMessage}</p>
                )}

                <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    fullWidth
                    loading={status === "loading"}
                    className="mt-5"
                >
                    Send Reset Link
                </Button>
            </form>

            <div className="mt-6 text-center">
                <Link
                    href="/login"
                    className="text-[13.5px] font-medium text-white/50 transition-colors hover:text-white"
                >
                    ← Back to Login
                </Link>
            </div>
        </div>
    );
}

function SentState({
    email,
    onResend,
    resending,
}: {
    email: string;
    onResend: () => void;
    resending: boolean;
}) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl">
                📧
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">Check your inbox</h2>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-white/50">
                If an account exists for
                <br />
                <span className="font-semibold text-white">{email}</span>,
                <br />
                we've sent a password reset link.
            </p>

            <p className="mt-6 text-[13px] text-white/40">Didn't receive it?</p>

            <Button
                variant="secondary"
                size="md"
                fullWidth
                loading={resending}
                onClick={onResend}
                className="mt-3"
            >
                Resend Email
            </Button>

            <div className="mt-7">
                <Link
                    href="/login"
                    className="text-[13.5px] font-medium text-white/50 transition-colors hover:text-white"
                >
                    ← Back to Login
                </Link>
            </div>
        </div>
    );
}