import { SitePage } from "@/components/site/SitePage";
import { Reveal } from "@/components/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/site-content";

export default function Faq() {
  return (
    <SitePage
      asset="faq"
      eyebrow="Before you begin"
      title="Questions, answered"
      description="The things people ask before they start."
    >
      <section className="container max-w-3xl py-20">
        <div className="nature-card p-5 sm:p-7">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={faq.q} value={`item-${idx}`}>
                <AccordionTrigger className="text-left font-medium text-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Reveal className="mt-8">
          <div className="nature-card p-8 text-center">
            <h2 className="font-serif text-2xl">Still curious?</h2>
            <p className="mt-2 text-sm nature-muted">
              Head to the contact page and we'll get back to you within a couple
              of days.
            </p>
          </div>
        </Reveal>
      </section>
    </SitePage>
  );
}