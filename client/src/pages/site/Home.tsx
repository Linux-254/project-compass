import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Heart,
  Music,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import {
  dimensionGroups,
  dailyBeats,
  phases,
  partners,
  stories,
} from "@/lib/site-content";

const features = [
  {
    icon: Heart,
    title: "Daily check-ins",
    body: "Morning and evening check-ins that take two minutes — mood, sleep, cravings, and one intention.",
  },
  {
    icon: Target,
    title: "Whole-life progress",
    body: "21 life dimensions tracked over time, so a bad day never erases a good month.",
  },
  {
    icon: Sparkles,
    title: "Guides that meet you where you are",
    body: "Activity, situation, and relationship guides tuned to your energy and the moment you name.",
  },
  {
    icon: Music,
    title: "Music rehabilitation",
    body: "Gently retrain what you listen to — away from trigger artists and toward a soundscape that heals.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Journal and assessment answers encrypted at rest. Supporters only see what you choose to share.",
  },
  {
    icon: CalendarCheck,
    title: "Goals with a horizon",
    body: "30, 90, and 180-day goals broken into steps small enough to keep on a hard day.",
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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-stone-50 to-stone-50" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <Badge variant="secondary" className="mb-6">
            A whole-life companion, not a lecture
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-stone-900 mb-6">
            Rebuild your life, <br className="hidden md:block" />
            <span className="text-amber-600">one honest day at a time</span>
          </h1>
          <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
            ReForge is a compassionate companion for changing your relationship
            with substances — covering the 21 dimensions of your life that
            drinking quietly rearranged.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={() => startLogin()}>
              Start your journey <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline">
                See how it works
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-amber-600">21</div>
              <p className="text-sm text-stone-500">life dimensions</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">2 min</div>
              <p className="text-sm text-stone-500">per check-in</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">24 wks</div>
              <p className="text-sm text-stone-500">guided journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* A day with ReForge */}
      <section className="bg-white border-y border-stone-200 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            A day with ReForge
          </h2>
          <p className="text-center text-stone-600 mb-12 max-w-2xl mx-auto">
            Not another set of forms. A rhythm that holds you.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {dailyBeats.map(beat => (
              <div
                key={beat.time}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-6"
              >
                <div className="text-sm font-mono text-amber-600 mb-2">
                  {beat.time}
                </div>
                <h3 className="font-semibold text-stone-900 mb-2">
                  {beat.title}
                </h3>
                <p className="text-sm text-stone-600">{beat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-10 border-b border-stone-200 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-xs uppercase tracking-widest text-stone-400 mb-6">
            Informed by
          </p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-stone-500 font-medium">
            {partners.map(partner => (
              <span key={partner}>{partner}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything the hard hours need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(feature => (
              <div
                key={feature.title}
                className="rounded-2xl border border-stone-200 bg-white p-6 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="h-8 w-8 text-amber-600 mb-4" />
                <h3 className="font-semibold text-lg text-stone-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-stone-600">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 areas of life */}
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            The whole of you, not just the habit
          </h2>
          <p className="text-center text-stone-400 mb-12 max-w-2xl mx-auto">
            Five areas of life, twenty-one dimensions, one map you can actually
            see moving.
          </p>
          <div className="grid md:grid-cols-5 gap-4">
            {dimensionGroups.map(group => (
              <div
                key={group.group}
                className="rounded-2xl border border-stone-700 bg-stone-800/60 p-6"
              >
                <h3 className="font-bold text-amber-400 mb-2">{group.group}</h3>
                <p className="text-sm text-stone-400 mb-4">{group.tone}</p>
                <ul className="space-y-1 text-sm text-stone-300">
                  {group.items.map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/dimensions">
              <Button variant="secondary" size="lg">
                Explore all 21 dimensions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Phases */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            The 24-week journey
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {phases.map((phase, idx) => (
              <div
                key={phase.title}
                className="rounded-2xl border border-stone-200 bg-white p-6"
              >
                <div className="text-4xl font-bold text-amber-500 mb-2">
                  {idx + 1}
                </div>
                <div className="text-xs uppercase tracking-wider text-stone-400 mb-1">
                  {phase.step}
                </div>
                <h3 className="font-semibold text-lg text-stone-900 mb-2">
                  {phase.title}
                </h3>
                <p className="text-sm text-stone-600">{phase.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="bg-amber-50 border-y border-amber-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            From people on the path
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map(story => (
              <figure
                key={story.name}
                className="rounded-2xl bg-white border border-amber-100 p-6"
              >
                <blockquote className="text-stone-700 mb-4">
                  “{story.quote}”
                </blockquote>
                <figcaption className="font-semibold text-stone-900">
                  {story.name}
                </figcaption>
                <div className="text-xs text-stone-500">{story.detail}</div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + newsletter */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to reclaim your life?
          </h2>
          <p className="text-lg text-stone-600 mb-8">
            Start free today. Two minutes a day is enough to begin.
          </p>
          <div className="mb-10">
            <Button size="lg" onClick={() => startLogin()}>
              Begin your journey <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-8">
            <h3 className="font-semibold text-lg mb-1">
              Prefer to take it slow?
            </h3>
            <p className="text-sm text-stone-600 mb-6">
              Get one honest, useful note a week. No spam, unsubscribe any time.
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
