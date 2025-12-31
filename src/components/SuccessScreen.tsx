// import { useNavigate } from "react-router-dom";

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
  // const navigate = useNavigate();
  window.openai?.notifyIntrinsicHeight?.();

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 bg-white min-h-[300px]">
      <div className="mb-4">
        <CheckIcon />
      </div>

      <h2 className="text-xl font-semibold text-black mb-2">Case Submitted</h2>

      <p className="text-gray-600 text-center mb-8 max-w-xs">{description}</p>

      <div className="w-full max-w-xs space-y-3">
        {/* <button
          onClick={() => navigate("/")}
          className="w-full py-3 px-4 bg-[#1a1a2e] text-white font-medium rounded-full hover:bg-[#2a2a3e] transition-colors"
        >
          Got It
        </button> */}

        <button
          onClick={() => window.open("https://www.inhouse.ai", "_blank")}
          className="w-full text-white mt-2 rounded-[999px] w-full bg-[#1B2B48] px-[24px] py-[12px]
                hover:bg-[#111827] flex items-center justify-center gap-2 transition-colors"
        >
          Explore Inhouse
        </button>
      </div>
    </div>
  );
}
