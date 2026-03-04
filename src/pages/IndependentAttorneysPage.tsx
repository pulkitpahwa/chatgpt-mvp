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

const submitMessage = (email: string) =>
  `Overture will email you at ${email} within 24 hours to discuss your case`;

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
  costText: "$99 for 30 minute consult",
  turnAroundText: "You'll receive a call within 24 hours to discuss your case.",
  buttonText: "Connect with Overture",
  formTitle: "Connect with Overture",
  formSubtitle: "We’ll share your chat summary and contact",

  submitButtonText: "Submit",
  termsUrl: "https://www.inhouse.ai/terms-of-service",
  privacyUrl: "https://www.inhouse.ai/privacy-policy",
  formSubmitMessage: submitMessage,
};

export function IndependentAttorneysPage() {
  const { isLoading, isWaitingForBackend } = useAppContext();
  const [success, setSuccess] = useState(false);
  const [showMatchedScreen, setShowMatchedScreen] = useState(false);
  const [toolCallError, setToolCallError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

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
    state: string;
  }) => {
    const args = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      state: formData.state,
      context_id: reduxMatchData?.gpt_context_id || undefined,
    };
    setSuccessMessage(submitMessage(formData.email));

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
          "An error occurred while processing your request.",
      );
    }
  };

  // Success state
  if (success) {
    return <SuccessScreen description={successMessage} />;
  }

  // Show matched screen with form
  if (showMatchedScreen) {
    return (
      <div className="bg-white">
        <UnifiedMatchedScreen
          config={matchConfig}
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
