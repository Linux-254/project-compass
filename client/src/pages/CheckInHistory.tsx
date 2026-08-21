import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Flame, Trophy, Smile, Zap, Heart } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

const PART_LABEL: Record<string, string> = {
  morning: "Morning",
  evening: "Evening",
};

export default function CheckInHistory() {
  const { user } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const [, setLocation] = useLocation();
  const [limit, setLimit] = useState(30);

  const historyQuery = trpc.checkIn.history.useQuery({ limit });
  const milestonesQuery = trpc.checkIn.milestones.useQuery();
  const streakQuery = trpc.checkIn.streak.useQuery();

  if (historyQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const checkIns = historyQuery.data ?? [];
  const milestones = milestonesQuery.data ?? [];
  const streak = streakQuery.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
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
            <h1 className="text-xl font-bold">Check-In History</h1>
            <p className="text-sm text-slate-600">
              Your consistency, streaks, and milestones
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Streak Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Flame className="h-5 w-5 text-orange-500" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {streak?.current ?? 0}
                <span className="text-base text-slate-600 ml-2">days</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Flame className="h-5 w-5 text-red-500" />
                Longest Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {streak?.longest ?? 0}
                <span className="text-base text-slate-600 ml-2">days</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-5 w-5 text-amber-500" />
                Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {milestones.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Milestones */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              Milestones Reached
            </CardTitle>
            <CardDescription>
              Celebrate every week, two weeks, month, and beyond
            </CardDescription>
          </CardHeader>
          <CardContent>
            {milestones.length === 0 ? (
              <p className="text-sm text-slate-600">
                No milestones yet. Keep showing up daily and you'll unlock your
                first at 7 days.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {milestones.map(m => (
                  <Badge
                    key={m.dayCount}
                    className="bg-amber-100 text-amber-900 border-amber-200 px-4 py-2 text-sm"
                  >
                    🏆 {m.dayCount}-day streak
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Past Check-Ins</CardTitle>
            <CardDescription>
              {checkIns.length} reflection{checkIns.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {checkIns.length === 0 ? (
              <p className="text-sm text-slate-600">
                No check-ins yet. Complete your first one to start your streak.
              </p>
            ) : (
              <div className="space-y-3">
                {checkIns.map(entry => {
                  const payload = entry.payload as { notes?: string } | null;
                  return (
                    <div
                      key={entry.id}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">
                          {PART_LABEL[entry.part]}
                        </Badge>
                        <span className="text-sm text-slate-500">
                          {new Date(entry.createdAt).toLocaleDateString()}{" "}
                          {new Date(entry.createdAt).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        {entry.mood != null && (
                          <span className="flex items-center gap-1 text-slate-700">
                            <Smile className="h-4 w-4 text-amber-600" />
                            Mood {entry.mood}/10
                          </span>
                        )}
                        {entry.energy != null && (
                          <span className="flex items-center gap-1 text-slate-700">
                            <Zap className="h-4 w-4 text-amber-600" />
                            Energy {entry.energy}/10
                          </span>
                        )}
                        {entry.cravings != null && (
                          <span className="flex items-center gap-1 text-slate-700">
                            <Heart className="h-4 w-4 text-amber-600" />
                            Cravings {entry.cravings}/10
                          </span>
                        )}
                      </div>
                      {payload?.notes && (
                        <p className="mt-2 text-sm text-slate-600">
                          {payload.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {checkIns.length >= limit && (
              <Button
                variant="outline"
                className="w-full mt-6"
                onClick={() => setLimit(l => l + 30)}
              >
                Load more
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
