import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { faqs } from "@/lib/site-content";
import { ArrowRight, LifeBuoy, Lock, Wallet } from "lucide-react";
import { Link } from "wouter";

const extraFaqs = [
  {
    q: "What does it cost?",
    a: "Starting is free and stays free for daily check-ins, journalling and your dimension map. Paid plans add deeper guides, supporter tools and export features. No card is required to begin.",
  },
  {
    q: "Do I have to stop completely?",
    a: "No. ReForge supports both reducing and stopping. You set the goal — the check-ins and guides adapt to it rather than judging it.",
  },
  {
    q: "Will my employer, insurer or family find out?",
    a: "Not from us. There is no third-party data sharing, no advertising pixels on your private pages, and nothing sensitive in any email we send.",
  },
  {
    q: "What if I stop using the app for a month?",
    a: "Your data waits for you exactly as you left it. Come back and the next morning check-in is simply day one again — no lecture, no reset of your milestones.",
  },
  {
    q: "Can a supporter use it with me?",
    a: "Yes. You invite them and choose exactly what they can see — from 'streak only' to shared rules and trigger plans. You can change or revoke access at any time.",
  },
  {
    q: "Is my data used to train anything?",
    a: "Your journal and assessment answers are never used to train models. Guides are authored content, not generated from your entries.",
  },
];

const quickAnswers = [
  {
    icon: Wallet,
    title: "Free to start",
    body: "No card, no trial countdown, no feature held hostage on day one.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "Journal and assessment answers encrypted at rest; sharing is always opt-in.",
  },
  {
    icon: LifeBuoy,
    title: "Not a medical service",
    body: "A companion, not therapy. In a crisis, contact local emergency services.",
  },
];

export default function Faq() {
  const all = [...faqs, ...extraFaqs];
  return (
    <SiteLayout>
      <section className="border-b border-stone-200 bg-[#faf8f4]">
        <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1fr_320px] gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-stone-900 mb-3">
              Questions, answered
            </h1>
            <p className="text-lg text-stone-600 mb-5">
              The things people actually ask before they start — cost, privacy,
              slip-ups, faith, and what happens if you disappear for a month.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {quickAnswers.map(item => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-stone-200 bg-white p-4"
                >
                  <item.icon className="h-5 w-5 text-amber-600 mb-2" />
                  <h2 className="text-sm font-semibold text-stone-900 mb-1">
                    {item.title}
                  </h2>
                  <p className="text-sm text-stone-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <img
            src="/assets/connection.jpg"
            alt="Two people talking over coffee"
            loading="lazy"
            className="w-full h-[240px] object-cover rounded-3xl border border-stone-200"
          />
        </div>
      </section>

      <section className="py-10 bg-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4">
          <Reveal>
            <Accordion type="single" collapsible className="w-full">
              {all.map((faq, idx) => (
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
          </Reveal>
        </div>
      </section>

      <section className="py-10 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="font-semibold text-stone-900 mb-1">
              Still curious?
            </h2>
            <p className="text-sm text-stone-600 mb-4">
              Ask us anything — we answer as people, usually within a couple of
              days, and never with a sales pitch.
            </p>
            <Link href="/contact">
              <Button variant="outline">Contact us</Button>
            </Link>
          </div>
          <div className="rounded-2xl bg-stone-900 text-white p-6">
            <h2 className="font-semibold mb-1">Ready when you are</h2>
            <p className="text-sm text-stone-300 mb-4">
              Free to start. Two minutes a day. Your first check-in is the whole
              of day one.
            </p>
            <Button onClick={() => startLogin()}>
              Start free <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
