import { SiteLayout } from "@/components/site/SiteLayout";
import { stories } from "@/lib/site-content";

export default function Success() {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">
          Stories from the path
        </h1>
        <p className="text-xl text-stone-600 mb-12">
          Real people, ordinary wins, no magic. Names changed, words theirs.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {stories.map(story => (
            <figure
              key={story.name}
              className="rounded-2xl border border-stone-200 bg-white p-8"
            >
              <blockquote className="text-lg text-stone-700 mb-6 leading-relaxed">
                “{story.quote}”
              </blockquote>
              <figcaption className="font-semibold text-stone-900">
                {story.name}
              </figcaption>
              <div className="text-sm text-stone-500">{story.detail}</div>
            </figure>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-amber-50 border border-amber-100 p-8 text-center">
          <p className="text-lg text-stone-700 mb-2">
            The next story could be yours.
          </p>
          <p className="text-sm text-stone-500">
            Every journey here started with a single honest check-in.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
