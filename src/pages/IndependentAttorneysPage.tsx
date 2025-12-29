import { useState, useEffect } from "react";
import { TransitionScreen } from "../components/TransitionScreen";
import {
  UnifiedMatchedScreen,
  MatchConfig,
} from "../components/UnifiedMatchedScreen";
import { SuccessScreen } from "../components/SuccessScreen";
import { useAppContext } from "../context/AppContext";
import {
  useRequestConsultation,
  requestDisplayMode,
  setWidgetState,
} from "../hooks/useToolCall";
import { useAppSelector } from "../store/hooks";
import OvertureLogo from "../../public/overture.png";

const matchConfig: MatchConfig = {
  logo: (
    <img
      src={OvertureLogo}
      alt="Overture Logo"
      style={{ maxWidth: "84px", maxHeight: "52px" }}
    />
  ),
  firmName: "Overture",
  firmSubtitle: "A referral network of 6,000 independent attorneys",
  matchText:
    "An independent attorney with relevant experience has been matched to your case.",
  costText: "Consultation fees vary by attorney",
  turnAroundText: "You'll receive a call within 24 hours to discuss your case.",
  buttonText: "Share Chat with Overture",
  formTitle: "Connect with Overture",
  formSubtitle:
    "Your chat summary will be shared along with the form submission",
  submitButtonText: "Submit",
  termsUrl: "https://www.inhouse.ai/terms-of-service",
  privacyUrl: "https://www.inhouse.ai/privacy-policy",
};

export function IndependentAttorneysPage() {
  const { isLoading, isWaitingForBackend } = useAppContext();
  const [success, setSuccess] = useState(false);
  const [showMatchedScreen, setShowMatchedScreen] = useState(false);
  const [toolCallError, setToolCallError] = useState<string | null>(null);

  const { loading, callTool } = useRequestConsultation();
  const reduxMatchData = useAppSelector((state) => state.match);

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
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      context_id: reduxMatchData?.gpt_context_id || undefined,
    };

    const result = await callTool(args);

    // Check for successful response using structuredContent
    const isSuccess = result?.structuredContent?.status === "success";

    if (isSuccess) {
      setSuccess(true);
      setShowMatchedScreen(false);

      // Extract requestId from structuredContent
      const requestId = result.structuredContent?.requestId;

      setWidgetState({
        consultationRequested: true,
        requestId,
        partnerFirm: "other",
      });

      // Switch to inline mode for success view
      requestDisplayMode("inline");
    } else if (result?.structuredContent?.status === "error") {
      console.error("Tool call failed:", result.structuredContent);
      setToolCallError(
        result.structuredContent?.message ||
          "An error occurred while processing your request."
      );
    }
  };

  // Success state
  if (success) {
    return (
      <SuccessScreen description="An independent attorney will call you within 24 hours to discuss your case" />
    );
  }

  // Show matched screen with form
  if (showMatchedScreen) {
    const newConfig = {
      ...matchConfig,
      matchText: reduxMatchData?.why_copy || matchConfig.matchText,
    };
    return (
      <div className="bg-white">
        <UnifiedMatchedScreen
          config={newConfig}
          onSubmit={handleSubmit}
          loading={loading}
          error={toolCallError ? new Error(toolCallError) : null}
        />
      </div>
    );
  }

  // Fallback loading state
  return (
    <div className="p-4 bg-white">
      <TransitionScreen />
    </div>
  );
}
