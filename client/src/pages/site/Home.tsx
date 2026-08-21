import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight, ArrowUpRight, CheckCircle2, Heart, Target, Sparkles, ShieldCheck, Music, CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { dimensionGroups, dailyBeats, phases } from "@/lib/site-content";
import { natureAsset } from "@/config/assets";

const slides = [
  { eyebrow: "A gentler way forward", title: "Return to yourself, one honest day at a time.", body: "ReForge helps you notice what is changing across the whole of life—not just the habit you are leaving behind." },
  { eyebrow: "Twenty-one dimensions", title: "Make room for the parts of life that are ready to grow.", body: "Health, home, work, relationships, meaning, and more become visible as a living map you can tend." },
  { eyebrow: "Small rituals, real momentum", title: "A quiet place to begin again each morning.", body: "Two-minute check-ins, private reflection, and practical guides meet you with warmth on easy days and hard ones." },
];

const features = [
  { icon: Heart, title: "Daily check-ins", body: "Morning and evening rituals for mood, sleep, cravings, energy, and one kind intention." },
  { icon: Target, title: "Whole-life progress", body: "A living view of 21 dimensions so one hard day never erases a season of growth." },
  { icon: Sparkles, title: "Guides for the moment", body: "Practical activity, situation, and relationship repair guides shaped around your context." },
  { icon: Music, title: "Music rehabilitation", body: "A gradual, curious shift toward soundscapes that support steadiness and discovery." },
  { icon: ShieldCheck, title: "Private by design", body: "Sensitive reflection is encrypted at rest, and sharing stays in your hands." },
  { icon: CalendarCheck, title: "Goals with a horizon", body: "Thirty, ninety, and 180-day intentions broken into humane next steps." },
];

export default function SiteHome() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [slide, setSlide] = useState(0);

  useEffect(() => { if (isAuthenticated) setLocation("/dashboard"); }, [isAuthenticated, setLocation]);
  useEffect(() => {
    const timer = window.setInterval(() => setSlide(current => (current + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = slides[slide];
  return (
    <SiteLayout>
      <section className="nature-shell min-h-[680px] border-b border-border/70">
        <img src={natureAsset("hero")} alt="A sunlit path through a quiet green landscape" className="nature-image" />
        <div className="nature-image-overlay" />
        <div className="container relative flex min-h-[680px] items-center py-20">
          <div className="nature-reveal max-w-2xl">
            <span className="leaf-chip mb-7"><Leaf className="h-3.5 w-3.5" /> {activeSlide.eyebrow}</span>
            <h1 className="nature-display max-w-xl text-foreground">{activeSlide.title}</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 nature-muted md:text-xl">{activeSlide.body}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="rounded-full px-6" onClick={() => startLogin()}>Begin your journey <ArrowRight className="ml-2 h-5 w-5" /></Button>
              <Link href="/how-it-works"><Button size="lg" variant="outline" className="rounded-full bg-background/45 px-6 backdrop-blur">See the rhythm <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link>
            </div>
            <div className="mt-11 flex items-center gap-3" aria-label="Hero slides">
              <button type="button" className="grid h-9 w-9 place-items-center rounded-full border border-border/80 bg-background/65" onClick={() => setSlide((slide + slides.length - 1) % slides.length)} aria-label="Previous story"><ChevronLeft className="h-4 w-4" /></button>
              {slides.map((item, index) => <button key={item.eyebrow} type="button" aria-label={`Show slide ${index + 1}`} aria-current={index === slide} onClick={() => setSlide(index)} className={`h-1.5 rounded-full transition-all ${index === slide ? "w-10 bg-primary" : "w-5 bg-foreground/25"}`} />)}
              <button type="button" className="grid h-9 w-9 place-items-center rounded-full border border-border/80 bg-background/65" onClick={() => setSlide((slide + 1) % slides.length)} aria-label="Next story"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="container -mt-10 relative z-10">
        <div className="nature-card grid gap-6 p-6 md:grid-cols-3 md:p-8">
          {[{ value: "21", label: "life dimensions" }, { value: "2 min", label: "per check-in" }, { value: "24 wks", label: "guided rhythm" }].map(stat => <div key={stat.label} className="flex items-center gap-4 md:block"><div className="font-serif text-4xl text-primary">{stat.value}</div><p className="text-sm nature-muted">{stat.label}</p></div>)}
        </div>
      </section>

      <section className="container py-24">
        <div className="max-w-2xl"><p className="nature-eyebrow">A day with ReForge</p><h2 className="mt-3 text-4xl md:text-5xl">Not another set of forms. A rhythm that holds you.</h2><p className="mt-5 text-lg leading-8 nature-muted">A few quiet moments, repeated with care, can become the shape of a new life.</p></div>
        <div className="mt-12 grid gap-4 md:grid-cols-4">{dailyBeats.map((beat, index) => <div key={beat.time} className="nature-card p-6" style={{ animationDelay: `${index * 80}ms` }}><span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{beat.time}</span><h3 className="mt-4 text-xl">{beat.title}</h3><p className="mt-3 text-sm leading-6 nature-muted">{beat.body}</p></div>)}</div>
      </section>

      <section id="features" className="bg-primary/8 border-y border-primary/12 py-24">
        <div className="container"><div className="max-w-2xl"><p className="nature-eyebrow">Built around the whole person</p><h2 className="mt-3 text-4xl md:text-5xl">A recovery space that feels more like a garden than a dashboard.</h2></div><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{features.map(feature => <article key={feature.title} className="nature-card p-7"><div className="mb-6 grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary"><feature.icon className="h-5 w-5" /></div><h3 className="text-xl">{feature.title}</h3><p className="mt-3 text-sm leading-6 nature-muted">{feature.body}</p></article>)}</div></div>
      </section>

      <section className="container py-24"><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><p className="nature-eyebrow">The whole of you</p><h2 className="mt-3 text-4xl md:text-5xl">Notice what is growing.</h2><p className="mt-5 text-lg leading-8 nature-muted">Five areas, twenty-one dimensions, one map you can actually see moving.</p><Link href="/dimensions"><Button variant="outline" className="mt-7 rounded-full">Explore the dimensions <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{dimensionGroups.map(group => <div key={group.group} className="rounded-[1.3rem] border border-border/70 bg-card/70 p-5"><h3 className="text-lg text-primary">{group.group}</h3><p className="mt-2 text-xs leading-5 nature-muted">{group.tone}</p><ul className="mt-4 space-y-2 text-xs nature-muted">{group.items.map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />{item}</li>)}</ul></div>)}</div></div></section>

      <section className="relative overflow-hidden border-y border-border/70 py-24"><img src={natureAsset("rituals")} alt="Morning light over a calm lake" className="nature-image opacity-20" /><div className="container relative"><div className="max-w-2xl"><p className="nature-eyebrow">A longer rhythm</p><h2 className="mt-3 text-4xl md:text-5xl">Twenty-four weeks of returning to what matters.</h2><p className="mt-5 text-lg leading-8 nature-muted">The journey moves from foundation to steadiness, connection, and a life that has more room in it.</p></div><div className="mt-12 grid gap-4 md:grid-cols-4">{phases.map((phase, index) => <div key={phase.title} className="nature-card bg-background/72 p-6"><span className="font-serif text-4xl text-primary">0{index + 1}</span><p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{phase.step}</p><h3 className="mt-2 text-xl">{phase.title}</h3><p className="mt-3 text-sm leading-6 nature-muted">{phase.detail}</p></div>)}</div></div></section>

      <section className="container py-24"><div className="mx-auto max-w-3xl text-center"><p className="nature-eyebrow">Take the first small step</p><h2 className="mt-3 text-4xl md:text-5xl">You do not have to have the whole path figured out.</h2><p className="mt-5 text-lg leading-8 nature-muted">Begin with one honest check-in. The next clearing will show itself.</p><Button size="lg" className="mt-8 rounded-full px-7" onClick={() => startLogin()}>Start free <ArrowRight className="ml-2 h-5 w-5" /></Button><div className="nature-card mx-auto mt-12 max-w-xl p-7 text-left"><h3 className="text-xl">A note for the week</h3><p className="mt-2 text-sm leading-6 nature-muted">No pressure, no noise. Just one useful message when you want it.</p><div className="mt-5"><NewsletterSignup /></div></div></div></section>
    </SiteLayout>
  );
}
