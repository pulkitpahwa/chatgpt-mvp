import { useState, useEffect } from "react";
import { LoadingSpinner } from "./Loading";
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
  intervalMs = 5000, // 15 seconds per message (45s total for 3 messages)
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
    <div className="flex flex-col items-center justify-center p-8 md:h-[400px] min-h-[200px] bg-[#F7F7F8] dark:bg-surface-dark rounded-lg gap-8">
      <img src={INHOUSE_LOGO_URL} alt="Inhouse Logo" className="w-64 my-4" />
      <LoadingSpinner size="md" />
      <p className="mt-4 text-sm text-text-secondary-light dark:text-text-secondary-dark animate-fade-in">
        {displayMessage}...
      </p>
    </div>
  );
}
