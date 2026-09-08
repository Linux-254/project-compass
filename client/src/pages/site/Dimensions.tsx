import { Link } from "wouter";
import { SitePage } from "@/components/site/SitePage";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { dimensionGroups, dimensions21 } from "@/lib/site-content";
import { ArrowRight } from "lucide-react";

export default function Dimensions() {
  return (
    <SitePage
      asset="dimensions"
      eyebrow="The whole of you"
      title="The 21 dimensions"
      description="Recovery is whole-life work. These are the 21 areas ReForge tracks and scores from 0 to 100 — a map you can actually see move."
    >
      <section className="container max-w-4xl py-20">
        <div className="space-y-10">
          {dimensionGroups.map(group => (
            <div key={group.group}>
              <Reveal>
                <div className="mb-4 flex flex-wrap items-baseline gap-3">
                  <h2 className="font-serif text-2xl md:text-3xl">{group.group}</h2>
                  <p className="text-sm nature-muted">{group.tone}</p>
                </div>
              </Reveal>
              <div className="grid gap-4 md:grid-cols-2">
                {dimensions21
                  .filter(d => d.group === group.group)
                  .map(dimension => (
                    <Reveal key={dimension.slug} delay={0.04}>
                      <div className="nature-card p-5">
                        <h3 className="text-lg">{dimension.label}</h3>
                        <p className="mt-1 text-sm leading-6 nature-muted">
                          {dimension.blurb}
                        </p>
                      </div>
                    </Reveal>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/70 bg-primary/4 py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl">
              See where you stand today
            </h2>
            <p className="mt-4 text-lg nature-muted">
              The conversational assessment scores each dimension — no essays, no
              judgement.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="mt-7 rounded-full px-7">
                Begin the assessment <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </SitePage>
  );
}