"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { GoogleIcon } from "@/components/icons/GoogleIcons";
import { PasswordInput } from "@/components/forms";

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


export default function LoginPage() {

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
    const response = await authService.login(data);
    localStorage.setItem("access", response.data.access)
    localStorage.setItem("refresh", response.data.refresh)
    router.push("dashboard")
  }


  return (
    <form
      className="space-y-4 sm:space-y-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="loginEmail" className="text-white/70">Email</Label>
        <Input
          id="loginEmail"
          type="email"
          placeholder="john@example.com"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...form.register("email")}
        />
        <p className="h-4 text-xs leading-4 text-red-500">
          {form.formState.errors.email?.message}
        </p>
      </div>

      {/* Password */}
      <div className="space-y-2">
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
      </div>

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between">
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
        <Link href="/forgot-password" className="text-sm font-medium text-[#818cf8] hover:underline">
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        fullWidth
        className="bg-[#4f46e5] text-white hover:bg-[#4338ca]"
      >
        {form.formState.isSubmitting
          ? "Logging in..."
          : "Log In"}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <Separator className="bg-white/10" />
        <span className="whitespace-nowrap text-sm text-white/40">Or</span>
        <Separator className="bg-white/10" />
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        fullWidth
        leftSection={<GoogleIcon className="size-4" />}
        className="border-white/10 bg-white/5 text-white hover:bg-white/10"
      >
        Continue with Google
      </Button>

      {/* Footer — navigates to the signup route */}
      <p className="text-center text-sm text-white/50">
        Don&apos;t have an account?{" "}
        <Link href="/signup" replace className="font-medium text-[#818cf8] hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
}