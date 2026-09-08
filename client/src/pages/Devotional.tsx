import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { REFORGE_ASSETS } from "@/config/assets";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, HeartHandshake, CalendarDays, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function Devotional() {
  const { user } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const [, setLocation] = useLocation();

  const devotionalQuery = trpc.devotional.today.useQuery();

  if (devotionalQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-4">
          <Skeleton className="h-48 w-full rounded-[2rem]" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const devotional = devotionalQuery.data;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <img src={REFORGE_ASSETS.devotional} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.17]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--background)_80%,transparent),var(--background)_55%)]" />

      <div className="relative mx-auto max-w-2xl px-4 py-6 sm:py-10">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setLocation("/dashboard")} className="rounded-full border-border/70 bg-background/70 backdrop-blur">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl leading-tight">Daily Devotional</h1>
            <p className="text-xs text-muted-foreground">A moment of grounding, refreshed each day</p>
          </div>
        </div>

        <Reveal>
          <Card className="nature-card overflow-hidden">
            <div className="h-1.5 w-full bg-[linear-gradient(90deg,#8aa05f,#4d684b,#a97c4a)]" />
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {devotional ? (
                <>
                  <CardTitle className="flex items-start gap-3 text-2xl leading-snug">
                    <HeartHandshake className="mt-1 h-6 w-6 shrink-0 text-primary" />
                    {devotional.title}
                  </CardTitle>
                  {devotional.tags && (
                    <Badge variant="outline" className="self-start rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                      {devotional.tags}
                    </Badge>
                  )}
                </>
              ) : (
                <CardTitle className="text-2xl">Reflection</CardTitle>
              )}
            </CardHeader>
            <CardContent>
              {devotional ? (
                <div className="whitespace-pre-wrap font-serif text-lg leading-8 text-foreground/85">
                  {devotional.body}
                </div>
              ) : (
                <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/25 p-5">
                  <p className="leading-7 text-muted-foreground">
                    Take a quiet moment today. Breathe deeply, notice where you are, and give yourself grace.
                    Every day you show up is a step forward.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </Reveal>

        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
          Devotionals are always optional and shaped by your faith preference in settings.
        </p>
      </div>
    </div>
  );
}