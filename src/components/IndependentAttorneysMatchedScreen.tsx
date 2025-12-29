import { MatchedScreen, MatchInfo, FormData } from "./MatchedScreen";

const defaultMatchInfo: MatchInfo = {
  who: "Independent attorneys specializing in various legal matters with personalized service",
  why: "Your legal needs require specialized attention, and independent attorneys can provide dedicated, personalized representation",
  nextSteps:
    "An independent attorney matching your needs will review your case and reach out within 24 hours. Many offer free initial consultations.",
};

const labels = {
  title: "You've been matched",
  firmName: "Independent Attorney",
  whoLabel: "Attorney:",
  whyLabel: "Relevant experience:",
  nextStepsLabel: "What's next:",
  connectButtonText: "Connect with an Independent Attorney",
  formTitle: "Connect with an Independent Attorney",
  formSubtitle:
    "Your chat summary will be shared along with the form submission",
  submitButtonText: "Submit",
  termsUrl: "#",
  privacyUrl: "#",
};

interface IndependentAttorneysMatchedScreenProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  error?: Error | null;
  matchInfo?: MatchInfo;
}

export function IndependentAttorneysMatchedScreen({
  onSubmit,
  loading = false,
  error = null,
  matchInfo,
}: IndependentAttorneysMatchedScreenProps) {
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
