import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
// import { TransitionScreen } from "../components/TransitionScreen";
// import { LegalAreaSelection } from "../components/LegalAreaSelection";

export function Home() {
  const navigate = useNavigate();
  const { toolOutput, isLoading, isWaitingForBackend } = useAppContext();

  const [message, setMessage] = React.useState<any | null>(null);
  const [modal_why_copy, setModalWhyCopy] = React.useState<any | null>(null);
  const [modal_next_steps_copy, setModalNextStepsCopy] = React.useState<
    any | null
  >(null);

  // Check for intent from backend and auto-route if specific intent is detected
  React.useEffect(() => {
    // const intent = toolOutput?.intent || toolOutput?.structuredContent?.intent;
    setMessage(toolOutput?.structuredContent?.message);
    setModalWhyCopy(toolOutput?.structuredContent?.modal_why_copy);
    setModalNextStepsCopy(toolOutput?.structuredContent?.modal_next_steps_copy);

    console.log(isLoading, isWaitingForBackend);
    console.log("Tool output:", JSON.stringify(toolOutput));

    setMessage(message || null);
    setModalWhyCopy(modal_why_copy || null);
    setModalNextStepsCopy(modal_next_steps_copy || null);
    // const message, modal_why_copy, modal_next_steps_copy ;

    // Only auto-route if a specific intent is detected from the backend
    // if (intent === "personal_injury") {
    //   navigate("/personal-injury", { replace: true });
    // } else if (intent === "business_consultation") {
    //   navigate("/business-consultation", { replace: true });
    // } else if (intent === "unsupported_area") {
    //   navigate("/not-available", { replace: true });
    // } else if (intent === "unsupported_location") {
    //   navigate("/unsupported-location", { replace: true });
    // }
    // Otherwise, show the selection screen
  }, [toolOutput, navigate]);

  return (
    <div className="">
      <p>message = {JSON.stringify(message)}</p>
      <p>modal_why_copy = {JSON.stringify(modal_why_copy)}</p>
      <p>modal_next_steps_copy = {JSON.stringify(modal_next_steps_copy)}</p>
    </div>
  );

  // Show loading state while waiting for initial load
  // if (isLoading || isWaitingForBackend) {
  //   return (
  //     <div className="">
  //       <TransitionScreen />
  //     </div>
  //   );
  // }

  // // Show legal area selection
  // return <LegalAreaSelection />;
}
