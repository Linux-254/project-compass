import { Loader2, Leaf, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export const OAUTH_PENDING_KEY = "reforge-oauth-pending";
export const OAUTH_PENDING_EVENT = "reforge:oauth-pending";
const OAUTH_TIMEOUT_MS = 15_000;

function hasPendingOAuth() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(OAUTH_PENDING_KEY) === "1";
  } catch {
    return false;
  }
}

export function OAuthLoadingOverlay() {
  const [visible, setVisible] = useState(hasPendingOAuth);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    let closeTimer: number | undefined;
    let timeoutTimer: number | undefined;

    const clearPendingFlag = () => {
      try {
        window.sessionStorage.removeItem(OAUTH_PENDING_KEY);
      } catch {}
    };

    const closeOverlay = () => {
      setClosing(true);
      closeTimer = window.setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 230);
    };

    const scheduleTimeout = () => {
      if (timeoutTimer) window.clearTimeout(timeoutTimer);
      timeoutTimer = window.setTimeout(() => {
        clearPendingFlag();
        closeOverlay();
      }, OAUTH_TIMEOUT_MS);
    };

    const handlePending = () => {
      if (closeTimer) window.clearTimeout(closeTimer);
      setClosing(false);
      setVisible(true);
      scheduleTimeout();
    };

    const handleComplete = () => {
      if (timeoutTimer) window.clearTimeout(timeoutTimer);
      clearPendingFlag();
      closeOverlay();
    };

    window.addEventListener(OAUTH_PENDING_EVENT, handlePending);
    window.addEventListener("reforge:oauth-complete", handleComplete);
    if (hasPendingOAuth()) scheduleTimeout();

    return () => {
      if (closeTimer) window.clearTimeout(closeTimer);
      if (timeoutTimer) window.clearTimeout(timeoutTimer);
      window.removeEventListener(OAUTH_PENDING_EVENT, handlePending);
      window.removeEventListener("reforge:oauth-complete", handleComplete);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-background/82 px-6 backdrop-blur-md ${closing ? "oauth-overlay-exit" : "oauth-overlay-enter"}`}
      role="status"
      aria-live="polite"
      aria-label="Connecting to ReForge"
    >
      <div className="nature-card nature-glass w-full max-w-sm p-8 text-center shadow-2xl shadow-primary/10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/12 text-primary">
          <span className="relative grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
            <span className="absolute inset-0 animate-ping rounded-full border border-primary/40" />
          </span>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          Opening your private space
        </div>
        <h2 className="burnt-wood-heading mt-3 font-serif text-3xl">A moment to settle in.</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          ReForge is connecting your account and preparing your next small step.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Your session is protected
        </div>
      </div>
    </div>
  );
}
