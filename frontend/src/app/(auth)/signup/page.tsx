"use client";

import Link from "next/link";
import { GoogleIcon } from "@/components/icons/GoogleIcons";
import {
  Button,
  Checkbox,
  Label,
  Separator,
  Input,
} from "@/components/ui";
import { PasswordInput } from "@/components/forms";
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupFormData } from "@/schemas/auth.schema";

export default function SignupPage() {

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false
    }
  })

  const onSubmit = (data: SignupFormData) => {
    console.log(data)
  }
  console.log(form.formState.errors);

  return (
    <form className="space-y-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {/* Name */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="firstName" className="text-white/70">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            {...form.register("firstName")}
          />
          <p className="h-4 text-xs leading-4 text-red-500">
            {form.formState.errors.firstName?.message}
          </p>
        </div>
        <div className="space-y-1">
          <Label htmlFor="lastName" className="text-white/70">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            {...form.register("lastName")}
          />
          <p className="h-4 text-xs leading-4 text-red-500">
            {form.formState.errors.lastName?.message}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Label htmlFor="email" className="text-white/70">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...form.register("email")}
        />
        <p className="h-4 text-xs leading-4 text-red-500">
          {form.formState.errors.email?.message}
        </p>
      </div>

      {/* Password + Confirm Password — side by side on sm+, stacked on mobile */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="password" className="text-white/70">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            {...form.register("password")}
          />
          <p className="h-4 text-xs leading-4 text-red-500">
            {form.formState.errors.password?.message}
          </p>
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-white/70">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            {...form.register("confirmPassword")}
          />
          <p className="h-4 text-xs leading-4 text-red-500">
            {form.formState.errors.confirmPassword?.message}
          </p>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start space-x-3">
        <Controller
          name="agreeToTerms"
          control={form.control}
          render={({ field }) => (
            <Checkbox
              id="terms"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="terms" {...form.register("agreeToTerms")} className="text-sm font-normal leading-5 text-white/50">
          I agree to the{" "}
          <Link href="/terms" className="text-[#818cf8] hover:underline">Terms of Service</Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#818cf8] hover:underline">Privacy Policy</Link>
        </Label>
        <p className="h-4 text-xs leading-4 text-red-500">
          {form.formState.errors.agreeToTerms?.message}
        </p>
      </div>

      {/* Submit */}
      <Button type="submit"
        disabled={form.formState.isSubmitting}
        fullWidth
        className="bg-[#4f46e5] text-white hover:bg-[#4338ca]">
        {
          form.formState.isSubmitting
            ? "Creating account..."
            : "Create account"
        }
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

      {/* Footer — navigates to the login route */}
      <p className="text-center text-sm text-white/50">
        Already have an account?{" "}
        <Link href="/login" replace className="font-medium text-[#818cf8] hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}