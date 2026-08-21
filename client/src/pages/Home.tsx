import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, HeartHandshake, Leaf, LockKeyhole, Menu, Music2, Sparkles, Target, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";
import { REFORGE_ASSETS } from "@/config/assets";

const heroSlides = [
  { eyebrow: "Start where you are", title: "A whole-life view of recovery.", body: "ReForge helps you notice the small repairs—across body, work, relationships, meaning, and home—that make a steadier life possible.", image: REFORGE_ASSETS.hero, tone: "olive" },
  { eyebrow: "A daily thread", title: "A check-in that meets the morning.", body: "Name the mood, the energy, and the pull of the day. Then choose one gentle next step you can actually keep.", image: REFORGE_ASSETS.checkIn, tone: "terracotta" },
  { eyebrow: "Private by design", title: "Room to tell the truth.", body: "Your journal is a quiet place to reflect, with sensitive entries encrypted before they are stored.", image: REFORGE_ASSETS.journal, tone: "paper" },
];

const features = [
  { icon: HeartHandshake, title: "Daily check-ins", copy: "Morning and evening prompts for mood, energy, cravings, and what would help today." },
  { icon: Leaf, title: "21 life dimensions", copy: "See recovery as a whole-life practice—not a single score or a perfect streak." },
  { icon: BookOpen, title: "Guides with context", copy: "Find a next step for relationships, work, routines, music, and the situations that feel tender." },
  { icon: Music2, title: "A music reset", copy: "Notice triggers and make deliberate space for sounds that support the life you are rebuilding." },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [slideIndex, setSlideIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const slide = heroSlides[slideIndex];

  useEffect(() => { if (isAuthenticated && user) setLocation("/dashboard"); }, [isAuthenticated, user, setLocation]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => setSlideIndex((current) => (current + 1) % heroSlides.length), 5200);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const navItems = useMemo(() => [{ label: "How it works", id: "how-it-works" }, { label: "The 21 dimensions", id: "dimensions" }, { label: "For supporters", id: "supporters" }, { label: "FAQ", id: "faq" }], []);
  const scrollTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }); };

  return <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <button onClick={() => { setLocation("/"); window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }); }} className="flex items-center gap-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Go to ReForge home"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary"><Sparkles className="h-4 w-4" /></span><span className="font-serif text-xl font-semibold tracking-tight">Re<span className="text-primary">Forge</span></span></button>
        <nav className="hidden items-center gap-6 lg:flex">{navItems.map((item) => <button key={item.id} onClick={() => scrollTo(item.id)} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{item.label}</button>)}</nav>
        <div className="flex items-center gap-2"><ThemeToggle compact /><Button variant="ghost" className="hidden rounded-full sm:inline-flex" onClick={() => setLocation("/sign-in")}>Sign in</Button><Button className="hidden rounded-full sm:inline-flex" onClick={() => setLocation("/sign-in")}>Begin gently <ArrowRight className="ml-2 h-4 w-4" /></Button><Button variant="ghost" size="icon" className="rounded-full lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button></div>
      </div>
      {menuOpen && <div className="border-t border-border/60 bg-background px-4 py-4 lg:hidden"><div className="container grid gap-2">{navItems.map((item) => <button key={item.id} onClick={() => scrollTo(item.id)} className="rounded-xl px-3 py-3 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground">{item.label}</button>)}<Button onClick={() => setLocation("/sign-in")} className="mt-2 rounded-full">Begin gently</Button></div></div>}
    </header>

    <main>
      <section className="container grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:gap-16 lg:py-24">
        <div className="max-w-2xl space-y-7"><div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Recovery, with room to breathe</div><h1 className="font-serif text-5xl leading-[.98] tracking-tight sm:text-6xl lg:text-7xl">Come back to the life you are <span className="text-primary">rebuilding.</span></h1><p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">A compassionate digital companion for sobriety, self-trust, and the 21 places where a life can start to feel like yours again.</p><div className="flex flex-col gap-3 sm:flex-row"><Button size="lg" onClick={() => setLocation("/sign-in")} className="rounded-full px-7">Start your journey <ArrowRight className="ml-2 h-5 w-5" /></Button><Button size="lg" variant="outline" onClick={() => scrollTo("how-it-works")} className="rounded-full px-7">See how it works</Button></div><div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-primary" /> Private reflections</span><span className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> No perfect streak required</span></div></div>
        <div className="relative min-h-[480px] overflow-hidden rounded-[2.25rem] border border-border/60 bg-muted shadow-[0_28px_90px_-48px_rgba(64,51,36,.7)] sm:min-h-[560px]"><img key={slide.image} src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700" /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,44,32,.08),rgba(28,32,24,.82))]" /><div className="absolute inset-x-0 bottom-0 space-y-5 p-7 text-white sm:p-9"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-100">{slide.eyebrow}</p><h2 className="mt-3 max-w-md font-serif text-4xl leading-tight">{slide.title}</h2><p className="mt-3 max-w-md text-sm leading-6 text-white/75">{slide.body}</p></div><div className="flex items-center justify-between"><div className="flex gap-2" aria-label="Hero slides">{heroSlides.map((item, index) => <button key={item.title} onClick={() => setSlideIndex(index)} aria-label={`Show slide ${index + 1}`} className={`h-2 rounded-full transition-all ${index === slideIndex ? "w-8 bg-amber-200" : "w-2 bg-white/45"}`} />)}</div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={() => setSlideIndex((slideIndex - 1 + heroSlides.length) % heroSlides.length)} className="h-9 w-9 rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20" aria-label="Previous slide"><ChevronLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" onClick={() => setSlideIndex((slideIndex + 1) % heroSlides.length)} className="h-9 w-9 rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20" aria-label="Next slide"><ChevronRight className="h-4 w-4" /></Button></div></div></div></div>
      </section>

      <section id="how-it-works" className="border-y border-border/60 bg-card/60"><div className="container grid gap-8 py-16 lg:grid-cols-[.75fr_1.25fr] lg:py-20"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">A practice, not a performance</p><h2 className="mt-4 max-w-md font-serif text-4xl leading-tight sm:text-5xl">The next chapter is built in ordinary moments.</h2></div><div className="grid gap-4 sm:grid-cols-2">{[{ n: "01", title: "Notice", text: "Begin with an honest picture of the 21 dimensions of your life." }, { n: "02", title: "Repair", text: "Choose small, repeatable actions for the places that need care." }, { n: "03", title: "Reconnect", text: "Use prompts, guides, music, and support to make the good easier to reach." }, { n: "04", title: "Rebuild", text: "Watch your own evidence accumulate across a 3–6 month journey." }].map((item) => <Card key={item.n} className="rounded-2xl border-border/70 bg-background/70 shadow-none"><CardContent className="space-y-3 p-6"><span className="text-xs font-semibold tracking-[0.2em] text-primary">{item.n}</span><h3 className="font-serif text-2xl">{item.title}</h3><p className="text-sm leading-6 text-muted-foreground">{item.text}</p></CardContent></Card>)}</div></div></section>

      <section id="dimensions" className="container py-16 sm:py-20"><div className="mb-10 max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Whole-life recovery</p><h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Sobriety is the beginning of the conversation.</h2><p className="mt-4 text-lg leading-8 text-muted-foreground">ReForge keeps the wider picture visible: body, mind, relationships, work, meaning, money, home, and the quiet places that make a life feel held.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map((feature) => <Card key={feature.title} className="rounded-2xl border-border/70 bg-card/80 shadow-none transition-transform hover:-translate-y-1"><CardContent className="space-y-4 p-6"><feature.icon className="h-6 w-6 text-primary" /><h3 className="font-serif text-2xl">{feature.title}</h3><p className="text-sm leading-6 text-muted-foreground">{feature.copy}</p></CardContent></Card>)}</div></section>

      <section id="supporters" className="relative overflow-hidden bg-[#304333] text-[#f5ead8]"><div className="absolute inset-0 opacity-25"><img src={REFORGE_ASSETS.guides} alt="" className="h-full w-full object-cover" /></div><div className="container relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_.8fr] lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">For supporters</p><h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">Support without taking the wheel.</h2><p className="mt-5 max-w-xl text-base leading-7 text-white/75">When the time is right, trusted people can be invited into the journey with clear boundaries and consent-led visibility.</p></div><div className="rounded-3xl border border-white/15 bg-white/8 p-6 backdrop-blur-sm"><p className="font-serif text-2xl">Care can be close without becoming control.</p><p className="mt-4 text-sm leading-6 text-white/70">ReForge is built to keep the person in recovery at the center of their own story.</p></div></div></section>

      <section id="faq" className="container py-16 sm:py-20"><div className="mx-auto max-w-3xl"><p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-primary">A few honest answers</p><h2 className="mt-4 text-center font-serif text-4xl">Questions before you begin</h2><div className="mt-10 divide-y divide-border/70 rounded-3xl border border-border/70 bg-card/50">{[{ q: "Is ReForge clinical care?", a: "No. ReForge is a private reflection and recovery-support tool. It does not replace medical, emergency, or professional care." }, { q: "Do I need a perfect streak?", a: "No. The product is designed around returning, noticing, and choosing the next right step—not performing wellness." }, { q: "Can I choose faith-based or secular content?", a: "Yes. Devotional content is opt-in, and your preference is explicit in settings." }].map((item) => <details key={item.q} className="group p-6"><summary className="cursor-pointer list-none font-serif text-xl">{item.q}<span className="float-right text-primary transition-transform group-open:rotate-45">+</span></summary><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{item.a}</p></details>)}</div></div></section>
    </main>
    <footer className="border-t border-border/60 bg-card/60"><div className="container flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p><span className="font-serif text-lg text-foreground">Re<span className="text-primary">Forge</span></span> · A gentler way forward.</p><div className="flex items-center gap-5"><button onClick={() => scrollTo("faq")} className="hover:text-foreground">FAQ</button><button onClick={() => setLocation("/sign-in")} className="hover:text-foreground">Sign in</button><span>Not a medical service.</span></div></div></footer>
  </div>;
}
