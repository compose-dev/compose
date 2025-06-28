import { useEffect, useState } from "react";
import { classNames } from "~/utils/classNames";

interface ProgressBarProps {
  appearance: "primary" | "neutral";
  percentComplete: number;
}

function ProgressBar({ appearance, percentComplete }: ProgressBarProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    setAnimatedPercent(Math.max(0, Math.min(100, percentComplete)));
  }, [percentComplete]);

  return (
    <div className="w-full bg-brand-overlay-2 rounded-full h-2 overflow-hidden">
      <div
        className={classNames(
          "h-full rounded-full transition-all duration-300 ease-out",
          {
            "animated-progress-bar": appearance === "primary",
            "bg-brand-neutral": appearance === "neutral",
          }
        )}
        style={{
          width: `${animatedPercent}%`,
          backgroundImage:
            appearance === "primary"
              ? `linear-gradient(to right, var(--brand-primary-light), var(--brand-primary-heavy), var(--brand-primary-light))`
              : undefined,
        }}
      />
    </div>
  );
}

export default ProgressBar;
