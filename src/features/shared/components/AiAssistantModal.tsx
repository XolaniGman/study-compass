import React, { useState } from "react";
import { X, Send, Bot, User, Sparkles, HelpCircle, ShieldCheck, GraduationCap } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: "student" | "support" | "admin";
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  "How do I apply for exam extra time (15-20 min/hr) at DUT?",
  "What does a moderate reading indicator mean for my exams?",
  "Which study exercise helps best with ADHD focus and task paralysis?",
  "Where are the Disability Unit offices located on DUT campuses?",
  "Can I type my exam answers on a Disability Unit monitored PC?",
];

const KNOWLEDGE_BASE: Record<string, string> = {
  "extra time":
    "DUT Disability Unit policy grants exam accommodations including 15 to 20 minutes extra time per hour, separate quiet venues, and ergonomic seating. You can submit an application directly via the 'DUT Support & Bookings' tab, attaching your screening report. A registered educational psychologist will review your file.",
  "reading":
    "A moderate reading indicator indicates visual tracking fatigue, line skipping, or slower lexical decoding under timed exam pressure. Recommended strategies include using our Guided Text-to-Speech reader, colored reading tint overlays, and requesting digital courseware with screen-reader access.",
  "adhd":
    "For ADHD and executive focus friction, research strongly supports task-chunking (breaking 2,000-word assignments into 4 sub-steps) paired with low-frequency acoustic masking (such as the continuous Deep Brown Noise generator built into our Focus Sprint tool).",
  "campus":
    "DUT Disability Unit Offices:\n• ML Sultan Campus: Disability Care Centre, Room A1-14 (Tel: 031 373 2489)\n• Steve Biko Campus: Library Student Services, 2nd Floor (Tel: 031 373 2038)\n• Ritson Campus: Academic Support Hub, Room R204\n• Indumiso Campus (PMB): Midlands Student Wellness Building.",
  "type":
    "Yes! Students with dysgraphia, motor writing fatigue, or orthographic processing challenges can be authorized to type examinations on a secure, offline laptop monitored by the Disability Unit invigilators.",
};

export function AiAssistantModal({ isOpen, onClose }: AiAssistantModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Hello! I am your DUT Study Compass AI Assistant. I can help you understand your screening indicators, recommended study tools, exam extra-time applications, and DUT Disability Unit services. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    setIsTyping(true);

    // Generate intelligent contextual response
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let responseText =
        "Thank you for reaching out. Based on DUT 2026 Academic Support guidelines, your preliminary screening indicators are designed to help you pinpoint specific cognitive strengths and request individualized accommodations. You can review your full screening certificate or book an intake appointment with Dr. N. Dube directly through the portal.";

      if (lower.includes("extra time") || lower.includes("time") || lower.includes("exam")) {
        responseText = KNOWLEDGE_BASE["extra time"]!;
      } else if (lower.includes("reading") || lower.includes("dyslexia") || lower.includes("text")) {
        responseText = KNOWLEDGE_BASE["reading"]!;
      } else if (lower.includes("adhd") || lower.includes("focus") || lower.includes("attention")) {
        responseText = KNOWLEDGE_BASE["adhd"]!;
      } else if (lower.includes("office") || lower.includes("location") || lower.includes("campus") || lower.includes("where")) {
        responseText = KNOWLEDGE_BASE["campus"]!;
      } else if (lower.includes("type") || lower.includes("laptop") || lower.includes("pc") || lower.includes("writing")) {
        responseText = KNOWLEDGE_BASE["type"]!;
      }

      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl border border-border bg-card shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 p-5 bg-gradient-to-r from-primary/10 via-card to-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-medium text-foreground">
                  AI Screening Advisor
                </h3>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  DUT Online
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-light">
                Calibrated for DUT Disability Unit policies &amp; neurodiversity support
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Close Assistant"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat History Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[300px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/15 text-primary border border-primary/20"
                }`}
              >
                {msg.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm space-y-1 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted/40 border border-border text-foreground rounded-tl-none font-light"
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[9px] font-mono text-right ${
                    msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-light pl-10">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-spin" />
              <span>AI Advisor is consulting screening policies...</span>
            </div>
          )}
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="p-3 border-t border-border/50 bg-muted/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1.5 px-1">
            Quick Questions:
          </span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                className="text-[11px] bg-background border border-border hover:border-primary/50 text-foreground px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="p-4 border-t border-border/70 flex gap-2 bg-card"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about screening, study tools, extra time..."
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button type="submit" size="sm" className="bg-primary text-primary-foreground rounded-xl px-4 text-xs gap-1.5">
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
