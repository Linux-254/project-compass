import { Link } from "wouter";
import { SitePage } from "@/components/site/SitePage";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, Leaf } from "lucide-react";

const values = [
  {
    title: "You are the expert on your life",
    body: "We don't prescribe. We mirror back what you tell us and organise it into something usable — your pace, your order, your words.",
  },
  {
    title: "Non-clinical by design",
    body: "The voice is warm, plain, and occasionally funny. This is a companion, not a chart. Nothing reads like a discharge summary.",
  },
  {
    title: "Small beats grand",
    body: "Two-minute check-ins outperform ambitious plans. We optimise for the streak you can keep on your worst day, not your best one.",
  },
  {
    title: "Privacy is the foundation",
    body: "Your journal and assessment answers are encrypted at rest. Supporters only ever see what you explicitly choose to share.",
  },
  {
    title: "Faith-friendly, never faith-imposed",
    body: "Devotionals always have a secular parallel. Your relationship with the big questions is yours to shape.",
  },
];

export default function About() {
  return (
    <SitePage
      asset="about"
      eyebrow="Our approach"
      title="Why ReForge exists"
      description="A steadily organised friend for the honest work of becoming well again."
    >
      <section className="container max-w-3xl py-20">
        <div className="space-y-5 text-foreground/82">
          <p className="text-lg leading-8">
            Most programmes end where the hard part begins. You leave with a
            folder of paperwork, a list of triggers, and no plan for a Tuesday
            night when the old voice gets loud.
          </p>
          <p className="text-lg leading-8">
            ReForge is that plan for Tuesday night — and Wednesday morning, and
            the first weekend, and the wedding where everyone is drinking. It
            was built around one belief:{" "}
            <span className="font-medium text-foreground">
              recovery is a whole-life project
            </span>
            , and it deserves a tool that treats the whole life, not just the
            substance.
          </p>
          <p className="text-lg leading-8">
            The 21 life dimensions — from work and money to faith and self-image
            — give you a map you can actually see move. Daily check-ins keep you
            honest and small. Guides meet you in the specific situation you
            name. And supporters see only what you choose, at the level of
            privacy you choose.
          </p>
          <p className="text-lg leading-8">
            We are not therapy and we are not medicine. If you are in crisis,
            contact local emergency services or a helpline in your region. What
            we are is a steady, organised friend who happens to be very good at
            helping you keep going.
          </p>
        </div>
      </section>

      <section className="border-y border-border/70 bg-primary/4 py-16">
        <div className="container max-w-4xl">
          <Reveal>
            <p className="nature-eyebrow text-center">What we believe</p>
            <h2 className="mt-3 text-center font-serif text-3xl md:text-4xl">
              The ground we stand on
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={(index % 2) * 0.06}>
                <div className="nature-card h-full p-6">
                  <Leaf className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 text-xl">{value.title}</h3>
                  <p className="mt-2 text-sm leading-6 nature-muted">{value.body}</p>
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
              Your version of the story is waiting
            </h2>
            <p className="mt-4 text-lg nature-muted">
              It starts with one honest check-in.
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