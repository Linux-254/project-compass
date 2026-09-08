import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { MusicTrack } from "@shared/music";

type MusicPlayerContextValue = {
  queue: MusicTrack[];
  current: MusicTrack | null;
  playing: boolean;
  progress: number;
  time: number;
  duration: number;
  volume: number;
  setVolume: (v: number) => void;
  play: (track: MusicTrack, queue?: MusicTrack[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
  hasNext: boolean;
  hasPrev: boolean;
};

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<MusicTrack[]>([]);
  const indexRef = useRef(-1);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const current = index >= 0 && index < queue.length ? queue[index] : null;
  const hasPrev = index > 0;
  const hasNext = index >= 0 && index < queue.length - 1;

  const loadAt = useCallback((ni: number) => {
    const el = audioRef.current;
    const list = queueRef.current;
    const t = list[ni];
    if (!el || !t?.url) return;
    if (el.dataset.src !== t.url) {
      el.dataset.src = t.url;
      el.src = t.url;
    }
    el.currentTime = 0;
    void el.play().catch(() => setPlaying(false));
  }, []);

  const play = useCallback(
    (track: MusicTrack, tracks?: MusicTrack[]) => {
      const list = tracks && tracks.length ? tracks : [track];
      const found = list.findIndex(t => t.id === track.id);
      const at = found >= 0 ? found : 0;
      setQueue(list);
      setIndex(at);
      setPlaying(true);
      loadAt(at);
    },
    [loadAt]
  );

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || indexRef.current < 0) return;
    if (el.paused) {
      void el.play().catch(() => setPlaying(false));
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
      el.dataset.src = "";
      el.currentTime = 0;
    }
    setPlaying(false);
    setQueue([]);
    setIndex(-1);
    setTime(0);
    setDuration(0);
  }, []);

  const next = useCallback(() => {
    if (indexRef.current >= queueRef.current.length - 1) return;
    const ni = indexRef.current + 1;
    setIndex(ni);
    loadAt(ni);
  }, [loadAt]);

  const prev = useCallback(() => {
    const el = audioRef.current;
    if (el && el.currentTime > 4) {
      el.currentTime = 0;
      return;
    }
    if (indexRef.current <= 0) return;
    const ni = indexRef.current - 1;
    setIndex(ni);
    loadAt(ni);
  }, [loadAt]);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.volume = volume;
  }, [volume]);

  return (
    <MusicPlayerContext.Provider
      value={{
        queue,
        current,
        playing,
        progress: duration ? Math.min(1, time / duration) : 0,
        time,
        duration,
        volume,
        setVolume,
        play,
        toggle,
        next,
        prev,
        stop,
        hasNext,
        hasPrev,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onDurationChange={e => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          if (indexRef.current >= queueRef.current.length - 1) {
            setPlaying(false);
            setTime(0);
          } else {
            next();
          }
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </MusicPlayerContext.Provider>
  );
}

export function useMusic() {
  const value = useContext(MusicPlayerContext);
  if (!value) throw new Error("useMusic must be used within a MusicPlayerProvider");
  return value;
}