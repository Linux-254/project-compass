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
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowLeft, PenLine, Trash2, BookOpen } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Journal() {
  const { user } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/",
  });
  const [, setLocation] = useLocation();
  const [body, setBody] = useState("");
  const [limit, setLimit] = useState(20);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const listQuery = trpc.journal.list.useQuery({ limit });
  const createMutation = trpc.journal.create.useMutation({
    onSuccess: () => {
      toast.success("Entry saved");
      setBody("");
      listQuery.refetch();
    },
    onError: () => toast.error("Failed to save entry"),
  });
  const deleteMutation = trpc.journal.remove.useMutation({
    onSuccess: () => {
      toast.success("Entry deleted");
      setDeleteId(null);
      listQuery.refetch();
    },
    onError: () => toast.error("Failed to delete entry"),
  });

  const handleCreate = async () => {
    if (!body.trim()) return;
    await createMutation.mutateAsync({ body: body.trim() });
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

  const entries = listQuery.data ?? [];

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
            <h1 className="text-xl font-bold">Journal</h1>
            <p className="text-sm text-slate-600">
              Private reflections on your journey
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* New Entry */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5 text-amber-600" />
              New Entry
            </CardTitle>
            <CardDescription>
              Write freely. Your entries are encrypted and only visible to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="How is your journey going today? What have you noticed about yourself?"
              value={body}
              onChange={e => setBody(e.target.value)}
              className="min-h-32 mb-4"
            />
            <Button
              onClick={handleCreate}
              disabled={!body.trim() || createMutation.isPending}
              className="gap-2"
            >
              <PenLine className="h-4 w-4" />
              {createMutation.isPending ? "Saving..." : "Save Entry"}
            </Button>
          </CardContent>
        </Card>

        {/* Entries */}
        {entries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-10 w-10 text-amber-300 mx-auto mb-4" />
              <p className="text-slate-600">
                No entries yet. Start writing to see your journey take shape.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <Card key={entry.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-sm text-slate-500 mb-2">
                        {new Date(entry.createdAt).toLocaleDateString()}{" "}
                        {new Date(entry.createdAt).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                      <p className="whitespace-pre-wrap text-slate-800">
                        {entry.body}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 shrink-0"
                      onClick={() => setDeleteId(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {entries.length >= limit && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setLimit(l => l + 20)}
              >
                Load more
              </Button>
            )}
          </div>
        )}
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={o => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() =>
                deleteId !== null &&
                deleteMutation.mutate({ entryId: deleteId })
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
