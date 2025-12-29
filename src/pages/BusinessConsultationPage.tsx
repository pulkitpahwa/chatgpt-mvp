import { useState, useEffect } from "react";
import { TransitionScreen } from "../components/TransitionScreen";
import {
  UnifiedMatchedScreen,
  MatchConfig,
} from "../components/UnifiedMatchedScreen";
import { SuccessScreen } from "../components/SuccessScreen";
import {
  useRequestConsultation,
  requestDisplayMode,
  setWidgetState,
} from "../hooks/useToolCall";
import { useAppSelector } from "../store/hooks";
import InhouseLogo from "../../public/inhouse-mini.png";

const matchConfig: MatchConfig = {
  logo: (
    <img
      src={InhouseLogo}
      alt="Inhouse Counsel Logo"
      style={{ maxWidth: "40px", maxHeight: "40px" }}
    />
  ),
  firmName: "Inhouse Counsel PC",
  firmSubtitle: "A business law firm",
  matchText:
    "Inhouse Counsel PC has experience with business legal matters like yours.",
  costText: "$99 for 30 minute consult",
  turnAroundText:
    "You'll receive an email within 24 hours to pay and schedule your call.",
  buttonText: "Share Chat with Inhouse Counsel",
  formTitle: "Connect with Inhouse Counsel",
  formSubtitle:
    "Your chat summary will be shared along with the form submission",
  submitButtonText: "Submit",
  termsUrl: "https://www.inhouse.ai/terms-of-service",
  privacyUrl: "https://www.inhouse.ai/privacy-policy",
};

export function BusinessConsultationPage() {
  const [success, setSuccess] = useState(false);
  const [showMatchedScreen, setShowMatchedScreen] = useState(false);
  const [toolCallError, setToolCallError] = useState<string | null>(null);

  const reduxMatchData = useAppSelector((state) => state.match);

  const { loading, callTool } = useRequestConsultation();

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
        partnerFirm: "business_legal",
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
      <SuccessScreen description="A business attorney will call you within 24 hours to discuss your matter" />
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
