import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

/**
 * Route gate for the signed-in app. Unauthenticated visitors are sent to
 * /auth with the destination preserved so they land where they meant to.
 */
export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation(`/auth?next=${encodeURIComponent(location)}`);
    }
  }, [loading, user, location, setLocation]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-stone-50">
        <Spinner className="size-6 text-amber-600" />
        <p className="text-sm text-stone-500">Checking your session…</p>
      </div>
    );
  }

  return <>{children}</>;
}
