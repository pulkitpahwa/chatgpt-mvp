import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Card, CardBody } from "../components/Card";
import { Button } from "../components/Button";
import { TransitionScreen } from "../components/TransitionScreen";
import INHOUSE_LOGO_URL from "../../public/inhouse.svg";

// Icons
const BriefcaseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const InjuryIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const DocumentIcon = () => (
  <svg
    className="w-5 h-5"
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

const InhouseIcon = () => (
  <img src={INHOUSE_LOGO_URL} alt="Inhouse Logo" className="w-64" />
);

export function Home() {
  const navigate = useNavigate();
  const { toolOutput, isLoading, isWaitingForBackend } = useAppContext();

  // Route based on tool output intent
  React.useEffect(() => {
    const intent = toolOutput?.intent || toolOutput?.structuredContent?.intent;
    if (intent) {
      switch (intent) {
        case "consultation":
        case "business_consultation":
          navigate("/consultation");
          break;
        case "personal_injury":
          navigate("/personal-injury");
          break;
        case "msa_draft":
          navigate("/msa");
          break;
        case "finalization":
          navigate("/finalization");
          break;
        case "payment":
          navigate("/payment");
          break;
      }
    }
  }, [toolOutput, navigate]);

  // Show loading state
  if (isLoading || isWaitingForBackend) {
    return (
      <div className="p-4">
        <TransitionScreen message="Connecting to Legal Assistant..." />
      </div>
    );
  }

  // Service selection menu
  return (
    <div className="p-4">
      <Card>
        <CardBody className="flex flex-col md:flex-row">
          {/* Header */}
          <div className="text-center w-[100%] md:w-[30%] align-middle items-center flex">
            <div className="flex justify-center items-center mb-3 w-full">
              <InhouseIcon />
            </div>
          </div>

          {/* Service selection buttons */}
          <div className="space-y-3 mt-4 w-[100%] md:w-[70%]">
            <p className="text-sm text-text-secondary-light text-center dark:text-text-secondary-dark mt-2">
              I can help you with legal queries. Choose an option:
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate("/consultation")}
                className="justify-start gap-3 py-6"
              >
                <BriefcaseIcon />
                <span>Business Consultation</span>
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate("/personal-injury")}
                className="justify-start gap-3 py-6"
              >
                <InjuryIcon />
                <span>Personal Injury Claim</span>
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate("/finalization")}
                className="justify-start gap-3 py-6"
              >
                <DocumentIcon />
                <span>Finalize Draft</span>
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
