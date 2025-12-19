import { useState, useEffect } from "react";
import { LoadingDots } from "@openai/apps-sdk-ui/components/Indicator";
import INHOUSE_LOGO_URL from "../../public/inhouse.svg";

interface TransitionScreenProps {
  message?: string;
  rotatingMessages?: string[];
  intervalMs?: number;
}

const DEFAULT_ROTATING_MESSAGES = [
  "Analyzing your chat",
  "Conducting research",
  "Finding lawyers with relevant experience",
];

export function TransitionScreen({
  message,
  rotatingMessages = DEFAULT_ROTATING_MESSAGES,
  intervalMs = 2000,
}: TransitionScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // If using static message, don't rotate
    if (message) return;

    // Don't rotate past the last message
    if (currentIndex >= rotatingMessages.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) =>
        Math.min(prev + 1, rotatingMessages.length - 1)
      );
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [currentIndex, message, rotatingMessages.length, intervalMs]);

  const displayMessage = message || rotatingMessages[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center p-8 md:h-[480px] min-h-[200px] bg-background-secondary rounded-lg gap-6">
      <img src={INHOUSE_LOGO_URL} alt="Inhouse Logo" className="w-64 my-4" />

      <p className="text-foreground-secondary animate-fade-in flex flex-row gap-4">
        <span>{displayMessage}</span>
        <sub className="">
          <LoadingDots />
        </sub>
      </p>
    </div>
  );
}
