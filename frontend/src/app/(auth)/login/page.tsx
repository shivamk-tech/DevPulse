"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { GoogleIcon } from "@/components/icons/GoogleIcons";
import { PasswordInput } from "@/components/forms";
import { Button, Input } from "@/components/ui";
import {
  loginSchema,
  type LoginFormData,
} from "@/schemas/auth/auth.schema";
import { authService } from "@/services/auth/auth.service";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { refreshUser } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await authService.login(data);

    // Load the session the cookies just established, then stop. GuestGuard is
    // watching status and sends the user to ?next= or /dashboard, so the
    // destination rule lives in exactly one file.
    await refreshUser();
  };

  return (
    <div className="space-y-6">
      {/* Providers first — most people who have one will use it, and burying
         it under the email form makes them fill in fields they didn't need. */}
      <Button
        type="button"
        variant="outline"
        fullWidth
        leftSection={<GoogleIcon className="size-4" />}
        className="h-10 border-white/12 bg-white/4 text-white transition-colors hover:border-white/25 hover:bg-white/8"
      >
        Google
      </Button>

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-white/10" />
        <span className="whitespace-nowrap text-xs text-white/35">
          Or continue with
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="loginEmail" className="block text-sm text-white/70">
            Email
          </label>

          <Input
            id="loginEmail"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            error={Boolean(form.formState.errors.email)}
            className="border-white/12 bg-white/4 text-white placeholder:text-white/30"
            {...form.register("email")}
          />

          <p className="min-h-4 text-xs leading-4 text-red-400">
            {form.formState.errors.email?.message}
          </p>
        </div>

        <div className="space-y-2">
          {/* Label and recovery link share the row, so the link sits with the
             field it relates to rather than drifting to the bottom of the form. */}
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="loginPassword" className="block text-sm text-white/70">
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-[13px] text-white/50 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <PasswordInput
            id="loginPassword"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={Boolean(form.formState.errors.password)}
            className="border-white/12 bg-white/4 text-white placeholder:text-white/30"
            {...form.register("password")}
          />

          <p className="min-h-4 text-xs leading-4 text-red-400">
            {form.formState.errors.password?.message}
          </p>
        </div>

        <Button
          type="submit"
          variant="white"
          fullWidth
          loading={form.formState.isSubmitting}
          className="h-10"
        >
          {form.formState.isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="text-center text-sm text-white/50">
        New to Beacon?{" "}
        <Link
          href="/signup"
          replace
          className="text-white underline-offset-4 transition-colors hover:underline"
        >
          Sign up for an account
        </Link>
      </p>
    </div>
  );
}
