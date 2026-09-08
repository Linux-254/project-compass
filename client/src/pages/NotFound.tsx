import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { natureAsset } from "@/config/assets";
import { Home, ArrowRight, Compass } from "lucide-react";

const exploreLinks = [
  { href: "/how-it-works", label: "How ReForge works" },
  { href: "/dimensions", label: "The 21 dimensions" },
  { href: "/daily-practice", label: "Daily practice" },
  { href: "/faq", label: "Frequently asked questions" },
  { href: "/contact", label: "Contact us" },
];

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <SiteLayout>
      <section className="nature-shell relative min-h-[68vh] border-b border-border/70">
        <img src={natureAsset("reflection")} alt="" className="nature-image opacity-25" />
        <div className="nature-image-overlay" />
        <div className="container relative flex min-h-[68vh] flex-col items-center justify-center py-20 text-center">
          <img src="/logo-mark.svg" alt="ReForge" className="mb-8 h-16 w-16" />
          <p className="nature-eyebrow">This track isn't marked on the map</p>
          <h1 className="mt-3 font-serif text-6xl font-semibold tracking-tight text-foreground sm:text-7xl">404</h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-8 nature-muted">
            The page you were looking for has moved, been renamed, or never existed.
            You can head back to solid ground below.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="rounded-full px-6" onClick={() => setLocation("/")}>
              <Home className="mr-2 h-4 w-4" /> Return home
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-background/60 px-6" onClick={() => setLocation("/dashboard")}>
              Open my practice <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="mt-14 w-full max-w-md rounded-[1.35rem] border border-border/70 bg-card/80 p-6 text-left">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              <Compass className="h-4 w-4" /> Explore ReForge
            </p>
            <ul className="space-y-3">
              {exploreLinks.map(link => (
                <li key={link.href}>
                  <button
                    onClick={() => setLocation(link.href)}
                    className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-left text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
