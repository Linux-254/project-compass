import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/dimensions", label: "The 21 dimensions" },
  { href: "/daily-practice", label: "Daily practice" },
  { href: "/success", label: "Stories" },
  { href: "/supporters", label: "Supporters" },
  { href: "/faq", label: "FAQ" },
];

const footerColumns = [
  {
    heading: "Product",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/dimensions", label: "The 21 dimensions" },
      { href: "/daily-practice", label: "Daily practice" },
      { href: "/success", label: "Stories" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/supporters", label: "Supporters" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Get help" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

function AuthActions({ compact = false }: { compact?: boolean }) {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="h-8 w-32 rounded-full bg-stone-200 animate-pulse" />;
  }

  if (user) {
    const label =
      (user as { name?: string; email?: string }).name ??
      (user as { name?: string; email?: string }).email ??
      "Your dashboard";
    return (
      <div className={cn("flex items-center gap-2", compact && "flex-col w-full")}>
        <Link href="/dashboard" className={compact ? "w-full" : undefined}>
          <Button size="sm" className={compact ? "w-full" : undefined}>
            <LayoutDashboard className="h-4 w-4" />
            <span className="max-w-[10rem] truncate">{label}</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className={compact ? "w-full" : undefined}
          onClick={() => void logout()}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", compact && "flex-col w-full")}>
      <Link href="/auth" className={compact ? "w-full" : undefined}>
        <Button
          variant="ghost"
          size="sm"
          className={compact ? "w-full" : undefined}
        >
          Sign in
        </Button>
      </Link>
      <Button
        size="sm"
        className={compact ? "w-full" : undefined}
        onClick={() => startLogin()}
      >
        Start free
      </Button>
    </div>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      <header className="sticky top-0 z-50 bg-[#faf8f4]/95 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-stone-900 shrink-0"
          >
            Re<span className="text-amber-600">Forge</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-stone-600 min-w-0">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap hover:text-stone-900 transition-colors",
                  location === link.href && "text-amber-700"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <AuthActions />
          </div>
          <button
            type="button"
            aria-label="Toggle menu"
            className="sm:hidden text-stone-700"
            onClick={() => setOpen(v => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="sm:hidden border-t border-stone-200 bg-[#faf8f4] px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-1.5 text-sm font-medium text-stone-700"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <AuthActions compact />
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-stone-900 text-stone-400 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-6">
            <div>
              <div className="text-xl font-bold text-white mb-2">
                Re<span className="text-amber-400">Forge</span>
              </div>
              <p className="text-sm max-w-xs">
                A compassionate whole-life recovery companion. Not a medical
                service — if you are in crisis, contact local emergency services
                or a helpline in your region.
              </p>
            </div>
            {footerColumns.map(col => (
              <div key={col.heading}>
                <h4 className="font-semibold text-white mb-2">{col.heading}</h4>
                <ul className="space-y-1.5 text-sm">
                  {col.links.map(link => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-800 pt-5 text-center text-xs">
            <p>
              &copy; 2026 ReForge. All rights reserved. Not a medical service.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function SiteNav() {
  return navLinks;
}
