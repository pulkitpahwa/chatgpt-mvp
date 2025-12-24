import { useNavigate } from "react-router-dom";

const CheckIcon = () => (
  <svg
    className="w-12 h-12 text-green-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export interface SuccessScreenProps {
  description: string;
}

export function SuccessScreen({ description }: SuccessScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 bg-white min-h-[300px]">
      <div className="mb-4">
        <CheckIcon />
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank you!</h2>

      <p className="text-gray-600 text-center mb-8 max-w-xs">{description}</p>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={() => navigate("/")}
          className="w-full py-3 px-4 bg-[#1a1a2e] text-white font-medium rounded-full hover:bg-[#2a2a3e] transition-colors"
        >
          Got It
        </button>

        <button
          onClick={() => window.open("https://www.inhouse.ai", "_blank")}
          className="w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Explore Inhouse.ai
        </button>
      </div>
    </div>
  );
}
