import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { startLogin } from "@/const";
import { Leaf, Menu, ArrowUpRight } from "lucide-react";

const navLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/dimensions", label: "21 dimensions" },
  { href: "/daily-practice", label: "Daily practice" },
  { href: "/success", label: "Stories" },
  { href: "/supporters", label: "Supporters" },
  { href: "/faq", label: "FAQ" },
];

const footerColumns = [
  { heading: "Explore", links: navLinks.slice(0, 3) },
  { heading: "About", links: [{ href: "/about", label: "Our approach" }, { href: "/supporters", label: "For supporters" }, { href: "/contact", label: "Contact" }] },
  { heading: "Care", links: [{ href: "/faq", label: "FAQ" }, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }] },
];

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/78 backdrop-blur-xl">
        <div className="container flex h-[4.6rem] items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3" aria-label="ReForge home">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-6">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-serif text-2xl font-semibold tracking-tight">Re<span className="text-primary">Forge</span></span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/68 transition-colors hover:text-primary">{link.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle compact />
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => startLogin()}>Sign in</Button>
            <Button size="sm" className="rounded-full px-4" onClick={() => startLogin()}>Start free <ArrowUpRight className="ml-1 h-4 w-4" /></Button>
          </div>
        </div>
        <div className="container border-t border-border/50 py-3 lg:hidden">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5" aria-label="Mobile navigation">
            <Button variant="outline" size="sm" className="shrink-0 rounded-full" onClick={() => startLogin()}><Menu className="mr-1 h-4 w-4" /> Menu</Button>
            {navLinks.slice(0, 4).map(link => <Link key={link.href} href={link.href} className="shrink-0 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground/70">{link.label}</Link>)}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="relative overflow-hidden border-t border-border/70 bg-[oklch(0.24_0.045_145)] text-[oklch(0.9_0.03_105)]">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="container relative py-14">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" className="flex items-center gap-3 text-white">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary"><Leaf className="h-5 w-5" /></span>
                <span className="font-serif text-2xl font-semibold">Re<span className="text-[oklch(0.78_0.12_58)]">Forge</span></span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">A gentle whole-life recovery companion for the honest work of becoming well again.</p>
            </div>
            {footerColumns.map(column => (
              <div key={column.heading}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/90">{column.heading}</h3>
                <ul className="space-y-3 text-sm text-white/65">{column.links.map(link => <li key={link.href}><Link href={link.href} className="transition-colors hover:text-white">{link.label}</Link></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 ReForge. Not a medical service.</p>
            <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[oklch(0.78_0.12_58)]" /> Built for steady days and hard mornings.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function SiteNav() { return navLinks; }
