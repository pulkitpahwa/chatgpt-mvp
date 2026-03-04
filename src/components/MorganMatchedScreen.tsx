import { MatchedScreen, MatchInfo, FormData } from "./MatchedScreen";

const defaultMatchInfo: MatchInfo = {
  who: "L&F Brown, a top personal injury firm",
  why: "Your chat describes a plane accident at the runway at JFK, and this firm has a strong aviation practice in NY",
  nextSteps:
    "The NY office will review your chat and call you within 24 hours to discuss your case. If they take it, you pay only if they win.",
};

const labels = {
  title: "You've been matched",
  firmName: "L&F Brown",
  whoLabel: "Law Firm:",
  whyLabel: "Relevant experience:",
  nextStepsLabel: "What's next:",
  connectButtonText: "Connect with L&F Brown",
  formTitle: "Connect with L&F Brown",
  formSubtitle:
    "Your chat summary will be shared along with the form submission",
  submitButtonText: "Submit",
  termsUrl: "https://www.inhouse.ai/terms-of-service",
  privacyUrl: "https://www.inhouse.ai/privacy-policy",
};

interface MorganMatchedScreenProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  error?: Error | null;
  matchInfo?: MatchInfo;
}

export function MorganMatchedScreen({
  onSubmit,
  loading = false,
  error = null,
  matchInfo,
}: MorganMatchedScreenProps) {
  return (
    <MatchedScreen
      onSubmit={onSubmit}
      loading={loading}
      error={error}
      matchInfo={matchInfo}
      defaultMatchInfo={defaultMatchInfo}
      labels={labels}
    />
  );
}
