import { Link } from "wouter";
import { SitePage } from "@/components/site/SitePage";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { phases } from "@/lib/site-content";
import {
  ArrowRight,
  MessageSquare,
  BarChart3,
  CalendarCheck,
} from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "A conversation, not a form",
    body: "Onboarding asks the questions a thoughtful friend would ask — in your own words, at your own pace. Skip anything you're not ready for and come back to it later.",
  },
  {
    icon: BarChart3,
    title: "A map of your 21 dimensions",
    body: "The assessment becomes a starting score for each area of your life. One page, no judgement: where you are right now.",
  },
  {
    icon: CalendarCheck,
    title: "A rhythm you can keep",
    body: "Two-minute morning and evening check-ins, a nudge at the hard hour, and a one-line journal at night. Small wins recorded so relapse never erases them.",
  },
];

export default function HowItWorks() {
  return (
    <SitePage
      asset="howitworks"
      eyebrow="The rhythm"
      title="How it works"
      description="A three-to-six-month journey through four phases, designed to end with you needing the app less."
    >
      <section className="container max-w-3xl py-20">
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <Reveal key={step.title} delay={idx * 0.06}>
              <div className="flex gap-5">
                <div className="shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <step.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <div className="nature-eyebrow mb-1">Step {idx + 1}</div>
                  <h3 className="text-xl">{step.title}</h3>
                  <p className="mt-2 leading-7 nature-muted">{step.body}</p>
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
              The four phases
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {phases.map((phase, idx) => (
              <Reveal key={phase.title} delay={idx * 0.06}>
                <div className="nature-card h-full p-6">
                  <div className="font-accent text-4xl font-semibold text-primary">
                    {idx + 1}
                  </div>
                  <div className="nature-eyebrow mt-3">{phase.step}</div>
                  <h3 className="mt-2 text-lg">{phase.title}</h3>
                  <p className="mt-2 text-sm leading-6 nature-muted">{phase.body}</p>
                  <p className="mt-2 text-sm leading-6 text-foreground/55">{phase.detail}</p>
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
              Your first two minutes
            </h2>
            <p className="mt-4 text-lg nature-muted">
              The first morning check-in takes less time than making the tea.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="mt-7 rounded-full px-7">
                Start free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </SitePage>
  );
}