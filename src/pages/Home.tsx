import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { TransitionScreen } from "../components/TransitionScreen";
import { LegalAreaSelection } from "../components/LegalAreaSelection";

export function Home() {
  const navigate = useNavigate();
  const { toolOutput, isLoading, isWaitingForBackend } = useAppContext();

  // Check for intent from backend and auto-route if specific intent is detected
  React.useEffect(() => {
    const intent = toolOutput?.intent || toolOutput?.structuredContent?.intent;

    // Only auto-route if a specific intent is detected from the backend
    if (intent === "personal_injury") {
      navigate("/personal-injury", { replace: true });
    } else if (intent === "business_consultation") {
      navigate("/business-consultation", { replace: true });
    } else if (intent === "unsupported_area") {
      navigate("/not-available", { replace: true });
    }
    // Otherwise, show the selection screen
  }, [toolOutput, navigate]);

  // Show loading state while waiting for initial load
  if (isLoading || isWaitingForBackend) {
    return (
      <div className="">
        <TransitionScreen />
      </div>
    );
  }

  // Show legal area selection
  return <LegalAreaSelection />;
}
