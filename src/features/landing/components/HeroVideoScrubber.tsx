import { useEffect, useRef } from "react";

function calcOpacity(
  progress: number,
  enterStart: number,
  enterEnd: number,
  exitStart: number,
  exitEnd: number
): number {
  if (progress < enterStart || progress > exitEnd) return 0;
  if (progress < enterEnd) return (progress - enterStart) / (enterEnd - enterStart);
  if (progress > exitStart) return Math.max(0, 1 - (progress - exitStart) / (exitEnd - exitStart));
  return 1.0;
}

export function HeroVideoScrubber() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const phase0Ref = useRef<HTMLDivElement>(null);
  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    let isMounted = true;
    let objectUrl: string | null = null;

    fetch("/assets/hero.mp4")
      .then((res) => {
        if (!res.ok) throw new Error("Video fetch failed");
        return res.blob();
      })
      .then((blob) => {
        if (!isMounted) return;
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
        video.load();
      })
      .catch(() => {
        if (!isMounted) return;
        video.src = "/assets/hero.mp4";
        video.load();
      });

    let targetProgress = 0;
    let currentProgress = 0;
    let animationFrameId: number;

    const updateScroll = () => {
      if (!heroSectionRef.current) return;
      const rect = heroSectionRef.current.getBoundingClientRect();
      const max = rect.height - window.innerHeight;
      if (max > 0) {
        targetProgress = Math.max(0, Math.min(1, -rect.top / max));
      }
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    updateScroll();

    const scrubLoop = () => {
      currentProgress += (targetProgress - currentProgress) * 0.15;

      if (video.duration && !video.seeking) {
        const targetTime = currentProgress * video.duration;
        if (Math.abs(video.currentTime - targetTime) > 0.015) {
          video.currentTime = targetTime;
        }
      }

      const op0 = calcOpacity(targetProgress, 0.0, 0.04, 0.2, 0.28);
      const op1 = calcOpacity(targetProgress, 0.28, 0.38, 0.55, 0.65);
      const op2 = calcOpacity(targetProgress, 0.65, 0.75, 0.9, 0.98);

      if (phase0Ref.current) {
        phase0Ref.current.style.opacity = op0.toFixed(3);
        phase0Ref.current.style.transform = `translateY(${-targetProgress * 40}px)`;
      }
      if (phase1Ref.current) {
        phase1Ref.current.style.opacity = op1.toFixed(3);
        phase1Ref.current.style.transform = `translateY(${(0.45 - targetProgress) * 35}px)`;
      }
      if (phase2Ref.current) {
        phase2Ref.current.style.opacity = op2.toFixed(3);
        phase2Ref.current.style.transform = `translateY(${(0.8 - targetProgress) * 35}px)`;
      }

      animationFrameId = requestAnimationFrame(scrubLoop);
    };

    animationFrameId = requestAnimationFrame(scrubLoop);

    return () => {
      isMounted = false;
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      cancelAnimationFrame(animationFrameId);
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  return (
    <section
      ref={heroSectionRef}
      aria-label="Hero video showcase"
      className="relative h-[400vh] w-full"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <video
          ref={heroVideoRef}
          id="hero-video"
          poster="/assets/hero_ref.jpg"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          playsInline
          muted
          preload="auto"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50 pointer-events-none" />

        {/* Phase 0 Typography */}
        <div
          ref={phase0Ref}
          className="phase-text absolute bottom-20 left-6 sm:left-12 lg:left-24 max-w-2xl pointer-events-none z-10"
        >
          <p className="text-xs font-medium tracking-widest uppercase text-emerald-300/90 mb-3">
            Study Compass — Institutional Screening
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tight">
            Learning Disability Detector &amp; Classifier
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-200 font-light leading-relaxed max-w-xl">
            A screening and support tool that helps university students identify possible
            learning difficulties early and connects them to appropriate support. This is not
            a formal diagnosis tool.
          </p>
          <div className="mt-6 flex items-center gap-3 text-xs tracking-wider uppercase text-neutral-300">
            <span className="h-px w-8 bg-neutral-400" />
            <span>Scroll down to enter dashboards</span>
          </div>
        </div>

        {/* Phase 1 Typography */}
        <div
          ref={phase1Ref}
          style={{ opacity: 0 }}
          className="phase-text absolute top-1/3 right-6 sm:right-12 lg:right-24 max-w-xl pointer-events-none z-10 text-right"
        >
          <p className="text-xs font-medium tracking-widest uppercase text-emerald-300/90 mb-3">
            Early Identification &amp; Growth
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-snug">
            Transforming academic screening into proactive support.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-200 font-light leading-relaxed ml-auto max-w-md">
            Screening indicators highlight reading, mathematical, and cognitive patterns
            early—paving the way for accommodations before difficulties compound.
          </p>
        </div>

        {/* Phase 2 Typography */}
        <div
          ref={phase2Ref}
          style={{ opacity: 0 }}
          className="phase-text absolute bottom-24 left-6 sm:left-12 lg:left-24 max-w-xl pointer-events-none z-10"
        >
          <p className="text-xs font-medium tracking-widest uppercase text-emerald-300/90 mb-3">
            Coordinated Campus Pathways
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-snug">
            Three connected portals for student success.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-200 font-light leading-relaxed max-w-md">
            Customized interfaces designed for students, specialized DUT Disability Unit
            coordinators, and system administrators.
          </p>
        </div>
      </div>
    </section>
  );
}
