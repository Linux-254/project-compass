import { SiteLayout } from "@/components/site/SiteLayout";
import { natureAsset, type ReforgeAssetKey } from "@/config/assets";
import { Reveal } from "@/components/Reveal";

export function SitePage({
  asset,
  eyebrow = "ReForge",
  title,
  description,
  children,
}: {
  asset: ReforgeAssetKey;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border/70">
        <img src={natureAsset(asset)} alt="" className="nature-image" />
        <div className="nature-image-overlay" />
        <div className="relative container py-20 sm:py-24">
          <Reveal>
            <p className="nature-eyebrow">{eyebrow}</p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 max-w-2xl text-base leading-7 nature-muted sm:text-lg">
                {description}
              </p>
            ) : null}
          </Reveal>
        </div>
      </section>
      {children}
    </SiteLayout>
  );
}