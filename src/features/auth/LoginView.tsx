import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Simulated action: Authentication is visual only (no real backend connection).", {
      description: "You can explore the portals directly via the navigation pills below.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Column: Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-16 max-w-xl mx-auto w-full">
        {/* Top bar: Brand + Back link */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/30 transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-medium tracking-tight text-foreground block leading-tight">
                Study Compass
              </span>
              <span className="text-[10px] tracking-wider uppercase text-muted-foreground font-mono">
                DUT Screening System
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="my-auto py-10 space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3" />
              <span>DUT Portal Gateway</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-foreground">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Enter your university credentials to access student screening indicators, tests, or disability unit triage.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Student ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">
                DUT Email or Student / Staff ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. 22100412@dut4life.ac.za"
                  className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-foreground">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    toast.info("Simulated action: Password reset link dispatched to DUT email.")
                  }
                  className="text-[11px] text-primary hover:underline font-light"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-10 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-3 rounded-xl gap-2 font-medium shadow-md shadow-primary/20 transition-all"
            >
              <span>Sign In</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </form>

          {/* Quick links to explore simulated portals directly */}
          <div className="pt-4 border-t border-border/70 space-y-3">
            <p className="text-[11px] text-muted-foreground font-light text-center">
              Direct access to simulated role dashboards:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                to="/student"
                className="text-[11px] font-mono px-3 py-1 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors"
              >
                Student Portal &rarr;
              </Link>
              <Link
                to="/support"
                className="text-[11px] font-mono px-3 py-1 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors"
              >
                Disability Staff &rarr;
              </Link>
              <Link
                to="/admin"
                className="text-[11px] font-mono px-3 py-1 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors"
              >
                Administrator &rarr;
              </Link>
            </div>
          </div>

          {/* Switch to Register */}
          <p className="text-center text-xs text-muted-foreground font-light">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer POPIA badge */}
        <div className="pt-4 border-t border-border/60 flex items-center gap-2 text-[11px] text-muted-foreground font-light">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>Protection of Personal Information Act (POPIA Act 4 of 2013) Compliant</span>
        </div>
      </div>

      {/* Right Column: Visual Campus Backdrop */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-slate-950">
        <img
          src="/assets/cards/student_banner_bg.jpg"
          alt="Durban University of Technology Campus Library"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/30" />

        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full backdrop-blur-md">
              Durban University of Technology
            </span>
          </div>

          <div className="space-y-4 max-w-lg">
            <h2 className="font-serif text-3xl sm:text-4xl font-light leading-tight">
              &ldquo;Empowering every student to achieve their full academic potential through personalized screening &amp; assistive support.&rdquo;
            </h2>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Study Compass provides early psychometric screening indicators for university students and connects them with the DUT Disability Unit.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-emerald-400">
              <span>ML Sultan</span> &bull; <span>Steve Biko</span> &bull; <span>Ritson</span> &bull; <span>Indumiso</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            &copy; 2026 Durban University of Technology Disability Unit
          </div>
        </div>
      </div>
    </div>
  );
}
