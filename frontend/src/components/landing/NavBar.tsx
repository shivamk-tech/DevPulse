"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS: [string, string][] = [
  ["Features", "#features"],
  ["Pricing", "#pricing"],
  ["Docs", "/docs"],
  ["Blog", "/blog"],
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-white/10 bg-neutral-950/70 px-4 py-3 shadow-2xl backdrop-blur-xl">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-white"
        >
          <div className="h-8 w-8 rounded-full bg-indigo-600" />
          DevPulse
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {LINKS.map(([label, href]) =>
            href.startsWith("#") ? (
              <a
                key={label}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
              >
                {label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-300 transition hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10 md:hidden"
        >
          {mobileMenuOpen ? (
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="mx-auto mt-3 max-w-6xl rounded-3xl border border-white/10 bg-neutral-950/90 p-5 shadow-2xl backdrop-blur-xl md:hidden">

          <nav className="flex flex-col gap-1">
            {LINKS.map(([label, href]) =>
              href.startsWith("#") ? (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  {label}
                </Link>
              )
            )}
          </nav>

          <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5">
            <Link
              href="/login"
              className="rounded-xl border border-white/10 py-3 text-center text-zinc-300 transition hover:bg-white/5"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-indigo-600 py-3 text-center font-semibold text-white transition hover:bg-indigo-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}