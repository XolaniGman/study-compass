import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Learning Disability Detector & Classifier System | Study Compass" },
      {
        name: "description",
        content:
          "A screening and support tool that helps university students identify possible learning difficulties early and connects them to appropriate support. This is not a formal diagnosis tool.",
      },
      {
        property: "og:title",
        content: "Learning Disability Detector & Classifier System",
      },
      {
        property: "og:description",
        content:
          "A screening and support tool that helps university students identify possible learning difficulties early and connects them to appropriate support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

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

function LandingPage() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const phase0Ref = useRef<HTMLDivElement>(null);
  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);

  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    let isMounted = true;
    let objectUrl: string | null = null;

    // In-memory Blob preloader with fallback
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
        setVideoLoaded(true);
      })
      .catch(() => {
        if (!isMounted) return;
        video.src = "/assets/hero.mp4";
        video.load();
        setVideoLoaded(true);
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

      // Scrub Video
      if (video.duration && !video.seeking) {
        const targetTime = currentProgress * video.duration;
        if (Math.abs(video.currentTime - targetTime) > 0.015) {
          video.currentTime = targetTime;
        }
      }

      // Progress-locked typography
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
    <div className="relative w-full bg-background text-foreground">
      {/* 400vh Sticky Scroll Hero Video Engine */}
      <section
        ref={heroSectionRef}
        aria-label="Hero showcase"
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

          {/* Editorial cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50 pointer-events-none" />

          {/* Phase 0 Typography (0% - 25% Scroll) */}
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

          {/* Phase 1 Typography (30% - 60% Scroll) */}
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

          {/* Phase 2 Typography (65% - 95% Scroll) */}
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

      {/* Role Selection Showcase */}
      <section
        id="roles"
        aria-label="Portal Selection"
        className="py-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto"
      >
        <div className="border-b border-border/80 pb-8 mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">
            System Portals
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-foreground">
            Select Your Designated Role
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground font-light leading-relaxed">
            Enter the simulated role portal to experience the interface tailored to students,
            disability support officers, and system administration.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Student Card */}
          <Link
            to="/student"
            className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
          >
            <div>
              <span className="text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase">
                Portal I
              </span>
              <h3 className="mt-4 font-serif text-2xl font-normal text-foreground group-hover:text-primary transition-colors">
                Student
              </h3>
              <p className="mt-4 text-sm text-muted-foreground font-light leading-relaxed">
                Explore available screening assessments, sample indicators, personalized
                recommended exercises, and DUT support contacts.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-foreground group-hover:text-primary transition-colors">
                Enter Student Dashboard
              </span>
              <span className="text-base font-light text-primary transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>

          {/* Support Staff Card */}
          <Link
            to="/support"
            className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
          >
            <div>
              <span className="text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase">
                Portal II
              </span>
              <h3 className="mt-4 font-serif text-2xl font-normal text-foreground group-hover:text-primary transition-colors">
                DUT Disability Unit / Staff
              </h3>
              <p className="mt-4 text-sm text-muted-foreground font-light leading-relaxed">
                Review screened student indicators, flagged support cases, pending referrals,
                and simulated case management workflows.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-foreground group-hover:text-primary transition-colors">
                Enter Support Dashboard
              </span>
              <span className="text-base font-light text-primary transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>

          {/* Administrator Card */}
          <Link
            to="/admin"
            className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
          >
            <div>
              <span className="text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase">
                Portal III
              </span>
              <h3 className="mt-4 font-serif text-2xl font-normal text-foreground group-hover:text-primary transition-colors">
                System Administrator
              </h3>
              <p className="mt-4 text-sm text-muted-foreground font-light leading-relaxed">
                Manage system users, configure screening questionnaires, curate exercise
                resources, and inspect high-level platform health.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-foreground group-hover:text-primary transition-colors">
                Enter Admin Dashboard
              </span>
              <span className="text-base font-light text-primary transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Looping Showcase Section: Assessment & Diagnostic Methodology */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border/60">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary">
              Screening Framework
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-foreground leading-snug">
              Evidence-Informed Screening Architecture
            </h2>
            <p className="mt-5 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
              Designed specifically for higher education environments, the detector evaluates
              multiple cognitive and academic dimensions without generating diagnostic labels.
            </p>

            <div className="mt-8 space-y-6">
              <div className="border-l-2 border-primary/40 pl-4">
                <h4 className="text-sm font-semibold text-foreground">
                  Reading &amp; Lexical Processing
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                  Evaluates reading fluency, phonological decoding patterns, and comprehension
                  pacing across academic literature.
                </p>
              </div>

              <div className="border-l-2 border-primary/40 pl-4">
                <h4 className="text-sm font-semibold text-foreground">
                  Mathematical &amp; Quantitative Fluency
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                  Tracks spatial number alignment, formula comprehension, and sequential
                  numerical problem-solving speed.
                </p>
              </div>

              <div className="border-l-2 border-primary/40 pl-4">
                <h4 className="text-sm font-semibold text-foreground">
                  Working Memory &amp; Attention
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                  Measures task-switching stamina, multi-step instruction retention, and
                  sustained focus during academic tasks.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg aspect-video">
              <video
                src="/assets/showcase.mp4"
                poster="/assets/showcase_ref.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-white/90">
                <span className="font-light">Personalized Learning Assessment Interface</span>
                <span className="font-mono text-[10px] tracking-wider uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur">
                  Simulated Overview
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disability Unit Consultation Showcase */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border/60">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg aspect-video">
              <video
                src="/assets/support.mp4"
                poster="/assets/support_ref.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-white/90">
                <span className="font-light">DUT Disability Unit Collaborative Advisory</span>
                <span className="font-mono text-[10px] tracking-wider uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur">
                  Support Network
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary">
              Institutional Integration
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-foreground leading-snug">
              Direct Bridge to DUT Disability Unit Support
            </h2>
            <p className="mt-5 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
              Screening is only the first step. Study Compass bridges student self-insights
              directly into confidential consultations, assistive technology provisions, and
              formal accommodation applications.
            </p>

            <div className="mt-8 space-y-4 text-sm text-muted-foreground font-light">
              <div className="flex items-start gap-3">
                <span className="text-primary font-serif font-bold">—</span>
                <span>Confidential appointment scheduling with qualified learning specialists</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-serif font-bold">—</span>
                <span>Assistive reading software, speech-to-text, and audio recording tools</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-serif font-bold">—</span>
                <span>Extra time and dedicated assessment venue recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Disclaimer */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-border/80 bg-muted/30 p-8 sm:p-10 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Screening &amp; Assessment Ethics
          </p>
          <h3 className="mt-3 font-serif text-xl sm:text-2xl font-light text-foreground">
            Important Screening Disclaimer
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-2xl mx-auto font-light">
            This system provides screening indicators only and does not replace professional or
            clinical psychological assessment. All dashboards, indicator categories, and
            exercises within this application are simulated for institutional demonstration.
          </p>
          <div className="mt-6">
            <Link
              to="/student"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Begin Student Screening
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
