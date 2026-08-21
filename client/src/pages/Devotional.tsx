import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, HeartHandshake, CalendarDays } from "lucide-react";
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
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const devotional = devotionalQuery.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold">Daily Devotional</h1>
            <p className="text-sm text-slate-600">
              A moment of grounding, refreshed each day
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-700 text-sm mb-2">
              <CalendarDays className="h-4 w-4" />
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
            {devotional ? (
              <>
                <CardTitle className="flex items-start gap-3 text-xl leading-snug">
                  <HeartHandshake className="h-6 w-6 text-amber-600 mt-1 shrink-0" />
                  {devotional.title}
                </CardTitle>
                {devotional.tags && (
                  <Badge
                    variant="outline"
                    className="bg-white/60 border-amber-200 text-amber-900 self-start"
                  >
                    {devotional.tags}
                  </Badge>
                )}
              </>
            ) : (
              <CardTitle>Reflection</CardTitle>
            )}
          </CardHeader>
          <CardContent>
            {devotional ? (
              <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                {devotional.body}
              </div>
            ) : (
              <p className="text-slate-700">
                Take a quiet moment today. Breathe deeply, notice where you are,
                and give yourself grace. Every day you show up is a step
                forward.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
