import { ASSESSMENT_MODULES } from "../data/assessment-modules";
import type { DomainId, DomainResult, ScreeningLevel, ScreeningSessionRecord } from "../types";

const DOMAIN_METADATA: Record<
  DomainId,
  {
    title: string;
    color: string;
    strengthsTypical: string[];
    strengthsIndicator: string[];
    challenges: string[];
    accommodations: string[];
    exercises: string[];
  }
> = {
  reading: {
    title: "Reading & Lexical Processing",
    color: "bg-chart-2",
    strengthsTypical: ["Rapid lexical decoding", "Consistent reading comprehension speed"],
    strengthsIndicator: ["Strong verbal listening comprehension", "High conceptual grasp of spoken lectures"],
    challenges: ["Visual tracking fatigue during dense texts", "Slower reading rate under timed exam pressure"],
    accommodations: [
      "15 minutes per hour additional exam reading time",
      "Access to digital courseware compatible with screen readers / Text-to-Speech",
      "High-contrast, dyslexia-friendly colored reading overlays / tinted exam paper",
    ],
    exercises: [
      "Guided Academic Text Processing with Text-to-Speech",
      "Saccadic Reading Ruler practice",
      "Bionic Highlighting study sessions",
    ],
  },
  math: {
    title: "Mathematics & Quantitative Reasoning",
    color: "bg-chart-5",
    strengthsTypical: ["Fast mental arithmetic", "Accurate spatial number mapping"],
    strengthsIndicator: ["Intuitive big-picture problem solving", "Creative qualitative reasoning"],
    challenges: ["Digit reversal/transposition in calculations", "Symbolic memory retrieval under stress"],
    accommodations: [
      "Permission to utilize basic memory-aid reference sheet for standard formulas",
      "Use of accessible scientific calculator during invigilated assessments",
      "Graph paper with enlarged grid scaling for technical engineering drawings",
    ],
    exercises: [
      "Number-Pattern & Spatial Equation Worksheets",
      "Step-by-step formula breakdown practice",
      "Visual-spatial magnitude drills",
    ],
  },
  writing: {
    title: "Written Expression & Motor Stamina",
    color: "bg-chart-1",
    strengthsTypical: ["Fluid handwriting speed", "Spontaneous structural organization"],
    strengthsIndicator: ["High verbal articulateness in presentations", "Rich vocabulary in spoken discussions"],
    challenges: ["Motor fatigue / hand cramping during long essays", "Translating complex ideas into written structure"],
    accommodations: [
      "Permission to type exam responses on a Disability Unit monitored laptop",
      "Use of speech-to-text dictation software for lengthy term papers",
      "Spelling and grammar grace allowance for timed handwritten essay assessments",
    ],
    exercises: [
      "PEEL Academic Paragraph Builder",
      "Speech-to-text dictation workflow practice",
      "Ergonomic writing intervals & motor warmups",
    ],
  },
  attention: {
    title: "Attention, Focus & Executive Function",
    color: "bg-chart-3",
    strengthsTypical: ["Prolonged lecture vigilance", "Consistent self-paced task initiation"],
    strengthsIndicator: ["Intense hyperfocus on engaging projects", "Rapid out-of-the-box lateral thinking"],
    challenges: ["Executive inertia / task initiation delay", "Susceptibility to environmental auditory distractions"],
    accommodations: [
      "Separate, low-distraction quiet testing venue for major assessments",
      "Noise-cancelling headphone authorization in university computer labs",
      "Chunked assignment deadline checkpoints negotiated with faculty",
    ],
    exercises: [
      "Interval Focus & Task-Chunking Sprint Technique",
      "Synthesized Brown Noise & Binaural focus sessions",
      "Daily lecture summary chunker",
    ],
  },
};

export function classifyScore(score: number): {
  level: ScreeningLevel;
  levelLabel: string;
} {
  if (score < 25) {
    return { level: "typical", levelLabel: "Typical Range (Low Risk)" };
  }
  if (score < 50) {
    return { level: "mild", levelLabel: "Mild Difficulty Indicator" };
  }
  if (score < 75) {
    return { level: "moderate", levelLabel: "Moderate Indicator" };
  }
  return { level: "needs-attention", levelLabel: "Needs Attention (High Priority)" };
}

export function evaluateDomainAnswers(
  domain: DomainId,
  answers: Record<string, number>
): DomainResult {
  const meta = DOMAIN_METADATA[domain];
  const mod = ASSESSMENT_MODULES.find((m) => m.domain === domain);
  const questions = mod ? mod.questions : [];

  let raw = 0;
  let max = questions.length * 3; // Likert scale 0-3

  questions.forEach((q) => {
    const val = answers[q.id];
    if (typeof val === "number") {
      raw += val;
    }
  });

  const percentage = max > 0 ? Math.round((raw / max) * 100) : 0;
  const { level, levelLabel } = classifyScore(percentage);

  let summary = "";
  if (level === "typical") {
    summary = `Responses indicate standard processing within typical academic expectations for ${meta.title.toLowerCase()}.`;
  } else if (level === "mild") {
    summary = `Slight performance friction detected in ${meta.title.toLowerCase()}, primarily emerging under peak exam or heavy reading loads.`;
  } else if (level === "moderate") {
    summary = `Noticeable screening indicators observed in ${meta.title.toLowerCase()}. Targeted study strategies and unit check-ins are recommended.`;
  } else {
    summary = `Significant screening flags observed in ${meta.title.toLowerCase()}. We recommend booking a formal DUT Disability Unit consultation for assessment accommodations.`;
  }

  const strengths =
    level === "typical"
      ? meta.strengthsTypical
      : [...meta.strengthsIndicator, ...meta.strengthsTypical.slice(0, 1)];

  return {
    domain,
    domainTitle: meta.title,
    score: percentage,
    rawScore: raw,
    maxScore: max,
    level,
    levelLabel,
    color: meta.color,
    summary,
    primaryStrengths: strengths,
    challengeAreas: meta.challenges,
    recommendedAccommodations: meta.accommodations,
    suggestedExercises: meta.exercises,
  };
}

export function compileScreeningSession(
  answers: Record<string, number>,
  moduleId: string | "all-comprehensive"
): ScreeningSessionRecord {
  const domains: DomainId[] = ["reading", "math", "writing", "attention"];
  const domainResults: Record<DomainId, DomainResult> = {} as any;

  let totalScore = 0;
  let highestScore = -1;
  let highestDomain: DomainId = "reading";

  domains.forEach((d) => {
    const res = evaluateDomainAnswers(d, answers);
    domainResults[d] = res;
    totalScore += res.score;
    if (res.score > highestScore) {
      highestScore = res.score;
      highestDomain = d;
    }
  });

  const overallIndex = Math.round(totalScore / domains.length);
  const moduleInfo =
    moduleId === "all-comprehensive"
      ? "Comprehensive 4-Domain Screening Battery"
      : ASSESSMENT_MODULES.find((m) => m.id === moduleId)?.title || "Modular Assessment";

  return {
    id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    completedAt: new Date().toISOString(),
    moduleId,
    moduleTitle: moduleInfo,
    answers,
    domainResults,
    overallIndex,
    primaryConcernDomain: highestScore >= 25 ? highestDomain : undefined,
  };
}
