import { Link } from "wouter";
import { SitePage } from "@/components/site/SitePage";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { dailyBeats } from "@/lib/site-content";
import { ArrowRight, Sunrise, Bell, Moon } from "lucide-react";

const practice = [
  {
    icon: Sunrise,
    title: "Morning check-in",
    body: "Mood, sleep, cravings and one intention. Four taps, no essay. It sets the day's compass.",
  },
  {
    icon: Bell,
    title: "The nudge at the hard hour",
    body: "One suggestion tied to what you named this morning — a walk, a breathing set, the message you've been avoiding.",
  },
  {
    icon: Moon,
    title: "Close the day",
    body: "One line in the journal. What held, what slipped. Milestones recorded quietly, so a bad day never deletes a good month.",
  },
];

export default function DailyPractice() {
  return (
    <SitePage
      asset="dailypractice"
      eyebrow="A day with ReForge"
      title="Daily practice"
      description="The whole system is built to fit inside the corners of an ordinary day. Nothing here takes more than a few minutes."
    >
      <section className="container max-w-3xl py-20">
        <div className="space-y-5">
          {practice.map(item => (
            <Reveal key={item.title}>
              <div className="nature-card flex gap-5 p-6">
                <div className="shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl">{item.title}</h3>
                  <p className="mt-2 leading-7 nature-muted">{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border/70 bg-primary/4 py-16">
        <div className="container max-w-6xl">
          <Reveal>
            <h2 className="text-center font-serif text-3xl md:text-4xl">
              A sample day
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {dailyBeats.map(beat => (
              <Reveal key={beat.time} delay={0.04}>
                <div className="nature-card h-full p-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {beat.time}
                  </div>
                  <h3 className="mt-3 text-lg">{beat.title}</h3>
                  <p className="mt-2 text-sm leading-6 nature-muted">{beat.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl">
              Two minutes is enough to start
            </h2>
            <p className="mt-4 text-lg nature-muted">
              Your streak is built on days like today.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="mt-7 rounded-full px-7">
                Start today's check-in <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </SitePage>
  );
}