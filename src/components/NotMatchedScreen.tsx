import { MatchedScreen, MatchInfo, FormData } from "./MatchedScreen";

const defaultMatchInfo: MatchInfo = {
  who: "No lawyers were found in our network",
  why: "You drafted a terms of service which is a commercial contract that they have significant experience in",
  nextSteps:
    "Submit your contact information and we’ll reach out if we can find somebody within 5 business days",
};

const labels = {
  title: "No Match Found",
  firmName: "Inhouse Counsel",
  whoLabel: "Who:",
  whyLabel: "Why:",
  nextStepsLabel: "Next steps:",
  connectButtonText: "Share Contact Details",
  formTitle: "Submit Contact Details",
  formSubtitle:
    "Share your information and we can reach out when we find somebody.",
  submitButtonText: "Submit",
  termsUrl: "https://www.inhouse.ai/terms-of-service",
  privacyUrl: "https://www.inhouse.ai/privacy-policy",
};

interface NotMatchedScreenProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  error?: Error | null;
  matchInfo?: MatchInfo;
}

export function NotMatchedScreen({
  onSubmit,
  loading = false,
  error = null,
  matchInfo,
}: NotMatchedScreenProps) {
  const details = { ...defaultMatchInfo };
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
