import { LoadingSpinner } from "./Loading";
import INHOUSE_LOGO_URL from "../../public/inhouse.svg";

interface TransitionScreenProps {
  message?: string;
}

export function TransitionScreen({
  message = "Connecting to Legal Assistant...",
}: TransitionScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px] bg-[#F7F7F8] dark:bg-surface-dark rounded-lg">
      <img src={INHOUSE_LOGO_URL} alt="Inhouse Logo" className="w-64 my-4" />
      <LoadingSpinner size="md" />
      <p className="mt-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
        {message}
      </p>
    </div>
  );
}
