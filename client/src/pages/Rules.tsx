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
import { ArrowLeft, Shield, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

type Cadence = "daily" | "weekly" | "monthly";

const CADENCE_LABEL: Record<Cadence, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export default function Rules() {
  const { user } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const [, setLocation] = useLocation();
  const [text, setText] = useState("");
  const [cadence, setCadence] = useState<Cadence>("weekly");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const listQuery = trpc.rules.all.useQuery();
  const createMutation = trpc.rules.create.useMutation({
    onSuccess: () => {
      toast.success("Rule added");
      setText("");
      listQuery.refetch();
    },
    onError: () => toast.error("Failed to add rule"),
  });
  const toggleMutation = trpc.rules.update.useMutation({
    onSuccess: () => listQuery.refetch(),
    onError: () => toast.error("Failed to update rule"),
  });
  const deleteMutation = trpc.rules.remove.useMutation({
    onSuccess: () => {
      toast.success("Rule removed");
      setDeleteId(null);
      listQuery.refetch();
    },
    onError: () => toast.error("Failed to remove rule"),
  });

  const handleCreate = async () => {
    if (!text.trim()) return;
    await createMutation.mutateAsync({
      text: text.trim(),
      reviewCadence: cadence,
    });
  };

  if (listQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const rules = listQuery.data ?? [];

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
            <h1 className="text-xl font-bold">Rules & Boundaries</h1>
            <p className="text-sm text-slate-600">
              Commitments you hold yourself to, on your terms
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* New Rule */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              Add a Rule
            </CardTitle>
            <CardDescription>
              State it in your own words, e.g. "No scrolling before bed" or "No
              use on weekdays."
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rule-text">Your rule</Label>
                <Input
                  id="rule-text"
                  placeholder="I will not…"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="rule-cadence">Review cadence</Label>
                <select
                  id="rule-cadence"
                  value={cadence}
                  onChange={e => setCadence(e.target.value as Cadence)}
                  className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <Button
                onClick={handleCreate}
                disabled={!text.trim() || createMutation.isPending}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {createMutation.isPending ? "Adding..." : "Add Rule"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rules List */}
        {rules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Shield className="h-10 w-10 text-amber-300 mx-auto mb-4" />
              <p className="text-slate-600">
                No rules yet. Setting clear boundaries is a powerful act of
                self-respect.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rules.map(rule => (
              <Card
                key={rule.id}
                className={rule.active === false ? "opacity-60" : ""}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={rule.active !== false}
                        onCheckedChange={checked =>
                          toggleMutation.mutate({
                            ruleId: rule.id,
                            active: checked === true,
                          })
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-slate-800">{rule.text}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Review:{" "}
                          {rule.reviewCadence
                            ? (CADENCE_LABEL[rule.reviewCadence] ?? "—")
                            : "—"}{" "}
                          · {new Date(rule.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {rule.active !== false && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setDeleteId(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={o => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this rule?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() =>
                deleteId !== null && deleteMutation.mutate({ ruleId: deleteId })
              }
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
