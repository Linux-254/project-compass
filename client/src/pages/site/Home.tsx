import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SiteLayout } from "@/components/site/SiteLayout";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight, ArrowUpRight, CheckCircle2, Heart, Target, Sparkles, ShieldCheck, Music, CalendarCheck, ChevronLeft, ChevronRight, Sunrise, Moon, Dumbbell, BedDouble, Users, Sparkle, TrendingUp } from "lucide-react";
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

const journeyStops = [
  { icon: Sunrise, label: "Morning", title: "Begin gently", body: "Wake, notice, and set one kind intention before the day has a chance to rush you." },
  { icon: Dumbbell, label: "Movement", title: "Free the body", body: "Two minutes or two miles — move in a way that returns you to yourself." },
  { icon: Users, label: "Connection", title: "Reach out", body: "A check-in with someone you trust keeps recovery from being a lonely road." },
  { icon: Moon, label: "Evening", title: "Close tenderly", body: "Reflect without judgment. What you notice becomes tomorrow's gentle start." },
  { icon: Sparkle, label: "All day", title: "Stay curious", body: "Progress is a living map, not a scorecard. Let one good day rewrite the story." },
];

export default function SiteHome() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [slide, setSlide] = useState(0);

  const goTo = () => setLocation("/dashboard");

  const journeyRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: journeyRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66%"]);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide(current => (current + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = slides[slide];
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="nature-shell relative min-h-[680px] border-b border-border/70">
        <img src={natureAsset("hero")} alt="A sunlit path through a quiet green landscape" className="nature-image" />
        <div className="nature-image-overlay" />
        <div className="nature-mist" />
        <div className="container relative flex min-h-[680px] items-center py-20">
          <div className="nature-reveal max-w-2xl">
            <span className="leaf-chip mb-7"><Leaf className="h-3.5 w-3.5" /> {activeSlide.eyebrow}</span>
            <motion.h1 key={activeSlide.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="nature-display max-w-xl text-foreground">{activeSlide.title}</motion.h1>
            <p className="mt-7 max-w-xl text-lg leading-8 nature-muted md:text-xl">{activeSlide.body}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="rounded-full px-6" onClick={goTo}>Begin your journey <ArrowRight className="ml-2 h-5 w-5" /></Button>
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

      {/* Stats */}
      <section className="container -mt-10 relative z-10">
        <div className="nature-card grid gap-6 p-6 md:grid-cols-3 md:p-8">
          {[{ value: "21", label: "life dimensions" }, { value: "2 min", label: "per check-in" }, { value: "24 wks", label: "guided rhythm" }].map(stat => <div key={stat.label} className="flex items-center gap-4 md:block"><div className="font-serif text-4xl text-primary">{stat.value}</div><p className="text-sm nature-muted">{stat.label}</p></div>)}
        </div>
      </section>

      {/* Daily rhythm */}
      <section className="container relative py-24">
        <div className="nature-mist-soft" />
        <Reveal className="relative max-w-2xl"><p className="nature-eyebrow">A day with ReForge</p><h2 className="mt-3 text-4xl md:text-5xl">Not another set of forms. A rhythm that holds you.</h2><p className="mt-5 text-lg leading-8 nature-muted">A few quiet moments, repeated with care, can become the shape of a new life.</p></Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-4">{dailyBeats.map((beat, index) => <Reveal key={beat.time} delay={index * 0.06}><div className="nature-card h-full p-6 sage-bg"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{beat.time}</span><h3 className="mt-4 text-xl">{beat.title}</h3><p className="mt-3 text-sm leading-6 nature-muted">{beat.body}</p></div></Reveal>)}</div>
      </section>

      {/* Features */}
      <section id="features" className="sage-bg-strong border-y border-primary/12 py-24">
        <div className="container relative">
          <div className="nature-mist" />
          <Reveal className="relative max-w-2xl"><p className="nature-eyebrow">Built around the whole person</p><h2 className="mt-3 text-4xl md:text-5xl">A recovery space that feels more like a garden than a dashboard.</h2></Reveal>
          <div className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[...features, { icon: TrendingUp, title: "Progress that stays with you", body: "Streaks, milestones, and history charts reward the long, quiet work of showing up." }].map((feature, index) => <Reveal key={feature.title} delay={(index % 3) * 0.06}><article className="nature-card h-full bg-background/60 p-7"><div className="mb-6 grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary"><feature.icon className="h-5 w-5" /></div><h3 className="text-xl">{feature.title}</h3><p className="mt-3 text-sm leading-6 nature-muted">{feature.body}</p></article></Reveal>)}</div>
        </div>
      </section>

      {/* Horizontal scroll-driven journey */}
      <section ref={journeyRef} className="relative">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden border-y border-border/70">
          <img src={natureAsset("rituals")} alt="" className="nature-image opacity-15" />
          <div className="nature-mist" />
          <div className="container relative py-12">
            <Reveal><p className="nature-eyebrow">Scroll and let the day unfold</p><h2 className="mt-3 text-4xl md:text-5xl">A rhythm you can walk through.</h2></Reveal>
            <motion.div style={{ x }} className="mt-14 flex w-max items-stretch gap-6">
              {journeyStops.map((stop, index) => (
                <Reveal key={stop.title} delay={index * 0.04}>
                  <div className="nature-card flex h-[22rem] w-[82vw] flex-col justify-between p-7 sm:w-[26rem]">
                    <div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary"><stop.icon className="h-5 w-5" /></div><span className="mt-5 block text-xs font-semibold uppercase tracking-[0.18em] text-primary">{stop.label}</span><h3 className="mt-3 text-2xl">{stop.title}</h3></div>
                    <p className="text-sm leading-6 nature-muted">{stop.body}</p>
                  </div>
                </Reveal>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="container relative py-24"><div className="nature-mist-soft" /><div className="relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><Reveal><div><p className="nature-eyebrow">The whole of you</p><h2 className="mt-3 text-4xl md:text-5xl">Notice what is growing.</h2><p className="mt-5 text-lg leading-8 nature-muted">Five areas, twenty-one dimensions, one map you can actually see moving.</p><Link href="/dimensions"><Button variant="outline" className="mt-7 rounded-full bg-background/60">Explore the dimensions <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link></div></Reveal><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{dimensionGroups.map((group, index) => <Reveal key={group.group} delay={(index % 3) * 0.06}><div className="h-full rounded-[1.3rem] border border-border/70 bg-card/70 p-5"><h3 className="text-lg text-primary">{group.group}</h3><p className="mt-2 text-xs leading-5 nature-muted">{group.tone}</p><ul className="mt-4 space-y-2 text-xs nature-muted">{group.items.map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />{item}</li>)}</ul></div></Reveal>)}</div></div></section>

      {/* Phases */}
      <section className="relative overflow-hidden border-y border-border/70 py-24"><img src={natureAsset("rituals")} alt="Morning light over a calm lake" className="nature-image opacity-15" /><div className="nature-mist" /><div className="container relative"><div className="max-w-2xl"><p className="nature-eyebrow">A longer rhythm</p><h2 className="mt-3 text-4xl md:text-5xl">Twenty-four weeks of returning to what matters.</h2><p className="mt-5 text-lg leading-8 nature-muted">The journey moves from foundation to steadiness, connection, and a life that has more room in it.</p></div><div className="mt-12 grid gap-4 md:grid-cols-4">{phases.map((phase, index) => <Reveal key={phase.title} delay={index * 0.06}><div className="nature-card h-full bg-background/72 p-6"><span className="font-serif text-4xl text-primary">0{index + 1}</span><p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{phase.step}</p><h3 className="mt-2 text-xl">{phase.title}</h3><p className="mt-3 text-sm leading-6 nature-muted">{phase.detail}</p></div></Reveal>)}</div></div></section>

      {/* CTA */}
      <section className="container relative py-24"><div className="nature-mist-soft" /><div className="relative mx-auto max-w-3xl text-center"><p className="nature-eyebrow">Take the first small step</p><h2 className="mt-3 text-4xl md:text-5xl">You do not have to have the whole path figured out.</h2><p className="mt-5 text-lg leading-8 nature-muted">Begin with one honest check-in. The next clearing will show itself.</p><Button size="lg" className="mt-8 rounded-full px-7" onClick={goTo}>{isAuthenticated ? "Open your practice" : "Start free"} <ArrowRight className="ml-2 h-5 w-5" /></Button><div className="nature-card mx-auto mt-12 max-w-xl p-7 text-left"><h3 className="text-xl">A note for the week</h3><p className="mt-2 text-sm leading-6 nature-muted">No pressure, no noise. Just one useful message when you want it.</p><div className="mt-5"><NewsletterSignup /></div></div></div></section>
    </SiteLayout>
  );
}
