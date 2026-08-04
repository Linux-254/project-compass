import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

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

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      <header className="sticky top-0 z-50 bg-[#faf8f4]/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-stone-900"
          >
            Re<span className="text-amber-600">Forge</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-stone-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => startLogin()}>
              Sign in
            </Button>
            <Button size="sm" onClick={() => startLogin()}>
              Start free
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-xl font-bold text-white mb-3">
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
                <h4 className="font-semibold text-white mb-3">{col.heading}</h4>
                <ul className="space-y-2 text-sm">
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
          <div className="border-t border-stone-800 pt-6 text-center text-xs">
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
