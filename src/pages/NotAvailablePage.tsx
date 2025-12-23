// import { useNavigate } from "react-router-dom";
import { Button } from "@openai/apps-sdk-ui/components/Button";

const InfoIcon = () => (
  <svg
    className="w-6 h-6 text-blue-600 dark:text-blue-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export function NotAvailablePage() {
  // const navigate = useNavigate();

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <div className="bg-background-secondary rounded-xl p-6 shadow-sm border-[0.5px] border-[#0D0D0D26]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <InfoIcon />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground-primary">
              Service Not Available
            </h2>
            <p className="text-sm text-foreground-secondary">
              We're currently expanding our legal network
            </p>
          </div>
        </div>

        <div className="p-4 bg-background-tertiary rounded-lg mb-6">
          <p className="text-sm text-foreground-secondary mb-4">
            We're sorry, but we're not currently providing attorney matching
            services for this legal area.
          </p>
          <p className="text-sm text-foreground-secondary mb-4">
            Our current focus is on:
          </p>
          <ul className="text-sm text-foreground-secondary space-y-2 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-medium shrink-0">•</span>
              <span>Personal Injury cases</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-medium shrink-0">•</span>
              <span>Business Consultation</span>
            </li>
          </ul>
          <p className="text-sm text-foreground-secondary">
            We're actively working to expand our network to cover more legal
            areas in the future.
          </p>
        </div>

        <div className="space-y-3">
          <a href="https://www.inhouse.ai" target="_blank">
            <Button color="primary" className="text-white rounded-lg" block>
              Visit Inhouse
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
