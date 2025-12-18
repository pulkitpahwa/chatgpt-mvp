import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "../components/Card";
import { Button } from "../components/Button";
import { TransitionScreen } from "../components/TransitionScreen";
import { MorganMatchedScreen } from "../components/MorganMatchedScreen";
import { StatusBanner } from "../components/WidgetContainer";
import { useAppContext } from "../context/AppContext";
import {
  useRequestConsultation,
  requestDisplayMode,
  setWidgetState,
} from "../hooks/useToolCall";

const CheckIcon = () => (
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

export function PersonalInjuryPage() {
  const navigate = useNavigate();
  const { isLoading, isWaitingForBackend } = useAppContext();
  const [success, setSuccess] = useState(false);
  const [showMatchedScreen, setShowMatchedScreen] = useState(false);

  const { loading, error, callTool } = useRequestConsultation();

  // Once backend responds, show the matched screen
  useEffect(() => {
    if (!isLoading && !isWaitingForBackend && !success) {
      setShowMatchedScreen(true);
    }
  }, [isLoading, isWaitingForBackend, success]);

  // Show loading state with rotating messages
  if (isLoading || isWaitingForBackend) {
    return (
      <div className="p-4">
        <TransitionScreen />
      </div>
    );
  }

  const handleSubmit = async (formData: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  }) => {
    const args = {
      consultation_type: "personal_injury",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      description: formData.notes || undefined,
    };

    const result = await callTool(args);

    if (result?.success) {
      setSuccess(true);
      setShowMatchedScreen(false);
      setWidgetState({
        consultationRequested: true,
        requestId: result.requestId,
        partnerFirm: "morgan_morgan",
      });

      // Switch to inline mode for success view
      requestDisplayMode("inline");
    }
  };

  // Success state
  if (success) {
    return (
      <div className="p-4 max-h-[400px] overflow-y-auto">
        <Card>
          <CardHeader
            icon={<CheckIcon />}
            title="Request Submitted"
            subtitle="Morgan & Morgan will contact you soon"
          />
          <CardBody>
            <StatusBanner
              type="success"
              message="Your information has been sent to Morgan & Morgan. A local lawyer will reach out within 24 hours."
            />
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                What happens next?
              </h3>
              <ul className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-medium">1.</span>A lawyer
                  from Morgan & Morgan reviews your chat and details
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-medium">2.</span>
                  They'll call you within 24 hours to discuss your case
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-medium">3.</span>
                  If they accept your case, you pay nothing unless you win
                </li>
              </ul>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Done
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show Morgan matched screen with form
  if (showMatchedScreen) {
    return (
      <MorganMatchedScreen
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    );
  }

  // Fallback loading state
  return (
    <div className="p-4">
      <TransitionScreen />
    </div>
  );
}
