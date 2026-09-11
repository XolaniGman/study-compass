import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle, Plus, Trash2, Headphones, BellRing } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Slider } from "../../../../components/ui/slider";
import { Badge } from "../../../../components/ui/badge";

interface PomodoroFocusToolProps {
  onComplete: () => void;
}

type SoundscapeType = "none" | "brown-noise" | "theta-wave" | "cafe-tone";

export function PomodoroFocusTool({ onComplete }: PomodoroFocusToolProps) {
  // Timer state
  const SPRINT_SECONDS = 25 * 60;
  const BREAK_SECONDS = 5 * 60;
  const [mode, setMode] = useState<"sprint" | "break">("sprint");
  const [secondsRemaining, setSecondsRemaining] = useState(SPRINT_SECONDS);
  const [isActive, setIsActive] = useState(false);

  // Audio synthesis state
  const [soundscape, setSoundscape] = useState<SoundscapeType>("brown-noise");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{ source?: AudioNode; gain?: GainNode } | null>(null);

  // Task chunker state
  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: "t1", text: "Read ICT Lecture 3: Database Normalization (Pages 1-12)", done: true },
    { id: "t2", text: "Draft 2nd Normal Form explanation with diagram", done: false },
    { id: "t3", text: "Summarize 3NF anomalies for tutorial submission", done: false },
  ]);
  const [newTaskInput, setNewTaskInput] = useState("");

  // Timer interval effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsActive(false);
      stopAudio();
      if (mode === "sprint") {
        setMode("break");
        setSecondsRemaining(BREAK_SECONDS);
        onComplete();
      } else {
        setMode("sprint");
        setSecondsRemaining(SPRINT_SECONDS);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining, mode]);

  // Audio synthesis engine using Web Audio API
  const startAudio = (type: SoundscapeType) => {
    stopAudio();
    if (type === "none") {
      setIsAudioPlaying(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (type === "brown-noise") {
        // Generate continuous Brown Noise (random walk)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02;
          output[i] = lastOut * 3.5;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Low-pass filter to make it deeply soothing
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();

        soundNodesRef.current = { source: whiteNoise, gain: masterGain };
      } else if (type === "theta-wave") {
        // Binaural Theta Tone (210 Hz left, 216 Hz right = 6 Hz Theta pulse)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        oscL.type = "sine";
        oscR.type = "sine";
        oscL.frequency.setValueAtTime(210, ctx.currentTime);
        oscR.frequency.setValueAtTime(216, ctx.currentTime);

        const merger = ctx.createChannelMerger(2);
        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(masterGain);

        oscL.start();
        oscR.start();

        soundNodesRef.current = { source: oscL, gain: masterGain };
      } else if (type === "cafe-tone") {
        // Gentle warm pink noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.5;
        }
        const pinkNoise = ctx.createBufferSource();
        pinkNoise.buffer = noiseBuffer;
        pinkNoise.loop = true;
        pinkNoise.connect(masterGain);
        pinkNoise.start();

        soundNodesRef.current = { source: pinkNoise, gain: masterGain };
      }

      setIsAudioPlaying(true);
    } catch (err) {
      console.error("Web Audio error:", err);
    }
  };

  const stopAudio = () => {
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {
        console.error(e);
      }
      audioCtxRef.current = null;
      soundNodesRef.current = null;
    }
    setIsAudioPlaying(false);
  };

  useEffect(() => {
    if (soundNodesRef.current?.gain && audioCtxRef.current) {
      soundNodesRef.current.gain.gain.setValueAtTime(
        volume * 0.25,
        audioCtxRef.current.currentTime
      );
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggleTimer = () => {
    if (!isActive) {
      setIsActive(true);
      if (soundscape !== "none" && !isAudioPlaying) {
        startAudio(soundscape);
      }
    } else {
      setIsActive(false);
      stopAudio();
    }
  };

  const handleReset = () => {
    setIsActive(false);
    stopAudio();
    setSecondsRemaining(mode === "sprint" ? SPRINT_SECONDS : BREAK_SECONDS);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks([
      ...tasks,
      { id: `t-${Date.now()}`, text: newTaskInput.trim(), done: false },
    ]);
    setNewTaskInput("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const progressPercent =
    mode === "sprint"
      ? ((SPRINT_SECONDS - secondsRemaining) / SPRINT_SECONDS) * 100
      : ((BREAK_SECONDS - secondsRemaining) / BREAK_SECONDS) * 100;

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => {
            setIsActive(false);
            stopAudio();
            setMode("sprint");
            setSecondsRemaining(SPRINT_SECONDS);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
            mode === "sprint"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          25-Min Study Sprint
        </button>
        <button
          onClick={() => {
            setIsActive(false);
            stopAudio();
            setMode("break");
            setSecondsRemaining(BREAK_SECONDS);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
            mode === "break"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          5-Min Cognitive Rest
        </button>
      </div>

      {/* Main Countdown Visual Card */}
      <div className="rounded-3xl border border-border bg-gradient-to-b from-card via-card/80 to-muted/20 p-8 text-center relative overflow-hidden shadow-sm">
        {/* Progress Background bar */}
        <div
          className="absolute bottom-0 left-0 h-1.5 bg-primary transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />

        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          {mode === "sprint" ? "Focus Sprint Session" : "Rest & Reset Window"}
        </span>

        <div className="mt-4 font-mono text-6xl sm:text-7xl font-bold tracking-tighter text-foreground">
          {formatTime(secondsRemaining)}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            onClick={handleToggleTimer}
            size="lg"
            className={`px-8 gap-2 font-medium rounded-xl text-sm ${
              isActive
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-primary text-primary-foreground shadow-md shadow-primary/20"
            }`}
          >
            {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span>{isActive ? "Pause Sprint" : "Start Sprint"}</span>
          </Button>

          <Button
            onClick={handleReset}
            size="lg"
            variant="outline"
            className="rounded-xl px-4 text-xs"
            title="Reset Timer"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Background Sound Masking Synthesizer */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Focus Audio Masking (Synthetic Noise)
            </span>
          </div>
          {isAudioPlaying && (
            <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 animate-pulse">
              Audio Active
            </Badge>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-4">
          {[
            { id: "none", label: "Mute Audio" },
            { id: "brown-noise", label: "Deep Brown Noise" },
            { id: "theta-wave", label: "Theta Waves (6Hz)" },
            { id: "cafe-tone", label: "Pink Noise" },
          ].map((snd) => (
            <button
              key={snd.id}
              onClick={() => {
                const newSound = snd.id as SoundscapeType;
                setSoundscape(newSound);
                if (isActive || isAudioPlaying) {
                  startAudio(newSound);
                }
              }}
              className={`text-xs px-3 py-2 rounded-xl border transition-all text-left flex items-center justify-between ${
                soundscape === snd.id
                  ? "bg-primary/10 border-primary text-primary font-medium"
                  : "bg-muted/40 border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>{snd.label}</span>
              {soundscape === snd.id && <div className="h-2 w-2 rounded-full bg-primary" />}
            </button>
          ))}
        </div>

        {soundscape !== "none" && (
          <div className="flex items-center gap-3 pt-2">
            <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <Slider
              value={[volume * 100]}
              onValueChange={(vals: number[]) => {
                const val = vals[0];
                if (typeof val === "number") setVolume(val / 100);
              }}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <span className="text-xs font-mono text-muted-foreground w-10 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Task Chunker & Checklist */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Active Study Chunks (Break large assignments down)
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            {tasks.filter((t) => t.done).length}/{tasks.length} Done
          </span>
        </div>

        <form onSubmit={handleAddTask} className="flex gap-2">
          <input
            type="text"
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            placeholder="Add a micro-task for this sprint (e.g. Write Introduction section)..."
            className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button type="submit" size="sm" className="rounded-xl px-3 text-xs gap-1">
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </Button>
        </form>

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                task.done
                  ? "bg-muted/40 border-border/50 text-muted-foreground line-through"
                  : "bg-background border-border text-foreground hover:border-primary/40"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 text-xs text-left flex-1"
              >
                <div
                  className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                    task.done ? "bg-primary border-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {task.done && <CheckCircle className="h-3 w-3" />}
                </div>
                <span>{task.text}</span>
              </button>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                title="Remove task"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Completion Action */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={() => {
            stopAudio();
            onComplete();
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Complete Study Sprint Session (+1 Streak)</span>
        </Button>
      </div>
    </div>
  );
}
