import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { TransitionScreen } from "../components/TransitionScreen";
import { LegalAreaSelection } from "../components/LegalAreaSelection";
import { useAppDispatch } from "../store/hooks";
import { setMatchData } from "../store/matchSlice";

export function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toolOutput, isLoading, isWaitingForBackend } = useAppContext();

  const [message, setMessage] = React.useState<any | null>(null);
  const [modal_why_copy, setModalWhyCopy] = React.useState<any | null>(null);
  const [modal_next_steps_copy, setModalNextStepsCopy] = React.useState<
    any | null
  >(null);

  // Check for intent from backend and auto-route if specific intent is detected
  React.useEffect(() => {
    const intent =
      toolOutput?.match_category ||
      toolOutput?.structuredContent?.match_category;
    const matchStatus =
      toolOutput?.structuredContent?.match_status || toolOutput?.match_status;
    setMessage(toolOutput?.structuredContent?.message);
    setModalWhyCopy(toolOutput?.structuredContent?.modal_why_copy);
    setModalNextStepsCopy(toolOutput?.structuredContent?.modal_next_steps_copy);

    var a = {
      match_category: "other",
      match_status: "match_not_found",
      content: null,
      structuredContent: {
        message:
          "We appreciate your interest in our legal services. Currently, we serve only personal injury and business consultation cases in the USA. We still welcome you to submit your details and we will try to find a lawyer for you and reach out in 5 business days if we can find a matching lawyer",
        context_id: "694bf786b0e645a244fc6528",
      },
    };

    dispatch(
      setMatchData({
        why_copy: String(
          toolOutput?.structuredContent?.modal_why_copy ?? "..."
        ),
        gpt_context_id: String(
          toolOutput?.structuredContent?.context_id ?? "..."
        ),
        message_copy: String(toolOutput?.structuredContent?.message ?? ""),
        nextsteps_copy: String(
          toolOutput?.structuredContent?.modal_next_steps_copy ?? ""
        ),
        match_status:
          (toolOutput?.structuredContent?.match_status as
            | "pending"
            | "matched"
            | "not_matched"
            | "error"
            | null) ?? "pending",
      })
    );

    setMessage(message || null);
    setModalWhyCopy(modal_why_copy || null);
    setModalNextStepsCopy(modal_next_steps_copy || null);
    // const message, modal_why_copy, modal_next_steps_copy ;

    // Only auto-route if a specific intent is detected from the backend
    if (matchStatus === "need_more_info") {
      console.log("Navigating to more-info page");
    } else if (intent === "personal_injury") {
      navigate("/personal-injury", { replace: true });
    } else if (intent === "business_consultation") {
      navigate("/business-consultation", { replace: true });
    } else if (intent === "other") {
      navigate("/not-available", { replace: true });
    } else if (intent === "unsupported_location") {
      navigate("/unsupported-location", { replace: true });
    }
    // Otherwise, show the selection screen
  }, [toolOutput, navigate]);

  // Show loading state while waiting for initial load
  if (isLoading || isWaitingForBackend) {
    return (
      <div className="bg-white">
        <TransitionScreen />
      </div>
    );
  }

  // // Show legal area selection
  return <LegalAreaSelection />;
}
