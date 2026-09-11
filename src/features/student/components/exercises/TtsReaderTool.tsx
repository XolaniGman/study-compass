import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Volume2, Type, Sparkles, BookOpen, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Slider } from "../../../../components/ui/slider";
import { Badge } from "../../../../components/ui/badge";

interface TtsReaderToolProps {
  onComplete: () => void;
}

const SAMPLE_ARTICLES = [
  {
    id: "ict-cloud",
    title: "Cloud Computing Architecture in Modern ICT Systems",
    content:
      "Cloud computing represents a paradigm shift in information technology infrastructure. Distributed virtualization layers allow compute and storage resources to scale dynamically across remote data centers. For software engineers, decoupling database instances from stateless application containers enhances fault tolerance, load balancing, and multi-tenant security frameworks.",
  },
  {
    id: "study-metacognition",
    title: "Metacognitive Strategies for University Learning",
    content:
      "Metacognition is defined as thinking about one's own thinking. University students who actively monitor their comprehension—by questioning core assumptions, creating conceptual mind maps, and summarizing key textbook chapters in their own words—demonstrate significantly higher retention rates during high-stakes examinations.",
  },
  {
    id: "algorithms-data",
    title: "Algorithmic Complexity & Asymptotic Notation",
    content:
      "In computer science, Big O notation characterizes the execution time or space requirements of an algorithm as the input size grows toward infinity. Understanding whether an algorithm operates in logarithmic, linear, or quadratic time enables engineers to design performant and scalable software architectures.",
  },
];

export function TtsReaderTool({ onComplete }: TtsReaderToolProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string>("ict-cloud");
  const [customText, setCustomText] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);

  // Reader styling controls
  const [fontSize, setFontSize] = useState<number>(18);
  const [letterSpacing, setLetterSpacing] = useState<number>(1);
  const [lineHeight, setLineHeight] = useState<number>(1.8);
  const [useDyslexicFont, setUseDyslexicFont] = useState(false);
  const [tintOverlay, setTintOverlay] = useState<string>("none");
  const [bionicMode, setBionicMode] = useState(false);

  // TTS Controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const activeText = isCustom
    ? customText || "Please paste your study notes here..."
    : SAMPLE_ARTICLES.find((a) => a.id === selectedArticleId)?.content || "";

  const words = activeText.split(/\s+/);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeText);
    utterance.rate = rate;
    utteranceRef.current = utterance;

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const textUpToChar = activeText.substring(0, event.charIndex);
        const wordIdx = textUpToChar.trim().split(/\s+/).length - 1;
        setCurrentWordIndex(wordIdx);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    }
  };

  // Helper to render bionic reading formatting (bold first half of each word)
  const renderFormattedWord = (word: string, index: number) => {
    const isHighlighted = index === currentWordIndex;
    const mid = Math.ceil(word.length / 2);
    const prefix = word.slice(0, mid);
    const suffix = word.slice(mid);

    return (
      <span
        key={index}
        className={`inline-block mr-1.5 transition-colors rounded px-0.5 ${
          isHighlighted ? "bg-amber-300 text-black font-semibold ring-2 ring-amber-400" : ""
        }`}
      >
        {bionicMode ? (
          <>
            <strong className="font-bold text-foreground">{prefix}</strong>
            <span>{suffix}</span>
          </>
        ) : (
          word
        )}
      </span>
    );
  };

  const tintStyles: Record<string, string> = {
    none: "bg-card text-foreground",
    amber: "bg-amber-50/90 text-amber-950 border-amber-200",
    mint: "bg-emerald-50/90 text-emerald-950 border-emerald-200",
    sky: "bg-sky-50/90 text-sky-950 border-sky-200",
    rose: "bg-rose-50/90 text-rose-950 border-rose-200",
    sepia: "bg-[#fbf0d9] text-[#433422] border-[#ebd6ab]",
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Article selection & mode */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">Select Study Material</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_ARTICLES.map((article) => (
            <button
              key={article.id}
              onClick={() => {
                handleStop();
                setIsCustom(false);
                setSelectedArticleId(article.id);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                !isCustom && selectedArticleId === article.id
                  ? "bg-primary text-primary-foreground border-primary font-medium shadow-sm"
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              }`}
            >
              {article.title.split(" ")[0]} ({article.title.split(" ").slice(1, 3).join(" ")})
            </button>
          ))}
          <button
            onClick={() => {
              handleStop();
              setIsCustom(true);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              isCustom
                ? "bg-primary text-primary-foreground border-primary font-medium shadow-sm"
                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            }`}
          >
            + Paste Custom Text
          </button>
        </div>
      </div>

      {isCustom && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Paste your lecture notes, article excerpts, or textbook paragraphs:
          </label>
          <textarea
            value={customText}
            onChange={(e) => {
              handleStop();
              setCustomText(e.target.value);
            }}
            placeholder="Paste your course notes or revision text here..."
            className="w-full h-28 p-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      )}

      {/* Accessibility & Visual Customization Controls */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-xl border border-border bg-muted/30 p-4">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Font Size ({fontSize}px)</span>
          </div>
          <Slider
            value={[fontSize]}
            onValueChange={(vals: number[]) => {
              const val = vals[0];
              if (typeof val === "number") setFontSize(val);
            }}
            min={14}
            max={26}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Letter Spacing (+{letterSpacing}px)</span>
          </div>
          <Slider
            value={[letterSpacing]}
            onValueChange={(vals: number[]) => {
              const val = vals[0];
              if (typeof val === "number") setLetterSpacing(val);
            }}
            min={0}
            max={4}
            step={0.5}
            className="w-full"
          />
        </div>

        <div>
          <span className="text-xs text-muted-foreground block mb-1.5">Scotopic Color Tint</span>
          <div className="flex items-center gap-1.5">
            {(["none", "amber", "mint", "sky", "rose", "sepia"] as const).map((tint) => (
              <button
                key={tint}
                onClick={() => setTintOverlay(tint)}
                title={`Tint: ${tint}`}
                className={`h-6 w-6 rounded-full border transition-transform ${
                  tint === "none"
                    ? "bg-card border-border"
                    : tint === "amber"
                    ? "bg-amber-200 border-amber-400"
                    : tint === "mint"
                    ? "bg-emerald-200 border-emerald-400"
                    : tint === "sky"
                    ? "bg-sky-200 border-sky-400"
                    : tint === "rose"
                    ? "bg-rose-200 border-rose-400"
                    : "bg-[#eeddb2] border-[#cbb382]"
                } ${tintOverlay === tint ? "scale-110 ring-2 ring-primary ring-offset-1" : "opacity-70 hover:opacity-100"}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 sm:pt-0">
          <Button
            type="button"
            variant={bionicMode ? "default" : "outline"}
            size="sm"
            onClick={() => setBionicMode(!bionicMode)}
            className="text-xs w-full"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            {bionicMode ? "Bionic: ON" : "Bionic Reading"}
          </Button>
        </div>
      </div>

      {/* Reader Container with active tint and formatting */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 min-h-[200px] shadow-inner transition-all ${
          tintStyles[tintOverlay]
        }`}
        style={{
          fontSize: `${fontSize}px`,
          letterSpacing: `${letterSpacing}px`,
          lineHeight: lineHeight,
          fontFamily: useDyslexicFont
            ? '"OpenDyslexic", "Comic Sans MS", cursive, sans-serif'
            : "inherit",
        }}
      >
        <p className="leading-relaxed">
          {words.map((word, idx) => renderFormattedWord(word, idx))}
        </p>
      </div>

      {/* Bottom Audio Playback Controller Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          {!isPlaying ? (
            <Button onClick={handlePlay} size="sm" className="bg-primary text-primary-foreground gap-2">
              <Play className="h-4 w-4" />
              <span>Read Aloud</span>
            </Button>
          ) : (
            <Button onClick={handlePause} size="sm" variant="secondary" className="gap-2">
              <Pause className="h-4 w-4" />
              <span>Pause Speech</span>
            </Button>
          )}

          <Button onClick={handleStop} size="sm" variant="outline" className="gap-1.5 text-xs">
            <Square className="h-3.5 w-3.5" />
            <span>Stop</span>
          </Button>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border text-xs text-muted-foreground">
            <Volume2 className="h-4 w-4 text-primary" />
            <span>Speed:</span>
            {[0.85, 1.0, 1.25].map((s) => (
              <button
                key={s}
                onClick={() => setRate(s)}
                className={`px-2 py-0.5 rounded text-xs ${
                  rate === s
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => {
            handleStop();
            onComplete();
          }}
          variant="outline"
          className="w-full sm:w-auto text-emerald-600 border-emerald-600/30 hover:bg-emerald-500/10 gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Mark Completed (+1 Streak)</span>
        </Button>
      </div>
    </div>
  );
}
