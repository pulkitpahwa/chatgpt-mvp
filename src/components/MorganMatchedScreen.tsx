import { MatchedScreen, MatchInfo, FormData } from "./MatchedScreen";

const defaultMatchInfo: MatchInfo = {
  who: "Morgan & Morgan, a national law firm of 1,000 PI attorneys in all 50 states",
  why: "Your chat describes a plane accident at the runway at JFK, and this firm has a strong aviation practice in NY",
  nextSteps:
    "The NY office will review your chat and call you within 24 hours to discuss your case. If they take it, you pay only if they win.",
};

const labels = {
  firmName: "Morgan & Morgan",
  whoLabel: "Law Firm:",
  whyLabel: "Relevant experience:",
  nextStepsLabel: "What's next:",
  connectButtonText: "Connect with Morgan & Morgan",
  formTitle: "Connect with Morgan & Morgan",
  formSubtitle: "Your chat summary will be shared along with the form submission",
  submitButtonText: "Submit",
  termsUrl: "https://www.forthepeople.com/terms-of-use/",
  privacyUrl: "https://www.forthepeople.com/privacy-policy/",
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
