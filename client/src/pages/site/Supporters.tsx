import { Link } from "wouter";
import { SitePage } from "@/components/site/SitePage";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, Eye, HandHeart, Users } from "lucide-react";

const supporterSteps = [
  {
    icon: Users,
    title: "Invite a supporter",
    body: "From the app, choose one person you trust. They get their own ReForge account as a supporter.",
  },
  {
    icon: Eye,
    title: "Choose the scope",
    body: "Dashboard only, dashboard and journal, or full access. You control exactly what they can see, and you can revoke it any time.",
  },
  {
    icon: HandHeart,
    title: "They see progress, not details",
    body: "Supporters see streaks, milestones, and trends — never raw journal entries unless you've explicitly allowed it. Nothing sensitive ever lands in a notification.",
  },
];

export default function Supporters() {
  return (
    <SitePage
      asset="supporters"
      eyebrow="For the people who love them"
      title="You don't have to be blind to their journey"
      description="You can't do it for them, but you don't have to be blind to their journey either."
    >
      <section className="container max-w-3xl py-20">
        <div className="space-y-5">
          {supporterSteps.map((step, idx) => (
            <Reveal key={step.title} delay={idx * 0.05}>
              <div className="nature-card flex gap-5 p-6">
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

      <section className="border-t border-border/70 bg-primary/4 py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl">
              Know when to call, not just when to worry
            </h2>
            <p className="mt-4 text-lg nature-muted">
              A supporter view built for kindness, not surveillance.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="mt-7 rounded-full px-7">
                Learn more in the app <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </SitePage>
  );
}