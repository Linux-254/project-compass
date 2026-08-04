import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Heart,
  Music,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import {
  dimensionGroups,
  dailyBeats,
  phases,
  partners,
  stories,
  faqs,
} from "@/lib/site-content";

const features = [
  {
    icon: Heart,
    title: "Daily check-ins",
    body: "Morning and evening check-ins that take two minutes — mood, sleep, cravings, and one intention.",
    proof: "4 taps · 2 minutes",
  },
  {
    icon: Target,
    title: "Whole-life progress",
    body: "21 life dimensions scored 0–100 over time, so a bad day never erases a good month.",
    proof: "21 dimensions · 5 areas",
  },
  {
    icon: Sparkles,
    title: "Guides for the exact moment",
    body: "Activity, situation and relationship guides tuned to your energy and the thing you just named.",
    proof: "120+ guides",
  },
  {
    icon: Music,
    title: "Music rehabilitation",
    body: "Gently retrain what you listen to — away from trigger artists, toward a soundscape that helps.",
    proof: "Trigger-aware playlists",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Journal and assessment answers encrypted at rest. Supporters see only what you choose.",
    proof: "Encrypted at rest",
  },
  {
    icon: CalendarCheck,
    title: "Goals with a horizon",
    body: "30, 90 and 180-day goals broken into steps small enough to keep on a hard day.",
    proof: "30 / 90 / 180 days",
  },
];

const comparison = [
  {
    them: "A folder of paperwork and no plan for Tuesday night",
    us: "A named plan for the hard hour, one tap from the home screen",
  },
  {
    them: "One number: days sober",
    us: "21 dimensions moving — sleep, money, trust, purpose",
  },
  {
    them: "A broken streak wipes the slate",
    us: "Milestones are kept; tomorrow you simply start again",
  },
  {
    them: "Clinical language written for a chart",
    us: "Plain, warm words written for a person",
  },
];

const moments = [
  {
    image: "/assets/movement.jpg",
    tag: "07:10",
    title: "The morning you didn't want to get up",
    body: "One honest answer and a suggestion that fits your energy — a ten-minute walk, not a marathon plan.",
  },
  {
    image: "/assets/connection.jpg",
    tag: "16:40",
    title: "The conversation you keep avoiding",
    body: "Repair scripts for apologies and boundaries, so you send the message you meant instead of three you regret.",
  },
  {
    image: "/assets/evening-journal.jpg",
    tag: "21:40",
    title: "The line you write before sleep",
    body: "What held, what slipped. Two sentences that turn a blur of weeks into a story you can read back.",
  },
];

export default function SiteHome() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  return (
    <SiteLayout>
      {/* Hero — split, image-led, no dead space */}
      <section className="relative border-b border-stone-200 bg-[#faf8f4]">
        <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14 grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center">
          <div>
            <Badge variant="secondary" className="mb-4">
              A whole-life companion, not a lecture
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-4 leading-[1.05]">
              Rebuild your life,{" "}
              <span className="text-amber-600">
                one honest day at a time
              </span>
            </h1>
            <p className="text-lg text-stone-600 mb-5 max-w-xl">
              ReForge is a compassionate companion for changing your
              relationship with substances — covering the 21 dimensions of your
              life that drinking quietly rearranged. Two minutes a day is enough
              to begin.
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-6 text-sm text-stone-700">
              {[
                "Morning + evening check-ins",
                "21 dimensions scored over time",
                "Guides for the hard hour",
                "Supporters see only what you share",
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button size="lg" onClick={() => startLogin()}>
                Start your journey <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  See how it works
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-4 border-t border-stone-200 pt-4">
              {[
                { n: "21", l: "life dimensions" },
                { n: "2 min", l: "per check-in" },
                { n: "24 wks", l: "guided journey" },
                { n: "0", l: "shame, by design" },
              ].map(stat => (
                <div key={stat.l}>
                  <div className="text-2xl font-bold text-amber-600">
                    {stat.n}
                  </div>
                  <p className="text-xs text-stone-500">{stat.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="/assets/hero-window.jpg"
              alt="A person standing at an open window at dawn"
              width={1600}
              height={1104}
              className="w-full h-[300px] sm:h-[380px] lg:h-[460px] object-cover rounded-3xl border border-stone-200"
            />
            <div className="absolute -bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-sm">
              <div className="text-xs font-mono text-amber-600 mb-1">
                today · morning check-in
              </div>
              <p className="text-sm text-stone-700">
                “Slept 6h. Cravings a 4. Intention: call my sister before the
                evening gets loud.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee trust rail */}
      <section className="py-5 border-b border-stone-200 bg-stone-900 overflow-hidden">
        <div className="marquee text-sm uppercase tracking-widest text-stone-400">
          {[...partners, ...partners].map((partner, i) => (
            <span key={partner + i} className="whitespace-nowrap">
              {partner}
            </span>
          ))}
        </div>
      </section>

      {/* A day with ReForge */}
      <section className="bg-white border-b border-stone-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold">A day with ReForge</h2>
              <p className="text-stone-600 mt-1">
                Not another set of forms. A rhythm that holds you.
              </p>
            </div>
            <Link href="/daily-practice">
              <Button variant="outline" size="sm">
                See the daily practice
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dailyBeats.map((beat, i) => (
              <Reveal key={beat.time} delay={i * 40}>
                <div className="h-full rounded-2xl border border-stone-200 bg-stone-50 p-5 lift">
                  <div className="text-sm font-mono text-amber-600 mb-1.5">
                    {beat.time}
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-1.5">
                    {beat.title}
                  </h3>
                  <p className="text-sm text-stone-600">{beat.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Moments — image-led */}
      <section className="py-12 bg-stone-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-1">
            Built for the moments that actually decide things
          </h2>
          <p className="text-stone-600 mb-6 max-w-2xl">
            Recovery isn't won in a clinic at 11am. It's won in three or four
            specific moments a day.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {moments.map((moment, i) => (
              <Reveal key={moment.title} delay={i * 50}>
                <article className="h-full overflow-hidden rounded-2xl border border-stone-200 bg-white lift">
                  <img
                    src={moment.image}
                    alt={moment.title}
                    loading="lazy"
                    width={1200}
                    height={900}
                    className="h-44 w-full object-cover"
                  />
                  <div className="p-5">
                    <div className="text-xs font-mono text-amber-600 mb-1">
                      {moment.tag}
                    </div>
                    <h3 className="font-semibold text-stone-900 mb-1.5">
                      {moment.title}
                    </h3>
                    <p className="text-sm text-stone-600">{moment.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Everything the hard hours need
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 35}>
                <div className="h-full rounded-2xl border border-stone-200 bg-stone-50 p-5 lift">
                  <feature.icon className="h-7 w-7 text-amber-600 mb-3" />
                  <h3 className="font-semibold text-lg text-stone-900 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-stone-600 mb-3">{feature.body}</p>
                  <span className="inline-block rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                    {feature.proof}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="bg-stone-900 text-white py-12 grain">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold">
                The whole of you, not just the habit
              </h2>
              <p className="text-stone-400 mt-1">
                Five areas of life, twenty-one dimensions, one map you can
                actually see moving.
              </p>
            </div>
            <Link href="/dimensions">
              <Button variant="secondary" size="sm">
                Explore all 21 dimensions
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {dimensionGroups.map((group, i) => (
              <Reveal key={group.group} delay={i * 40}>
                <div className="h-full rounded-2xl border border-stone-700 bg-stone-800/60 p-5">
                  <h3 className="font-bold text-amber-400 mb-1.5">
                    {group.group}
                  </h3>
                  <p className="text-sm text-stone-400 mb-3">{group.tone}</p>
                  <ul className="space-y-1 text-sm text-stone-300">
                    {group.items.map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-12 bg-stone-50 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            What makes this different
          </h2>
          <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
            <div className="grid grid-cols-2 text-xs uppercase tracking-widest bg-stone-100 text-stone-500">
              <div className="px-5 py-2.5">Most of what exists</div>
              <div className="px-5 py-2.5 text-amber-700">ReForge</div>
            </div>
            {comparison.map(row => (
              <div
                key={row.us}
                className="grid grid-cols-2 border-t border-stone-100 text-sm"
              >
                <div className="px-5 py-3.5 flex gap-2 text-stone-500">
                  <X className="h-4 w-4 mt-0.5 shrink-0" />
                  {row.them}
                </div>
                <div className="px-5 py-3.5 flex gap-2 text-stone-800 bg-amber-50/40">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
                  {row.us}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases */}
      <section className="py-12 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">The 24-week journey</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map((phase, idx) => (
              <Reveal key={phase.title} delay={idx * 40}>
                <div className="h-full rounded-2xl border border-stone-200 bg-stone-50 p-5 lift">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-amber-500">
                      {idx + 1}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-stone-400">
                      {phase.step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-stone-900 mb-1.5">
                    {phase.title}
                  </h3>
                  <p className="text-sm text-stone-600">{phase.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="bg-amber-50 border-b border-amber-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold">From people on the path</h2>
            <Link href="/success">
              <Button variant="outline" size="sm">
                Read more stories
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map((story, i) => (
              <Reveal key={story.name} delay={i * 35}>
                <figure className="h-full rounded-2xl bg-white border border-amber-100 p-5">
                  <Quote className="h-5 w-5 text-amber-500 mb-2" />
                  <blockquote className="text-stone-700 mb-3 text-sm leading-relaxed">
                    “{story.quote}”
                  </blockquote>
                  <figcaption className="font-semibold text-stone-900 text-sm">
                    {story.name}
                  </figcaption>
                  <div className="text-xs text-stone-500">{story.detail}</div>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ preview + CTA */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">Before you start</h2>
            <div className="space-y-3">
              {faqs.slice(0, 4).map(faq => (
                <div
                  key={faq.q}
                  className="rounded-xl border border-stone-200 bg-white p-4"
                >
                  <h3 className="font-medium text-stone-900 mb-1">{faq.q}</h3>
                  <p className="text-sm text-stone-600">{faq.a}</p>
                </div>
              ))}
            </div>
            <Link href="/faq">
              <Button variant="link" className="px-0 mt-2">
                All questions <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-stone-900 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">
                Ready to reclaim your life?
              </h2>
              <p className="text-stone-300 mb-5">
                Start free today. Two minutes a day is enough to begin — and
                your first check-in is the whole of day one.
              </p>
              <Button size="lg" onClick={() => startLogin()}>
                Begin your journey <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="font-semibold text-lg mb-1">
                Prefer to take it slow?
              </h3>
              <p className="text-sm text-stone-600 mb-4">
                Get one honest, useful note a week. No spam, unsubscribe any
                time.
              </p>
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
