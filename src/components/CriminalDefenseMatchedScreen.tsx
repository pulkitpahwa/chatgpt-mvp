import { MatchedScreen, MatchInfo, FormData } from "./MatchedScreen";

const defaultMatchInfo: MatchInfo = {
  who: "A trusted criminal defense attorney network with experienced lawyers across all 50 states",
  why: "Your situation involves criminal defense matters, and our network includes attorneys with strong experience in cases like yours",
  nextSteps:
    "A qualified criminal defense attorney will review your case and contact you within 24 hours to discuss your options. Initial consultations are typically free.",
};

const labels = {
  title: "You've been matched",
  firmName: "Criminal Defense Network",
  whoLabel: "Attorney Network:",
  whyLabel: "Relevant experience:",
  nextStepsLabel: "What's next:",
  connectButtonText: "Connect with a Criminal Defense Attorney",
  formTitle: "Connect with a Criminal Defense Attorney",
  formSubtitle:
    "Your chat summary will be shared along with the form submission",
  submitButtonText: "Submit",
  termsUrl: "#",
  privacyUrl: "#",
};

interface CriminalDefenseMatchedScreenProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  error?: Error | null;
  matchInfo?: MatchInfo;
}

export function CriminalDefenseMatchedScreen({
  onSubmit,
  loading = false,
  error = null,
  matchInfo,
}: CriminalDefenseMatchedScreenProps) {
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
