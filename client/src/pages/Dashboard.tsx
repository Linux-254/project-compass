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
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  TrendingUp,
  Target,
  BookOpen,
  Music,
  Users,
  Settings,
  LogOut,
  Smile,
  Flame,
  Shield,
  HeartHandshake,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const [, setLocation] = useLocation();

  const dashboardQuery = trpc.dashboard.getOverview.useQuery();
  const onboardingStatusQuery = trpc.onboarding.status.useQuery(undefined, {
    retry: false,
  });
  const { data: overview, isLoading } = dashboardQuery;
  const needsOnboarding = onboardingStatusQuery.data?.needsOnboarding;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold">
              Re<span className="text-amber-600">Forge</span>
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-8" />
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">
            Re<span className="text-amber-600">Forge</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user?.name || user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/settings")}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {needsOnboarding && (
          <div className="mb-8 rounded-2xl bg-amber-50 border border-amber-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-amber-900">
                Let's build your map
              </h2>
              <p className="text-sm text-amber-800">
                A ten-minute conversation creates your starting scores across
                the 21 dimensions. You can finish it later.
              </p>
            </div>
            <Button onClick={() => setLocation("/onboarding")}>
              Start onboarding
            </Button>
          </div>
        )}

        {/* Welcome & Streak */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                Welcome back, {overview?.profile?.displayName || "Friend"}!
              </CardTitle>
              <CardDescription>
                You're on day {overview?.streak?.current || 0} of your journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Current Streak</span>
                    <span className="text-sm font-bold text-amber-600">
                      {overview?.streak?.current || 0} days
                    </span>
                  </div>
                  <Progress
                    value={(overview?.streak?.current || 0) * 5}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Longest Streak</span>
                    <span className="text-sm font-bold">
                      {overview?.streak?.longest || 0} days
                    </span>
                  </div>
                  <Progress
                    value={(overview?.streak?.longest || 0) * 5}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Check-In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {overview?.todayCheckIns?.morning ? (
                <div className="text-sm">
                  <span className="font-medium">Morning:</span> ✓ Complete
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setLocation("/check-in")}
                >
                  Morning Check-In
                </Button>
              )}
              {overview?.todayCheckIns?.evening ? (
                <div className="text-sm">
                  <span className="font-medium">Evening:</span> ✓ Complete
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setLocation("/check-in")}
                >
                  Evening Check-In
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dimension Scores */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Life Dimensions Progress
            </CardTitle>
            <CardDescription>
              Your progress across all 21 dimensions of whole-life wellness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {(overview?.dimensionScores ?? []).map(dim => (
                <div key={dim.dimensionId} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium truncate pr-2">
                      {dim.dimensionLabel}
                    </span>
                    <span className="text-sm font-bold text-amber-600">
                      {dim.score}%
                    </span>
                  </div>
                  <Progress value={dim.score} className="h-2" />
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-6"
              onClick={() => setLocation("/progress")}
            >
              View All Dimensions & History
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setLocation("/check-in")}
          >
            <CardHeader>
              <Smile className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base">Check-In</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Today's reflection</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setLocation("/check-ins")}
          >
            <CardHeader>
              <Flame className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base">History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Streaks & milestones</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setLocation("/journal")}
          >
            <CardHeader>
              <BookOpen className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base">Journal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Reflect on your journey</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setLocation("/goals")}
          >
            <CardHeader>
              <Target className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base">Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                {overview?.activeGoals?.length || 0} active goals
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setLocation("/rules")}
          >
            <CardHeader>
              <Shield className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base">Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Boundaries & commitments</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setLocation("/music")}
          >
            <CardHeader>
              <Music className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base">Music</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Healing through sound</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setLocation("/guides")}
          >
            <CardHeader>
              <Heart className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base">Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Personalized resources</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setLocation("/devotional")}
          >
            <CardHeader>
              <HeartHandshake className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-base">Devotional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">A moment to ground</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Goals Preview */}
        {overview?.activeGoals && overview.activeGoals.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Active Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview.activeGoals.map(goal => (
                  <div
                    key={goal.id}
                    className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-slate-600">
                        {goal.horizon}-day goal
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
