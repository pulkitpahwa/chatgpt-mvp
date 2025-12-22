import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Alert } from "@openai/apps-sdk-ui/components/Alert";
import { TransitionScreen } from "../components/TransitionScreen";
import { BusinessMatchedScreen } from "../components/BusinessMatchedScreen";
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

export function BusinessConsultationPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [showMatchedScreen, setShowMatchedScreen] = useState(false);

  const { loading, error, callTool } = useRequestConsultation();

  // Show the matched screen immediately for business consultation
  useEffect(() => {
    if (!success) {
      setShowMatchedScreen(true);
    }
  }, [success]);

  const handleSubmit = async (formData: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  }) => {
    const args = {
      consultation_type: "business_consultation",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      description: formData.notes || undefined,
    };

    const result = await callTool(args);
    console.log("Business consultation request result:");
    console.log(JSON.stringify(result, null, 2));

    // Check for successful response using structuredContent
    const isSuccess = result?.structuredContent?.status === "complete";

    if (isSuccess) {
      setSuccess(true);
      setShowMatchedScreen(false);

      // Extract requestId from structuredContent
      const requestId = result.structuredContent?.requestId;

      setWidgetState({
        consultationRequested: true,
        requestId,
        partnerFirm: "business_legal",
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
                A business attorney will contact you soon
              </p>
            </div>
          </div>

          <Alert
            color="success"
            className="mb-4"
            description="Your business consultation request has been submitted. An experienced attorney will reach out within 24 hours."
          />

          <div className="p-4 bg-background-tertiary rounded-lg mb-4">
            <h3 className="font-medium text-foreground-primary mb-3">
              What happens next?
            </h3>
            <ul className="text-sm text-foreground-secondary space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-medium shrink-0">1.</span>
                <span>
                  A business law attorney reviews your chat and details
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-medium shrink-0">2.</span>
                <span>
                  They'll call you within 24 hours to discuss your matter
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-medium shrink-0">3.</span>
                <span>
                  Get expert guidance tailored to your business needs
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

  // Show Business matched screen with form
  if (showMatchedScreen) {
    return (
      <BusinessMatchedScreen
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
