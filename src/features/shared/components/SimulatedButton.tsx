import { toast } from "sonner";
import type { ButtonHTMLAttributes } from "react";

interface SimulatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  toastMessage?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
}

export function SimulatedButton({
  label,
  toastMessage,
  variant = "outline",
  size = "sm",
  className = "",
  ...props
}: SimulatedButtonProps) {
  const handleClick = () => {
    toast(toastMessage ?? `Simulated action: ${label.toLowerCase()}`);
  };

  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg cursor-pointer";

  const sizeStyles =
    size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm";

  const variantStyles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
      : variant === "ghost"
      ? "text-primary hover:bg-primary/10"
      : "border border-input bg-background text-foreground hover:bg-accent";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {label}
    </button>
  );
}
