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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

const HORIZON_LABEL: Record<string, string> = {
  "30": "30-day",
  "90": "90-day",
  "180": "180-day",
};

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  abandoned: "bg-slate-100 text-slate-700 border-slate-200",
};

type Goal = {
  id: number;
  userId: number;
  horizon: "30" | "90" | "180";
  dimensionId: number | null;
  title: string;
  description: string | null;
  status: "active" | "completed" | "abandoned" | null;
  createdAt: Date;
  completedAt: Date | null;
  updatedAt: Date | null;
};

export default function Goals() {
  const { user } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("");
  const [horizon, setHorizon] = useState("90");
  const [description, setDescription] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [stepInput, setStepInput] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const goalsQuery = trpc.goals.all.useQuery();
  const createMutation = trpc.goals.create.useMutation({
    onSuccess: () => {
      toast.success("Goal created");
      setTitle("");
      setDescription("");
      goalsQuery.refetch();
    },
    onError: () => toast.error("Failed to create goal"),
  });
  const stepsQuery = trpc.goals.steps.useQuery(
    { goalId: expanded ?? 0 },
    { enabled: expanded !== null }
  );
  const addStepMutation = trpc.goals.addStep.useMutation({
    onSuccess: () => {
      setStepInput("");
      goalsQuery.refetch();
      if (expanded !== null) stepsQuery.refetch();
    },
    onError: () => toast.error("Failed to add step"),
  });
  const toggleStepMutation = trpc.goals.toggleStep.useMutation({
    onSuccess: () => {
      goalsQuery.refetch();
      if (expanded !== null) stepsQuery.refetch();
    },
  });
  const updateStatusMutation = trpc.goals.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Goal updated");
      goalsQuery.refetch();
    },
    onError: () => toast.error("Failed to update goal"),
  });
  const deleteMutation = trpc.goals.remove.useMutation({
    onSuccess: () => {
      toast.success("Goal deleted");
      setDeleteId(null);
      goalsQuery.refetch();
    },
    onError: () => toast.error("Failed to delete goal"),
  });

  const handleCreate = async () => {
    if (!title.trim()) return;
    await createMutation.mutateAsync({
      title: title.trim(),
      horizon: horizon as "30" | "90" | "180",
      description: description.trim() || undefined,
    });
  };

  const handleToggleGoal = (goal: Goal) => {
    const next =
      goal.status === "completed"
        ? "active"
        : goal.status === "active"
          ? "completed"
          : "active";
    updateStatusMutation.mutate({
      goalId: goal.id,
      status: next as "active" | "completed" | "abandoned",
    });
  };

  if (goalsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const goals = goalsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
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
            <h1 className="text-xl font-bold">Goals</h1>
            <p className="text-sm text-slate-600">
              Small steps, big horizons — track what matters
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* New Goal */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-600" />
              New Goal
            </CardTitle>
            <CardDescription>
              Name something you want to grow over the next 30, 90, or 180 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="goal-title">Goal</Label>
              <Input
                id="goal-title"
                placeholder="e.g. Build a consistent morning routine"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="goal-horizon">Horizon</Label>
              <select
                id="goal-horizon"
                value={horizon}
                onChange={e => setHorizon(e.target.value)}
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
              </select>
            </div>
            <div>
              <Label htmlFor="goal-desc">Why it matters (optional)</Label>
              <Textarea
                id="goal-desc"
                placeholder="What will this unlock for you?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="mt-2 min-h-20"
              />
            </div>
            <Button
              onClick={handleCreate}
              disabled={!title.trim() || createMutation.isPending}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {createMutation.isPending ? "Creating..." : "Create Goal"}
            </Button>
          </CardContent>
        </Card>

        {/* Goals List */}
        {goals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-10 w-10 text-amber-300 mx-auto mb-4" />
              <p className="text-slate-600">
                No goals yet. Setting a clear direction makes every day a step
                forward.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {goals.map(goal => {
              const isOpen = expanded === goal.id;
              const isCompleted = goal.status === "completed";
              return (
                <Card key={goal.id} className={isCompleted ? "opacity-75" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <button
                        className="flex items-start gap-3 flex-1 text-left"
                        onClick={() => setExpanded(isOpen ? null : goal.id)}
                      >
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={() => handleToggleGoal(goal)}
                          onClick={e => e.stopPropagation()}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p
                            className={
                              isCompleted
                                ? "text-slate-500 line-through"
                                : "text-slate-800 font-medium"
                            }
                          >
                            {goal.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant="outline">
                              {HORIZON_LABEL[goal.horizon] ?? goal.horizon}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                STATUS_BADGE[goal.status ?? ""] ??
                                "bg-slate-100 text-slate-700"
                              }
                            >
                              {goal.status}
                            </Badge>
                            {isOpen ? (
                              <ChevronUp className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 shrink-0"
                        onClick={() => setDeleteId(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {isOpen && (
                      <div className="mt-4 pl-8 space-y-3">
                        {goal.description && (
                          <p className="text-sm text-slate-600">
                            {goal.description}
                          </p>
                        )}
                        <div className="space-y-2">
                          {stepsQuery.data?.map(step => (
                            <div
                              key={step.id}
                              className="flex items-center gap-3"
                            >
                              <Checkbox
                                checked={Boolean(step.doneAt)}
                                onCheckedChange={() =>
                                  toggleStepMutation.mutate({
                                    goalId: goal.id,
                                    stepId: step.id,
                                  })
                                }
                              />
                              <span
                                className={
                                  step.doneAt
                                    ? "text-sm text-slate-500 line-through"
                                    : "text-sm"
                                }
                              >
                                {step.title}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a step…"
                            value={stepInput}
                            onChange={e => setStepInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter" && stepInput.trim()) {
                                addStepMutation.mutate({
                                  goalId: goal.id,
                                  title: stepInput.trim(),
                                });
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!stepInput.trim()}
                            onClick={() =>
                              addStepMutation.mutate({
                                goalId: goal.id,
                                title: stepInput.trim(),
                              })
                            }
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={o => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the goal and its steps. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() =>
                deleteId !== null && deleteMutation.mutate({ goalId: deleteId })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
