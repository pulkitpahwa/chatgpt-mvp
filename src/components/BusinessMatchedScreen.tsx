import { MatchedScreen, MatchInfo, FormData } from "./MatchedScreen";

const defaultMatchInfo: MatchInfo = {
  who: "Inhouse Counsel, P.C. a national business law firm connected to over 2,000 subject matter experts in business law",
  why: "You drafted a terms of service which is a commercial contract that they have significant experience in",
  nextSteps:
    "They will review your chat and Terms of Service draft and email you to coordinate a time for a video call. You'll pay $99 for 30 minutes of the lawyer's time.",
};

const labels = {
  firmName: "Inhouse Counsel",
  whoLabel: "Who:",
  whyLabel: "Why:",
  nextStepsLabel: "Next steps:",
  connectButtonText: "Connect with Inhouse Counsel, P.C.",
  formTitle: "Connect with Inhouse Counsel",
  formSubtitle: "Your chat summary will be shared along with the form submission",
  submitButtonText: "Submit",
  termsUrl: "https://www.inhouse.ai/terms-of-service",
  privacyUrl: "https://www.inhouse.ai/privacy-policy",
};

interface BusinessMatchedScreenProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  error?: Error | null;
  matchInfo?: MatchInfo;
}

export function BusinessMatchedScreen({
  onSubmit,
  loading = false,
  error = null,
  matchInfo,
}: BusinessMatchedScreenProps) {
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
