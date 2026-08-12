"use client";

import Link from "next/link";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Mail } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { GoogleIcon } from "@/components/icons/GoogleIcons";
import { PasswordInput } from "@/components/forms";
import { fadeInUpSm, staggerContainer } from "@/lib/motion";

import {
  Button,
  Checkbox,
  Label,
  Separator,
  Input,
} from "@/components/ui";

import {
  loginSchema,
  type LoginFormData,
} from "@/schemas/auth/auth.schema";

import { authService } from "@/services/auth/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const reduce = useReducedMotion()
  const { refreshUser } = useAuth()
  const router = useRouter()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    await authService.login(data);

    // Load the session the cookies just established, then stop. Flipping status
    // to "authenticated" is enough — GuestGuard is watching and sends the user
    // to ?next= or /dashboard. No router call here, so the destination rule
    // lives in exactly one file.
    await refreshUser();
    router.push("/dashboard")
  }


  return (
    <motion.form
      className="space-y-4 sm:space-y-5"
      onSubmit={form.handleSubmit(onSubmit)}
      variants={staggerContainer}
      initial={reduce ? false : "hidden"}
      animate="show"
    >
      {/* Email */}
      <motion.div variants={fadeInUpSm} className="space-y-2">
        <Label htmlFor="loginEmail" className="text-white/70">Email</Label>
        <Input
          id="loginEmail"
          type="email"
          placeholder="john@example.com"
          leftSection={<Mail className="size-4" />}
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...form.register("email")}
        />
        <p className="h-4 text-xs leading-4 text-red-500">
          {form.formState.errors.email?.message}
        </p>
      </motion.div>

      {/* Password */}
      <motion.div variants={fadeInUpSm} className="space-y-2">
        <Label htmlFor="loginPassword" className="text-white/70">Password</Label>
        <PasswordInput
          id="loginPassword"
          placeholder="Enter your password"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...form.register("password")}
        />

        <p className="h-4 text-xs leading-4 text-red-500">
          {form.formState.errors.password?.message}
        </p>
      </motion.div>

      {/* Remember + Forgot */}
      <motion.div variants={fadeInUpSm} className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Controller
            name="rememberMe"
            control={form.control}
            render={({ field }) => (
              <Checkbox
                id="remember"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="remember" className="text-sm font-normal text-white/50">
            Remember me
          </Label>
        </div>
        <Link href="/forgot-password" className="text-sm font-medium text-[#818cf8] transition-colors hover:text-[#a5b4fc] hover:underline">
          Forgot password?
        </Link>
      </motion.div>

      {/* Submit */}
      <motion.div variants={fadeInUpSm}>
        <Button
          type="submit"
          variant="gradient"
          disabled={form.formState.isSubmitting}
          loading={form.formState.isSubmitting}
          fullWidth
          className="h-11"
        >
          {form.formState.isSubmitting
            ? "Logging in..."
            : "Log In"}
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div variants={fadeInUpSm} className="flex items-center gap-4">
        <Separator className="bg-white/10" />
        <span className="whitespace-nowrap text-sm text-white/40">Or</span>
        <Separator className="bg-white/10" />
      </motion.div>

      {/* Google */}
      <motion.div variants={fadeInUpSm}>
        <Button
          type="button"
          variant="outline"
          fullWidth
          leftSection={<GoogleIcon className="size-4" />}
          className="h-11 border-white/10 bg-white/5 text-white transition-colors hover:border-white/20 hover:bg-white/10"
        >
          Continue with Google
        </Button>
      </motion.div>

      {/* Footer — navigates to the signup route */}
      <motion.p variants={fadeInUpSm} className="text-center text-sm text-white/50">
        Don&apos;t have an account?{" "}
        <Link href="/signup" replace className="font-medium text-[#818cf8] transition-colors hover:text-[#a5b4fc] hover:underline">
          Sign Up
        </Link>
      </motion.p>
    </motion.form>
  );
}