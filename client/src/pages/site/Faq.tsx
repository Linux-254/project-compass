import { SiteLayout } from "@/components/site/SiteLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/site-content";

export default function Faq() {
  return (
    <SiteLayout>
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">
          Questions, answered
        </h1>
        <p className="text-xl text-stone-600 mb-12">
          The things people ask before they start.
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={faq.q} value={`item-${idx}`}>
              <AccordionTrigger className="text-left font-medium text-stone-900">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-stone-600 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <h2 className="font-semibold text-stone-900 mb-2">Still curious?</h2>
          <p className="text-sm text-stone-600">
            Head to the contact page and we'll get back to you within a couple
            of days.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
