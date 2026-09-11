import { HeroVideoScrubber } from "./components/HeroVideoScrubber";
import { PortalCards } from "./components/PortalCards";
import { DiagnosticPillars } from "./components/DiagnosticPillars";
import { SupportShowcase } from "./components/SupportShowcase";
import { ScreeningDisclaimer } from "./components/ScreeningDisclaimer";

export function LandingView() {
  return (
    <div className="relative w-full bg-background text-foreground">
      <HeroVideoScrubber />
      <PortalCards />
      <DiagnosticPillars />
      <SupportShowcase />
      <ScreeningDisclaimer />
    </div>
  );
}
