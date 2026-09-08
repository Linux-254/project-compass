import { useMusic } from "@/lib/MusicPlayer";
import { MUSIC_MOODS } from "@shared/music";
import {
  Music2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

function fmt(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MiniPlayer() {
  const { current, playing, toggle, next, prev, stop, progress, time, duration, volume, setVolume, hasNext, hasPrev } = useMusic();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!current) return null;

  const mood = MUSIC_MOODS.find(m => m.key === current.mood);

  return (
    <div className={`fixed inset-x-3 bottom-[4.4rem] z-50 sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:w-[min(26rem,calc(100vw-3rem))] sm:-translate-x-1/2 ${mounted ? "" : ""}`}>
      <div className="nature-card overflow-hidden shadow-[0_16px_40px_-12px_rgba(40,50,25,0.5)]">
        <div className="h-1 w-full bg-primary/10">
          <div className="progress-gradient h-full transition-[width] duration-300" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <Music2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight text-foreground">{current.title}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {mood?.label ?? "Music"} · {fmt(time)} / {fmt(duration)}
            </p>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              aria-label="Player volume"
              onChange={e => setVolume(Number(e.target.value))}
              className="h-1 w-16 accent-[var(--primary)]"
            />
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={prev} disabled={!hasPrev} aria-label="Previous track" className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-30">
              <SkipBack className="h-4 w-4" />
            </button>
            <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
            </button>
            <button onClick={next} disabled={!hasNext} aria-label="Next track" className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-30">
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
          <button onClick={stop} aria-label="Stop music" className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}