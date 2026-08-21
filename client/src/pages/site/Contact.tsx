import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
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
    <SiteLayout>
      <section className="max-w-2xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">Contact us</h1>
        <p className="text-xl text-stone-600 mb-12">
          Questions, feedback, or something we should hear. We read everything.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="How can we help?"
              rows={6}
              required
            />
          </div>
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Send message
          </Button>
        </form>

        {sent && (
          <div className="mt-8 rounded-2xl bg-green-50 border border-green-200 p-6">
            <p className="text-green-800">
              Thanks for reaching out. We reply within a couple of days — often
              faster.
            </p>
          </div>
        )}

        <div className="mt-12 rounded-2xl bg-amber-50 border border-amber-100 p-6 text-sm text-stone-600">
          <p className="font-medium text-stone-800 mb-1">
            In crisis right now?
          </p>
          <p>
            ReForge is not a medical service. If you need urgent help, contact
            local emergency services or a helpline in your region.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
