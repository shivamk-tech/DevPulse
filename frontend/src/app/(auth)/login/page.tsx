"use client";

import Link from "next/link";
import { GoogleIcon } from "@/components/icons/GoogleIcons";
import { Button, Checkbox, Label, Separator, Input } from "@/components/ui";
import { PasswordInput } from "@/components/forms";

export default function LoginPage() {
  return (
    <form className="space-y-4 sm:space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="loginEmail" className="text-white/70">Email</Label>
        <Input
          id="loginEmail"
          type="email"
          placeholder="john@example.com"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="loginPassword" className="text-white/70">Password</Label>
        <PasswordInput
          id="loginPassword"
          placeholder="Enter your password"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
        />
      </div>

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm font-normal text-white/50">
            Remember me
          </Label>
        </div>
        <Link href="/forgot-password" className="text-sm font-medium text-[#818cf8] hover:underline">
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <Button type="submit" fullWidth className="bg-[#4f46e5] text-white hover:bg-[#4338ca]">
        Log In
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