import { useState, useEffect } from "react";
// import { LoadingDots } from "@openai/apps-sdk-ui/components/Indicator";
import INHOUSE_LOGO from "../../public/inhouselogo-50x50.jpg";
// import US_MAP from "../../public/usa-map.jpg";
import US_MAP from "../../public/usa-map-3x.jpg";
interface TransitionScreenProps {
  message?: string;
  rotatingMessages?: string[];
  intervalMs?: number;
}

const DEFAULT_ROTATING_MESSAGES = [
  "Reviewing your chat...",
  "Identifying relevant legal issues...",
  "Searching our network of vetted lawyers...",
  "Preparing your match...",
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
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg gap-4">
      <img src={INHOUSE_LOGO} alt="Inhouse Logo" className="w-[50px]" />

      <p className="text-foreground-secondary animate-fade-in flex flex-row gap-4">
        <span className="text-[#000]">{displayMessage}</span>
        {/* <sub className="">
          <LoadingDots />
        </sub> */}
      </p>

      <img src={US_MAP} alt="USA Map" className="w-[100%] max-w-[250px]" />
      <p className="text-foreground-secondary animate-fade-in flex flex-row gap-4 text-[#000]">
        2,000+ lawyers in all 50 states
      </p>
    </div>
  );
}
