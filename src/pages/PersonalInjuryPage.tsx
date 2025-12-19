import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Alert } from "@openai/apps-sdk-ui/components/Alert";
import { TransitionScreen } from "../components/TransitionScreen";
import { MorganMatchedScreen } from "../components/MorganMatchedScreen";
import { useAppContext } from "../context/AppContext";
import {
  useRequestConsultation,
  requestDisplayMode,
  setWidgetState,
} from "../hooks/useToolCall";

// Check icon component
const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-green-600 dark:text-green-400"
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
    console.log("Morgan & Morgan consultation request result:");
    console.log(JSON.stringify(result, null, 2));

    // Check for successful response using structuredContent
    const isSuccess = result?.structuredContent?.status === "complete";
    alert(isSuccess);

    if (isSuccess) {
      setSuccess(true);
      setShowMatchedScreen(false);

      // Extract requestId from structuredContent
      const requestId = result.structuredContent?.requestId;
      alert(`success:true, showmatchedscreen: false, requestId: ${requestId}`);

      setWidgetState({
        consultationRequested: true,
        requestId,
        partnerFirm: "morgan_morgan",
      });

      // Switch to inline mode for success view
      requestDisplayMode("inline");
    }
  };

  // Success state
  if (success) {
    return (
      <div className="p-4 max-h-[480px] overflow-y-auto">
        <div className="bg-background-secondary rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckIcon />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground-primary">
                Request Submitted
              </h2>
              <p className="text-sm text-foreground-secondary">
                Morgan & Morgan will contact you soon
              </p>
            </div>
          </div>

          <Alert
            color="success"
            className="mb-4"
            description="Your information has been sent to Morgan & Morgan. A local lawyer will reach out within 24 hours."
          />

          <div className="p-4 bg-background-tertiary rounded-lg mb-4">
            <h3 className="font-medium text-foreground-primary mb-3">
              What happens next?
            </h3>
            <ul className="text-sm text-foreground-secondary space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-medium shrink-0">1.</span>
                <span>
                  A lawyer from Morgan & Morgan reviews your chat and details
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-medium shrink-0">2.</span>
                <span>
                  They'll call you within 24 hours to discuss your case
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-medium shrink-0">3.</span>
                <span>
                  If they accept your case, you pay nothing unless you win
                </span>
              </li>
            </ul>
          </div>

          <Button color="secondary" onClick={() => navigate("/")} block>
            Done
          </Button>
        </div>
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
