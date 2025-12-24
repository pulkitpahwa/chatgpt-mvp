import { useState, useEffect } from "react";
import { TransitionScreen } from "../components/TransitionScreen";
import { BusinessMatchedScreen } from "../components/BusinessMatchedScreen";
import { SuccessScreen } from "../components/SuccessScreen";
import {
  useRequestConsultation,
  requestDisplayMode,
  setWidgetState,
} from "../hooks/useToolCall";
import { useAppSelector } from "../store/hooks";

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

  // Show Business matched screen with form
  if (showMatchedScreen) {
    return (
      <div className="bg-white">
        <BusinessMatchedScreen
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
