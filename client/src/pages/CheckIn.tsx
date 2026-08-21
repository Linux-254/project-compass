import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Smile, Zap, Heart } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function CheckIn() {
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/" });
  const [, setLocation] = useLocation();
  const [part, setPart] = useState<"morning" | "evening">("morning");
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [cravings, setCravings] = useState(5);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayQuery = trpc.checkIn.getToday.useQuery();
  const createCheckInMutation = trpc.checkIn.create.useMutation();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createCheckInMutation.mutateAsync({
        part,
        mood,
        energy,
        cravings,
        notes: notes || undefined,
      });
      // Show success and redirect
      setLocation("/dashboard");
    } catch (error) {
      console.error("Failed to save check-in:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (todayQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const isCompleted = part === "morning" ? todayQuery.data?.morning : todayQuery.data?.evening;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
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
            <h1 className="text-xl font-bold">Daily Check-In</h1>
            <p className="text-sm text-slate-600">
              {part === "morning" ? "Morning" : "Evening"} reflection
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Part Selection */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={part === "morning" ? "default" : "outline"}
            onClick={() => setPart("morning")}
            className="flex-1"
          >
            🌅 Morning
          </Button>
          <Button
            variant={part === "evening" ? "default" : "outline"}
            onClick={() => setPart("evening")}
            className="flex-1"
          >
            🌙 Evening
          </Button>
        </div>

        {isCompleted && (
          <Card className="mb-8 bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <p className="text-amber-900">
                ✓ You've already completed your {part} check-in today. You can update it below.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Mood */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-amber-600" />
              How's your mood?
            </CardTitle>
            <CardDescription>
              Rate your emotional state from very low to very high
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-xs text-slate-600 mb-2">
              <span>Very Low</span>
              <span>Neutral</span>
              <span>Very High</span>
            </div>
            <Slider
              value={[mood]}
              onValueChange={(val) => setMood(val[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-3xl font-bold text-amber-600">{mood}</span>
              <span className="text-sm text-slate-600 ml-2">/10</span>
            </div>
          </CardContent>
        </Card>

        {/* Energy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              What's your energy level?
            </CardTitle>
            <CardDescription>
              Rate your physical and mental energy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-xs text-slate-600 mb-2">
              <span>Exhausted</span>
              <span>Balanced</span>
              <span>Energized</span>
            </div>
            <Slider
              value={[energy]}
              onValueChange={(val) => setEnergy(val[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-3xl font-bold text-amber-600">{energy}</span>
              <span className="text-sm text-slate-600 ml-2">/10</span>
            </div>
          </CardContent>
        </Card>

        {/* Cravings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-amber-600" />
              How strong are your cravings?
            </CardTitle>
            <CardDescription>
              Rate the intensity of any cravings you're experiencing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-xs text-slate-600 mb-2">
              <span>None</span>
              <span>Moderate</span>
              <span>Intense</span>
            </div>
            <Slider
              value={[cravings]}
              onValueChange={(val) => setCravings(val[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-3xl font-bold text-amber-600">{cravings}</span>
              <span className="text-sm text-slate-600 ml-2">/10</span>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Anything else on your mind?</CardTitle>
            <CardDescription>
              Optional: Share any thoughts, feelings, or observations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What's happening in your life right now? How are you feeling about your journey?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-24"
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setLocation("/dashboard")}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Check-In"}
          </Button>
        </div>

        {/* Encouragement */}
        <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-700">
              ✨ <strong>You're doing great.</strong> Each check-in is a moment of self-awareness and care. 
              These reflections help you understand your patterns and celebrate your progress.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
