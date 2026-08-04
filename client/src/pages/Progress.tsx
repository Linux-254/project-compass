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
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, TrendingUp, ArrowUpRight } from "lucide-react";
import { useLocation } from "wouter";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
} from "recharts";

const BAR_COLORS = ["#d97706", "#f59e0b", "#fbbf24", "#fcd34d", "#fde68a"];

export default function Progress() {
  const useAuthResult = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const { user } = useAuthResult;
  const [, setLocation] = useLocation();

  const scoresQuery = trpc.dashboard.getDimensionScores.useQuery(undefined, {
    retry: false,
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const historyQuery = trpc.dashboard.getDimensionHistory.useQuery(
    { dimensionId: selectedId ?? 0, limit: 30 },
    { retry: false, enabled: selectedId !== null }
  );

  const scores = scoresQuery.data ?? [];

  const selected = useMemo(
    () => scores.find(s => s.dimensionId === selectedId) ?? null,
    [scores, selectedId]
  );

  const average = useMemo(() => {
    if (scores.length === 0) return 0;
    return Math.round(
      scores.reduce((sum, s) => sum + s.score, 0) / scores.length
    );
  }, [scores]);

  const chartData = useMemo(
    () =>
      scores.map(s => ({
        name: s.dimensionLabel,
        value: s.score,
        dimensionId: s.dimensionId,
      })),
    [scores]
  );

  const historyData = useMemo(
    () =>
      (historyQuery.data ?? []).map(h => ({
        name: new Date(h.capturedOn).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        score: h.score,
      })),
    [historyQuery.data]
  );

  if (scoresQuery.isLoading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Skeleton className="h-72 w-full mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-xl font-bold text-stone-900">
              Re<span className="text-amber-600">Forge</span>
            </div>
          </div>
          <span className="text-sm text-stone-600">
            {user?.name || user?.email}
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Your progress</h1>
            <p className="text-stone-600">
              How all 21 dimensions are moving across your journey.
            </p>
          </div>
          <Card className="w-full sm:w-64">
            <CardHeader className="pb-2">
              <CardDescription>Average across all dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-amber-600">
                  {average}
                </span>
                <span className="text-stone-500 mb-1">/ 100</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overview chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> 21 dimensions at a glance
            </CardTitle>
            <CardDescription>
              Click a bar to see that dimension's history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    radius={[6, 6, 0, 0]}
                    onClick={data => {
                      const entry = data as unknown as
                        | { dimensionId: number }
                        | undefined;
                      if (entry?.dimensionId) setSelectedId(entry.dimensionId);
                    }}
                  >
                    {chartData.map(entry => (
                      <Cell
                        key={entry.dimensionId}
                        fill={BAR_COLORS[entry.dimensionId % BAR_COLORS.length]}
                        cursor="pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Detail */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>All dimensions</CardTitle>
              <CardDescription>
                Latest score for each area of life.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {scores.map(s => (
                  <button
                    key={s.dimensionId}
                    onClick={() => setSelectedId(s.dimensionId)}
                    className={`text-left rounded-xl border p-3 transition-colors ${
                      selectedId === s.dimensionId
                        ? "border-amber-500 bg-amber-50"
                        : "border-stone-200 bg-white hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-stone-800">
                        {s.dimensionLabel}
                      </span>
                      <span className="text-sm font-bold text-amber-600">
                        {s.score}%
                      </span>
                    </div>
                    <ProgressBar value={s.score} className="h-1.5" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5" />
                {selected ? selected.dimensionLabel : "Dimension history"}
              </CardTitle>
              <CardDescription>
                {selected
                  ? "Select a dimension on the left to compare."
                  : "Choose a dimension from the chart or list to see its trend."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedId && historyData.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historyData}
                      margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#d97706"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-stone-400 text-sm">
                  {selectedId
                    ? "No history yet — scores will appear here as you check in."
                    : "Pick a dimension to see its story over time."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
