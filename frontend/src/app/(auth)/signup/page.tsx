"use client";

import Link from "next/link";
import { Mail, User } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { GoogleIcon } from "@/components/icons/GoogleIcons";
import { fadeInUpSm, staggerContainer } from "@/lib/motion";
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
import { signupSchema, type SignupFormData } from "@/schemas/auth/auth.schema";
import { authService } from '@/services/auth/auth.service'

export default function SignupPage() {

  const reduce = useReducedMotion()

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

  const onSubmit = async (data: SignupFormData) => {
    const response = await authService.signup(data)
    console.log(response.data)
  }

  return (
    <motion.form
      className="w-full space-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
      variants={staggerContainer}
      initial={reduce ? false : "hidden"}
      animate="show"
    >
      {/* Name */}
      <motion.div variants={fadeInUpSm} className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="firstName" className="text-white/70">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            leftSection={<User className="size-4" />}
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            {...form.register("firstName")}
          />
          <p className="min-h-4 text-xs leading-4 text-red-500">
            {form.formState.errors.firstName?.message}
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-white/70">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            leftSection={<User className="size-4" />}
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            {...form.register("lastName")}
          />
          <p className="min-h-4 text-xs leading-4 text-red-500">
            {form.formState.errors.lastName?.message}
          </p>
        </div>
      </motion.div>

      {/* Email */}
      <motion.div variants={fadeInUpSm} className="space-y-1.5">
        <Label htmlFor="email" className="text-white/70">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          leftSection={<Mail className="size-4" />}
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...form.register("email")}
        />
        <p className="min-h-4 text-xs leading-4 text-red-500">
          {form.formState.errors.email?.message}
        </p>
      </motion.div>

      {/* Password + Confirm Password — stacked on mobile, side by side on sm+ */}
      <motion.div variants={fadeInUpSm} className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-white/70">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            {...form.register("password")}
          />
          <p className="min-h-4 text-xs leading-4 text-red-500">
            {form.formState.errors.password?.message}
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-white/70">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your password"
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            {...form.register("confirmPassword")}
          />
          <p className="min-h-4 text-xs leading-4 text-red-500">
            {form.formState.errors.confirmPassword?.message}
          </p>
        </div>
      </motion.div>

      {/* Terms — checkbox + label on one row, error underneath */}
      <motion.div variants={fadeInUpSm} className="space-y-1.5">
        <div className="flex items-center gap-3">
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
          <Label htmlFor="terms" className="text-sm font-normal leading-5 text-white/50">
            I agree to the{" "}
            <Link href="/terms" className="text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline">Privacy Policy</Link>
          </Label>
        </div>
        <p className="min-h-4 text-xs leading-4 text-red-500">
          {form.formState.errors.agreeToTerms?.message}
        </p>
      </motion.div>

      {/* Submit */}
      <motion.div variants={fadeInUpSm}>
        <Button
          type="submit"
          variant="white"
          disabled={form.formState.isSubmitting}
          loading={form.formState.isSubmitting}
          fullWidth
          className="h-10"
        >
          {form.formState.isSubmitting ? "Creating account..." : "Create account"}
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
          className="h-10 border-white/10 bg-white/5 text-white transition-colors hover:border-white/20 hover:bg-white/10"
        >
          Continue with Google
        </Button>
      </motion.div>

      {/* Footer — navigates to the login route */}
      <motion.p variants={fadeInUpSm} className="text-center text-sm text-white/50">
        Already have an account?{" "}
        <Link href="/login" replace className="font-medium text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline">
          Sign In
        </Link>
      </motion.p>
    </motion.form>
  );
}
