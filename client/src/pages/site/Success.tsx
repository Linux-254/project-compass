import { SitePage } from "@/components/site/SitePage";
import { Reveal } from "@/components/Reveal";
import { stories } from "@/lib/site-content";

export default function Success() {
  return (
    <SitePage
      asset="success"
      eyebrow="Stories from the path"
      title="Real people, ordinary wins"
      description="No magic, no grand claims. Names changed, words theirs."
    >
      <section className="container max-w-4xl py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {stories.map(story => (
            <Reveal key={story.name}>
              <figure className="nature-card h-full p-8">
                <blockquote className="font-serif text-lg leading-8 text-foreground/85">
                  “{story.quote}”
                </blockquote>
                <figcaption className="mt-6 font-medium text-foreground">
                  {story.name}
                </figcaption>
                <div className="mt-1 text-sm text-muted-foreground">{story.detail}</div>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <div className="rounded-[1.35rem] border border-primary/20 bg-primary/7 p-8 text-center">
            <p className="font-serif text-xl text-primary">
              The next story could be yours.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Every journey here started with a single honest check-in.
            </p>
          </div>
        </Reveal>
      </section>
    </SitePage>
  );
}