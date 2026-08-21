import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function NewsletterSignup({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [email, setEmail] = useState("");
  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("You're subscribed. Welcome to the journey.");
      setEmail("");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const dark = variant === "dark";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    subscribe.mutate({ email: trimmed, source: "marketing-site" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto"
    >
      <Input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        className={
          dark ? "bg-stone-800 border-stone-700 text-white" : "bg-white"
        }
      />
      <Button
        type="submit"
        disabled={subscribe.isPending}
        variant={dark ? "secondary" : "default"}
      >
        {subscribe.isPending ? "Subscribing…" : "Subscribe"}
      </Button>
    </form>
  );
}
