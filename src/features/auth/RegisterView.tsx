import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Building,
  MapPin,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export function RegisterView() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [faculty, setFaculty] = useState("Accounting & Informatics");
  const [campus, setCampus] = useState("Steve Biko Campus");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("Please agree to the DUT Screening Ethics Protocol & POPIA Notice.");
      return;
    }
    toast.info("Simulated action: Registration is visual only (no database write).", {
      description: "You can navigate directly into any simulated portal from the navigation links.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Column: Register Form */}
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
        <div className="my-auto py-8 space-y-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3" />
              <span>Student &amp; Staff Registration</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-foreground">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Register to access self-directed screening batteries, interactive exercises, or staff triage tools.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sibusiso Mkhize"
                  className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>

            {/* Email & ID Number (2-column on sm) */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">DUT Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@dut4life.ac.za"
                    className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">Student / Staff ID</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="e.g. 22100412"
                    className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Faculty & Campus */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">DUT Faculty</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  >
                    <option value="Accounting & Informatics">Accounting &amp; Informatics</option>
                    <option value="Engineering & Built Environment">Engineering &amp; Built Environment</option>
                    <option value="Health Sciences">Health Sciences</option>
                    <option value="Applied Sciences">Applied Sciences</option>
                    <option value="Management Sciences">Management Sciences</option>
                    <option value="Arts & Design">Arts &amp; Design</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">Primary Campus</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  >
                    <option value="Steve Biko Campus">Steve Biko Campus</option>
                    <option value="ML Sultan Campus">ML Sultan Campus</option>
                    <option value="Ritson Campus">Ritson Campus</option>
                    <option value="Brickfield Campus">Brickfield Campus</option>
                    <option value="Indumiso Campus (PMB)">Indumiso Campus (PMB)</option>
                    <option value="Riverside Campus (PMB)">Riverside Campus (PMB)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-9 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 mt-0.5"
                />
                <span className="leading-tight text-[11px] font-light">
                  I agree to the <strong>DUT Screening Ethics Protocol</strong> and acknowledge that all data is processed strictly in accordance with <strong>POPIA (Act 4 of 2013)</strong>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-3 rounded-xl gap-2 font-medium shadow-md shadow-primary/20 transition-all mt-2"
            >
              <span>Create Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </form>

          {/* Switch to Sign in */}
          <p className="text-center text-xs text-muted-foreground font-light pt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in instead
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
          src="/assets/cards/metric_support_bookings.jpg"
          alt="DUT Advisory Office"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/30" />

        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full backdrop-blur-md">
              DUT Disability &amp; Neurodiversity Unit
            </span>
          </div>

          <div className="space-y-4 max-w-lg">
            <h2 className="font-serif text-3xl sm:text-4xl font-light leading-tight">
              &ldquo;Join a campus culture committed to accessibility, inclusive learning, and proactive disability triage.&rdquo;
            </h2>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Registering lets you track your cognitive screening batteries, monitor assistive exercise streaks, and coordinate formal accommodations.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-emerald-400">
              <span>Confidential Triage</span> &bull; <span>Assistive Tools</span> &bull; <span>Exam Support</span>
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
