import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { TransitionScreen } from "../components/TransitionScreen";

export function Home() {
  const navigate = useNavigate();
  const { toolOutput, isLoading, isWaitingForBackend } = useAppContext();

  // Auto-route to personal injury page
  // This app is focused exclusively on personal injury cases with Morgan & Morgan
  React.useEffect(() => {
    const intent = toolOutput?.intent || toolOutput?.structuredContent?.intent;

    // If we have any intent or if loading is complete, route to personal injury
    if (intent === "personal_injury" || (!isLoading && !isWaitingForBackend)) {
      navigate("/personal-injury", { replace: true });
    }
  }, [toolOutput, isLoading, isWaitingForBackend, navigate]);

  // Show loading state with rotating messages while waiting
  return (
    <div className="p-4">
      <TransitionScreen />
    </div>
  );
}
