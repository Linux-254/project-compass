import { useState } from "react";
import { SitePage } from "@/components/site/SitePage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("Message received. We'll be in touch soon.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <SitePage
      asset="contact"
      eyebrow="We read everything"
      title="Contact us"
      description="Questions, feedback, or something we should hear."
    >
      <section className="container max-w-2xl py-20">
        <div className="nature-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
                className="rounded-xl"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="rounded-xl"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-foreground">
                Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={6}
                required
                className="rounded-xl"
              />
            </div>
            <Button type="submit" size="lg" className="w-full rounded-full sm:w-auto">
              Send message
            </Button>
          </form>

          {sent && (
            <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/8 p-6">
              <p className="text-primary">
                Thanks for reaching out. We reply within a couple of days — often
                faster.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-[1.35rem] border border-border/70 bg-card/70 p-6 text-sm leading-6 text-muted-foreground">
          <p className="mb-1 font-medium text-foreground">In crisis right now?</p>
          <p>
            ReForge is not a medical service. If you need urgent help, contact
            local emergency services or a helpline in your region.
          </p>
        </div>
      </section>
    </SitePage>
  );
}